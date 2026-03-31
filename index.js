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

  return true;
}

module.exports = {
  default: main,
};
