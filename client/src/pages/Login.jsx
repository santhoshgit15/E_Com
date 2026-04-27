import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('adminToken', data.token);
                navigate('/admin');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        }
    };

    const containerStyle = {
        maxWidth: '400px',
        margin: '100px auto',
        padding: '2rem',
        background: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    };

    const inputStyle = {
        width: '100%',
        padding: '0.8rem',
        marginBottom: '1rem',
        background: 'var(--color-bg)',
        border: '1px solid var(--color-border)',
        color: 'var(--color-text)',
        borderRadius: '6px',
        fontSize: '1rem'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header cartCount={0} wishlistCount={0} activeCategory="" onCartToggle={() => {}} onSearchToggle={() => {}} />
            
            <main style={{ flex: 1 }}>
                <div style={containerStyle}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>Admin Login</h2>
                    
                    {error && <p style={{ color: '#ff4444', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
                    
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-light)' }}>Username</label>
                            <input 
                                style={inputStyle} 
                                type="text" 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                                required 
                            />
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-light)' }}>Password</label>
                            <input 
                                style={inputStyle} 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>
                            Login to Dashboard
                        </button>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Login;
