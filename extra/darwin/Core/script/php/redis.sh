#!/bin/bash
dlDir=$1
phpDir=$2
extVersion=$3

cd $dlDir
echo 'Downloading...'
curl -C - -O -s https://pecl.php.net/get/redis-$extVersion.tgz
echo 'Downloaded'
if [ -d "redis-$extVersion" ]; then
 rm -rf "redis-$extVersion"
fi
if [ -f "redis-$extVersion.tgz" ]; then
  tar -zxf redis-$extVersion.tgz
else
  exit 1
fi

export HOMEBREW_NO_AUTO_UPDATE=1
brew install pkg-config autoconf automake libtool
cd "redis-$extVersion"
$phpDir/bin/phpize
./configure --with-php-config=$phpDir/bin/php-config
arch -x86_64 make -j4
make install
