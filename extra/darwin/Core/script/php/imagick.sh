#!/bin/bash
dlDir=$1
phpDir=$2
extVersion=$3

cd $dlDir
echo 'Downloading...'
curl -C - -O -s http://pecl.php.net/get/imagick-$extVersion.tgz
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

x86_64_brewPath=/usr/local/homebrew/bin/brew
if ! [ -f $x86_64_brewPath ]; then
    echo 'Installing x86_64 Homebrew...'
    arch -x86_64 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

arch -x86_64 brew install ImageMagick
prefix=$(arch -x86_64 $x86_64_brewPath --prefix)
export CFLAGS=-I$prefix/include
lib=$prefix/opt/imagemagick

cd "imagick-$extVersion"
$phpDir/bin/phpize
./configure --with-php-config=$phpDir/bin/php-config --with-imagick=$lib
arch -x86_64 make -j4
make install
