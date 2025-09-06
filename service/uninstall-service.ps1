# Uninstall Anime Prompt Generator Image Service
# Requires Administrator privileges

param(
    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "AnimePromptGen-ImageWorker",
    
    [Parameter(Mandatory=$false)]
    [switch]$Force,
    
    [Parameter(Mandatory=$false)]
    [switch]$KeepLogs
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
$SERVICE_WRAPPER = Join-Path $SCRIPT_ROOT "service-wrapper.ps1"
$LOGS_DIR = Join-Path $SCRIPT_ROOT "logs"

Write-Host "Anime Prompt Generator - Service Uninstallation" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Check if service exists
$existingService = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue

if (-not $existingService) {
    Write-Warning "Service '$ServiceName' not found."
    exit 0
}

# Confirm uninstallation
if (-not $Force) {
    Write-Host "Service Details:" -ForegroundColor Yellow
    Write-Host "  Name: $($existingService.Name)"
    Write-Host "  Display Name: $($existingService.DisplayName)"
    Write-Host "  Status: $($existingService.Status)"
    Write-Host ""
    
    $response = Read-Host "Are you sure you want to uninstall this service? (y/N)"
    if ($response -ne 'y' -and $response -ne 'Y') {
        Write-Host "Uninstallation cancelled."
        exit 0
    }
}

try {
    # Stop the service if running
    if ($existingService.Status -eq 'Running') {
        Write-Host "Stopping service..." -ForegroundColor Yellow
        Stop-Service -Name $ServiceName -Force -ErrorAction Stop
        
        # Wait for service to stop
        $timeout = 30
        $elapsed = 0
        while ((Get-Service -Name $ServiceName).Status -ne 'Stopped' -and $elapsed -lt $timeout) {
            Start-Sleep -Seconds 1
            $elapsed++
        }
        
        if ((Get-Service -Name $ServiceName).Status -ne 'Stopped') {
            Write-Warning "Service did not stop gracefully within $timeout seconds"
            Write-Host "Forcing service termination..."
            
            # Get service process and terminate it
            $serviceProcess = Get-WmiObject -Query "SELECT * FROM Win32_Service WHERE Name='$ServiceName'"
            if ($serviceProcess.ProcessId -gt 0) {
                Stop-Process -Id $serviceProcess.ProcessId -Force -ErrorAction SilentlyContinue
            }
        }
        
        Write-Host "Service stopped." -ForegroundColor Green
    }
    
    # Remove the Windows Service
    Write-Host "Removing Windows Service..." -ForegroundColor Yellow
    $deleteResult = sc.exe delete $ServiceName
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Service removed successfully." -ForegroundColor Green
    } else {
        Write-Warning "Service removal may have failed. Exit code: $LASTEXITCODE"
        Write-Host "Output: $deleteResult"
    }
    
    # Remove service wrapper script
    if (Test-Path $SERVICE_WRAPPER) {
        Write-Host "Removing service wrapper script..." -ForegroundColor Yellow
        Remove-Item $SERVICE_WRAPPER -Force
        Write-Host "Service wrapper removed." -ForegroundColor Green
    }
    
    # Handle log files
    if (Test-Path $LOGS_DIR) {
        if (-not $KeepLogs) {
            $response = Read-Host "Do you want to remove log files? (y/N)"
            if ($response -eq 'y' -or $response -eq 'Y') {
                Write-Host "Removing log files..." -ForegroundColor Yellow
                Remove-Item $LOGS_DIR -Recurse -Force
                Write-Host "Log files removed." -ForegroundColor Green
            } else {
                Write-Host "Log files preserved in: $LOGS_DIR" -ForegroundColor Yellow
            }
        } else {
            Write-Host "Log files preserved in: $LOGS_DIR" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "Service uninstallation completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Remaining files:" -ForegroundColor Cyan
    Write-Host "  - Configuration: $(Join-Path $SCRIPT_ROOT '.env') (if exists)"
    Write-Host "  - Main script: $(Join-Path $SCRIPT_ROOT 'image-service-worker.ps1')"
    Write-Host "  - Installation script: $(Join-Path $SCRIPT_ROOT 'install-service.ps1')"
    if ($KeepLogs -or (Test-Path $LOGS_DIR)) {
        Write-Host "  - Log files: $LOGS_DIR"
    }
    Write-Host ""
    Write-Host "To reinstall the service, run: .\install-service.ps1" -ForegroundColor Yellow
    
} catch {
    Write-Error "Uninstallation failed: $($_.Exception.Message)"
    Write-Host ""
    Write-Host "Manual cleanup may be required:" -ForegroundColor Yellow
    Write-Host "1. Stop the service: Stop-Service -Name '$ServiceName' -Force"
    Write-Host "2. Delete the service: sc.exe delete '$ServiceName'"
    Write-Host "3. Remove files manually if needed"
    exit 1
}