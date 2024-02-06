import { type Activity } from '../types/Activity'

export interface UserStackParamList {
  Roadmap: undefined
  GradeLevel: { year: number }
  Activity: { activityId: string }
  CreateUpdateActivity: { activity?: Activity }
}
