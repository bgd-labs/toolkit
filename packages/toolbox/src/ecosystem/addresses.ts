import { ChainId } from "./chainIds";

// https://developers.velora.xyz/api/velora-api/velora-delta-api/contracts
export const VELORA_PORTIKUS = {
  [ChainId.mainnet]: "0x0000000000bbF5c5Fd284e657F01Bd000933C96D",
  [ChainId.base]: "0x0000000000bbF5c5Fd284e657F01Bd000933C96D",
  [ChainId.optimism]: "0x0000000000bbF5c5Fd284e657F01Bd000933C96D",
  [ChainId.arbitrum]: "0x0000000000bbF5c5Fd284e657F01Bd000933C96D",
  [ChainId.polygon]: "0x0000000000bbF5c5Fd284e657F01Bd000933C96D",
  [ChainId.bnb]: "0x0000000000bbF5c5Fd284e657F01Bd000933C96D",
};

/**
 * The following is a list of venues that offer free flashloans
 */
export const BALANCER_VAULT_V2 = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";
export const BALANCER_VAULT_V3 = "0xbA1333333333a1BA1108E8412f11850A5C319bA9";

export const UNISWAP_V4_MANAGER = {
  [ChainId.mainnet]: "0x000000000004444c5dc75cB358380D2e3dE08A90",
  [ChainId.base]: "0x498581ff718922c3f8e6a244956af099b2652b2b",
  [ChainId.optimism]: "0x9a13f98cb987694c9f086b1f5eb990eea8264ec3",
  [ChainId.arbitrum]: "0x360e68faccca8ca495c1b759fd9eee466db9fb32",
  [ChainId.polygon]: "0x67366782805870060151383f4bbff9dab53e5cd6",
  [ChainId.ink]: "0x360e68faccca8ca495c1b759fd9eee466db9fb32",
  [ChainId.soneium]: "0x360e68faccca8ca495c1b759fd9eee466db9fb32",
  [ChainId.avalanche]: "0x06380c0e0912312b5150364b9dc4542ba0dbbc85",
  [ChainId.bnb]: "0x28e2ea090877bf75740558f6bfb36a5ffee9e9df",
  [ChainId.celo]: "0x288dc841A52FCA2707c6947B3A777c5E56cd87BC",
  [ChainId.megaeth]: "0xacb7e78fa05d562e0a5d3089ec896d57d057d38e",
};

export const MORPHO = {
  [ChainId.mainnet]: "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb",
  [ChainId.arbitrum]: "0x6c247b1F6182318877311737BaC0844bAa518F5e",
  [ChainId.avalanche]: "0x895383274303AA19fe978AFB4Ac55C7f094f982C",
  [ChainId.base]: "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb",
  [ChainId.bnb]: "0x01b0Bd309AA75547f7a37Ad7B1219A898E67a83a",
  [ChainId.celo]: "0xd24ECdD8C1e0E57a4E26B1a7bbeAa3e95466A569",
  [ChainId.gnosis]: "0xB74D4dd451E250bC325AFF0556D717e4E2351c66",
  [ChainId.ink]: "0x857f3EefE8cbda3Bc49367C996cd664A880d3042",
  [ChainId.linea]: "0x6B0D716aC0A45536172308e08fC2C40387262c9F",
  [ChainId.plasma]: "0x2fF74A46536f5c67ef5A42FD5B4e2Ed8A2cee249",
  [ChainId.scroll]: "0x2d012EdbAdc37eDc2BC62791B666f9193FDF5a55",
  [ChainId.soneium]: "0xE75Fc5eA6e74B824954349Ca351eb4e671ADA53a",
  [ChainId.sonic]: "0xd6c916eB7542D0Ad3f18AEd0FCBD50C582cfa95f",
};
