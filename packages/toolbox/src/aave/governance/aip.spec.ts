import { describe, it, vi, afterAll, expect } from "vitest";
import { validateAip } from "./aip";

describe("aip", () => {
  it("should validate a valid aip", () => {
    validateAip(`---
title: Approval of BGD contribution to Aave
author: BGD Labs (@bgdlabs)
discussions: https://governance.aave.com/t/aave-bored-ghosts-developing-bgd/7527
---`);
  });

  it("should validate a valid aip with extra props", () => {
    validateAip(`---
title: Approval of BGD contribution to Aave
author: BGD Labs (@bgdlabs)
discussions: https://governance.aave.com/t/aave-bored-ghosts-developing-bgd/7527
snapshot: https://governance.aave.com/t/aave-bored-ghosts-developing-bgd/7527
additional: https://governance.aave.com/t/aave-bored-ghosts-developing-bgd/7527
---`);
  });

  it("should fail on missing props", () => {
    expect(() =>
      validateAip(`---
title: Approval of BGD contribution to Aave
discussions: https://governance.aave.com/t/aave-bored-ghosts-developing-bgd/7527
---`),
    ).toThrowErrorMatchingInlineSnapshot(`[Error: AIP validation failed: 'author' is required and must be a string]`);
  });

  it("should fail on invalid props", () => {
    expect(() =>
      validateAip(`---
title: Approval of BGD contribution to Aave
author: BGD Labs (@bgdlabs)
discussions: https://governance.aave.com/t/aave-bored-ghosts-developing-bgd/7527
snapshot: notAnUrl
---`),
    ).toThrowErrorMatchingInlineSnapshot(`[Error: AIP validation failed: 'snapshot' must be a valid URL]`);
  });
});
