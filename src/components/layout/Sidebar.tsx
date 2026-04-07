import { 
  Home, 
  ShoppingBag,
  Package,
  Users, 
  BarChart2, 
  Star, 
  Tag,
  Layers,
  Calendar,
  MessageSquare,
  Percent,
  Settings
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { icon: Home,        label: 'Dashboard',   active: true },
  { icon: ShoppingBag, label: 'Orders' },
  { icon: Package,     label: 'Products' },
  { icon: Layers,      label: 'Categories' },
  { icon: Users,       label: 'Customers' },
  { icon: BarChart2,   label: 'Analytics' },
  { icon: Star,        label: 'Reviews' },
  { icon: Percent,     label: 'Discounts' },
  { icon: Tag,         label: 'Promotions' },
  { icon: Calendar,    label: 'Calendar' },
  { icon: MessageSquare, label: 'Messages' },
  { icon: Settings,    label: 'Settings' },
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <ShoppingBag size={20} color="white" />
        </div>
        <div>
          <h1>CLOT<span>.</span></h1>
          <p>Fashion Admin Panel</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <li key={idx} className={item.active ? 'active' : ''}>
                <a href="#">
                  <Icon size={20} className="nav-icon" />
                  <span>{item.label}</span>
                  {item.active && <span className="active-indicator" />}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="sidebar-promo">
        <div className="promo-icon">🏷️</div>
        <p>Add new products to your store and reach more customers!</p>
        <button className="btn-add-menu">+ Add Product</button>
      </div>
      
      <div className="sidebar-footer">
        <p>CLOT Admin • v2.0</p>
        <p>© 2026 All Rights Reserved</p>
      </div>
    </aside>
  );
};

export default Sidebar;
