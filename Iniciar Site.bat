@echo off
chcp 65001 >nul
title Black Blue Barber - Iniciando...
color 0B

echo ============================================================
echo    BLACK BLUE BARBER - Iniciando o sistema
echo ============================================================
echo.

set "PATH=C:\Program Files\nodejs;C:\Program Files\PostgreSQL\17\bin;%PATH%"

echo [1/4] Verificando o banco de dados (PostgreSQL)...
sc query postgresql-x64-17 | find "RUNNING" >nul
if errorlevel 1 (
    echo   AVISO: o servico do PostgreSQL nao parece estar rodando.
    echo   Abra o "Servicos" do Windows e inicie o "postgresql-x64-17",
    echo   ou reinicie o computador, depois rode este arquivo de novo.
    echo.
    pause
    exit /b 1
) else (
    echo   OK - banco de dados rodando.
)
echo.

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

echo [2/4] Iniciando o back-end (API)...
start "Black Blue Barber - BACK-END (nao feche)" cmd /k "cd /d "%~dp0backend" && npm run dev"

timeout /t 4 /nobreak >nul

echo [3/4] Iniciando o front-end (site)...
start "Black Blue Barber - FRONT-END (nao feche)" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo [4/4] Aguardando o site ficar pronto...
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
echo ============================================================
echo.
pause
