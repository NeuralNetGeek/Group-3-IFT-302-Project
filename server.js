const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const HOST = '0.0.0.0';
const PUBLIC_DIR = __dirname;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'font/otf'
};

const server = http.createServer((req, res) => {
  // Parse and sanitize the URL path
  let requestPath = req.url.split('?')[0]; // Remove query string
  if (requestPath === '/') {
    requestPath = '/Pages/index.html';
  }

  // Resolve the absolute path and ensure it's within the public directory
  const filePath = path.resolve(PUBLIC_DIR, '.' + requestPath);
  
  // Security check: ensure the resolved path is within PUBLIC_DIR
  // Use path.relative to check if the path escapes the public directory
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  const isPathSafe = relativePath && 
                     !relativePath.startsWith('..') && 
                     !path.isAbsolute(relativePath);
  
  if (!isPathSafe) {
    res.writeHead(403, { 
      'Content-Type': 'text/html',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end('<h1>403 - Forbidden</h1>', 'utf-8');
    return;
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 
          'Content-Type': 'text/html',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end('<h1>404 - File Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500, {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        });
        res.end('Server Error: ' + error.code, 'utf-8');
      }
    } else {
      let fileContent = content;
      
      if (extname === '.html') {
        let htmlContent = content.toString('utf-8');
        const envScript = `<script>window.ENV = { OPENWEATHER_API_KEY: "${process.env.OPENWEATHER_API_KEY || ''}" };</script>`;
        htmlContent = htmlContent.replace('</head>', `${envScript}\n</head>`);
        fileContent = Buffer.from(htmlContent, 'utf-8');
      }
      
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      res.end(fileContent, 'utf-8');
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
  console.log(`Open your browser to view the Weather Dashboard`);
});
