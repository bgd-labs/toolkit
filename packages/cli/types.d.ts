declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TENDERLY_ACCESS_TOKEN?: string;
      TENDERLY_ACCOUNT_SLUG?: string;
      TENDERLY_PROJECT_SLUG?: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
