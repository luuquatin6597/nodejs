$(document).ready(() => {
    try {
        const productId = window.location.pathname.split('/')[2];
        console.log('Product ID:', productId);
        
        if (!productId) {
            throw new Error('Không tìm thấy ID sản phẩm trong URL');
        }
        
        const productApiUrl = "https://67d9277200348dd3e2a9dd50.mockapi.io/products";
        const brandsApiUrl = "https://67d9277200348dd3e2a9dd50.mockapi.io/brands";
        
        // Lấy danh sách brands trước
        let brands = [];
        let currentProduct = null; // Lưu thông tin sản phẩm hiện tại
        
        // Sử dụng Promise.all để gọi đồng thời cả hai API
        Promise.all([
            fetch(`${productApiUrl}/${productId}`).then(response => {
                if (!response.ok) throw new Error('Không thể tải thông tin sản phẩm');
                return response.json();
            }),
            fetch(brandsApiUrl).then(response => {
                if (!response.ok) throw new Error('Không thể tải danh sách thương hiệu');
                return response.json();
            })
        ])
        .then(([product, brandsData]) => {
            console.log('Product data:', product);
            console.log('Brands data:', brandsData);
            
            // Lưu thông tin sản phẩm hiện tại
            currentProduct = product;
            
            // Lưu danh sách brands
            brands = brandsData;
            
            // Tìm thông tin brand của sản phẩm
            const brand = brands.find(brand => brand.id === product.brandId);
            console.log('Product brand:', brand?.name);
            
            // Cập nhật thông tin sản phẩm
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-price').textContent = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
            }).format(product.price);
            document.getElementById('product-description').textContent = product.description;
            
            // Thiết lập controls số lượng
            setupQuantityControls(product);
            
            // Tạo carousel hình ảnh
            createImageCarousel(product);
            
            // Cập nhật thông tin chi tiết
            const detailsElement = document.getElementById('product-details');
            if (detailsElement) {
                const detailsHtml = `
                    <table class="table">
                        <tbody>
                            <tr>
                                <th>Product id:</th>
                                <td>${product.id}</td>
                            </tr>
                            <tr>
                                <th>Type:</th>
                                <td>${product.type || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Gender:</th>
                                <td>${product.gender || 'N/A'}</td>
                            </tr>
                            <tr>
                                <th>Thương hiệu:</th>
                                <td>${brand?.name || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                `;
                detailsElement.innerHTML = detailsHtml;
            } else {
                console.error('Element product-details not found');
            }
            
            // Thay thế productId trong nút thêm vào giỏ hàng
            const addToCartButton = document.querySelector('button[onclick*="addToCart"]');
            if (addToCartButton) {
                addToCartButton.setAttribute('onclick', `addToCart('${product.id}')`);
            } else {
                console.error('Add to cart button not found');
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            const container = document.querySelector('.container');
            if (container) {
                container.innerHTML = `
                    <div class="alert alert-danger mt-4">
                        <h4 class="alert-heading">Không thể tải thông tin</h4>
                        <p>Có lỗi xảy ra khi tải dữ liệu: ${error.message}</p>
                        <hr>
                        <p class="mb-0">
                            <a href="/" class="btn btn-outline-primary">Quay lại trang chủ</a>
                        </p>
                    </div>
                `;
            }
        });

        /**
         * Thiết lập các controls để tăng giảm số lượng
         * @param {Object} product - Thông tin sản phẩm
         */
        function setupQuantityControls(product) {
            const increaseBtn = document.getElementById('increase-quantity');
            const decreaseBtn = document.getElementById('decrease-quantity');
            const quantityInput = document.getElementById('quantity');
            const stockStatus = document.getElementById('stock-status');
            
            // Mặc định là 1
            let currentQuantity = 1;
            
            // Lấy stock từ sản phẩm hoặc mặc định là 10 nếu không có
            const maxStock = product.stock || 10;
            
            // Cập nhật hiển thị số lượng tồn kho
            updateStockStatus();
            
            // Gán sự kiện click cho nút tăng
            increaseBtn.addEventListener('click', () => {
                if (currentQuantity < maxStock) {
                    currentQuantity++;
                    quantityInput.value = currentQuantity;
                    updateStockStatus();
                }
            });
            
            // Gán sự kiện click cho nút giảm
            decreaseBtn.addEventListener('click', () => {
                if (currentQuantity > 1) {
                    currentQuantity--;
                    quantityInput.value = currentQuantity;
                    updateStockStatus();
                }
            });
            
            // Gán sự kiện input để xử lý khi người dùng nhập số lượng trực tiếp
            quantityInput.addEventListener('change', () => {
                let newValue = parseInt(quantityInput.value);
                
                // Kiểm tra nếu giá trị hợp lệ
                if (isNaN(newValue) || newValue < 1) {
                    newValue = 1;
                } else if (newValue > maxStock) {
                    newValue = maxStock;
                }
                
                // Cập nhật giá trị
                currentQuantity = newValue;
                quantityInput.value = currentQuantity;
                updateStockStatus();
            });
            
            // Hàm cập nhật trạng thái tồn kho
            function updateStockStatus() {
                if (maxStock <= 5) {
                    // Tồn kho thấp
                    stockStatus.innerHTML = `<span class="stock-low">Chỉ còn ${maxStock - currentQuantity + 1} sản phẩm</span>`;
                } else if (currentQuantity >= maxStock) {
                    // Đã chọn hết số lượng có sẵn
                    stockStatus.innerHTML = `<span class="stock-low">Đã chọn tối đa</span>`;
                } else {
                    // Còn nhiều hàng
                    stockStatus.innerHTML = `<span class="stock-available">Còn ${maxStock - currentQuantity} sản phẩm</span>`;
                }
                
                // Vô hiệu hóa nút tăng nếu đã đạt tối đa
                if (currentQuantity >= maxStock) {
                    increaseBtn.disabled = true;
                } else {
                    increaseBtn.disabled = false;
                }
                
                // Vô hiệu hóa nút giảm nếu đã đạt tối thiểu
                if (currentQuantity <= 1) {
                    decreaseBtn.disabled = true;
                } else {
                    decreaseBtn.disabled = false;
                }
            }
        }
    } catch (error) {
        console.error('Initialization error:', error);
    }
})

/**
 * Tạo carousel hình ảnh từ dữ liệu sản phẩm
 * @param {Object} product - Đối tượng sản phẩm từ API
 */
function createImageCarousel(product) {
    const carouselInner = document.getElementById('carousel-inner');
    const thumbnailContainer = document.getElementById('thumbnail-container');
    
    if (!carouselInner || !thumbnailContainer) {
        console.error('Carousel or thumbnail container not found');
        return;
    }
    
    // Xác định danh sách hình ảnh
    let images = [];
    
    // Nếu có mảng images, sử dụng nó
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        images = product.images;
    } 
    // Nếu không có mảng images nhưng có trường image/avatar
    else if (product.image || product.avatar) {
        images = [product.image || product.avatar];
    }
    // Nếu không có hình ảnh nào, hiển thị hình placeholder
    else {
        images = ['https://via.placeholder.com/400x400?text=No+Image+Available'];
    }
    
    console.log('Product images:', images);
    
    // Tạo các slide cho carousel
    images.forEach((imageUrl, index) => {
        // Tạo item carousel
        const carouselItem = document.createElement('div');
        carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        
        // Tạo hình ảnh
        const img = document.createElement('img');
        img.src = imageUrl;
        img.className = 'd-block';
        img.alt = `${product.name} - Hình ${index + 1}`;
        
        carouselItem.appendChild(img);
        carouselInner.appendChild(carouselItem);
        
        // Tạo thumbnail
        const thumbnail = document.createElement('img');
        thumbnail.src = imageUrl;
        thumbnail.className = `product-thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.alt = `Thumbnail ${index + 1}`;
        thumbnail.dataset.bsTarget = '#productImageCarousel';
        thumbnail.dataset.bsSlideTo = index;
        
        thumbnail.addEventListener('click', () => {
            // Xóa class active từ tất cả thumbnails
            document.querySelectorAll('.product-thumbnail').forEach(thumb => {
                thumb.classList.remove('active');
            });
            
            // Thêm class active cho thumbnail được click
            thumbnail.classList.add('active');
            
            // Chuyển đến slide tương ứng
            const carousel = new bootstrap.Carousel(document.getElementById('productImageCarousel'));
            carousel.to(index);
        });
        
        thumbnailContainer.appendChild(thumbnail);
    });
    
    // Khởi tạo carousel với Bootstrap
    new bootstrap.Carousel(document.getElementById('productImageCarousel'), {
        interval: 5000,  // 5 giây mỗi slide
        wrap: true       // Lặp lại từ đầu khi đến slide cuối cùng
    });
}

// Hàm thêm vào giỏ hàng
function addToCart(productId) {
    console.log('Adding product to cart:', productId);
    
    // Lấy số lượng từ input
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    
    // Lưu vào localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingProductIndex = cart.findIndex(item => item.id === productId);
    
    if (existingProductIndex !== -1) {
        // Nếu đã có, cộng thêm số lượng
        cart[existingProductIndex].quantity += quantity;
    } else {
        // Nếu chưa có, thêm mới
        cart.push({
            id: productId,
            quantity: quantity
        });
    }
    
    // Lưu lại giỏ hàng
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Thông báo cho người dùng
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
} 