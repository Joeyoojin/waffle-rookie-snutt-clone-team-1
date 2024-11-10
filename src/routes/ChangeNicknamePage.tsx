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

export default function ChangeNicknamePage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isValidNickname = (nick: string) => {
    if (nick.length === 0 || nick.length > 10) return false;
    return /^[가-힣a-zA-Z0-9\s]+$/.test(nick);
  };

  const handleUpdateNickname = async () => {
    if (!isValidNickname(nickname)) {
      throw new Error('올바른 닉네임을 입력해주세요.');
    }

    setIsLoading(true);

    const token = localStorage.getItem('token');
    if (token === null) {
      setIsLoading(false);
      throw new Error('로그인이 필요합니다.');
    }

    try {
      const response = await fetch(
        'https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/users/me',
        {
          method: 'PATCH',
          headers: {
            'x-access-token': token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nickname: nickname,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('닉네임 변경에 실패했습니다.');
      }

      const updatedUserInfo = (await response.json()) as UserInfo;
      setUserInfo(updatedUserInfo);
      navigate('/mypage/account');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
          throw new Error('사용자 정보를 가져오는데 실패했습니다.');
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
      <div className=" mx-auto bg-white min-h-screen flex flex-col">
        <header className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                navigate('/mypage/account');
              }}
            >
              &lt; 내 계정
            </button>
            <h1 className="text-lg font-semibold flex-1 text-center mr-6">
              닉네임 변경
            </h1>
            <button
              className={
                isValidNickname(nickname) ? 'text-black' : 'text-gray-400'
              }
              disabled={!isValidNickname(nickname) || isLoading}
              onClick={() => void handleUpdateNickname()}
            >
              저장
            </button>
          </div>
        </header>

        <main className="p-3 flex-1 bg-gray-50">
          <div className="space-y-4">
            <div className="text-sm text-gray-500">
              닉네임 (공백 포함 한/영/숫자 10자 이내)
            </div>

            <div className="bg-white rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  placeholder={userInfo.nickname.nickname}
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                  }}
                  className="flex-1 border-none outline-none"
                  maxLength={10}
                  disabled={isLoading}
                />
                <div className="text-gray-400 text-sm ml-2">#NNNN</div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600 mt-6">
              <p>
                최초 닉네임은 가입 시 임의 부여된 닉네임으로, 앞의 이름을 변경할
                시 4자리 숫자 태그는 자동 변경됩니다.
              </p>
              <p>변경된 닉네임은 나의 모든 친구에게 반영됩니다.</p>

              <div className="mt-8">
                <h3 className=" mt-8 mb-2 ml-2 font-semibold">닉네임 조건</h3>
                <ul className="space-y-1">
                  <li>• 불완전한 한글(예: ㄱ, ㅏ)은 포함될 수 없습니다.</li>
                  <li>• 영문 대/소문자는 구분됩니다.</li>
                  <li>
                    • 상대에게 불쾌감을 주는 등 부적절한 닉네임은 관리자에 의해
                    안내 없이 수정될 수 있습니다.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
        <MenuBar />
      </div>
    </div>
  );
}
