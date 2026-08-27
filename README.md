# Playwright MCP Workshop

Hands-on Playwright workshop built on **Playwright 1.62**, driven from
**OpenCode** or **VS Code + Claude Code**.

App under test: **https://playwright-workshop.pages.dev** - a SauceDemo-style
store (no local server to run).

## Before the workshop

Please complete this setup in advance so we can start on time.

### Prerequisites

- **Node.js 20+** and npm (see `.nvmrc`)
- One agentic client:
  - **OpenCode**: `npm i -g opencode-ai` (or `brew install sst/tap/opencode`)
  - or **VS Code + Claude Code** extension (`anthropic.claude-code`)
- An API key / login for your client

### Setup

```bash
npm install
npm run install:browsers
npm test
```

`npm test` should finish with **5 passed**. If it does, you are ready.

## Test accounts

All use password **`workshop123`**:

| User | Behaviour |
|---|---|
| `standard_user` | Happy path |
| `locked_out_user` | Cannot sign in |
| `problem_user` | Planted UI bugs |
| `glitch_user` | Intermittent behaviour |

## Handy scripts

```bash
npm test              # run the suite (headed locally, headless in CI)
npm run test:ui       # UI mode (time-travel debugging)
npm run test:debug    # step through with the Inspector
npm run report        # open the last HTML report
npm run typecheck     # strict TypeScript check
```

See you at the workshop.
