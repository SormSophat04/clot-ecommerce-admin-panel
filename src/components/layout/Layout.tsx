import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  onLogout?: () => void;
  activePage: string;
  onPageChange: (page: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout, activePage, onPageChange }) => {
  return (
    <div className="layout-container">
      <Sidebar activePage={activePage} onPageChange={onPageChange} />
      <div className="main-wrapper">
        <Header onLogout={onLogout} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
