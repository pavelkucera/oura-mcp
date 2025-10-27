import { z } from 'zod'
import { executeOuraTool, makeOuraTool } from '../Tool.ts'

export const SchemaDailyReadinessScore = z.object({
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
})

export const ToolDailyReadinessScores = (accessToken: string) => makeOuraTool({
  name: 'fetch_daily_readiness_scores',
  title: 'Fetch Daily Readiness Scores',
  description: 'Fetch Daily Readiness Scores',
  inputSchema: {
    start_date: z.string().date(),
    end_date: z.string().date(),
  },
  outputSchema: {
    data: z.array(SchemaDailyReadinessScore),
  },
  execute: ({ start_date, end_date }, extra) =>
    executeOuraTool(accessToken, `usercollection/daily_readiness?start_date=${start_date}&end_date=${end_date}`, extra),
})
