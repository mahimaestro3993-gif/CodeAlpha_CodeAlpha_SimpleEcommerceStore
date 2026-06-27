const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartCount();
    checkAuthStatus();
});

async function fetchProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;
    
    try {
        let response = await fetch(`${API_URL}/products`);
        let products = await response.json();
        
        productGrid.innerHTML = '';

        if (products.length === 0) {
            productGrid.innerHTML = '<p class="loading">No products found in the catalog.</p>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <img src="${product.imageURL}" alt="${product.title}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <button class="btn" onclick="addToCart('${product._id}', '${product.title}', ${product.price})">Add to Cart</button>
                </div>
            `;
            productGrid.appendChild(card);
        });
    } catch (error) {
        console.error('Error loading products:', error);
        productGrid.innerHTML = '<p class="loading" style="color: #f43f5e;">Error connecting to backend server.</p>';
    }
}

function addToCart(id, title, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.product === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ product: id, title, price, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${title} added to your cart!`);
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return;
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.innerText = count;
}

function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const authLink = document.getElementById('auth-link');
    if (!authLink) return;

    if (token) {
        authLink.innerText = 'Logout';
        authLink.href = '#';
        authLink.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.reload();
        });
    }
}