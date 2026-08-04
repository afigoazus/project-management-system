"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task, TaskPriority } from "../types";
import { Calendar, User as UserIcon } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

const priorityColors: Record<TaskPriority, { bg: string; text: string; border: string }> = {
  LOW: { bg: "bg-slate-500/10", text: "text-slate-400", border: "border-slate-500/20" },
  MEDIUM: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  HIGH: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
  URGENT: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
};

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityStyle = priorityColors[task.priority] || priorityColors.MEDIUM;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onEdit?.(task)}
      className={`glass-card p-4 rounded-xl border border-slate-800/80 hover:border-slate-700/80 bg-[#121827]/90 transition-all cursor-grab active:cursor-grabbing group shadow-sm hover:shadow-md ${
        isDragging ? "opacity-40 scale-95 border-indigo-500" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2">
          {task.title}
        </h4>
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-slate-400">
              <Calendar className="h-3 w-3 text-indigo-400" />
              <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
            </div>
          )}
        </div>

        {task.assignee ? (
          <div className="flex items-center gap-1.5 text-slate-300 font-medium bg-slate-800/60 px-2 py-0.5 rounded-full">
            <UserIcon className="h-3 w-3 text-indigo-400" />
            <span className="truncate max-w-[80px]">{task.assignee.name}</span>
          </div>
        ) : (
          <span className="text-[10px] text-slate-500 italic">Unassigned</span>
        )}
      </div>
    </div>
  );
}
