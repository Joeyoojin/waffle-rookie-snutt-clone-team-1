import './reset.css';
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LandingPage from './routes/LandingPage';
import SignInPage from './routes/SignInPage';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
      </Routes>
    </BrowserRouter>
  );
};
