@echo off
chcp 65001 >nul

echo 🎨 启动 Vue.js 前端服务...
echo.
echo 📁 当前目录: %CD%
echo 📍 前端地址: http://localhost:5173
echo 💡 按 Ctrl+C 可直接退出
echo.

cd Vue
npm run dev

echo.
echo 👋 前端服务已停止
pause 