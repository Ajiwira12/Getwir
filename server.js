const express = require('express');
const bodyParser = require('body-parser');
const midtransClient = require('midtrans-client');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public')); // For serving static files like HTML, CSS, JS

// Midtrans client setup
const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: 'SB-Mid-server-pH9FhZOQ43A2v3v_Xmv4-9I7',
    clientKey: 'SB-Mid-client-G6MkvCrvVaI2fKNE'
});

app.post('/checkout', (req, res) => {
    const orderId = 'ORDER-' + Math.floor(100000 + Math.random() * 900000);
    const grossAmount = req.body.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let parameter = {
        transaction_details: {
            order_id: orderId,
            gross_amount: grossAmount
        },
        item_details: req.body.cart.map(item => ({
            id: item.id,
            price: item.price,
            quantity: item.quantity,
            name: item.name
        })),
        customer_details: {
            first_name: "Customer",
            last_name: "Name",
            email: "customer@example.com",
            phone: "08123456789"
        }
    };

    snap.createTransaction(parameter)
    .then(transaction => {
        res.json({ token: transaction.token });
    })
    .catch(error => {
        res.status(500).json({ error: error.message });
    });
});

app.listen(7700, () => {
    console.log('Server is running on http://localhost:7700');
});
