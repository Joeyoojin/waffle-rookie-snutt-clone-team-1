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

export default function AccountPage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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
          throw new Error('Failed to fetch user info');
        }

        const data = (await response.json()) as UserInfo;
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

  if (userInfo === null) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-500">
        오류가 발생했습니다. 잠시 후에 다시 시도해주세요.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto bg-white min-h-screen flex flex-col">
        <header className="p-3 border-b border-gray-200">
          <div className="flex items-center">
            <button
              onClick={() => {
                navigate('/mypage');
              }}
              className="mr-4 w-20 text-left"
            >
              &lt; 더보기
            </button>
            <h1 className="text-lg font-semibold flex-1 text-center">
              내 계정
            </h1>
            <div className="w-20" />
          </div>
        </header>

        <main className="flex-1 p-3 bg-gray-50">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="divide-y divide-gray-200">
                <div
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => {
                    navigate('/mypage/account/change-nickname');
                  }}
                >
                  <span className="text-sm">닉네임 변경</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {userInfo.nickname.nickname}#{userInfo.nickname.tag}
                    </span>
                    <span className="text-gray-500">&gt;</span>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm">닉네임 복사하기</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm">아이디</span>
                <span className="text-sm text-gray-500">
                  {userInfo.localId}
                </span>
              </div>
              <div className="p-4 flex items-center justify-between border-t">
                <span className="text-sm">비밀번호 변경</span>
                <span className="text-gray-500">&gt;</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm">SNS 계정 연동 및 해제</span>
                <span className="text-gray-500">&gt;</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm">이메일</span>
                <span className="text-sm text-gray-500">{userInfo.email}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="p-4">
                <span className="text-sm text-red-500">회원 탈퇴</span>
              </div>
            </div>
          </div>
        </main>
        <MenuBar />
      </div>
    </div>
  );
}
