import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

afterEach(cleanup);
import { ToolCallBadge, getToolCallLabel } from "../ToolCallBadge";

describe("getToolCallLabel", () => {
  describe("str_replace_editor", () => {
    it("returns creating label with path for create command", () => {
      expect(getToolCallLabel("str_replace_editor", { command: "create", path: "/App.jsx" })).toBe("Creating /App.jsx");
    });

    it("returns creating label without path when path is missing", () => {
      expect(getToolCallLabel("str_replace_editor", { command: "create" })).toBe("Creating file");
    });

    it("returns editing label with path for str_replace command", () => {
      expect(getToolCallLabel("str_replace_editor", { command: "str_replace", path: "/components/Card.jsx" })).toBe("Editing /components/Card.jsx");
    });

    it("returns editing label with path for insert command", () => {
      expect(getToolCallLabel("str_replace_editor", { command: "insert", path: "/App.jsx" })).toBe("Editing /App.jsx");
    });

    it("returns viewing label with path for view command", () => {
      expect(getToolCallLabel("str_replace_editor", { command: "view", path: "/App.jsx" })).toBe("Viewing /App.jsx");
    });

    it("returns reverting label with path for undo_edit command", () => {
      expect(getToolCallLabel("str_replace_editor", { command: "undo_edit", path: "/App.jsx" })).toBe("Reverting /App.jsx");
    });

    it("returns reverting label without path for undo_edit command", () => {
      expect(getToolCallLabel("str_replace_editor", { command: "undo_edit" })).toBe("Reverting file");
    });

    it("falls back to editing label for unknown command", () => {
      expect(getToolCallLabel("str_replace_editor", { command: "unknown", path: "/App.jsx" })).toBe("Editing /App.jsx");
    });
  });

  describe("file_manager", () => {
    it("returns renaming label with both paths", () => {
      expect(getToolCallLabel("file_manager", { command: "rename", path: "/old.jsx", new_path: "/new.jsx" })).toBe("Renaming /old.jsx → /new.jsx");
    });

    it("returns fallback renaming label when paths are missing", () => {
      expect(getToolCallLabel("file_manager", { command: "rename" })).toBe("Renaming file");
    });

    it("returns deleting label with path", () => {
      expect(getToolCallLabel("file_manager", { command: "delete", path: "/App.jsx" })).toBe("Deleting /App.jsx");
    });

    it("returns fallback deleting label when path is missing", () => {
      expect(getToolCallLabel("file_manager", { command: "delete" })).toBe("Deleting file");
    });

    it("returns managing file for unknown command", () => {
      expect(getToolCallLabel("file_manager", { command: "unknown" })).toBe("Managing file");
    });
  });

  it("returns tool name as-is for unknown tools", () => {
    expect(getToolCallLabel("some_unknown_tool", {})).toBe("some_unknown_tool");
  });
});

describe("ToolCallBadge", () => {
  it("shows spinner and label while pending", () => {
    render(
      <ToolCallBadge
        toolInvocation={{ state: "call", toolCallId: "1", toolName: "str_replace_editor", args: { command: "create", path: "/App.jsx" } }}
      />
    );
    expect(screen.getByText("Creating /App.jsx")).toBeDefined();
    expect(document.querySelector(".animate-spin")).toBeDefined();
  });

  it("shows green dot and label when result is available", () => {
    render(
      <ToolCallBadge
        toolInvocation={{ state: "result", toolCallId: "1", toolName: "str_replace_editor", args: { command: "str_replace", path: "/App.jsx" }, result: "ok" }}
      />
    );
    expect(screen.getByText("Editing /App.jsx")).toBeDefined();
    expect(document.querySelector(".bg-emerald-500")).toBeDefined();
    expect(document.querySelector(".animate-spin")).toBeNull();
  });

  it("shows spinner for partial-call state", () => {
    render(
      <ToolCallBadge
        toolInvocation={{ state: "partial-call", toolCallId: "1", toolName: "str_replace_editor", args: { command: "create", path: "/App.jsx" } }}
      />
    );
    expect(screen.getByText("Creating /App.jsx")).toBeDefined();
    expect(document.querySelector(".animate-spin")).toBeDefined();
    expect(document.querySelector(".bg-emerald-500")).toBeNull();
  });

  it("shows file_manager delete label", () => {
    render(
      <ToolCallBadge
        toolInvocation={{ state: "call", toolCallId: "2", toolName: "file_manager", args: { command: "delete", path: "/old.jsx" } }}
      />
    );
    expect(screen.getByText("Deleting /old.jsx")).toBeDefined();
  });
});
