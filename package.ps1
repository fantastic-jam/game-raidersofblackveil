$version = (Get-Content info.json | ConvertFrom-Json).version
$out = "dist\game-raidersofblackveil-$version.zip"

Remove-Item dist -Recurse -Force -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path dist | Out-Null
Compress-Archive -Path index.js, installer.js, info.json, gameart.png -DestinationPath $out

Write-Host "Packaged: $out"
