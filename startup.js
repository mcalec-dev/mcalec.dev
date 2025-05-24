require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { applyHeadTags } = require('./src/utils/head.js');
const glob = require('glob');
const app = express();
const port = process.env.PORT || 8080;
app.use((req, res, next) => {
  if (req.path === '/') {
    return next();
  }
  if (req.path.length > 1 && req.path.endsWith('/')) {
    return res.redirect(301, req.path.slice(0, -1));
  }
  if (req.path === '/index.html' || req.path === '/index') {
    return res.redirect(301, '/');
  }
  if (req.path.endsWith('.html')) {
    return res.redirect(301, req.path.slice(0, -5));
  }
  if (req.path.endsWith('.htm')) {
    return res.redirect(301, req.path.slice(0, -4));
  }
  next();
});

app.use(async (req, res, next) => {
  try {
    let filePath;
    const cleanPath = req.path.replace(/^\/+|\/+$/g, '');
    const distDir = path.join(__dirname, 'dist');
    if (!cleanPath || cleanPath.endsWith('.html')) {
      if (!cleanPath) {
        filePath = path.join(distDir, 'index.html');
      } else {
        const basePath = path.join(distDir, cleanPath);
        const baseDir = path.join(distDir, cleanPath.split('/')[0]);
        if (!(await fileExists(baseDir))) {
          filePath = path.join(distDir, '404');
          res.status(404);
        }
        else if (await fileExists(basePath)) {
          filePath = basePath;
        } else if (await fileExists(basePath + '.html')) {
          filePath = basePath + '.html';
        } else if (await fileExists(path.join(distDir, cleanPath, 'index.html'))) {
          filePath = path.join(distDir, cleanPath, 'index.html');
        } else {
          filePath = path.join(distDir, '404.html');
          res.status(404);
        }
      }
      const content = await applyHeadTags(await fs.promises.readFile(filePath, 'utf8'));
      return res.send(content);
    }
    return express.static('public')(req, res, next);
  } catch (error) {
    const notFoundContent = await applyHeadTags(
      await fs.promises.readFile(path.join(__dirname, 'dist', '404.html'), 'utf8')
    );
    return res.status(404).send(notFoundContent);
  }
});

async function fileExists(filePath) {
  try {
    await fs.promises.access(filePath);
    return true;
  } catch {
    return false;
  }
}
function startupBanner(port) {
  const banner = `
    ███╗   ███╗ ██████╗ █████╗ ██╗     ███████╗ ██████╗
    ████╗ ████║██╔════╝██╔══██╗██║     ██╔════╝██╔════╝
    ██╔████╔██║██║     ███████║██║     █████╗  ██║     
    ██║╚██╔╝██║██║     ██╔══██║██║     ██╔══╝  ██║     
    ██║ ╚═╝ ██║╚██████╗██║  ██║███████╗███████╗╚██████╗
    ╚═╝     ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝ ╚═════╝
    
    🚀 Server is running!
    📡 Local:   http://127.0.0.1:${port}
    🌐 Network: http://${port}.mcalec.dev/
    
    Press Ctrl+C to stop the server
  `;
  console.log(banner);
}

async function compileHtmlToDist() {
  const publicDir = path.join(__dirname, 'public');
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  const htmlFiles = glob.sync('**/*.html', { cwd: publicDir });
  for (const relPath of htmlFiles) {
    const srcPath = path.join(publicDir, relPath);
    const destPath = path.join(distDir, relPath);
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    const raw = await fs.promises.readFile(srcPath, 'utf8');
    const compiled = await applyHeadTags(raw);
    await fs.promises.writeFile(destPath, compiled, 'utf8');
  }
}

// Compile HTML files on startup
compileHtmlToDist().then(() => {
  app.listen(port, () => { startupBanner(port); });
});