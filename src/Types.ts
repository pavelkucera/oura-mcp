import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { ZodRawShape } from 'zod'

export type Result<ErrorType, Result>
  = | { type: 'error', error: ErrorType }
    | { type: 'result', result: Result }

export type OuraTool<InputArgs extends ZodRawShape, OutputArgs extends ZodRawShape>
  = {
    name: string
    title: string
    description: string
    inputSchema: InputArgs
    outputSchema: OutputArgs
    execute: ToolCallback<InputArgs>
  }
