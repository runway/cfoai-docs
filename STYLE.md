# cfo.ai docs style guide

## Page structure

Every page begins with a sentence-case `title` and a specific `description`. Open with what the subject is and when the reader would use it before describing a procedure.

Use Mintlify components when they improve comprehension. Put procedures in `<Steps>`, screenshots in `<Frame>`, variants in `<Tabs>`, and short FAQs in `<Accordion>` components.

## Voice

- Address the reader as "you."
- Use active voice, present tense, and US English.
- Explain why before how.
- Keep headings in sentence case.
- Do not use "simply," "just," "easily," "powerful," or "seamless."

## Product language

- Write the product and company name as `cfo.ai`, including at the start of a sentence.
- Use `Model`, `Scenario`, `Variable`, `Dimension`, `Page`, `Table Block`, and `Database` for their product concepts.
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
- Do not document a feature flag, experiment, aspiration, or planned behavior as shipped.
- If a claim cannot be verified, omit it and open a follow-up issue with the evidence needed.

## Product sources of truth

When the docs and product disagree, verify the customer-facing behavior in `runway/cfoai` before editing:

- Product names, modeling concepts, and action labels: `agent_docs/product-sense.md`.
- Supported formula functions and aliases: `shared/formula-functions.json`.
- Parser-verified formula syntax: `agent-runtime/src/skills/ari/manuals/build-model/references/grammar-reference.md`.
- Formula writing and saved-table behavior: `agent-runtime/src/skills/ari/manuals/build-model/references/saving-formulas.md`.
- Ari's available product tools: `go/apisvc/agents/ari/agent.go`.
- File types, size limits, and attachment count: `cfoapp/src/features/AriChat/AriInput/attachments.ts`.
- In-app customer help: `cfoapp/src/features/GuideEngine/articles/`.
