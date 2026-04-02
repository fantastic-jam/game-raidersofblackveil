# Raiders of Blackveil — Vortex Extension

Adds support for **Raiders of Blackveil** (Steam App ID: `3352240`) to the [Vortex mod manager](https://www.nexusmods.com/about/vortex/). Handles game detection, auto-installs BepInEx, and deploys mods to the correct folder.

## Requirements

- [Raiders of Blackveil](https://store.steampowered.com/app/3352240) installed via Steam
- [Vortex](https://www.nexusmods.com/about/vortex/) mod manager

## Getting Started

1. Install this extension via Vortex's **Extensions** tab (search "Raiders of Blackveil") or download from Nexus Mods and drag the zip into Vortex.
2. In Vortex, switch to the **Games** tab and manage Raiders of Blackveil. Vortex will auto-detect it via Steam.
3. Install mods from Nexus Mods as normal. Vortex will auto-install BepInEx if needed and deploy mods to `BepInEx/plugins/`.

## What This Extension Does

- Auto-detects the game via Steam
- Auto-installs BepInEx 5 (Unity Mono x64) from GitHub if not already present
- Deploys mods to `<game root>/BepInEx/plugins/`
- Uses Vortex's built-in `modtype-bepinex` mod type — no custom installer needed

## Troubleshooting

**Game not detected automatically**
Vortex uses Steam to locate the game. Make sure Steam is running and the game is installed. If it still shows as undiscovered, click the game tile and set the path manually.

**Mods not loading in-game**
Confirm BepInEx is installed correctly — launch the game once bare and check that a `BepInEx/plugins/` folder exists. Then redeploy mods from Vortex.

**Extension not appearing in Vortex**
Make sure you have the BepInEx extension installed in Vortex (Extensions tab → search "BepInEx"). This extension depends on it.

## Contributing

Issues and PRs welcome. The extension is intentionally minimal — game detection + mod deployment, nothing more.
