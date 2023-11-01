#!/bin/bash
dlDir=$1
phpDir=$2
extVersion=$3

cd $dlDir
echo 'Downloading...'
curl -C - -O -s https://pecl.php.net/get/mongodb-$extVersion.tgz
echo 'Downloaded'
if [ -d "mongodb-$extVersion" ]; then
 rm -rf "mongodb-$extVersion"
fi
if [ -f "mongodb-$extVersion.tgz" ]; then
  tar -zxf mongodb-$extVersion.tgz
else
  exit 1
fi

export HOMEBREW_NO_AUTO_UPDATE=1
brew install pkg-config autoconf automake libtool
cd "mongodb-$extVersion"
$phpDir/bin/phpize
./configure --with-php-config=$phpDir/bin/php-config
arch -x86_64 make -j4
make install
