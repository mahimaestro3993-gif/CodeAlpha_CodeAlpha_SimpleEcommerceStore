const express = require('express');
const router = express.Router();

// Static fallback premium items so your storefront renders immediately!
const dummyProducts = [
    {
        _id: "prod_01",
        title: "Quantum Mechanical Keyboard",
        price: 129.99,
        imageURL: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop"
    },
    {
        _id: "prod_02",
        title: "Pro Audio Studio Headphones",
        price: 199.50,
        imageURL: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop"
    },
    {
        _id: "prod_03",
        title: "Minimalist Wireless Mouse",
        price: 79.00,
        imageURL: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop"
    }
];

// GET: /api/products
router.get('/', (req, res) => {
    try {
        // Return the clean array directly to unblock your frontend UI loop
        res.status(200).json(dummyProducts);
    } catch (error) {
        res.status(500).json({ message: "Error loading products" });
    }
});

module.exports = router;