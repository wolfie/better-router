#!/usr/bin/env node

import fs from "fs/promises";

const KEYS_TO_KEEP = /** @type {const} */ ([
  "version",
  "type",
  "license",
  "peerDependencies",
  "keywords",
  "repository"
]);

globalThis.console.log("Reading package.json");
const packageJsonString = await fs.readFile("./package.json", "utf-8");

globalThis.console.log("Parsing package.json");
const packageJson = JSON.parse(packageJsonString);

globalThis.console.log('Setting the name to "betterouter"');
const newPackageJson = { name: "betterouter" }

const listFormatter = new Intl.ListFormat("en", { type: "conjunction" })
globalThis.console.log(`Keeping the values of ${listFormatter.format(KEYS_TO_KEEP)}`);
Object.entries(packageJson).forEach(([key, value]) => {
  if (!KEYS_TO_KEEP.includes(key)) return;
  newPackageJson[key] = value
})

globalThis.console.log("writing dist/package.json");
await fs.writeFile('./dist/package.json', JSON.stringify(newPackageJson, null, 2), 'utf-8')

globalThis.console.log("Done!\n");
