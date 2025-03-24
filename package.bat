@echo off
SETLOCAL

SET "BUILD_DIR=%~dp0build"
del /q "%BUILD_DIR%\*" && for /d %%x in ("%BUILD_DIR%\*") do rmdir /s /q "%%x"

CALL install.bat
CALL npm run make
CALL npm run package

ENDLOCAL