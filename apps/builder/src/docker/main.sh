#!/bin/bash


set -e


echo "Installing required tools..."

apt-get update

apt-get install -y git curl

echo "Installing Node..."
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

apt-get install -y nodejs


echo "Cloning repository..."


cd /app

git clone "$1" .

echo "Installing dependencies..."
npm install


echo "Building..."
npm run build


echo "Build completed"