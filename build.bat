@echo off
echo Building Byway Frontend for production...

REM Clean previous builds
if exist "build" rmdir /s /q "build"

REM Install dependencies
npm install

REM Build for production
npm run build

echo Build completed successfully!
echo Build files are in the 'build' folder.
echo Upload the contents of the 'build' folder to your hosting service.

pause
