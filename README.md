
# SPMS Project Hub

## Setup Instructions

### Environment Variables
Create a `.env` or `.env.local` file with the following:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

### Clerk Configuration
1.  **Webhooks**: Create a generic webhook in Clerk Dashboard pointing to `YOUR_DOMAIN/api/webhooks/clerk`. Subscribe to `user.created`, `user.updated`, `user.deleted`. Get the Signing Secret and put it in `.env` as `CLERK_WEBHOOK_SECRET`.
2.  **Custom JWT Claims**: Go to Clerk Dashboard -> Sessions -> Edit Custom Claims. Add:
    ```json
    {
      "metadata": {
        "role": "{{user.public_metadata.role}}"
      }
    }
    ```
    This is required for Role-Based Access Control (RBAC).

### Database
This project uses Prisma with PostgreSQL.
1.  Run migrations: `npx prisma migrate dev`
2.  Generate client: `npx prisma generate`

## Features
-   **Authentication**: Managed by Clerk.
-   **RBAC**: Admin routes (`/admin`) are protected.
-   **Posts**: Create and view posts at `/posts`.
