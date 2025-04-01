export function formatCurrency(value) {
    return new Intl.NumberFormat('vi', {
        style: 'currency',
        currency: 'VND',
    }).format(value);
}