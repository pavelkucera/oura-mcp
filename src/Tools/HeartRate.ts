import { z } from 'zod'
import { executeOuraTool, makeOuraTool } from '../Tool.ts'

export const SchemaHeartRate = z.object({
  bpm: z.number(),
  source: z.string(),
  timestamp: z.string().datetime({ offset: true }),
})

export const ToolMultipleHeartRateDocuments = (accessToken: string) => makeOuraTool({
  name: 'fetch_multiple_heart_rate_documents',
  title: 'Fetch timeseries of heart rate values',
  description: 'Fetch Heart Rate information',
  inputSchema: {
    start_datetime: z.string().datetime(),
    end_datetime: z.string().datetime(),
  },
  outputSchema: {
    data: z.array(SchemaHeartRate),
  },
  execute: ({ start_datetime, end_datetime }, extra) =>
    executeOuraTool(accessToken, `usercollection/heartrate?start_datetime=${start_datetime}&end_date=${end_datetime}`, extra),
})
