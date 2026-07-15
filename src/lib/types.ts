export const DAYS = ["To", "Pe", "La", "Su"] as const;
export type Day = (typeof DAYS)[number];

export type Task = {
  id: string;
  text: string;
  done: boolean;
  responsible?: string;
  note?: string;
  group?: string;
  day?: Day;
};

export type Section = {
  id: string;
  name: string;
  tasks: Task[];
};

export type TaskState = {
  sections: Section[];
};
