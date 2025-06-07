@echo off
chcp 65001 >nul

echo 🚀 启动 Node.js 后端服务...
echo.
echo 📁 当前目录: %CD%
echo 📍 后端地址: http://localhost:3000
echo 💡 按 Ctrl+C 可直接退出
echo.

cd Node
npm run dev

echo.
echo 👋 后端服务已停止
pause 