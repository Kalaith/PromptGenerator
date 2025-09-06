# Simple Anime Image Generator
# Checks API for pending jobs, generates with ComfyUI, uploads to FTP
# No service complexity - just a simple script to run once

param(
    [Parameter(Mandatory=$false)]
    [string]$ConfigFile = ".env",
    
    [Parameter(Mandatory=$false)]
    [int]$MaxJobs = 5,
    
    [Parameter(Mandatory=$false)]
    [switch]$VerboseOutput
)

$SCRIPT_ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path

# Load configuration from .env file
function Load-Configuration {
    param([string]$ConfigPath = ".env")
    
    $fullConfigPath = Join-Path $SCRIPT_ROOT $ConfigPath
    if (-not (Test-Path $fullConfigPath)) {
        Write-Error "Configuration file not found: $fullConfigPath"
        Write-Host "Copy .env.example to .env and configure your settings" -ForegroundColor Yellow
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
        Write-Host "Please add these to your .env file" -ForegroundColor Yellow
        exit 1
    }
    
    return $config
}

# Simple logging
function Write-Log {
    param([string]$Message, [string]$Level = "INFO")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    
    $color = switch ($Level) {
        "INFO" { "Cyan" }
        "WARNING" { "Yellow" }
        "ERROR" { "Red" }
        "SUCCESS" { "Green" }
        default { "White" }
    }
    Write-Host $logEntry -ForegroundColor $color
}

# API Helper Functions
function Get-PendingJobs {
    try {
        $uri = "$($global:Config.API_BASE_URL)/images/queue?limit=$MaxJobs&status=pending"
        Write-Log "Checking for pending jobs: $uri" "INFO"
        
        $response = Invoke-RestMethod -Uri $uri -Method GET -TimeoutSec 30
        
        if ($response -and $response.success) {
            Write-Log "Found $($response.data.Count) pending jobs" "INFO"
            return $response.data
        }
        
        Write-Log "No pending jobs or API error" "INFO"
        return @()
    } catch {
        Write-Log "Failed to get pending jobs: $($_.Exception.Message)" "ERROR"
        return @()
    }
}

function Update-JobStatus {
    param([int]$QueueId, [string]$Status, [string]$ErrorMessage = $null)
    
    try {
        $body = @{ status = $Status }
        if ($ErrorMessage) {
            $body.error_message = $ErrorMessage
        }
        
        $uri = "$($global:Config.API_BASE_URL)/images/queue/$QueueId/status"
        $response = Invoke-RestMethod -Uri $uri -Method PUT -Body ($body | ConvertTo-Json) -ContentType "application/json" -TimeoutSec 30
        
        if ($response -and $response.success) {
            Write-Log "Updated job $QueueId status to: $Status" "SUCCESS"
            return $true
        }
        
        Write-Log "Failed to update job $QueueId status" "ERROR"
        return $false
    } catch {
        Write-Log "API error updating job $QueueId`: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

function Complete-ImageGeneration {
    param([int]$QueueId, [hashtable]$ImageData)
    
    try {
        $uri = "$($global:Config.API_BASE_URL)/images/$QueueId/complete"
        $jsonData = ($ImageData | ConvertTo-Json -Depth 10)
        Write-Log "Sending completion data: $jsonData" "INFO"
        
        $response = Invoke-RestMethod -Uri $uri -Method POST -Body $jsonData -ContentType "application/json" -TimeoutSec 30
        
        if ($response -and $response.success) {
            Write-Log "Completed image generation for job $QueueId" "SUCCESS"
            return $true
        }
        
        Write-Log "Failed to complete image generation for job $QueueId" "ERROR"
        return $false
    } catch {
        Write-Log "API error completing job $QueueId`: $($_.Exception.Message)" "ERROR"
        return $false
    }
}

# Image Generation
function Generate-Image {
    param([PSCustomObject]$Job)
    
    Write-Log "Processing job $($Job.id): $($Job.generator_type)" "INFO"
    
    # Update status to processing
    if (-not (Update-JobStatus -QueueId $Job.id -Status "processing")) {
        return $false
    }
    
    try {
        # Prepare paths
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $filename = "img_$($Job.generator_type)_$($Job.id)_$timestamp.png"
        $tempOutputPath = Join-Path $env:TEMP $filename
        
        # Extract parameters
        $params = $Job.parameters
        
        Write-Log "Generating ${params.width}x${params.height}, Steps: $($params.steps), Model: $($params.model)" "INFO"
        
        # Call ComfyUI generation script
        $comfyUIScript = Join-Path $SCRIPT_ROOT "comfyui-generate.ps1"
        if (-not (Test-Path $comfyUIScript)) {
            Write-Log "ComfyUI script not found: $comfyUIScript" "ERROR"
            Update-JobStatus -QueueId $Job.id -Status "failed" -ErrorMessage "ComfyUI script not found"
            return $false
        }
        
        $comfyUIArgs = @(
            "-Prompt", "`"$($params.prompt)`""
            "-NegativePrompt", "`"$($params.negative_prompt)`""
            "-Width", $params.width
            "-Height", $params.height  
            "-Steps", $params.steps
            "-CFG", $params.cfg_scale
            "-Seed", $params.seed
            "-Model", "`"$($params.model)`""
            "-Sampler", "`"$($params.sampler)`""
            "-Scheduler", "`"$($params.scheduler)`""
            "-OutputPath", "`"$tempOutputPath`""
            "-ComfyUIServer", $global:Config.COMFYUI_SERVER
        )
        
        Write-Log "Executing ComfyUI generation..." "INFO"
        $allArgs = @("-ExecutionPolicy", "Bypass", "-File", $comfyUIScript) + $comfyUIArgs
        $process = Start-Process -FilePath "powershell.exe" -ArgumentList $allArgs -Wait -PassThru -NoNewWindow
        
        if ($process.ExitCode -ne 0) {
            Write-Log "ComfyUI generation failed with exit code: $($process.ExitCode)" "ERROR"
            Update-JobStatus -QueueId $Job.id -Status "failed" -ErrorMessage "Image generation failed"
            return $false
        }
        
        # Check output file
        if (-not (Test-Path $tempOutputPath)) {
            Write-Log "Generated image not found: $tempOutputPath" "ERROR"
            Update-JobStatus -QueueId $Job.id -Status "failed" -ErrorMessage "Generated image file not found"
            return $false
        }
        
        Write-Log "Image generated successfully: $filename" "SUCCESS"
        
        # Store locally and upload to FTP
        $uploadResult = Store-AndUpload -LocalPath $tempOutputPath -Filename $filename -GalleryType $Job.generator_type
        
        if ($uploadResult) {
            # Complete the job
            $imageData = @{
                filename = $filename
                original_filename = $filename
                file_path = $uploadResult.local_path
                file_size_bytes = $uploadResult.file_size
                ftp_path = $uploadResult.ftp_path
                gallery_url = $uploadResult.gallery_url
                width = $params.width
                height = $params.height
                generation_params = $params
            }
            
            if (Complete-ImageGeneration -QueueId $Job.id -ImageData $imageData) {
                Write-Log "Job $($Job.id) completed successfully!" "SUCCESS"
                
                # Clean up temp file
                Remove-Item $tempOutputPath -Force -ErrorAction SilentlyContinue
                return $true
            }
        }
        
        # If we get here, something failed
        Update-JobStatus -QueueId $Job.id -Status "failed" -ErrorMessage "Failed to upload or complete"
        return $false
        
    } catch {
        Write-Log "Error processing job $($Job.id): $($_.Exception.Message)" "ERROR"
        Update-JobStatus -QueueId $Job.id -Status "failed" -ErrorMessage $_.Exception.Message
        return $false
    }
}

# Storage and Upload
function Store-AndUpload {
    param([string]$LocalPath, [string]$Filename, [string]$GalleryType)
    
    try {
        Write-Log "Storing and uploading: $GalleryType/$Filename" "INFO"
        
        # Create gallery directory
        $galleryTypePath = Join-Path $global:Config.GALLERY_BASE_PATH $GalleryType
        if (-not (Test-Path $galleryTypePath)) {
            New-Item -ItemType Directory -Path $galleryTypePath -Force | Out-Null
            Write-Log "Created gallery directory: $galleryTypePath" "INFO"
        }
        
        # Copy to local storage
        $localStoragePath = Join-Path $galleryTypePath $Filename
        Copy-Item $LocalPath $localStoragePath -Force
        
        $fileInfo = Get-Item $localStoragePath
        Write-Log "Stored locally: $localStoragePath ($($fileInfo.Length) bytes)" "SUCCESS"
        
        # Upload to FTP
        $ftpResult = Upload-ToFTP -LocalPath $localStoragePath -RemotePath "/$GalleryType/$Filename"
        
        if ($ftpResult) {
            $galleryUrl = "$($global:Config.GALLERY_BASE_URL)/$GalleryType/$Filename"
            
            return @{
                local_path = $localStoragePath
                file_size = $fileInfo.Length
                ftp_path = $ftpResult.ftp_path
                gallery_url = $galleryUrl
            }
        }
        
        Write-Log "FTP upload failed, but image stored locally" "WARNING"
        return $null
        
    } catch {
        Write-Log "Storage/upload error: $($_.Exception.Message)" "ERROR"
        return $null
    }
}

function Upload-ToFTP {
    param([string]$LocalPath, [string]$RemotePath)
    
    try {
        Write-Log "Uploading to FTP: $RemotePath" "INFO"
        
        # FTP config
        $ftpPort = if ($global:Config.FTP_PORT) { [int]$global:Config.FTP_PORT } else { 21 }
        $useSSL = ($global:Config.FTP_USE_SSL -eq "true")
        $passiveMode = ($global:Config.FTP_PASSIVE_MODE -ne "false")
        $remoteRoot = if ($global:Config.FTP_REMOTE_ROOT) { $global:Config.FTP_REMOTE_ROOT } else { "/" }
        
        # Create directories if needed (normalize path separators)
        $remoteDir = Split-Path $RemotePath.Replace('\', '/') -Parent
        if ($remoteDir -and $remoteDir -ne "/" -and $remoteDir -ne ".") {
            Write-Log "Creating FTP directory: $remoteDir" "INFO"
            Create-FTPDirectories -RemoteDir $remoteDir -FtpPort $ftpPort -UseSSL $useSSL -PassiveMode $passiveMode
        }
        
        # Upload file
        $fullRemotePath = "$remoteRoot$RemotePath".Replace('//', '/')
        $uri = "ftp://$($global:Config.FTP_SERVER):$ftpPort$fullRemotePath"
        
        Write-Log "Full FTP URI: $uri" "INFO"
        
        $ftp = [System.Net.FtpWebRequest]::Create($uri)
        $ftp.Credentials = New-Object System.Net.NetworkCredential($global:Config.FTP_USERNAME, $global:Config.FTP_PASSWORD)
        $ftp.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
        $ftp.UseBinary = $true
        $ftp.UsePassive = $passiveMode
        $ftp.EnableSsl = $useSSL
        
        $fileContent = [System.IO.File]::ReadAllBytes($LocalPath)
        $ftp.ContentLength = $fileContent.Length
        
        $requestStream = $ftp.GetRequestStream()
        $requestStream.Write($fileContent, 0, $fileContent.Length)
        $requestStream.Close()
        
        $response = $ftp.GetResponse()
        $response.Close()
        
        Write-Log "FTP upload completed: $fullRemotePath" "SUCCESS"
        return @{ ftp_path = $fullRemotePath }
        
    } catch {
        Write-Log "FTP upload failed: $($_.Exception.Message)" "ERROR"
        return $null
    }
}

function Create-FTPDirectories {
    param([string]$RemoteDir, [int]$FtpPort, [bool]$UseSSL, [bool]$PassiveMode)
    
    # Normalize the path
    $RemoteDir = $RemoteDir.Replace('\', '/')
    Write-Log "Creating FTP directory structure for: $RemoteDir" "INFO"
    
    $pathParts = $RemoteDir.TrimStart('/').Split('/') | Where-Object { $_ -ne '' }
    $currentPath = ""
    
    foreach ($part in $pathParts) {
        $currentPath += "/$part"
        
        try {
            $uri = "ftp://$($global:Config.FTP_SERVER):$FtpPort$currentPath"
            $ftp = [System.Net.FtpWebRequest]::Create($uri)
            $ftp.Credentials = New-Object System.Net.NetworkCredential($global:Config.FTP_USERNAME, $global:Config.FTP_PASSWORD)
            $ftp.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
            $ftp.UsePassive = $PassiveMode
            $ftp.EnableSsl = $UseSSL
            $ftp.Timeout = 10000
            
            $response = $ftp.GetResponse()
            $response.Close()
            Write-Log "Created FTP directory: $currentPath" "SUCCESS"
        } catch {
            # Check if it's a "directory already exists" error (550)
            if ($_.Exception.Message.Contains("550")) {
                Write-Log "FTP directory already exists: $currentPath" "INFO"
            } else {
                Write-Log "FTP directory creation failed for $currentPath`: $($_.Exception.Message)" "WARNING"
            }
        }
    }
}

# Main execution
function Main {
    Write-Host @"
========================================
  Simple Anime Image Generator
========================================
"@ -ForegroundColor Cyan

    # Load configuration
    try {
        $global:Config = Load-Configuration -ConfigPath $ConfigFile
        Write-Log "Configuration loaded successfully" "SUCCESS"
    } catch {
        Write-Log "Failed to load configuration: $($_.Exception.Message)" "ERROR"
        exit 1
    }
    
    # Check for pending jobs
    $pendingJobs = Get-PendingJobs
    
    if ($pendingJobs.Count -eq 0) {
        Write-Log "No pending jobs found. Exiting." "INFO"
        return
    }
    
    Write-Log "Processing $($pendingJobs.Count) pending job(s)" "INFO"
    
    $successCount = 0
    $failedCount = 0
    
    foreach ($job in $pendingJobs) {
        $success = Generate-Image -Job $job
        if ($success) {
            $successCount++
        } else {
            $failedCount++
        }
    }
    
    Write-Log "Processing complete! Success: $successCount, Failed: $failedCount" "INFO"
    
    if ($successCount -gt 0) {
        Write-Log "Generated images should now be available in your gallery!" "SUCCESS"
    }
}

# Run the script
Main