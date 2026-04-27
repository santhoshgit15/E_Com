import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
            <Link to="/" className="logo" onClick={() => setActiveCategory('all')}>LUXE</Link>
            <div className="nav-links">
              {navLinks.map((link) => (
                <a
                  key={link.value}
                  href="#"
                  className={`nav-link ${activeCategory === link.value ? 'active' : ''} ${link.value === 'sale' ? 'sale-link' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if(setActiveCategory) setActiveCategory(link.value);
                  }}
                  style={link.value === 'sale' ? { color: 'var(--color-sale)' } : {}}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="nav-right">
            <Link to="/admin" className="nav-icon" style={{marginRight: '1rem', fontSize: '0.9rem', textDecoration: 'none', color: 'var(--color-text)'}}>Admin</Link>
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
                if(setActiveCategory) setActiveCategory(link.value);
                setMobileNavOpen(false);
              }}
            >
              {link.label}
            </a>
          ))}
          <Link to="/admin" className="mobile-nav-link" onClick={() => setMobileNavOpen(false)}>Admin Dashboard</Link>
        </div>
      </div>
    </>
  );
};

export default Header;
