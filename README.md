## Overview

This is a site that lists open jams around NYC.

## Development commands

- `npm run dev` starts the dev server.
- `npm run check` typechecks, lints, etc.
- `npm run fix-format` auto-formats.
- `npm run generate-types` updates TypeScript bindings to match the Cloudflare configuration. Run it whenever `wrangler.jsonc` is modified.

## Deploying

Push to the `main` branch. Cloudflare will automatically pick it up and deploy it to Cloudflare Workers.
