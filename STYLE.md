# cfo.ai docs style guide

These docs have three kinds of readers:

- Customers, who learn cfo.ai, look up a fact, or need to get a job done.
- Ari, which searches these pages to answer customers' product questions. Ari repeats what a page says, so a wrong or stale sentence becomes a wrong answer in a customer's chat.
- External AI agents that connect to cfo.ai through its MCP server.

Write every page so that one of these readers, arriving from search, can use it without reading anything else first.

## Page types

The docs follow [Diátaxis](https://diataxis.fr). Every page is exactly one of the types below, and its folder and navigation tab say which. Decide the type before you write. When a sentence would serve a different type, put it on a page of that type and link to it.

| Type | Answers | Folder and tab | Title pattern |
| --- | --- | --- | --- |
| Tutorial | "Teach me cfo.ai." | `tutorials/`, **Get started** | The outcome of the lesson: "Build your first Model" |
| How-to guide | "How do I get this done?" | `guides/`, **How-to guides** | The goal as an instruction: "Connect your accounting system" |
| Concept | "Help me understand how this works." | `concepts/`, **Concepts** | The subject: "Scenarios and Snapshots", "How connected data reaches your Model" |
| Reference | "What exactly is true?" | `reference/`, **Reference** | The thing described: "Keyboard shortcuts", "Connection statuses" |
| Agent docs | "How does an external agent use cfo.ai?" | `agents/`, **For AI agents** | Same patterns, for an agent reader |

Each tab and each navigation group opens with a landing page that introduces what is inside it. A landing page is an overview with a sentence or two per group, not a bare list.

### Tutorials

A tutorial is a lesson. The reader is new and wants a first success; the page carries the responsibility for that success.

- Say at the start what the reader will have at the end.
- Give one path. Leave out options, alternatives, and edge cases; link to the how-to guide that covers them.
- Number every step, and after each step say what the reader should see, such as a card in the chat or a new Page in the sidebar. Ari's wording changes from run to run, so describe what appears, not the exact words.
- Keep explanation to one sentence, with a link to the concept page.
- Use "we" and "you", and end by naming what the reader built.
- A product change that alters a tutorial's path must be checked by following the whole tutorial again.

### How-to guides

A how-to guide helps a reader who already knows the basics complete one real task.

- Open with one sentence that says what the guide helps you do and when you would use it.
- List what you need first, when anything is needed.
- Give steps in `<Steps>`. Use "If ..., do ..." for branches. When a task can be done by asking Ari or by hand, show both in `<Tabs>` with the Ari tab first.
- End when the task is done. Add a short "If something goes wrong" section only for failures readers actually hit, and link to the reference page that lists every message.
- Leave out background (link the concept page) and complete lists of options (link the reference page).

### Concepts

A concept page explains how part of cfo.ai works and why, so readers can reason about what they see.

- Start from the question a reader has, such as "Why did my forecast stop reading QuickBooks after Last close?"
- Explain the mechanism with a small concrete example, then the consequences that matter in practice.
- Connect the subject to related concepts and to the how-to guides that act on it.
- Contain no steps and no exhaustive lists. If you find yourself writing "select **X**", that sentence belongs in a how-to guide.

### Reference

A reference page describes. Readers consult it to look something up, so it must be complete, accurate, and laid out the same way every time.

- Mirror the product's own structure: one section per menu, setting, screen, function, or integration, in the order the product shows them.
- Prefer tables and short definitions. Quote labels and messages exactly, in bold.
- State facts and limits. Do not teach and do not persuade; link to the how-to guide for the task and the concept page for the reason.
- Every exact UI message, status, limit, and error lives on a reference page. Other pages link to it instead of repeating it.

### Agent docs

Agent docs serve an AI agent connected through the MCP server, and the developer who sets one up. They may name tools, fields, and call shapes. Customer pages must not: a customer page describes what a person sees and does.

## One home for each fact

Every fact lives on exactly one page, the page whose type fits it. Other pages link to that home instead of restating it. This keeps the docs from contradicting themselves when the product changes, and it gives Ari one passage to find.

When a product change adds or changes a fact, put it where it belongs:

| The change adds or changes | Edit |
| --- | --- |
| A label, menu item, setting, status, message, limit, or shortcut | The reference page for that part of the product |
| A new task a customer can do, or new steps for an existing task | The how-to guide for that task, or a new guide in the group it fits |
| How something works, or why it behaves the way it does | The concept page for that subject |
| The first-run experience, onboarding, or a step a tutorial uses | The tutorial; then follow the tutorial end to end |
| A tool, field, or call shape that external agents use | The page under `agents/` |

Keep each paragraph to one idea. When an edge case needs more than a sentence, it is usually a row in a reference table, not more words in a paragraph.

## Write for search

Ari and the site search return short excerpts cut at headings, not whole pages, so a fact only helps when its own heading and first sentence match the question.

- Title a page and its headings with the job in the customer's words, and keep the product term beside it: "Export a Page to Excel", with **Download spreadsheet** in the first sentence. Customers say "assumptions" (Variables), "breakdowns" or "categories" (Dimensions), "sheets" or "tabs" (Pages), "add a user" (invite an administrator), "month-end" (Last close), "multi-entity" (several companies), "versions of the plan" (Scenarios), and "export" (download).
- Put the answer in the first sentence under the heading. Put background after it.
- Say plainly what cfo.ai does not do, with the workaround, on the reference page for that part of the product: "You cannot add a chart block from the block menu. Ask Ari for a chart." When the docs are silent, Ari tends to guess, and has told customers a feature does not exist when the docs only left it out.
- Give each integration, setting, function, and message its own heading or table row, so one excerpt answers one question.
- Landing pages and agent docs set `searchable: false` in their frontmatter. They stay in the navigation but do not take result slots from the pages that answer customers' questions.

## Page structure

Every page begins with a sentence-case `title` and a specific `description`. The description says who the page is for and what it covers; search results and Ari show it.

Use Mintlify components when they make the page easier to use: `<Steps>` for procedures, `<Tabs>` for "ask Ari" and "by hand" variants, `<Frame>` for screenshots, `<Accordion>` for short troubleshooting entries, and `<CardGroup>` on landing pages.

Write a currency dollar sign as `\$` outside code, and as `\\$` inside a frontmatter description. Mintlify renders the text between two dollar signs on one line as math, so "$5 to $10,000" would show as a formula. `scripts/check-docs.mjs` refuses a line with two unescaped dollar signs.

## Voice

- Follow the [U.S. Department of Labor Plain Language Quick Reference Guide](https://www.dol.gov/sites/dolgov/files/general/Plain-Language-Quick-Reference-Guide.pdf): common words, short sentences, active voice.
- Address the reader as "you." Use present tense and US English.
- Start with a real business question before introducing finance or product terms.
- Use specific examples about hiring, cash, growth, or costs instead of vague claims about visibility.
- Keep the tone warm, direct, and practical. Let the product behavior make the case.
- Keep headings in sentence case.
- Do not use "simply," "just," "easily," "powerful," or "seamless."
- Avoid dramatic contrasts ("not X but Y"), one-line closers, and bold labels at the start of every list item.

## Product story

Ari is the AI finance coworker. The shared Model is how Ari answers a business question and leaves behind work you can inspect, change, and use again.

When explaining a customer workflow:

1. Start with the decision, such as whether the company can hire.
2. Show what Ari reads, builds, or changes.
3. Show the sources and assumptions behind the answer.
4. Explain what the customer can inspect or change directly.
5. Describe the Model or calculation only when it helps explain the result.

Keep Ari, the human interface, and external agents connected to the same Model. Do not present the modeling engine as a separate customer product or imply a founder must know which financial model to request.

## Product language

- Write the product and company name as `cfo.ai`, including at the start of a sentence.
- Call Ari an AI finance coworker when describing its role. Use concrete examples to explain what that means.
- Use `Model`, `Scenario`, `Snapshot`, `Variable`, `Dimension`, `Dimension item`, `Page`, `Table block`, `Canvas block`, and `Text block` for their product concepts. Product names in `runway/cfoai`'s `agent_docs/canonical-terminology.md` win when this list and that file disagree.
- A Variable's saved calculation is a formula, not a rule. An entry in a Dimension is an item, not a member.
- Never use `Runway` for the product or company.
- Ordinary financial phrases such as `cash runway` remain correct when they describe how long cash will last.
- Never use `Metric`, `Driver`, or `Property` as a customer-facing name for a Variable.

## Links and assets

- Use root-relative links between documentation pages.
- Never link to Notion, private app routes, localhost, staging, or `runwaydev.com`.
- When you move or retire a page, add a redirect in `docs.json` from the old path to its new home.
- Store screenshots in `images/` with stable descriptive filenames.
- Write alt text that explains what the image shows.
- Keep the supplied light wordmark byte-identical to its source. The dark wordmark may change only black fills to white.

## Truth

- Verify every behavior against the current product or the `runway/cfoai` repository.
- Do not document a feature flag, experiment, aspiration, or planned behavior as shipped. A flag that is off, targeted to specific workspaces, or limited to cfo.ai staff in production is not shipped.
- Do not promise unverified work channels, autonomous actions, pricing, privacy controls, or security certifications.
- If a claim cannot be verified, omit it and open a follow-up issue with the evidence needed.

## Product sources of truth

When the docs and product disagree, verify the customer-facing behavior in `runway/cfoai` before editing:

- Product names, modeling concepts, and action labels: `agent_docs/canonical-terminology.md`.
- Supported formula functions and aliases: `shared/formula-functions.json`.
- Parser-verified formula syntax: the generated section of `agent-runtime/src/skills/ari/builtin/build-model/SKILL.md` between the `formula-syntax:start` and `formula-syntax:end` markers, built from `shared/formula-functions.json` by `make formula-functions`.
- Formula writing and saved-table behavior: `agent_docs/interfaces/formulas.md` and the "Cells: inputs and rules" section of the same `SKILL.md`.
- Ari's available product tools: `agent-runtime/src/tools/ari-tool-catalog.json`, registered in `go/apisvc/agents/ari/agent.go`.
- Which features customers have: LaunchDarkly production. A feature is shipped when its flag is on for the fallthrough with no rules and no targets, or has no flag. Frontend flags are listed with their `LD key:` comments in `cfoapp/src/config/launchDarklyFlags.ts`; read state with `ldcli flags get --project default --flag <key> --output json`.
- File types, size limits, and attachment count: `cfoapp/src/features/AriChat/AriInput/attachments.ts`.
- In-app customer help: `cfoapp/src/features/GuideEngine/articles/`.
