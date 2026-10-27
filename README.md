# ProServe Frontend

Frontend application for **ProServe**, built with **Next.js**, **TypeScript**, and the **App Router**. This application provides the user interface for managing services, authentication, dashboards, and other platform features.

---

## 🚀 Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Ant Design
- React Hook Form
- Zod
- Axios
- React Query (TanStack Query)
- ESLint
- Prettier

---

## 📁 Project Structure

```text
src/
├── app/                # App Router pages and layouts
├── components/         # Reusable UI components
├── features/           # Feature-specific modules
├── hooks/              # Custom React hooks
├── lib/                # Shared utilities and configurations
├── services/           # API service functions
├── types/              # TypeScript interfaces and types
├── utils/              # Helper functions
├── constants/          # Application constants
├── styles/             # Global styles
└── middleware.ts       # Application middleware
```

---

## 📦 Prerequisites

Ensure you have the following installed:

- Node.js 20+
- npm (or yarn / pnpm)

Check versions:

```bash
node -v
npm -v
```

---

## ⚙️ Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project:

```bash
cd proserve-frontend
```

Install dependencies:

```bash
npm install
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root.

Example:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

> Do not commit `.env.local` to source control.

---

## ▶️ Running the Application

Start the development server:

```bash
npm run dev
```

Application runs at:

```
http://localhost:3000
```

---

## 🏗️ Build for Production

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

## 🧹 Linting

Run ESLint:

```bash
npm run lint
```

---

## 📜 Available Scripts

| Command | Description |
|----------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build the application |
| `npm start` | Run production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

---

## 🌐 API Integration

The frontend communicates with the backend through REST APIs.

Base URL is configured using:

```env
NEXT_PUBLIC_API_BASE_URL
```

All API calls should be implemented inside:

```text
src/services/
```

---

## 🎨 UI Guidelines

- Use Tailwind CSS for styling.
- Use Ant Design components where appropriate.
- Keep components reusable.
- Prefer Server Components unless client-side interactivity is required.
- Use Client Components only when necessary (`'use client'`).

---

## 📂 Coding Standards

### Components

- Use functional components.
- One component per file.
- Keep components focused and reusable.

Example:

```tsx
interface ButtonProps {
  title: string;
}

export default function Button({ title }: ButtonProps) {
  return <button>{title}</button>;
}
```

### Naming Conventions

| Item | Convention |
|------|------------|
| Components | PascalCase |
| Hooks | camelCase (`useAuth`) |
| Functions | camelCase |
| Variables | camelCase |
| Route folders | kebab-case |
| Constants | UPPER_SNAKE_CASE |

---

## 📋 Form Validation

Use:

- React Hook Form
- Zod

Validation schemas should be stored close to the feature or in a dedicated validation folder.

---

## 🪝 Custom Hooks

The services page (`src/app/services/page.tsx`) keeps only UI. Its logic lives in reusable hooks:

| Hook | What it does |
|------|--------------|
| `useServicesData` | Loads categories and services, maps API data, falls back to demo data, and cancels in-flight requests (AbortController) on unmount or retry. |
| `useServiceFilters` | Search, category, location and sort state. The URL is the source of truth, so filtered results are shareable and survive refresh. Category/location update the URL immediately; search updates it only after typing stops. |
| `useDebouncedValue` | Returns a value only after it has stopped changing for a delay (300 ms for search). |

Filtering and sorting are pure functions in `src/lib/service-filters.ts`, so they are tested without rendering. Tests live next to the code in `__tests__` folders.

---

## 🔄 State Management

Use:

- React Query for server state.
- React Context or another approved solution for lightweight global UI state.

Avoid unnecessary global state.

---

## 📁 Import Aliases

Use:

```ts
@/components
@/features
@/hooks
@/services
@/utils
@/types
```

Avoid long relative imports like:

```ts
../../../components/Button
```

---

## 🛠️ Git Workflow

Create a new branch:

```bash
git checkout -b feature/feature-name
```

Commit changes:

```bash
git add .
git commit -m "feat: add login page"
```

Push changes:

```bash
git push origin feature/feature-name
```

---

## 📌 Best Practices

- Keep components small and reusable.
- Avoid duplicated code.
- Prefer TypeScript interfaces.
- Avoid using `any`.
- Handle loading and error states.
- Keep business logic out of UI components.
- Use environment variables for configuration.
- Write meaningful commit messages.

---

## 🤝 Contributing

1. Create a feature branch.
2. Follow the project's coding standards.
3. Ensure the application builds successfully.
4. Run lint checks before submitting.
5. Open a Pull Request for review.

---

## 📄 License

This project is proprietary and intended for internal use unless otherwise specified.