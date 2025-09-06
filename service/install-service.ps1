# Install Anime Prompt Generator Image Service as Windows Service
# Requires Administrator privileges

param(
    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "AnimePromptGen-ImageWorker",
    
    [Parameter(Mandatory=$false)]
    [string]$DisplayName = "Anime Prompt Generator - Image Worker",
    
    [Parameter(Mandatory=$false)]
    [string]$Description = "Processes image generation requests from the Anime Prompt Generator application using ComfyUI",
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("Automatic", "Manual", "Disabled")]
    [string]$StartupType = "Automatic",
    
    [Parameter(Mandatory=$false)]
    [switch]$Force
)

# Check if running as Administrator
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

if (-not (Test-Administrator)) {
    Write-Error "This script must be run as Administrator. Please run PowerShell as Administrator and try again."
    exit 1
}

$SCRIPT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$SERVICE_SCRIPT = Join-Path $SCRIPT_ROOT "image-service-worker.ps1"
$SERVICE_WRAPPER = Join-Path $SCRIPT_ROOT "service-wrapper.ps1"

Write-Host "Anime Prompt Generator - Service Installation" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Verify service script exists
if (-not (Test-Path $SERVICE_SCRIPT)) {
    Write-Error "Service script not found: $SERVICE_SCRIPT"
    exit 1
}

# Check if service already exists
$existingService = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue

if ($existingService) {
    if (-not $Force) {
        Write-Warning "Service '$ServiceName' already exists."
        $response = Read-Host "Do you want to reinstall it? (y/N)"
        if ($response -ne 'y' -and $response -ne 'Y') {
            Write-Host "Installation cancelled."
            exit 0
        }
    }
    
    Write-Host "Stopping existing service..." -ForegroundColor Yellow
    Stop-Service -Name $ServiceName -Force -ErrorAction SilentlyContinue
    
    Write-Host "Removing existing service..." -ForegroundColor Yellow
    sc.exe delete $ServiceName | Out-Null
    Start-Sleep -Seconds 2
}

# Create service wrapper script
Write-Host "Creating service wrapper..." -ForegroundColor Green

$wrapperContent = @"
# Windows Service Wrapper for Anime Prompt Generator Image Worker
# This script runs the image-service-worker.ps1 as a Windows Service

# Set working directory to script location
Set-Location -Path `$PSScriptRoot

# Configure service parameters
`$ConfigFile = ".env"
`$LogFile = Join-Path `$PSScriptRoot "logs\service.log"

# Ensure logs directory exists
`$logsDir = Join-Path `$PSScriptRoot "logs"
if (-not (Test-Path `$logsDir)) {
    New-Item -ItemType Directory -Path `$logsDir -Force | Out-Null
}

# Service logging function
function Write-ServiceWrapperLog {
    param([string]`$Message)
    `$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    `$logEntry = "[`$timestamp] [WRAPPER] `$Message"
    Add-Content -Path `$LogFile -Value `$logEntry -ErrorAction SilentlyContinue
}

try {
    Write-ServiceWrapperLog "Service wrapper starting..."
    
    # Check if config file exists
    if (-not (Test-Path `$ConfigFile)) {
        Write-ServiceWrapperLog "ERROR: Configuration file not found: `$ConfigFile"
        Write-ServiceWrapperLog "Please copy .env.example to .env and configure it"
        exit 1
    }
    
    # Start the main service script in daemon mode
    Write-ServiceWrapperLog "Starting image service worker in daemon mode..."
    
    & "`$PSScriptRoot\image-service-worker.ps1" -ConfigFile `$ConfigFile -DaemonMode -Verbose
    
    Write-ServiceWrapperLog "Image service worker started successfully"
    
} catch {
    Write-ServiceWrapperLog "ERROR: Service wrapper failed: `$(`$_.Exception.Message)"
    exit 1
}
"@

$wrapperContent | Out-File -FilePath $SERVICE_WRAPPER -Encoding UTF8

# Create Windows Service
Write-Host "Creating Windows Service..." -ForegroundColor Green

$serviceCommand = "powershell.exe -ExecutionPolicy Bypass -File `"$SERVICE_WRAPPER`""
$binaryPath = $serviceCommand

# Create the service
$createResult = sc.exe create $ServiceName binpath= $binaryPath displayname= $DisplayName start= auto
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to create service. Error code: $LASTEXITCODE"
    exit 1
}

# Configure service description
sc.exe description $ServiceName $Description | Out-Null

# Configure service to restart on failure
sc.exe failure $ServiceName reset= 86400 actions= restart/30000/restart/30000/restart/30000 | Out-Null

# Configure service startup type
switch ($StartupType) {
    "Automatic" { sc.exe config $ServiceName start= auto | Out-Null }
    "Manual" { sc.exe config $ServiceName start= demand | Out-Null }
    "Disabled" { sc.exe config $ServiceName start= disabled | Out-Null }
}

Write-Host "Service '$ServiceName' created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Service Details:" -ForegroundColor Cyan
Write-Host "  Name: $ServiceName"
Write-Host "  Display Name: $DisplayName"
Write-Host "  Description: $Description"
Write-Host "  Startup Type: $StartupType"
Write-Host "  Script Location: $SERVICE_SCRIPT"
Write-Host ""

# Configuration validation
Write-Host "Configuration Validation:" -ForegroundColor Yellow
$envFile = Join-Path $SCRIPT_ROOT ".env"
if (Test-Path $envFile) {
    Write-Host "  ✓ Configuration file found: $envFile" -ForegroundColor Green
} else {
    Write-Host "  ✗ Configuration file missing: $envFile" -ForegroundColor Red
    Write-Host "    Please copy .env.example to .env and configure it before starting the service" -ForegroundColor Yellow
}

# Service management commands
Write-Host ""
Write-Host "Service Management Commands:" -ForegroundColor Cyan
Write-Host "  Start Service:    Start-Service -Name '$ServiceName'"
Write-Host "  Stop Service:     Stop-Service -Name '$ServiceName'"
Write-Host "  Restart Service:  Restart-Service -Name '$ServiceName'"
Write-Host "  Service Status:   Get-Service -Name '$ServiceName'"
Write-Host "  View Logs:        Get-Content '$SCRIPT_ROOT\logs\service.log' -Tail 20 -Wait"
Write-Host "  Uninstall:        .\uninstall-service.ps1"
Write-Host ""

# Option to start service immediately
if ($StartupType -eq "Automatic") {
    $startNow = Read-Host "Would you like to start the service now? (Y/n)"
    if ($startNow -ne 'n' -and $startNow -ne 'N') {
        try {
            Write-Host "Starting service..." -ForegroundColor Green
            Start-Service -Name $ServiceName
            Write-Host "Service started successfully!" -ForegroundColor Green
            
            # Show initial status
            Start-Sleep -Seconds 2
            $serviceStatus = Get-Service -Name $ServiceName
            Write-Host "Service Status: $($serviceStatus.Status)" -ForegroundColor Green
            
        } catch {
            Write-Warning "Failed to start service: $($_.Exception.Message)"
            Write-Host "You can start it manually later using: Start-Service -Name '$ServiceName'"
        }
    }
}

Write-Host ""
Write-Host "Installation completed!" -ForegroundColor Green