import { createPatch, createTwoFilesPatch, diffChars } from "diff";
import { format } from "prettier/standalone";
import solidityPlugin from "prettier-plugin-solidity/standalone";
import { StandardJsonInput } from "../ecosystem/types";

const prettierOptions = { parser: "solidity-parse", plugins: [solidityPlugin] };

export async function diffCode(
  before: StandardJsonInput,
  after: StandardJsonInput,
) {
  const changes: Record<string, string> = {};

  // diff settings
  const settingsBefore = JSON.stringify(before.settings, null, 2);
  const settingsAfter = JSON.stringify(after.settings, null, 2);
  if (settingsBefore !== settingsAfter)
    changes.settings = createPatch("settings", settingsBefore, settingsAfter);
  const contractsBefore = await Promise.all(
    Object.entries(before.sources).map(async ([path, source]) => [
      path.replace(/^.*[\\/]/, ""),
      path,
      await format(source.content, prettierOptions),
    ]),
  );
  const contractsAfter = await Promise.all(
    Object.entries(after.sources).map(async ([path, source]) => [
      path.replace(/^.*[\\/]/, ""),
      path,
      await format(source.content, prettierOptions),
    ]),
  );
  for (const [name, path, source] of contractsBefore) {
    // we find all matching names and diff against the one having the most similar content
    const matchingIndexes = contractsAfter.reduce((acc, val, i) => {
      if (val[0] === name) acc.push(i);
      return acc;
    }, [] as number[]);
    let indexAfter = -1;
    if (matchingIndexes.length === 1) {
      indexAfter = matchingIndexes[0];
    } else if (matchingIndexes.length > 1) {
      let maxSimilarity = -1;
      for (const idx of matchingIndexes) {
        const afterSource = contractsAfter[idx][2];
        const diff = diffChars(source, afterSource); // to find the most similar source
        // for similarity we count the unchanged characters
        const similarity = diff.reduce((acc, part) => acc + (part.added || part.removed ? 0 : part.count || part.value.length), 0);
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
          indexAfter = idx;
        }
      }
    }
    // removed
    if (indexAfter === -1) {
      changes[name] = createPatch(path, source, "");
    } else {
      if (source !== contractsAfter[indexAfter][2])
        changes[name] = createTwoFilesPatch(
          path,
          contractsAfter[indexAfter][1],
          source,
          contractsAfter[indexAfter][2],
        );
    }
  }
  for (const [name, path, source] of contractsAfter) {
    const indexAfter = contractsBefore.findIndex(([_name]) => _name === name);
    // removed
    if (indexAfter === -1) {
      changes[name] = createPatch(path, "", source);
    }
  }
  return changes;
}
