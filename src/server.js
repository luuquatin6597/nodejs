import http from "http";
import fs from "fs";
import path from "path";
import { getMimeType } from "./utils/mimeTypes.js";
import { handleAdminRoutes } from "./routes/adminRoutes.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const hostname = "localhost";
const port = 3000;

// Các đường dẫn thư mục
const PUBLIC_DIR = path.join(__dirname, "public");
const ASSETS_DIR = path.join(__dirname, "assets");
const UTILS_DIR = path.join(__dirname, "utils");

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    console.log(`Request: ${req.method} ${pathname}`);

    // Xử lý root path
    if (pathname === "/") {
        return serveFile(res, path.join(PUBLIC_DIR, "index.html"), "text/html");
    }

    // Xử lý các route đặc biệt
    if (pathname === "/admin") {
        return handleAdminRoutes(req, res, "admin.html");
    }

    // Xử lý route detail product
    if (pathname.startsWith("/detail/")) {
        const productId = pathname.split("/")[2];
        return serveProductDetail(res, productId);
    }

    // Xử lý route product (legacy)
    if (pathname.startsWith("/product/")) {
        const productId = parsedUrl.searchParams.get("id");
        if (!productId) {
            return sendError(res, 400, "Thiếu id sản phẩm");
        }
        return serveProductDetail(res, productId);
    }

    // Xử lý utils - cho phép truy cập vào thư mục utils
    if (pathname.startsWith("/utils/")) {
        const utilsPath = path.join(UTILS_DIR, pathname.replace("/utils", ""));
        if (fs.existsSync(utilsPath)) {
            const ext = path.extname(utilsPath);
            return serveFile(res, utilsPath, getMimeType(ext));
        }
        return sendError(res, 404, "Utils file không tồn tại");
    }

    // Xử lý assets - ưu tiên từ thư mục assets
    if (pathname.startsWith("/assets/")) {
        const assetPath = path.join(ASSETS_DIR, pathname.replace("/assets", ""));
        if (fs.existsSync(assetPath)) {
            const ext = path.extname(assetPath);
            return serveFile(res, assetPath, getMimeType(ext));
        }
        
        // Fallback tới thư mục public/assets nếu không tìm thấy trong assets
        const publicAssetPath = path.join(PUBLIC_DIR, pathname);
        if (fs.existsSync(publicAssetPath)) {
            const ext = path.extname(publicAssetPath);
            return serveFile(res, publicAssetPath, getMimeType(ext));
        }

        return sendError(res, 404, "Asset không tồn tại");
    }

    // Xử lý file trong public
    const publicPath = path.join(PUBLIC_DIR, pathname);
    if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
        const ext = path.extname(publicPath);
        return serveFile(res, publicPath, getMimeType(ext));
    }

    // Nếu không tìm thấy file, trả về 404
    return sendError(res, 404, "Không tìm thấy trang");
});

/**
 * Serve file detail.html với product ID
 */
function serveProductDetail(res, productId) {
    const detailPath = path.join(PUBLIC_DIR, "detail.html");
    fs.readFile(detailPath, "utf8", (err, data) => {
        if (err) {
            return sendError(res, 404, "Không tìm thấy trang chi tiết sản phẩm");
        }
        const updatedData = data.replace("{{productId}}", productId);
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(updatedData);
    });
}

/**
 * Serve file với content type
 */
function serveFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(`Lỗi đọc file: ${filePath}`, err);
            return sendError(res, 404, "Không tìm thấy tài nguyên");
        }
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
    });
}

/**
 * Trả về lỗi HTTP
 */
function sendError(res, statusCode, message) {
    res.writeHead(statusCode);
    res.end(message);
}

server.listen(port, hostname, () => {
    console.log(`Server đang chạy tại http://${hostname}:${port}`);
});
