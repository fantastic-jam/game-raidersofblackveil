const path = require("path");
const { util } = require("vortex-api");

const GAME_ID = "raidersofblackveil";
const STEAM_ID = "3352240";
const GAME_NAME = "Raiders of Blackveil";
const EXEC = "RoB.exe";

function findGame() {
  return util.GameStoreHelper.findByAppId([STEAM_ID]).then(
    (game) => game.gamePath
  );
}

// Matches any zip that contains at least one DLL (BepInEx plugin).
function testSupported(files, gameId) {
  return Promise.resolve({
    supported:
      gameId === GAME_ID &&
      files.some((f) => path.extname(f).toLowerCase() === ".dll"),
    requiredFiles: [],
  });
}

// Normalises mod zip layouts so files always land in BepInEx/plugins/.
//
// Handled cases:
//   BepInEx/plugins/Foo.dll          → pass through (already correct)
//   plugins/Foo.dll                  → BepInEx/plugins/Foo.dll
//   Foo.dll                (root)    → BepInEx/plugins/Foo.dll
//   Foo/Foo.dll            (folder)  → BepInEx/plugins/Foo/Foo.dll
function install(files) {
  const entries = files.filter(
    (f) => !f.endsWith(path.sep) && !f.endsWith("/")
  );

  // Case 1 – already has BepInEx/plugins prefix: pass through unchanged.
  if (
    entries.some((f) =>
      f.replace(/\\/g, "/").toLowerCase().startsWith("bepinex/plugins/")
    )
  ) {
    return Promise.resolve({
      instructions: entries.map((f) => ({ type: "copy", source: f, destination: f })),
    });
  }

  const instructions = entries.map((f) => {
    const norm = f.replace(/\\/g, "/");

    let destination;
    if (norm.toLowerCase().startsWith("plugins/")) {
      // Case 2 – has plugins/ but not BepInEx/ prefix.
      destination = path.join("BepInEx", norm);
    } else {
      // Case 3 & 4 – bare root or subfolder: keep relative path, prepend BepInEx/plugins/.
      destination = path.join("BepInEx", "plugins", norm);
    }

    return { type: "copy", source: f, destination };
  });

  return Promise.resolve({ instructions });
}

function main(context) {
  context.requireExtension("modtype-bepinex");

  context.registerGame({
    id: GAME_ID,
    name: GAME_NAME,
    mergeMods: true,
    queryPath: findGame,
    queryModPath: () => ".",
    logo: "game.png",
    executable: () => EXEC,
    requiredFiles: [EXEC],
    environment: {
      SteamAPPId: STEAM_ID,
    },
    details: {
      steamAppId: Number(STEAM_ID),
    },
  });

  // Priority 25 — runs before Vortex's default installer (priority 50).
  context.registerInstaller(
    "raidersofblackveil-bepinex",
    25,
    testSupported,
    install
  );

  return true;
}

module.exports = {
  default: main,
};
