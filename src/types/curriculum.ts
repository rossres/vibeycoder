export interface Task {
  text: string;
  type: "action" | "reflect";
  how: string;
  why: string;
}

export interface Day {
  day: number;
  title: string;
  time: string;
  objective: string;
  keyTakeaway: string;
  proTip: string;
  tasks: Task[];
}

export interface Week {
  week: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  days: Day[];
}
