import * as yn from 'yn';

import { BooleanConverter, ConfigOptions } from "./types"

export const booleanConverter: BooleanConverter = (options: ConfigOptions, log: (...args: any[]) => void) => {
  const convertPredicate = (key: string): boolean => {
    if (key) {
      if (Array.isArray(options.convertToBoolean)) {
        if (options.convertToBoolean.includes(key)) {
          return true;
        }
      } else if (options.convertToBoolean === key) {
        return true;
      }
      if (typeof options.convertToBooleanPredicate === 'function' && options.convertToBooleanPredicate(key)) {
        return true;
      }
    }
    return false;
  }
  Object.entries(process.env).forEach(([key, value]) => {
    if (convertPredicate(key)) {
      const boolValue = yn(value) ? 'true' : '';
      process.env[key] = boolValue;
      log('Environment variable converted into string boolean value:', key, "original:", value, 'newValue:', boolValue);
    }
  });
}
