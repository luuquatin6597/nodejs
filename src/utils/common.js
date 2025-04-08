/**
 * Các hàm tiện ích sử dụng chung cho toàn bộ ứng dụng
 */

/**
 * Format số tiền theo định dạng tiền tệ Việt Nam
 * @param {number} amount - Số tiền cần format
 * @returns {string} Chuỗi đã được format
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'decimal',
        maximumFractionDigits: 0
    }).format(amount) + '₫';
}

/**
 * Format ngày tháng theo định dạng Việt Nam
 * @param {string|Date} date - Ngày cần format
 * @returns {string} Chuỗi ngày đã được format
 */
function formatDate(date) {
    if (!date) return '';
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('vi-VN');
}

/**
 * Rút gọn chuỗi nếu dài hơn độ dài cho phép
 * @param {string} str - Chuỗi cần rút gọn
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} Chuỗi đã được rút gọn
 */
function truncateString(str, maxLength = 100) {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
}

/**
 * Generate URL thân thiện từ chuỗi
 * @param {string} str - Chuỗi đầu vào
 * @returns {string} Chuỗi URL thân thiện
 */
function generateSlug(str) {
    if (!str) return '';
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-');
} 