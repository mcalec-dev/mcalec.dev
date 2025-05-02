require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const { applyHeadTags } = require('./util/head.js');
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
  next();
});

app.use(async (req, res, next) => {
  try {
    let filePath;
    const cleanPath = req.path.replace(/^\/+|\/+$/g, '');
    if (!cleanPath || cleanPath.endsWith('.html')) {
      if (!cleanPath) {
        filePath = path.join(__dirname, 'public', 'index.html');
      } else {
        const basePath = path.join(__dirname, 'public', cleanPath);
        const baseDir = path.join(__dirname, 'public', cleanPath.split('/')[0]);
        if (!(await fileExists(baseDir))) {
          filePath = path.join(__dirname, 'public', '404.html');
          res.status(404);
        }
        else if (await fileExists(basePath)) {
          filePath = basePath;
        } else if (await fileExists(basePath + '.html')) {
          filePath = basePath + '.html';
        } else if (await fileExists(path.join(__dirname, 'public', cleanPath, 'index.html'))) {
          filePath = path.join(__dirname, 'public', cleanPath, 'index.html');
        } else {
          filePath = path.join(__dirname, 'public', '404.html');
          res.status(404);
        }
      }
      const content = await applyHeadTags(await fs.promises.readFile(filePath, 'utf8'));
      return res.send(content);
    }
    return express.static('public')(req, res, next);
  } catch (error) {
    const notFoundContent = await applyHeadTags(
      await fs.promises.readFile(path.join(__dirname, 'public', '404.html'), 'utf8')
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
app.listen(port, () => { startupBanner(port); });