# Anime Prompt Generator - Service Manager (Fixed)
# Utility script for managing the image service worker

param(
    [Parameter(Mandatory=$true, Position=0)]
    [ValidateSet("start", "stop", "restart", "status", "logs", "test", "config", "help")]
    [string]$Action,
    
    [Parameter(Mandatory=$false)]
    [string]$ServiceName = "AnimePromptGen-ImageWorker",
    
    [Parameter(Mandatory=$false)]
    [switch]$Follow,
    
    [Parameter(Mandatory=$false)]
    [int]$Lines = 20
)

$SCRIPT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$SERVICE_SCRIPT = Join-Path $SCRIPT_ROOT "image-service-worker.ps1"
$CONFIG_FILE = Join-Path $SCRIPT_ROOT ".env"
$LOG_FILE = Join-Path $SCRIPT_ROOT "logs\service.log"

function Write-Status($message, $color = "White") {
    Write-Host $message -ForegroundColor $color
}

function Get-ServiceInfo {
    try {
        $service = Get-Service -Name $ServiceName -ErrorAction Stop
        return $service
    } catch {
        return $null
    }
}

function Start-ServiceAction {
    Write-Status "Starting service '$ServiceName'..." "Green"
    
    $service = Get-ServiceInfo
    if (-not $service) {
        Write-Status "ERROR: Service '$ServiceName' not found. Please install it first using install-service.ps1" "Red"
        return
    }
    
    try {
        Start-Service -Name $ServiceName
        Write-Status "Service started successfully!" "Green"
        
        # Show status after starting
        Start-Sleep -Seconds 2
        Show-Status
        
    } catch {
        Write-Status "Failed to start service: $($_.Exception.Message)" "Red"
    }
}

function Stop-ServiceAction {
    Write-Status "Stopping service '$ServiceName'..." "Yellow"
    
    $service = Get-ServiceInfo
    if (-not $service) {
        Write-Status "ERROR: Service '$ServiceName' not found." "Red"
        return
    }
    
    try {
        Stop-Service -Name $ServiceName -Force
        Write-Status "Service stopped successfully!" "Green"
        
        # Show status after stopping
        Start-Sleep -Seconds 1
        Show-Status
        
    } catch {
        Write-Status "Failed to stop service: $($_.Exception.Message)" "Red"
    }
}

function Restart-ServiceAction {
    Write-Status "Restarting service '$ServiceName'..." "Cyan"
    
    $service = Get-ServiceInfo
    if (-not $service) {
        Write-Status "ERROR: Service '$ServiceName' not found." "Red"
        return
    }
    
    try {
        Restart-Service -Name $ServiceName -Force
        Write-Status "Service restarted successfully!" "Green"
        
        # Show status after restarting
        Start-Sleep -Seconds 2
        Show-Status
        
    } catch {
        Write-Status "Failed to restart service: $($_.Exception.Message)" "Red"
    }
}

function Show-Status {
    Write-Status "`nService Status:" "Cyan"
    Write-Status "===============" "Cyan"
    
    $service = Get-ServiceInfo
    if (-not $service) {
        Write-Status "Service '$ServiceName' is NOT INSTALLED" "Red"
        Write-Status "`nTo install the service, run: .\install-service.ps1" "Yellow"
        return
    }
    
    $statusColor = switch ($service.Status) {
        "Running" { "Green" }
        "Stopped" { "Red" }
        "StartPending" { "Yellow" }
        "StopPending" { "Yellow" }
        default { "Gray" }
    }
    
    Write-Status "Name: $($service.Name)"
    Write-Status "Display Name: $($service.DisplayName)"
    Write-Status "Status: $($service.Status)" $statusColor
    Write-Status "Start Type: $($service.StartType)"
    
    # Check if config file exists
    Write-Status "`nConfiguration:" "Cyan"
    if (Test-Path $CONFIG_FILE) {
        Write-Status "[OK] Config file exists: $CONFIG_FILE" "Green"
    } else {
        Write-Status "[ERROR] Config file missing: $CONFIG_FILE" "Red"
        Write-Status "  Copy .env.example to .env and configure it" "Yellow"
    }
    
    # Check log file
    if (Test-Path $LOG_FILE) {
        $logInfo = Get-Item $LOG_FILE
        Write-Status "[OK] Log file: $LOG_FILE ($($logInfo.Length) bytes)" "Green"
    } else {
        Write-Status "- No log file found yet" "Gray"
    }
    
    # Show recent log entries if service is running
    if ($service.Status -eq "Running") {
        Show-RecentLogs -Lines 3
    }
}

function Show-Logs {
    if (-not (Test-Path $LOG_FILE)) {
        Write-Status "No log file found: $LOG_FILE" "Yellow"
        return
    }
    
    Write-Status "`nService Logs:" "Cyan"
    Write-Status "=============" "Cyan"
    
    if ($Follow) {
        Write-Status "Following log file (Press Ctrl+C to exit)..." "Yellow"
        Get-Content $LOG_FILE -Tail $Lines -Wait
    } else {
        Get-Content $LOG_FILE -Tail $Lines
    }
}

function Show-RecentLogs {
    param([int]$LogLines = 5)
    
    if (-not (Test-Path $LOG_FILE)) {
        return
    }
    
    Write-Status "`nRecent Log Entries:" "Cyan"
    $recentLogs = Get-Content $LOG_FILE -Tail $LogLines
    foreach ($line in $recentLogs) {
        if ($line -match "\[ERROR\]") {
            Write-Host $line -ForegroundColor Red
        } elseif ($line -match "\[WARNING\]") {
            Write-Host $line -ForegroundColor Yellow
        } elseif ($line -match "\[INFO\]") {
            Write-Host $line -ForegroundColor White
        } else {
            Write-Host $line -ForegroundColor Gray
        }
    }
}

function Test-ServiceConfiguration {
    Write-Status "`nTesting Service Configuration:" "Cyan"
    Write-Status "==============================" "Cyan"
    
    if (-not (Test-Path $SERVICE_SCRIPT)) {
        Write-Status "[ERROR] Service script not found: $SERVICE_SCRIPT" "Red"
        return
    }
    Write-Status "[OK] Service script found" "Green"
    
    if (-not (Test-Path $CONFIG_FILE)) {
        Write-Status "[ERROR] Configuration file not found: $CONFIG_FILE" "Red"
        Write-Status "  Copy .env.example to .env and configure it" "Yellow"
        return
    }
    Write-Status "[OK] Configuration file found" "Green"
    
    # Run the service in test mode
    Write-Status "`nRunning configuration test..." "Yellow"
    
    try {
        & $SERVICE_SCRIPT -ConfigFile ".env" -TestMode
        Write-Status "`n[OK] Configuration test completed" "Green"
    } catch {
        Write-Status "`n[ERROR] Configuration test failed: $($_.Exception.Message)" "Red"
    }
}

function Show-Configuration {
    Write-Status "`nService Configuration:" "Cyan"
    Write-Status "======================" "Cyan"
    
    if (-not (Test-Path $CONFIG_FILE)) {
        Write-Status "Configuration file not found: $CONFIG_FILE" "Red"
        Write-Status "`nExample configuration (.env.example):" "Yellow"
        
        $exampleFile = Join-Path $SCRIPT_ROOT ".env.example"
        if (Test-Path $exampleFile) {
            Get-Content $exampleFile
        } else {
            Write-Status "Example configuration file not found!" "Red"
        }
        return
    }
    
    Write-Status "Configuration file: $CONFIG_FILE" "Green"
    Write-Status ""
    
    # Show configuration with sensitive data masked
    Get-Content $CONFIG_FILE | ForEach-Object {
        if ($_ -match "^(\w*PASSWORD\w*)=(.*)$" -or $_ -match "^(\w*KEY\w*)=(.*)$") {
            $key = $matches[1]
            $value = if ($matches[2].Length -gt 0) { "*****" } else { "" }
            Write-Host "$key=$value" -ForegroundColor Yellow
        } elseif ($_ -match "^#" -or $_.Trim() -eq "") {
            Write-Host $_ -ForegroundColor Gray
        } else {
            Write-Host $_ -ForegroundColor White
        }
    }
}

function Show-Help {
    Write-Host ""
    Write-Host "Anime Prompt Generator - Service Manager" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\service-manager.ps1 [action] [options]" -ForegroundColor White
    Write-Host ""
    Write-Host "ACTIONS:" -ForegroundColor Yellow
    Write-Host "  start     Start the image service" -ForegroundColor White
    Write-Host "  stop      Stop the image service" -ForegroundColor White
    Write-Host "  restart   Restart the image service" -ForegroundColor White
    Write-Host "  status    Show service status and recent logs" -ForegroundColor White
    Write-Host "  logs      Show service logs" -ForegroundColor White
    Write-Host "  test      Test service configuration" -ForegroundColor White
    Write-Host "  config    Show current configuration" -ForegroundColor White
    Write-Host "  help      Show this help message" -ForegroundColor White
    Write-Host ""
    Write-Host "OPTIONS:" -ForegroundColor Yellow
    Write-Host "  -ServiceName [name]   Service name (default: AnimePromptGen-ImageWorker)" -ForegroundColor White
    Write-Host "  -Follow               Follow logs in real-time (with 'logs' action)" -ForegroundColor White
    Write-Host "  -Lines [number]       Number of log lines to show (default: 20)" -ForegroundColor White
    Write-Host ""
    Write-Host "EXAMPLES:" -ForegroundColor Yellow
    Write-Host "  .\service-manager.ps1 start                # Start the service" -ForegroundColor Gray
    Write-Host "  .\service-manager.ps1 status               # Show service status" -ForegroundColor Gray
    Write-Host "  .\service-manager.ps1 logs -Follow         # Follow logs in real-time" -ForegroundColor Gray
    Write-Host "  .\service-manager.ps1 logs -Lines 50       # Show last 50 log lines" -ForegroundColor Gray
    Write-Host "  .\service-manager.ps1 test                 # Test configuration" -ForegroundColor Gray
    Write-Host "  .\service-manager.ps1 config               # Show configuration" -ForegroundColor Gray
    Write-Host ""
    Write-Host "SERVICE MANAGEMENT:" -ForegroundColor Yellow
    Write-Host "  Install:     .\install-service.ps1" -ForegroundColor White
    Write-Host "  Uninstall:   .\uninstall-service.ps1" -ForegroundColor White
    Write-Host "  Manage:      .\service-manager.ps1" -ForegroundColor White
    Write-Host ""
}

# Main execution
switch ($Action.ToLower()) {
    "start" { Start-ServiceAction }
    "stop" { Stop-ServiceAction }
    "restart" { Restart-ServiceAction }
    "status" { Show-Status }
    "logs" { Show-Logs }
    "test" { Test-ServiceConfiguration }
    "config" { Show-Configuration }
    "help" { Show-Help }
    default { 
        Write-Status "Unknown action: $Action" "Red"
        Write-Host ""
        Show-Help
    }
}