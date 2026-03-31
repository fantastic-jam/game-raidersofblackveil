#!/usr/bin/env bash
set -e

VERSION=$(node -e "process.stdout.write(require('./info.json').version)")
OUT="../game-raidersofblackveil-${VERSION}.zip"

rm -f "$OUT"
zip "$OUT" index.js info.json game.png

echo "Packaged: $OUT"
