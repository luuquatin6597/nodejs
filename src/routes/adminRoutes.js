const fs = require('fs');
const path = require('path');

/**
 * Xử lý các routes liên quan đến admin
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
function handleAdminRoutes(req, res, next) {
    const url = req.url;
    
    if (url === '/admin') {
        // Serve admin page
        const adminPath = path.join(__dirname, '../public/admin.html');
        
        fs.readFile(adminPath, 'utf8', (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading admin page');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
        return;
    }
    
    // Phục vụ các file tĩnh từ public directory
    if (url.startsWith('/assets/')) {
        const filePath = path.join(__dirname, '../public', url);
        
        // Kiểm tra nếu file tồn tại
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // Nếu file không tồn tại, tạo file ảnh mẫu cho combo sản phẩm
                if (url === '/assets/images/bottle.jpg' || url === '/assets/images/bands.jpg') {
                    const placeholderImageUrl = 'https://via.placeholder.com/80x80?text=' + 
                        (url === '/assets/images/bottle.jpg' ? 'Binh+Nuoc' : 'Bang+Deo');
                    
                    res.writeHead(302, { 'Location': placeholderImageUrl });
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
                
                // Xác định MIME type
                const ext = path.extname(filePath);
                let contentType = 'text/plain';
                
                switch (ext) {
                    case '.html':
                        contentType = 'text/html';
                        break;
                    case '.css':
                        contentType = 'text/css';
                        break;
                    case '.js':
                        contentType = 'text/javascript';
                        break;
                    case '.json':
                        contentType = 'application/json';
                        break;
                    case '.jpg':
                    case '.jpeg':
                        contentType = 'image/jpeg';
                        break;
                    case '.png':
                        contentType = 'image/png';
                        break;
                    case '.gif':
                        contentType = 'image/gif';
                        break;
                }
                
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
            });
        });
        return;
    }
    
    // Nếu không phải route admin, chuyển sang middleware tiếp theo
    next();
}

module.exports = handleAdminRoutes; 