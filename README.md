# Raiders of Blackveil — Vortex Extension

Adds support for **Raiders of Blackveil** (Steam App ID: `3352240`) to the [Vortex mod manager](https://www.nexusmods.com/about/vortex/). Handles game detection and deploys BepInEx mods to the correct folder.

## Requirements

- [Raiders of Blackveil](https://store.steampowered.com/app/3352240) installed via Steam
- [Vortex](https://www.nexusmods.com/about/vortex/) mod manager
- [BepInEx 6 bleeding edge (Unity Mono x64)](https://builds.bepinex.dev/projects/bepinex_be) — install this manually before deploying mods

## Getting Started

1. Install this extension via Vortex's **Extensions** tab (search "Raiders of Blackveil") or download from Nexus Mods and drag the zip into Vortex.
2. Install **BepInEx 6 bleeding edge (Unity Mono x64)** into your game folder manually — see the [BepInEx installation guide](https://docs.bepinex.dev/articles/user_guide/installation/index.html).
3. In Vortex, switch to the **Games** tab and manage Raiders of Blackveil. Vortex will auto-detect it via Steam.
4. Install mods from Nexus Mods as normal. Vortex deploys them to `BepInEx/plugins/`.

## What This Extension Does

- Auto-detects the game via Steam
- Deploys mods to `<game root>/BepInEx/plugins/`
- Uses Vortex's built-in `modtype-bepinex` mod type — no custom installer needed

## BepInEx Note

Raiders of Blackveil is a **Unity Mono** build. It requires **BepInEx 6 bleeding edge** (not the stable BepInEx 5 release). Because BepInEx 6 is pre-release and not hosted on Nexus Mods, this extension does **not** auto-install it. Install it manually once, then use Vortex for all your mods.

BepInEx download: https://builds.bepinex.dev/projects/bepinex_be
Pick: `BepInEx_UnityMono_x64_<version>.zip`

## Troubleshooting

**Game not detected automatically**
Vortex uses Steam to locate the game. Make sure Steam is running and the game is installed. If it still shows as undiscovered, click the game tile and set the path manually.

**Mods not loading in-game**
Confirm BepInEx is installed correctly — launch the game once bare and check that a `BepInEx/plugins/` folder exists. Then redeploy mods from Vortex.

**Extension not appearing in Vortex**
Make sure you have the BepInEx extension installed in Vortex (Extensions tab → search "BepInEx"). This extension depends on it.

## Contributing

Issues and PRs welcome. The extension is intentionally minimal — game detection + mod deployment, nothing more.
