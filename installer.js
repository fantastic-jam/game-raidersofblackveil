const path = require("path");

const GAME_ID = "raidersofblackveil";

function testSupported(files, gameId) {
  return Promise.resolve({
    supported:
      gameId === GAME_ID &&
      files.some((f) => path.extname(f).toLowerCase() === ".dll"),
    requiredFiles: [],
  });
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
