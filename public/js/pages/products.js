document.addEventListener('DOMContentLoaded', () => {
    // Format all price cells
    const priceCells = document.querySelectorAll('.price-cell');
    priceCells.forEach(cell => {
        const price = parseFloat(cell.textContent.replace('$', ''));
        cell.textContent = formatCurrency(price);
    });
}); 