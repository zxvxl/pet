#!/bin/bash
# 打包 miniapp 源码到 dist 目录
set -e

SCRIPT_DIR="$(dirname "$0")"
SRC_DIR="$SCRIPT_DIR/../frontend/miniapp"
DIST_DIR="$SCRIPT_DIR/../dist/miniapp"

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"
cp -r "$SRC_DIR"/* "$DIST_DIR"/

echo "Miniapp 打包完成，目录：$DIST_DIR"
