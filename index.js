const { util } = require("vortex-api");
const { bepInExModInstaller } = require("./installer");

const GAME_ID = "raidersofblackveil";
const STEAM_ID = "3352240";
const GAME_NAME = "Raiders of Blackveil";
const EXEC = "RoB.exe";

function findGame() {
  return util.GameStoreHelper.findByAppId([STEAM_ID]).then(
    (game) => game.gamePath,
  );
}

function main(context) {
  context.requireExtension("modtype-bepinex");

  context.registerGame({
    id: GAME_ID,
    name: GAME_NAME,
    mergeMods: true,
    queryPath: findGame,
    queryModPath: () => ".",
    logo: "gameart.png",
    executable: () => EXEC,
    requiredFiles: [EXEC],
    environment: {
      SteamAPPId: STEAM_ID,
    },
    details: {
      steamAppId: Number(STEAM_ID),
    },
  });

  context.registerInstaller(
    GAME_ID,
    9,
    bepInExModInstaller.testSupported,
    bepInExModInstaller.install,
  );

  context.once(() => {
    if (context.api.ext.bepinexAddGame !== undefined) {
      context.api.ext.bepinexAddGame({
        gameId: GAME_ID,
        autoDownloadBepInEx: true,
        forceGithubDownload: true,
        bepinexVersion: "5.4.23.5",
        unityBuild: "unitymono",
        architecture: "x64",
      });
    }
  });

  return true;
}

module.exports = {
  default: main,
};
