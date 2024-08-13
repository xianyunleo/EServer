
$dlDir=$Args[0]
$phpDir=$Args[1]
$extVersion=$Args[2]
$extName=$Args[3]
$extFileName=$Args[4]
$phpExtDir=$Args[5]
$dlFileName=$Args[6]

[Net.ServicePointManager]::SecurityProtocol=[Net.SecurityProtocolType]::Tls12

$dlUrl = "https://downloads.php.net/~windows/pecl/releases/$extName/$extVersion/$dlFileName"
$dlFilePath=Join-Path $dlDir $dlFileName

echo $dlUrl

'Downloading...'

Invoke-WebRequest -Uri $dlUrl -OutFile $dlFilePath

$unZipDir = $dlFilePath.TrimEnd('.zip');

if(Test-Path $unZipDir) {
    Remove-Item -Recurse -Force $unZipDir
}

'Unziping...'

Expand-Archive $dlFilePath $unZipDir;

'Copying...'

Copy-Item (Join-Path $unZipDir $extFileName) (Join-Path $phpExtDir $extFileName)

'Installed'
