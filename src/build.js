const fs = require('fs').promises;
const path = require('path');
const glob = require('glob');
const { applyHeadTags } = require('./utils/head.js');
async function buildWebsite() {
  try {
    await fs.mkdir(path.join(process.cwd(), 'dist'), { recursive: true });
    const files = await glob.sync('public/**/*', {
      nodir: true,
      cwd: process.cwd()
    });
    for (const file of files) {
      const srcPath = path.join(process.cwd(), file);
      const destPath = path.join(process.cwd(), 'dist', file.replace('public/', ''));
      await fs.mkdir(path.dirname(destPath), { recursive: true });
      if (file.endsWith('.html')) {
        const htmlContent = await fs.readFile(srcPath, 'utf-8');
        const processedHtml = await applyHeadTags(htmlContent);
        await fs.writeFile(destPath, processedHtml);
      } else {
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
buildWebsite();
exports = {
  buildWebsite
};