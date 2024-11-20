import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import RouteGuard from './components/RouteGuard';
import { useAuth } from './contexts/AuthContext';
import { useLectureContext } from './contexts/LectureContext';
import AccountPage from './routes/AccountPage';
import ChangeNicknamePage from './routes/ChangeNicknamePage';
import LectureListPage from './routes/CourseListPage';
import CreatePage from './routes/CreatePage';
import LandingPage from './routes/LandingPage';
import MyPage from './routes/MyPage';
import SignInPage from './routes/SignInPage';
import TimePage from './routes/TimePage';

const AppRouter = () => {
  const { isLoggedIn } = useAuth();
  const { setTimetableId } = useLectureContext();
  const [loading, setLoading] = useState(true);
  const [redirectTimetableId, setRedirectTimetableId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchRecentTimetableId = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (token === null || token === '') {
          console.error('No token found.');
          setLoading(false);
          return;
        }

        const response = await fetch(
          'https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/tables/recent',
          {
            headers: { 'x-access-token': token },
          },
        );

        if (response.ok) {
          const data = (await response.json()) as { _id: string };
          setRedirectTimetableId(data._id);
          setTimetableId(data._id);
        } else {
          console.error(
            'Failed to fetch recent timetable ID:',
            response.status,
          );
        }
      } catch (error) {
        console.error('Error fetching recent timetable ID:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchRecentTimetableId();
  }, [isLoggedIn, setTimetableId]);

  if (loading) {
    return <div>Loading...</div>; // 로딩 화면
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn ? (
            redirectTimetableId !== null && redirectTimetableId !== '' ? (
              <Navigate to={`/timetables/${redirectTimetableId}`} replace />
            ) : (
              <div>시간표가 없습니다. 새로 생성해주세요.</div>
            )
          ) : (
            <LandingPage />
          )
        }
      />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/mypage" element={<RouteGuard element={<MyPage />} />} />
      <Route
        path="/timetables/:id"
        element={<RouteGuard element={<TimePage />} />}
      />
      <Route
        path="/timetables/:id/lectures"
        element={<RouteGuard element={<LectureListPage />} />}
      />
      <Route
        path="/mypage/account"
        element={<RouteGuard element={<AccountPage />} />}
      />
      <Route
        path="/mypage/account/change-nickname"
        element={<RouteGuard element={<ChangeNicknamePage />} />}
      />
      <Route
        path="/timetables/:id/new"
        element={<RouteGuard element={<CreatePage />} />}
      />
    </Routes>
  );
};

export default AppRouter;
