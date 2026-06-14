@echo off

start "Redis server" cmd /k "redis-server"
timeout /t 1 > nul

start "Backend" cmd /k "cd server && npm run start"
timeout /t 1 > nul

start "Frontend" cmd /k "cd frontend && npm run start"
