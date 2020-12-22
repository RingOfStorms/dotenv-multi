import * as fs from 'fs';
import * as path from 'path';

import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

import { BooleanConverter, ConfigOptions } from "./types"
import { Lazy } from "./lazy"

const lazyBoolConverter = new Lazy<BooleanConverter>(() => require('./booleanConverter').booleanConverter);

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
    lazyBoolConverter.get()(options, log);
  }
}
