const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');
const { applyHeadTags } = require('./utils/head.js');

async function buildWebsite() {
  try {
    // Create dist directory if it doesn't exist
    await fs.mkdir(path.join(process.cwd(), 'dist'), { recursive: true });

    // Copy all static files from public to dist
    const files = await glob.sync('public/**/*', {
      nodir: true,
      cwd: process.cwd()
    });

    for (const file of files) {
      const srcPath = path.join(process.cwd(), file);
      const destPath = path.join(process.cwd(), 'dist', file.replace('public/', ''));
      
      // Create target directory if it doesn't exist
      await fs.mkdir(path.dirname(destPath), { recursive: true });
      
      // If it's an HTML file, process it with head tags
      if (file.endsWith('.html')) {
        const htmlContent = await fs.readFile(srcPath, 'utf-8');
        const processedHtml = await applyHeadTags(htmlContent);
        await fs.writeFile(destPath, processedHtml);
      } else {
        // Otherwise just copy the file
        await fs.copyFile(srcPath, destPath);
      }
    }

    console.log('🚀 Build completed successfully!');
    console.log('📁 Output directory: /dist');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run the build process
buildWebsite();