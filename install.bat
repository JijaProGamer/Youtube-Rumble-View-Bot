CALL npm install
CALL npm install electron@24.1.2 --global
CALL npx playwright install-deps firefox
CALL npx playwright install firefox

CALL cd .\main\
CALL npm run build
CALL npm rebuild better-sqlite3