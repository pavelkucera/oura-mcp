# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) server that provides access to the Oura Ring API. It exposes Oura health data (sleep scores, readiness scores, enhanced tags, and detailed sleep information) through standardized MCP tools.

## Development Commands

```bash
# Type checking
npm run typecheck

# Linting
npm run lint
npm run lint:fix

# Testing
npm test
```

## Running the Server

The server requires an `OURA_ACCESS_TOKEN` environment variable. It runs as an MCP server using stdio transport and is designed to be integrated with MCP clients.

## Architecture

### Core Components

- **src/main.ts**: Entry point that sets up the MCP server and registers all Oura tools. Each tool maps to a specific Oura API endpoint with typed input/output schemas using Zod.

- **src/Oura/Tool.ts**: Executes Oura API calls and translates responses into MCP `CallToolResult` format. Handles errors and structured content.

- **src/Oura/Api.ts**: Handles HTTP communication with Oura API. Implements automatic pagination using `next_token` to exhaustively fetch all data from endpoints.

- **src/Logger.ts**: Structured JSON logging to stderr. Supports configurable log levels via `MIN_LOG_LEVEL` environment variable (debug/info/error).

- **src/Error.ts**: Error utilities including `wrapError` (wraps any value in Error) and `errorMessages` (extracts error message chain from nested errors).

### Type System

- **src/Types.ts**: Generic `Result<ErrorType, Result>` type for discriminated union error handling.
- **src/Oura/Types.ts**: Oura-specific types including `OuraResponseData` which models the paginated response structure.

## Code Conventions

- Uses Node.js native test runner (`node:test`) for testing
- ESM modules with `.ts` extensions in imports (enabled by `allowImportingTsExtensions`)
- Strict TypeScript with additional strict options (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- Single quotes for strings, 2-space indentation, no semicolons (enforced by @stylistic/eslint-plugin)
- Result types for error handling instead of throwing
- All logs go to stderr; MCP communication uses stdio

## Testing Approach

Tests use Node.js built-in test runner. Test files are colocated with source files using `*.test.ts` naming convention. Use `void` prefix for describe/it blocks to satisfy `no-floating-promises` eslint rule.
