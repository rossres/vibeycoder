export interface UserProgress {
  completedTasks: Record<string, true>;
  lastUpdated: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  email?: string;
  createdAt: number;
  completedTaskCount: number;
  signupPromptShown: boolean;
  signupPromptDismissedAt?: number;
}
