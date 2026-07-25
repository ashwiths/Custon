; ============================================================================
; Inno Setup Compiler Script for Custon Desktop App
; Build standalone setup executable with customizable installation options
; ============================================================================

#define MyAppName "Custun"
#define MyAppVersion "0.1.0"
#define MyAppPublisher "Custun Inc."
#define MyAppURL "https://custon.app"
#define MyAppExeName "Custun.exe"

[Setup]
; Basic Setup Info
AppId={{D37E88F9-281C-4B9A-99B1-29E2C51D041A}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}

; Installation Directory Configuration
DefaultDirName={autopf}\{#MyAppName}
DisableDirPage=no
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=no
AllowNoIcons=yes

; Output Configuration
OutputDir=..\dist_installer
OutputBaseFilename=Custun_Setup_v0.1.0
SetupIconFile=..\src-tauri\icons\icon.ico
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
PrivilegesRequired=lowest

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked
Name: "startmenuicon"; Description: "Create a Start Menu shortcut"; GroupDescription: "{cm:AdditionalIcons}"
Name: "autostart"; Description: "Run Custon automatically on Windows startup"; GroupDescription: "Startup Options:"

[Files]
Source: "..\src-tauri\target\release\{#MyAppExeName}"; DestDir: "{app}"; Flags: ignoreversion
; Include additional bundled assets if necessary

[Icons]
Name: "{autoprograms}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: startmenuicon
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

[Registry]
; Run on Windows startup option
Root: HKCU; Subkey: "Software\Microsoft\Windows\CurrentVersion\Run"; ValueType: string; ValueName: "Custun"; ValueData: """{app}\{#MyAppExeName}"""; Flags: uninsvalue; Tasks: autostart

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#StringChange(MyAppName, '&', '&&')}}"; Flags: nowait postinstall skipifsilent

[UninstallDelete]
Type: filesandordirs; Name: "{app}"
