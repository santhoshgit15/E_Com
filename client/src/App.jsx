import React, { useState, useEffect, useRef } from 'react';
import './index.css';

// Utility for INR format
const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

const Header = ({ 
  cartCount, 
  wishlistCount, 
  onCartToggle, 
  activeCategory, 
  setActiveCategory,
  onSearchToggle 
}) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'New In', value: 'new' },
    { label: 'Clothing', value: 'clothing' },
    { label: 'Dresses', value: 'dresses' },
    { label: 'Anime', value: 'anime' },
    { label: 'Sale', value: 'sale' },
  ];

  return (
    <>
      {/* Announcement Bar */}
      <div className="announcement-bar" id="announcement-bar">
        <div className="announcement-content">
          <span>🔥 FLASH SALE — Up to 50% off everything + Free shipping over ₹5000</span>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-left">
            <a href="#" className="logo" onClick={() => setActiveCategory('all')}>LUXE</a>
            <div className="nav-links">
              {navLinks.map((link) => (
                <a
                  key={link.value}
                  href="#"
                  className={`nav-link ${activeCategory === link.value ? 'active' : ''} ${link.value === 'sale' ? 'sale-link' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveCategory(link.value);
                  }}
                  style={link.value === 'sale' ? { color: 'var(--color-sale)' } : {}}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="nav-right">
            <button className="nav-icon" onClick={onSearchToggle} aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
            <button className="nav-icon" aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                 <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span className="badge">{wishlistCount}</span>
            </button>
            <button className="nav-icon cart-icon" onClick={onCartToggle} aria-label="Shopping bag">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="badge">{cartCount}</span>
            </button>
            <button 
              className={`hamburger ${mobileNavOpen ? 'active' : ''}`} 
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            >
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div className={`mobile-nav ${mobileNavOpen ? 'active' : ''}`} style={mobileNavOpen ? {transform: 'translateX(0)'} : {}}>
        <div className="mobile-nav-inner">
          {navLinks.map((link) => (
            <a
              key={link.value}
              href="#"
              className={`mobile-nav-link ${link.value === 'sale' ? 'sale-link' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveCategory(link.value);
                setMobileNavOpen(false);
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted, onQuickView }) => {
  const isAnime = product.category === 'anime';

  return (
    <div className={`product-card visible`} style={{opacity: 1, transform: 'translateY(0)'}}>
      <div className="product-image-wrapper">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        {product.badge && (
          <div className="product-badges">
            <span className={`product-badge ${product.badge === 'Sale' || product.badge === '-30%' ? 'badge-sale' : 'badge-new'}`}>
              {product.badge}
            </span>
          </div>
        )}
        <div className="product-quick-actions">
          <button 
            className={`quick-action ${isWishlisted ? 'wishlisted' : ''}`}
            onClick={() => onToggleWishlist(product.id)}
            aria-label="Add to wishlist"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? '#fff' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          <button className="quick-action" onClick={() => onQuickView(product)} aria-label="Quick view">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
               <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
        <button className="add-to-bag-overlay" onClick={() => onAddToCart(product)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
             <line x1="3" y1="6" x2="21" y2="6"></line>
             <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          Add to bag
        </button>
      </div>
      <div className="product-info">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">
          <span className="current-price">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="original-price">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        {!isAnime && product.colors && (
          <div className="product-colors">
            {product.colors.map((color, idx) => (
              <span 
                key={idx} 
                className="color-swatch" 
                title={color}
                style={{
                  background: color === 'Black' ? '#1a1a1a' : 
                              color === 'Mustard' ? '#DAA520' : 
                              color === 'Lavender' ? '#E6E6FA' : 
                              color === 'Sage' ? '#8FBC8F' : 
                              color === 'Floral' ? 'linear-gradient(135deg, #FFB6C1, #FFDAB9)' : '#ccc'
                }}
              ></span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [toast, setToast] = useState({ visible: false, title: '', message: '' });

  // Fetch Products
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory || (activeCategory === 'new' && p.badge === 'New') || (activeCategory === 'sale' && p.originalPrice));

  const showToast = (title, message) => {
    setToast({ visible: true, title, message });
    setTimeout(() => setToast({ visible: false, title: '', message: '' }), 3000);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    showToast('Added to bag', `${product.name} has been added`);
    setIsCartOpen(true);
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => {
      if (prev.includes(id)) {
        showToast('Removed', 'Item removed from wishlist');
        return prev.filter(item => item !== id);
      } else {
        showToast('Saved ❤️', 'Item added to your wishlist');
        return [...prev, id];
      }
    });
  };

  const updateCartQty = (id, change) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        return { ...i, qty: Math.max(0, i.qty + change) };
      }
      return i;
    }).filter(i => i.qty > 0));
  };

  // Cart values
  const cartItemCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className={`app-container ${isCartOpen || quickViewProduct ? 'no-scroll' : ''}`}>
      <Header 
        cartCount={cartItemCount}
        wishlistCount={wishlist.length}
        onCartToggle={() => setIsCartOpen(true)}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        onSearchToggle={() => {}}
      />

      {/* Hero Section */}
      {activeCategory === 'all' && (
        <section className="hero">
          <div className="hero-bg">
            <img src="/images/hero-model.png" alt="Hero" className="hero-image" style={{opacity: 1}} />
          </div>
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="hero-text visible" style={{opacity: 1, transform: 'translateY(0)'}}>
              <span className="hero-label">New Collection</span>
              <h1 className="hero-title">Elevate<br/><em>your style</em></h1>
              <p className="hero-subtitle">Discover the latest inclusive fashion with delicate embroidery details and luxurious fabrics.</p>
              <div className="hero-actions">
                <button className="btn btn-primary hero-cta" onClick={() => {
                  const p = products.find(prod => prod.id === 2);
                  if(p) addToCart(p);
                }}>
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Collection Layout */}
      <section className="collection-section">
        <div className="container">
          <div className="section-header visible" style={{opacity: 1, transform: 'translateY(0)'}}>
            <div className="section-header-left">
              <span className="section-eyebrow">
                {activeCategory === 'anime' ? 'Otaku Exclusive' : 'Curated Edit'}
              </span>
              <h2 className="section-title">
                <em>{activeCategory === 'all' ? 'Featured Collection' : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}</em>
              </h2>
            </div>
          </div>

          <div className="product-grid">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onToggleWishlist={toggleWishlist}
                isWishlisted={wishlist.includes(product.id)}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Cart Sidebar */}
      <div className={`cart-overlay ${isCartOpen ? 'active' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`cart-sidebar ${isCartOpen ? 'active' : ''}`}>
        <div className="cart-header">
          <h3>Your Bag <span className="cart-header-count">({cartItemCount})</span></h3>
          <button className="cart-close" onClick={() => setIsCartOpen(false)}>&times;</button>
        </div>
        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="cart-empty" style={{display: 'flex'}}>
              <p>Your bag is empty</p>
              <span>Add items to get started</span>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <div className="cart-item-bottom">
                      <div className="cart-qty">
                        <button onClick={() => updateCartQty(item.id, -1)}>−</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateCartQty(item.id, 1)}>+</button>
                      </div>
                      <span className="cart-item-price">{formatPrice(item.price * item.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal">
              <span>Subtotal</span>
              <span className="cart-total-price">{formatPrice(cartTotal)}</span>
            </div>
            <p className="cart-shipping-note">Shipping calculated at checkout</p>
            <button className="btn btn-primary cart-checkout">Checkout</button>
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <div className={`modal-overlay ${quickViewProduct ? 'active' : ''}`} onClick={() => setQuickViewProduct(null)}></div>
      <div className={`quick-view-modal ${quickViewProduct ? 'active' : ''}`}>
         {quickViewProduct && (
            <div className="modal-body">
              <button className="modal-close" onClick={() => setQuickViewProduct(null)}>&times;</button>
              <div className="modal-image">
                <img src={quickViewProduct.image} alt={quickViewProduct.name} />
              </div>
              <div className="modal-info">
                <p className="modal-brand">{quickViewProduct.brand}</p>
                <h2 className="modal-name">{quickViewProduct.name}</h2>
                <div className="modal-price">
                  <span className="current-price">{formatPrice(quickViewProduct.price)}</span>
                </div>
                <div className="modal-description">
                  <p>{quickViewProduct.description}</p>
                </div>
                <button className="btn btn-primary modal-add-cart" onClick={() => {
                  addToCart(quickViewProduct);
                  setQuickViewProduct(null);
                }}>
                  Add to bag
                </button>
              </div>
            </div>
         )}
      </div>

      {/* Toast Notification */}
      <div className={`toast ${toast.visible ? 'active' : ''}`}>
        <div className="toast-icon">✓</div>
        <div className="toast-content">
          <p className="toast-title">{toast.title}</p>
          <p className="toast-message">{toast.message}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
