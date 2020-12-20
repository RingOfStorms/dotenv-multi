import * as fs from 'fs';
import * as path from 'path';

import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import * as yn from 'yn';

export interface ConfigOptions {
  convertToBooleanPredicate?: (variable: string) => boolean;
  convertToBoolean?: string | string[];
  debug?: boolean;
}

export function config(options: ConfigOptions = {}): void {
  const log = options.debug ? console.log : (() => {});

  // Same logic as create-react-app for resolving env files
  // https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/env.js
  const NODE_ENV = (process.env.NODE_ENV || 'unknown').toLowerCase();
  const appDirectory = fs.realpathSync(process.cwd());
  const dotenvFilePath: string = path.resolve(appDirectory, '.env');

  const dotenvFiles = [
    `${ dotenvFilePath }.${ NODE_ENV }.local`,
    `${ dotenvFilePath }.${ NODE_ENV }`,
    NODE_ENV !== 'test' && `${ dotenvFilePath }.local`,
    dotenvFilePath,
  ].filter(i => i) as string[]; // this cast is safe due to the identity filter

  log('Environment files to check:', dotenvFiles.join());

  const propsConfigured = {};
  dotenvFiles.forEach((dotenvFile) => {
    if (fs.existsSync(dotenvFile)) {
      const {parsed} = dotenvExpand(dotenv.config({path: dotenvFile, debug: options.debug || undefined }));
      Object.assign(propsConfigured, parsed);
    }
  });

  log('Environment variables loaded from dotenvs:', Object.keys(propsConfigured).length);
  log('\t', propsConfigured);

  const runBoolConverter: boolean = !!(options.convertToBooleanPredicate || options.convertToBoolean);
  log('Environment variable boolean converter will run:', runBoolConverter);
  if (runBoolConverter) {
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
}
