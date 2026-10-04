# CHALAK Performance v4.1

This release is based on the accepted v4.0 production source. The isolated v4.1 workspace retains the accepted v4.0 ZIP and source-and-tests archive as immutable baselines. The v4.1 acceptance coverage includes adapted and newly reconstructed cases; it is not claimed to be byte-for-byte identical to an earlier historical test suite.

## Install and build

```powershell
npm ci
npm run typecheck
npm test
npm run build
npm run cf:functions
```

The build output is `dist/`. Deploy it to Cloudflare Pages with the included `wrangler.jsonc` after configuring the `CHALAK_DB` KV namespace binding. Set the Admin password as a Cloudflare secret; local credentials belong in an ignored local `.dev.vars` file and are excluded from the release archives.

## Local Pages/KV development

Build first, then start Pages against a new local persistence directory:

```powershell
npm run build
npx wrangler pages dev dist --persist-to .wrangler/local-v41
```

Connected browser tests use `playwright.cloudflare.config.ts`. Configure a local `ADMIN_PASSWORD`, set `CHALAK_LOCAL_ADMIN_PASSWORD` to the same local-only value for the test process, and set `CHALAK_CF_BASE_URL` to the Pages URL. Use a new local KV directory for each independent connected spec. Do not use production sessions or production data in local fixture tests.

## Acceptance package

The focused requirements and evidence index are in `docs/V4.1_SAVE_PERMISSION_IMPORT_NAV_TOUR_MOBILE.md`. The source-and-tests archive includes the unit, mock-browser and connected Pages/KV suites. The production archive excludes tests, local KV/Wrangler data, secrets and QA evidence.

No remote deployment is performed by the local verification workflow.
