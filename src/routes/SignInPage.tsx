import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from './../contexts/AuthContext';

export default function SignInPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleBack = () => {
    navigate('/');
  };

  const [formData, setFormData] = useState({
    id: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const signIn = async (credentials: { id: string; password: string }) => {
    try {
      const response = await fetch(
        'https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/auth/login_local',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        },
      );

      if (!response.ok) {
        throw new Error('아이디 또는 비밀번호를 다시 확인해주세요.');
      }

      const data = (await response.json()) as { token: string };

      localStorage.setItem('token', data.token);
      console.debug('Login Success:', data);

      login(); // 로그인 상태 업데이트
      navigate('/timepage');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('오류가 발생했습니다. 다시 시도해주세요.');
      }
      console.error('Error:', err);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    signIn(formData).catch((err: unknown) => {
      console.error('Login failed:', err);
    });
  };

  const isFormValid = formData.id !== '' && formData.password !== '';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <header className="relative w-[375px] p-4 border-b border-gray-200">
        <button
          onClick={handleBack}
          className="absolute left-4 flex items-center text-gray-600"
        >
          <span className="text-xl">&lt;</span>
          <span className="ml-1 text-semibold mt-1">뒤로</span>
        </button>
        <div className="flex justify-center items-center">
          <h1 className="text-lg font-semibold">로그인</h1>
        </div>
      </header>

      <main className="flex-grow w-[375px] p-6 mt-3">
        <form className="space-y-6" onSubmit={handleLogin}>
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
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              placeholder="아이디를 입력하세요"
              className={`w-full px-3 py-2 border-b focus:outline-none text-sm ${
                formData.id !== '' ? 'border-snutt-orange' : 'border-gray-300'
              }`}
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
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호를 입력하세요"
              className={`w-full px-3 py-2 border-b focus:outline-none text-sm ${
                formData.password !== ''
                  ? 'border-snutt-orange'
                  : 'border-gray-300'
              }`}
            />
          </div>

          {error !== '' && (
            <div className="text-snutt-orange text-sm">{error}</div>
          )}

          <button
            type="submit"
            className={`w-full py-3 mt-6 rounded-lg font-medium ${
              isFormValid
                ? 'bg-snutt-orange text-white'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            로그인
          </button>
        </form>
      </main>
    </div>
  );
}
