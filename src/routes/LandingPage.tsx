import apple_logo from '../assets/apple_button.png';
import facebook_logo from '../assets/facebook_button.png';
import google_logo from '../assets/google_button.png';
import kakao_logo from '../assets/kakao_button.png';
import waffle_logo from '../assets/waffle_logo.svg';

export default function LandingPage() {
  return (
    <div className="flex flex-col justify-center items-center min-w-[375px] h-screen pb-[90px] bg-[#808080] font-pretendard">
      <div className="w-[59.997px] mt-[232px] mb-[16px]">
        <img src={waffle_logo}></img>
      </div>
      <h1 className="text-xl font-extrabold">TimeTable</h1>
      <div className="w-full px-[32px] mt-[136px] mb-[40px]">
        <button className="w-full p-[12px] mb-[16px] rounded-md bg-snutt-orange">
          로그인
        </button>
        <button className="w-full p-[12px] rounded-md bg-white">
          회원가입
        </button>
      </div>
      <div>SNS 계정으로 계속하기</div>
      <div className="flex px-[12px] pt-[24px]">
        <img src={kakao_logo}></img>
        <img src={google_logo}></img>
        <img src={facebook_logo}></img>
        <img src={apple_logo}></img>
      </div>
    </div>
  );
}
