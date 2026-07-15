"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  const [openAddForm, setOpenAddForm] = useState<Record<string, boolean>>({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const hideDone = searchParams.get("hideDone") === "1";

  function toggleHideDone() {
    const params = new URLSearchParams(searchParams.toString());
    if (hideDone) {
      params.delete("hideDone");
    } else {
      params.set("hideDone", "1");
    }
    const query = params.toString();
    router.replace(query ? `?${query}` : "?", { scroll: false });
  }

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
      <div className="flex flex-1 items-center justify-center text-muted">
        Loading tasks…
      </div>
    );
  }

  if (!state) {
    return (
      <div className="flex flex-1 items-center justify-center text-warn">
        {error ?? "Something went wrong."}
      </div>
    );
  }

  const visibleSections =
    filter === ALL_FILTER
      ? state.sections
      : state.sections.filter((s) => s.id === filter);

  return (
    <div className="flex flex-1 flex-col bg-background">
      <header className="bg-accent px-4 py-4 text-center text-white sm:px-6 sm:py-5">
        <h1 className="font-heading text-xl font-semibold sm:text-2xl">
          Pekka + Liina 90v
        </h1>
        <p className="mt-0.5 text-xs text-white/80 sm:text-sm">
          Yhteinen tehtävälista
        </p>
      </header>

      <div className="flex flex-1 flex-col sm:flex-row">
      <nav className="flex flex-col gap-1 border-b border-line bg-card p-2 sm:w-56 sm:border-b-0 sm:border-r sm:p-4">
        <ul className="flex flex-row flex-wrap gap-1 sm:flex-col sm:flex-nowrap">
          <li>
            <button
              onClick={() => setFilter(ALL_FILTER)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-left font-heading text-xs font-medium transition-colors sm:w-full sm:px-3 sm:py-2 sm:text-sm ${
                filter === ALL_FILTER
                  ? "border-accent bg-accent text-white"
                  : "border-line text-foreground hover:bg-accent-light"
              }`}
            >
              kaikki
            </button>
          </li>
          {state.sections.map((section) => {
            const remaining = section.tasks.filter((t) => !t.done).length;
            const isActive = filter === section.id;
            return (
              <li key={section.id}>
                <button
                  onClick={() => setFilter(section.id)}
                  className={`flex items-center justify-between gap-2 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-left font-heading text-xs font-medium transition-colors sm:w-full sm:px-3 sm:py-2 sm:text-sm ${
                    isActive
                      ? "border-accent bg-accent text-white"
                      : "border-line text-foreground hover:bg-accent-light"
                  }`}
                >
                  <span>{section.name}</span>
                  {remaining > 0 && (
                    <span
                      className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-accent-light text-accent"
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
          <div className="mb-4 rounded-md bg-warn-bg px-3 py-2 text-sm text-warn">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-8">
          {visibleSections.map((section) => {
            const isFormOpen = Boolean(openAddForm[section.id]);
            const visibleTasks = hideDone
              ? section.tasks.filter((t) => !t.done)
              : section.tasks;
            return (
              <section
                key={section.id}
                className="rounded-2xl border border-line bg-card p-4 shadow-sm sm:p-6"
              >
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h1 className="font-heading text-2xl font-semibold text-accent">
                    {section.name}
                  </h1>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={toggleHideDone}
                      aria-pressed={hideDone}
                      aria-label={hideDone ? "Show finished tasks" : "Hide finished tasks"}
                      title={hideDone ? "Show finished tasks" : "Hide finished tasks"}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        hideDone
                          ? "border-accent bg-accent text-white"
                          : "border-line text-muted hover:bg-accent-light hover:text-accent"
                      }`}
                    >
                      ✓
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenAddForm((prev) => ({
                          ...prev,
                          [section.id]: !prev[section.id],
                        }))
                      }
                      aria-label={isFormOpen ? "Hide add task form" : "Show add task form"}
                      title={isFormOpen ? "Hide add task form" : "Add a task"}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-accent hover:bg-accent-light"
                    >
                      {isFormOpen ? "−" : "+"}
                    </button>
                  </div>
                </div>

                <ul className="mb-4 flex flex-col gap-1">
                  {visibleTasks.length === 0 && (
                    <li className="text-sm text-muted">
                      {section.tasks.length === 0
                        ? "No tasks yet."
                        : "All done — finished tasks are hidden."}
                    </li>
                  )}
                  {visibleTasks.map((task) => (
                    <li
                      key={task.id}
                      className="group flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md px-2 py-2 hover:bg-accent-light/40"
                    >
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(section.id, task.id)}
                        className="h-4 w-4 shrink-0 accent-ok"
                      />
                      <span
                        className={`min-w-0 flex-1 font-heading text-sm font-medium ${
                          task.done ? "text-muted line-through" : "text-foreground"
                        }`}
                      >
                        {task.text}
                      </span>
                      {task.responsible && (
                        <span className="order-last ml-7 block w-full sm:ml-0 sm:contents">
                          <span className="inline-block rounded-full bg-accent-light px-2 py-0.5 text-xs font-medium text-accent">
                            {task.responsible}
                          </span>
                        </span>
                      )}
                      <button
                        onClick={() => deleteTask(section.id, task.id)}
                        aria-label={`Delete task ${task.text}`}
                        title="Delete task"
                        className="shrink-0 rounded p-1 text-muted opacity-0 hover:bg-warn-bg hover:text-warn group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>

                {isFormOpen && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      addTask(section.id);
                    }}
                    className="flex flex-col gap-2"
                  >
                    <input
                      autoFocus
                      value={newTaskText[section.id] ?? ""}
                      onChange={(e) =>
                        setNewTaskText((prev) => ({ ...prev, [section.id]: e.target.value }))
                      }
                      placeholder="Add a task…"
                      maxLength={500}
                      className="min-w-0 w-full rounded-md border border-line px-2.5 py-1.5 text-sm outline-none focus:border-accent"
                    />
                    <div className="flex gap-2">
                      <input
                        value={newTaskResponsible[section.id] ?? ""}
                        onChange={(e) =>
                          setNewTaskResponsible((prev) => ({
                            ...prev,
                            [section.id]: e.target.value,
                          }))
                        }
                        placeholder="Responsible"
                        maxLength={100}
                        className="w-32 min-w-0 flex-1 rounded-md border border-line px-2.5 py-1.5 text-xs outline-none focus:border-accent sm:w-40 sm:flex-none sm:text-sm"
                      />
                      <button
                        type="submit"
                        className="rounded-full bg-accent px-3 py-1.5 text-xs font-medium text-white hover:brightness-110 sm:text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </form>
                )}
              </section>
            );
          })}
        </div>
      </main>
      </div>
    </div>
  );

}
