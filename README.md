# cfo.ai Documentation

This repository contains the Mintlify source for the public cfo.ai customer documentation.

## Local preview

From the repository root, run:

```bash
npx mint dev
```

## Validation

Run the dependency-free repository checks:

```bash
node --test scripts/check-docs.test.mjs
node scripts/check-docs.mjs
```

Check internal links with the current Mintlify CLI:

```bash
npx mint broken-links
```

## Writing and assets

Read `STYLE.md` before editing customer-facing content.

- Store screenshots under `images/` with stable, descriptive filenames.
- Reference local assets with root-absolute paths such as `/images/variables.png`.
- Keep the supplied files under `logo/` unchanged unless cfo.ai provides a new authoritative wordmark.

## Deployment

Mintlify deploys changes after this repository is connected through the Mintlify dashboard and GitHub App. Configure `main` as the production branch and enable pull-request previews. A Mintlify administrator must complete that one-time connection.
