#!/bin/bash
dlDir=$1
phpDir=$2
extVersion=$3

cd $dlDir
echo 'Downloading...'
curl -C - -O -s https://pecl.php.net/get/swoole-$extVersion.tgz
echo 'Downloaded'
if [ -d "swoole-$extVersion" ]; then
 rm -rf "swoole-$extVersion"
fi
if [ -f "swoole-$extVersion.tgz" ]; then
  tar -zxf swoole-$extVersion.tgz
else
  exit 1
fi

export HOMEBREW_NO_AUTO_UPDATE=1
brew install pkg-config autoconf automake libtool
cd "swoole-$extVersion"
$phpDir/bin/phpize
PKG_CONFIG_PATH=/Applications/EServer/Library/lib/pkgconfig \
./configure \
--with-php-config=$phpDir/bin/php-config \
--enable-openssl \
--enable-swoole-curl

make -j"$(sysctl -n hw.ncpu 2>/dev/null || echo 8)"
make install
