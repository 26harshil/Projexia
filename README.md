# Projexia - Student Project Management System

Projexia is a role-based academic project management platform for students, faculty, and administrators. It centralizes project groups, proposals, reports, meetings, attendance, file submissions, role management, email notifications, and real-time chat.

## Features

- **Student workspace:** create project groups, add members, submit proposals and reports, upload files, and view meetings.
- **Faculty workspace:** manage assigned groups, schedule meetings, record attendance and grades, and review reports.
- **Admin workspace:** manage users and students, monitor projects and reports, and configure project allocations.
- **Authentication and RBAC:** Clerk authentication with `ADMIN`, `FACULTY`, and `STUDENT` roles.
- **Real-time communication:** private Stream Chat channels synchronized with project groups.
- **File management:** Cloudinary uploads and controlled downloads.
- **Notifications:** meeting notifications sent through Resend.
- **PDF support:** report and project documents generated with jsPDF.

## Technology Stack

| Area | Technology |
|---|---|
| Framework | Next.js 16.1.1, React 19.2.3 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, PostCSS |
| UI | Radix UI, Lucide React, Framer Motion, React Spring |
| Authentication | Clerk |
| Database | PostgreSQL |
| ORM | Prisma 7.5.0 |
| Realtime chat | Stream Chat SDK and Stream Chat React |
| File storage | Cloudinary |
| Email | Resend |
| Forms and validation | React Hook Form, Zod |
| PDF generation | jsPDF, jsPDF-AutoTable |

## Project Structure

```text
.
|-- app/
|   |-- page.tsx                 # Public landing page
|   |-- layout.tsx               # Root layout and Clerk provider
|   |-- globals.css              # Global styles
|   |-- check-role/              # Post-authentication role routing
|   |-- profile/                 # Signed-in user profile
|   |-- chat/                    # Realtime chat page
|   |-- admin/
|   |   |-- dashboard/           # Admin dashboard
|   |   |-- projects/            # Project management
|   |   |-- reports/             # Report overview
|   |   |-- students/            # Student management
|   |   `-- users/               # User and role management
|   |-- faculty/
|   |   |-- dashboard/           # Faculty dashboard
|   |   |-- group/               # Assigned project groups
|   |   |-- meetings/            # Meeting management
|   |   |-- reports/             # Report submissions
|   |   `-- reviews/             # Report review workflow
|   |-- student/
|   |   |-- dashboard/           # Student dashboard
|   |   |-- group/               # Group formation
|   |   |-- project/             # Project details
|   |   |-- meetings/            # Meeting schedule
|   |   `-- reports/             # Proposal, midterm, and final reports
|   |-- actions/                 # Server actions for application workflows
|   `-- api/
|       |-- upload/              # Cloudinary file upload
|       |-- download/            # Controlled file downloads
|       |-- stream-token/        # Stream chat user token
|       |-- chat/sync-group/     # Stream channel synchronization
|       |-- webhooks/clerk/      # Clerk user synchronization webhook
|       |-- posts/               # Post model endpoints
|       `-- seed/                # Development seed endpoint
|-- components/
|   |-- admin/                   # Admin UI
|   |-- faculty/                 # Faculty UI
|   |-- student/                # Student UI
|   |-- dashboard/              # Shared dashboard UI
|   |-- profile/                 # Profile UI
|   |-- section/                # Public landing sections
|   |-- react-bits/             # Additional animated components
|   `-- ui/                     # Reusable Radix and utility components
|-- hooks/
|   `-- use-scroll.ts
|-- lib/
|   |-- prisma.ts                # Prisma and PostgreSQL connection
|   |-- cloudinary.ts            # Cloudinary configuration
|   |-- email.ts                 # Resend meeting notifications
|   |-- stream.ts                # Stream server client
|   |-- streamGroupChat.ts       # Group chat synchronization
|   |-- pdfGenerator.ts          # PDF helpers
|   |-- roleUtils.ts             # Role helpers
|   `-- utils.ts                 # Shared utilities
|-- prisma/
|   |-- schema.prisma            # Database models and relations
|   `-- migrations/              # Prisma migration history
|-- public/                      # Logos and static assets
|-- types/                       # Shared TypeScript definitions
|-- proxy.ts                     # Clerk middleware and route authorization
|-- prisma.config.ts             # Prisma datasource configuration
|-- package.json                 # Dependencies and npm scripts
|-- next.config.ts               # Next.js image configuration
|-- components.json             # UI component configuration
|-- tsconfig.json                # TypeScript configuration
`-- eslint.config.mjs            # ESLint configuration
```

## Database Models

The PostgreSQL schema is defined in [`prisma/schema.prisma`](./prisma/schema.prisma).

| Model | Purpose |
|---|---|
| `users` | Clerk-linked application users and roles |
| `student` | Student profile and enrollment information |
| `staff` | Faculty profile and staff information |
| `projecttype` | Available project categories |
| `projectgroup` | Project group, title, area, progress, deadline, and allocations |
| `projectgroupmember` | Group membership and group-leader status |
| `projectmeeting` | Scheduled meetings and faculty review notes |
| `projectmeetingattendance` | Per-student meeting attendance |
| `projectfile` | Uploaded project files and Cloudinary URLs |
| `projectreport` | Proposal, midterm, and final reports |
| `Post` | Supporting post content |

Roles are represented by the `ADMIN`, `FACULTY`, and `STUDENT` enum values.

## Prerequisites

- Node.js 20 or newer
- npm
- PostgreSQL database
- Clerk application
- Stream account
- Cloudinary account
- Resend account

## Installation

1. Clone the repository:

```bash
git clone https://github.com/26harshil/Projexia.git
cd Projexia
```

2. Install dependencies:

```bash
npm install
```

3. Create a local `.env` file in the project root.

> [!IMPORTANT]
> Never commit `.env` files or paste real credentials into source code or documentation. The `.gitignore` already excludes `.env*` files. Use environment-variable secrets in development and hosting providers in production.

### Required Environment Variables

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<clerk-publishable-key>
CLERK_SECRET_KEY=<clerk-secret-key>
CLERK_WEBHOOK_SECRET=<clerk-webhook-signing-secret>

# PostgreSQL
DATABASE_URL=<postgresql-runtime-connection-url>
DIRECT_URL=<postgresql-direct-connection-url>

# Stream Chat
NEXT_PUBLIC_STREAM_API_KEY=<stream-public-api-key>
STREAM_API_KEY=<stream-server-api-key>
STREAM_API_SECRET=<stream-server-api-secret>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>

# Resend
RESEND_API_KEY=<resend-api-key>
```

Variable use:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` configure Clerk.
- `CLERK_WEBHOOK_SECRET` verifies Clerk webhook requests.
- `DATABASE_URL` is used by the application Prisma connection.
- `DIRECT_URL` is used by Prisma CLI configuration for migrations.
- `NEXT_PUBLIC_STREAM_API_KEY` is used by the browser chat client.
- `STREAM_API_KEY` and `STREAM_API_SECRET` are server-only Stream credentials.
- Cloudinary variables configure file upload and private download support.
- `RESEND_API_KEY` configures meeting notification emails.

Do not expose `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`, `STREAM_API_SECRET`, `CLOUDINARY_API_SECRET`, database passwords, or `RESEND_API_KEY` as `NEXT_PUBLIC_*` variables.

## Database Setup

Apply migrations and generate the Prisma client:

```bash
npx prisma migrate deploy
npx prisma generate
```

For local schema iteration:

```bash
npx prisma migrate dev
npx prisma generate
```

Optional database tools:

```bash
npx prisma studio
```

## Run the Application

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Production build:

```bash
npm run build
npm start
```

## npm Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Generate Prisma client and create a production build |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |

## Application Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Landing page |
| `/check-role` | Authenticated | Redirect based on Clerk role claims |
| `/profile` | Authenticated | User profile |
| `/chat` | Public route matcher; chat authentication handled in UI | Project communication |
| `/student/*` | Student role | Student project workspace |
| `/faculty/*` | Faculty role | Faculty project workspace |
| `/admin/*` | Admin role | Administration workspace |

Authorization is enforced by [`proxy.ts`](./proxy.ts), which protects non-public routes and redirects users to dashboards matching their Clerk role metadata.

## API Routes

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/webhooks/clerk` | POST | Verify Clerk events and synchronize users |
| `/api/stream-token` | GET/POST | Create a Stream chat token |
| `/api/chat/sync-group` | POST | Synchronize project group channels |
| `/api/upload` | POST | Upload files to Cloudinary |
| `/api/download` | GET | Download approved Cloudinary files |
| `/api/posts` | Varies | Post model operations |
| `/api/seed` | POST | Seed development data |

Configure the Clerk webhook endpoint to `https://<your-domain>/api/webhooks/clerk`.

## Dependency Summary

### Runtime dependencies

- `@clerk/nextjs`: authentication and role-aware route protection
- `@hookform/resolvers`, `react-hook-form`, `zod`: forms and validation
- `@prisma/client`, `@prisma/adapter-neon`, `@prisma/adapter-pg`, `pg`: database access
- `@radix-ui/*`, `radix-ui`, `lucide-react`: accessible UI primitives and icons
- `class-variance-authority`, `clsx`, `tailwind-merge`: component and class utilities
- `framer-motion`, `@react-spring/web`, `react-day-picker`, `date-fns`: animation and date UI
- `cloudinary`: file storage and downloads
- `jspdf`, `jspdf-autotable`: PDF generation
- `resend`, `nodemailer`: email support
- `stream-chat`, `stream-chat-react`: chat
- `svix`: webhook verification support
- `dotenv`, `multer`: environment loading and upload support

### Development dependencies

- `typescript`, `@types/*`: TypeScript and type declarations
- `eslint`, `eslint-config-next`: linting
- `prisma`: schema, migrations, and Prisma Studio
- `tailwindcss`, `@tailwindcss/postcss`, `tw-animate-css`: styling pipeline

## Development Notes

- `.env*` files are intentionally ignored by Git.
- The generated Prisma client is written to `app/generated/prisma` and is ignored by Git.
- `next-env.d.ts`, `.next`, `node_modules`, build output, and TypeScript build metadata are generated and should not be committed.
- Configure production secrets through the deployment provider rather than committing an `.env.production` file.
- Review any test or seed endpoint before deployment to ensure it is appropriate for the environment.
