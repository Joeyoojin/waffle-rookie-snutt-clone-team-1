import { useNavigate } from 'react-router-dom';

import apple_logo from '../assets/apple_button.png';
import facebook_logo from '../assets/facebook_button.png';
import google_logo from '../assets/google_button.png';
import kakao_logo from '../assets/kakao_button.png';
import waffle_logo from '../assets/waffle_logo.svg';

export default function LandingPage() {
  const navigate = useNavigate();

  const navigateToSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="flex justify-center items-center w-full h-screen bg-white">
      <div className="flex flex-col items-center w-[375px] h-auto">
        <div className="w-16 mt-10 mb-4">
          <img src={waffle_logo} alt="Waffle logo" />
        </div>
        <div className="text-3xl font-extrabold font-SF">TimeTable</div>
        <div className="flex flex-col w-full px-6 mt-20 mb-6">
          <button
            className="w-full py-3 mb-3 rounded-md bg-snutt-orange text-white"
            onClick={navigateToSignIn}
          >
            로그인
          </button>
          <button className="py-3 text-snutt-orange border border-snutt-orange rounded-md">
            회원가입
          </button>
        </div>

        <div className="flex items-center w-full px-4 mt-10 mb-6">
          <div className="flex-1 border-b"></div>
          <div className="px-2 text-sm text-gray-400 whitespace-nowrap">
            SNS 계정으로 계속하기
          </div>
          <div className="flex-1 border-b"></div>
        </div>

        <div className="flex justify-between w-full max-w-xs px-6">
          <img src={kakao_logo} className="w-12 h-12" alt="Kakao" />
          <img src={google_logo} className="w-12 h-12" alt="Google" />
          <img src={facebook_logo} className="w-12 h-12" alt="Facebook" />
          <img src={apple_logo} className="w-12 h-12" alt="Apple" />
        </div>
      </div>
    </div>
  );
}
