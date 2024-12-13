#!/bin/bash
dlDir=$1
phpDir=$2
extVersion=$3

cd $dlDir
echo 'Downloading...'
curl -C - -O -s https://pecl.php.net/get/xlswriter-$extVersion.tgz
echo 'Downloaded'
if [ -d "xlswriter-$extVersion" ]; then
 rm -rf "xlswriter-$extVersion"
fi
if [ -f "xlswriter-$extVersion.tgz" ]; then
  tar -zxf xlswriter-$extVersion.tgz
else
  exit 1
fi

export HOMEBREW_NO_AUTO_UPDATE=1
brew install pkg-config autoconf automake libtool

cd "xlswriter-$extVersion"
$phpDir/bin/phpize
./configure --with-php-config=$phpDir/bin/php-config --enable-reader --with-zlib-dir=/Applications/EServer/Library/zlib
arch -x86_64 make -j4
make install
