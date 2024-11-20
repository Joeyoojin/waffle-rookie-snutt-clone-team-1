import './reset.css';
import './App.css';

import { BrowserRouter } from 'react-router-dom';

import AppRouter from './AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import { LectureProvider } from './contexts/LectureContext';

export const App = () => {
  return (
    <AuthProvider>
      <LectureProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </LectureProvider>
    </AuthProvider>
  );
};
