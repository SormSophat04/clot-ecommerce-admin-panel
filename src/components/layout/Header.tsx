import { Search, Bell, MessageSquare, ShoppingCart, Settings, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/api';
import ThemeToggle from '../ui/ThemeToggle';
import './Header.css';

interface HeaderProps {
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { user } = useAuth();

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="page-title">Dashboard</h2>
        <span className="page-subtitle">Hi, {user?.name || 'Admin'}. Welcome back to CLOT!</span>
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
            <img
              src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=E94560&color=fff&bold=true`}
              alt={user?.name || 'Admin'}
            />
            <span className="online-dot" />
          </div>
          <div className="user-greeting">
            <p className="user-name">{user?.name || 'Admin'}</p>
            <p className="user-role">{user?.role === 'admin' ? 'Super Admin' : user?.role || 'Admin'}</p>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
          <ChevronDown size={14} className="chevron" />
        </div>
      </div>
    </header>
  );
};

export default Header;
