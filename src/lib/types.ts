export type Task = {
  id: string;
  text: string;
  done: boolean;
  responsible?: string;
};

export type Section = {
  id: string;
  name: string;
  tasks: Task[];
};

export type TaskState = {
  sections: Section[];
};
