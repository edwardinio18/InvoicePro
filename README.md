# InvoicePro Full-Stack Invoice Management App

This repository contains two separate projects powering **InvoicePro**:

* **server/**: NestJS backend with PostgreSQL (via Docker + Prisma)
* **client/**: React frontend (Vite + TypeScript + Tailwind + shadcn/ui)

Both projects use PNPM for package management. Follow the steps below to get InvoicePro up and running.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Docker & Database](#docker--database)
4. [Root Directory Setup](#root-directory-setup)
    * [Install Dependencies](#install-dependencies)
5. [Server (NestJS) Setup](#server-nestjs-setup)
    * [Install Dependencies](#install-dependencies-1)
    * [Generate Prisma Client & Migrate](#generate-prisma-client--migrate)
    * [Seed the Database](#seed-the-database)
    * [Run the Server](#run-the-server)
    * [Run Server Tests](#run-server-tests)
6. [Client (React) Setup](#client-react-setup)
    * [Install Dependencies](#install-dependencies-2)
    * [Run the Client](#run-the-client)
    * [Lint the Client](#lint-the-client)
7. [Useful Scripts](#useful-scripts)
8. [Credentials](#credentials)

---

## Prerequisites

* **Node.js** >= 18
* **PNPM** >= 7 (`npm install -g pnpm`)
* **Docker** & **Docker Compose**
* **Git**

---

## Environment Variables

Inside the **server/** folder, copy the example file:

```bash
cd server
cp .env.example .env
```

Then open `server/.env` and update:

```dotenv
# Database connection (already populated in .env.example)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/altametrics?schema=public"

# Replace with a secure JWT secret
JWT_SECRET="<YOUR_JWT_SECRET_HERE>"
```

---

## Docker & Database

All database services live under `server/docker-compose.yml`. To start the PostgreSQL database:

```bash
cd server
docker-compose up -d
```

This will spin up a container named `db` on port **5432**, using the credentials and DB name from your `.env`. A
persistent volume named `db_data` ensures data survives restarts.

```yaml
# server/docker-compose.yml
services:
  db:
    image: postgres:15
    container_name: db
    restart: always
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-altametrics}
    ports:
      - '5432:5432'
    volumes:
      - db_data:/var/lib/postgresql/data
    env_file:
      - .env

volumes:
  db_data:
```

## Root Directory Setup

### Install Dependencies

```bash
pnpm install
```

---

## Server (NestJS) Setup

### Install Dependencies

```bash
cd server
pnpm install
```

### Generate Prisma Client & Migrate

Ensure the DB container is running, then:

```bash
# Push schema & generate client
npx prisma db push --schema=prisma/schema.prisma
npx prisma generate --schema=prisma/schema.prisma
```

### Seed the Database

```bash
pnpm prisma:seed
```

### Run the Server

Development mode (with live reload):

```bash
pnpm start:dev
```

Production build & start:

```bash
pnpm build
pnpm start:prod
```

The API will be available at `http://localhost:3000`.

### Run Server Tests

```bash
# Unit & integration tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:cov

# E2E tests
pnpm test:e2e
```

---

## Client (React) Setup

### Install Dependencies

```bash
cd client
pnpm install
```

### Run the Client

```bash
pnpm dev
```

Visit `http://localhost:5173` (default Vite port).

### Lint the Client

```bash
pnpm lint
```

---

## Useful Scripts

### Server (`server/package.json`)

| Script             | Description                  |
|--------------------|------------------------------|
| `pnpm start:dev`   | Run Nest in watch mode       |
| `pnpm build`       | Compile for production       |
| `pnpm start:prod`  | Start compiled server        |
| `pnpm prisma:seed` | Seed the database            |
| `pnpm test`        | Run unit & integration tests |
| `pnpm test:e2e`    | Run end-to-end tests         |
| `pnpm lint`        | Run ESLint fixes             |

### Client (`client/package.json`)

| Script         | Description                            |
|----------------|----------------------------------------|
| `pnpm dev`     | Run Vite dev server (`localhost:5173`) |
| `pnpm build`   | Build for production                   |
| `pnpm preview` | Preview the production build           |
| `pnpm lint`    | Run ESLint                             |

## Credentials

Use the following credentials to log in to the app:

```bash
Email: demo@altametrics.com
Password: password123
```