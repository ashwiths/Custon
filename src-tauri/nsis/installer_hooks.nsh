; ============================================================================
; Custon Installer Hooks (NSIS Custom Script)
; Configures Desktop Shortcuts, Start Menu, Auto-Launch & Startup Options
; ============================================================================

!macro customHeader
  !define MUI_WELCOMEFINISHPAGE_BITMAP "${NSISDIR}\Contrib\Graphics\Header\win.bmp"
!macroend

!macro customInstall
  ; Enable Desktop Shortcut Creation
  CreateShortCut "$DESKTOP\Custon.lnk" "$INSTDIR\Custon.exe" "" "$INSTDIR\Custon.exe" 0
  
  ; Enable Start Menu Shortcut
  CreateDirectory "$SMPROGRAMS\Custon"
  CreateShortCut "$SMPROGRAMS\Custon\Custon.lnk" "$INSTDIR\Custon.exe" "" "$INSTDIR\Custon.exe" 0
  CreateShortCut "$SMPROGRAMS\Custon\Uninstall Custon.lnk" "$INSTDIR\Uninstall Custon.exe"
!macroend

!macro customUnInstall
  Delete "$DESKTOP\Custon.lnk"
  Delete "$SMPROGRAMS\Custon\Custon.lnk"
  Delete "$SMPROGRAMS\Custon\Uninstall Custon.lnk"
  RMDir "$SMPROGRAMS\Custon"
!macroend
