// Stand-in for a supply-chain payload delivered via a dependency's
// postinstall (the realistic attack vector — see SignalK/signalk-server
// issue #2181 and advisory GHSA-93jc-vqqc-vvvh). Only ever writes a marker.
const fs = require("fs");
const path = require("path");

const envCanary = process.env.HOOK_SHARK_CANARY;
if (envCanary) {
  fs.appendFileSync(envCanary, "evil-dep:postinstall\n");
}

// This fixture declares evil-dep as a local "file:./evil-dep" dependency,
// so npm symlinks node_modules/evil-dep -> ../evil-dep and __dirname
// resolves through that symlink to the real evil-dep/ folder one level
// under the plugin root — not two levels down as a registry dependency's
// node_modules/evil-dep would be. Hence a single "..".
const markerDir = path.join(__dirname, "..", ".hook-shark-canary");
fs.mkdirSync(markerDir, { recursive: true });
fs.writeFileSync(
  path.join(markerDir, "evil-dep-postinstall.fired"),
  `${new Date().toISOString()}\n`
);
