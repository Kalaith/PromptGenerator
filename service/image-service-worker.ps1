# Anime Prompt Generator - Image Service Worker
# Polls the backend API for image generation requests and processes them using ComfyUI
# Integrates with existing comfyui-generate.ps1 and FTP upload functionality

param(
    [Parameter(Mandatory=$false)]
    [string]$ConfigFile = ".env",
    
    [Parameter(Mandatory=$false)]
    [int]$PollIntervalSeconds = 30,
    
    [Parameter(Mandatory=$false)]
    [int]$MaxConcurrentJobs = 2,
    
    [Parameter(Mandatory=$false)]
    [switch]$DaemonMode,
    
    [Parameter(Mandatory=$false)]
    [switch]$TestMode,
    
    [Parameter(Mandatory=$false)]
    [switch]$ImportOnly,
    
    [Parameter(Mandatory=$false)]
    [switch]$VerboseOutput
)

# Service Configuration
$SERVICE_NAME = "AnimePromptGen-ImageWorker"
$SCRIPT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path
$LOG_FILE = Join-Path $SCRIPT_ROOT "logs\service.log"
$PID_FILE = Join-Path $SCRIPT_ROOT "logs\service.pid"

# Ensure logs directory exists
$logsDir = Join-Path $SCRIPT_ROOT "logs"
if (-not (Test-Path $logsDir)) {
    New-Item -ItemType Directory -Path $logsDir -Force | Out-Null
}

# Global variables for service state
$global:ServiceRunning = $false
$global:ActiveJobs = @{}
$global:JobCounter = 0

# Load configuration from .env file
function Load-Configuration {
    param([string]$ConfigPath = ".env")
    
    $fullConfigPath = Join-Path $SCRIPT_ROOT $ConfigPath
    if (-not (Test-Path $fullConfigPath)) {
        Write-Error "Configuration file not found: $fullConfigPath"
        exit 1
    }
    
    $config = @{}
    Get-Content $fullConfigPath | ForEach-Object {
        if ($_ -match "^(\w+)=(.*)$") {
            $key = $matches[1]
            $value = $matches[2].Trim('"')
            $config[$key] = $value
        }
    }
    
    # Validate required configuration
    $requiredKeys = @("API_BASE_URL", "COMFYUI_SERVER", "GALLERY_BASE_PATH", "FTP_SERVER", "FTP_USERNAME", "FTP_PASSWORD")
    $missingKeys = @()
    
    foreach ($key in $requiredKeys) {
        if (-not $config.ContainsKey($key) -or [string]::IsNullOrWhiteSpace($config[$key])) {
            $missingKeys += $key
        }
    }
    
    if ($missingKeys.Count -gt 0) {
        Write-Error "Missing required configuration keys: $($missingKeys -join ', ')"
        Write-Host @"
Add the following to your .env file:
API_BASE_URL=http://localhost/anime_prompt_gen/api/v1
COMFYUI_SERVER=127.0.0.1:8188
GALLERY_BASE_PATH=H:\gallery
FTP_SERVER=your.ftp.server.com
FTP_USERNAME=your_username
FTP_PASSWORD=your_password
FTP_PORT=21
FTP_REMOTE_ROOT=/gallery
"@ -ForegroundColor Yellow
        exit 1
    }
    
    return $config
}

# Logging functions
function Write-ServiceLog {
    param(
        [string]$Message,
        [ValidateSet("INFO", "WARNING", "ERROR", "DEBUG")]
        [string]$Level = "INFO",
        [switch]$ToConsole
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    
    # Write to log file
    try {
        Add-Content -Path $LOG_FILE -Value $logEntry -ErrorAction SilentlyContinue
    } catch {
        # Silently continue if log write fails
    }
    
    # Write to console if verbose or requested
    if ($ToConsole -or $VerboseOutput) {
        $color = switch ($Level) {
            "INFO" { "Cyan" }
            "WARNING" { "Yellow" }
            "ERROR" { "Red" }
            "DEBUG" { "Gray" }
            default { "White" }
        }
        Write-Host $logEntry -ForegroundColor $color
    }
}

function Write-ServiceInfo($message) { Write-ServiceLog -Message $message -Level "INFO" -ToConsole }
function Write-ServiceWarning($message) { Write-ServiceLog -Message $message -Level "WARNING" -ToConsole }
function Write-ServiceError($message) { Write-ServiceLog -Message $message -Level "ERROR" -ToConsole }
function Write-ServiceDebug($message) { Write-ServiceLog -Message $message -Level "DEBUG" }

# API Helper Functions
function Invoke-ApiRequest {
    param(
        [string]$Endpoint,
        [string]$Method = "GET",
        [hashtable]$Body = @{},
        [hashtable]$Headers = @{"Content-Type" = "application/json"}
    )
    
    try {
        $uri = "$($global:Config.API_BASE_URL)$Endpoint"
        Write-ServiceDebug "API Request: $Method $uri"
        
        $params = @{
            Uri = $uri
            Method = $Method
            Headers = $Headers
            TimeoutSec = 30
        }
        
        if ($Method -eq "POST" -or $Method -eq "PUT") {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params
        Write-ServiceDebug "API Response: Success"
        return $response
        
    } catch {
        Write-ServiceError "API request failed: $($_.Exception.Message)"
        return $null
    }
}

function Get-PendingJobs {
    Write-ServiceDebug "Checking for pending image generation jobs..."
    $response = Invoke-ApiRequest -Endpoint "/images/queue?limit=$MaxConcurrentJobs&status=pending"
    
    if ($response -and $response.success) {
        Write-ServiceDebug "Found $($response.data.Count) pending jobs"
        return $response.data
    }
    
    return @()
}

function Update-JobStatus {
    param(
        [int]$QueueId,
        [string]$Status,
        [string]$ErrorMessage = $null
    )
    
    $body = @{ status = $Status }
    if ($ErrorMessage) {
        $body.error_message = $ErrorMessage
    }
    
    $response = Invoke-ApiRequest -Endpoint "/images/queue/$QueueId/status" -Method "PUT" -Body $body
    
    if ($response -and $response.success) {
        Write-ServiceInfo "Updated job $QueueId status to: $Status"
        return $true
    } else {
        Write-ServiceError "Failed to update job $QueueId status"
        return $false
    }
}

function Complete-ImageGeneration {
    param(
        [int]$QueueId,
        [hashtable]$ImageData
    )
    
    $response = Invoke-ApiRequest -Endpoint "/images/$QueueId/complete" -Method "POST" -Body $ImageData
    
    if ($response -and $response.success) {
        Write-ServiceInfo "Successfully completed image generation for job $QueueId"
        return $response.data
    } else {
        Write-ServiceError "Failed to complete image generation for job $QueueId"
        return $null
    }
}

# Image Generation Functions
function Generate-Image {
    param(
        [PSCustomObject]$Job
    )
    
    Write-ServiceInfo "Starting image generation for job $($Job.id): $($Job.generator_type)"
    
    try {
        # Update job status to processing
        if (-not (Update-JobStatus -QueueId $Job.id -Status "processing")) {
            return $false
        }
        
        # Prepare output paths
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $filename = "img_$($Job.generator_type)_$($Job.id)_$timestamp.png"
        $tempOutputPath = Join-Path $env:TEMP $filename
        
        # Extract generation parameters
        $params = $Job.parameters
        $prompt = $params.prompt
        $negativePrompt = $params.negative_prompt
        $width = $params.width
        $height = $params.height
        $steps = $params.steps
        $cfgScale = $params.cfg_scale
        $seed = $params.seed
        $model = $params.model
        $sampler = $params.sampler
        $scheduler = $params.scheduler
        
        Write-ServiceInfo "Generating: ${width}x${height}, Steps: $steps, CFG: $cfgScale, Model: $model"
        
        # Call ComfyUI generation script
        $comfyUIScript = Join-Path $SCRIPT_ROOT "comfyui-generate.ps1"
        $comfyUIArgs = @(
            "-Prompt", "`"$prompt`""
            "-NegativePrompt", "`"$negativePrompt`""
            "-Width", $width
            "-Height", $height
            "-Steps", $steps
            "-CFG", $cfgScale
            "-Seed", $seed
            "-Model", "`"$model`""
            "-Sampler", "`"$sampler`""
            "-Scheduler", "`"$scheduler`""
            "-OutputPath", "`"$tempOutputPath`""
            "-ComfyUIServer", $global:Config.COMFYUI_SERVER
        )
        
        Write-ServiceDebug "Executing: $comfyUIScript $($comfyUIArgs -join ' ')"
        
        # Execute ComfyUI generation
        $process = Start-Process -FilePath "powershell.exe" -ArgumentList "-ExecutionPolicy", "Bypass", "-File", $comfyUIScript, $comfyUIArgs -Wait -PassThru -NoNewWindow
        
        if ($process.ExitCode -ne 0) {
            Write-ServiceError "ComfyUI generation failed with exit code: $($process.ExitCode)"
            Update-JobStatus -QueueId $Job.id -Status "failed" -ErrorMessage "Image generation failed"
            return $false
        }
        
        # Verify output file exists
        if (-not (Test-Path $tempOutputPath)) {
            Write-ServiceError "Generated image not found: $tempOutputPath"
            Update-JobStatus -QueueId $Job.id -Status "failed" -ErrorMessage "Generated image file not found"
            return $false
        }
        
        # Store image and upload to FTP
        $uploadResult = Store-ImageAndUpload -LocalPath $tempOutputPath -Filename $filename -GalleryType $Job.generator_type -QueueId $Job.id
        
        if ($uploadResult) {
            # Complete the job with image data
            $imageData = @{
                filename = $filename
                original_filename = $filename
                file_path = $uploadResult.local_path
                file_size_bytes = $uploadResult.file_size
                ftp_path = $uploadResult.ftp_path
                gallery_url = $uploadResult.gallery_url
                width = $width
                height = $height
                generation_params = $params
            }
            
            $completionResult = Complete-ImageGeneration -QueueId $Job.id -ImageData $imageData
            
            if ($completionResult) {
                Write-ServiceInfo "Job $($Job.id) completed successfully"
                
                # Clean up temp file
                Remove-Item $tempOutputPath -Force -ErrorAction SilentlyContinue
                
                return $true
            }
        }
        
        # If we get here, something failed
        Update-JobStatus -QueueId $Job.id -Status "failed" -ErrorMessage "Failed to upload or complete image"
        return $false
        
    } catch {
        Write-ServiceError "Image generation error for job $($Job.id): $($_.Exception.Message)"
        Update-JobStatus -QueueId $Job.id -Status "failed" -ErrorMessage $_.Exception.Message
        return $false
    }
}

function Store-ImageAndUpload {
    param(
        [string]$LocalPath,
        [string]$Filename,
        [string]$GalleryType,
        [int]$QueueId
    )
    
    try {
        Write-ServiceInfo "Storing image locally and uploading to FTP: $GalleryType/$Filename"
        
        # Create gallery type directory in F:\WebHatchery\gallery
        $galleryTypePath = Join-Path $global:Config.GALLERY_BASE_PATH $GalleryType
        if (-not (Test-Path $galleryTypePath)) {
            New-Item -ItemType Directory -Path $galleryTypePath -Force | Out-Null
            Write-ServiceInfo "Created gallery directory: $galleryTypePath"
        }
        
        # Copy to local storage
        $localStoragePath = Join-Path $galleryTypePath $Filename
        Copy-Item $LocalPath $localStoragePath -Force
        
        # Get file size
        $fileInfo = Get-Item $localStoragePath
        $fileSize = $fileInfo.Length
        
        Write-ServiceInfo "Image stored locally: $localStoragePath ($fileSize bytes)"
        
        # Upload to FTP
        $ftpResult = Upload-ToFTP -LocalPath $localStoragePath -RemotePath "/$GalleryType/$Filename"
        
        if ($ftpResult) {
            # Construct gallery URL  
            $galleryUrl = "$($global:Config.GALLERY_BASE_URL)/$GalleryType/$Filename"
            
            $result = @{
                local_path = $localStoragePath
                file_size = $fileSize
                ftp_path = $ftpResult.ftp_path
                gallery_url = $galleryUrl
            }
            
            Write-ServiceInfo "Image stored and uploaded successfully"
            return $result
        }
        
        Write-ServiceError "FTP upload failed, but image is stored locally at: $localStoragePath"
        return $null
        
    } catch {
        Write-ServiceError "Failed to store and upload image: $($_.Exception.Message)"
        return $null
    }
}

function Upload-ToFTP {
    param(
        [string]$LocalPath,
        [string]$RemotePath
    )
    
    try {
        Write-ServiceInfo "Uploading to FTP: $RemotePath"
        
        # FTP Configuration
        $ftpConfig = @{
            Server = $global:Config.FTP_SERVER
            Username = $global:Config.FTP_USERNAME
            Password = $global:Config.FTP_PASSWORD
            Port = if ($global:Config.FTP_PORT) { [int]$global:Config.FTP_PORT } else { 21 }
            RemoteRoot = if ($global:Config.FTP_REMOTE_ROOT) { $global:Config.FTP_REMOTE_ROOT } else { "/" }
            UseSSL = ($global:Config.FTP_USE_SSL -eq "true")
            PassiveMode = ($global:Config.FTP_PASSIVE_MODE -ne "false")
        }
        
        # Upload image
        $fullRemotePath = "$($ftpConfig.RemoteRoot)$RemotePath".Replace('//', '/')
        $uploadSuccess = Upload-FileToFTP -LocalPath $LocalPath -RemotePath $fullRemotePath -Config $ftpConfig -CreateDirectories
        
        if (-not $uploadSuccess) {
            Write-ServiceError "Failed to upload image to FTP"
            return $null
        }
        
        Write-ServiceInfo "FTP upload completed successfully"
        return @{ ftp_path = $fullRemotePath }
        
    } catch {
        Write-ServiceError "FTP upload failed: $($_.Exception.Message)"
        return $null
    }
}

# FTP Helper Functions (adapted from existing publish-ftp.ps1)
function Upload-FileToFTP {
    param(
        [string]$LocalPath,
        [string]$RemotePath,
        [hashtable]$Config,
        [switch]$CreateDirectories
    )
    
    try {
        # Create remote directories if needed
        if ($CreateDirectories) {
            $remoteDir = Split-Path $RemotePath -Parent
            if ($remoteDir -and $remoteDir -ne "/" -and $remoteDir -ne ".") {
                Create-FTPDirectory -RemotePath $remoteDir -Config $Config
            }
        }
        
        $uri = "ftp://$($Config.Server):$($Config.Port)$RemotePath"
        $ftp = [System.Net.FtpWebRequest]::Create($uri)
        $ftp.Credentials = New-Object System.Net.NetworkCredential($Config.Username, $Config.Password)
        $ftp.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $ftp.UseBinary = $true
        $ftp.UsePassive = $Config.PassiveMode
        $ftp.EnableSsl = $Config.UseSSL
        
        $fileContent = [System.IO.File]::ReadAllBytes($LocalPath)
        $ftp.ContentLength = $fileContent.Length
        
        $requestStream = $ftp.GetRequestStream()
        $requestStream.Write($fileContent, 0, $fileContent.Length)
        $requestStream.Close()
        
        $response = $ftp.GetResponse()
        $response.Close()
        
        Write-ServiceDebug "Uploaded: $RemotePath"
        return $true
    }
    catch {
        Write-ServiceError "FTP upload failed for $RemotePath`: $($_.Exception.Message)"
        return $false
    }
}

function Create-FTPDirectory {
    param(
        [string]$RemotePath,
        [hashtable]$Config
    )
    
    $pathParts = $RemotePath.TrimStart('/').Split('/') | Where-Object { $_ -ne '' }
    $currentPath = ""
    
    foreach ($part in $pathParts) {
        $currentPath += "/$part"
        
        try {
            $uri = "ftp://$($Config.Server):$($Config.Port)$currentPath"
            $ftp = [System.Net.FtpWebRequest]::Create($uri)
            $ftp.Credentials = New-Object System.Net.NetworkCredential($Config.Username, $Config.Password)
            $ftp.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
            $ftp.UsePassive = $Config.PassiveMode
            $ftp.EnableSsl = $Config.UseSSL
            
            $response = $ftp.GetResponse()
            $response.Close()
            
            Write-ServiceDebug "Created FTP directory: $currentPath"
        }
        catch {
            # Directory might already exist, which is OK
            if (-not $_.Exception.Message.Contains("550")) {
                Write-ServiceDebug "FTP directory note for $currentPath`: $($_.Exception.Message)"
            }
        }
    }
}

# Job Processing Functions
function Process-PendingJobs {
    try {
        $pendingJobs = Get-PendingJobs
        
        if ($pendingJobs.Count -eq 0) {
            Write-ServiceDebug "No pending jobs found"
            return
        }
        
        Write-ServiceInfo "Found $($pendingJobs.Count) pending job(s)"
        
        foreach ($job in $pendingJobs) {
            # Check if we've reached max concurrent jobs
            if ($global:ActiveJobs.Count -ge $MaxConcurrentJobs) {
                Write-ServiceInfo "Max concurrent jobs ($MaxConcurrentJobs) reached, queuing remaining jobs"
                break
            }
            
            # Start job processing
            Start-JobProcessing -Job $job
        }
        
        # Clean up completed jobs
        Cleanup-CompletedJobs
        
    } catch {
        Write-ServiceError "Error processing pending jobs: $($_.Exception.Message)"
    }
}

function Start-JobProcessing {
    param([PSCustomObject]$Job)
    
    try {
        $jobId = ++$global:JobCounter
        Write-ServiceInfo "Starting job processing: Job ID $jobId, Queue ID $($Job.id)"
        
        # Create job runspace
        $runspace = [PowerShell]::Create()
        $runspace.AddScript({
            param($Job, $Config, $ScriptRoot)
            
            # Set configuration environment variables in the runspace
            foreach ($key in $Config.Keys) {
                [Environment]::SetEnvironmentVariable($key, $Config[$key])
            }
            
            # Create global config object in runspace from passed config hashtable
            $global:Config = New-Object PSObject
            foreach ($key in $Config.Keys) {
                $global:Config | Add-Member -MemberType NoteProperty -Name $key -Value $Config[$key]
            }
            
            # Set script root and change to service directory
            $env:SCRIPT_ROOT = $ScriptRoot
            Set-Location -Path $ScriptRoot
            
            # Source the functions we need (without re-initializing the service)
            . "$ScriptRoot/image-service-worker.ps1" -ImportOnly
            
            return Generate-Image -Job $Job
        })
        # Convert config to a simple hashtable for passing to runspace
        $configHash = @{}
        foreach ($key in $global:Config.PSObject.Properties.Name) {
            $configHash[$key] = $global:Config.$key
        }
        
        $runspace.AddArgument($Job)
        $runspace.AddArgument($configHash)
        $runspace.AddArgument($SCRIPT_ROOT)
        
        # Start async execution
        $asyncResult = $runspace.BeginInvoke()
        
        # Store job info
        $global:ActiveJobs[$jobId] = @{
            QueueId = $Job.id
            Runspace = $runspace
            AsyncResult = $asyncResult
            StartTime = Get-Date
        }
        
        Write-ServiceInfo "Job $jobId started asynchronously"
        
    } catch {
        Write-ServiceError "Failed to start job processing: $($_.Exception.Message)"
    }
}

function Cleanup-CompletedJobs {
    $completedJobs = @()
    
    foreach ($jobId in $global:ActiveJobs.Keys) {
        $jobInfo = $global:ActiveJobs[$jobId]
        
        if ($jobInfo.AsyncResult.IsCompleted) {
            $completedJobs += $jobId
            
            try {
                $result = $jobInfo.Runspace.EndInvoke($jobInfo.AsyncResult)
                $duration = (Get-Date) - $jobInfo.StartTime
                
                # Check for errors in the runspace
                $errors = $jobInfo.Runspace.Streams.Error
                if ($errors.Count -gt 0) {
                    Write-ServiceError "Job $jobId (Queue ID: $($jobInfo.QueueId)) completed with $($errors.Count) error(s):"
                    foreach ($error in $errors) {
                        Write-ServiceError "  - $($error.Exception.Message)"
                        if ($VerboseOutput) {
                            Write-ServiceDebug "    Full error: $($error.ToString())"
                        }
                    }
                } elseif ($result) {
                    Write-ServiceInfo "Job $jobId completed successfully (Queue ID: $($jobInfo.QueueId)) - Duration: $([math]::Round($duration.TotalMinutes, 1)) minutes"
                } else {
                    Write-ServiceWarning "Job $jobId completed with no result (Queue ID: $($jobInfo.QueueId)) - Duration: $([math]::Round($duration.TotalMinutes, 1)) minutes"
                }
            } catch {
                Write-ServiceError "Error completing job $jobId`: $($_.Exception.Message)"
            } finally {
                $jobInfo.Runspace.Dispose()
            }
        }
    }
    
    # Remove completed jobs
    foreach ($jobId in $completedJobs) {
        $global:ActiveJobs.Remove($jobId)
    }
    
    if ($completedJobs.Count -gt 0) {
        Write-ServiceInfo "Cleaned up $($completedJobs.Count) completed job(s). Active jobs: $($global:ActiveJobs.Count)"
    }
}

# Service Control Functions
function Start-Service {
    Write-ServiceInfo "Starting $SERVICE_NAME..."
    
    # Store PID
    $process = Get-Process -Id $PID
    $process.Id | Out-File -FilePath $PID_FILE -Force
    
    $global:ServiceRunning = $true
    
    Write-ServiceInfo "$SERVICE_NAME started successfully (PID: $PID)"
    Write-ServiceInfo "Polling interval: $PollIntervalSeconds seconds"
    Write-ServiceInfo "Max concurrent jobs: $MaxConcurrentJobs"
    
    # Service loop
    while ($global:ServiceRunning) {
        try {
            Process-PendingJobs
            
            if (-not $TestMode) {
                Start-Sleep -Seconds $PollIntervalSeconds
            } else {
                Write-ServiceInfo "Test mode: Exiting after one iteration"
                break
            }
        } catch {
            Write-ServiceError "Service loop error: $($_.Exception.Message)"
            Start-Sleep -Seconds 10  # Short sleep before retrying
        }
    }
    
    Write-ServiceInfo "$SERVICE_NAME stopped"
}

function Stop-Service {
    Write-ServiceInfo "Stopping $SERVICE_NAME..."
    $global:ServiceRunning = $false
    
    # Wait for active jobs to complete (with timeout)
    $timeout = 300  # 5 minutes
    $elapsed = 0
    
    while ($global:ActiveJobs.Count -gt 0 -and $elapsed -lt $timeout) {
        Write-ServiceInfo "Waiting for $($global:ActiveJobs.Count) active job(s) to complete..."
        Cleanup-CompletedJobs
        Start-Sleep -Seconds 10
        $elapsed += 10
    }
    
    # Force cleanup remaining jobs
    foreach ($jobInfo in $global:ActiveJobs.Values) {
        if ($jobInfo.Runspace) {
            $jobInfo.Runspace.Dispose()
        }
    }
    
    $global:ActiveJobs.Clear()
    
    # Remove PID file
    if (Test-Path $PID_FILE) {
        Remove-Item $PID_FILE -Force
    }
}

function Test-ServiceConfiguration {
    Write-ServiceInfo "Testing service configuration..."
    
    # Create gallery directory if it doesn't exist
    $galleryPath = $global:Config.GALLERY_BASE_PATH
    if (-not (Test-Path $galleryPath)) {
        Write-ServiceInfo "Creating gallery directory: $galleryPath"
        try {
            New-Item -Path $galleryPath -ItemType Directory -Force | Out-Null
            Write-ServiceInfo "Gallery directory created successfully"
        } catch {
            Write-ServiceError "Failed to create gallery directory: $($_.Exception.Message)"
            return $false
        }
    } else {
        Write-ServiceInfo "Gallery directory exists: $galleryPath"
    }
    
    # Test API connection
    Write-ServiceInfo "Testing API connection..."
    $apiTest = Invoke-ApiRequest -Endpoint "/images/stats"
    if (-not $apiTest) {
        Write-ServiceError "API connection test failed"
        return $false
    }
    Write-ServiceInfo "API connection: OK"
    
    # Test ComfyUI connection
    Write-ServiceInfo "Testing ComfyUI connection..."
    try {
        $comfyUITest = Invoke-WebRequest -Uri "http://$($global:Config.COMFYUI_SERVER)/" -Method Get -TimeoutSec 10
        if ($comfyUITest.StatusCode -eq 200) {
            Write-ServiceInfo "ComfyUI connection: OK"
        } else {
            Write-ServiceError "ComfyUI returned unexpected status: $($comfyUITest.StatusCode)"
            return $false
        }
    } catch {
        Write-ServiceError "ComfyUI connection failed: $($_.Exception.Message)"
        return $false
    }
    
    # Test FTP connection
    Write-ServiceInfo "Testing FTP connection..."
    $ftpConfig = @{
        Server = $global:Config.FTP_SERVER
        Username = $global:Config.FTP_USERNAME
        Password = $global:Config.FTP_PASSWORD
        Port = if ($global:Config.FTP_PORT) { [int]$global:Config.FTP_PORT } else { 21 }
        UseSSL = ($global:Config.FTP_USE_SSL -eq "true")
        PassiveMode = ($global:Config.FTP_PASSIVE_MODE -ne "false")
    }
    
    try {
        $ftp = [System.Net.FtpWebRequest]::Create("ftp://$($ftpConfig.Server):$($ftpConfig.Port)/")
        $ftp.Credentials = New-Object System.Net.NetworkCredential($ftpConfig.Username, $ftpConfig.Password)
        $ftp.Method = [System.Net.WebRequestMethods+Ftp]::ListDirectory
        $ftp.UseBinary = $true
        $ftp.UsePassive = $ftpConfig.PassiveMode
        $ftp.EnableSsl = $ftpConfig.UseSSL
        $ftp.Timeout = 10000
        
        $response = $ftp.GetResponse()
        $response.Close()
        
        Write-ServiceInfo "FTP connection: OK"
    } catch {
        Write-ServiceError "FTP connection failed: $($_.Exception.Message)"
        return $false
    }
    
    # Test gallery directory
    Write-ServiceInfo "Testing gallery directory..."
    if (-not (Test-Path $global:Config.GALLERY_BASE_PATH)) {
        try {
            New-Item -ItemType Directory -Path $global:Config.GALLERY_BASE_PATH -Force | Out-Null
            Write-ServiceInfo "Created gallery directory: $($global:Config.GALLERY_BASE_PATH)"
        } catch {
            Write-ServiceError "Cannot create gallery directory: $($_.Exception.Message)"
            return $false
        }
    }
    Write-ServiceInfo "Gallery directory: OK"
    
    Write-ServiceInfo "Configuration test completed successfully"
    return $true
}

# Signal handlers
$global:ExitRequested = $false

# Handle Ctrl+C gracefully (when supported)
try {
    [Console]::CancelKeyPress += {
        param($sender, $e)
        $e.Cancel = $true
        Write-ServiceInfo "Exit requested by user..."
        $global:ServiceRunning = $false
        $global:ExitRequested = $true
    }
} catch {
    Write-ServiceDebug "Console.CancelKeyPress event handler not available in this context"
}

# Main Execution
function Main {
    Write-Host @"
========================================
  Anime Prompt Generator - Image Service Worker
========================================
"@ -ForegroundColor Cyan

    # Load configuration
    try {
        $global:Config = Load-Configuration -ConfigPath $ConfigFile
        Write-ServiceInfo "Configuration loaded successfully"
    } catch {
        Write-ServiceError "Failed to load configuration: $($_.Exception.Message)"
        exit 1
    }
    
    # Test configuration
    if (-not (Test-ServiceConfiguration)) {
        Write-ServiceError "Configuration test failed. Please check your settings."
        exit 1
    }
    
    if ($TestMode) {
        Write-ServiceInfo "Test mode enabled - will exit after processing once"
    }
    
    # Register cleanup handler
    Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
        Stop-Service
    }
    
    try {
        Start-Service
    } catch {
        Write-ServiceError "Service failed: $($_.Exception.Message)"
        exit 1
    } finally {
        Stop-Service
    }
    
    Write-ServiceInfo "Service shutdown complete"
}

# Run main function if script is executed directly and not just importing functions
if (-not $ImportOnly -and $MyInvocation.MyCommand.Path -like "*image-service-worker.ps1") {
    Main
}