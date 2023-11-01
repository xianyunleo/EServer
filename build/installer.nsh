!macro preInit
	SetRegView 64
	WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\EServer"
	WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\EServer"
	SetRegView 32
	WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\EServer"
	WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "D:\EServer"
!macroend

!macro customRemoveFiles
    ${if} ${isUpdated}
        !insertmacro quitSuccess
    ${else}
        RMDir /r $INSTDIR
    ${endIf}
!macroend
