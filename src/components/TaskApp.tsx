"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Section, TaskState } from "@/lib/types";

const ALL_FILTER = "all" as const;
type SectionFilter = string | typeof ALL_FILTER;

function createId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function TaskApp() {
  const [state, setState] = useState<TaskState | null>(null);
  const [filter, setFilter] = useState<SectionFilter>(ALL_FILTER);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTaskText, setNewTaskText] = useState<Record<string, string>>({});
  const [newTaskResponsible, setNewTaskResponsible] = useState<Record<string, string>>({});

  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/state")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load tasks");
        return res.json();
      })
      .then((data: TaskState) => {
        if (cancelled) return;
        setState(data);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Could not load your tasks. Please refresh the page.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const persist = useCallback((nextState: TaskState) => {
    setState(nextState);
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextState),
      }).catch(() => {
        setError("Could not save your changes. Please check your connection.");
      });
    }, 300);
  }, []);

  const updateSections = useCallback(
    (updater: (sections: Section[]) => Section[]) => {
      setState((current) => {
        if (!current) return current;
        const next = { ...current, sections: updater(current.sections) };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  function addTask(sectionId: string) {
    const text = (newTaskText[sectionId] ?? "").trim();
    if (!text) return;
    const responsible = (newTaskResponsible[sectionId] ?? "").trim();
    updateSections((sections) =>
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              tasks: [
                ...s.tasks,
                {
                  id: createId(),
                  text,
                  done: false,
                  ...(responsible ? { responsible } : {}),
                },
              ],
            }
          : s
      )
    );
    setNewTaskText((prev) => ({ ...prev, [sectionId]: "" }));
    setNewTaskResponsible((prev) => ({ ...prev, [sectionId]: "" }));
  }

  function toggleTask(sectionId: string, taskId: string) {
    updateSections((sections) =>
      sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              tasks: s.tasks.map((t) =>
                t.id === taskId ? { ...t, done: !t.done } : t
              ),
            }
          : s
      )
    );
  }

  function deleteTask(sectionId: string, taskId: string) {
    updateSections((sections) =>
      sections.map((s) =>
        s.id === sectionId
          ? { ...s, tasks: s.tasks.filter((t) => t.id !== taskId) }
          : s
      )
    );
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-zinc-500">
        Loading tasks…
      </div>
    );
  }

  if (!state) {
    return (
      <div className="flex flex-1 items-center justify-center text-red-600">
        {error ?? "Something went wrong."}
      </div>
    );
  }

  const visibleSections =
    filter === ALL_FILTER
      ? state.sections
      : state.sections.filter((s) => s.id === filter);

  return (
    <div className="flex flex-1 flex-col sm:flex-row">
      <nav className="flex flex-col gap-1 border-b border-zinc-200 p-4 sm:w-56 sm:border-b-0 sm:border-r">
        <ul className="flex flex-row gap-1 overflow-x-auto sm:flex-col sm:overflow-visible">
          <li>
            <button
              onClick={() => setFilter(ALL_FILTER)}
              className={`flex w-full items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                filter === ALL_FILTER
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              All
            </button>
          </li>
          {state.sections.map((section) => {
            const remaining = section.tasks.filter((t) => !t.done).length;
            const isActive = filter === section.id;
            return (
              <li key={section.id}>
                <button
                  onClick={() => setFilter(section.id)}
                  className={`flex w-full items-center justify-between gap-2 whitespace-nowrap rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-zinc-900 text-white"
                      : "text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  <span>{section.name}</span>
                  {remaining > 0 && (
                    <span
                      className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-zinc-200 text-zinc-600"
                      }`}
                    >
                      {remaining}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <main className="flex-1 p-6">
        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-8">
          {visibleSections.map((section) => (
            <section key={section.id}>
              <h1 className="mb-4 text-xl font-semibold text-zinc-900">
                {section.name}
              </h1>

              <ul className="mb-4 flex flex-col gap-1">
                {section.tasks.length === 0 && (
                  <li className="text-sm text-zinc-500">No tasks yet.</li>
                )}
                {section.tasks.map((task) => (
                  <li
                    key={task.id}
                    className="group flex items-center gap-3 rounded-md px-2 py-2 hover:bg-zinc-50"
                  >
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(section.id, task.id)}
                      className="h-4 w-4 shrink-0 accent-zinc-900"
                    />
                    <span
                      className={`flex-1 text-sm ${
                        task.done ? "text-zinc-400 line-through" : "text-zinc-800"
                      }`}
                    >
                      {task.text}
                    </span>
                    {task.responsible && (
                      <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                        {task.responsible}
                      </span>
                    )}
                    <button
                      onClick={() => deleteTask(section.id, task.id)}
                      aria-label={`Delete task ${task.text}`}
                      title="Delete task"
                      className="shrink-0 rounded p-1 text-zinc-400 opacity-0 hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addTask(section.id);
                }}
                className="flex flex-wrap gap-2"
              >
                <input
                  value={newTaskText[section.id] ?? ""}
                  onChange={(e) =>
                    setNewTaskText((prev) => ({ ...prev, [section.id]: e.target.value }))
                  }
                  placeholder="Add a task…"
                  maxLength={500}
                  className="min-w-0 flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
                <input
                  value={newTaskResponsible[section.id] ?? ""}
                  onChange={(e) =>
                    setNewTaskResponsible((prev) => ({
                      ...prev,
                      [section.id]: e.target.value,
                    }))
                  }
                  placeholder="Responsible (optional)"
                  maxLength={100}
                  className="w-40 min-w-0 rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-500"
                />
                <button
                  type="submit"
                  className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Add
                </button>
              </form>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
