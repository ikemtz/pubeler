export interface CommandLineArguments {
  configFile: string;
  dataFile: string;
  oauthDebug?: unknown;
  help: () => void;
}
