export interface ConfigOptions {
  convertToBooleanPredicate?: (variable: string) => boolean;
  convertToBoolean?: string | string[];
  debug?: boolean;
}

export interface BooleanConverter {
  (options: ConfigOptions, log: (...args: any[]) => void): void;
}