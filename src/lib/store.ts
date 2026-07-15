import { get, put } from "@vercel/blob";
import { defaultState } from "./defaultState";
import type { TaskState } from "./types";

const STATE_PATHNAME = "task-list/state.json";

const hasBlobConfigured = Boolean(
  process.env.BLOB_READ_WRITE_TOKEN ||
    (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID)
);

// Used only when no Vercel Blob store is configured (e.g. local development).
// State is per-process and resets on restart / is not shared across instances.
let memoryState: TaskState | null = null;

export async function getState(): Promise<TaskState> {
  if (hasBlobConfigured) {
    // useCache: false guarantees every visitor sees the latest saved state
    // instead of a potentially stale CDN-cached copy.
    const result = await get(STATE_PATHNAME, { access: "public", useCache: false });
    if (!result) return defaultState();
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as TaskState;
  }
  return memoryState ?? defaultState();
}

export async function saveState(state: TaskState): Promise<void> {
  if (hasBlobConfigured) {
    await put(STATE_PATHNAME, JSON.stringify(state), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
  } else {
    memoryState = state;
  }
}
