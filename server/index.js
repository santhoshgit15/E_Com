const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

app.use(cors());
app.use(express.json());

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token.' });
        req.user = user;
        next();
    });
};

// Login Endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get all products (Public)
app.get('/api/products', async (req, res) => {
    try {
        const { category } = req.query;
        let query = 'SELECT * FROM products';
        let params = [];
        
        if (category && category !== 'all') {
            query += ' WHERE category = ?';
            params.push(category);
        }
        
        const [rows] = await db.query(query, params);
        const products = rows.map(p => ({
            ...p,
            colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors
        }));
        
        res.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Add a new product (Protected)
app.post('/api/products', authenticateToken, async (req, res) => {
    try {
        const { name, brand, price, originalPrice, image, badge, colors, category, description } = req.body;
        const [result] = await db.query(
            `INSERT INTO products (name, brand, price, originalPrice, image, badge, colors, category, description)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, brand, price, originalPrice || null, image, badge || null, JSON.stringify(colors || []), category, description]
        );
        res.status(201).json({ id: result.insertId, message: 'Product added successfully' });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ error: 'Failed to add product' });
    }
});

// Update a product (Protected)
app.put('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, brand, price, originalPrice, image, badge, colors, category, description } = req.body;
        await db.query(
            `UPDATE products SET name = ?, brand = ?, price = ?, originalPrice = ?, image = ?, badge = ?, colors = ?, category = ?, description = ?
             WHERE id = ?`,
            [name, brand, price, originalPrice || null, image, badge || null, JSON.stringify(colors || []), category, description, id]
        );
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete a product (Protected)
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
