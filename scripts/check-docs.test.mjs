import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

import { checkRepository } from "./check-docs.mjs";

const VALID_LOGO =
  '<svg width="119" height="34"><path fill="black"/></svg>';

async function writeFixture(files) {
  const root = await mkdtemp(join(tmpdir(), "cfoai-docs-check-"));
  for (const [name, contents] of Object.entries(files)) {
    const path = join(root, name);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, contents);
  }
  return root;
}

function baseFixture() {
  return {
    "docs.json": JSON.stringify({
      navigation: { pages: ["index"] },
      logo: {
        light: "/logo/cfo-ai-logo.svg",
        dark: "/logo/cfo-ai-logo-dark.svg"
      }
    }),
    "index.mdx": [
      "---",
      'title: "cfo.ai documentation"',
      'description: "Customer documentation for cfo.ai."',
      "---",
      "",
      "A verified cfo.ai page.",
      "",
      "![Example](/images/example.png)"
    ].join("\n"),
    "images/example.png": "",
    "logo/cfo-ai-logo.svg": VALID_LOGO,
    "logo/cfo-ai-logo-dark.svg": VALID_LOGO.replaceAll(
      'fill="black"',
      'fill="white"'
    )
  };
}

test("accepts a valid repository when supplied the fixture logo checksum", async () => {
  const root = await writeFixture(baseFixture());
  try {
    const result = await checkRepository(root, {
      expectedLogoSha256: null
    });
    assert.deepEqual(result.findings, []);
    assert.equal(result.ok, true);
  } finally {
    await rm(root, { force: true, recursive: true });
  }
});

const failureCases = [
  ["invalid-docs-json", () => ({ "docs.json": "{" })],
  ["missing-nav-page", () => ({
    "docs.json": JSON.stringify({ navigation: { pages: ["missing"] } })
  })],
  ["missing-title", () => ({
    "index.mdx": '---\ndescription: "Description."\n---\nBody.'
  })],
  ["missing-description", () => ({
    "index.mdx": '---\ntitle: "Title"\n---\nBody.'
  })],
  ["missing-asset", () => ({
    "index.mdx": '---\ntitle: "Title"\ndescription: "Description."\n---\n![Missing](/images/missing.png)'
  })],
  ["forbidden-link", () => ({
    "index.mdx": '---\ntitle: "Title"\ndescription: "Description."\n---\n[Private](https://notion.so/example)'
  })],
  ["hidden-page", () => ({
    "index.mdx": '---\ntitle: "Title"\ndescription: "Description."\nhidden: true\n---\nBody.'
  })],
  ["legacy-terminology", () => ({
    "index.mdx": '---\ntitle: "Title"\ndescription: "Description."\n---\nCreate a metric in Runway.'
  })],
  ["logo-checksum", () => ({
    "logo/cfo-ai-logo.svg": "<svg/>"
  }), { expectedLogoSha256: "expected-checksum" }],
  ["dark-logo-drift", () => ({
    "logo/cfo-ai-logo-dark.svg": '<svg><path fill="red"/></svg>'
  })]
];

for (const [code, mutation, caseOptions = {}] of failureCases) {
  test(`reports ${code}`, async () => {
    const root = await writeFixture({
      ...baseFixture(),
      ...mutation()
    });
    try {
      const result = await checkRepository(root, {
        expectedLogoSha256: null,
        ...caseOptions
      });
      assert.ok(
        result.findings.some((item) => item.code === code),
        `Expected ${code}, received ${JSON.stringify(result.findings)}`
      );
    } finally {
      await rm(root, { force: true, recursive: true });
    }
  });
}
