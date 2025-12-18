const fs = require('fs').promises;
const path = require('path');
async function loadConfig() {
  try {
    const configPath = path.join(__dirname, '..', '..', 'public', 'json', 'config.json');
    const configData = await fs.readFile(configPath, 'utf8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Error loading config:', error);
    return null;
  }
}
function generateHeadTags(config) {
  if (!config) return '';
  const metaTags = [
    `<meta charset="utf-8">`,
    `<meta name="viewport" content="width=device-width, initial-scale=1.0">`,
    `<meta name="title" content="${config.title}">`,
    `<meta name="description" content="${config.description}">`,
    `<meta name="author" content="${config.author}">`,
    `<meta name="keywords" content="${config.keywords.join(', ')}">`,
    `<meta name="theme-color" content="${config['theme-color']}" data-react-helmet="true">`,
    `<meta property="og:title" content="${config.title}">`,
    `<meta property="og:description" content="${config.description}">`,
    `<meta property="og:url" content="${config.url}">`,
  ];
  const linkTags = [
    `<link rel="stylesheet" type="text/css" href="/css/style.css">`,
    `<link rel="stylesheet" type="text/css" href="/css/loader.css">`,
    `<link rel="stylesheet" type="text/css" href="/css/music.css">`,
    `<link rel="stylesheet" type="text/css" href="/css/navbar.css">`,
    `<link rel="icon" type="image/png" href="/favicon.ico">`,
    `<link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico">`,
    `<link rel="icon" type="image/x-icon" sizes="32x32" href="/favicon.ico">`,
    `<link rel="icon" type="image/x-icon" sizes="16x16" href="/favicon.ico">`,
    `<link rel="shortcut icon" href="/favicon.ico">`,
    `<link rel="mask-icon" href="/favicon.ico" color="#000000">`
  ];
  const scriptTags = [
    `<script defer type="module" src="https://cdn.mcalec.dev/web/js/zero-md/zero-md.min.js"></script>`,
    `<script defer src="https://gc.zgo.at/count.js" data-goatcounter="https://mcalec.goatcounter.com/count"></script>`,
    `<script defer src="https://umami.mcalec.dev/script.js" data-website-id="6e7c1ae1-381f-46ca-a4de-183454ff3f20"></script>`,
  ];
  return [
    `<title>${config.title}</title>`,
    ...metaTags,
    ...linkTags,
    ...scriptTags
  ].join('\n  ');
}
async function applyHeadTags(htmlContent) {
  try {
    const config = await loadConfig();
    if (!config) return htmlContent;
    const headTags = generateHeadTags(config);
    const headRegex = /<head>[\s\S]*?<\/head>/i;
    const htmlRegex = /<html[^>]*>/i;
    if (headRegex.test(htmlContent)) {
      return htmlContent.replace(headRegex, `<head>\n  ${headTags}\n</head>`);
    } else if (htmlRegex.test(htmlContent)) {
      return htmlContent.replace(htmlRegex, `$&<head>\n  ${headTags}\n</head>`);
    }
    return `<html><head>\n  ${headTags}\n</head>${htmlContent}</html>`;
  } catch (error) {
    return htmlContent;
  }
}
module.exports = { applyHeadTags };