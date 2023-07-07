#!/bin/bash
dlDir=$1
phpDir=$2
extVersion=$3

cd $dlDir
curl -C - -O -s http://pecl.php.net/get/swoole-$extVersion.tgz
if [ -d "swoole-$extVersion" ]; then
 rm -rf "swoole-$extVersion"
fi
if [ -f "swoole-$extVersion.tgz" ]; then
  tar -zxf swoole-$extVersion.tgz
else
  exit 1
fi

arch -x86_64 brew install pkg-config autoconf automake libtool
cd "swoole-$extVersion"
$phpDir/bin/phpize
./configure --with-php-config=$phpDir/bin/php-config
arch -x86_64 make -j4
make install
