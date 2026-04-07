import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ShoppingBag } from 'lucide-react';
import './LoginPage.css';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setIsLoading(true);
    setTimeout(() => { setIsLoading(false); onLogin(); }, 1200);
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="bg-circle bg-circle-1" />
        <div className="bg-circle bg-circle-2" />
        <div className="bg-circle bg-circle-3" />
      </div>

      <div className="login-container">
        {/* ── Left brand panel ── */}
        <div className="login-brand">
          <div className="brand-logo">
            <div className="brand-icon">
              <ShoppingBag size={36} color="white" />
            </div>
            <h1>CLOT<span>.</span></h1>
          </div>
          <p className="brand-tagline">Fashion E-Commerce<br />Admin Dashboard</p>

          <div className="brand-features">
            <div className="feature-item"><div className="feature-dot" /><span>Manage products &amp; inventory</span></div>
            <div className="feature-item"><div className="feature-dot" /><span>Real-time order tracking</span></div>
            <div className="feature-item"><div className="feature-dot" /><span>Customer &amp; sales analytics</span></div>
            <div className="feature-item"><div className="feature-dot" /><span>Promotions &amp; discount tools</span></div>
          </div>

          <div className="brand-categories">
            <div className="category-tag">👕 Shirts</div>
            <div className="category-tag">👖 Jeans</div>
            <div className="category-tag">👟 Shoes</div>
            <div className="category-tag">🧥 Jackets</div>
            <div className="category-tag">👜 Bags</div>
            <div className="category-tag">⌚ Accessories</div>
          </div>

          <div className="brand-stats">
            <div className="stat-item">
              <span className="stat-value">12K+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">8.4K</span>
              <span className="stat-label">Orders</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-value">$128K</span>
              <span className="stat-label">Revenue</span>
            </div>
          </div>
        </div>

        {/* ── Right form panel ── */}
        <div className="login-form-panel">
          <div className="login-form-header">
            <div className="welcome-badge">Admin Portal</div>
            <h2>Welcome Back!</h2>
            <p>Sign in to manage your fashion store</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="email"
                  type="email"
                  placeholder="admin@clot.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" id="remember-me" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-link">Forgot password?</a>
            </div>

            {error && <div className="form-error" role="alert">{error}</div>}

            <button
              id="login-submit"
              type="submit"
              className={`btn-login ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? <span className="spinner" /> : 'Sign In →'}
            </button>
          </form>

          <p className="login-hint">Demo: enter any email &amp; password to continue</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
