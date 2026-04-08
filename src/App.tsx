import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './Dashboard';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import BrandPage from './pages/BrandPage';
import AttributePage from './pages/AttributePage';
import LoginPage from './pages/LoginPage';
import { useState } from 'react';
import { useAuth } from './hooks/api';
import './App.css';

function App() {
  const { isAuthenticated, isLoading, isError, logout } = useAuth();
  const [activePage, setActivePage] = useState('Dashboard');

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  // If check session fails or is not authenticated, show login
  if (isError || !isAuthenticated) {
    return (
      <ThemeProvider>
        <LoginPage onLogin={() => {}} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Layout onLogout={logout} activePage={activePage} onPageChange={setActivePage}>
        {activePage === 'Dashboard' && <Dashboard />}
        {activePage === 'Products' && <ProductPage />}
        {activePage === 'Categories' && <CategoryPage />}
        {activePage === 'Brands' && <BrandPage />}
        {activePage === 'Colors & Sizes' && <AttributePage />}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
