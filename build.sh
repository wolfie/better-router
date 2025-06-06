#!/bin/bash

rm -rf dist/*
mkdir -p dist
./create-package-dist-json.js
cp ./README.md ./LICENSE dist
tsc -p tsconfig.build.json
