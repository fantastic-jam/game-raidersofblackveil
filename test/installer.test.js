const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { bepInExModInstaller } = require("../installer");

const { testSupported, install } = bepInExModInstaller;

// ---------------------------------------------------------------------------
// testSupported
// ---------------------------------------------------------------------------

describe("testSupported", () => {
  it("rejects a different game", async () => {
    const result = await testSupported(["plugins/MyMod.dll"], "othergame");
    assert.equal(result.supported, false);
  });

  it("rejects a BepInEx distribution (winhttp.dll marker)", async () => {
    const files = [
      "BepInEx/core/BepInEx.dll",
      "BepInEx/core/BepInEx.Harmony.dll",
      "winhttp.dll",
      "doorstop_config.ini",
    ];
    const result = await testSupported(files, "raidersofblackveil");
    assert.equal(result.supported, false);
  });

  it("rejects a BepInEx distribution (doorstop_config.ini only)", async () => {
    const files = ["BepInEx/core/BepInEx.dll", "doorstop_config.ini"];
    const result = await testSupported(files, "raidersofblackveil");
    assert.equal(result.supported, false);
  });

  it("rejects bare .dll files (no folder structure)", async () => {
    const result = await testSupported(["MyMod.dll"], "raidersofblackveil");
    assert.equal(result.supported, false);
  });

  it("accepts archive rooted at BepInEx/", async () => {
    const files = ["BepInEx/plugins/MyMod.dll"];
    const result = await testSupported(files, "raidersofblackveil");
    assert.equal(result.supported, true);
  });

  it("accepts archive rooted at plugins/", async () => {
    const files = ["plugins/MyMod.dll"];
    const result = await testSupported(files, "raidersofblackveil");
    assert.equal(result.supported, true);
  });

  it("accepts archive rooted at patchers/", async () => {
    const files = ["patchers/MyPatcher.dll"];
    const result = await testSupported(files, "raidersofblackveil");
    assert.equal(result.supported, true);
  });
});

// ---------------------------------------------------------------------------
// install — mod type detection
// ---------------------------------------------------------------------------

describe("install — mod type", () => {
  it("sets bepinex-root for BepInEx/ rooted archive", async () => {
    const files = ["BepInEx/plugins/MyMod.dll", "BepInEx/plugins/"];
    const result = await install(files);
    const setType = result.instructions.find((i) => i.type === "setmodtype");
    assert.equal(setType.value, "bepinex-root");
  });

  it("sets bepinex-root for plugins/ rooted archive", async () => {
    const files = ["plugins/MyMod.dll"];
    const result = await install(files);
    const setType = result.instructions.find((i) => i.type === "setmodtype");
    assert.equal(setType.value, "bepinex-root");
  });

  it("sets bepinex-root for patchers/ rooted archive", async () => {
    const files = ["patchers/MyPatcher.dll"];
    const result = await install(files);
    const setType = result.instructions.find((i) => i.type === "setmodtype");
    assert.equal(setType.value, "bepinex-root");
  });

  it("sets bepinex-plugin for a bare .dll (fallback)", async () => {
    const files = ["MyMod.dll"];
    const result = await install(files);
    const setType = result.instructions.find((i) => i.type === "setmodtype");
    assert.equal(setType.value, "bepinex-plugin");
  });
});

// ---------------------------------------------------------------------------
// install — destination path mapping
// ---------------------------------------------------------------------------

describe("install — destination paths", () => {
  it("strips BepInEx/ prefix for BepInEx/ rooted archive", async () => {
    const files = ["BepInEx/plugins/MyMod.dll"];
    const result = await install(files);
    const copy = result.instructions.find((i) => i.type === "copy");
    assert.equal(copy.destination, path.join("plugins", "MyMod.dll"));
  });

  it("preserves path for plugins/ rooted archive", async () => {
    const files = ["plugins/MyMod.dll"];
    const result = await install(files);
    const copy = result.instructions.find((i) => i.type === "copy");
    assert.equal(copy.destination, path.join("plugins", "MyMod.dll"));
  });

  it("preserves path for patchers/ rooted archive", async () => {
    const files = ["patchers/MyPatcher.dll"];
    const result = await install(files);
    const copy = result.instructions.find((i) => i.type === "copy");
    assert.equal(copy.destination, path.join("patchers", "MyPatcher.dll"));
  });

  it("skips directory entries", async () => {
    const files = ["BepInEx/plugins/", "BepInEx/plugins/MyMod.dll"];
    const result = await install(files);
    const copies = result.instructions.filter((i) => i.type === "copy");
    assert.equal(copies.length, 1);
    assert.equal(copies[0].destination, path.join("plugins", "MyMod.dll"));
  });
});
