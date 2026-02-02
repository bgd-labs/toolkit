export type StandardJsonInput = {
  language: string;
  libraries: any;
  settings: {
    evmVersion: string;
    optimizer: { enabled: boolean; runs: number };
  };
  sources: Record<string, { content: string }>;
};
