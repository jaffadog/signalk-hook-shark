# signalk-hook-shark

Test fixture plugin for `signalk-server`. Verifies that plugin installation
actually blocks lifecycle scripts — both the plugin's own and a dependency's.

**Not a real plugin. Do not publish to npm.**

## Why

`signalk-server`'s AppStore installs plugins with `npm install
--ignore-scripts` specifically to stop malicious `preinstall` / `install` /
`postinstall` scripts from running (see `SignalK/signalk-server` issue
#2181, and advisory GHSA-93jc-vqqc-vvvh for what happens when that
protection is bypassed via the version-specifier). This fixture exists to
confirm that protection actually holds — for the plugin itself and for
everything the plugin depends on.

## Structure

- `package.json` — shaped like a real plugin (`signalk-node-server-plugin`
  keyword, `main` entry point) but declares `preinstall`, `install`,
  `postinstall`, and `prepare` scripts, plus a dependency on `evil-dep`.
- `index.js` — a minimal, inert plugin implementation, so this fixture can
  also be genuinely loaded by a real signalk-server if needed, not just
  processed by npm in isolation.
- `evil-dep/` — a local dependency (`file:./evil-dep`) standing in for a
  compromised transitive package. Its only script is a `postinstall`.
- `scripts/fire.js` — the canary. Every lifecycle script calls this instead
  of doing anything real.

## How detection works

Each canary fire does two things:

1. If `HOOK_SHARK_CANARY` is set in the environment, appends a line to that
   file (for a harness that wants a single log to diff, e.g. `hook-shark`
   itself).
2. Always writes a marker file under `.hook-shark-canary/<hook>.fired` in
   the plugin root — so a CI script that just installs this plugin and then
   inspects its directory afterward, without wiring up any env var, can
   still detect whether scripts ran.

Expected markers after a run where scripts are **not** blocked:

```
.hook-shark-canary/preinstall.fired
.hook-shark-canary/install.fired
.hook-shark-canary/postinstall.fired
.hook-shark-canary/prepare.fired
.hook-shark-canary/evil-dep-postinstall.fired
```

If installation is properly guarded (`--ignore-scripts`, or equivalent
`.npmrc`/env config), `.hook-shark-canary/` should not exist at all, or
should be empty.

## Manual verification

```bash
# Should produce all 5 marker files
npm install

# Should produce none
rm -rf node_modules .hook-shark-canary
npm install --ignore-scripts
```

## Feeding this through plugin-ci.yml

Not yet wired in — need to see the current workflow to match its expected
install location, marker/detection convention, and pass/fail signal.
