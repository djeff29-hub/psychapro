@echo off
REM ============================================================
REM   PsychaPro — Lanceur de developpement local
REM ============================================================
REM  Ce fichier lance le serveur de developpement Vite
REM  et ouvre automatiquement le site dans votre navigateur.
REM ============================================================

title PsychaPro - Serveur local

REM Se placer dans le dossier du script (meme si lance depuis ailleurs)
cd /d "%~dp0"

echo.
echo ============================================================
echo    PsychaPro - Demarrage du serveur local
echo ============================================================
echo.

REM Verifier que Node.js est installe
where node >nul 2>nul
if errorlevel 1 (
    echo [ERREUR] Node.js n'est pas installe sur ce systeme.
    echo.
    echo Telechargez-le depuis : https://nodejs.org
    echo Installez la version LTS puis relancez ce fichier.
    echo.
    pause
    exit /b 1
)

REM Afficher la version de Node detectee
for /f "tokens=*" %%v in ('node --version') do set NODE_VERSION=%%v
echo [OK] Node.js detecte : %NODE_VERSION%
echo.

REM Verifier que package.json existe
if not exist "package.json" (
    echo [ERREUR] Aucun fichier package.json trouve dans ce dossier.
    echo.
    echo Ce fichier batch doit se trouver a la racine du projet,
    echo au meme niveau que package.json et le dossier src\
    echo.
    pause
    exit /b 1
)

REM Installer les dependances si node_modules n'existe pas
if not exist "node_modules" (
    echo [INFO] Premiere execution : installation des dependances...
    echo        Cela peut prendre quelques minutes.
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo [ERREUR] L'installation des dependances a echoue.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Dependances installees.
    echo.
)

echo [INFO] Lancement du serveur de developpement...
echo [INFO] Le site va s'ouvrir automatiquement dans votre navigateur.
echo.
echo Pour arreter le serveur : fermez cette fenetre ou appuyez sur Ctrl+C
echo.
echo ============================================================
echo.

REM Ouvrir le navigateur apres 4 secondes (laisser le temps a Vite de demarrer)
start "" /b cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:5173"

REM Lancer le serveur Vite
call npm run dev

REM Si on arrive ici, c'est que le serveur s'est arrete
echo.
echo ============================================================
echo   Serveur arrete.
echo ============================================================
pause
