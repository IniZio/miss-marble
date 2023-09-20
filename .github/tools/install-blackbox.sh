#!/usr/bin/bash
set -euxo pipefail

cd /tmp
git clone https://github.com/StackExchange/blackbox
make -C blackbox copy-install
rm -rf blackbox