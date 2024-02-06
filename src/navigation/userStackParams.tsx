import { type Activity } from '../types/Activity'

export type RoadmapStackParamList = {
  RoadmapHome: undefined;
  GradeLevel: { year: number };
  Activity: { activityId: string };
  CreateUpdateActivity: { activity?: Activity };
}
