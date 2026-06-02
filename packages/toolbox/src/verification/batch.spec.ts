import { describe, expect, it } from "vitest";
import { expandMigrateConfig, expandValidateConfig } from "./batch";

const A = "0xAAaA00000000000000000000000000000000aAaA" as const;
const B = "0xBBbB00000000000000000000000000000000bBbB" as const;

describe("verification:expandMigrateConfig", () => {
  const base = {
    from: { chainId: 1, explorer: "etherscan" as const },
    to: { chainId: 10, explorer: "blockscout" as const },
  };

  it("uses a string entry as the same address on both sides", () => {
    const [job] = expandMigrateConfig({ ...base, contracts: [A] });
    expect(job.from).toEqual({ chainId: 1, explorer: "etherscan", address: A });
    expect(job.to).toEqual({ chainId: 10, explorer: "blockscout", address: A });
  });

  it("honors per-entry from/to overrides and mirrors a lone side", () => {
    const jobs = expandMigrateConfig({
      ...base,
      contracts: [{ from: A, to: B }, { from: A }, { to: B }],
    });
    expect([jobs[0].from.address, jobs[0].to.address]).toEqual([A, B]);
    // a lone `from` mirrors to `to`, and vice-versa
    expect([jobs[1].from.address, jobs[1].to.address]).toEqual([A, A]);
    expect([jobs[2].from.address, jobs[2].to.address]).toEqual([B, B]);
  });

  it("threads shared options + keys onto every job", () => {
    const [job] = expandMigrateConfig({
      from: { chainId: 1, explorer: "etherscan", apiKey: "K" },
      to: { chainId: 1, explorer: "blockscout", apiUrl: "https://x/api" },
      wait: false,
      pollTimeoutMs: 5000,
      contracts: [A],
    });
    expect(job.from.apiKey).toBe("K");
    expect(job.to.apiUrl).toBe("https://x/api");
    expect(job.wait).toBe(false);
    expect(job.pollTimeoutMs).toBe(5000);
  });

  it("throws on missing endpoints, empty contracts, or an address-less entry", () => {
    expect(() => expandMigrateConfig({ contracts: [A] } as any)).toThrow(/from.*to/i);
    expect(() => expandMigrateConfig({ ...base, contracts: [] })).toThrow(/non-empty/);
    expect(() =>
      expandMigrateConfig({ ...base, contracts: [{}] as any }),
    ).toThrow(/contracts\[0\]/);
  });
});

describe("verification:expandValidateConfig", () => {
  it("applies defaults to bare-address entries", () => {
    const [job] = expandValidateConfig({
      defaults: { chainId: 1, explorer: "etherscan" },
      contracts: [A],
    });
    expect(job).toMatchObject({ chainId: 1, address: A, explorer: "etherscan" });
  });

  it("lets each entry override the defaults", () => {
    const jobs = expandValidateConfig({
      defaults: { chainId: 1, explorer: "etherscan" },
      contracts: [A, { address: B, chainId: 10, explorer: "blockscout" }],
    });
    expect(jobs[0]).toMatchObject({ chainId: 1, address: A, explorer: "etherscan" });
    expect(jobs[1]).toMatchObject({ chainId: 10, address: B, explorer: "blockscout" });
  });

  it("throws when an entry has no resolvable chainId", () => {
    expect(() =>
      expandValidateConfig({ contracts: [{ address: A }] }),
    ).toThrow(/chainId/);
    expect(() => expandValidateConfig({ contracts: [] })).toThrow(/non-empty/);
  });
});
