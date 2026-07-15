import type { TaskState } from "./types";

export function defaultState(): TaskState {
  return {
    sections: [
      { id: "work", name: "Work", tasks: [] },
      { id: "personal", name: "Personal", tasks: [] },
      { id: "shopping", name: "Shopping", tasks: [] },
    ],
  };
}
