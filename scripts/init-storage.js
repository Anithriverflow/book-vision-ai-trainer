const fs = require('fs');
const path = require('path');

// Storage directories
const STORAGE_DIR = path.join(process.cwd(), 'data');
const UPLOADS_DIR = path.join(STORAGE_DIR, 'uploads');
const GENERATED_DIR = path.join(STORAGE_DIR, 'generated');

// Initialize storage directories
function initializeStorage() {
  try {
    [STORAGE_DIR, UPLOADS_DIR, GENERATED_DIR].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    });
    
    // Create .gitkeep files to ensure directories are tracked
    [UPLOADS_DIR, GENERATED_DIR].forEach(dir => {
      const gitkeepPath = path.join(dir, '.gitkeep');
      if (!fs.existsSync(gitkeepPath)) {
        fs.writeFileSync(gitkeepPath, '');
        console.log(`Created .gitkeep in: ${dir}`);
      }
    });
    
    console.log('Storage initialization completed successfully!');
  } catch (error) {
    console.error('Failed to initialize storage:', error);
  }
}

// Run initialization if this script is executed directly
if (require.main === module) {
  initializeStorage();
}

module.exports = { initializeStorage }; 