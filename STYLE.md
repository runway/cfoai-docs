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
