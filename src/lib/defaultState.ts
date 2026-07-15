import type { TaskState } from "./types";
import { MISE_SEED, RAAKA_SEED, TODO_SEED, buildTasksFromSeed } from "./seedData";

export function defaultState(): TaskState {
  return {
    sections: [
      { id: "todo", name: "todo", tasks: buildTasksFromSeed(TODO_SEED, "todo") },
      { id: "misa", name: "misa", tasks: buildTasksFromSeed(MISE_SEED, "misa") },
      {
        id: "aineet",
        name: "aineet",
        tasks: buildTasksFromSeed(RAAKA_SEED, "raaka"),
      },
    ],
  };
}
