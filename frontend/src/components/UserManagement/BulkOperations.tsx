import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { FaUsers, FaTrash, FaCheck, FaTimes } from "react-icons/fa"

import { type UserPublic, UsersService } from "@/client"
import type { ApiError } from "@/client/core/ApiError"
import useCustomToast from "@/hooks/useCustomToast"
import { handleError } from "@/utils"
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Flex,
  Heading,
  Select,
  Table,
  Text,
  VStack,
} from "@chakra-ui/react"
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const PER_PAGE = 20

function getUsersQueryOptions({ page }: { page: number }) {
  return {
    queryFn: () =>
      UsersService.readUsers({ skip: (page - 1) * PER_PAGE, limit: PER_PAGE }),
    queryKey: ["users", { page }],
  }
}

function BulkOperationsDialog({ 
  selectedUsers, 
  operation, 
  onSuccess 
}: { 
  selectedUsers: UserPublic[]
  operation: 'activate' | 'deactivate' | 'make-superuser' | 'remove-superuser' | 'delete'
  onSuccess: () => void
}) {
  const [isOpen, setIsOpen] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccessToast } = useCustomToast()

  const getOperationConfig = () => {
    switch (operation) {
      case 'activate':
        return {
          title: 'Activate Users',
          message: `Are you sure you want to activate ${selectedUsers.length} user(s)?`,
          icon: <FaCheck />,
          color: 'green',
          action: () => UsersService.bulkUpdateUsers({
            requestBody: {
              user_ids: selectedUsers.map(u => u.id),
              is_active: true
            }
          })
        }
      case 'deactivate':
        return {
          title: 'Deactivate Users',
          message: `Are you sure you want to deactivate ${selectedUsers.length} user(s)?`,
          icon: <FaTimes />,
          color: 'red',
          action: () => UsersService.bulkUpdateUsers({
            requestBody: {
              user_ids: selectedUsers.map(u => u.id),
              is_active: false
            }
          })
        }
      case 'make-superuser':
        return {
          title: 'Make Superusers',
          message: `Are you sure you want to make ${selectedUsers.length} user(s) superuser(s)?`,
          icon: <FaUsers />,
          color: 'purple',
          action: () => UsersService.bulkUpdateUsers({
            requestBody: {
              user_ids: selectedUsers.map(u => u.id),
              is_superuser: true
            }
          })
        }
      case 'remove-superuser':
        return {
          title: 'Remove Superuser Status',
          message: `Are you sure you want to remove superuser status from ${selectedUsers.length} user(s)?`,
          icon: <FaUsers />,
          color: 'orange',
          action: () => UsersService.bulkUpdateUsers({
            requestBody: {
              user_ids: selectedUsers.map(u => u.id),
              is_superuser: false
            }
          })
        }
      case 'delete':
        return {
          title: 'Delete Users',
          message: `Are you sure you want to permanently delete ${selectedUsers.length} user(s)? This action cannot be undone.`,
          icon: <FaTrash />,
          color: 'red',
          action: () => UsersService.bulkDeleteUsers({
            requestBody: {
              user_ids: selectedUsers.map(u => u.id)
            }
          })
        }
    }
  }

  const config = getOperationConfig()

  const mutation = useMutation({
    mutationFn: config.action,
    onSuccess: () => {
      showSuccessToast(`${config.title} completed successfully.`)
      setIsOpen(false)
      onSuccess()
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  return (
    <DialogRoot
      size={{ base: "xs", md: "md" }}
      placement="center"
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button
          colorScheme={config.color as any}
          leftIcon={config.icon}
          disabled={selectedUsers.length === 0}
        >
          {config.title}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <VStack spacing={4} align="stretch">
            <Text>{config.message}</Text>
            <Text fontSize="sm" color="gray.600">
              Selected users:
            </Text>
            <VStack align="start" spacing={2} maxH="200px" overflowY="auto">
              {selectedUsers.map((user) => (
                <Text key={user.id} fontSize="sm">
                  • {user.full_name || 'N/A'} ({user.email})
                </Text>
              ))}
            </VStack>
          </VStack>
        </DialogBody>
        <DialogFooter gap={2}>
          <DialogActionTrigger asChild>
            <Button
              variant="subtle"
              colorPalette="gray"
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button
            colorScheme={config.color as any}
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
          >
            Confirm
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}

export default function BulkOperations() {
  const [page, setPage] = useState(1)
  const [selectedUsers, setSelectedUsers] = useState<UserPublic[]>([])
  const [selectAll, setSelectAll] = useState(false)

  const { data, isLoading } = useQuery({
    ...getUsersQueryOptions({ page }),
    placeholderData: (prevData) => prevData,
  })

  const users = data?.data.slice(0, PER_PAGE) ?? []

  const handleSelectUser = (user: UserPublic, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, user])
    } else {
      setSelectedUsers(prev => prev.filter(u => u.id !== user.id))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)
    if (checked) {
      setSelectedUsers(users)
    } else {
      setSelectedUsers([])
    }
  }

  const handleSuccess = () => {
    setSelectedUsers([])
    setSelectAll(false)
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Bulk Actions */}
      <Card>
        <CardHeader>
          <Heading size="md">Bulk Operations</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <Text>
              Select users below to perform bulk operations. You can select individual users or use "Select All".
            </Text>
            
            <Flex gap={2} wrap="wrap">
              <BulkOperationsDialog
                selectedUsers={selectedUsers}
                operation="activate"
                onSuccess={handleSuccess}
              />
              <BulkOperationsDialog
                selectedUsers={selectedUsers}
                operation="deactivate"
                onSuccess={handleSuccess}
              />
              <BulkOperationsDialog
                selectedUsers={selectedUsers}
                operation="make-superuser"
                onSuccess={handleSuccess}
              />
              <BulkOperationsDialog
                selectedUsers={selectedUsers}
                operation="remove-superuser"
                onSuccess={handleSuccess}
              />
              <BulkOperationsDialog
                selectedUsers={selectedUsers}
                operation="delete"
                onSuccess={handleSuccess}
              />
            </Flex>

            {selectedUsers.length > 0 && (
              <Badge colorScheme="blue" p={2}>
                {selectedUsers.length} user(s) selected
              </Badge>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <Heading size="md">Users</Heading>
        </CardHeader>
        <CardBody>
          <Table.Root size={{ base: "sm", md: "md" }}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader w="50px">
                  <Checkbox
                    checked={selectAll}
                    onCheckedChange={({ checked }) => handleSelectAll(checked)}
                  />
                </Table.ColumnHeader>
                <Table.ColumnHeader>Full Name</Table.ColumnHeader>
                <Table.ColumnHeader>Email</Table.ColumnHeader>
                <Table.ColumnHeader>Role</Table.ColumnHeader>
                <Table.ColumnHeader>Status</Table.ColumnHeader>
                <Table.ColumnHeader>Created</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {users?.map((user) => (
                <Table.Row key={user.id}>
                  <Table.Cell>
                    <Checkbox
                      checked={selectedUsers.some(u => u.id === user.id)}
                      onCheckedChange={({ checked }) => handleSelectUser(user, checked)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    <Text color={!user.full_name ? "gray" : "inherit"}>
                      {user.full_name || "N/A"}
                    </Text>
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
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </CardBody>
      </Card>
    </VStack>
  )
}
