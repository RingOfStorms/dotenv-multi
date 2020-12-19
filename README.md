# dotenv-multi

Dotenv-multi is a module that uses `dotenv` and `dotenv-expand` to load files similarly to Create React App script's. It allows the use of NODE_ENV and local specific env files.

This is useful because now you can commit your default env files into the repo and still have a sane way to override them locally without having changes in your local git on one .env file.

# Install

```
# with npm
npm install @ringofstorms/dotenv-multi dotenv dotenv-expand
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

# Configuring .gitignore

You should add the following to your `.gitignore` file:
```
# .env local files
.env.development.local
.env.local
.env.production.local
.env.test.local
```

## [What other `.env` files can be used?](https://create-react-app.dev/docs/adding-custom-environment-variables/#what-other-env-files-can-be-used)
