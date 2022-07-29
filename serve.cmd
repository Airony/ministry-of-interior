@echo off 

IF "%1"=="/clear" (
    if exist "%~dp0_cache" rmdir /s /q "%~dp0_cache"
)

if exist "%~dp0build\" del /s /q "%~dp0build\" >nul

if not exist "_cache" mkdir "%~dp0_cache"
setlocal
    set ELEVENTY_SERVE=true& set NODE_ENV=dev& CMD /C npm start
endlocal