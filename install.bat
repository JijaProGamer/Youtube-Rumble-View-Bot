CALL npm install electron@32.0.1 --global
CALL npm install
REM CALL npm run electron-builder install-app-deps
CALL ./node_modules/.bin/electron-rebuild
CALL npx playwright install-deps firefox
CALL npx playwright install firefox

CALL cd .\main\
CALL npm run build