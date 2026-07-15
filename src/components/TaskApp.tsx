"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Section, Task, TaskState } from "@/lib/types";
import { DAYS } from "@/lib/types";

const ALL_FILTER = "all" as const;
type SectionFilter = string | typeof ALL_FILTER;
const ALL_DAYS = "all" as const;
type DayFilter = (typeof DAYS)[number] | typeof ALL_DAYS;
const LONG_PRESS_MS = 500;

type ModalState =
  | { mode: "add"; sectionId: string }
  | { mode: "edit"; sectionId: string; taskId: string };

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
  const [searchQuery, setSearchQuery] = useState("");
  const [dayFilter, setDayFilter] = useState<DayFilter>(ALL_DAYS);
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const dragState = useRef<{ sectionId: string; taskId: string } | null>(null);
  const taskRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  const [modal, setModal] = useState<ModalState | null>(null);
  const [modalText, setModalText] = useState("");
  const [modalResponsible, setModalResponsible] = useState("");
  const [modalGroup, setModalGroup] = useState("");
  const [modalDay, setModalDay] = useState("");
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTriggered = useRef(false);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const pointerMoved = useRef(false);

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
    if (!modal) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setModal(null);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modal]);

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
        setError("Tehtävien lataus epäonnistui. Päivitä sivu.");
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
        setError("Muutosten tallennus epäonnistui. Tarkista yhteytesi.");
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

  function openAddModal(sectionId: string) {
    setModalText("");
    setModalResponsible("");
    setModalGroup("");
    setModalDay("");
    setModal({ mode: "add", sectionId });
  }

  function openEditModal(sectionId: string, task: Task) {
    setModalText(task.text);
    setModalResponsible(task.responsible ?? "");
    setModalGroup(task.group ?? "");
    setModalDay(task.day ?? "");
    setModal({ mode: "edit", sectionId, taskId: task.id });
  }

  function closeModal() {
    setModal(null);
  }

  function submitModal(e: React.FormEvent) {
    e.preventDefault();
    if (!modal) return;
    const text = modalText.trim();
    if (!text) return;
    const responsible = modalResponsible.trim();
    const group = modalGroup.trim();
    const day = modalDay as (typeof DAYS)[number] | "";

    if (modal.mode === "add") {
      updateSections((sections) =>
        sections.map((s) =>
          s.id === modal.sectionId
            ? {
                ...s,
                tasks: [
                  ...s.tasks,
                  {
                    id: createId(),
                    text,
                    done: false,
                    ...(responsible ? { responsible } : {}),
                    ...(group ? { group } : {}),
                    ...(day ? { day } : {}),
                  },
                ],
              }
            : s
        )
      );
    } else {
      const { sectionId, taskId } = modal;
      updateSections((sections) =>
        sections.map((s) =>
          s.id === sectionId
            ? {
                ...s,
                tasks: s.tasks.map((t) =>
                  t.id === taskId
                    ? {
                        ...t,
                        text,
                        responsible: responsible || undefined,
                        group: group || undefined,
                        day: day || undefined,
                      }
                    : t
                ),
              }
            : s
        )
      );
    }
    closeModal();
  }

  function handleTaskPointerDown(e: React.PointerEvent, sectionId: string, task: Task) {
    pointerStart.current = { x: e.clientX, y: e.clientY };
    pointerMoved.current = false;
    longPressTriggered.current = false;
    longPressTimer.current = setTimeout(() => {
      if (pointerMoved.current) return;
      longPressTriggered.current = true;
      toggleTask(sectionId, task.id);
    }, LONG_PRESS_MS);
  }

  function handleTaskPointerMove(e: React.PointerEvent) {
    const start = pointerStart.current;
    if (!start) return;
    const MOVE_THRESHOLD_PX = 10;
    const dx = Math.abs(e.clientX - start.x);
    const dy = Math.abs(e.clientY - start.y);
    if (dx > MOVE_THRESHOLD_PX || dy > MOVE_THRESHOLD_PX) {
      pointerMoved.current = true;
      cancelLongPress();
    }
  }

  function handleTaskPointerUp(sectionId: string, task: Task) {
    cancelLongPress();
    const moved = pointerMoved.current;
    const triggered = longPressTriggered.current;
    pointerStart.current = null;
    pointerMoved.current = false;
    longPressTriggered.current = false;
    if (moved || triggered) return;
    openEditModal(sectionId, task);
  }

  function cancelLongPress() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  function resetTaskPointer() {
    cancelLongPress();
    pointerStart.current = null;
    pointerMoved.current = false;
    longPressTriggered.current = false;
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

  function reorderTask(sectionId: string, taskId: string, targetTaskId: string) {
    updateSections((sections) =>
      sections.map((s) => {
        if (s.id !== sectionId) return s;
        const tasks = [...s.tasks];
        const fromIndex = tasks.findIndex((t) => t.id === taskId);
        const toIndex = tasks.findIndex((t) => t.id === targetTaskId);
        if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return s;
        const [moved] = tasks.splice(fromIndex, 1);
        tasks.splice(toIndex, 0, moved);
        return { ...s, tasks };
      })
    );
  }

  function handleDragPointerDown(
    e: React.PointerEvent<HTMLSpanElement>,
    sectionId: string,
    taskId: string
  ) {
    e.preventDefault();
    dragState.current = { sectionId, taskId };
    setDraggingTaskId(taskId);
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handleDragPointerMove(e: React.PointerEvent<HTMLSpanElement>) {
    const drag = dragState.current;
    if (!drag) return;
    const y = e.clientY;
    for (const [id, el] of taskRefs.current) {
      if (id === drag.taskId) continue;
      const rect = el.getBoundingClientRect();
      if (y >= rect.top && y <= rect.bottom) {
        reorderTask(drag.sectionId, drag.taskId, id);
        break;
      }
    }
  }

  function handleDragPointerUp() {
    dragState.current = null;
    setDraggingTaskId(null);
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-muted">
        Ladataan tehtäviä…
      </div>
    );
  }

  if (!state) {
    return (
      <div className="flex flex-1 items-center justify-center text-warn">
        {error ?? "Jokin meni pieleen."}
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
              className={`flex h-8 items-center gap-2 whitespace-nowrap rounded-full border px-2.5 text-left font-heading text-xs font-medium transition-colors sm:h-9 sm:w-full sm:px-3 sm:text-sm ${
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
                  className={`flex h-8 items-center justify-between gap-2 whitespace-nowrap rounded-full border px-2.5 text-left font-heading text-xs font-medium transition-colors sm:h-9 sm:w-full sm:px-3 sm:text-sm ${
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

        <div className="mb-6 flex flex-wrap gap-2">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Hae tehtäviä tai vastuuhenkilöä…"
            className="w-full flex-1 rounded-md border border-line bg-card px-3 py-2 text-sm outline-none focus:border-accent sm:max-w-xs"
          />
          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value as DayFilter)}
            className="rounded-md border border-line bg-card px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option value={ALL_DAYS}>Päivä</option>
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-8">
          {visibleSections.map((section) => {
            const query = searchQuery.trim().toLowerCase();
            const visibleTasks = section.tasks
              .filter((t) => {
                if (hideDone && t.done) return false;
                if (dayFilter !== ALL_DAYS && t.day !== dayFilter) return false;
                if (!query) return true;
                return (
                  t.text.toLowerCase().includes(query) ||
                  (t.responsible ?? "").toLowerCase().includes(query) ||
                  (t.note ?? "").toLowerCase().includes(query) ||
                  (t.group ?? "").toLowerCase().includes(query)
                );
              })
              .sort((a, b) => Number(a.done) - Number(b.done));
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
                      aria-label={hideDone ? "Näytä tehdyt tehtävät" : "Piilota tehdyt tehtävät"}
                      title={hideDone ? "Näytä tehdyt tehtävät" : "Piilota tehdyt tehtävät"}
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
                      onClick={() => openAddModal(section.id)}
                      aria-label="Lisää tehtävä"
                      title="Lisää tehtävä"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-accent hover:bg-accent-light"
                    >
                      +
                    </button>
                  </div>
                </div>

                <ul className="mb-4 flex flex-col gap-1">
                  {visibleTasks.length === 0 && (
                    <li className="text-sm text-muted">
                      {section.tasks.length === 0
                        ? "Ei tehtäviä vielä."
                        : query
                        ? "Ei osumia."
                        : "Kaikki tehty — tehdyt tehtävät on piilotettu."}
                    </li>
                  )}
                  {visibleTasks.map((task) => (
                    <li
                      key={task.id}
                      ref={(el) => {
                        if (el) taskRefs.current.set(task.id, el);
                        else taskRefs.current.delete(task.id);
                      }}
                      className={`group flex flex-wrap items-center gap-x-3 gap-y-1 rounded-md px-2 py-2 hover:bg-accent-light/40 ${
                        draggingTaskId === task.id ? "opacity-50" : ""
                      }`}
                    >
                      {!task.done && !query && (
                        <span
                          onPointerDown={(e) => handleDragPointerDown(e, section.id, task.id)}
                          onPointerMove={handleDragPointerMove}
                          onPointerUp={handleDragPointerUp}
                          onPointerCancel={handleDragPointerUp}
                          aria-hidden="true"
                          title="Raahaa järjestääksesi"
                          className="shrink-0 cursor-grab touch-none select-none px-0.5 text-muted active:cursor-grabbing"
                        >
                          ⋮⋮
                        </span>
                      )}
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(section.id, task.id)}
                        className="h-4 w-4 shrink-0 accent-ok"
                      />
                      <div
                        onPointerDown={(e) => handleTaskPointerDown(e, section.id, task)}
                        onPointerMove={handleTaskPointerMove}
                        onPointerUp={() => handleTaskPointerUp(section.id, task)}
                        onPointerLeave={resetTaskPointer}
                        onPointerCancel={resetTaskPointer}
                        onContextMenu={(e) => e.preventDefault()}
                        className="min-w-0 flex-1 cursor-pointer select-none"
                      >
                        <div
                          className={`font-heading text-sm font-medium ${
                            task.done ? "text-muted line-through" : "text-foreground"
                          }`}
                        >
                          {task.text}
                        </div>
                      </div>
                      {!task.done && task.day && (
                        <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-xs font-medium text-muted">
                          {task.day}
                        </span>
                      )}
                      {!task.done && task.responsible && (
                        <span className="order-last ml-7 flex w-full flex-wrap gap-1 sm:ml-0 sm:contents">
                          {task.responsible
                            .split(",")
                            .map((name) => name.trim())
                            .filter(Boolean)
                            .map((name) => (
                              <span
                                key={name}
                                className="inline-block rounded-full bg-accent-light px-2 py-0.5 text-xs font-medium text-accent"
                              >
                                {name}
                              </span>
                            ))}
                        </span>
                      )}
                      {task.done && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Poistetaanko tehtävä "${task.text}"?`)) {
                              deleteTask(section.id, task.id);
                            }
                          }}
                          aria-label={`Poista tehtävä ${task.text}`}
                          title="Poista tehtävä"
                          className="shrink-0 rounded p-1 text-muted hover:bg-warn-bg hover:text-warn"
                        >
                          ✕
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </main>
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-card p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 font-heading text-lg font-semibold text-accent">
              {modal.mode === "add" ? "Lisää tehtävä" : "Muokkaa tehtävää"}
            </h2>
            <form onSubmit={submitModal} className="flex flex-col gap-3">
              <input
                autoFocus
                value={modalText}
                onChange={(e) => setModalText(e.target.value)}
                placeholder="Tehtävä"
                maxLength={500}
                className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <div className="flex gap-2">
                <input
                  value={modalGroup}
                  onChange={(e) => setModalGroup(e.target.value)}
                  placeholder="Ryhmä"
                  maxLength={100}
                  className="min-w-0 flex-1 rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-accent"
                />
                <select
                  value={modalDay}
                  onChange={(e) => setModalDay(e.target.value)}
                  className="rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-accent"
                >
                  <option value="">Päivä</option>
                  {DAYS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <input
                value={modalResponsible}
                onChange={(e) => setModalResponsible(e.target.value)}
                placeholder="Vastuuhenkilö(t) (pilkulla eroteltuna)"
                maxLength={100}
                className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <div className="mt-2 flex items-center justify-between gap-2">
                {modal.mode === "edit" ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Poistetaanko tehtävä "${modalText}"?`)) {
                        deleteTask(modal.sectionId, modal.taskId);
                        closeModal();
                      }
                    }}
                    className="rounded-full px-3 py-1.5 text-sm font-medium text-warn hover:bg-warn-bg"
                  >
                    Poista
                  </button>
                ) : (
                  <span />
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full border border-line px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent-light"
                  >
                    Peruuta
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white hover:brightness-110"
                  >
                    {modal.mode === "add" ? "Lisää" : "Tallenna"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

}
