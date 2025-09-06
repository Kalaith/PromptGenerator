# Anime Prompt Generator - Image Service Worker

The Image Service Worker is a Windows service that automatically processes image generation requests from the Anime Prompt Generator application. It polls the backend API for pending requests, generates images using ComfyUI, and uploads them to the gallery via FTP.

## Features

- **Automated Processing**: Continuously polls for pending image generation requests
- **ComfyUI Integration**: Uses existing ComfyUI scripts for image generation
- **FTP Upload**: Automatically uploads generated images to organized gallery folders
- **Concurrent Jobs**: Supports multiple concurrent image generations
- **Windows Service**: Runs as a background service with automatic startup
- **Comprehensive Logging**: Detailed logging for monitoring and debugging
- **Configuration Testing**: Built-in configuration validation

## Quick Start

### 1. Prerequisites

- **Windows 10/11 or Windows Server**
- **PowerShell 5.1+** (included with Windows)
- **ComfyUI** installed and running on specified server
- **FTP server** access for image uploads
- **Administrator privileges** for service installation

### 2. Configuration

1. Copy the example configuration:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Edit `.env` file with your settings:
   ```env
   # API Configuration
   API_BASE_URL=http://localhost/anime_prompt_gen/backend/api/v1
   
   # ComfyUI Configuration
   COMFYUI_SERVER=127.0.0.1:8188
   
   # Gallery Configuration
   GALLERY_BASE_PATH=H:\gallery
   GALLERY_BASE_URL=http://localhost/gallery
   
   # FTP Configuration
   FTP_SERVER=your.ftp.server.com
   FTP_USERNAME=your_username
   FTP_PASSWORD=your_password
   FTP_PORT=21
   FTP_REMOTE_ROOT=/gallery
   ```

### 3. Installation

**Run PowerShell as Administrator** and execute:

```powershell
# Install as Windows Service
.\install-service.ps1

# Test configuration
.\service-manager.ps1 test

# Start the service
.\service-manager.ps1 start
```

### 4. Management

Use the service manager for common operations:

```powershell
# Check service status
.\service-manager.ps1 status

# View logs
.\service-manager.ps1 logs

# Follow logs in real-time
.\service-manager.ps1 logs -Follow

# Restart service
.\service-manager.ps1 restart
```

## Configuration Reference

### Required Settings

| Setting | Description | Example |
|---------|-------------|---------|
| `API_BASE_URL` | Backend API endpoint | `http://localhost/anime_prompt_gen/backend/api/v1` |
| `COMFYUI_SERVER` | ComfyUI server address | `127.0.0.1:8188` |
| `GALLERY_BASE_PATH` | Local gallery directory | `H:\gallery` |
| `FTP_SERVER` | FTP server hostname | `ftp.example.com` |
| `FTP_USERNAME` | FTP username | `your_username` |
| `FTP_PASSWORD` | FTP password | `your_password` |

### Optional Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `GALLERY_BASE_URL` | - | Public URL for gallery access |
| `FTP_PORT` | `21` | FTP server port |
| `FTP_REMOTE_ROOT` | `/gallery` | Remote gallery directory |
| `FTP_USE_SSL` | `false` | Enable FTP over SSL |
| `FTP_PASSIVE_MODE` | `true` | Use passive FTP mode |

## Service Management

### Installation Scripts

- **`install-service.ps1`** - Install service with Administrator privileges
- **`uninstall-service.ps1`** - Remove service and optionally clean up files
- **`service-manager.ps1`** - Manage running service (start, stop, status, logs)

### Service Manager Actions

```powershell
# Service Control
.\service-manager.ps1 start      # Start service
.\service-manager.ps1 stop       # Stop service
.\service-manager.ps1 restart    # Restart service

# Monitoring
.\service-manager.ps1 status     # Show service status
.\service-manager.ps1 logs       # Show recent logs
.\service-manager.ps1 logs -Follow  # Follow logs in real-time

# Configuration
.\service-manager.ps1 test       # Test configuration
.\service-manager.ps1 config     # Show current configuration
```

### Windows Service Commands

You can also use standard Windows service commands:

```powershell
# Service control
Start-Service AnimePromptGen-ImageWorker
Stop-Service AnimePromptGen-ImageWorker
Restart-Service AnimePromptGen-ImageWorker

# Service status
Get-Service AnimePromptGen-ImageWorker

# Service configuration
Get-WmiObject -Query "SELECT * FROM Win32_Service WHERE Name='AnimePromptGen-ImageWorker'"
```

## Troubleshooting

### Common Issues

1. **Service won't start**
   - Check configuration with `.\service-manager.ps1 test`
   - Verify ComfyUI is running on specified server
   - Check logs with `.\service-manager.ps1 logs`

2. **Images not generating**
   - Verify ComfyUI connection: `http://127.0.0.1:8188`
   - Check ComfyUI models are available
   - Review service logs for generation errors

3. **FTP upload failures**
   - Test FTP credentials and server connectivity
   - Verify FTP directory permissions
   - Check firewall settings for FTP ports

4. **API connection issues**
   - Verify backend API is running and accessible
   - Check API_BASE_URL configuration
   - Ensure database is connected and accessible

### Log Files

Service logs are stored in `logs/service.log`:

```powershell
# View recent logs
Get-Content logs\service.log -Tail 50

# Follow logs in real-time
Get-Content logs\service.log -Tail 10 -Wait

# View logs with service manager
.\service-manager.ps1 logs -Lines 100 -Follow
```

### Configuration Testing

Run configuration tests to validate setup:

```powershell
# Test all connections and settings
.\service-manager.ps1 test

# Run service in test mode (single iteration)
.\image-service-worker.ps1 -TestMode -Verbose
```

## Architecture

### Service Flow

1. **Polling**: Service polls backend API every 30 seconds for pending jobs
2. **Processing**: Retrieves job parameters and calls ComfyUI generation
3. **Upload**: Generated images are uploaded to local gallery and FTP server
4. **Completion**: Job status is updated in database with image metadata

### File Structure

```
service/
├── image-service-worker.ps1    # Main service worker script
├── install-service.ps1         # Service installation script
├── uninstall-service.ps1       # Service removal script  
├── service-manager.ps1         # Service management utility
├── comfyui-generate.ps1        # ComfyUI generation script
├── publish-ftp.ps1             # FTP upload utilities
├── .env.example                # Example configuration
├── .env                        # Your configuration (create from example)
├── logs/                       # Service logs directory
│   └── service.log            # Main service log file
└── README.md                  # This file
```

### Dependencies

- **ComfyUI**: For image generation
- **PowerShell 5.1+**: For script execution
- **Windows Service Host**: For background service execution
- **FTP Server**: For image storage and delivery
- **Backend API**: For job queue management

## Performance Tuning

### Configuration Options

```env
# Polling frequency (seconds)
POLL_INTERVAL_SECONDS=30

# Maximum concurrent jobs
MAX_CONCURRENT_JOBS=2

# Log level (DEBUG, INFO, WARNING, ERROR)
LOG_LEVEL=INFO
```

### Recommendations

- **Concurrent Jobs**: Start with 2 concurrent jobs, increase based on hardware
- **Polling Interval**: 30 seconds balances responsiveness with server load
- **ComfyUI Resources**: Ensure adequate GPU memory for concurrent generations
- **FTP Connection**: Use passive mode for better firewall compatibility

## Security Considerations

- **Configuration File**: Keep `.env` file secure with appropriate permissions
- **FTP Credentials**: Use strong passwords and consider FTPS for encryption
- **Service Account**: Consider running service with dedicated service account
- **Network Access**: Restrict network access to required services only

## Support

For issues and questions:

1. Check service logs: `.\service-manager.ps1 logs`
2. Test configuration: `.\service-manager.ps1 test`
3. Review this documentation
4. Check Windows Event Viewer for service events