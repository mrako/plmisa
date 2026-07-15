import { get, put } from "@vercel/blob";
import { defaultState } from "./defaultState";
import type { Section, TaskState } from "./types";

const STATE_PATHNAME = "task-list/state.json";
const MAX_HISTORY_ENTRIES = 50;

const hasBlobConfigured = Boolean(
  process.env.BLOB_READ_WRITE_TOKEN ||
    (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID)
);

type HistoryEntry = {
  timestamp: string;
  sections: Section[];
};

// The shape actually persisted to storage: the current state plus a hidden
// history of previous versions. Never exposed to the client.
type StoredState = TaskState & { history?: HistoryEntry[] };

// Used only when no Vercel Blob store is configured (e.g. local development).
// State is per-process and resets on restart / is not shared across instances.
let memoryState: StoredState | null = null;

async function getStoredState(): Promise<StoredState> {
  if (hasBlobConfigured) {
    // useCache: false guarantees every visitor sees the latest saved state
    // instead of a potentially stale CDN-cached copy.
    const result = await get(STATE_PATHNAME, { access: "public", useCache: false });
    if (!result) return defaultState();
    const text = await new Response(result.stream).text();
    return JSON.parse(text) as StoredState;
  }
  return memoryState ?? defaultState();
}

export async function getState(): Promise<TaskState> {
  const stored = await getStoredState();
  return { sections: stored.sections };
}

export async function saveState(state: TaskState): Promise<void> {
  const previous = await getStoredState();
  const history: HistoryEntry[] = [
    ...(previous.history ?? []),
    { timestamp: new Date().toISOString(), sections: previous.sections },
  ].slice(-MAX_HISTORY_ENTRIES);
  const next: StoredState = { sections: state.sections, history };

  if (hasBlobConfigured) {
    await put(STATE_PATHNAME, JSON.stringify(next), {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
  } else {
    memoryState = next;
  }
}
