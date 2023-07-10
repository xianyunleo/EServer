@echo off

set dlDir=%1
set phpDir=%2
set extVersion=%3
set extName=%4
set extFileName=%5
set phpExtDir=%6

set "downloader=bitsadmin /transfer myDownloadJob /download /priority normal"
set fileName=php_%extName%-%extVersion%-%phpVersion%-nts-vs16-x64
set filePath=dlDir\php_%extName%-%extVersion%-%phpVersion%-nts-vs16-x64
%downloader% "https://windows.php.net/downloads/pecl/releases/redis/5.1.1/php_redis-5.1.1-7.4-nts-vc15-x64.zip"

Call :UnZipFile %dlDir% filePath

copy %filePath% %phpExtDir%


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