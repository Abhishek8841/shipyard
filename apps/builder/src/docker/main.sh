#!/bin/bash

set -e

echo "Installing required tools..."

apt-get update
apt-get install -y git

echo "Cloning repository..."

ls

echo "$2"

git clone "$1" .

cd $2

echo "Installing dependencies..."

npm install

echo "Building..."

npm run build

echo "Build completed"