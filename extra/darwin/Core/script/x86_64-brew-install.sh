#!/bin/bash
echo 'Installing x86_64 Homebrew...'
arch -x86_64 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"