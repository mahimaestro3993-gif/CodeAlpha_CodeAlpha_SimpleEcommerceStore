const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    checkAuthStatus();
});

// 1. Load data from localStorage and paint the cart items list layout
function renderCart() {
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = '<p style="text-align: center; color: #718096; padding: 1rem 0;">Your shopping cart is empty. Head back to the homepage to choose items!</p>';
        cartTotalPrice.innerText = '$0.00';
        checkoutBtn.style.display = 'none';
        return;
    }

    cartItemsList.innerHTML = '';
    let runningTotal = 0;

    cart.forEach((item, index) => {
        const itemCost = item.price * item.quantity;
        runningTotal += itemCost;

        const row = document.createElement('div');
        row.style.display = 'flex';
        row.style.justifyContent = 'space-between';
        row.style.alignItems = 'center';
        row.style.padding = '1rem 0';
        row.style.borderBottom = '1px solid #edf2f7';
        
        row.innerHTML = `
            <div>
                <h4 style="margin-bottom: 0.2rem;">${item.title}</h4>
                <small style="color: #718096;">Price: $${item.price} x Quantity: ${item.quantity}</small>
            </div>
            <div style="display: flex; align-items: center; gap: 1.5rem;">
                <span style="font-weight: 600;">$${itemCost.toFixed(2)}</span>
                <button onclick="removeItemFromCart(${index})" style="background: none; border: none; color: #e53e3e; cursor: pointer; font-size: 0.9rem;">Remove</button>
            </div>
        `;
        cartItemsList.appendChild(row);
    });

    cartTotalPrice.innerText = `$${runningTotal.toFixed(2)}`;
    checkoutBtn.style.display = 'block';

    // Set up the event listener for the checkout button execution link
    checkoutBtn.onclick = () => handleCheckout(cart, runningTotal);
}

// 2. Clear out a specific item array pointer index
function removeItemFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// 3. Dispatch data across network layers to create standard user orders
async function handleCheckout(cart, totalAmount) {
    const token = localStorage.getItem('token');
    
    // Check if the user is authenticated before hitting backend schemas
    if (!token) {
        alert('You must log in to your account before checking out.');
        window.location.href = 'login.html';
        return;
    }

    // Format item payloads into what our Mongoose OrderSchema expects
    const structuredItems = cart.map(item => ({
        product: item.product,
        quantity: item.quantity
    }));

    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Injects identity token into the bouncer middleware
            },
            body: JSON.stringify({ items: structuredItems, totalAmount })
        });
        const data = await response.json();

        if (response.ok) {
            alert('Order placed successfully! Thank you for shopping with us.');
            localStorage.removeItem('cart'); // Empty client storage cart
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Checkout attempt failed.');
        }
    } catch (error) {
        console.error('Checkout Error Processing:', error);
        alert('Unable to process request with checkout server systems.');
    }
}

// 4. Update login/logout link display states
function checkAuthStatus() {
    const token = localStorage.getItem('token');
    const authLink = document.getElementById('auth-link');
    
    if (token) {
        authLink.innerText = 'Logout';
        authLink.href = '#';
        authLink.onclick = (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            alert('Logged out successfully!');
            window.location.reload();
        };
    }
}