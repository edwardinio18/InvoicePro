# InvoicePro Full-Stack Invoice Management App

This repository contains two separate projects powering **InvoicePro**:

* **server/**: NestJS backend with PostgreSQL (via Docker + Prisma)
* **client/**: React frontend (Vite + TypeScript + Tailwind + shadcn/ui)

Both projects use PNPM for package management. Follow the steps below to get InvoicePro up and running.

---

## Table of Contents

1. [Preview](#preview)
2. [Prerequisites](#prerequisites)
3. [Environment Variables](#environment-variables)
4. [Docker & Database](#docker--database)
5. [Root Directory Setup](#root-directory-setup)
    * [Install Dependencies](#install-dependencies)
6. [Server (NestJS) Setup](#server-nestjs-setup)
    * [Install Dependencies](#install-dependencies-1)
    * [Generate Prisma Client & Migrate](#generate-prisma-client--migrate)
    * [Seed the Database](#seed-the-database)
    * [Run the Server](#run-the-server)
    * [Run Server Tests](#run-server-tests)
7. [Client (React) Setup](#client-react-setup)
    * [Install Dependencies](#install-dependencies-2)
    * [Run the Client](#run-the-client)
8. [Credentials](#credentials)

---

## Preview

#### Login Page

![Login Page](assets/login_screen.png)  
*The sleek login interface ensures quick and secure access to your InvoicePro account, with clear prompts and validation
feedback.*

#### Dashboard

![Dashboard](assets/dashboard_screen.png)  
*An at-a-glance dashboard showing total invoices, outstanding balances, and recent activity—designed to help you stay on
top of your cash flow.*

#### Invoices Page

![Invoice Page](assets/invoices_screen.png)  
*A detailed list view with sortable columns, status badges, and filtering controls so you can efficiently review and
manage every invoice.*

#### Invoice Modal

![Invoice Modal](assets/invoice_modal.png)  
*An intuitive modal for creating or editing invoices, featuring form validation, date pickers, and a live preview of key
invoice details.*

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

The API will be available at `http://localhost:3000`.

### Run Server Tests

```bash
pnpm test
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

---

## Credentials

Use the following credentials to log in to the app:

```bash
Email: demo@altametrics.com
Password: password123
```