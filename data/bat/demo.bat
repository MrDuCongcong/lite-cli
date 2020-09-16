cd E:\worker\client\insight-bi
@echo off
call npm run build:prod
echo Exit Code = %ERRORLEVEL%
if "%ERRORLEVEL%" == "1" exit /B 1
xcopy /E  E:\worker\client\insight-bi\dist  F:/