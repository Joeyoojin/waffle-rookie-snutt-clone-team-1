import './reset.css';
import './App.css';

import { BrowserRouter } from 'react-router-dom';

import AppRouter from './AppRouter';
import { AuthProvider } from './contexts/AuthContext';

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  );
};
