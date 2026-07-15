import type { Section, Task, TaskState } from "./types";

const MAX_SECTIONS = 50;
const MAX_TASKS_PER_SECTION = 500;
const MAX_TEXT_LENGTH = 500;
const MAX_NAME_LENGTH = 100;
const MAX_ID_LENGTH = 100;
const MAX_RESPONSIBLE_LENGTH = 100;
const MAX_NOTE_LENGTH = 300;
const MAX_GROUP_LENGTH = 100;

function isNonEmptyShortString(value: unknown, maxLength: number): value is string {
  return (
    typeof value === "string" && value.trim().length > 0 && value.length <= maxLength
  );
}

function isValidTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) return false;
  const task = value as Record<string, unknown>;
  return (
    isNonEmptyShortString(task.id, MAX_ID_LENGTH) &&
    typeof task.text === "string" &&
    task.text.length > 0 &&
    task.text.length <= MAX_TEXT_LENGTH &&
    typeof task.done === "boolean" &&
    (task.responsible === undefined ||
      (typeof task.responsible === "string" &&
        task.responsible.length <= MAX_RESPONSIBLE_LENGTH)) &&
    (task.note === undefined ||
      (typeof task.note === "string" && task.note.length <= MAX_NOTE_LENGTH)) &&
    (task.group === undefined ||
      (typeof task.group === "string" && task.group.length <= MAX_GROUP_LENGTH))
  );
}

function isValidSection(value: unknown): value is Section {
  if (typeof value !== "object" || value === null) return false;
  const section = value as Record<string, unknown>;
  return (
    isNonEmptyShortString(section.id, MAX_ID_LENGTH) &&
    isNonEmptyShortString(section.name, MAX_NAME_LENGTH) &&
    Array.isArray(section.tasks) &&
    section.tasks.length <= MAX_TASKS_PER_SECTION &&
    section.tasks.every(isValidTask)
  );
}

export function isValidTaskState(value: unknown): value is TaskState {
  if (typeof value !== "object" || value === null) return false;
  const state = value as Record<string, unknown>;
  return (
    Array.isArray(state.sections) &&
    state.sections.length <= MAX_SECTIONS &&
    state.sections.every(isValidSection)
  );
}
