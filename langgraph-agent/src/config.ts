import * as path from "node:path";
import * as url from "node:url";
import "dotenv/config";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { isInteropZodSchema } from "@langchain/core/utils/types";
import type { StructuredToolInterface } from "@langchain/core/tools";

const here = path.dirname(url.fileURLToPath(import.meta.url));

/** Repo root (pw-workshop) — the playwright-test MCP must run from here so it
 *  finds playwright.config.ts and tests/seed.spec.ts. */
export const REPO_ROOT = path.resolve(here, "..", "..");

/** The Claude Code subagent definition we reuse as the generator's system prompt. */
export const GENERATOR_PROMPT_PATH = path.join(
  REPO_ROOT,
  ".claude",
  "agents",
  "playwright-test-generator.md"
);

/** The Claude Code subagent definition we reuse as the healer's system prompt. */
export const HEALER_PROMPT_PATH = path.join(
  REPO_ROOT,
  ".claude",
  "agents",
  "playwright-test-healer.md"
);

export const MODEL = process.env.AGENT_MODEL ?? "gemini-3.8-flash";

export function createChatModel(): ChatGoogleGenerativeAI {
  return new ChatGoogleGenerativeAI({
    model: MODEL,
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
    temperature: 0,
  });
}

function cleanSchema(obj: any): any {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(cleanSchema);
  const out: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (key === "propertyNames" || key === "patternProperties") continue;
    out[key] = cleanSchema(val);
  }
  return out;
}

/** Sanitize tool schemas by stripping keywords unsupported by Google Gemini API (like propertyNames). */
export function sanitizeToolForGemini<T extends StructuredToolInterface>(tool: T): T {
  if (tool.schema && !isInteropZodSchema(tool.schema) && typeof tool.schema === "object") {
    (tool as any).schema = cleanSchema(tool.schema);
  }
  return tool;
}

export function sanitizeToolsForGemini<T extends StructuredToolInterface>(tools: T[]): T[] {
  return tools.map(sanitizeToolForGemini);
}

/** The app under test — the general playwright MCP has no test-runner baseURL,
 *  so the generator navigates to full URLs. Matches playwright.config.ts. */
export const APP_BASE_URL =
  process.env.APP_BASE_URL ?? "https://playwright-workshop.pages.dev";

/** Jira MCP server launch config. Defaults to the community mcp-atlassian
 *  server (https://github.com/sooperset/mcp-atlassian) run via uvx, driven by
 *  JIRA_URL / JIRA_USERNAME / JIRA_API_TOKEN. Override the command with
 *  JIRA_MCP_COMMAND / JIRA_MCP_ARGS (space-separated) to use any other server. */
export const JIRA_MCP = {
  command: process.env.JIRA_MCP_COMMAND ?? "uvx",
  args: process.env.JIRA_MCP_ARGS?.split(" ") ?? ["mcp-atlassian"],
  env: {
    JIRA_URL: process.env.JIRA_URL ?? "",
    JIRA_USERNAME: process.env.JIRA_USERNAME ?? "",
    JIRA_API_TOKEN: process.env.JIRA_API_TOKEN ?? "",
    TOOLSETS: process.env.TOOLSETS ?? "all",
  },
};

/** The heal command only talks to Google Gemini + the local playwright-test MCP. */
export function assertHealEnv(): void {
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    throw new Error("GEMINI_API_KEY (or GOOGLE_API_KEY) is not set (see .env)");
  }
}

export function assertEnv(): void {
  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    throw new Error("GEMINI_API_KEY (or GOOGLE_API_KEY) is not set (see .env)");
  }
  if (!process.env.JIRA_MCP_COMMAND && !process.env.JIRA_URL) {
    throw new Error(
      "Set JIRA_URL / JIRA_USERNAME / JIRA_API_TOKEN for the default mcp-atlassian server, " +
        "or JIRA_MCP_COMMAND / JIRA_MCP_ARGS for a custom Jira MCP server (see .env)"
    );
  }
}
