import { Timestamp } from 'firebase/firestore';

export interface Activity {
  activityId?: string;
  complete: boolean;
  createdAt: Date;
  defaultActivityId?: string;
  testActivityId?: string;
  description:
    | {
        header: string;
        items: string[];
        footer: string;
      }
    | string;
  name: string;
  order: number;
  // todo: make an enum
  semester: string;
  updatedAt: Date;
  userId: string;
  year: number;
  dueDate?: Timestamp;
  notificationId?: string;
  overview?:
    | {
        header: string;
        items: string[];
      }
    | string;
  tags?: string[];
}
