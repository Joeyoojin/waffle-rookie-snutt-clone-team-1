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
    <div className="flex flex-col justify-center items-center min-w-[375px] h-screen pb-[90px] bg-white font-pretendard">
      <div className="w-[59.997px] mt-[232px] mb-[16px]">
        <img src={waffle_logo}></img>
      </div>
      <h1 className="text-xl font-extrabold">TimeTable</h1>
      <div className="flex flex-col w-full px-[32px] mt-[136px] mb-[40px]">
        <button
          className="w-full p-[12px] mb-[16px] rounded-md bg-snutt-orange"
          onClick={navigateToSignIn}
        >
          로그인
        </button>
        <button className="p-[12px]">회원가입</button>
      </div>
      <div className="flex items-center">
        <div className="inline w-[100px] border-b-2"></div>
        <div className="inline px-[10px] text-gray-400">
          SNS 계정으로 계속하기
        </div>
        <div className="inline w-[100px] border-b-2"></div>
      </div>

      <div className="flex justify-center w-screen px-[12px] pt-[24px] mx-[12px]">
        <img src={kakao_logo} className="pr-3"></img>
        <img src={google_logo} className="pr-3"></img>
        <img src={facebook_logo} className="pr-3"></img>
        <img src={apple_logo}></img>
      </div>
    </div>
  );
}
