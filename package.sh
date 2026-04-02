#!/usr/bin/env bash
set -e

VERSION=$(node -e "process.stdout.write(require('./info.json').version)")
OUT="dist/game-raidersofblackveil-${VERSION}.zip"

rm -rf dist
mkdir -p dist
zip "$OUT" index.js info.json gameart.png

echo "Packaged: $OUT"
