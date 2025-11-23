// ============================
// Thyme & Harmony Candles JS
// ============================

// script.js

// Utility functions for localStorage
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function getOrder() {
    return JSON.parse(localStorage.getItem('order')) || {};
}

function saveOrder(order) {
    localStorage.setItem('order', JSON.stringify(order));
}

// Cart functions
function addToCart(product) {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.name === product.name);
    if (existingIndex > -1) {
        cart[existingIndex].qty += 1;
    } else {
        cart.push(product);
    }
    saveCart(cart);
    alert(`${product.name} added to cart!`);
}

function updateQuantity(index, qty) {
    const cart = getCart();
    if (qty <= 0) {
        removeFromCart(index);
        return;
    }
    cart[index].qty = qty;
    saveCart(cart);
    renderCart();
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
}

function calculateTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (parseFloat(item.price.replace('JMD ', '').replace(',', '')) * item.qty), 0);
}

// Render cart on cart.html
function renderCart() {
    const cart = getCart();
    const tbody = document.querySelector('.cart-table tbody');
    if (!tbody) return;

    tbody.innerHTML = '';
    cart.forEach((item, index) => {
        const subtotal = parseFloat(item.price.replace('JMD ', '').replace(',', '')) * item.qty;
        const row = `
            <tr>
                <td class="product-info">
                    <img src="${item.img}" alt="${item.name}">
                    <span>${item.name}</span>
                </td>
                <td class="price">${item.price}</td>
                <td>
                    <input type="number" min="1" value="${item.qty}" class="quantity-input" data-index="${index}">
                </td>
                <td class="subtotal">JMD ${subtotal.toFixed(2)}</td>
                <td>
                    <button class="remove-btn" data-index="${index}" aria-label="Remove ${item.name} from cart">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });

    // Update total
    const total = calculateTotal();
    document.querySelector('.cart-summary p strong').textContent = `Total: JMD ${total.toFixed(2)}`;
}

// Render invoice on invoice.html
function renderInvoice() {
    const order = getOrder();
    if (!order.customer || !order.items) return;

    document.getElementById('cust-name').textContent = order.customer.fullname;
    document.getElementById('cust-email').textContent = order.customer.email;
    document.getElementById('cust-phone').textContent = order.customer.phone;
    document.getElementById('cust-address').textContent = order.customer.address;

    const tbody = document.getElementById('invoice-items');
    tbody.innerHTML = '';
    order.items.forEach(item => {
        const subtotal = parseFloat(item.price.replace('JMD ', '').replace(',', '')) * item.qty;
        const row = `
            <tr>
                <td>${item.name}</td>
                <td>${item.qty}</td>
                <td>${item.price}</td>
                <td>JMD ${subtotal.toFixed(2)}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });

    document.getElementById('invoice-total').textContent = order.total.toFixed(2);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add to cart buttons on shop.html and index.html
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const pro = this.closest('.pro');
            const name = pro.querySelector('h3').textContent;
            const price = pro.querySelector('.price').textContent;
            const img = pro.querySelector('img').src;
            const product = { name, price, img, qty: 1 };
            addToCart(product);
        });
    });

    // Cart page events
    if (document.querySelector('.cart-table')) {
        renderCart();
        document.addEventListener('change', function(e) {
            if (e.target.classList.contains('quantity-input')) {
                const index = e.target.dataset.index;
                const qty = parseInt(e.target.value);
                updateQuantity(index, qty);
            }
        });
        document.addEventListener('click', function(e) {
            if (e.target.closest('.remove-btn')) {
                const index = e.target.closest('.remove-btn').dataset.index;
                removeFromCart(index);
            }
        });
    }

    // Checkout form
    const checkoutForm = document.querySelector('.checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const customer = {
                fullname: formData.get('fullname'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: `${formData.get('address')}, ${formData.get('city')}, ${formData.get('country')} ${formData.get('postalcode')}`
            };
            const order = {
                customer,
                items: getCart(),
                total: calculateTotal()
            };
            saveOrder(order);
            // Clear cart after order
            saveCart([]);
            alert('Order placed successfully! Redirecting to invoice.');
            window.location.href = 'invoice.html';
        });
    }

    // Invoice page
    if (document.querySelector('.invoice-container')) {
        renderInvoice();
    }

    // Login/Register forms (basic validation)
    const loginForm = document.querySelector('#login .auth-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Login functionality not implemented. This is a demo.');
        });
    }
    const registerForm = document.querySelector('#register .auth-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Registration functionality not implemented. This is a demo.');
        });
    }
});
