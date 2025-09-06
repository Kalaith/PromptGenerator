param(
    [int]$JobId = $null,
    [string]$ConfigFile = ".env"
)

# Load configuration
if (Test-Path $ConfigFile) {
    Get-Content $ConfigFile | ForEach-Object {
        if ($_ -match '^([^#=]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2])
        }
    }
}

$apiBase = $env:API_BASE_URL

if ($JobId) {
    # Check specific job
    $response = Invoke-RestMethod -Uri "$apiBase/images/queue" -Method GET
    $job = $response.data | Where-Object { $_.id -eq $JobId }
    
    if ($job) {
        Write-Host "Job Details for ID $JobId" -ForegroundColor Green
        Write-Host "=========================" -ForegroundColor Green
        Write-Host "Prompt ID: $($job.prompt_id)"
        Write-Host "Generator Type: $($job.generator_type)"
        Write-Host "Prompt Text: $($job.prompt_text)"
        Write-Host "Status: $($job.status ?? 'pending')"
        Write-Host "Attempts: $($job.attempts)/$($job.max_attempts)"
        Write-Host "Created: $($job.created_at)"
        if ($job.error_message) {
            Write-Host "Error: $($job.error_message)" -ForegroundColor Red
        }
        Write-Host "Parameters:"
        $job.parameters | ConvertTo-Json -Depth 3 | Write-Host
    } else {
        Write-Host "Job $JobId not found" -ForegroundColor Red
    }
} else {
    # Show all jobs with their status
    $response = Invoke-RestMethod -Uri "$apiBase/images/queue" -Method GET
    
    Write-Host "All Jobs in Queue:" -ForegroundColor Green
    Write-Host "==================" -ForegroundColor Green
    
    foreach ($job in $response.data) {
        $status = $job.status ?? "pending"
        $color = switch ($status) {
            "completed" { "Green" }
            "processing" { "Yellow" }
            "failed" { "Red" }
            default { "White" }
        }
        
        Write-Host "Job $($job.id): $status - $($job.generator_type) - $($job.prompt_text.Substring(0, [Math]::Min(50, $job.prompt_text.Length)))..." -ForegroundColor $color
        
        if ($job.error_message) {
            Write-Host "  Error: $($job.error_message)" -ForegroundColor Red
        }
    }
}