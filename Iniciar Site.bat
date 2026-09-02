@echo off
chcp 65001 >nul
title Royal Cut - Iniciando...
color 0B

echo ============================================================
echo    ROYAL CUT - Iniciando o sistema
echo ============================================================
echo.

set "PATH=C:\Program Files\nodejs;%PATH%"

if not exist "%~dp0backend\node_modules" (
    echo   AVISO: dependencias do back-end nao instaladas.
    echo   Abra um terminal na pasta "backend" e rode: npm install
    echo.
    pause
    exit /b 1
)

if not exist "%~dp0frontend\node_modules" (
    echo   AVISO: dependencias do front-end nao instaladas.
    echo   Abra um terminal na pasta "frontend" e rode: npm install
    echo.
    pause
    exit /b 1
)

echo [1/3] Iniciando o back-end (API)...
start "Royal Cut - BACK-END (nao feche)" cmd /k "cd /d "%~dp0backend" && npm run dev"

timeout /t 4 /nobreak >nul

echo [2/3] Iniciando o front-end (site)...
start "Royal Cut - FRONT-END (nao feche)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo [3/3] Aguardando o site ficar pronto...
timeout /t 6 /nobreak >nul

start http://localhost:5173

echo.
echo ============================================================
echo   Tudo pronto! O site deve abrir sozinho no navegador.
echo   Se nao abrir, acesse manualmente: http://localhost:5173
echo.
echo   Duas janelas pretas foram abertas (back-end e front-end).
echo   NAO FECHE essas janelas enquanto estiver usando o site.
echo   Para desligar tudo, so fechar as duas janelas pretas.
echo   (O banco de dados e um arquivo unico, nao precisa de nenhum
echo    programa externo rodando.)
echo ============================================================
echo.
pause
