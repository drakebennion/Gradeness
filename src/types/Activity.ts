import { Timestamp } from "firebase/firestore"

export interface Activity {
  activityId?: string
  complete: boolean
  createdAt: Date
  defaultActivityId?: string
  dueDate?: Timestamp
  testActivityId?: string
  description: {
    header: string,
    items: string[],
    footer: string,
  } | string,
  name: string
  order: number
  // todo: make an enum
  semester: string
  updatedAt: Date
  userId: string
  year: number,
  overview?: {
    header: string,
    items: string[],
  } | string,
}
