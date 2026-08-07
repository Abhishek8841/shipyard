#!/bin/bash

set -e

echo "kuchu puchu this is the custom image"

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