# Transaction Analyzer — Frontend

React frontend for the Transaction Analyzer application. Allows users to register, log in, and manage their financial transactions with AI-generated analysis.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — build tool and dev server
- **React Router v7** — client-side routing
- **Tailwind CSS v4** — utility-first styling
- **Axios** — HTTP client with JWT interceptor
- **Vitest** + **React Testing Library** — unit testing

## Features

- User registration and login
- Protected routes with JWT authentication
- Auto-logout after 8 minutes of inactivity
- Dashboard with transaction list and summary stats
- Transaction detail with AI analysis, category and anomaly info
- Form validation on both register and login
- Responsive design (mobile and desktop)

## Project Structure

```
src/
├── api/               # Axios client and API calls (auth, transactions)
├── components/        # Navbar, CategoryBadge, Spinner, ProtectedRoute
├── context/           # AuthContext — global auth state and inactivity timer
├── pages/             # LoginPage, RegisterPage, DashboardPage,
│                      # NewTransactionPage, TransactionDetailPage
├── test/              # Vitest setup file
└── config.ts          # Shared constants (timeouts, etc.)
```

## Prerequisites

- Node.js 18+
- The [Transaction Analyzer API](../transaction-analyzer-api) running on `http://localhost:3000`

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the root of the project:

```env
VITE_API_URL=http://localhost:3000
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run test       # Run unit tests
npm run test:watch # Run tests in watch mode
```

## Running Tests

```bash
npm run test
```

Tests cover form validation logic for LoginPage and RegisterPage using Vitest and React Testing Library.

## Validation Rules

- **Username:** 3–20 characters, only letters, numbers and underscores
- **Password:** minimum 6 characters
- Passwords must match on the register form
