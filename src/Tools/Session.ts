import { z } from 'zod'
import { executeOuraTool, makeOuraTool } from '../Tool.ts'

const SchemaTimeSeriesData = z.object({
  interval: z.number(),
  items: z.array(z.number().nullable()),
  timestamp: z.string(),
})

export const SchemaSession = z.object({
  id: z.string(),
  day: z.string().date(),
  start_datetime: z.string(),
  end_datetime: z.string(),
  type: z.string(),
  heart_rate: SchemaTimeSeriesData.nullable(),
  heart_rate_variability: SchemaTimeSeriesData.nullable(),
  mood: z.string().nullable(),
  motion_count: SchemaTimeSeriesData.nullable(),
})

export const ToolMultipleSessionDocuments = (accessToken: string) => makeOuraTool({
  name: 'fetch_multiple_session_documents',
  title: 'Fetch Multiple Session Documents',
  description: 'Fetch session data (breathing, meditation, etc.) for a date range',
  inputSchema: {
    start_date: z.string().date(),
    end_date: z.string().date(),
  },
  outputSchema: {
    data: z.array(SchemaSession),
  },
  execute: ({ start_date, end_date }, extra) =>
    executeOuraTool(accessToken, `usercollection/session?start_date=${start_date}&end_date=${end_date}`, extra),
})
