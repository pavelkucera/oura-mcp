import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import type { CallToolResult, ServerNotification, ServerRequest } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'
import type { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js'
import { executeOuraTool } from './Oura/Tool.ts'
import { log } from './Logger.ts'

async function main() {
  const OURA_ACCESS_TOKEN = process.env['OURA_ACCESS_TOKEN']
  if (OURA_ACCESS_TOKEN == null || OURA_ACCESS_TOKEN === '') {
    throw new Error("Environment variable 'OURA_ACCESS_TOKEN' is empty")
  }

  const ouraTool = async (
    path: string,
    extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
  ): Promise<CallToolResult> => {
    return executeOuraTool(OURA_ACCESS_TOKEN, path, extra)
  }

  const server = new McpServer({
    name: 'Oura Ring API',
    version: '1.0.0',
  })

  server.registerTool(
    'fetch_daily_sleep_scores',
    {
      title: 'Fetch Daily Sleep Scores',
      description: 'Fetch daily sleep scores',
      inputSchema: {
        start_date: z.string().date(),
        end_date: z.string().date(),
      },
      outputSchema: {
        data: z.array(z.object({
          day: z.string().date(),
          score: z.number().min(0).max(100).nullable(),
          contributors: z.object({
            deep_sleep: z.number(),
            efficiency: z.number(),
            latency: z.number(),
            rem_sleep: z.number(),
            restfulness: z.number(),
            timing: z.number(),
            total_sleep: z.number(),
          }),
        })),
      },
    },
    async ({ start_date, end_date }, extra) =>
      ouraTool(`usercollection/daily_sleep?start_date=${start_date}&end_date=${end_date}`, extra),
  )

  server.registerTool(
    'fetch_daily_enhanced_tags',
    {
      title: 'Fetch Daily Enhanced Tags',
      description: 'Fetch Daily Enhanced Tags',
      inputSchema: {
        start_date: z.string().date(),
        end_date: z.string().date(),
      },
      outputSchema: {
        data: z.array(z.object({
          tag_type_code: z.string(),
          start_day: z.string().date(),
          custom_name: z.string().nullable(),
        })),
      },
    },
    async ({ start_date, end_date }, extra) =>
      ouraTool(`usercollection/enhanced_tag?start_date=${start_date}&end_date=${end_date}`, extra),
  )

  server.registerTool(
    'fetch_daily_readiness_scores',
    {
      title: 'Fetch Daily Readiness Scores',
      description: 'Fetch Daily Readiness Scores',
      inputSchema: {
        start_date: z.string().date(),
        end_date: z.string().date(),
      },
      outputSchema: {
        data: z.array(z.object({
          day: z.string().date(),
          score: z.number().min(0).max(100).nullish(),
          temperature_deviation: z.number().nullish(),
          temperature_trend_deviation: z.number().nullish(),
          contributors: z.object({
            activity_balance: z.number().nullish(),
            body_temperature: z.number().nullish(),
            hrv_balance: z.number().nullish(),
            previous_day_activity: z.number().nullish(),
            previous_night: z.number().nullish(),
            recovery_index: z.number().nullish(),
            resting_heart_rate: z.number().nullish(),
            sleep_balance: z.number().nullish(),
          }),
        })),
      },
    },
    async ({ start_date, end_date }, extra) =>
      ouraTool(`usercollection/daily_readiness?start_date=${start_date}&end_date=${end_date}`, extra),
  )

  server.registerTool(
    'fetch_sleep_information',
    {
      title: 'Fetch Detailed Sleep Information',
      description: 'Fetch Detailed Sleep Information',
      inputSchema: {
        start_date: z.string().date(),
        end_date: z.string().date(),
      },
      outputSchema: {
        data: z.array(z.object({
          day: z.string().date(),
          bedtime_start: z.string(),
          bedtime_end: z.string(),
        })),
      },
    },
    async ({ start_date, end_date }, extra) =>
      ouraTool(`usercollection/sleep?start_date=${start_date}&end_date=${end_date}`, extra),
  )

  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Oura MCP server running using stdio')

  // eslint-disable-next-line @typescript-eslint/no-misused-promises -- false alarm
  process.on('SIGINT', async () => {
    await server.close()
  })
}

main().catch((error: unknown) => {
  log.error('Main failed', { error })
  process.exit(1)
})
