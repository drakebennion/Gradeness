import { Activity } from "../types/Activity";

export type UserStackParamList = {
    Roadmap: undefined;
    GradeLevel: { year: number };
    Activity: { activityId: string };
    CreateUpdateActivity: { activity?: Activity };
};