import { CID } from "multiformats/cid";
import { sha256 } from "multiformats/hashes/sha2";
import * as dagPB from "@ipld/dag-pb";
import { UnixFS } from "ipfs-unixfs";

/**
 * Generates an IPFS CIDv0 hash for the given content
 * @param content - String or Uint8Array to hash
 * @returns IPFS CIDv0 hash (starts with "Qm")
 */
export async function hash(content: string | Uint8Array): Promise<string> {
  const bytes =
    typeof content === "string" ? new TextEncoder().encode(content) : content;

  // Create UnixFS file structure
  const unixfs = new UnixFS({ type: "file", data: bytes });

  // Encode as DAG-PB
  const block = dagPB.encode({
    Data: unixfs.marshal(),
    Links: [],
  });

  // Hash with SHA-256
  const hash = await sha256.digest(block);

  // Create CIDv0
  const cid = CID.createV0(hash);

  return cid.toString();
}
