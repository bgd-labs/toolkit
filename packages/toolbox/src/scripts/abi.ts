import util from "node:util";
import { exec } from "node:child_process";
import path from "node:path";
import { promises as fs } from "node:fs";
import { prefixWithGeneratedWarning } from "./common";

const contracts = [
  "node_modules/@aave-dao/aave-v3-origin/src/contracts/interfaces/IPool.sol",
  "node_modules/@aave-dao/aave-v3-origin/src/contracts/interfaces/IPoolConfigurator.sol",
  "node_modules/@aave-dao/aave-v3-origin/src/contracts/interfaces/IPoolAddressesProvider.sol",
  "node_modules/@aave-dao/aave-v3-origin/src/contracts/interfaces/IAToken.sol",
  "node_modules/@aave-dao/aave-v3-origin/src/contracts/interfaces/IReserveInterestRateStrategy.sol",
  "node_modules/@aave-dao/aave-v3-origin/src/contracts/interfaces/IDefaultInterestRateStrategyV2.sol",
  "node_modules/@aave-dao/aave-v3-origin/src/contracts/interfaces/IAaveOracle.sol",
  "node_modules/@aave-dao/aave-v3-origin/src/contracts/treasury/ICollector.sol",
  "node_modules/@aave-dao/aave-v3-origin/src/contracts/rewards/interfaces/IRewardsController.sol",
  "node_modules/@aave-dao/aave-v3-origin/src/contracts/rewards/interfaces/IEmissionManager.sol",
  "node_modules/@aave-dao/aave-v3-origin/src/contracts/dependencies/chainlink/AggregatorInterface.sol",
  "node_modules/@aave-dao/aave-v3-origin/src/contracts/extensions/v3-config-engine/IAaveV3ConfigEngine.sol",
  "node_modules/@aave-dao/aave-v3-origin/src/contracts/extensions/stata-token/interfaces/IStataTokenFactory.sol",
  "node_modules/@aave-dao/aave-v3-origin/src/contracts/extensions/stata-token/interfaces/IStataTokenV2.sol",
  "node_modules/@aave-dao/aave-v3-origin/src/contracts/helpers/interfaces/IWrappedTokenGatewayV3.sol",
  "node_modules/@aave-dao/aave-v3-origin/src/contracts/protocol/tokenization/base/IncentivizedERC20.sol",
  "node_modules/@openzeppelin/contracts/access/IAccessControl.sol",
  "node_modules/@openzeppelin/contracts/access/Ownable.sol",
  "node_modules/@openzeppelin/contracts/interfaces/IERC1967.sol",
  "node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol",
  "node_modules/@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol",
  "node_modules/@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol",
  "node_modules/@aave-dao/aave-umbrella/src/contracts/stakeToken/interfaces/IUmbrellaStakeToken.sol",
  "node_modules/@aave-dao/aave-umbrella/src/contracts/umbrella/interfaces/IUmbrella.sol",
  "node_modules/@aave-dao/aave-umbrella/src/contracts/rewards/interfaces/IRewardsController.sol",
  "node_modules/@bgd-labs/solidity-utils/src/contracts/access-control/interfaces/IWithGuardian.sol",
  "node_modules/@aave-dao/aave-umbrella/src/contracts/rewards/interfaces/IRewardsDistributor.sol",
  "node_modules/@safe-global/safe-deployments/dist/assets/v1.5.0/safe.json",
  "node_modules/@bgd-labs/aave-price-feeds/src/interfaces/ICLSynchronicityPriceAdapter.sol",
  "node_modules/@bgd-labs/aave-price-feeds/src/contracts/CLRatePriceCapAdapter.sol",
  "node_modules/@bgd-labs/aave-price-feeds/src/contracts/CLSynchronicityPriceAdapterBaseToPeg.sol",
  "node_modules/@bgd-labs/aave-price-feeds/src/contracts/CLSynchronicityPriceAdapterPegToBase.sol",
  "node_modules/@bgd-labs/aave-price-feeds/src/contracts/PendlePriceCapAdapter.sol",
  "node_modules/@bgd-labs/aave-price-feeds/src/contracts/PriceCapAdapterBase.sol",
  "node_modules/@bgd-labs/aave-price-feeds/src/contracts/PriceCapAdapterStable.sol",
];

const extractFileName = (input: string) => {
  // Remove anything after the colon (if present)
  const cleanPath = input.split(":")[0];

  // Extract the filename without extension
  const name = path.parse(cleanPath).name;

  // make sure first letter is uppercase
  const capitalized = name.charAt(0).toUpperCase() + name.slice(1);

  // add 'I' prefix if it doesn't start with uppercase 'I'
  return capitalized.charAt(0) === "I" ? capitalized : "I" + capitalized;
};

const awaitableExec = util.promisify(exec);

(async function generateAbis() {
  for (const contract of contracts) {
    const INTERFACE = extractFileName(contract);
    let varName = `${INTERFACE}_ABI`;
    let fileName = `${INTERFACE}.ts`;
    let content: string | null = null;

    if (contract.endsWith(".sol")) {
      const { stdout, stderr } = await awaitableExec(
        `forge inspect --json ${contract} abi`,
      );
      if (stderr) {
        throw new Error(`Failed to generate abi for ${INTERFACE}`);
      }

      if (
        contract.includes(
          "aave-umbrella/src/contracts/rewards/interfaces/IRewardsController.sol",
        )
      ) {
        varName = `Umbrella_${INTERFACE}_ABI`;
        fileName = `Umbrella_${INTERFACE}.ts`;
      } else if (
        contract.includes(
          "aave-umbrella/src/contracts/rewards/interfaces/IRewardsDistributor.sol",
        )
      ) {
        varName = `Umbrella_${INTERFACE}_ABI`;
        fileName = `Umbrella_${INTERFACE}.ts`;
      }

      content = prefixWithGeneratedWarning(
        `export const ${varName} = ${JSON.stringify(JSON.parse(stdout.trim()), null, 2)} as const;`,
      );
    }

    if (contract.endsWith(".json")) {
      const text = await fs.readFile(contract, "utf8");
      const jsonContent = JSON.parse(text.toString());

      content = prefixWithGeneratedWarning(
        `export const ${varName} = ${JSON.stringify(jsonContent, null, 2)} as const;`,
      );
    }

    if (!content) {
      throw new Error(`Could not generate ABI for ${INTERFACE}`);
    }

    await fs.writeFile(
      path.join(process.cwd(), `src/abis/${fileName}`),
      content,
    );
  }
  const files = (await fs.readdir(path.join(process.cwd(), `src/abis`)))
    .filter((file) => file !== "index.ts")
    .sort((a, b) => a.localeCompare(b));
  await fs.writeFile(
    path.join(process.cwd(), `src/abis/index.ts`),
    prefixWithGeneratedWarning(
      files
        .map((file) => `export * from './${file.replace(".ts", "")}';`)
        .join("\n"),
    ),
  );
})();
