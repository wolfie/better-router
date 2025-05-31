#!/bin/bash

rm -rf dist/*
mkdir -p dist
./create-package-dist-json.js
tsc --watch
