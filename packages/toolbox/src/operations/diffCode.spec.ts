import { describe, expect, it } from "vitest";
import { diffCode } from "./diffCode";
import { mock_poolImpl32 } from "./mocks/poolImpl32";
import { mock_poolImpl33 } from "./mocks/poolImpl33";
import { parseEtherscanStyleSourceCode } from "../ecosystem/explorers";

describe("operations:diffCode", () => {
  it("should generate code diff between two contracts", async () => {
    const before = parseEtherscanStyleSourceCode(
      mock_poolImpl32.result[0].SourceCode,
    );
    const after = parseEtherscanStyleSourceCode(
      mock_poolImpl33.result[0].SourceCode,
    );
    expect(await diffCode(before, after)).toMatchSnapshot();
  });
});
