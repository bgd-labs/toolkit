import { describe, expect, it } from "vitest";
import { normalizeExplorerSource } from "./normalize";
import { mock_getSourceCode } from "../ecosystem/mocks/getSourceCode";
import type {
  BlockscoutStyleSourceCode,
  EtherscanStyleSourceCode,
} from "../ecosystem/explorers";

describe("verification:normalizeExplorerSource", () => {
  it("normalizes an etherscan double-wrapped standard-json source", () => {
    const result = mock_getSourceCode.result[0] as EtherscanStyleSourceCode;
    const normalized = normalizeExplorerSource(result);

    expect(normalized.compilerVersion).toMatch(/0\.8\.10\+commit\.fc410830/);
    expect(normalized.jsonInput.language).toEqual("Solidity");
    expect(normalized.target.name).toEqual(
      "InitializableImmutableAdminUpgradeabilityProxy",
    );
    // the resolved path must actually be one of the provided sources
    expect(Object.keys(normalized.jsonInput.sources)).toContain(
      normalized.target.path,
    );
    expect(normalized.target.path).toContain(
      "InitializableImmutableAdminUpgradeabilityProxy",
    );
  });

  it("wraps a single flat etherscan source file into standard-json", () => {
    const flat: EtherscanStyleSourceCode = {
      ABI: "[]",
      CompilerVersion: "v0.8.19+commit.7dd6d404",
      ConstructorArguments: "0x",
      ContractName: "Counter",
      EVMVersion: "paris",
      Implementation: "" as any,
      Library: "",
      LicenseType: "MIT",
      OptimizationUsed: "1",
      Proxy: "0",
      Runs: "200",
      SimilarMatch: "",
      SourceCode:
        "// SPDX-License-Identifier: MIT\npragma solidity 0.8.19;\ncontract Counter { uint256 public count; }",
    };
    const normalized = normalizeExplorerSource(flat);

    expect(normalized.compilerVersion).toMatch(/0\.8\.19\+commit\.7dd6d404/);
    expect(normalized.jsonInput.language).toEqual("Solidity");
    expect(normalized.target.name).toEqual("Counter");
    expect(Object.keys(normalized.jsonInput.sources)).toContain(
      normalized.target.path,
    );
    expect(normalized.jsonInput.settings.optimizer).toEqual({
      enabled: true,
      runs: 200,
    });
  });

  it("merges blockscout split sources and resolves the target contract", () => {
    const blockscout = {
      AdditionalSources: [
        {
          Filename: "contracts/Lib.sol",
          SourceCode: "library Lib { function id(uint256 x) internal pure returns (uint256) { return x; } }",
        },
      ],
      CompilerSettings: {
        evmVersion: "london",
        libraries: {},
        optimizer: { enabled: false, runs: 200 },
      },
      ConstructorArguments: "0x" as any,
      ExternalLibraries: [],
      SourceCode: "import './Lib.sol'; contract Token { }",
      ContractName: "Token",
      FileName: "contracts/Token.sol",
      EVMVersion: "london",
      OptimizationUsed: "false",
      CompilerVersion: "v0.8.20+commit.a1b79de6",
    } as unknown as BlockscoutStyleSourceCode;

    const normalized = normalizeExplorerSource(blockscout);

    expect(normalized.compilerVersion).toMatch(/0\.8\.20\+commit\.a1b79de6/);
    expect(normalized.jsonInput.language).toEqual("Solidity");
    expect(Object.keys(normalized.jsonInput.sources)).toEqual([
      "contracts/Token.sol",
      "contracts/Lib.sol",
    ]);
    // Token is declared in Token.sol, not the first-by-chance source
    expect(normalized.target).toEqual({
      name: "Token",
      path: "contracts/Token.sol",
    });
  });

  it("routes a single-file blockscout source (no AdditionalSources) via CompilerSettings", () => {
    // Real blockscout single-file responses omit `AdditionalSources` and have no
    // top-level `Runs` — they carry the real optimizer runs inside
    // `CompilerSettings`. Misrouting these to the etherscan path used to
    // fabricate an invalid `optimizer.runs: null` that explorers reject.
    const blockscout = {
      CompilerSettings: {
        evmVersion: "paris",
        libraries: {},
        metadata: { bytecodeHash: "ipfs" },
        optimizer: { enabled: false, runs: 200 },
        remappings: [],
      },
      ConstructorArguments: "0x" as any,
      SourceCode:
        "// SPDX-License-Identifier: MIT\npragma solidity 0.8.20;\ncontract Presale { uint256 public x; }",
      ABI: "[]",
      ContractName: "Presale",
      CompilerVersion: "v0.8.20+commit.a1b79de6",
      OptimizationUsed: "false",
      EVMVersion: "paris",
      FileName: "Presale.sol",
    } as unknown as BlockscoutStyleSourceCode;

    const normalized = normalizeExplorerSource(blockscout);

    expect(normalized.target).toEqual({ name: "Presale", path: "Presale.sol" });
    // The optimizer must come from CompilerSettings, never a fabricated null.
    expect(normalized.jsonInput.settings.optimizer).toEqual({
      enabled: false,
      runs: 200,
    });
    expect(
      (normalized.jsonInput.settings as { outputSelection?: unknown })
        .outputSelection,
    ).toBeDefined();
    expect(Object.keys(normalized.jsonInput.sources)).toEqual(["Presale.sol"]);
  });

  it("normalizes a single-wrapped standard-json source (e.g. OKLink) without mangling the path", () => {
    // OKLink returns the standard-json input single-wrapped (`{"sources":...}`),
    // not etherscan's `{{ ... }}`, and with no `settings`. Previously this was
    // mis-parsed as a multi-file map, yielding a bogus `sources:<Name>` target.
    const okLinkStyle: EtherscanStyleSourceCode = {
      ABI: "[]",
      CompilerVersion: "v0.8.27+commit.40a35a09",
      ConstructorArguments: "0x" as any,
      ContractName: "Token",
      EVMVersion: "shanghai",
      Implementation: "" as any,
      Library: "",
      LicenseType: "MIT",
      OptimizationUsed: "1",
      Proxy: "0",
      Runs: "200",
      SimilarMatch: "",
      SourceCode: JSON.stringify({
        language: "Solidity",
        sources: {
          "contracts/Lib.sol": { content: "library Lib {}" },
          "contracts/Token.sol": {
            content: "import './Lib.sol'; contract Token {}",
          },
        },
      }),
    };

    const normalized = normalizeExplorerSource(okLinkStyle);

    expect(normalized.target).toEqual({
      name: "Token",
      path: "contracts/Token.sol",
    });
    expect(Object.keys(normalized.jsonInput.sources)).toEqual([
      "contracts/Lib.sol",
      "contracts/Token.sol",
    ]);
    // settings synthesized from the flat fields, since the json carried none
    expect(normalized.jsonInput.settings.optimizer).toEqual({
      enabled: true,
      runs: 200,
    });
  });
});
