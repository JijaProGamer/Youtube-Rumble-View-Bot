CALL npm install
CALL npm install electron --global

CALL cd .\internal\ui\
CALL npm install
CALL npm run build
CALL cd ..
CALL cd ..