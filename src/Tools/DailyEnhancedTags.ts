import { z } from 'zod'
import { executeOuraTool, makeOuraTool } from '../Tool.ts'

export const SchemaDailyEnhancedTag = z.object({
  tag_type_code: z.string(),
  start_day: z.string().date(),
  custom_name: z.string().nullable(),
})

export const ToolDailyEnhancedTags = (accessToken: string) => makeOuraTool({
  name: 'fetch_daily_enhanced_tags',
  title: 'Fetch Daily Enhanced Tags',
  description: 'Fetch Daily Enhanced Tags',
  inputSchema: {
    start_date: z.string().date(),
    end_date: z.string().date(),
  },
  outputSchema: {
    data: z.array(SchemaDailyEnhancedTag),
  },
  execute: ({ start_date, end_date }, extra) =>
    executeOuraTool(accessToken, `usercollection/enhanced_tag?start_date=${start_date}&end_date=${end_date}`, extra),
})
