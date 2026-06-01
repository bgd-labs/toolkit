import {
  EtherscanUtils,
  type CompilationTarget,
  type SolidityJsonInput,
} from "@ethereum-sourcify/lib-sourcify";
import {
  type BlockscoutStyleSourceCode,
  type EtherscanStyleSourceCode,
} from "../ecosystem/explorers";

export type NormalizedSource = {
  /** Full solc build identifier, e.g. `0.8.19+commit.7dd6d404`. */
  compilerVersion: string;
  jsonInput: SolidityJsonInput;
  target: CompilationTarget;
};

/**
 * Whether the explorer payload is a blockscout-style result, which ships its
 * sources split across `SourceCode` + `AdditionalSources` rather than a single
 * (possibly standard-json) `SourceCode` string like etherscan.
 */
function isBlockscoutStyle(
  source: EtherscanStyleSourceCode | BlockscoutStyleSourceCode,
): source is BlockscoutStyleSourceCode {
  return Array.isArray((source as BlockscoutStyleSourceCode).AdditionalSources);
}

/**
 * Finds the source path that declares `contractName`, falling back to the first
 * source when nothing matches (some explorers omit the file path entirely).
 */
function findContractPath(
  sources: SolidityJsonInput["sources"],
  contractName: string,
): string {
  const declaration = new RegExp(
    `(?:contract|library|abstract\\s+contract|interface)\\s+${contractName}\\b`,
  );
  const paths = Object.keys(sources);
  const match = paths.find((path) => {
    const content = (sources[path] as { content?: string }).content;
    return content ? declaration.test(content) : false;
  });
  return match ?? paths[0];
}

/**
 * Normalizes a raw explorer payload (etherscan or blockscout shaped, as
 * returned by {@link getSourceCode}) into the canonical
 * `{ compilerVersion, jsonInput, target }` triple consumed by lib-sourcify's
 * `SolidityCompilation`.
 *
 * The three etherscan source shapes (single flat file, multi-file object and
 * double-wrapped standard-json) are handled by lib-sourcify's `EtherscanUtils`;
 * the blockscout shape is mapped manually.
 */
export function normalizeExplorerSource(
  source: EtherscanStyleSourceCode | BlockscoutStyleSourceCode,
): NormalizedSource {
  if (isBlockscoutStyle(source)) {
    const compilerVersion = (source as { CompilerVersion?: string })
      .CompilerVersion;
    if (!compilerVersion) {
      throw new Error(
        "Blockscout source is missing a CompilerVersion; cannot verify bytecode.",
      );
    }
    const sources: SolidityJsonInput["sources"] = {
      [source.FileName]: { content: source.SourceCode },
    };
    for (const extra of source.AdditionalSources) {
      sources[extra.Filename] = { content: extra.SourceCode };
    }
    const jsonInput = {
      language: "Solidity",
      sources,
      settings: source.CompilerSettings,
    } as unknown as SolidityJsonInput;
    return {
      compilerVersion: EtherscanUtils.resolveSolidityVersion(compilerVersion),
      jsonInput,
      target: {
        name: source.ContractName,
        path: findContractPath(sources, source.ContractName),
      },
    };
  }

  // Etherscan-style. We reuse lib-sourcify's parsers for the three source
  // shapes, but resolve the target path ourselves: lib-sourcify v3 expects the
  // newer Etherscan `ContractFileName` field, which the classic `getsourcecode`
  // endpoint this toolbox talks to does not return.
  const rawSource = source.SourceCode;
  const contractName = source.ContractName;
  const compilerVersion = EtherscanUtils.resolveSolidityVersion(
    source.CompilerVersion.replace(/^v/, ""),
  );

  let jsonInput: SolidityJsonInput;
  if (EtherscanUtils.isEtherscanJsonInput(rawSource)) {
    jsonInput = EtherscanUtils.parseEtherscanJsonInput(rawSource);
  } else if (EtherscanUtils.isEtherscanMultipleFilesObject(rawSource)) {
    jsonInput = EtherscanUtils.getSolcJsonInputFromEtherscanResult(
      source as unknown as Parameters<
        typeof EtherscanUtils.getSolcJsonInputFromEtherscanResult
      >[0],
      JSON.parse(rawSource),
    );
  } else {
    // single flat source file
    const path = `${contractName}.sol`;
    jsonInput = EtherscanUtils.getSolcJsonInputFromEtherscanResult(
      source as unknown as Parameters<
        typeof EtherscanUtils.getSolcJsonInputFromEtherscanResult
      >[0],
      { [path]: { content: rawSource } },
    );
  }

  // Prefer the explorer-provided file name, but only when it is non-empty and
  // actually present in the sources — etherscan v2 sometimes returns it blank.
  const contractFileName = (source as { ContractFileName?: string })
    .ContractFileName;
  const path =
    contractFileName && jsonInput.sources[contractFileName]
      ? contractFileName
      : findContractPath(jsonInput.sources, contractName);
  return {
    compilerVersion,
    jsonInput,
    target: {
      name: contractName,
      path,
    },
  };
}
