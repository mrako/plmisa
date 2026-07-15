export type Task = {
  id: string;
  text: string;
  done: boolean;
};

export type Section = {
  id: string;
  name: string;
  tasks: Task[];
};

export type TaskState = {
  sections: Section[];
};
