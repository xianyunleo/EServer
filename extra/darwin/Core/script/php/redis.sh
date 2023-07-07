#!/bin/bash
dlDir=$1
phpDir=$2
extVersion=$3

cd $dlDir
curl -C - -O -s http://pecl.php.net/get/redis-$extVersion.tgz
if [ -d "redis-$extVersion" ]; then
 rm -rf "redis-$extVersion"
fi
if [ -f "redis-$extVersion.tgz" ]; then
  tar -zxf redis-$extVersion.tgz
else
  exit 1
fi

arch -x86_64 brew install pkg-config autoconf automake libtool
cd "redis-$extVersion"
$phpDir/bin/phpize
./configure --with-php-config=$phpDir/bin/php-config
arch -x86_64 make -j4
make install
