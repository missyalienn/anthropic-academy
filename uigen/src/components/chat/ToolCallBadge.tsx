"use client";

import { Loader2 } from "lucide-react";

interface ToolInvocation {
  toolName: string;
  state: string;
  args?: Record<string, any>;
  result?: any;
}

export function getToolCallLabel(toolName: string, args: Record<string, any> = {}): string {
  const filename = (path: string) => path?.split("/").pop() ?? path;

  if (toolName === "str_replace_editor") {
    const { command, path } = args;
    const name = filename(path);
    switch (command) {
      case "create":    return `Creating ${name}`;
      case "str_replace":
      case "insert":    return `Editing ${name}`;
      case "view":      return `Reading ${name}`;
      case "undo_edit": return `Undoing edit on ${name}`;
    }
  }

  if (toolName === "file_manager") {
    const { command, path, new_path } = args;
    const name = filename(path);
    switch (command) {
      case "rename": return `Renaming ${name} to ${filename(new_path)}`;
      case "delete": return `Deleting ${name}`;
    }
  }

  return toolName;
}

interface ToolCallBadgeProps {
  toolInvocation: ToolInvocation;
}

export function ToolCallBadge({ toolInvocation }: ToolCallBadgeProps) {
  const { toolName, state, args, result } = toolInvocation;
  const label = getToolCallLabel(toolName, args);
  const isDone = state === "result" && result != null;

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
