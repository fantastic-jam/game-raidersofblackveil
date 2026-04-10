# Changelog

## [0.4.0]

### Fixed
- BepInEx auto-install no longer re-triggers on every mod install — the installer now recognises BepInEx distribution packages (identified by `winhttp.dll` / `doorstop_config.ini`) and skips them, letting `modtype-bepinex` handle them directly

## [0.3.0]

### Changed
- Moved mod installer to a dedicated `installer.js` module
- Installer now detects the zip structure and assigns the correct BepInEx mod type automatically:
  - Zip rooted at `BepInEx/` → `bepinex-root` (strips the `BepInEx/` prefix)
  - Zip with top-level `plugins/` or `patchers/` folders → `bepinex-root` (path kept as-is)
  - Bare `.dll` files → `bepinex-plugin`
- Installer priority raised to 9 to run before `modtype-bepinex` built-in installers

## [0.2.0]

### Added
- BepInEx mod installer to normalise common zip layouts
- Packaging scripts (`package.sh`, `package.ps1`, `package.bat`) and GitHub Actions release workflow
- GPL-3.0 license

### Changed
- BepInEx upgraded to 5.4.23.5 with automatic GitHub download
- Game art updated to match Nexus Mods tile
- Packages now output to `dist/`

## [0.1.0]

### Added
- Initial Vortex game extension for Raiders of Blackveil (Steam App ID 3352240)
- Auto-detects game via Steam, auto-installs BepInEx, deploys mods to `BepInEx/plugins/`
