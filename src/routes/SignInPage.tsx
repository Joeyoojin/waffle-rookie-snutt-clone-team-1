import { useNavigate } from 'react-router-dom';

export default function SignInPage() {
  const navigate = useNavigate();
  const handleBack = () => {
    // 여기에 뒤로 가기 기능 구현
    navigate('/');
    console.debug('Back button clicked');
  };

  const handleLogin = () => {
    // 여기에 로그인 구현
    console.debug('Login button clicked');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-pretendard">
      <header className="relative flex justify-center items-center p-4 border-b border-gray-200">
        <button
          onClick={handleBack}
          className="absolute left-4 flex items-center text-gray-600"
        >
          <span className="text-2xl">&lt;</span>
          <span className="ml-1 text-base">뒤로</span>
        </button>
        <h1 className="text-lg font-semibold">로그인</h1>
      </header>

      <main className="flex-grow p-6">
        <form className="space-y-6">
          <div>
            <label
              htmlFor="id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              아이디
            </label>
            <input
              type="text"
              id="id"
              placeholder="아이디를 입력하세요"
              className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              비밀번호
            </label>
            <input
              type="text"
              id="password"
              placeholder="비밀번호를 입력하세요"
              className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none text-sm"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span className="underline">아이디 찾기</span>
            <span className="text-gray-300">|</span>
            <span className="underline">비밀번호 재설정</span>
          </div>

          <button
            type="submit"
            onClick={handleLogin}
            className="w-full py-3 rounded-lg font-medium bg-gray-200 text-gray-400"
          >
            로그인
          </button>
        </form>
      </main>
    </div>
  );
}
