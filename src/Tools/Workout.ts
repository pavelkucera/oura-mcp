import { z } from 'zod'
import { executeOuraTool, makeOuraTool } from '../Tool.ts'

export const SchemaWorkout = z.object({
  id: z.string(),
  activity: z.string(),
  calories: z.number(),
  day: z.string(),
  distance: z.number().nullable(),
  end_datetime: z.string().datetime({ offset: true }),
  intensity: z.enum(['easy', 'moderate', 'hard']),
  label: z.string().nullable(),
  source: z.enum(['manual', 'autodetected', 'confirmed', 'workout_heart_rate']),
  start_datetime: z.string().datetime({ offset: true }),
})

export const ToolMultipleWorkoutDocuments = (accessToken: string) => makeOuraTool({
  name: 'fetch_multiple_workout_documents',
  title: 'Fetch Multiple Workout Documents',
  description: 'Fetch workout data for a date range',
  inputSchema: {
    start_date: z.string().date(),
    end_date: z.string().date(),
  },
  outputSchema: {
    data: z.array(SchemaWorkout),
  },
  execute: ({ start_date, end_date }, extra) =>
    executeOuraTool(accessToken, `usercollection/workout?start_date=${start_date}&end_date=${end_date}`, extra),
})
