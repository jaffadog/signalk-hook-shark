// Minimal, inert SignalK plugin. Its only job is to exist as a valid
// plugin so this fixture can, if needed, actually be installed and loaded
// by a real signalk-server instance — not just processed by npm in
// isolation. It emits no deltas and registers no routes.
module.exports = function (app) {
  const plugin = {
    id: "signalk-hook-shark",
    name: "Hook Shark (install-security test fixture)",
    start: function (settings) {
      app.debug("signalk-hook-shark started — this is a test fixture, not a real plugin");
    },
    stop: function () {
      app.debug("signalk-hook-shark stopped");
    },
    schema: {
      type: "object",
      properties: {},
    },
  };

  return plugin;
};
