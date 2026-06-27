const mongoose = require('mongoose');
const Product = require('./models/Product');

// Use your exact working connection string from server.js:
const dbURI = "mongodb+srv://AlphaAdmin:AlphaProjects2026@cluster0.mopoic3.mongodb.net/?appName=Cluster0";

const extendedProducts = [
    {
        title: "Quantum Mechanical Keyboard",
        price: 129.99,
        imageURL: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop",
        description: "Tactile mechanical keyboard with custom RGB backlighting."
    },
    {
        title: "Pro Audio Studio Headphones",
        price: 199.50,
        imageURL: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
        description: "High-fidelity studio headphones with noise isolation."
    },
    {
        title: "Minimalist Wireless Mouse",
        price: 79.00,
        imageURL: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop",
        description: "Ergonomic ultra-lightweight optical wireless mouse."
    },
    {
        title: "UltraWide 4K Curved Monitor",
        price: 449.99,
        imageURL: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=600&auto=format&fit=crop",
        description: "34-inch curved immersive display for creators and gamers."
    },
    {
        title: "Aluminum Desktop Headphone Stand",
        price: 34.99,
        imageURL: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?q=80&w=600&auto=format&fit=crop",
        description: "Premium matte black aluminum stand with silicone cable organizer."
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(dbURI);
        console.log("🌱 Connected to database for seeding...");

        // Clear existing items so we don't get duplicates
        await Product.deleteMany({});
        console.log("🗑️ Cleared old products.");

        // Insert the new list
        await Product.insertMany(extendedProducts);
        console.log("🎉 Successfully added premium catalog items!");

        mongoose.connection.close();
        console.log("🔌 Connection closed cleanly.");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    }
}

seedDatabase();