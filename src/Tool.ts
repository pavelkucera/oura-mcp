import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js'
import type { CallToolResult, ServerNotification, ServerRequest } from '@modelcontextprotocol/sdk/types.js'
import { log } from './Logger.ts'
import * as util from 'node:util'
import { fetchOuraData } from './Oura/Api.ts'
import { errorMessages } from './Error.ts'
import type { ZodRawShape } from 'zod'
import type { OuraTool } from './Types.ts'

/** Executes Oura Tool -- an API call -- and translates the response into MCP CallToolResult */
export const executeOuraTool = async (
  accessToken: string,
  path: string,
  extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
): Promise<CallToolResult> => {
  try {
    const response = await fetchOuraData(accessToken, path, extra.requestId, {
      signal: extra.signal,
    })

    if (response.type === 'error') {
      log.info('Oura tool returned an error response')
      return mcpResponseError(response.error)
    }

    const data = response.result
    return {
      content: [
        { type: 'text', text: JSON.stringify(data) },
      ],
      structuredContent: { data },
    }
  }
  catch (error: unknown) {
    log.error('Failed to execute Oura tool', { error })
    return mcpResponseError(error)
  }
}

const mcpResponseError = (error: unknown): CallToolResult => {
  return {
    isError: true,
    content: [
      {
        type: 'text',
        text: `${errorMessages(error).join(' - ')}\n\n${util.inspect(error)}`,
      },
    ],
  }
}

export const makeOuraTool = <InputArgs extends ZodRawShape, OutputArgs extends ZodRawShape>(
  definition: OuraTool<InputArgs, OutputArgs>,
) =>
  definition
