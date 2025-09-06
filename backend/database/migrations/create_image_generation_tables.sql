-- Image Generation System Migration
-- Creates tables for image generation queue, generated images, and collections
-- Run this migration after the unified_species migration

-- Step 1: Create image generation queue table
CREATE TABLE IF NOT EXISTS image_generation_queue (
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
    INDEX idx_session_id (session_id),
    INDEX idx_status (status)
);

-- Step 2: Create generated images table
CREATE TABLE IF NOT EXISTS generated_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    queue_id INT NULL,
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
    
    FOREIGN KEY (queue_id) REFERENCES image_generation_queue(id) ON DELETE SET NULL,
    INDEX idx_gallery_type (gallery_type),
    INDEX idx_prompt_id (prompt_id),
    INDEX idx_is_active (is_active),
    INDEX idx_is_public (is_public),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_view_count (view_count DESC),
    UNIQUE INDEX unique_filename_gallery (filename, gallery_type)
);

-- Step 3: Create image collections table
CREATE TABLE IF NOT EXISTS image_collections (
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
    
    FOREIGN KEY (cover_image_id) REFERENCES generated_images(id) ON DELETE SET NULL,
    INDEX idx_generator_type (generator_type),
    INDEX idx_is_public (is_public),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_session (created_by_session)
);

-- Step 4: Create collection images junction table
CREATE TABLE IF NOT EXISTS collection_images (
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

-- Step 5: Create image generation stats table for monitoring
CREATE TABLE IF NOT EXISTS image_generation_stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    date_recorded DATE NOT NULL,
    generator_type VARCHAR(50),
    
    -- Daily statistics
    total_queued INT DEFAULT 0,
    total_completed INT DEFAULT 0,
    total_failed INT DEFAULT 0,
    total_cancelled INT DEFAULT 0,
    
    -- Performance metrics
    avg_processing_time_seconds INT DEFAULT 0,
    min_processing_time_seconds INT DEFAULT 0,
    max_processing_time_seconds INT DEFAULT 0,
    
    -- Storage metrics
    total_file_size_mb DECIMAL(10,2) DEFAULT 0,
    avg_file_size_mb DECIMAL(8,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_date_type (date_recorded, generator_type),
    INDEX idx_date (date_recorded DESC)
);

-- Step 6: Insert default collections
INSERT IGNORE INTO image_collections (name, description, generator_type, is_public, is_featured, created_by_session) VALUES
('Featured Anime Characters', 'Best anime character generations', 'anime', TRUE, TRUE, 'system'),
('Amazing Aliens', 'Top alien species creations', 'alien', TRUE, TRUE, 'system'),
('Epic Adventurers', 'Legendary fantasy characters', 'race', TRUE, TRUE, 'system'),
('Cute Monster Girls', 'Adorable monster girl collection', 'monsterGirl', TRUE, TRUE, 'system'),
('Fierce Monsters', 'Powerful monster designs', 'monster', TRUE, TRUE, 'system'),
('Kawaii Kemonomimi', 'Cute animal-eared characters', 'animalGirl', TRUE, TRUE, 'system');

-- Migration completed successfully
SELECT 'Image generation system migration completed' as status,
       NOW() as completed_at;