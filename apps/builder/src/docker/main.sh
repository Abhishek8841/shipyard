#!/bin/bash

set -e

echo "Installing required tools..."

apt-get update
apt-get install -y git

echo "Cloning repository..."

rm -rf /app/* /app/.[!.]* /app/..?*


cd /app

git clone "$1" .

echo "Installing dependencies..."

npm install

echo "Building..."

npm run build

echo "Build completed"