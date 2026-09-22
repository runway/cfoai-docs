# cfo.ai docs style guide

## Page structure

Every page begins with a sentence-case `title` and a specific `description`. Open with what the subject is and when the reader would use it before describing a procedure.

Use Mintlify components when they improve comprehension. Put procedures in `<Steps>`, screenshots in `<Frame>`, variants in `<Tabs>`, and short FAQs in `<Accordion>` components.

## Voice

- Address the reader as "you."
- Use active voice, present tense, and US English.
- Explain why before how.
- Start with a real business question before introducing finance terminology.
- Use specific examples about hiring, cash, growth, or costs instead of vague claims about visibility.
- Keep the tone warm, direct, and practical. Let the product behavior make the case.
- Keep headings in sentence case.
- Do not use "simply," "just," "easily," "powerful," or "seamless."

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
- Use `Model`, `Scenario`, `Variable`, `Dimension`, `Page`, `Table Block`, `Canvas block`, and `Database` for their product concepts, spelled the way the published pages already spell them.
- Never use `Runway` for the product or company.
- Ordinary financial phrases such as `cash runway` remain correct when they describe how long cash will last.
- Never use `Metric`, `Driver`, or `Property` as a customer-facing name for a Variable.

## Links and assets

- Use root-relative links between documentation pages.
- Never link to Notion, private app routes, localhost, staging, or `runwaydev.com`.
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

- Product names, modeling concepts, and action labels: `agent_docs/product-sense.md`.
- Supported formula functions and aliases: `shared/formula-functions.json`.
- Parser-verified formula syntax: the generated section of `agent-runtime/src/skills/ari/builtin/build-model/SKILL.md` between the `formula-syntax:start` and `formula-syntax:end` markers, built from `shared/formula-functions.json` by `make formula-functions`.
- Formula writing and saved-table behavior: `agent_docs/interfaces/formulas.md` and the "Cells: inputs and rules" section of the same `SKILL.md`.
- Ari's available product tools: `agent-runtime/src/tools/ari-tool-catalog.json`, registered in `go/apisvc/agents/ari/agent.go`.
- Which features customers have: LaunchDarkly production. A feature is shipped when its flag is on for the fallthrough with no rules and no targets, or has no flag. Frontend flags are listed with their `LD key:` comments in `cfoapp/src/config/launchDarklyFlags.ts`; read state with `ldcli flags get --project default --flag <key> --output json`.
- File types, size limits, and attachment count: `cfoapp/src/features/AriChat/AriInput/attachments.ts`.
- In-app customer help: `cfoapp/src/features/GuideEngine/articles/`.
