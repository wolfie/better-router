#!/bin/bash

rm -rf dist/*
mkdir -p dist
./create-package-dist-json.js
cp ../README.md dist
cp ../LICENSE dist
tsc -p tsconfig.build.json
