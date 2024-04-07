import { type Activity } from '../types/Activity'

export type RoadmapStackParamList = {
  RoadmapTabs: undefined;
  Roadmap: undefined;
  GradeLevel: { year: number };
  Activity: { activityId: string };
  CreateUpdateActivity: { activity?: Activity };
}
