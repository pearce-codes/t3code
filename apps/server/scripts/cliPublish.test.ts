import { assert, describe, it } from "@effect/vitest";

import { createVpPmPublishArgs, PublishedPackageName } from "./cliPublish.ts";

describe("server CLI publishing", () => {
  it("selects the package name written to the publish manifest", () => {
    assert.deepEqual(
      createVpPmPublishArgs({
        access: "public",
        tag: "latest",
        provenance: false,
        dryRun: false,
      }),
      [
        "publish",
        "--filter",
        PublishedPackageName,
        "--access",
        "public",
        "--tag",
        "latest",
        "--no-git-checks",
      ],
    );
    assert.equal(PublishedPackageName, "@pearcecodes/t3code");
  });

  it("forwards provenance and dry-run flags", () => {
    const args = createVpPmPublishArgs({
      access: "public",
      tag: "next",
      provenance: true,
      dryRun: true,
    });

    assert.deepEqual(args.slice(-2), ["--provenance", "--dry-run"]);
  });
});
