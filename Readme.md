# SoftHire

SoftHire is a full-stack recruitment and immigration-support platform. It connects
candidates with recruiters, provides job-search and application workflows, and
offers tools for UK sponsorship, licence assessment, salary estimation, and
immigration skill-charge calculations.

The repository contains a React/Vite client, an Express API backed by MongoDB,
real-time chat with Socket.IO, and Docker configuration for running both
applications together.

## What the platform provides

### Candidates

- Create an account, sign in with email or Google, and reset a forgotten password.
- Build a profile and upload a CV/resume.
- Search jobs, view job details, and submit applications.
- Track submitted applications from the candidate dashboard.
- Chat with recruiters in real time.
- Use salary, sponsorship licence cost, and immigration skill-charge calculators.
- Complete sponsorship-related assessments and view assessment results.
- Make application-related payments through Stripe.

### Recruiters and organisations

- Register as a recruiter and manage an organisation profile.
- Create, edit, save, publish, and manage job postings.
- Review, filter, accept, reject, and save applicants for later.
- Discover candidate profiles and communicate with candidates.
- Submit sponsorship licence applications through a multi-step form.
- Manage supporting documents and organisation declarations.

### Public and administrative features

- Public pages for pricing, resources/blogs, contact, demos, and sponsorship
  compliance information.
- Admin authentication and organisation-management endpoints.
- Email notifications, Google OAuth, Cloudinary file storage, and Stripe
  webhook handling.

## Technology stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, Vite, React Router, Redux Toolkit, Axios |
| UI and interaction | Tailwind CSS, Radix UI, Framer Motion, GSAP, Lucide React |
| Backend | Node.js 18+, Express 4, Passport, JWT, Socket.IO |
| Database | MongoDB with Mongoose and Mongo-backed sessions |
| Integrations | Google OAuth, Stripe, Cloudinary, SMTP email, Google reCAPTCHA |
| Web server | Nginx for serving the production frontend |
| Local/prod packaging | Docker and Docker Compose |

## Repository structure

```text
SoftHireDocker/
├── backend/
│   ├── config/          # Passport and external-service configuration
│   ├── controllers/     # Request handlers and business logic
│   ├── middleware/      # Authentication, authorisation, uploads, validation
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express API route definitions
│   ├── sockets/         # Socket.IO chat handlers
│   ├── utils/           # Mail, uploads, Cloudinary, and shared helpers
│   ├── server.js        # Express and Socket.IO entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── public/          # Images, icons, and other static assets
│   ├── src/
│   │   ├── Api/         # API service modules
│   │   ├── components/  # Reusable UI and dashboard components
│   │   ├── pages/       # Public, candidate, recruiter, and payment pages
│   │   ├── redux/       # Redux store and feature slices
│   │   ├── Context/     # React context providers
│   │   └── sockets/     # Client-side Socket.IO connection
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml   # Frontend and backend services
└── .github/workflows/   # Deployment workflow
```

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB (local or hosted)
- Docker Desktop and Docker Compose, if running with containers

The third-party services listed in the environment section are only required
for the features that use them.

## Environment configuration

Do not commit real credentials. The repository ignores `.env` files; create
local environment files from the variable names below.

### Backend environment

Create `backend/.env` for local backend development, or place the backend
variables in the root `.env` when using the provided `docker-compose.yml`.

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/softhire
CORS_ORIGIN=http://localhost:5173
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace-with-a-long-random-secret
SESSION_SECRET=replace-with-a-long-random-secret

# Authentication
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
ADMIN_EMAIL=
ADMIN_PASSWORD=

# Email and storage
EMAIL=
EMAIL_PASSWORD=
CLIENT_CONTACT_EMAIL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Payments and verification
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RECAPTCHA_SECRET_KEY=
```

### Frontend environment

Create `frontend/.env`:

```env
VITE_SERVER_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=
VITE_RECAPTCHA_SITE_KEY=
VITE_STRIPE_PUBLISHABLE_KEY=
```

`VITE_SERVER_URL` is used for REST requests, uploaded-file URLs, and the
Socket.IO connection.

## Running locally without Docker

Install dependencies in both applications:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Start the API in one terminal:

```bash
cd backend
node server.js
```

Start the Vite development server in another terminal:

```bash
cd frontend
npm run dev
```

The default local URLs are:

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- Health check: `http://localhost:5000/health`

## Running with Docker Compose

Make sure the root `.env` contains the backend variables required by the
container, then run:

```bash
docker compose up --build
```

The Compose services are exposed at:

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

Stop the services with:

```bash
docker compose down
```

The frontend container builds the Vite application and serves it with Nginx.
The Nginx fallback to `index.html` supports client-side React Router routes.

## Useful commands

### Frontend

```bash
cd frontend
npm run dev       # Start Vite with hot reload
npm run build     # Create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

### Backend

```bash
cd backend
npm install
node server.js    # Start the Express and Socket.IO server
```

## API overview

The backend groups endpoints by feature under `/api`, including:

| Prefix | Responsibility |
| --- | --- |
| `/api/auth` | Candidate, recruiter, password-reset, and Google authentication |
| `/api/user` | User account operations |
| `/api/profile` | Candidate profile and resume-related profile actions |
| `/api/jobs` | Job search and job-posting operations |
| `/api/application` | Candidate applications |
| `/api/recruiter` | Recruiter profile operations |
| `/api/chat` | Chat history and messaging support |
| `/api/sponsor` | Sponsorship eligibility |
| `/api/isc` | Immigration skill-charge calculations |
| `/api/salary` | Salary calculations |
| `/api/stripe` | Checkout and payment webhooks |
| `/api/document` | Document management |

Use `GET /health` for a lightweight service health check.

## Deployment

The repository includes a GitHub Actions workflow at
`.github/workflows/deploy.yml`. On pushes to `main`, it connects to the
configured Hostinger VPS over SSH, pulls the latest code, and rebuilds the
Docker Compose services.

Configure the workflow secret `SSH_PRIVATE_KEY` in GitHub before enabling this
deployment path. The deployment host must already have Docker Compose, the
repository, and the required environment variables configured.

## Security notes

- Keep `.env` files, private keys, OAuth secrets, Stripe secrets, and Cloudinary
  credentials out of source control.
- Use strong, separate values for `JWT_SECRET` and `SESSION_SECRET`.
- Restrict `CORS_ORIGIN` to trusted frontend origins in production.
- Configure HTTPS in front of the application in production so secure cookies
  and OAuth callbacks work correctly.
- Use Stripe webhook signing secrets and verify webhook events before processing
  payments.

## Current project status

This is an active full-stack application. The root README documents the current
architecture and operational setup; feature-level implementation details are
organised in the `backend` controllers/routes/models and `frontend` pages,
components, API services, and Redux slices.