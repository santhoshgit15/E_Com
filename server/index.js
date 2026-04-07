const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const products = [
    {
        id: 1,
        name: 'Polka Dot Wrap Dress',
        brand: 'LUXE Design',
        price: 3699,
        originalPrice: null,
        image: '/images/product-1.png',
        badge: 'New',
        colors: ['Black', 'Brown', 'Red'],
        category: 'dresses',
        description: 'A timeless polka dot wrap dress with a flattering V-neckline and flowing silhouette. Perfect for day-to-night versatility.'
    },
    {
        id: 2,
        name: 'Bardot Top in Embroidery',
        brand: 'LUXE Essentials',
        price: 3299,
        originalPrice: 4499,
        image: '/images/hero-model.png',
        badge: 'Trending',
        colors: ['Mustard', 'Cream', 'Rose'],
        category: 'clothing',
        description: 'A stunning off-shoulder bardot top featuring intricate embroidery details. The perfect statement piece for summer.'
    },
    {
        id: 3,
        name: 'Ruffle Off-Shoulder Blouse',
        brand: 'LUXE Atelier',
        price: 4599,
        originalPrice: null,
        image: '/images/product-2.png',
        badge: 'Limited',
        colors: ['Lavender', 'White'],
        category: 'clothing',
        description: 'Delicate ruffles cascade across this beautiful off-shoulder blouse. Crafted from premium cotton with a relaxed fit.'
    },
    {
        id: 4,
        name: 'Floral Puff Sleeve Mini Dress',
        brand: 'LUXE Design',
        price: 2899,
        originalPrice: 3999,
        image: '/images/product-3.png',
        badge: 'Sale',
        colors: ['Floral', 'Blue'],
        category: 'dresses',
        description: 'A dreamy floral mini dress with romantic puff sleeves. Perfect cottage-core aesthetic for garden parties.'
    },
    {
        id: 5,
        name: 'Lace Detail Knit Crop Top',
        brand: 'LUXE Essentials',
        price: 2699,
        originalPrice: null,
        image: '/images/product-4.png',
        badge: null,
        colors: ['Cream', 'Black'],
        category: 'clothing',
        description: 'A soft knit crop top with beautiful lace detailing. Pairs perfectly with high-waist jeans for effortless style.'
    },
    {
        id: 6,
        name: 'Sage Satin Slip Dress',
        brand: 'LUXE Atelier',
        price: 5099,
        originalPrice: null,
        image: '/images/product-5.png',
        badge: 'New',
        colors: ['Sage', 'Champagne', 'Black'],
        category: 'dresses',
        description: 'An elegant satin slip dress in a gorgeous sage green. Features delicate spaghetti straps and a midi length.'
    },
    // New Anime Category Products
    {
        id: 7,
        name: 'Anime Cyberpunk Oversized T-Shirt',
        brand: 'Otaku Apparel',
        price: 1499,
        originalPrice: 1999,
        image: '/images/anime-shirt.png',
        badge: 'New',
        colors: ['Black'],
        category: 'anime',
        description: 'A stylish black oversize graphic t-shirt featuring highly detailed cyberpunk anime character art. Premium cotton blend for maximum comfort.'
    },
    {
        id: 8,
        name: 'Fantasy Swordsman Action Figure',
        brand: 'AniCollectibles',
        price: 4999,
        originalPrice: null,
        image: '/images/anime-toy.png',
        badge: 'Limited',
        colors: ['Original Color'],
        category: 'anime',
        description: 'Highly detailed 1/7 scale anime-style action figure of a legendary fantasy swordsman hero. Features dynamic posing and premium studio-quality paintwork.'
    },
    {
        id: 9,
        name: 'Premium Manga Box Set',
        brand: 'Otaku Library',
        price: 6499,
        originalPrice: 8000,
        image: '/images/anime-manga.png',
        badge: 'Sale',
        colors: ['Standard'],
        category: 'anime',
        description: 'A premium, beautifully crafted manga box set containing the complete first arc with breathtaking anime art on the slipcase and spines.'
    }
];

// Get all products or filter by category
app.get('/api/products', (req, res) => {
    const { category } = req.query;
    if (category && category !== 'all') {
        const filteredProducts = products.filter(p => p.category === category);
        return res.json(filteredProducts);
    }
    res.json(products);
});

// Start server
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
