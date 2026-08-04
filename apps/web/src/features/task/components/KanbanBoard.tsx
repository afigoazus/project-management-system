"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import type { Task, TaskStatus, CreateTaskPayload, UpdateTaskPayload } from "../types";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import { TaskModal } from "./TaskModal";
import { apiFetch } from "@/lib/api";
import { Plus } from "lucide-react";

interface KanbanBoardProps {
  projectId: string;
  initialTasks: Task[];
}

const COLUMNS: { id: TaskStatus; title: string; colorBadge: string }[] = [
  { id: "BACKLOG", title: "Backlog", colorBadge: "bg-slate-400" },
  { id: "TODO", title: "To Do", colorBadge: "bg-blue-400" },
  { id: "IN_PROGRESS", title: "In Progress", colorBadge: "bg-amber-400" },
  { id: "REVIEW", title: "Review", colorBadge: "bg-purple-400" },
  { id: "DEPLOY", title: "Deploy", colorBadge: "bg-pink-400" },
  { id: "DONE", title: "Done", colorBadge: "bg-emerald-400" },
];

export function KanbanBoard({ projectId, initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [modalDefaultStatus, setModalDefaultStatus] = useState<TaskStatus>("TODO");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTaskItem = tasks.find((t) => t.id === activeId);
    if (!activeTaskItem) return;

    // Check if over target is a column
    const isOverColumn = COLUMNS.some((col) => col.id === overId);
    if (isOverColumn) {
      const newStatus = overId as TaskStatus;
      if (activeTaskItem.status !== newStatus) {
        setTasks((prev) =>
          prev.map((t) => (t.id === activeId ? { ...t, status: newStatus } : t))
        );
      }
      return;
    }

    // Over target is another task card
    const overTaskItem = tasks.find((t) => t.id === overId);
    if (overTaskItem && activeTaskItem.status !== overTaskItem.status) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === activeId ? { ...t, status: overTaskItem.status } : t
        )
      );
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTaskItem = tasks.find((t) => t.id === activeId);
    if (!activeTaskItem) return;

    let targetStatus = activeTaskItem.status;
    let targetIndex = 0;

    const isOverColumn = COLUMNS.some((col) => col.id === overId);
    if (isOverColumn) {
      targetStatus = overId as TaskStatus;
      const columnTasks = tasks.filter((t) => t.status === targetStatus);
      targetIndex = columnTasks.length;
    } else {
      const overTaskItem = tasks.find((t) => t.id === overId);
      if (overTaskItem) {
        targetStatus = overTaskItem.status;
        const columnTasks = tasks.filter((t) => t.status === targetStatus);
        const overIndex = columnTasks.findIndex((t) => t.id === overId);
        targetIndex = overIndex >= 0 ? overIndex : 0;
      }
    }

    // Re-calculate new position
    const columnTasks = tasks.filter((t) => t.status === targetStatus && t.id !== activeId);
    let newPosition = 65535;
    if (columnTasks.length === 0) {
      newPosition = 65535;
    } else if (targetIndex <= 0) {
      newPosition = columnTasks[0].position / 2;
    } else if (targetIndex >= columnTasks.length) {
      newPosition = columnTasks[columnTasks.length - 1].position + 65535;
    } else {
      const prevPos = columnTasks[targetIndex - 1].position;
      const nextPos = columnTasks[targetIndex].position;
      newPosition = (prevPos + nextPos) / 2;
    }

    // Optimistic state update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === activeId ? { ...t, status: targetStatus, position: newPosition } : t
      )
    );

    // Sync with backend API
    try {
      await apiFetch<{ task: Task }>(`/tasks/${activeId}/reorder`, {
        method: "PATCH",
        body: JSON.stringify({
          status: targetStatus,
          position: newPosition,
        }),
      });
    } catch (err) {
      console.error("Failed to sync task reorder:", err);
    }
  };

  const handleOpenCreateModal = (status: TaskStatus = "TODO") => {
    setSelectedTask(null);
    setModalDefaultStatus(status);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (payload: CreateTaskPayload | UpdateTaskPayload) => {
    if (selectedTask) {
      // Update Task
      const res = await apiFetch<{ task: Task }>(`/tasks/${selectedTask.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setTasks((prev) => prev.map((t) => (t.id === res.task.id ? res.task : t)));
    } else {
      // Create Task
      const res = await apiFetch<{ task: Task }>(`/projects/${projectId}/tasks`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setTasks((prev) => [...prev, res.task]);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    await apiFetch(`/tasks/${taskId}`, { method: "DELETE" });
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  return (
    <div className="space-y-4">
      {/* Board Control Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white">Board</h2>
        <button
          onClick={() => handleOpenCreateModal("TODO")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg text-white text-xs font-semibold shadow-md shadow-indigo-500/20 hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {/* Dnd Kanban Columns Horizontal Container */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              colorBadge={col.colorBadge}
              tasks={tasks.filter((t) => t.status === col.id)}
              onAddTask={handleOpenCreateModal}
              onEditTask={handleOpenEditModal}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        initialStatus={modalDefaultStatus}
        task={selectedTask}
      />
    </div>
  );
}
