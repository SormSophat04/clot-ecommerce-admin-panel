import { Search, Bell, MessageSquare, ShoppingCart, Settings, ChevronDown } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <h2 className="page-title">Dashboard</h2>
        <span className="page-subtitle">Hi, Admin. Welcome back to CLOT!</span>
      </div>

      <div className="header-right">
        <ThemeToggle />
        
        <div className="search-bar">
          <Search className="search-icon" size={18} />
          <input type="text" placeholder="Search products, orders…" />
        </div>

        <div className="utility-actions">
          <div className="action-btn">
            <div className="icon-wrapper bg-rose">
              <Bell size={18} className="icon-rose" />
              <span className="badge badge-rose">4</span>
            </div>
          </div>
          <div className="action-btn">
            <div className="icon-wrapper bg-blue">
              <ShoppingCart size={18} className="icon-blue" />
              <span className="badge badge-blue">12</span>
            </div>
          </div>
          <div className="action-btn">
            <div className="icon-wrapper bg-green">
              <MessageSquare size={18} className="icon-green" />
              <span className="badge badge-green">7</span>
            </div>
          </div>
          <div className="action-btn">
            <div className="icon-wrapper bg-purple">
              <Settings size={18} className="icon-purple" />
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="user-profile">
          <div className="user-avatar">
            <img src="https://ui-avatars.com/api/?name=Admin+Clot&background=E94560&color=fff&bold=true" alt="Admin" />
            <span className="online-dot" />
          </div>
          <div className="user-greeting">
            <p className="user-name">Admin</p>
            <p className="user-role">Super Admin</p>
          </div>
          <ChevronDown size={14} className="chevron" />
        </div>
      </div>
    </header>
  );
};

export default Header;
