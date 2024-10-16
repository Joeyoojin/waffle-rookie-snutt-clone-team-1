import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import loading_lottie from '../assets/loading_lottie.json';

interface UserInfo {
  nickname: {
    nickname: string;
    tag: string;
  };
  id: string;
  isAdmin: boolean;
  regDate: string;
  notificationCheckedAt: string;
  email: string;
  localId: string;
  fbName: string;
}

export default function UserInfoPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const navigateToTime = () => {
    navigate('/timepage');
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');

      if (token === null || token.trim() === '') {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          'https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/users/me',
          {
            headers: { 'x-access-token': token },
          },
        );

        if (!response.ok) {
          const errorMessage = await response.text();
          console.error('Error:', errorMessage);
          throw new Error('Failed to fetch user info');
        }

        const data = (await response.json()) as UserInfo;
        console.debug('User info fetched:', data);
        setUserInfo(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo().catch((err: unknown) => {
      console.error('Failed to fetch user info:', err);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie
          animationData={loading_lottie}
          loop={true}
          autoplay={true}
          style={{ width: 200, height: 200 }}
        />
      </div>
    );
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      {userInfo !== null ? (
        <div>
          <div className="text-lg font-bold">
            <span className="text-snutt-orange font-extrabold">
              {userInfo.nickname.nickname}#{userInfo.nickname.tag}
            </span>{' '}
            님 <br /> 오늘도 알찬 하루 되세요!
          </div>
          <button
            className="py-3 mt-5 bg-snutt-yellow text-extrabold text-white w-full rounded-md"
            onClick={navigateToTime}
          >
            시간표 바로가기
          </button>
        </div>
      ) : (
        <div className="text-gray-500">
          오류가 발생했습니다. 잠시 후에 다시 시도해주세요.
        </div>
      )}
    </div>
  );
}
