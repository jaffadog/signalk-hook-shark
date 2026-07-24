// Fires on preinstall/install/postinstall/prepare. If this ever runs while
// the installer claims scripts are disabled, that's the vulnerability this
// plugin exists to catch.
//
// Writes two things so it's detectable either way:
//   1. If HOOK_SHARK_CANARY is set (env-driven harness, e.g. hook-shark),
//      appends "plugin:<hook>" to that file.
//   2. Always also writes a local marker file under ./.hook-shark-canary/,
//      so an external CI script that just inspects the installed plugin
//      directory afterward (no env var involved) can detect it too.
const fs = require("fs");
const path = require("path");

const hookName = process.argv[2] || "unknown";

const envCanary = process.env.HOOK_SHARK_CANARY;
if (envCanary) {
  fs.appendFileSync(envCanary, `plugin:${hookName}\n`);
}

const markerDir = path.join(__dirname, "..", ".hook-shark-canary");
fs.mkdirSync(markerDir, { recursive: true });
fs.writeFileSync(
  path.join(markerDir, `${hookName}.fired`),
  `${new Date().toISOString()}\n`
);
