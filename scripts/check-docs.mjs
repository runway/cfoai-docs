#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_LOGO_SHA256 =
  "ce96c268d5ac58b770445388de7f6a8991b3e925db6f4d3d2046206cb9129494";
const FORBIDDEN_LINK =
  /https?:\/\/(?:[^/\s]+\.)?(?:notion\.so|runwaydev\.com|docs\.runway\.com)|https?:\/\/localhost\b/gi;
const LEGACY_TERM =
  /\b(?:metrics?|drivers?|properties)\b|(?<!\bcash\s)\brunway\b/gi;
const LOCAL_ASSET = /(?:!\[[^\]]*]\(|\bsrc=["'])(\/(?:images|logo)\/[^)"']+)/g;

function finding(code, file, message) {
  return { code, file, message };
}

function frontmatterValue(contents, key) {
  const match = contents.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!match) return null;
  const line = match[1]
    .split("\n")
    .find((candidate) => candidate.startsWith(`${key}:`));
  if (!line) return null;
  return line
    .slice(key.length + 1)
    .trim()
    .replace(/^["']|["']$/g, "");
}

// Each navigation tab holds one Diátaxis page type, and its pages live in that
// type's folder, so a page's path says what kind of page it is. Two pages keep
// root paths: the home page, and agent-instructions, which external agents fetch
// by URL.
const TAB_FOLDERS = {
  "Get started": "tutorials/",
  "How-to guides": "guides/",
  Concepts: "concepts/",
  Reference: "reference/",
  "For AI agents": "agents/"
};
const ROOT_PAGE_TABS = { index: "Get started", "agent-instructions": "For AI agents" };

function collectPages(value, pages = []) {
  if (typeof value === "string") {
    pages.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) collectPages(item, pages);
  } else if (value && typeof value === "object") {
    for (const key of ["tabs", "groups", "pages"]) {
      if (key in value) collectPages(value[key], pages);
    }
  }
  return pages;
}

async function collectMdxFiles(root, folder = "", files = []) {
  for (const entry of await readdir(join(root, folder), { withFileTypes: true })) {
    const path = folder ? `${folder}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      if (!entry.name.startsWith(".") && entry.name !== "node_modules") {
        await collectMdxFiles(root, path, files);
      }
    } else if (entry.name.endsWith(".mdx")) {
      files.push(path.slice(0, -".mdx".length));
    }
  }
  return files;
}

function collectRootRelativeAssets(value, assets = []) {
  if (typeof value === "string") {
    if (value.startsWith("/")) assets.push(value);
  } else if (Array.isArray(value)) {
    for (const item of value) collectRootRelativeAssets(item, assets);
  } else if (value && typeof value === "object") {
    for (const item of Object.values(value)) {
      collectRootRelativeAssets(item, assets);
    }
  }
  return assets;
}

function isRootRelativeAsset(value) {
  return typeof value === "string" && value.startsWith("/");
}

// A code fence opens with three or more backticks or tildes. It closes only at
// a line of the same character, at least as long, with nothing after it, so a
// tilde fence can show a backtick fence inside it.
const FENCE = /^(`{3,}|~{3,})/;

// Mintlify renders the text between two dollar signs on one line as LaTeX math,
// in the body and in the frontmatter description, so a line with two currency
// amounts must escape them. Code is left as written.
function lineWithUnescapedDollarPair(contents) {
  const lines = contents.split("\n");
  let openFence = null;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trimStart();
    const marker = line.match(FENCE)?.[1];
    if (openFence !== null) {
      const closes =
        marker?.[0] === openFence[0] &&
        marker.length >= openFence.length &&
        line.slice(marker.length).trim() === "";
      if (closes) openFence = null;
      continue;
    }
    if (marker) {
      openFence = marker;
      continue;
    }
    const prose = lines[index].replace(/`[^`]*`/g, "").replaceAll("\\$", "");
    if ((prose.match(/\$/g) ?? []).length >= 2) return index + 1;
  }
  return null;
}

function sha256(contents) {
  return createHash("sha256").update(contents).digest("hex");
}

export async function checkRepository(
  root,
  { expectedLogoSha256 = DEFAULT_LOGO_SHA256 } = {}
) {
  const findings = [];
  const configPath = join(root, "docs.json");
  let config;

  try {
    config = JSON.parse(await readFile(configPath, "utf8"));
  } catch (error) {
    findings.push(
      finding(
        "invalid-docs-json",
        "docs.json",
        `Invalid JSON: ${error.message}`
      )
    );
    return { ok: false, findings };
  }

  const pages = collectPages(config.navigation);
  for (const tab of config.navigation?.tabs ?? []) {
    const folder = TAB_FOLDERS[tab.tab];
    if (folder === undefined) {
      findings.push(
        finding("unknown-tab", "docs.json", `Tab "${tab.tab}" is not a page type.`)
      );
      continue;
    }
    for (const page of collectPages(tab)) {
      if (!page.startsWith(folder) && ROOT_PAGE_TABS[page] !== tab.tab) {
        findings.push(
          finding(
            "page-type-folder",
            "docs.json",
            `${page} is in the "${tab.tab}" tab, so it belongs in ${folder}.`
          )
        );
      }
    }
  }
  const navigated = new Set(pages);
  for (const file of await collectMdxFiles(root)) {
    if (!navigated.has(file)) {
      findings.push(
        finding("orphan-page", `${file}.mdx`, "Page is not in the navigation.")
      );
    }
  }
  for (const page of pages) {
    const pagePath = join(root, `${page}.mdx`);
    const displayPage = `${page}.mdx`;
    if (!existsSync(pagePath)) {
      findings.push(
        finding("missing-nav-page", "docs.json", `Missing ${displayPage}.`)
      );
      continue;
    }

    const contents = await readFile(pagePath, "utf8");
    if (!frontmatterValue(contents, "title")) {
      findings.push(
        finding("missing-title", displayPage, "Frontmatter requires title.")
      );
    }
    if (!frontmatterValue(contents, "description")) {
      findings.push(
        finding(
          "missing-description",
          displayPage,
          "Frontmatter requires description."
        )
      );
    }
    if (frontmatterValue(contents, "hidden") === "true") {
      findings.push(
        finding("hidden-page", displayPage, "Navigated pages cannot be hidden.")
      );
    }

    for (const match of contents.matchAll(LOCAL_ASSET)) {
      const assetPath = join(root, match[1].slice(1));
      if (!existsSync(assetPath)) {
        findings.push(
          finding(
            "missing-asset",
            displayPage,
            `Missing local asset ${match[1]}.`
          )
        );
      }
    }
    if (FORBIDDEN_LINK.test(contents)) {
      findings.push(
        finding(
          "forbidden-link",
          displayPage,
          "Private or legacy documentation link found."
        )
      );
    }
    FORBIDDEN_LINK.lastIndex = 0;
    if (LEGACY_TERM.test(contents)) {
      findings.push(
        finding(
          "legacy-terminology",
          displayPage,
          "Legacy product terminology found."
        )
      );
    }
    LEGACY_TERM.lastIndex = 0;
    const mathLine = lineWithUnescapedDollarPair(contents);
    if (mathLine !== null) {
      findings.push(
        finding(
          "unescaped-dollar",
          displayPage,
          `Line ${mathLine} has two unescaped dollar signs, which render as math. Write \\$ for a currency sign.`
        )
      );
    }
  }

  const configuredAssets = new Set([
    ...collectRootRelativeAssets(config.favicon),
    ...collectRootRelativeAssets(config.logo)
  ]);
  for (const asset of configuredAssets) {
    const assetPath = join(root, asset.slice(1));
    if (existsSync(assetPath)) continue;

    if (asset === config.logo?.light) {
      findings.push(
        finding(
          "missing-asset",
          relative(root, assetPath),
          "Missing configured light logo."
        )
      );
    } else if (asset === config.logo?.dark) {
      findings.push(
        finding(
          "missing-asset",
          relative(root, assetPath),
          "Missing configured dark logo."
        )
      );
    } else {
      findings.push(
        finding(
          "missing-asset",
          "docs.json",
          `Missing configured asset ${asset}.`
        )
      );
    }
  }

  const lightPath = isRootRelativeAsset(config.logo?.light)
    ? join(root, config.logo.light.slice(1))
    : null;
  const darkPath = isRootRelativeAsset(config.logo?.dark)
    ? join(root, config.logo.dark.slice(1))
    : null;
  if (lightPath && darkPath && existsSync(lightPath) && existsSync(darkPath)) {
    const lightLogo = await readFile(lightPath, "utf8");
    const darkLogo = await readFile(darkPath, "utf8");

    if (expectedLogoSha256 && sha256(lightLogo) !== expectedLogoSha256) {
      findings.push(
        finding(
          "logo-checksum",
          relative(root, lightPath),
          "Light logo does not match the supplied source."
        )
      );
    }
    if (darkLogo !== lightLogo.replaceAll('fill="black"', 'fill="white"')) {
      findings.push(
        finding(
          "dark-logo-drift",
          relative(root, darkPath),
          "Dark logo must differ only by black-to-white fill replacement."
        )
      );
    }
  }

  return { ok: findings.length === 0, findings };
}

async function main() {
  const root = process.cwd();
  const result = await checkRepository(root);
  if (result.ok) {
    console.log("Documentation checks passed.");
    return;
  }
  for (const item of result.findings) {
    console.error(`${item.file}: [${item.code}] ${item.message}`);
  }
  process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main();
}
