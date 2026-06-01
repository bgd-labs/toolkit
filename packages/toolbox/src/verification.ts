// node.js-only entry point for the bytecode verification engine.
// Kept out of the main/browser bundles because it pulls in solc + lib-sourcify.
export * from "./verification/index";
