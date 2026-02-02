import { describe, expect, it } from "vitest";
import { onMevHandler, priceUpdateDecoder } from "./flashbots";
import { mockPub, mockSVR } from "./mocks/flashbots";

describe("ecosystem:flashbots", { timeout: 3_000 }, () => {
  // it.skipIf(process.env.CI)("should start listening to events", async () => {
  //   function exampleDecoder(event: any) {
  //     if (event.txs) return event.txs.map(exampleDecoder);
  //     console.log(event);
  //   }
  //   const stream = onMevHandler((message) => exampleDecoder(message));
  //   await new Promise((resolve) => setTimeout(resolve, 2_000));
  //   stream.close();
  // });

  it.skip("should decode svr event", () => {
    expect(priceUpdateDecoder(mockSVR.to, mockSVR.callData))
      .toMatchInlineSnapshot(`
      {
        "answer": 564968824n,
        "receiver": "0xa7Daf8A03B064262FfF0D615663553DAe3E18744",
      }
    `);
  });

  it.skip("should decode default event", () => {
    expect(priceUpdateDecoder(mockPub.to, mockPub.input))
      .toMatchInlineSnapshot(`
      {
        receiver: "0x6593c7de001fc8542bb1703532ee1e5aa0d458fd",
        }
      `);
  });
});
