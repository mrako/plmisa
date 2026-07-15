import { kv } from "@vercel/kv";
import { defaultState } from "./defaultState";
import type { TaskState } from "./types";

const STATE_KEY = "task-list:state";

const hasKvConfigured = Boolean(
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
);

// Used only when no Vercel KV store is configured (e.g. local development).
// State is per-process and resets on restart / is not shared across instances.
let memoryState: TaskState | null = null;

export async function getState(): Promise<TaskState> {
  if (hasKvConfigured) {
    const stored = await kv.get<TaskState>(STATE_KEY);
    return stored ?? defaultState();
  }
  return memoryState ?? defaultState();
}

export async function saveState(state: TaskState): Promise<void> {
  if (hasKvConfigured) {
    await kv.set(STATE_KEY, state);
  } else {
    memoryState = state;
  }
}
