@echo off

set dlDir=%1
set phpDir=%2
set extVersion=%3
set extName=%4
set extFileName=%5
set phpExtDir=%6
set dlFileName=%7

set "downloader=bitsadmin /transfer myDownloadJob /download /priority normal"

set dlFilePath=%dlDir%\%dlFileName%
%downloader% "https://windows.php.net/downloads/pecl/releases/%extName%/%extVersion%/%dlFileName%" %dlFilePath%

Call :UnZipFile %dlDir% %dlFilePath%


:UnZipFile <ExtractTo> <newzipfile>
set vbs="%temp%\_.vbs"
if exist %vbs% del /f /q %vbs%
>%vbs%  echo Set fso = CreateObject("Scripting.FileSystemObject")
>>%vbs% echo If NOT fso.FolderExists(%1) Then
>>%vbs% echo fso.CreateFolder(%1)
>>%vbs% echo End If
>>%vbs% echo set objShell = CreateObject("Shell.Application")
>>%vbs% echo set FilesInZip=objShell.NameSpace(%2).items
>>%vbs% echo objShell.NameSpace(%1).CopyHere(FilesInZip)
>>%vbs% echo Set fso = Nothing
>>%vbs% echo Set objShell = Nothing
cscript //nologo %vbs%
if exist %vbs% del /f /q %vbs%