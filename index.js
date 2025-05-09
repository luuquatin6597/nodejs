const mysql = require('mysql2');

// Tạo kết nối
const connection = mysql.createConnection({
  host: 'localhost', // Địa chỉ host của database
  user: 'root',      // Tên người dùng
  password: '', // Mật khẩu
  database: 'sequelize' // Tên database
});

// Kết nối đến database
connection.connect((err) => {
  if (err) {
    console.error('Kết nối thất bại: ', err.message);
    return;
  }
  console.log('Kết nối thành công đến cơ sở dữ liệu!');
});

// Xuất kết nối để sử dụng ở nơi khác
module.exports = connection;