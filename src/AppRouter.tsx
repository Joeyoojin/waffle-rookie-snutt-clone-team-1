import { Route, Routes } from 'react-router-dom';

import RouteGuard from './components/RouteGuard'; 
import { useAuth } from './contexts/AuthContext';
import AccountPage from './routes/AccountPage';
import ChangeNicknamePage from './routes/ChangeNicknamePage';
import LandingPage from './routes/LandingPage';
import MyPage from './routes/MyPage';
import SignInPage from './routes/SignInPage';
import TimePage from './routes/TimePage';

const AppRouter = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {/* 로그인 /로 접근하면 TimePage, 로그아웃은 LandingPage */}
      <Route path="/" element={isLoggedIn ? <TimePage /> : <LandingPage />} />
      <Route path="/signin" element={<SignInPage />} />

  
      <Route path="/mypage" element={<RouteGuard element={<MyPage />} />} />
      <Route
        path="/timepage"
        element={<RouteGuard element={<TimePage />} />}
      />
      <Route
        path="/mypage/account"
        element={<RouteGuard element={<AccountPage />} />}
      />
      <Route
        path="/mypage/account/change-nickname"
        element={<RouteGuard element={<ChangeNicknamePage />} />}
      />
    </Routes>
  );
};

export default AppRouter;
