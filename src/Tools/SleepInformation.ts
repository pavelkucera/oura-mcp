import { z } from 'zod'
import { executeOuraTool, makeOuraTool } from '../Tool.ts'

export const SchemaSleepInformation = z.object({
  day: z.string().date(),
  bedtime_start: z.string(),
  bedtime_end: z.string(),
})

export const ToolSleepInformation = (accessToken: string) => makeOuraTool({
  name: 'fetch_sleep_information',
  title: 'Fetch Detailed Sleep Information',
  description: 'Fetch Detailed Sleep Information',
  inputSchema: {
    start_date: z.string().date(),
    end_date: z.string().date(),
  },
  outputSchema: {
    data: z.array(SchemaSleepInformation),
  },
  execute: ({ start_date, end_date }, extra) =>
    executeOuraTool(accessToken, `usercollection/sleep?start_date=${start_date}&end_date=${end_date}`, extra),
})
