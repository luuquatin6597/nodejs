import fs from "fs";
import path from "path";

// Cách thay thế __dirname trong ES Modules
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Tách phần xử lý route admin
export const handleAdminRoutes = (req, res, fileName) => {
    const filePath = path.join(__dirname, "../public", fileName);

    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
            res.writeHead(500);
            res.end("Lỗi khi tải trang");
            return;
        }

        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    });
};

