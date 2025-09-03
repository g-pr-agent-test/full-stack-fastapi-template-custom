import { useQuery } from "@tanstack/react-query"
import { FaChartLine, FaChartBar, FaChartPie, FaCalendarAlt } from "react-icons/fa"

import { UsersService } from "@/client"
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react"

function getStatsQueryOptions() {
  return {
    queryFn: () => UsersService.getUserStats(),
    queryKey: ["userStats"],
  }
}

function AnalyticsCard({ title, value, subtitle, icon, color }: {
  title: string
  value: string | number
  subtitle?: string
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
            {subtitle && (
              <Text fontSize="xs" color="gray.400">
                {subtitle}
              </Text>
            )}
          </VStack>
          <Box color={color} fontSize="2xl">
            {icon}
          </Box>
        </Flex>
      </CardBody>
    </Card>
  )
}

function ChartPlaceholder({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardHeader>
        <Heading size="md">{title}</Heading>
      </CardHeader>
      <CardBody>
        <VStack spacing={4} align="center" py={8}>
          <Box fontSize="4xl" color="gray.300">
            <FaChartBar />
          </Box>
          <Text color="gray.500" textAlign="center">
            {description}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default function UserAnalytics() {
  const { data: stats, isLoading } = useQuery(getStatsQueryOptions())

  if (isLoading) {
    return (
      <VStack spacing={6} align="stretch">
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardBody>
                <Flex align="center" justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Box bg="gray.200" h="4" w="20" borderRadius="md" />
                    <Box bg="gray.200" h="8" w="16" borderRadius="md" />
                  </VStack>
                  <Box bg="gray.200" h="8" w="8" borderRadius="md" />
                </Flex>
              </CardBody>
            </Card>
          ))}
        </Grid>
      </VStack>
    )
  }

  const totalUsers = stats?.total_users ?? 0
  const activeUsers = stats?.active_users ?? 0
  const inactiveUsers = stats?.inactive_users ?? 0
  const superusers = stats?.superusers ?? 0
  const newThisMonth = stats?.users_created_this_month ?? 0

  const activePercentage = totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
  const superuserPercentage = totalUsers > 0 ? Math.round((superusers / totalUsers) * 100) : 0

  return (
    <VStack spacing={6} align="stretch">
      {/* Key Metrics */}
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={4}>
        <AnalyticsCard
          title="User Activity Rate"
          value={`${activePercentage}%`}
          subtitle={`${activeUsers} of ${totalUsers} users`}
          icon={<FaChartLine />}
          color="green.500"
        />
        <AnalyticsCard
          title="Superuser Ratio"
          value={`${superuserPercentage}%`}
          subtitle={`${superusers} superusers`}
          icon={<FaChartPie />}
          color="purple.500"
        />
        <AnalyticsCard
          title="Monthly Growth"
          value={newThisMonth}
          subtitle="New users this month"
          icon={<FaCalendarAlt />}
          color="orange.500"
        />
        <AnalyticsCard
          title="Inactive Users"
          value={inactiveUsers}
          subtitle={`${Math.round((inactiveUsers / totalUsers) * 100)}% of total`}
          icon={<FaChartBar />}
          color="red.500"
        />
      </Grid>

      {/* Charts Section */}
      <Grid templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} gap={6}>
        <ChartPlaceholder
          title="User Registration Trend"
          description="Chart showing user registration over time"
        />
        <ChartPlaceholder
          title="User Activity Distribution"
          description="Pie chart showing active vs inactive users"
        />
        <ChartPlaceholder
          title="Login Activity"
          description="Line chart showing user login patterns"
        />
        <ChartPlaceholder
          title="User Role Distribution"
          description="Bar chart showing user roles"
        />
      </Grid>

      {/* Detailed Statistics */}
      <Card>
        <CardHeader>
          <Heading size="md">Detailed Statistics</Heading>
        </CardHeader>
        <CardBody>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <VStack align="start" spacing={4}>
              <Box>
                <Text fontWeight="bold" mb={2}>User Status Breakdown</Text>
                <VStack align="start" spacing={2}>
                  <Flex justify="space-between" w="full">
                    <Text>Active Users</Text>
                    <Text fontWeight="bold">{activeUsers}</Text>
                  </Flex>
                  <Flex justify="space-between" w="full">
                    <Text>Inactive Users</Text>
                    <Text fontWeight="bold">{inactiveUsers}</Text>
                  </Flex>
                  <Flex justify="space-between" w="full">
                    <Text>Total Users</Text>
                    <Text fontWeight="bold">{totalUsers}</Text>
                  </Flex>
                </VStack>
              </Box>
            </VStack>
            <VStack align="start" spacing={4}>
              <Box>
                <Text fontWeight="bold" mb={2}>User Roles</Text>
                <VStack align="start" spacing={2}>
                  <Flex justify="space-between" w="full">
                    <Text>Regular Users</Text>
                    <Text fontWeight="bold">{totalUsers - superusers}</Text>
                  </Flex>
                  <Flex justify="space-between" w="full">
                    <Text>Superusers</Text>
                    <Text fontWeight="bold">{superusers}</Text>
                  </Flex>
                </VStack>
              </Box>
            </VStack>
          </Grid>
        </CardBody>
      </Card>
    </VStack>
  )
}
