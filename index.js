const { log, util } = require("vortex-api");
const { bepInExModInstaller } = require("./installer");

const GAME_ID = "raidersofblackveil";
const STEAM_ID = "3352240";
const GAME_NAME = "Raiders of Blackveil";
const EXEC = "RoB.exe";

// The game is IL2CPP since 0.6.5 (Unity 6000.5). Stock BepInEx 6 doesn't run on it yet, so we install
// the patched pack published on Nexus: https://www.nexusmods.com/raidersofblackveil/mods/19
// (source: https://github.com/fantastic-jam/raiders-of-blackveil-mods/tree/main/tools/bepinex).
const NEXUS_DOMAIN = "raidersofblackveil";
const BEPINEX_PACK_MOD_ID = 19;
const NEXUS_MAIN_CATEGORY = 1;

function findGame() {
  return util.GameStoreHelper.findByAppId([STEAM_ID]).then(
    (game) => game.gamePath,
  );
}

/**
 * Picks the newest MAIN file of the BepInEx pack mod, so publishing a new pack on Nexus reaches users
 * without a new extension release: modtype-bepinex calls this on install and on every game activation,
 * and re-downloads when the returned fileId differs from the installed one.
 * Returns undefined when the list can't be fetched (offline, not logged in, file still in review) —
 * modtype-bepinex then does nothing, rather than replacing a newer pack with a pinned older one.
 */
function bepInExPackDownloader(api) {
  return async () => {
    let files = [];
    try {
      files =
        (await api.ext.nexusGetModFiles?.(NEXUS_DOMAIN, BEPINEX_PACK_MOD_ID)) ??
        [];
    } catch (err) {
      log("warn", "failed to list BepInEx pack files", { error: err?.message });
      return undefined;
    }
    const latest = files
      .filter((f) => f.category_id === NEXUS_MAIN_CATEGORY)
      .sort((a, b) => b.uploaded_timestamp - a.uploaded_timestamp)[0];
    if (latest === undefined) {
      log("warn", "no BepInEx pack file found on Nexus", {
        modId: BEPINEX_PACK_MOD_ID,
      });
      return undefined;
    }
    return {
      gameId: GAME_ID,
      domainId: NEXUS_DOMAIN,
      modId: BEPINEX_PACK_MOD_ID,
      fileId: latest.file_id,
      archiveName: latest.file_name,
      version: latest.version,
      architecture: "x64",
      allowAutoInstall: true,
    };
  };
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
        // modtype-bepinex requires >= 6.0.0 for IL2CPP; the actual pack comes from customPackDownloader.
        bepinexVersion: "6.0.0",
        unityBuild: "unityil2cpp",
        architecture: "x64",
        customPackDownloader: bepInExPackDownloader(context.api),
      });
    }
  });

  return true;
}

module.exports = {
  default: main,
};
