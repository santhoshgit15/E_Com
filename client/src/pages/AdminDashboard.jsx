import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '', brand: '', price: '', originalPrice: '', image: '', badge: '', category: '', description: '', colors: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const token = localStorage.getItem('adminToken');
    return { 'Authorization': `Bearer ${token}` };
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    const colorsArray = formData.colors ? formData.colors.split(',').map(c => c.trim()) : [];
    
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      colors: colorsArray
    };

    try {
      const url = editingId 
        ? `http://localhost:5000/api/products/${editingId}` 
        : 'http://localhost:5000/api/products';
      
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(payload)
      });

      if (response.status === 401 || response.status === 403) {
        handleLogout();
        return;
      }

      if (response.ok) {
        setMessage({ text: `Product ${editingId ? 'updated' : 'added'} successfully!`, type: 'success' });
        setFormData({ name: '', brand: '', price: '', originalPrice: '', image: '', badge: '', category: '', description: '', colors: '' });
        setEditingId(null);
        fetchProducts();
      } else {
        const errData = await response.json();
        setMessage({ text: errData.error || 'Operation failed', type: 'error' });
      }
    } catch (err) {
      console.error("Error saving product:", err);
      setMessage({ text: 'Network error. Please try again.', type: 'error' });
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      brand: product.brand,
      price: product.price,
      originalPrice: product.originalPrice || '',
      image: product.image || '',
      badge: product.badge || '',
      category: product.category || '',
      description: product.description || '',
      colors: product.colors ? product.colors.join(', ') : ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`, { 
          method: 'DELETE',
          headers: getAuthHeader()
        });

        if (response.status === 401 || response.status === 403) {
          handleLogout();
          return;
        }

        if (response.ok) {
          setMessage({ text: 'Product deleted successfully', type: 'success' });
          fetchProducts();
        }
      } catch (err) {
        console.error("Error deleting product:", err);
      }
    }
  };

  const formStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '2rem',
    background: 'var(--color-surface)',
    padding: '2rem',
    borderRadius: '12px',
    border: '1px solid var(--color-border)'
  };

  const inputStyle = {
    padding: '0.8rem',
    background: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    color: 'var(--color-text)',
    borderRadius: '6px'
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}>
      <Header cartCount={0} wishlistCount={0} activeCategory="" onCartToggle={() => {}} onSearchToggle={() => {}} />
      
      <main className="container" style={{paddingTop: '6rem', flex: 1, paddingBottom: '4rem'}}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{fontSize: '2rem', fontFamily: 'var(--font-heading)'}}>Admin Dashboard</h1>
          <button onClick={handleLogout} className="btn" style={{ background: 'transparent', border: '1px solid #ff4444', color: '#ff4444', padding: '0.5rem 1.5rem' }}>
            Logout
          </button>
        </div>

        {message.text && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: '6px', 
            marginBottom: '1rem', 
            textAlign: 'center',
            background: message.type === 'success' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)',
            color: message.type === 'success' ? '#44ff44' : '#ff4444',
            border: `1px solid ${message.type === 'success' ? '#44ff44' : '#ff4444'}`
          }}>
            {message.text}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={formStyle}>
          <input style={inputStyle} name="name" value={formData.name} onChange={handleInputChange} placeholder="Product Name" required />
          <input style={inputStyle} name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Brand" required />
          <input style={inputStyle} type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} placeholder="Price" required />
          <input style={inputStyle} type="number" step="0.01" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} placeholder="Original Price" />
          <input style={inputStyle} name="image" value={formData.image} onChange={handleInputChange} placeholder="Image URL (e.g. /images/product-1.png)" />
          <input style={inputStyle} name="badge" value={formData.badge} onChange={handleInputChange} placeholder="Badge (e.g. New, Sale)" />
          <input style={inputStyle} name="category" value={formData.category} onChange={handleInputChange} placeholder="Category" />
          <input style={inputStyle} name="colors" value={formData.colors} onChange={handleInputChange} placeholder="Colors (comma separated)" />
          <textarea style={{...inputStyle, gridColumn: '1 / -1'}} name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" rows="3"></textarea>
          
          <div style={{gridColumn: '1 / -1', display: 'flex', gap: '1rem'}}>
            <button type="submit" className="btn btn-primary" style={{padding: '0.8rem 2rem'}}>
              {editingId ? 'Update Product' : 'Add Product'}
            </button>
            {editingId && (
              <button type="button" className="btn" onClick={() => { setEditingId(null); setFormData({ name: '', brand: '', price: '', originalPrice: '', image: '', badge: '', category: '', description: '', colors: '' }); }} style={{padding: '0.8rem 2rem', background: 'transparent', border: '1px solid var(--color-border)', color: 'var(--color-text)'}}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div style={{overflowX: 'auto'}}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '2rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-light)' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-light)' }}>Image</th>
                <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-light)' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-light)' }}>Price</th>
                <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-light)' }}>Category</th>
                <th style={{ textAlign: 'left', padding: '1rem', borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-light)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>{p.id}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                    <img src={p.image} alt={p.name} style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px'}} />
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>{p.name}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>₹{p.price}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>{p.category}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)' }}>
                    <button onClick={() => handleEdit(p)} style={{marginRight: '0.5rem', padding: '0.4rem 0.8rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)', borderRadius: '4px', cursor: 'pointer'}}>Edit</button>
                    <button onClick={() => handleDelete(p.id)} style={{padding: '0.4rem 0.8rem', background: '#3a1a1a', border: '1px solid #ff4444', color: '#ff4444', borderRadius: '4px', cursor: 'pointer'}}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
