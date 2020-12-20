# dotenv-multi

Dotenv-multi is a module that uses [dotenv](https://www.npmjs.com/package/dotenv) and [dotenv-expand](https://www.npmjs.com/package/dotenv-expand) to load files similarly to [Create React App script's](https://create-react-app.dev/docs/adding-custom-environment-variables/#what-other-env-files-can-be-used). It allows the use of NODE_ENV and local specific env files.

This is useful because now you can commit your default env files into the repo and still have a sane way to override them locally without having changes in your local git on one .env file.

Example root files:
```
.env
.env.development
.env.development.local (not pushed to git)
```

# Install

```
# with npm
npm install @ringofstorms/dotenv-multi
```

# Usage

```js
# js
const dotenvMulti = require('@ringofstorms/dotenv-multi');
dotenvMulti.config();
```

```typescript
# typescript
import { config } from '@ringofstorms/multi-env';
config();
```

## Boolean support

This package also uses the [yn](https://www.npmjs.com/package/yn) package to convert environment variables into javascript strings that will resolve as true false. (It replaces values like `0`, `no`, `false`, etc into an empty string `""`)

```typescript
config({
  convertToBooleanPredicate: variable => variable.includes("BOOL"),
  /* and or */ convertToBoolean: ["BOOL_VARIABLE_TO_CONVERT"]
});
```

## Debug

You can enable debug logs which will also enable debug mode on `dotenv` calls to see what is going on when a variable does not resolve how you expect.

```typescript
config({
  debug: true,
});
```

# Configuring .gitignore

You should add the following to your `.gitignore` file:
```
# .env local files
.env.development.local
.env.local
.env.production.local
.env.test.local
```

# Contributing

### building

`npm run build`

### publishing

if not already done `npm login`

`npm publish --access public`
