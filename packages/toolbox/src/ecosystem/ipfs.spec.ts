import { describe, expect, it } from "vitest";
import { hash } from "./ipfs";

describe("validateHash", () => {
  it("should generate same hash", async () => {
    const header = `---
title: TestTitle
discussions: TestDiscussion
author: TestAuthor
---`;
    expect(await hash(header)).toBe(
      "QmYMiDJUYXGsUng5rAgwgLvZzLEMjbhaWALFbQJjC6saPv",
    );
  });
});
