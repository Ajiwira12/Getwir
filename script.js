let cart = [];

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const menuItem = button.parentElement;
        const id = menuItem.getAttribute('data-id');
        const name = menuItem.getAttribute('data-name');
        const price = parseInt(menuItem.getAttribute('data-price'));
        const quantity = parseInt(menuItem.querySelector('.item-quantity').value);

        const existingItem = cart.find(item => item.id === id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ id, name, price, quantity });
        }

        updateCart();
    });
});

function updateCart() {
    const cartDiv = document.getElementById('cart');
    cartDiv.innerHTML = '';

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.textContent = `${item.name} x${item.quantity} - Rp ${item.price * item.quantity}`;
        cartDiv.appendChild(itemDiv);
    });
}

document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Keranjang kosong!');
        return;
    }

    fetch('/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cart })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            window.snap.pay(data.token); // Midtrans payment popup
        } else {
            alert('Gagal memproses pembayaran');
        }
    })
    .catch(error => console.error('Error:', error));
});

// Integrasi Midtrans Snap JS
(function(){
    var script = document.createElement('script');
    script.src = "https://app.midtrans.com/snap/snap.js";
    script.setAttribute('data-client-key', 'SB-Mid-client-G6MkvCrvVaI2fKNE');
    document.head.appendChild(script);
})();
