const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware (Crucial for frontend communication)
app.use(cors()); 
app.use(express.json());

// Basic Test Route
app.get('/', (req, res) => {
    res.send('CodeAlpha E-commerce Backend is Running!');
});

// Routes Middleware
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// 🌐 PASTE YOUR MONGODB ATLAS CONNECTION STRING HERE:
// ✅ Change line 24 to look exactly like this:
const dbURI = "mongodb+srv://AlphaAdmin:AlphaProjects2026@cluster0.mopoic3.mongodb.net/?appName=Cluster0";

// Secure Connection Handler
mongoose.connect(dbURI)
    .then(() => {
        console.log("=========================================");
        console.log('✅ Connected safely to Real MongoDB Cloud Cluster!');
        console.log("=========================================");
    })
    .catch((err) => {
        console.error('❌ Database connection error:', err);
    });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});