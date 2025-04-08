/**
 * Hàm trả về MIME type dựa trên phần mở rộng của file
 * @param {string} filePath - Đường dẫn đến file
 * @returns {string} MIME type tương ứng
 */
function getContentType(filePath) {
    const path = require('path');
    const ext = path.extname(filePath);
    
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
        '.webp': 'image/webp',
        '.txt': 'text/plain',
        '.pdf': 'application/pdf',
        '.zip': 'application/zip',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'font/otf',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.mp3': 'audio/mpeg',
        '.wav': 'audio/wav'
    };
    
    return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
}

module.exports = {
    getContentType
}; 