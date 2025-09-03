import { Container, Heading, Tabs } from "@chakra-ui/react"
import { createFileRoute } from "@tanstack/react-router"

import UserManagementDashboard from "@/components/UserManagement/UserManagementDashboard"
import UserAnalytics from "@/components/UserManagement/UserAnalytics"
import BulkOperations from "@/components/UserManagement/BulkOperations"
import UserActivity from "@/components/UserManagement/UserActivity"

const tabsConfig = [
  { value: "dashboard", title: "Dashboard", component: UserManagementDashboard },
  { value: "analytics", title: "Analytics", component: UserAnalytics },
  { value: "bulk-operations", title: "Bulk Operations", component: BulkOperations },
  { value: "activity", title: "User Activity", component: UserActivity },
]

export const Route = createFileRoute("/_layout/user-management")({
  component: UserManagement,
})

function UserManagement() {
  return (
    <Container maxW="full">
      <Heading size="lg" textAlign={{ base: "center", md: "left" }} py={12}>
        User Management
      </Heading>

      <Tabs.Root defaultValue="dashboard" variant="subtle">
        <Tabs.List>
          {tabsConfig.map((tab) => (
            <Tabs.Trigger key={tab.value} value={tab.value}>
              {tab.title}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {tabsConfig.map((tab) => (
          <Tabs.Content key={tab.value} value={tab.value}>
            <tab.component />
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Container>
  )
}
