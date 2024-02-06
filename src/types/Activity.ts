export interface Activity {
  activityId?: string
  complete: boolean
  createdAt: Date
  defaultActivityId?: string
  description: string
  // todo: rename to 'name'
  objective: string
  order: number
  // todo: make an enum
  semester: string
  updatedAt: Date
  userId: string
  year: number
}
