document.addEventListener('DOMContentLoaded', () => {
    // Form validation
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Price input formatting
    const priceInput = document.getElementById('price');
    if (priceInput) {
        priceInput.addEventListener('blur', () => {
            if (priceInput.value) {
                const formattedPrice = formatCurrency(priceInput.value);
                // Show formatted price in a span next to the input
                let priceDisplay = document.getElementById('price-display');
                if (!priceDisplay) {
                    priceDisplay = document.createElement('span');
                    priceDisplay.id = 'price-display';
                    priceDisplay.className = 'ms-2 text-muted';
                    priceInput.parentNode.appendChild(priceDisplay);
                }
                priceDisplay.textContent = `Formatted: ${formattedPrice}`;
            }
        });
    }
}); 