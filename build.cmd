@echo off 

if exist "%~dp0build\" rmdir /s /q "%~dp0build\"

setlocal
    set NODE_ENV=build& CMD /C npm run-script build
endlocal