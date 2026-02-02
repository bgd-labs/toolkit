import type { Sidebar } from "vocs";

export const sidebar = {
  "/docs/": [
    { text: "Getting started", link: "/docs/getting-started" },
    {
      text: "@bgd-labs/toolbox",
      link: "/docs/toolbox",
      items: [
        {
          text: "Aave",
          items: [
            { text: "User configuration", link: "/docs/toolbox/aave/user" },
            {
              text: "Reserve configuration",
              link: "/docs/toolbox/aave/reserve",
            },
            {
              text: "Complete configurations",
              link: "/docs/toolbox/aave/configurations",
            },
            { text: "Ray math", link: "/docs/toolbox/aave/ray-math" },
            { text: "Pool math", link: "/docs/toolbox/aave/pool-math" },
          ],
        },
        {
          text: "Ecosystem",
          link: "/docs/toolbox/ecosystem",
          items: [
            { text: "Explorers", link: "/docs/toolbox/ecosystem/explorers" },
            { text: "Rpcs", link: "/docs/toolbox/ecosystem/rpcs" },
            { text: "Tenderly", link: "/docs/toolbox/ecosystem/tenderly" },
            { text: "RPC Helpers", link: "/docs/toolbox/ecosystem/helpers" },
          ],
        },
        {
          text: "Math",
          items: [
            { text: "Binary", link: "/docs/toolbox/math/binary" },
            { text: "Storage", link: "/docs/toolbox/math/storage" },
          ],
        },
        {
          text: "Operations",
          items: [
            {
              text: "Code Diffing",
              link: "/docs/toolbox/operations/diff-code",
            },
          ],
        },
        {
          text: "Seatbelt",
          items: [{ text: "Overview", link: "/docs/toolbox/seatbelt" }],
        },
      ],
    },
    {
      text: "@bgd-labs/cli",
      items: [
        { text: "Code diffing", link: "/docs/cli/code-diff" },
        { text: "Aave vnet", link: "/docs/cli/aave-vnet" },
      ],
    },
    {
      text: "Github actions",
      items: [{ text: "Rpcs", link: "/docs/actions/rpcs" }],
    },
  ],
} as const satisfies Sidebar;
