@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo 首次运行：正在安装依赖，请稍候...
  call npm install --registry=https://registry.npmmirror.com
)
echo 正在启动「星海拾光」... 浏览器将自动打开。
echo 请保持本窗口开启，关闭窗口即停止网站。
start "" powershell -WindowStyle Hidden -Command "Start-Sleep 4; Start-Process 'http://localhost:5173'"
call npm run dev
pause