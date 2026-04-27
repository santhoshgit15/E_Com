import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      padding: '4rem 2rem',
      background: 'var(--color-surface)',
      borderTop: '1px solid var(--color-border)',
      marginTop: 'auto'
    }}>
      <div className="container" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem'
      }}>
        <div>
          <h3 style={{fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: '1rem'}}>LUXE</h3>
          <p style={{color: 'var(--color-text-light)'}}>Elevating everyday style with premium quality and timeless design.</p>
        </div>
        <div>
          <h4 style={{marginBottom: '1rem', fontWeight: '500'}}>Shop</h4>
          <ul style={{listStyle: 'none', padding: 0}}>
            <li style={{marginBottom: '0.5rem'}}><a href="#" style={{textDecoration: 'none', color: 'var(--color-text-light)'}}>New Arrivals</a></li>
            <li style={{marginBottom: '0.5rem'}}><a href="#" style={{textDecoration: 'none', color: 'var(--color-text-light)'}}>Clothing</a></li>
            <li style={{marginBottom: '0.5rem'}}><a href="#" style={{textDecoration: 'none', color: 'var(--color-text-light)'}}>Dresses</a></li>
            <li style={{marginBottom: '0.5rem'}}><a href="#" style={{textDecoration: 'none', color: 'var(--color-text-light)'}}>Sale</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{marginBottom: '1rem', fontWeight: '500'}}>Support</h4>
          <ul style={{listStyle: 'none', padding: 0}}>
            <li style={{marginBottom: '0.5rem'}}><a href="#" style={{textDecoration: 'none', color: 'var(--color-text-light)'}}>FAQ</a></li>
            <li style={{marginBottom: '0.5rem'}}><a href="#" style={{textDecoration: 'none', color: 'var(--color-text-light)'}}>Shipping & Returns</a></li>
            <li style={{marginBottom: '0.5rem'}}><a href="#" style={{textDecoration: 'none', color: 'var(--color-text-light)'}}>Contact Us</a></li>
          </ul>
        </div>
      </div>
      <div style={{
        textAlign: 'center', 
        marginTop: '3rem', 
        paddingTop: '2rem', 
        borderTop: '1px solid var(--color-border)',
        color: 'var(--color-text-light)',
        fontSize: '0.9rem'
      }}>
        <p>&copy; {new Date().getFullYear()} LUXE E-Commerce. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
