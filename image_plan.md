# Image Generation Service Implementation Plan
## Anime Prompt Generator - Image Service Integration

### 📋 Executive Summary

This plan outlines the implementation of a comprehensive image generation service for the Anime Prompt Generator application. The service will:

1. **Poll the backend** for prompt generation requests
2. **Generate images** using ComfyUI via PowerShell scripts
3. **Upload images to FTP** in organized galleries by type
4. **Update the database** with generated image metadata
5. **Provide frontend integration** for displaying generated images

### 🏗️ Current Infrastructure Analysis

#### **Existing Components**
- **Frontend**: React 19 + TypeScript with Zustand state management
- **Backend**: PHP 8.1 with Slim Framework and Eloquent ORM
- **Database**: MySQL with unified schema for prompts, species, and attributes
- **PowerShell Scripts**: 
  - `comfyui-generate.ps1` - Single image generation
  - `comfyui-batch.ps1` - Batch image generation with JSON support
  - `publish-ftp.ps1` - FTP upload functionality with comprehensive error handling

#### **Current Database Schema**
```sql
unified_species (id, name, type, category, features, personality, etc.)
description_templates (id, name, generator_type, template, is_active)
attributes (id, category, value, weight, is_active)
user_sessions (session_id, favorites, history, preferences)
```

---

## 🗄️ Database Schema Design

### **1. Image Queue Table**
```sql
CREATE TABLE image_generation_queue (
    id INT PRIMARY KEY AUTO_INCREMENT,
    prompt_id VARCHAR(36) NOT NULL UNIQUE,
    generator_type ENUM('anime', 'alien', 'race', 'monster', 'monsterGirl', 'animalGirl') NOT NULL,
    prompt_text TEXT NOT NULL,
    negative_prompt TEXT,
    
    -- Generation parameters
    width INT DEFAULT 1024,
    height INT DEFAULT 1024,
    steps INT DEFAULT 20,
    cfg_scale DECIMAL(3,1) DEFAULT 8.0,
    seed BIGINT DEFAULT -1,
    model VARCHAR(255) DEFAULT 'juggernautXL_v8Rundiffusion.safetensors',
    sampler VARCHAR(50) DEFAULT 'euler',
    scheduler VARCHAR(50) DEFAULT 'normal',
    
    -- Request metadata
    priority INT DEFAULT 0,
    requested_by VARCHAR(255),
    session_id VARCHAR(255),
    original_prompt_data JSON,
    
    -- Status tracking
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 3,
    
    -- Processing details
    processing_started_at TIMESTAMP NULL,
    processing_completed_at TIMESTAMP NULL,
    error_message TEXT NULL,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status_priority (status, priority DESC),
    INDEX idx_generator_type (generator_type),
    INDEX idx_created_at (created_at),
    INDEX idx_session_id (session_id)
);
```

### **2. Generated Images Table**
```sql
CREATE TABLE generated_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    queue_id INT NOT NULL,
    prompt_id VARCHAR(36) NOT NULL,
    
    -- Image details
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT,
    
    -- FTP/Gallery information
    ftp_path VARCHAR(500),
    gallery_type VARCHAR(50) NOT NULL,
    gallery_url VARCHAR(500),
    thumbnail_path VARCHAR(500),
    
    -- Image metadata
    width INT,
    height INT,
    format ENUM('png', 'jpg', 'webp') DEFAULT 'png',
    
    -- Generation parameters used
    generation_params JSON,
    
    -- Status and visibility
    is_active BOOLEAN DEFAULT TRUE,
    is_public BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- Analytics
    view_count INT DEFAULT 0,
    download_count INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (queue_id) REFERENCES image_generation_queue(id) ON DELETE CASCADE,
    INDEX idx_gallery_type (gallery_type),
    INDEX idx_prompt_id (prompt_id),
    INDEX idx_is_active (is_active),
    INDEX idx_is_public (is_public),
    INDEX idx_created_at (created_at DESC)
);
```

### **3. Image Collections/Albums**
```sql
CREATE TABLE image_collections (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    generator_type VARCHAR(50),
    
    -- Collection metadata
    is_public BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    cover_image_id INT NULL,
    
    -- User/session association
    created_by_session VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (cover_image_id) REFERENCES generated_images(id) ON SET NULL,
    INDEX idx_generator_type (generator_type),
    INDEX idx_is_public (is_public),
    INDEX idx_created_at (created_at DESC)
);

CREATE TABLE collection_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    collection_id INT NOT NULL,
    image_id INT NOT NULL,
    sort_order INT DEFAULT 0,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (collection_id) REFERENCES image_collections(id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES generated_images(id) ON DELETE CASCADE,
    UNIQUE KEY unique_collection_image (collection_id, image_id),
    INDEX idx_sort_order (collection_id, sort_order)
);
```

---

## 🚀 Backend API Endpoints

### **Queue Management Endpoints**

#### **POST /api/v1/images/generate**
```php
// Request new image generation
{
    "generator_type": "anime",
    "prompt_text": "A cute anime girl with cat ears",
    "negative_prompt": "blurry, low quality",
    "width": 1024,
    "height": 1024,
    "priority": 0,
    "session_id": "session_123"
}

// Response
{
    "success": true,
    "data": {
        "prompt_id": "uuid-here",
        "queue_position": 3,
        "estimated_completion": "2025-01-10T15:30:00Z"
    }
}
```

#### **GET /api/v1/images/queue**
```php
// Get pending queue for service worker
{
    "success": true,
    "data": [
        {
            "id": 1,
            "prompt_id": "uuid-here",
            "generator_type": "anime",
            "prompt_text": "...",
            "parameters": { /* generation params */ },
            "priority": 0,
            "created_at": "2025-01-10T15:00:00Z"
        }
    ]
}
```

#### **PUT /api/v1/images/queue/{id}/status**
```php
// Update queue item status
{
    "status": "processing", // or "completed", "failed"
    "error_message": null,
    "processing_details": {}
}
```

### **Image Management Endpoints**

#### **POST /api/v1/images/{queue_id}/complete**
```php
// Mark image generation as complete
{
    "filename": "anime_catgirl_1024x1024_20250110.png",
    "file_path": "/gallery/anime/anime_catgirl_1024x1024_20250110.png",
    "ftp_path": "/public_html/gallery/anime/",
    "file_size_bytes": 2048576,
    "width": 1024,
    "height": 1024,
    "generation_params": { /* used parameters */ }
}
```

#### **GET /api/v1/images**
```php
// List generated images with filtering
// Query params: type, limit, offset, session_id, public_only
{
    "success": true,
    "data": {
        "images": [...],
        "pagination": {
            "current_page": 1,
            "total_pages": 10,
            "total_items": 95
        }
    }
}
```

#### **GET /api/v1/images/{id}**
```php
// Get single image details
{
    "success": true,
    "data": {
        "id": 1,
        "filename": "anime_catgirl_1024x1024_20250110.png",
        "gallery_url": "https://example.com/gallery/anime/anime_catgirl_1024x1024_20250110.png",
        "gallery_type": "anime",
        "width": 1024,
        "height": 1024,
        "view_count": 25,
        "created_at": "2025-01-10T15:30:00Z"
    }
}
```

---

## 🛠️ Service Architecture

### **PowerShell Image Generation Service**

#### **New Script: `image-service-worker.ps1`**
```powershell
# Main service worker script
param(
    [Parameter(Mandatory=$false)]
    [int]$PollIntervalSeconds = 30,
    
    [Parameter(Mandatory=$false)]
    [int]$MaxConcurrentJobs = 2,
    
    [Parameter(Mandatory=$false)]
    [string]$ConfigFile = ".env",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun,
    
    [Parameter(Mandatory=$false)]
    [switch]$Daemon
)

# Service workflow:
# 1. Poll API for pending queue items
# 2. Process images using existing comfyui-batch.ps1
# 3. Upload to FTP using existing publish-ftp.ps1 functions
# 4. Update database with results
# 5. Handle errors and retry logic
```

#### **Enhanced Integration Script: `process-image-queue.ps1`**
```powershell
# Enhanced version that integrates:
# - Queue polling from backend API
# - Batch image generation using existing comfyui-batch.ps1
# - FTP upload using existing publish-ftp.ps1 functions
# - Database updates via API calls
# - Comprehensive logging and error handling

# Key Features:
# - Concurrent processing with job limits
# - Retry logic for failed generations
# - Progress tracking and status updates
# - Gallery organization (anime/, alien/, race/, etc.)
# - Thumbnail generation for web display
# - Cleanup of temporary files
```

### **Service Installation & Configuration**

#### **Windows Service Setup**
```powershell
# Install as Windows Service
New-Service -Name "AnimePromptImageService" `
    -BinaryPathName "powershell.exe -ExecutionPolicy Bypass -File C:\path\to\image-service-worker.ps1 -Daemon" `
    -DisplayName "Anime Prompt Image Generation Service" `
    -Description "Processes image generation queue for Anime Prompt Generator" `
    -StartupType Automatic

# Service management
Start-Service -Name "AnimePromptImageService"
Stop-Service -Name "AnimePromptImageService"
```

#### **Configuration File: `.env.service`**
```env
# Service Configuration
SERVICE_POLL_INTERVAL=30
SERVICE_MAX_CONCURRENT_JOBS=2
SERVICE_RETRY_ATTEMPTS=3
SERVICE_LOG_LEVEL=INFO

# ComfyUI Configuration
COMFYUI_SERVER=127.0.0.1:8188
COMFYUI_MODELS_PATH=C:\ComfyUI\models\checkpoints
COMFYUI_OUTPUT_PATH=C:\ComfyUI\output

# Backend API Configuration
API_BASE_URL=http://localhost:8080/api/v1
API_TIMEOUT_SECONDS=30

# FTP/Gallery Configuration
GALLERY_ROOT_PATH=/gallery
GALLERY_TYPES=anime,alien,race,monster,monsterGirl,animalGirl
THUMBNAIL_SIZE=320x320
GENERATE_THUMBNAILS=true

# Storage Configuration
TEMP_IMAGE_PATH=C:\temp\anime_images
LOCAL_BACKUP_PATH=C:\backup\generated_images
CLEANUP_TEMP_FILES=true
```

---

## 🎨 Frontend Integration

### **New Components & Features**

#### **1. Image Gallery Component**
```typescript
// frontend/src/components/gallery/ImageGallery.tsx
interface ImageGalleryProps {
    type: 'anime' | 'alien' | 'race' | 'all';
    sessionId?: string;
    showUserOnly?: boolean;
    enableUpload?: boolean;
}

// Features:
// - Grid layout with lazy loading
// - Filter by generator type
// - Search functionality
// - Lightbox for full-size viewing
// - Download links
// - User favorites
```

#### **2. Generation Queue Status**
```typescript
// frontend/src/components/generation/QueueStatus.tsx
interface QueueStatusProps {
    sessionId: string;
    showGlobalQueue?: boolean;
}

// Features:
// - Real-time queue position updates
// - Estimated completion times
// - Cancel pending requests
// - Progress indicators
// - Error notifications
```

#### **3. Image Request Form**
```typescript
// Enhanced prompt generation forms with image request option
interface ImageRequestOptions {
    generateImage: boolean;
    priority: number;
    customSize?: { width: number; height: number };
    model?: string;
}
```

### **State Management Updates**

#### **New Zustand Store: `imageStore.ts`**
```typescript
interface ImageState {
    generatedImages: GeneratedImage[];
    queueItems: QueueItem[];
    collections: Collection[];
    currentImage: GeneratedImage | null;
    
    // Actions
    addToQueue: (request: ImageGenerationRequest) => Promise<void>;
    updateQueueStatus: (promptId: string, status: QueueStatus) => void;
    addGeneratedImage: (image: GeneratedImage) => void;
    createCollection: (name: string, imageIds: number[]) => Promise<void>;
    
    // Gallery management
    loadGallery: (type: string, page: number) => Promise<void>;
    searchImages: (query: string) => Promise<void>;
    toggleFavorite: (imageId: number) => Promise<void>;
}
```

### **New API Services**

#### **Image API Service: `imageApi.ts`**
```typescript
export class ImageApi {
    // Queue management
    static async requestGeneration(request: ImageGenerationRequest): Promise<QueueResponse>;
    static async getQueueStatus(sessionId: string): Promise<QueueStatus[]>;
    static async cancelGeneration(promptId: string): Promise<boolean>;
    
    // Image management
    static async getImages(filters: ImageFilters): Promise<ImageListResponse>;
    static async getImage(id: number): Promise<GeneratedImage>;
    static async downloadImage(id: number): Promise<Blob>;
    
    // Collections
    static async getCollections(): Promise<Collection[]>;
    static async createCollection(data: CreateCollectionRequest): Promise<Collection>;
    static async addToCollection(collectionId: number, imageId: number): Promise<boolean>;
}
```

### **URL Structure & Routing**

```typescript
// New routes to add to App.tsx
const routes = [
    { path: '/gallery', component: ImageGalleryPage },
    { path: '/gallery/:type', component: TypedGalleryPage },
    { path: '/gallery/:type/:id', component: ImageDetailPage },
    { path: '/collections', component: CollectionsPage },
    { path: '/queue', component: QueueStatusPage },
    // Enhanced generator pages with image generation
    { path: '/generate/:type', component: EnhancedGeneratorPage },
];
```

---

## 📁 File Structure Changes

### **New Directories**
```
service/
├── image-service-worker.ps1          # Main service daemon
├── process-image-queue.ps1            # Queue processing logic
├── image-ftp-uploader.ps1             # FTP upload integration
├── install-service.ps1                # Service installation script
├── .env.service                       # Service configuration
└── logs/                              # Service logs

backend/
├── src/
│   ├── Controllers/
│   │   ├── ImageQueueController.php   # Queue management
│   │   └── ImageController.php        # Image CRUD operations
│   ├── Models/
│   │   ├── ImageGenerationQueue.php
│   │   ├── GeneratedImage.php
│   │   └── ImageCollection.php
│   ├── Services/
│   │   ├── ImageQueueService.php
│   │   └── ImageProcessingService.php
│   └── Actions/
│       ├── QueueImageGenerationAction.php
│       └── CompleteImageGenerationAction.php
└── database/
    └── migrations/
        ├── create_image_generation_queue_table.sql
        ├── create_generated_images_table.sql
        └── create_image_collections_table.sql

frontend/
├── src/
│   ├── components/
│   │   ├── gallery/
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── ImageCard.tsx
│   │   │   ├── ImageLightbox.tsx
│   │   │   └── GalleryFilters.tsx
│   │   ├── generation/
│   │   │   ├── QueueStatus.tsx
│   │   │   ├── ImageRequestForm.tsx
│   │   │   └── ProgressIndicator.tsx
│   │   └── collections/
│   │       ├── CollectionManager.tsx
│   │       └── CollectionCard.tsx
│   ├── stores/
│   │   └── imageStore.ts
│   ├── api/
│   │   └── imageApi.ts
│   └── types/
│       └── image.ts
└── public/
    └── gallery/                       # FTP synced gallery images
        ├── anime/
        ├── alien/
        ├── race/
        ├── monster/
        ├── monsterGirl/
        └── animalGirl/
```

---

## ⚙️ Implementation Phases

### **Phase 1: Database & Backend API (Week 1)**
1. ✅ Create database migration scripts
2. ✅ Implement backend models (Queue, Image, Collection)
3. ✅ Create API controllers and endpoints
4. ✅ Add validation and error handling
5. ✅ Write unit tests for API endpoints

### **Phase 2: Service Development (Week 2)**
1. ✅ Create image-service-worker.ps1 main script
2. ✅ Integrate existing ComfyUI and FTP scripts
3. ✅ Implement queue polling and processing logic
4. ✅ Add comprehensive error handling and retry logic
5. ✅ Create Windows Service installation scripts
6. ✅ Add logging and monitoring capabilities

### **Phase 3: Frontend Integration (Week 3)**
1. ✅ Create image store and API services
2. ✅ Build gallery components with filtering/search
3. ✅ Implement queue status and progress tracking
4. ✅ Add image request forms to existing generators
5. ✅ Create collections and favorites functionality
6. ✅ Add responsive design for mobile devices

### **Phase 4: Testing & Deployment (Week 4)**
1. ✅ End-to-end testing of complete workflow
2. ✅ Performance testing with concurrent requests
3. ✅ Security audit of file upload/access
4. ✅ Documentation and deployment guides
5. ✅ Production deployment and monitoring setup

---

## 🔧 Technical Considerations

### **Security**
- **File Upload Validation**: Strict validation of generated file types
- **Access Control**: Session-based access to user-generated images
- **Rate Limiting**: Prevent queue spam with per-session limits
- **FTP Security**: Secure FTP connections with proper credentials
- **Path Sanitization**: Prevent directory traversal attacks

### **Performance**
- **Concurrent Processing**: Multiple ComfyUI instances for parallel generation
- **Image Optimization**: Automatic thumbnail generation and compression
- **Caching Strategy**: CDN for static gallery images
- **Database Indexing**: Optimized queries for image search/filtering
- **Queue Management**: Priority-based processing with fair queuing

### **Scalability**
- **Horizontal Scaling**: Multiple service workers on different machines
- **Load Balancing**: Distribute queue processing across instances
- **Storage Scaling**: Separate storage for different image types
- **API Rate Limiting**: Prevent system overload
- **Monitoring**: Real-time queue and performance metrics

### **Reliability**
- **Fault Tolerance**: Automatic retry for failed generations
- **Health Monitoring**: Service health checks and automatic restart
- **Backup Strategy**: Regular backup of generated images
- **Graceful Degradation**: Fallback modes when services are unavailable
- **Logging**: Comprehensive logging for debugging and auditing

---

## 📊 Expected Outcomes

### **User Experience Improvements**
- **Visual Results**: Users can see generated images from their prompts
- **Gallery Browsing**: Explore generated images by type/category
- **Collections**: Organize favorite images into custom collections
- **Progress Tracking**: Real-time updates on generation status
- **Mobile Support**: Responsive gallery for mobile devices

### **Technical Benefits**
- **Automated Workflow**: Seamless prompt-to-image pipeline
- **Organized Storage**: Structured gallery organization by type
- **Scalable Architecture**: Ready for increased user load
- **Monitoring**: Comprehensive logging and performance metrics
- **Integration**: Leverages existing ComfyUI and FTP infrastructure

### **Future Enhancements**
- **AI Model Options**: User-selectable AI models for different styles
- **Batch Generation**: Generate multiple variations from single prompt
- **Social Features**: Public galleries and image sharing
- **API Extensions**: Third-party integrations and webhooks
- **Advanced Filtering**: Search by visual similarity or tags

---

## 🚦 Getting Started

### **Prerequisites**
1. **ComfyUI Installation**: Running instance with REST API enabled
2. **FTP Server Access**: Configured FTP server for gallery uploads  
3. **Database Setup**: MySQL with existing anime_prompt_gen schema
4. **PowerShell 5.1+**: For service worker scripts
5. **Node.js & PHP**: Existing development environment

### **Quick Start Commands**
```bash
# 1. Run database migrations
mysql -u username -p anime_prompt_gen < backend/database/migrations/create_image_generation_queue_table.sql

# 2. Install backend dependencies  
cd backend && composer install

# 3. Install frontend dependencies
cd frontend && npm install

# 4. Configure service environment
cp service/.env.service.example service/.env.service
# Edit service/.env.service with your configuration

# 5. Install and start the service
powershell -ExecutionPolicy Bypass .\service\install-service.ps1

# 6. Test the integration
curl -X POST http://localhost:8080/api/v1/images/generate \
  -H "Content-Type: application/json" \
  -d '{"generator_type":"anime","prompt_text":"test prompt"}'
```

This implementation plan provides a comprehensive roadmap for adding image generation capabilities to the existing Anime Prompt Generator application, leveraging the current infrastructure while adding robust new features for users.