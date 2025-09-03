import { useQuery } from "@tanstack/react-query"
import { FaClock, FaUser, FaCalendarAlt, FaSignInAlt } from "react-icons/fa"

import { UsersService } from "@/client"
import {
  Badge,
  Box,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react"

function getUsersQueryOptions() {
  return {
    queryFn: () => UsersService.readUsers({ skip: 0, limit: 100 }),
    queryKey: ["users"],
  }
}

function ActivityCard({ title, icon, children }: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader>
        <Flex align="center" gap={2}>
          <Box color="blue.500">{icon}</Box>
          <Heading size="md">{title}</Heading>
        </Flex>
      </CardHeader>
      <CardBody>
        {children}
      </CardBody>
    </Card>
  )
}

function RecentActivityItem({ user, activity, time }: {
  user: { full_name?: string; email: string }
  activity: string
  time: string
}) {
  return (
    <Flex justify="space-between" align="center" py={2} borderBottom="1px" borderColor="gray.100">
      <VStack align="start" spacing={1}>
        <Text fontWeight="medium">
          {user.full_name || user.email}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {activity}
        </Text>
      </VStack>
      <Text fontSize="sm" color="gray.500">
        {time}
      </Text>
    </Flex>
  )
}

function UserActivityStats({ users }: { users: any[] }) {
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

  const recentLogins = users.filter(user => 
    user.last_login && new Date(user.last_login) > oneDayAgo
  ).length

  const weeklyLogins = users.filter(user => 
    user.last_login && new Date(user.last_login) > oneWeekAgo
  ).length

  const monthlyLogins = users.filter(user => 
    user.last_login && new Date(user.last_login) > oneMonthAgo
  ).length

  const neverLoggedIn = users.filter(user => !user.last_login).length

  return (
    <VStack spacing={4} align="stretch">
      <Flex gap={4} wrap="wrap">
        <Box textAlign="center" p={4} bg="blue.50" borderRadius="md" flex="1" minW="120px">
          <Text fontSize="2xl" fontWeight="bold" color="blue.600">
            {recentLogins}
          </Text>
          <Text fontSize="sm" color="gray.600">Last 24h</Text>
        </Box>
        <Box textAlign="center" p={4} bg="green.50" borderRadius="md" flex="1" minW="120px">
          <Text fontSize="2xl" fontWeight="bold" color="green.600">
            {weeklyLogins}
          </Text>
          <Text fontSize="sm" color="gray.600">Last 7 days</Text>
        </Box>
        <Box textAlign="center" p={4} bg="orange.50" borderRadius="md" flex="1" minW="120px">
          <Text fontSize="2xl" fontWeight="bold" color="orange.600">
            {monthlyLogins}
          </Text>
          <Text fontSize="sm" color="gray.600">Last 30 days</Text>
        </Box>
        <Box textAlign="center" p={4} bg="red.50" borderRadius="md" flex="1" minW="120px">
          <Text fontSize="2xl" fontWeight="bold" color="red.600">
            {neverLoggedIn}
          </Text>
          <Text fontSize="sm" color="gray.600">Never logged in</Text>
        </Box>
      </Flex>
    </VStack>
  )
}

function RecentLogins({ users }: { users: any[] }) {
  const usersWithLogin = users
    .filter(user => user.last_login)
    .sort((a, b) => new Date(b.last_login).getTime() - new Date(a.last_login).getTime())
    .slice(0, 10)

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const loginTime = new Date(date)
    const diffMs = now.getTime() - loginTime.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else {
      return 'Less than an hour ago'
    }
  }

  return (
    <VStack spacing={3} align="stretch">
      {usersWithLogin.length === 0 ? (
        <Text color="gray.500" textAlign="center" py={4}>
          No recent login activity
        </Text>
      ) : (
        usersWithLogin.map((user) => (
          <RecentActivityItem
            key={user.id}
            user={user}
            activity="Logged in"
            time={formatTimeAgo(user.last_login)}
          />
        ))
      )}
    </VStack>
  )
}

function NewUsers({ users }: { users: any[] }) {
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  const newUsers = users
    .filter(user => new Date(user.created_at) > oneWeekAgo)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const createdTime = new Date(date)
    const diffMs = now.getTime() - createdTime.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else {
      return 'Less than an hour ago'
    }
  }

  return (
    <VStack spacing={3} align="stretch">
      {newUsers.length === 0 ? (
        <Text color="gray.500" textAlign="center" py={4}>
          No new users this week
        </Text>
      ) : (
        newUsers.map((user) => (
          <RecentActivityItem
            key={user.id}
            user={user}
            activity="Account created"
            time={formatTimeAgo(user.created_at)}
          />
        ))
      )}
    </VStack>
  )
}

function InactiveUsers({ users }: { users: any[] }) {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  const inactiveUsers = users.filter(user => 
    !user.last_login || new Date(user.last_login) < thirtyDaysAgo
  )

  return (
    <VStack spacing={3} align="stretch">
      {inactiveUsers.length === 0 ? (
        <Text color="gray.500" textAlign="center" py={4}>
          No inactive users found
        </Text>
      ) : (
        inactiveUsers.slice(0, 10).map((user) => (
          <Flex key={user.id} justify="space-between" align="center" py={2}>
            <VStack align="start" spacing={1}>
              <Text fontWeight="medium">
                {user.full_name || user.email}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {user.last_login ? 'Last login: ' + new Date(user.last_login).toLocaleDateString() : 'Never logged in'}
              </Text>
            </VStack>
            <Badge colorScheme="red" size="sm">
              Inactive
            </Badge>
          </Flex>
        ))
      )}
    </VStack>
  )
}

export default function UserActivity() {
  const { data, isLoading } = useQuery(getUsersQueryOptions())

  if (isLoading) {
    return (
      <VStack spacing={6} align="stretch">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Box bg="gray.200" h="6" w="40" borderRadius="md" />
            </CardHeader>
            <CardBody>
              <VStack spacing={3}>
                {[1, 2, 3].map((j) => (
                  <Flex key={j} justify="space-between" w="full">
                    <Box bg="gray.200" h="4" w="32" borderRadius="md" />
                    <Box bg="gray.200" h="4" w="20" borderRadius="md" />
                  </Flex>
                ))}
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>
    )
  }

  const users = data?.data ?? []

  return (
    <VStack spacing={6} align="stretch">
      {/* Activity Statistics */}
      <ActivityCard title="Activity Statistics" icon={<FaClock />}>
        <UserActivityStats users={users} />
      </ActivityCard>

      {/* Recent Logins */}
      <ActivityCard title="Recent Logins" icon={<FaSignInAlt />}>
        <RecentLogins users={users} />
      </ActivityCard>

      {/* New Users */}
      <ActivityCard title="New Users (Last 7 Days)" icon={<FaUser />}>
        <NewUsers users={users} />
      </ActivityCard>

      {/* Inactive Users */}
      <ActivityCard title="Inactive Users (30+ Days)" icon={<FaCalendarAlt />}>
        <InactiveUsers users={users} />
      </ActivityCard>
    </VStack>
  )
}
