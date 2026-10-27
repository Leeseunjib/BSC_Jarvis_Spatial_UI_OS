' BSC_자비스 (BSC_Jarvis) Windows 11 Login Auto-Start Daemon
' Starts BSC_자비스 background voice server & HUD at Windows login
Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\\BSC_Javis_OS"
WshShell.Run "cmd /c node ""C:\\BSC_Javis_OS\\server.js""", 0, False
WScript.Sleep 1800
WshShell.Run "cmd /c start msedge --app=http://localhost:7777", 0, False