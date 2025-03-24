#!/bin/bash

npm install electron@32.0.1 --global
npm install
CALL ./node_modules/.bin/electron-rebuild
npx playwright install-deps firefox
npx playwright install firefox
npm run rebuild-sqlite

cd ./main/
npm run build