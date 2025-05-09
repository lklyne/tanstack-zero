# CLAUDE.md - Guidelines for Tanstack Zero Starter

## Commands
- **Development**: `bun dev` - Start the dev server
- **Database**: `bun db:up` - Start Postgres, `bun db:push` - Push schema changes, `bun db:auth:push` - Push auth schema
- **Cache**: `bun zero-cache` - Start Zero cache service
- **Lint/Format**: `bun lint` - Run Biome linter, `bun format` - Run Biome formatter, `bun check` - Run Biome check
- **Build**: `bun build` - Build the app
- **Test**: `bun test` - Run all Vitest tests, `bun test path/to/test.ts` - Run a single test

## Code Style
- **Formatting**: Tab indentation, semicolons as needed, single quotes for strings/JSX
- **Naming**: Kebab-case for files, camelCase for variables/functions, PascalCase for components/types
- **Imports**: Use `@/` path alias for src imports, group and organize imports
- **Types**: Use strict TypeScript with explicit types, leverage Zod for validation
- **Zero Pattern**: Use Zero mutators for DB operations, follow client/server implementation pattern
- **Auth**: Implement Better Auth patterns for authentication flows
- **Errors**: Use proper error handling with custom error types where appropriate
- **Components**: Follow ShadCN/Radix UI patterns, use Tailwind for styling

## Data Flow
- Follow Zero Sync patterns for real-time data updates
- Define schema in `src/server/db/schema.ts`
- Use `bun db:zero:generate` to update Zero schema after changes