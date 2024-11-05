import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuth } from './contexts/AuthContext';
import AccountPage from './routes/AccountPage';
import ChangeNicknamePage from './routes/ChangeNicknamePage';
import LandingPage from './routes/LandingPage';
import MyPage from './routes/MyPage';
import SignInPage from './routes/SignInPage';
import TimePage from './routes/TimePage';

const PrivateRoute = ({ children }: { children: React.JSX.Element }) => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? children : <Navigate to="/signin" replace />;
};

const AppRouter = () => {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {/* 로그인된 상태에서 /로 접근하면 TimePage로 리다이렉트, 로그아웃 상태에서는 LandingPage */}
      <Route path="/" element={isLoggedIn ? <TimePage /> : <LandingPage />} />
      <Route path="/signin" element={<SignInPage />} />

      {/* 로그인된 사용자만 접근 가능한 페이지 */}
      <Route
        path="/mypage"
        element={
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/timepage"
        element={
          <PrivateRoute>
            <TimePage />
          </PrivateRoute>
        }
      />
      <Route path="/mypage/account" element={<AccountPage />} />
      <Route
        path="/mypage/account/change-nickname"
        element={<ChangeNicknamePage />}
      />
    </Routes>
  );
};

export default AppRouter;
