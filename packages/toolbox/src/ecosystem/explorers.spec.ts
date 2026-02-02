import { describe, expect, it } from "vitest";
import {
  getExplorer,
  getSourceCode,
  parseEtherscanStyleSourceCode,
} from "./explorers";
import { mock_getSourceCode } from "./mocks/getSourceCode";

describe("ecosystem:explorers", () => {
  it("getExplorer should follow prioritization", () => {
    expect(getExplorer(1).explorer).toEqual("https://etherscan.io/");
    expect(getExplorer(1088).explorer).toEqual("1088.routescan.io");
  });

  it.skipIf(process.env.CI)(
    "getSourceCode download a given contract",
    async () => {
      const response = await getSourceCode({
        chainId: 1,
        address: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
        apiKey: process.env.ETHERSCAN_API_KEY,
      });
      expect(response.SourceCode).toMatchSnapshot();
    },
  );

  it.skipIf(process.env.CI)(
    "getSourceCode download a given contract on blockscout",
    async () => {
      const response = await getSourceCode({
        chainId: 1868,
        address: "0xa0208CE8356ad6C5EC6dFb8996c9A6B828212022",
      });
      expect(response).toMatchSnapshot();
    },
  );

  it.skipIf(process.env.CI)(
    "getSourceCode download a given contract on xlayer explorer",
    async () => {
      const response = await getSourceCode({
        chainId: 196,
        address: "0xEB0682d148e874553008730f0686ea89db7DA412",
      });
      expect(response).toMatchSnapshot();
    },
  );

  it("should properly decode sourcecode string", () => {
    expect(
      parseEtherscanStyleSourceCode(mock_getSourceCode.result[0].SourceCode),
    ).toMatchSnapshot();
  });
});
