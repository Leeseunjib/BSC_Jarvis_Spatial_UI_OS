' BSC_자비스 (BSC_Jarvis) Frameless Monitor App Launcher (No Browser Address Bar)
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c start msedge --app=http://localhost:7777/?mode=monitor-app --window-size=1280,860", 0, False