import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import type { ZodRawShape } from 'zod'
import { log } from './Logger.ts'
import type { OuraTool } from './Types.ts'
import { ToolDailySleepScores } from './Tools/DailySleepScore.ts'
import { ToolDailyEnhancedTags } from './Tools/DailyEnhancedTags.ts'
import { ToolDailyReadinessScores } from './Tools/DailyReadinessScores.ts'
import { ToolSleepInformation } from './Tools/SleepInformation.ts'
import { ToolMultipleHeartRateDocuments } from './Tools/HeartRate.ts'

async function main() {
  const OURA_ACCESS_TOKEN = process.env['OURA_ACCESS_TOKEN']
  if (OURA_ACCESS_TOKEN == null || OURA_ACCESS_TOKEN === '') {
    throw new Error("Environment variable 'OURA_ACCESS_TOKEN' is empty")
  }

  // Initialize server
  const server = new McpServer({
    name: 'Oura Ring API',
    version: '1.0.0',
  })

  const registerTool = <InputArgs extends ZodRawShape, OutputArgs extends ZodRawShape>(
    tool: OuraTool<InputArgs, OutputArgs>,
  ) => {
    server.registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        inputSchema: tool.inputSchema,
        outputSchema: tool.outputSchema,
      },
      tool.execute,
    )
  }

  // Register tools
  registerTool(ToolDailySleepScores(OURA_ACCESS_TOKEN))
  registerTool(ToolDailyEnhancedTags(OURA_ACCESS_TOKEN))
  registerTool(ToolDailyReadinessScores(OURA_ACCESS_TOKEN))
  registerTool(ToolSleepInformation(OURA_ACCESS_TOKEN))
  registerTool(ToolMultipleHeartRateDocuments(OURA_ACCESS_TOKEN))

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
