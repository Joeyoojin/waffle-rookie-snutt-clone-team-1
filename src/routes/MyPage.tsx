import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import loading_lottie from '../assets/loading_lottie.json';
import MenuBar from '../components/MenuBar';

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

export default function MyPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const navigateToAccount = () => {
    navigate('/mypage/account');
  };

  // const navigateToTime = () => {
  //   navigate('/timepage');
  // };

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
    <div className="min-h-screen">
      <div className=" mx-auto bg-white min-h-screen flex flex-col">
        <header className="p-3 border-b border-gray-200">
          <div className="flex justify-center items-center">
            <h1 className="text-lg font-semibold">더보기</h1>
          </div>
        </header>

        <main className="flex-1 p-3 bg-gray-50">
          {userInfo !== null ? (
            <div>
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow">
                  <div
                    className="p-3 flex items-center justify-between"
                    onClick={navigateToAccount}
                  >
                    <h2 className="text-sm">내 계정</h2>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-500">
                        {userInfo.nickname.nickname}#{userInfo.nickname.tag}
                      </span>
                      <span className="text-sm text-gray-500">&gt;</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="p-2 text-sm font-sm text-gray-500">
                    디스플레이
                  </h2>

                  <div className="bg-white rounded-lg shadow">
                    <div className="divide-y divide-gray-200">
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-sm">색상 모드</span>
                        <span className="text-sm text-gray-500">자동 &gt;</span>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-sm">시간표 설정</span>
                        <span className="text-sm text-gray-500">&gt;</span>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-sm">시간표 테마</span>
                        <span className="text-sm text-gray-500">&gt;</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="p-2 text-sm font-sm text-gray-500">서비스</h2>
                  <div className="bg-white rounded-lg shadow">
                    <div className="divide-y divide-gray-200">
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-sm">빈자리 알림</span>
                        <span className="text-sm text-gray-500">&gt;</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="p-2 text-sm font-sm text-gray-500">
                    정보 및 제안
                  </h2>
                  <div className="bg-white rounded-lg shadow">
                    <div className="divide-y divide-gray-200">
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-sm">버전 정보</span>
                        <span className="text-sm text-gray-500">
                          v3.8.0-release.7
                        </span>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-sm">개발자 정보</span>
                        <span className="text-sm text-gray-500">&gt;</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-white rounded-lg shadow">
                    <div className="divide-y divide-gray-200">
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-sm">개발자 괴롭히기</span>
                        <span className="text-sm text-gray-500">&gt;</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-white rounded-lg shadow">
                    <div className="divide-y divide-gray-200">
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-sm">오픈소스 라이선스</span>
                        <span className="text-sm text-gray-500">&gt;</span>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-sm">서비스 약관</span>
                        <span className="text-sm text-gray-500">&gt;</span>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-sm">개인정보처리방침</span>
                        <span className="text-sm text-gray-500">&gt;</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="bg-white rounded-lg shadow">
                    <div
                      className="divide-y divide-gray-200"
                      onClick={handleLogout}
                    >
                      <div className="p-3 flex items-center justify-between">
                        <span className="text-sm text-red-500">로그아웃</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">
              오류가 발생했습니다. 잠시 후에 다시 시도해주세요.
            </div>
          )}
        </main>
        <MenuBar />
      </div>
    </div>
  );
}
