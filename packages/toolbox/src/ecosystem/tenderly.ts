/**
 * While tenderly is a fenomanal tool for testing, it is not always easy to use as there are minor bugs and small nuances to consider everywhere.
 * This is a simple wrapper around the tenderly APIs.
 */
import {
  Address,
  Hex,
  TestClient,
  WalletClient,
  createTestClient,
  createWalletClient,
  http,
  publicActions,
} from "viem";
import {
  Input,
  SoltypeElement,
  TenderlyLog,
  TenderlySimRequest,
} from "./tenderly.types";
import { ChainList } from "./chainIds";
import { tenderlyExplorerMap } from "..";

type TenderlyConfig = {
  accountSlug: string;
  projectSlug: string;
  accessToken: string;
};

type Tenderly_createVnetParams = {
  slug: string;
  displayName: string;
  baseChainId: number;
  forkChainId: number;
  blockNumber?: Hex;
  // deletes the existing fork in case a fork with the same name already exists
  force?: boolean;
};

export type Tenderly_createVnetParamsResponse = {
  id: string;
  slug: string;
  display_name: number;
  fork_config: { network_id: number; block_number: Hex };
  virtual_network_config: {
    chain_config: { chain_id: number };
    accounts: { address: string }[];
  };
  rpcs: [
    { url: string; name: "Admin RPC" },
    { url: string; name: "Public RPC" },
  ];
};

const TENDERLY_BASE_URL = "https://api.tenderly.co/api/v1";

export async function tenderly_deleteVnet(
  vnetId: string,
  { accountSlug, projectSlug, accessToken }: TenderlyConfig,
) {
  return fetch(
    `${TENDERLY_BASE_URL}/account/${accountSlug}/project/${projectSlug}/vnets/${vnetId}`,
    {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
        "X-Access-Key": accessToken,
      }),
    },
  );
}

export async function tenderly_simVnet(
  vnetId: string,
  { accountSlug, projectSlug, accessToken }: TenderlyConfig,
  body: any,
) {
  const response = await fetch(
    // Note: this is subject to change and currently uses the internal api of tenderly
    `${TENDERLY_BASE_URL}/account/${accountSlug}/project/${projectSlug}/testnet/${vnetId}/simulate`,
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: new Headers({
        "Content-Type": "application/json",
        "X-Access-Key": accessToken,
      }),
    },
  );
  return response.json();
}

export async function tenderly_getVnet(
  slug: string,
  { accountSlug, projectSlug, accessToken }: TenderlyConfig,
): Promise<{ id: string; slug: string }[]> {
  return (
    await fetch(
      `${TENDERLY_BASE_URL}/account/${accountSlug}/project/${projectSlug}/vnets?match_field=slug&match_type=prefix&keywords=${slug}`,
      {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          "X-Access-Key": accessToken,
        }),
      },
    )
  ).json();
}

export async function tenderly_createVnet(
  {
    slug,
    displayName,
    baseChainId,
    forkChainId,
    blockNumber,
    force,
  }: Tenderly_createVnetParams,
  { accessToken, accountSlug, projectSlug }: TenderlyConfig,
) {
  if (!accessToken) throw new Error("Tenderly access token not provided");
  if (!accountSlug) throw new Error("Tenderly account slug not provided");
  if (!projectSlug) throw new Error("Tenderly project slug not provided");
  const body = {
    slug: slug,
    display_name: displayName,
    fork_config: {
      network_id: baseChainId,
      ...(blockNumber ? { block_number: blockNumber } : {}),
    },
    virtual_network_config: {
      chain_config: {
        chain_id: forkChainId,
      },
    },
    sync_state_config: {
      enabled: false,
    },
    explorer_page_config: {
      enabled: false,
      verification_visibility: "bytecode",
    },
  };

  async function createVnet() {
    return (
      await fetch(
        `${TENDERLY_BASE_URL}/account/${accountSlug}/project/${projectSlug}/vnets`,
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: new Headers({
            "Content-Type": "application/json",
            "X-Access-Key": accessToken,
          }),
        },
      )
    ).json() as Promise<Tenderly_createVnetParamsResponse>;
  }

  let response = await createVnet();
  if ((response as any).error?.slug === "conflict" && force) {
    const staleVnet = await tenderly_getVnet(slug, {
      accessToken,
      accountSlug,
      projectSlug,
    });
    await tenderly_deleteVnet(staleVnet[0].id, {
      accessToken,
      accountSlug,
      projectSlug,
    });
    response = await createVnet();
  }
  if ((response as any).error) {
    console.error(`Error: ${(response as any).error.message}`);
    throw new Error("Tenderly vnet could not be created");
  }
  const rpc = response.rpcs.find(
    (r) => r.name.includes("Admin") && r.url.includes("https://"),
  )!;
  return {
    vnet: response,
    testClient: createTestClient({
      chain: {
        ...ChainList[baseChainId as keyof typeof ChainList],
        id: forkChainId,
      },
      mode: "tenderly" as "hardhat",
      transport: http(rpc.url, { timeout: 200_000 }),
    }).extend(publicActions),
    walletClient: createWalletClient({
      chain: {
        ...ChainList[baseChainId as keyof typeof ChainList],
        id: forkChainId,
      },
      account: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
      transport: http(rpc.url, { timeout: 200_000 }),
    }),
    simulate: (body: object) =>
      tenderly_simVnet(
        response.id,
        {
          accessToken,
          accountSlug,
          projectSlug,
        },
        {
          network_id: baseChainId.toString(),
          block_number: null,
          transaction_index: 0,
          gas_price: "0",
          access_list: [],
          generate_access_list: true,
          save: true,
          source: "dashboard",
          force_import_contracts: true,
          ...body,
        },
      ),
    delete: () =>
      tenderly_deleteVnet(response.id, {
        accessToken,
        accountSlug,
        projectSlug,
      }),
  };
}

export async function tenderly_sim(
  { accountSlug, projectSlug, accessToken }: TenderlyConfig,
  body: TenderlySimRequest,
) {
  const response = await fetch(
    // Note: this is subject to change and currently uses the internal api of tenderly
    `${TENDERLY_BASE_URL}/account/${accountSlug}/project/${projectSlug}/simulate`,
    {
      method: "POST",
      body: JSON.stringify({
        generate_access_list: true,
        save: true,
        gas_price: "0",
        gas: 30_000_000,
        force_import_contracts: true,
        ...body,
      }),
      headers: new Headers({
        "Content-Type": "application/json",
        "X-Access-Key": accessToken,
      }),
    },
  );
  return response.json();
}

type DefaultType = {
  name: string;
  type: string;
  internalType: string;
  indexed: boolean;
  components?: DefaultType[];
};

function unwrapComponents(input: SoltypeElement[]): DefaultType[] {
  return input.map((input) => {
    if (input.type === "tuple") {
      return {
        name: input.name,
        type: input.type,
        internalType: input.type,
        indexed: input.indexed,
        components: unwrapComponents(input.components!),
      };
    }
    return {
      name: input.name,
      type: input.type,
      internalType: input.type,
      indexed: input.indexed,
    };
  });
}

function unwrapLogInputs(inputs: Input[]) {
  return inputs.map((input) => {
    if (input.soltype?.type === "tuple") {
      return {
        name: input.soltype?.name!,
        type: input.soltype?.type!,
        indexed: input.soltype?.indexed!,
        internalType: input.soltype?.type!,
        components: unwrapComponents(input.soltype?.components!),
      };
    }
    return {
      name: input.soltype?.name!,
      type: input.soltype?.type!,
      indexed: input.soltype?.indexed!,
      internalType: input.soltype?.type!,
    };
  });
}

/**
 * Tenderly returns some internal representation of the abi.
 * As our tooling intends to be agnostic to the underlying ecosystem,
 * we need to convert the Tenderly representation to the default abi representation.
 * @param logs
 * @returns
 */
export function tenderly_logsToAbiLogs(logs: TenderlyLog[]) {
  return logs.map((log) => {
    return {
      type: "event",
      name: log.name,
      ...(log.inputs ? { inputs: unwrapLogInputs(log.inputs) } : {}),
    };
  });
}

export function tenderly_pingExplorer(chainId: number, address: Address) {
  return fetch(
    `https://dashboard.tenderly.co/contract/${tenderlyExplorerMap[chainId as keyof typeof tenderlyExplorerMap]}/${address}/txs/all`,
  );
}
