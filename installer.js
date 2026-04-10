const path = require("path");

const GAME_ID = "raidersofblackveil";

// Files that uniquely identify a BepInEx distribution package.
// If these are present we must not intercept — let modtype-bepinex handle it.
const BEPINEX_DISTRIBUTION_MARKERS = ["winhttp.dll", "doorstop_config.ini"];

function testSupported(files, gameId) {
  if (gameId !== GAME_ID) {
    return Promise.resolve({ supported: false, requiredFiles: [] });
  }

  const norm = files.map((f) => path.basename(f).toLowerCase());
  const isBepInExDistro = BEPINEX_DISTRIBUTION_MARKERS.some((marker) =>
    norm.includes(marker)
  );

  if (isBepInExDistro) {
    return Promise.resolve({ supported: false, requiredFiles: [] });
  }

  const normPaths = files.map((f) => f.replace(/\\/g, "/").toLowerCase());
  const needsMapping = normPaths.some(
    (f) =>
      f.startsWith("bepinex/") ||
      f.startsWith("plugins/") ||
      f.startsWith("patchers/")
  );

  return Promise.resolve({ supported: needsMapping, requiredFiles: [] });
}

function install(files) {
  const filtered = files.filter(
    (f) => !f.endsWith(path.sep) && !f.endsWith("/"),
  );

  const norm = filtered.map((f) => f.replace(/\\/g, "/").toLowerCase());

  const hasBepInEx = norm.some((f) => f.startsWith("bepinex/"));
  const hasSubDir  = norm.some((f) => f.startsWith("plugins/") || f.startsWith("patchers/"));

  const modType = hasBepInEx || hasSubDir ? "bepinex-root" : "bepinex-plugin";

  const instructions = filtered.map((f) => {
    const normalized = f.replace(/\\/g, "/");

    let destination;

    if (normalized.toLowerCase().startsWith("bepinex/")) {
      // strip the BepInEx/ prefix — bepinex-root deploys to BepInEx/
      destination = normalized.slice("bepinex/".length).split("/").join(path.sep);
    } else {
      // plugins/, patchers/, or bare file — keep path as-is
      destination = normalized.split("/").join(path.sep);
    }

    return { type: "copy", source: f, destination };
  });

  instructions.push({ type: "setmodtype", value: modType });

  return Promise.resolve({ instructions });
}

module.exports = {
  bepInExModInstaller: { testSupported, install },
};
