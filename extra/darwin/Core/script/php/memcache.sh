#!/bin/bash
dlDir=$1
phpDir=$2
extVersion=$3

cd $dlDir
echo 'Downloading...'
curl -C - -O -s https://pecl.php.net/get/memcache-$extVersion.tgz
echo 'Downloaded'
if [ -d "memcache-$extVersion" ]; then
 rm -rf "memcache-$extVersion"
fi
if [ -f "memcache-$extVersion.tgz" ]; then
  tar -zxf memcache-$extVersion.tgz
else
  exit 1
fi

export HOMEBREW_NO_AUTO_UPDATE=1
brew install pkg-config autoconf automake libtool
cd "memcache-$extVersion"
$phpDir/bin/phpize
./configure --with-php-config=$phpDir/bin/php-config --with-zlib-dir=/Applications/EServer/Library/zlib
arch -x86_64 make -j4
make install
