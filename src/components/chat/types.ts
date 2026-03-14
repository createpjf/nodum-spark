export type ContentBlock =
  | { type: "thinking"; content: string }
  | { type: "tool_use"; toolName: string; status: "running" | "done"; label: string }
  | {
      type: "tool_result";
      toolName: string;
      title: string;
      count: number;
      items: { id: string; label: string }[];
    }
  | { type: "text"; content: string };

export interface Message {
  id: string;
  role: "user" | "assistant";
  blocks: ContentBlock[];
  timestamp: string;
}
