const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const handleAdminRoutes = require('./src/routes/adminRoutes');
const { getContentType } = require('./src/utils/mimeTypes');
const common = require('./src/utils/common');

const PORT = process.env.PORT || 3000;

// Tạo server
const server = http.createServer((req, res) => {
    // Parse URL
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    console.log(`Request received: ${req.method} ${pathname}`);
    
    // Route cho admin
    if (pathname.startsWith('/admin')) {
        handleAdminRoutes(req, res, () => {
            res.writeHead(404);
            res.end('Admin route not found');
        });
        return;
    }
    
    // Route cho chi tiết sản phẩm
    if (pathname.startsWith('/detail/')) {
        const detailPath = path.join(__dirname, 'src/public/detail.html');
        fs.readFile(detailPath, 'utf8', (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading detail page');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
        return;
    }
    
    // Static files trong thư mục public
    if (pathname === '/' || pathname === '/index.html') {
        const indexPath = path.join(__dirname, 'src/public/index.html');
        fs.readFile(indexPath, 'utf8', (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index page');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
        return;
    }
    
    // Phục vụ file tĩnh từ public và assets
    if (pathname.startsWith('/assets/')) {
        // Đầu tiên thử tìm trong thư mục src/assets
        let filePath = path.join(__dirname, 'src', pathname);
        
        // Kiểm tra xem file có tồn tại không
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // Nếu không tìm thấy file trong src/assets, thử tìm trong src/public/assets
                const publicFilePath = path.join(__dirname, 'src/public', pathname);
                serveStaticFile(publicFilePath, res);
            } else {
                // Nếu tìm thấy file trong src/assets, phục vụ file đó
                serveStaticFile(filePath, res);
            }
        });
        return;
    }
    
    // Phục vụ các file của thư mục utils
    if (pathname.startsWith('/utils/')) {
        const utilsPath = path.join(__dirname, 'src', pathname);
        serveStaticFile(utilsPath, res);
        return;
    }
    
    // API Routes
    if (pathname.startsWith('/api/')) {
        handleApiRoutes(req, res, pathname);
        return;
    }
    
    // 404 - Not Found cho các route khác
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
});

/**
 * Xử lý phục vụ file tĩnh
 */
function serveStaticFile(filePath, res) {
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // Xử lý trường hợp file hình ảnh cho combo
            if (filePath.includes('/images/bottle.jpg') || filePath.includes('/images/bands.jpg')) {
                const imageName = path.basename(filePath);
                const placeholderUrl = `https://via.placeholder.com/80x80?text=${
                    imageName === 'bottle.jpg' ? 'Binh+Nuoc' : 'Bang+Deo'
                }`;
                
                res.writeHead(302, { 'Location': placeholderUrl });
                res.end();
                return;
            }
            
            res.writeHead(404);
            res.end('File not found');
            return;
        }
        
        // Đọc và trả về file
        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading file');
                return;
            }
            
            // Xác định Content-Type
            const contentType = getContentType(filePath);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });
    });
}

/**
 * Xử lý các API routes
 */
function handleApiRoutes(req, res, pathname) {
    // API không tìm thấy
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'API route not found' }));
}

// Khởi động server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

// Xử lý lỗi khi server không khởi động được
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} đang được sử dụng bởi một ứng dụng khác`);
    } else {
        console.error('Server error:', err);
    }
}); 