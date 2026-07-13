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
 * Whether the explorer payload is a blockscout-style result. Blockscout ships a
 * structured `CompilerSettings` object (and, for multi-file contracts, an
 * `AdditionalSources` array) — etherscan returns neither, packing everything
 * into a single (possibly standard-json) `SourceCode` string plus flat
 * `Runs`/`EVMVersion` fields. We key off `CompilerSettings` because single-file
 * blockscout contracts omit `AdditionalSources` entirely, and misrouting them to
 * the etherscan path fabricates an invalid `optimizer.runs: null`.
 */
function isBlockscoutStyle(
  source: EtherscanStyleSourceCode | BlockscoutStyleSourceCode,
): source is BlockscoutStyleSourceCode {
  if (Array.isArray((source as BlockscoutStyleSourceCode).AdditionalSources)) {
    return true;
  }
  const settings = (source as { CompilerSettings?: unknown }).CompilerSettings;
  return typeof settings === "object" && settings !== null;
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
 * Recognizes a solc standard-json input that an explorer returned as a single
 * JSON string — e.g. OKLink's `{"language":"Solidity","sources":{...}}` — as
 * opposed to etherscan's `{{ ... }}` double-wrapped form or a bare multi-file
 * map. Returns the parsed input, or `undefined` when `raw` isn't one.
 *
 * The discriminator is a top-level `sources` object whose entries carry a
 * `content` string; a plain multi-file map (`{ "A.sol": { content } }`) has no
 * such `sources` key and is left to lib-sourcify's multi-file handling.
 */
function parseSingleWrappedStandardJson(raw: string):
  | {
      language?: string;
      sources: SolidityJsonInput["sources"];
      settings?: SolidityJsonInput["settings"];
    }
  | undefined {
  let text = raw.trim();
  if (text.startsWith("{{") && text.endsWith("}}")) text = text.slice(1, -1);
  if (!text.startsWith("{")) return undefined;
  let parsed: { sources?: unknown };
  try {
    parsed = JSON.parse(text);
  } catch {
    return undefined;
  }
  const sources = parsed?.sources;
  if (!sources || typeof sources !== "object" || Array.isArray(sources)) {
    return undefined;
  }
  const first = Object.values(sources)[0] as { content?: unknown } | undefined;
  if (!first || typeof first.content !== "string") return undefined;
  return parsed as ReturnType<typeof parseSingleWrappedStandardJson>;
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
  // Guard against unverified contracts / partial explorer responses before we
  // touch any fields, so callers get a clear message instead of a cryptic
  // "cannot read properties of undefined" deep in the parsing below.
  if (!source.SourceCode) {
    throw new Error(
      "Explorer returned no source for this contract — it appears unverified, or the explorer returned a partial response. Retry or try a different --explorer.",
    );
  }

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
    // Single-file blockscout contracts omit `AdditionalSources` entirely.
    for (const extra of source.AdditionalSources ?? []) {
      sources[extra.Filename] = { content: extra.SourceCode };
    }
    const compilerSettings = source.CompilerSettings as Record<string, unknown>;
    const jsonInput = {
      language: "Solidity",
      sources,
      settings: {
        ...compilerSettings,
        // Blockscout strips `outputSelection` from the settings it echoes back;
        // solc needs it to emit bytecode, so restore a permissive default when
        // it is absent (it does not affect the produced bytecode).
        outputSelection: compilerSettings.outputSelection ?? {
          "*": { "*": ["*"], "": ["*"] },
        },
      },
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
  if (!source.CompilerVersion) {
    throw new Error(
      "Explorer source is missing a CompilerVersion; cannot verify bytecode.",
    );
  }
  const compilerVersion = EtherscanUtils.resolveSolidityVersion(
    source.CompilerVersion.replace(/^v/, ""),
  );

  let jsonInput: SolidityJsonInput;
  const standardJson = parseSingleWrappedStandardJson(rawSource);
  if (EtherscanUtils.isEtherscanJsonInput(rawSource)) {
    jsonInput = EtherscanUtils.parseEtherscanJsonInput(rawSource);
  } else if (standardJson) {
    // Single-JSON standard input (e.g. OKLink). Use its sources, and its own
    // settings when present, otherwise synthesize them from the flat
    // etherscan-style fields (OptimizationUsed / Runs / EVMVersion).
    jsonInput = standardJson.settings
      ? ({
          language: standardJson.language ?? "Solidity",
          sources: standardJson.sources,
          settings: standardJson.settings,
        } as unknown as SolidityJsonInput)
      : EtherscanUtils.getSolcJsonInputFromEtherscanResult(
          source as unknown as Parameters<
            typeof EtherscanUtils.getSolcJsonInputFromEtherscanResult
          >[0],
          standardJson.sources,
        );
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
