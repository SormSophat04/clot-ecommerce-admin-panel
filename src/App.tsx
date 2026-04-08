import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './Dashboard';
import LoginPage from './pages/LoginPage';
import { useAuth } from './hooks/api';
import './App.css';

function App() {
  const { isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <LoginPage onLogin={() => {}} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Layout onLogout={logout}>
        <Dashboard />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
