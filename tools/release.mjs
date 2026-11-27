// Releases the extension: `npm run release [-- --dry-run]`.
//
// 1. `frelease` promotes CHANGELOG.md's [Unreleased] section to the next version
//    (bump level from the fchange entry types).
// 2. The version is written to info.json (what Vortex and Nexus read) and package.json.
// 3. Tests run, then a release commit + vX.Y.Z tag are pushed.
// The tag triggers the Package workflow (zip + GitHub release), then nexus-publish.yml (Nexus upload).
//
// Record changes first, committed with the code they describe: fchange <type> "message"
import { execFileSync } from "node:child_process";
import fs from "node:fs";

const dryRun = process.argv.includes("--dry-run");

function run(cmd, args, opts = {}) {
  return execFileSync(cmd, args, { encoding: "utf8", shell: process.platform === "win32", ...opts });
}

function setVersion(file, version) {
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  json.version = version;
  fs.writeFileSync(file, `${JSON.stringify(json, null, 2)}\n`);
}

if (run("git", ["status", "--porcelain"]).trim() !== "") {
  console.error("Working tree is dirty — commit or stash first (fchange entries go with their change).");
  process.exit(1);
}
const branch = run("git", ["rev-parse", "--abbrev-ref", "HEAD"]).trim();
if (branch !== "main") {
  console.error(`Releases are cut from main (current branch: ${branch}).`);
  process.exit(1);
}

const version = run("frelease", dryRun ? ["--dry-run"] : []).trim().split(/\r?\n/).pop().trim();
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error(`frelease did not return a version: "${version}"`);
  process.exit(1);
}
const tag = `v${version}`;

if (dryRun) {
  console.log(`Would release ${tag}:`);
  console.log(run("frelease", ["changelog"]).trim() || "(see [Unreleased] in CHANGELOG.md)");
  process.exit(0);
}

setVersion("info.json", version);
setVersion("package.json", version);
run("node", ["--test", "test/"], { stdio: "inherit" });

run("git", ["add", "CHANGELOG.md", "info.json", "package.json"]);
run("git", ["commit", "-q", "-m", `chore: release ${tag}`]);
run("git", ["tag", tag]);
run("git", ["push", "origin", "main", tag], { stdio: "inherit" });
console.log(`Released ${tag}: GitHub Actions now packages it and publishes it to Nexus.`);
