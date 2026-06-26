#!/bin/bash
dlDir=$1
phpDir=$2
extVersion=$3

cd $dlDir
echo 'Downloading...'
curl -C - -O -s https://pecl.php.net/get/imagick-$extVersion.tgz
echo 'Downloaded'
if [ -d "imagick-$extVersion" ]; then
 rm -rf "imagick-$extVersion"
fi
if [ -f "imagick-$extVersion.tgz" ]; then
  tar -zxf imagick-$extVersion.tgz
else
  exit 1
fi

export HOMEBREW_NO_AUTO_UPDATE=1
brew install pkg-config autoconf automake libtool

brew install ImageMagick
prefix=$(brew --prefix)
export CFLAGS=-I$prefix/include
export CPPFLAGS=-I$prefix/include
export LDFLAGS=-L$prefix/lib

lib=$prefix/opt/imagemagick

cd "imagick-$extVersion"
$phpDir/bin/phpize
./configure --with-php-config=$phpDir/bin/php-config --with-imagick=$lib
make -j"$(sysctl -n hw.ncpu 2>/dev/null || echo 8)"
make install
