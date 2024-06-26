import { Timestamp } from 'firebase/firestore';

type CreateUpdateActivity = {
  notificationId?: string;
  dueDate?: Timestamp;
  activityId: string;
  name: string;
  semester: string;
  year: number;
  description: string | { header: string; items: string[]; footer: string };
};

export type RoadmapStackParamList = {
  RoadmapTabs: undefined;
  Roadmap: undefined;
  GradeLevel: { year: number };
  Activity: { activityId: string };
  CreateUpdateActivity: { activity?: CreateUpdateActivity };
};
