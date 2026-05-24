"use client";

import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "ai";

interface ToolCallBadgeProps {
  toolInvocation: ToolInvocation;
}

export function getToolCallLabel(toolName: string, args: Record<string, any>): string {
  if (toolName === "str_replace_editor") {
    const { command, path } = args ?? {};
    switch (command) {
      case "create":
        return path ? `Creating ${path}` : "Creating file";
      case "str_replace":
        return path ? `Editing ${path}` : "Editing file";
      case "insert":
        return path ? `Editing ${path}` : "Editing file";
      case "view":
        return path ? `Viewing ${path}` : "Viewing file";
      case "undo_edit":
        return path ? `Reverting ${path}` : "Reverting file";
      default:
        return path ? `Editing ${path}` : "Editing file";
    }
  }

  if (toolName === "file_manager") {
    const { command, path, new_path } = args ?? {};
    switch (command) {
      case "rename":
        return path && new_path ? `Renaming ${path} → ${new_path}` : "Renaming file";
      case "delete":
        return path ? `Deleting ${path}` : "Deleting file";
      default:
        return "Managing file";
    }
  }

  return toolName;
}

export function ToolCallBadge({ toolInvocation }: ToolCallBadgeProps) {
  const { toolName, args, state } = toolInvocation;
  const label = getToolCallLabel(toolName, args ?? {});
  const isDone = state === "result";

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {isDone ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
