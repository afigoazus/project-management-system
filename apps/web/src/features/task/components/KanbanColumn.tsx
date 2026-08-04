"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Task, TaskStatus } from "../types";
import { TaskCard } from "./TaskCard";
import { Plus } from "lucide-react";

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  tasks: Task[];
  onAddTask?: (status: TaskStatus) => void;
  onEditTask?: (task: Task) => void;
  colorBadge: string;
}

export function KanbanColumn({
  id,
  title,
  tasks,
  onAddTask,
  onEditTask,
  colorBadge,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-80 shrink-0 rounded-2xl bg-[#0f1424]/80 border transition-colors p-3.5 space-y-3 ${
        isOver ? "border-indigo-500/80 bg-indigo-950/20" : "border-slate-800/80"
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${colorBadge}`} />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {title}
          </h3>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask?.(id)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={`Add task to ${title}`}
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Task List (Sortable Droppable area) */}
      <div className="flex-1 min-h-[450px] space-y-3">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="h-32 border-2 border-dashed border-slate-800/60 rounded-xl flex items-center justify-center text-xs text-slate-500 italic">
            No tasks here
          </div>
        )}
      </div>
    </div>
  );
}
