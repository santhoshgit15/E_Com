require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const products = [
    { name: 'Polka Dot Wrap Dress', brand: 'LUXE Design', price: 3699, originalPrice: null, image: '/images/product-1.png', badge: 'New', colors: JSON.stringify(['Black', 'Brown', 'Red']), category: 'dresses', description: 'A timeless polka dot wrap dress with a flattering V-neckline and flowing silhouette. Perfect for day-to-night versatility.' },
    { name: 'Bardot Top in Embroidery', brand: 'LUXE Essentials', price: 3299, originalPrice: 4499, image: '/images/hero-model.png', badge: 'Trending', colors: JSON.stringify(['Mustard', 'Cream', 'Rose']), category: 'clothing', description: 'A stunning off-shoulder bardot top featuring intricate embroidery details. The perfect statement piece for summer.' },
    { name: 'Ruffle Off-Shoulder Blouse', brand: 'LUXE Atelier', price: 4599, originalPrice: null, image: '/images/product-2.png', badge: 'Limited', colors: JSON.stringify(['Lavender', 'White']), category: 'clothing', description: 'Delicate ruffles cascade across this beautiful off-shoulder blouse. Crafted from premium cotton with a relaxed fit.' },
    { name: 'Floral Puff Sleeve Mini Dress', brand: 'LUXE Design', price: 2899, originalPrice: 3999, image: '/images/product-3.png', badge: 'Sale', colors: JSON.stringify(['Floral', 'Blue']), category: 'dresses', description: 'A dreamy floral mini dress with romantic puff sleeves. Perfect cottage-core aesthetic for garden parties.' },
    { name: 'Lace Detail Knit Crop Top', brand: 'LUXE Essentials', price: 2699, originalPrice: null, image: '/images/product-4.png', badge: null, colors: JSON.stringify(['Cream', 'Black']), category: 'clothing', description: 'A soft knit crop top with beautiful lace detailing. Pairs perfectly with high-waist jeans for effortless style.' },
    { name: 'Sage Satin Slip Dress', brand: 'LUXE Atelier', price: 5099, originalPrice: null, image: '/images/product-5.png', badge: 'New', colors: JSON.stringify(['Sage', 'Champagne', 'Black']), category: 'dresses', description: 'An elegant satin slip dress in a gorgeous sage green. Features delicate spaghetti straps and a midi length.' },
    { name: 'Anime Cyberpunk Oversized T-Shirt', brand: 'Otaku Apparel', price: 1499, originalPrice: 1999, image: '/images/anime-shirt.png', badge: 'New', colors: JSON.stringify(['Black']), category: 'anime', description: 'A stylish black oversize graphic t-shirt featuring highly detailed cyberpunk anime character art. Premium cotton blend for maximum comfort.' },
    { name: 'Fantasy Swordsman Action Figure', brand: 'AniCollectibles', price: 4999, originalPrice: null, image: '/images/anime-toy.png', badge: 'Limited', colors: JSON.stringify(['Original Color']), category: 'anime', description: 'Highly detailed 1/7 scale anime-style action figure of a legendary fantasy swordsman hero. Features dynamic posing and premium studio-quality paintwork.' },
    { name: 'Premium Manga Box Set', brand: 'Otaku Library', price: 6499, originalPrice: 8000, image: '/images/anime-manga.png', badge: 'Sale', colors: JSON.stringify(['Standard']), category: 'anime', description: 'A premium, beautifully crafted manga box set containing the complete first arc with breathtaking anime art on the slipcase and spines.' }
];

async function init() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    });

    try {
        const dbName = process.env.DB_NAME || 'ecom_db';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await connection.query(`USE \`${dbName}\``);

        // Products table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                brand VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                originalPrice DECIMAL(10, 2),
                image VARCHAR(500),
                badge VARCHAR(50),
                colors JSON,
                category VARCHAR(100),
                description TEXT
            )
        `);

        // Users table for Admin
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'admin'
            )
        `);

        // Check if data already exists in products
        const [rows] = await connection.query('SELECT COUNT(*) as count FROM products');
        if (rows[0].count === 0) {
            console.log("Inserting initial products...");
            const insertQuery = `
                INSERT INTO products (name, brand, price, originalPrice, image, badge, colors, category, description)
                VALUES ?
            `;
            const values = products.map(p => [
                p.name, p.brand, p.price, p.originalPrice, p.image, p.badge, p.colors, p.category, p.description
            ]);
            await connection.query(insertQuery, [values]);
            console.log("Initial products inserted successfully.");
        } else {
            console.log("Products table already has data. Skipping insertion.");
        }

        // Check if admin user exists
        const [userRows] = await connection.query('SELECT COUNT(*) as count FROM users WHERE username = "admin"');
        if (userRows[0].count === 0) {
            console.log("Creating default admin user...");
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await connection.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', ['admin', hashedPassword, 'admin']);
            console.log("Admin user created (admin / admin123).");
        } else {
            console.log("Admin user already exists.");
        }

    } catch (error) {
        console.error("Database initialization failed:", error);
    } finally {
        await connection.end();
    }
}

init();
