## Scripts

- `npm run dev` starts the dev server.
- `npm run build` builds the Worker.
- `npm run preview` previews the built Worker locally.
- `npm run generate-types` regenerates `worker-configuration.d.ts` after changing `wrangler.jsonc`.
- `npm run check` typechecks, lints, and checks formatting.

## Deploying

Push to the `main` branch. Cloudflare will automatically pick it up and deploy it to Cloudflare Workers.
