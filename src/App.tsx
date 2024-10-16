import './reset.css';
import './App.css';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LandingPage from './routes/LandingPage';
import MyPage from './routes/MyPage';
import SignInPage from './routes/SignInPage';
import TimePage from './routes/TimePage';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/timepage" element={<TimePage />} />
      </Routes>
    </BrowserRouter>
  );
};
