// This file helps TypeScript understand Electron's types without conflicts

// Tell TypeScript that we're in an Electron environment
declare const process: NodeJS.Process & {
  // Add any Electron-specific process properties here
  noDeprecation: boolean;
};

// This helps TypeScript understand the Electron API
interface Window {
  require: NodeRequire;
  process: typeof process;
}
