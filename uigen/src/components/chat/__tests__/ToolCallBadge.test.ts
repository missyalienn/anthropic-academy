import { test, expect, describe } from "vitest";
import { getToolCallLabel } from "../ToolCallBadge";

describe("getToolCallLabel", () => {
  describe("str_replace_editor", () => {
    test("create", () => {
      expect(getToolCallLabel("str_replace_editor", { command: "create", path: "/src/App.jsx" })).toBe("Creating App.jsx");
    });

    test("str_replace", () => {
      expect(getToolCallLabel("str_replace_editor", { command: "str_replace", path: "/src/Button.tsx" })).toBe("Editing Button.tsx");
    });

    test("insert", () => {
      expect(getToolCallLabel("str_replace_editor", { command: "insert", path: "/index.css" })).toBe("Editing index.css");
    });

    test("view", () => {
      expect(getToolCallLabel("str_replace_editor", { command: "view", path: "/src/utils.ts" })).toBe("Reading utils.ts");
    });

    test("undo_edit", () => {
      expect(getToolCallLabel("str_replace_editor", { command: "undo_edit", path: "/App.jsx" })).toBe("Undoing edit on App.jsx");
    });

    test("nested path strips to filename", () => {
      expect(getToolCallLabel("str_replace_editor", { command: "create", path: "/src/components/ui/Card.tsx" })).toBe("Creating Card.tsx");
    });
  });

  describe("file_manager", () => {
    test("rename", () => {
      expect(getToolCallLabel("file_manager", { command: "rename", path: "/App.jsx", new_path: "/App.tsx" })).toBe("Renaming App.jsx to App.tsx");
    });

    test("delete", () => {
      expect(getToolCallLabel("file_manager", { command: "delete", path: "/src/OldComponent.tsx" })).toBe("Deleting OldComponent.tsx");
    });
  });

  describe("unknown tools", () => {
    test("falls back to tool name", () => {
      expect(getToolCallLabel("some_other_tool", {})).toBe("some_other_tool");
    });

    test("unknown command falls back to tool name", () => {
      expect(getToolCallLabel("str_replace_editor", { command: "unknown", path: "/App.jsx" })).toBe("str_replace_editor");
    });
  });
});
