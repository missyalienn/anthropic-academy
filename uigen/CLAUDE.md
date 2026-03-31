# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Initial setup (install deps, generate Prisma, run migrations)
npm run setup

# Development
npm run dev          # Start dev server with Turbopack
npm run dev:daemon   # Start in background, logs to logs.txt

# Build & production
npm run build
npm run start

# Testing
npm run test         # Run all Vitest tests
npm run test -- src/lib/transform/__tests__/jsx-transformer.test.ts  # Run a single test file

# Linting
npm run lint

# Database
npm run db:reset     # Reset database (destructive)
```

Environment: set `ANTHROPIC_API_KEY` in `.env` to use real Claude. Without it, the app falls back to a `MockLanguageModel` that generates sample components.

## Architecture

UIGen is a Next.js 15 (App Router) app that lets users describe React components in natural language, generates them using Claude AI via tool calls, and renders them live in a sandboxed iframe.

### Request Flow

1. User sends a chat message → `/api/chat/route.ts`
2. Server calls Claude (claude-haiku-4-5) via Vercel AI SDK with two tools:
   - `str_replace_editor` — create/view/edit/insert content in virtual files
   - `file_manager` — rename/delete files
3. Claude streams tool calls that modify the virtual file system
4. Client renders the file system state in a Monaco editor and sandboxed iframe

### Virtual File System

`src/lib/file-system.ts` implements an in-memory tree (no disk writes). Files live in React state, serialized to JSON for DB persistence. The `FileSystemContext` (`src/lib/contexts/file-system-context.tsx`) exposes this to components.

### Preview Rendering

`src/lib/transform/jsx-transformer.ts` uses Babel standalone to transform JSX to browser-compatible code in the client. It:
- Builds an import map pointing to `esm.sh` CDN URLs for npm packages
- Injects Tailwind CSS from CDN
- Returns an HTML string rendered in a sandboxed `<iframe>` via `PreviewFrame.tsx`

### AI Provider

`src/lib/provider.ts` returns either the real Anthropic model or `MockLanguageModel`. The mock simulates tool calls and generates hardcoded sample components (Counter, ContactForm, Card) — useful for development without an API key.

### Chat State

`src/lib/contexts/chat-context.tsx` wraps Vercel AI SDK's `useChat` hook. It manages message history, forwards the serialized virtual file system as context to the API, and handles anonymous vs. authenticated session differences.

### Authentication

JWT sessions via `jose`, stored in HTTP-only cookies (7-day expiry). `src/middleware.ts` verifies sessions on API routes. Passwords hashed with bcrypt. Server actions in `src/actions/` handle sign-up/sign-in.

### Database

Prisma + SQLite. Schema has two models:
- `User` — email/password
- `Project` — messages (JSON), data (JSON for virtual FS), optional userId

Generated client lives in `src/generated/` (not `node_modules`).

### Layout

`src/app/main-content.tsx` splits the UI into:
- Left 35%: `ChatInterface` (message list + input)
- Right 65%: tabs for **Preview** (`PreviewFrame`) and **Code** (file tree + Monaco editor)

The home page (`src/app/page.tsx`) redirects authenticated users to their latest project or creates a new one.
