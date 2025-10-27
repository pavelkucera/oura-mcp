import { z } from 'zod'
import { executeOuraTool, makeOuraTool } from '../Tool.ts'

export const SchemaDailySleepScore = z.object({
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
    // id: z.string(),
    // timestamp: z.number(),
  }),
})

export const ToolDailySleepScores = (accessToken: string) => makeOuraTool({
  name: 'fetch_daily_sleep_scores',
  title: 'Fetch Daily Sleep Scores',
  description: 'Fetch daily sleep scores',
  inputSchema: {
    start_date: z.string().date(),
    end_date: z.string().date(),
  },
  outputSchema: {
    data: z.array(SchemaDailySleepScore),
  },
  execute: ({ start_date, end_date }, extra) =>
    executeOuraTool(accessToken, `usercollection/daily_sleep?start_date=${start_date}&end_date=${end_date}`, extra),
})
