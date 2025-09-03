# User Management Dashboard Features

## Overview

A comprehensive user management dashboard has been added to the application with advanced features for administrators to manage users effectively.

## Backend Features

### New API Endpoints

1. **User Statistics** (`GET /api/v1/users/stats`)
   - Returns comprehensive user statistics including:
     - Total users count
     - Active users count
     - Superusers count
     - Inactive users count
     - Users created this month

2. **Bulk Operations**
   - **Bulk Update Users** (`PATCH /api/v1/users/bulk/update`)
     - Update multiple users' status (active/inactive)
     - Update multiple users' roles (superuser/regular user)
   - **Bulk Delete Users** (`DELETE /api/v1/users/bulk/delete`)
     - Delete multiple users at once
     - Includes safety checks to prevent self-deletion

3. **User Status Toggle** (`PATCH /api/v1/users/{user_id}/toggle-status`)
   - Quickly toggle a user's active status

### Enhanced User Model

The User model now includes:
- `created_at`: Timestamp when the user was created
- `last_login`: Timestamp of the user's last login (updated automatically on login)

### Database Migration

A new migration has been created to add the tracking fields:
- `add_user_tracking_fields.py` - Adds `created_at` and `last_login` columns

## Frontend Features

### New Route

- **User Management** (`/user-management`) - Accessible only to superusers

### Dashboard Components

1. **UserManagementDashboard** (`/components/UserManagement/UserManagementDashboard.tsx`)
   - Main dashboard with statistics cards
   - User table with enhanced information
   - Search and filtering capabilities
   - Pagination support

2. **UserAnalytics** (`/components/UserManagement/UserAnalytics.tsx`)
   - Detailed analytics and metrics
   - Activity rate calculations
   - User role distribution
   - Growth statistics

3. **BulkOperations** (`/components/UserManagement/BulkOperations.tsx`)
   - Bulk user selection with checkboxes
   - Bulk activate/deactivate users
   - Bulk promote/demote superusers
   - Bulk delete users with confirmation

4. **UserActivity** (`/components/UserManagement/UserActivity.tsx`)
   - Recent login activity
   - New user registrations
   - Inactive user tracking
   - Activity statistics

### Enhanced Navigation

The sidebar now includes a "User Management" link for superusers, providing easy access to the new dashboard.

## Key Features

### Statistics Dashboard
- Real-time user statistics
- Visual indicators for different user states
- Monthly growth tracking
- Activity rate calculations

### Advanced Filtering
- Search users by name or email
- Filter by user status (active/inactive)
- Filter by user role (superuser/user)

### Bulk Operations
- Select multiple users with checkboxes
- Perform bulk actions with confirmation dialogs
- Safety checks to prevent accidental deletions
- Visual feedback for selected users

### User Activity Tracking
- Monitor recent login activity
- Track new user registrations
- Identify inactive users
- Activity timeframes (24h, 7 days, 30 days)

### Enhanced User Information
- Creation date display
- Last login tracking
- User status indicators
- Role badges

## Security Features

1. **Access Control**
   - Only superusers can access user management features
   - API endpoints protected with superuser authentication

2. **Safety Checks**
   - Users cannot delete themselves
   - Confirmation dialogs for destructive actions
   - Bulk operations include safety validations

3. **Data Protection**
   - Sensitive operations require confirmation
   - Audit trail for user changes
   - Proper error handling

## Usage

### For Administrators

1. **Access the Dashboard**
   - Log in as a superuser
   - Navigate to "User Management" in the sidebar

2. **View Statistics**
   - Check the statistics cards for overview
   - Use the Analytics tab for detailed metrics

3. **Manage Users**
   - Use the Dashboard tab for individual user management
   - Use the Bulk Operations tab for mass actions

4. **Monitor Activity**
   - Use the User Activity tab to track user behavior
   - Identify inactive users for follow-up

### API Usage

```typescript
// Get user statistics
const stats = await UsersService.getUserStats()

// Bulk update users
await UsersService.bulkUpdateUsers({
  requestBody: {
    user_ids: ['user1', 'user2'],
    is_active: true,
    is_superuser: false
  }
})

// Toggle user status
await UsersService.toggleUserStatus({
  userId: 'user-id'
})
```

## Technical Implementation

### Backend
- FastAPI with SQLModel for database operations
- Alembic for database migrations
- Pydantic for data validation
- JWT authentication for API security

### Frontend
- React with TypeScript
- TanStack Query for data fetching
- Chakra UI for components
- React Hook Form for form handling
- React Router for navigation

### Database
- PostgreSQL with SQLModel ORM
- UUID primary keys
- Timestamp tracking
- Cascade delete relationships

## Future Enhancements

1. **Advanced Analytics**
   - User engagement metrics
   - Login pattern analysis
   - User retention rates

2. **Audit Logging**
   - Track all user management actions
   - Export audit reports

3. **User Import/Export**
   - CSV import functionality
   - User data export

4. **Advanced Filtering**
   - Date range filters
   - Custom search criteria
   - Saved filter presets

5. **Email Notifications**
   - Bulk action notifications
   - User status change alerts

## Installation and Setup

1. **Backend Setup**
   ```bash
   cd backend
   # Run the new migration
   alembic upgrade head
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access**
   - Log in as a superuser
   - Navigate to "User Management" in the sidebar

## Troubleshooting

### Common Issues

1. **Migration Errors**
   - Ensure database is running
   - Check Alembic configuration
   - Verify Python dependencies

2. **API Errors**
   - Check authentication headers
   - Verify superuser permissions
   - Review API endpoint URLs

3. **Frontend Issues**
   - Clear browser cache
   - Check TypeScript compilation
   - Verify API client generation

### Support

For issues or questions about the user management features, please refer to the project documentation or create an issue in the repository.
