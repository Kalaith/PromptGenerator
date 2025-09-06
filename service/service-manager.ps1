# Anime Prompt Generator - Service Manager
# Utility script for managing the image service worker

param(
    [Parameter(Mandatory=$true, Position=0)]
    [ValidateSet("start", "stop", "restart", "status", "logs", "test", "config")]
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
        Write-Status "✓ Config file exists: $CONFIG_FILE" "Green"
    } else {
        Write-Status "✗ Config file missing: $CONFIG_FILE" "Red"
        Write-Status "  Copy .env.example to .env and configure it" "Yellow"
    }
    
    # Check log file
    if (Test-Path $LOG_FILE) {
        $logInfo = Get-Item $LOG_FILE
        Write-Status "✓ Log file: $LOG_FILE ($($logInfo.Length) bytes)" "Green"
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
        Write-Status "✗ Service script not found: $SERVICE_SCRIPT" "Red"
        return
    }
    Write-Status "✓ Service script found" "Green"
    
    if (-not (Test-Path $CONFIG_FILE)) {
        Write-Status "✗ Configuration file not found: $CONFIG_FILE" "Red"
        Write-Status "  Copy .env.example to .env and configure it" "Yellow"
        return
    }
    Write-Status "✓ Configuration file found" "Green"
    
    # Run the service in test mode
    Write-Status "`nRunning configuration test..." "Yellow"
    
    try {
        & $SERVICE_SCRIPT -ConfigFile ".env" -TestMode
        Write-Status "`n✓ Configuration test completed" "Green"
    } catch {
        Write-Status "`n✗ Configuration test failed: $($_.Exception.Message)" "Red"
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
    Write-Host @"
Anime Prompt Generator - Service Manager
========================================

Usage: .\service-manager.ps1 <action> [options]

ACTIONS:
  start     Start the image service
  stop      Stop the image service
  restart   Restart the image service
  status    Show service status and recent logs
  logs      Show service logs
  test      Test service configuration
  config    Show current configuration

OPTIONS:
  -ServiceName <name>   Service name (default: AnimePromptGen-ImageWorker)
  -Follow               Follow logs in real-time (with 'logs' action)
  -Lines <number>       Number of log lines to show (default: 20)

EXAMPLES:
  .\service-manager.ps1 start                # Start the service
  .\service-manager.ps1 status               # Show service status
  .\service-manager.ps1 logs -Follow         # Follow logs in real-time
  .\service-manager.ps1 logs -Lines 50       # Show last 50 log lines
  .\service-manager.ps1 test                 # Test configuration
  .\service-manager.ps1 config               # Show configuration

SERVICE MANAGEMENT:
  Install:     .\install-service.ps1
  Uninstall:   .\uninstall-service.ps1
  Manage:      .\service-manager.ps1

"@ -ForegroundColor White
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
        Show-Help
    }
}