import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { FaUsers, FaUserCheck, FaUserTimes, FaUserShield, FaUserPlus } from "react-icons/fa"

import { type UserPublic, UsersService } from "@/client"
import AddUser from "@/components/Admin/AddUser"
import { UserActionsMenu } from "@/components/Common/UserActionsMenu"
import PendingUsers from "@/components/Pending/PendingUsers"
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  Heading,
  Input,
  Select,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react"
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "@/components/ui/pagination"

const PER_PAGE = 10

function getUsersQueryOptions({ page, search, status, role }: { 
  page: number
  search?: string
  status?: string
  role?: string
}) {
  return {
    queryFn: () =>
      UsersService.readUsers({ 
        skip: (page - 1) * PER_PAGE, 
        limit: PER_PAGE 
      }),
    queryKey: ["users", { page, search, status, role }],
  }
}

function getStatsQueryOptions() {
  return {
    queryFn: () => UsersService.getUserStats(),
    queryKey: ["userStats"],
  }
}

function StatsCard({ title, value, icon, color }: {
  title: string
  value: number
  icon: React.ReactNode
  color: string
}) {
  return (
    <Card>
      <CardBody>
        <Flex align="center" justify="space-between">
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color="gray.500">
              {title}
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              {value}
            </Text>
          </VStack>
          <Box color={color} fontSize="2xl">
            {icon}
          </Box>
        </Flex>
      </CardBody>
    </Card>
  )
}

function UsersTable() {
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<UserPublic>(["currentUser"])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("")

  const { data, isLoading, isPlaceholderData } = useQuery({
    ...getUsersQueryOptions({ page, search, status: statusFilter, role: roleFilter }),
    placeholderData: (prevData) => prevData,
  })

  const { data: stats } = useQuery(getStatsQueryOptions())

  const users = data?.data.slice(0, PER_PAGE) ?? []
  const count = data?.count ?? 0

  if (isLoading) {
    return <PendingUsers />
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Statistics Cards */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(5, 1fr)" }} gap={4}>
        <StatsCard
          title="Total Users"
          value={stats?.total_users ?? 0}
          icon={<FaUsers />}
          color="blue.500"
        />
        <StatsCard
          title="Active Users"
          value={stats?.active_users ?? 0}
          icon={<FaUserCheck />}
          color="green.500"
        />
        <StatsCard
          title="Inactive Users"
          value={stats?.inactive_users ?? 0}
          icon={<FaUserTimes />}
          color="red.500"
        />
        <StatsCard
          title="Superusers"
          value={stats?.superusers ?? 0}
          icon={<FaUserShield />}
          color="purple.500"
        />
        <StatsCard
          title="New This Month"
          value={stats?.users_created_this_month ?? 0}
          icon={<FaUserPlus />}
          color="orange.500"
        />
      </Grid>

      {/* Filters and Actions */}
      <Flex gap={4} wrap="wrap" align="center">
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          maxW="300px"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          maxW="150px"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          maxW="150px"
        >
          <option value="">All Roles</option>
          <option value="superuser">Superuser</option>
          <option value="user">User</option>
        </Select>
        <AddUser />
      </Flex>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <Heading size="md">Users</Heading>
        </CardHeader>
        <CardBody>
          <Table.Root size={{ base: "sm", md: "md" }}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Full Name</Table.ColumnHeader>
                <Table.ColumnHeader>Email</Table.ColumnHeader>
                <Table.ColumnHeader>Role</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Created</Table.ColumnHeader>
                <Table.ColumnHeader>Last Login</Table.ColumnHeader>
                <Table.ColumnHeader>Actions</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users?.map((user) => (
                <Table.Row key={user.id} opacity={isPlaceholderData ? 0.5 : 1}>
                  <Table.Cell>
                    <Flex align="center" gap={2}>
                      <Text color={!user.full_name ? "gray" : "inherit"}>
                        {user.full_name || "N/A"}
                      </Text>
                      {currentUser?.id === user.id && (
                        <Badge colorScheme="teal" size="sm">
                          You
                        </Badge>
                      )}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" color="gray.600">
                      {user.email}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorScheme={user.is_superuser ? "purple" : "gray"}
                      size="sm"
                    >
                      {user.is_superuser ? "Superuser" : "User"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorScheme={user.is_active ? "green" : "red"}
                      size="sm"
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" color="gray.600">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Text fontSize="sm" color="gray.600">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <UserActionsMenu
                      user={user}
                      disabled={currentUser?.id === user.id}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </CardBody>
      </Card>

      {/* Pagination */}
      <Flex justifyContent="flex-end">
        <PaginationRoot
          count={count}
          pageSize={PER_PAGE}
          onPageChange={({ page }) => setPage(page)}
        >
          <Flex>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </Flex>
        </PaginationRoot>
      </Flex>
    </VStack>
  )
}

export default function UserManagementDashboard() {
  return <UsersTable />
}
