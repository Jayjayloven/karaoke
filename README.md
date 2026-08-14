# 🎤 Karaoke App API

A robust, scalable backend for a modern karaoke party application. Built with Node.js, Express, and strict TypeScript, this project strictly adheres to **Domain-Driven Design (DDD)** principles to ensure clean, maintainable, and testable code.

## 🚀 Tech Stack

- **Runtime:** Node.js (v22+)
- **Framework:** Express.js (v5)
- **Language:** TypeScript (Strict Mode, ES Modules / `nodenext`)
- **Development:** `tsx` (for seamless TypeScript execution without build steps)

---

## 🛠️ Getting Started

### 1. Prerequisites

Ensure you have Node.js version 22 or higher installed.

### 2. Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### 3. Running the Server

**Development Mode (Hot Reloading)**
Runs the server using tsx with watch mode enabled. The server will automatically restart when you save `.ts` files.

```bash
npm run dev
```

**Production Build**
Compiles the TypeScript code into the `/dist` directory and runs the compiled JavaScript.

```bash
npm run build
npm start
```

---

## 🏗️ Architecture Guide

This project uses a modular, Feature-First architecture based on Domain-Driven Design (DDD).

Instead of grouping files by their technical role (e.g., all controllers in one folder), code is grouped by Feature (or "Bounded Context"). This ensures that our core business logic remains completely isolated from external frameworks, databases, and HTTP details.

### 📂 Directory Structure

Our `src/` directory is organized as follows:

```plaintext
src/
├── shared/                       # Utilities and base classes shared across all modules
├── modules/
│   └── room/                     # 📦 FEATURE: Room Management (Example)
│       ├── domain/               # 1. Core business logic and rules
│       ├── application/          # 2. Use cases and orchestration
│       ├── infrastructure/       # 3. Database, APIs, and external tools
│       └── presentation/         # 4. Express routes and HTTP controllers
└── app.ts                        # Application entry point & dependency wiring
```

### The Four Layers Explained

The golden rule of this architecture is the **Dependency Rule**: Inner layers cannot know anything about outer layers. The Domain layer is at the center, meaning it cannot import anything from Application, Infrastructure, or Presentation.

#### 1. Domain Layer (`/domain`)

The heart of the software. Contains the core business entities, business rules, and interface definitions.

- **What goes here:** Entities (e.g., `Room.ts`), Value Objects, Domain Events, and Repository Interfaces (`IRoomRepository.ts`).
- **What DOES NOT go here:** Any framework imports. No Express, no database ORMs, no external libraries.

#### 2. Application Layer (`/application`)

The "Use Cases" of the system. Orchestrates the flow of data to and from the domain entities.

- **What goes here:** Use Case classes (e.g., `CreateRoomUseCase.ts`, `JoinRoomQueueUseCase.ts`).
- **What it does:** Fetches data from a repository, calls the core logic on the Domain entity, and saves the data back to the repository.
- **What DOES NOT go here:** HTTP requests or responses. It does not know what `req` or `res` are.

#### 3. Infrastructure Layer (`/infrastructure`)

The technical implementation details. Where the app interacts with the "outside world."

- **What goes here:** Actual database repository implementations (`MongoRoomRepository.ts`), third-party API clients, Redis caches, etc.
- **What it does:** Implements the interfaces defined in the Domain layer.

#### 4. Presentation Layer (`/presentation`)

The delivery mechanism. How the outside world talks to our Application layer.

- **What goes here:** Express Controllers (`RoomController.ts`), Express Routers, and request validation logic.
- **What it does:** Receives the HTTP request, parses the JSON body, passes data to a Use Case, and formats the HTTP response.
- **What DOES NOT go here:** Business logic. Controllers should be extremely "dumb".

---

## ⚠️ Developer Guidelines

### 1. The "NodeNext" Import Rule

Because this project uses strict ES Modules (`"type": "module"`) and TypeScript's `"module": "nodenext"`, you must include the `.js` extension on all relative imports, even though you are importing `.ts` files.

✅ **Correct:**

```typescript
import { Room } from "../domain/Room.js";
```

❌ **Incorrect (Will crash at runtime):**

```typescript
import { Room } from "../domain/Room";
```

### 2. Dependency Injection

Do not instantiate Infrastructure classes directly inside your Use Cases or Controllers. Pass them in via the constructor. This allows us to easily mock databases for unit testing and keeps modules loosely coupled.

✅ **Correct:**

```typescript
export class CreateRoomUseCase {
  constructor(private roomRepo: IRoomRepository) {} // Injected via constructor!
}
```

❌ **Incorrect:**

```typescript
import { PostgresRoomRepo } from "../infrastructure/PostgresRoomRepo.js";

export class CreateRoomUseCase {
  private roomRepo = new PostgresRoomRepo(); // Tightly coupled! Bad!
}
```
