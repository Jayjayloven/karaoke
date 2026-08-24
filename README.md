# Karaoke Application

A containerized Node.js backend application built with Express, PostgreSQL, and MinIO storage, orchestrated using Podman.

---

## Prerequisites

Before running this project, ensure you have the following installed on your machine:

- **Node.js** (v20+ recommended)
- **Podman** and **Podman Compose**
- **Git**

---

## Project Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd karaoke
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and add the following environment variables:

```env
POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=postgres_password
DB_HOST=db
POSTGRES_DB=karaoke_database
PORT=3000

DATABASE_URL=postgres://postgres_user:postgres_password@127.0.0.1:5432/karaoke_database
```

---

## Local Development Workflow

### Step 1: Start the Container Services

Start the PostgreSQL database, MinIO storage engine, and pgAdmin GUI in detached mode:

```bash
npm run podman:up
```

### Step 2: Run Database Migrations

Execute all outstanding database migrations to create your schema (`users`, `rooms`, `song_queue`):

```bash
npm run migrate
```

### Step 3: Start the Backend Development Server

Run the Express application with auto-reloading:

```bash
npm run dev
```

---

## Running Services & GUIs

| Service       | Host URL              | Credentials / Notes                                |
| ------------- | --------------------- | -------------------------------------------------- |
| Backend API   | http://localhost:3000 | Express Server                                     |
| pgAdmin 4     | http://localhost:9091 | Configured for auto-login to Karaoke DB            |
| MinIO Console | http://localhost:9001 | Username: `rootUser` / Password: `rootPassword123` |
| MinIO API     | http://localhost:9000 | S3-compatible Object Storage Endpoint              |

---

## Useful Commands

### Stop Containers

```bash
npm run podman:down
```

### Reset Database Volume

**Warning:** This will wipe all database data.

```bash
podman-compose down -v
```

### Create a New Migration

```bash
npm run migrate:create <migration-name>
```

---

## Repository Hygiene

Ensure sensitive credential files are excluded from source control.

Your `.gitignore` should include:

```gitignore
node_modules/
dist/
.env
pgpass
servers.json
```
