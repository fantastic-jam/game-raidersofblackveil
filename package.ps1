$version = (Get-Content info.json | ConvertFrom-Json).version
$out = "..\game-raidersofblackveil-$version.zip"

Remove-Item $out -ErrorAction SilentlyContinue
Compress-Archive -Path index.js, info.json, game.png -DestinationPath $out

Write-Host "Packaged: $out"
