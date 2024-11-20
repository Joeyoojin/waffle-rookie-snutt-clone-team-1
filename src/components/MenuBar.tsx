import { useLocation, useNavigate } from 'react-router-dom';

import SearchOff from '../assets/icon/search_off';
import SettingOff from '../assets/icon/setting_off';
import SettingOn from '../assets/icon/setting_on';
import TimetableOff from '../assets/icon/timetable_off';
import TimetableOn from '../assets/icon/timetable_on';
import { useLectureContext } from '../contexts/LectureContext';
import FriendOff from './../assets/icon/friend_off';
import ReviewOff from './../assets/icon/review_off';

const MenuBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { timetableId } = useLectureContext();

  const isTimePage =
    location.pathname.startsWith('/timetables') &&
    location.pathname.includes('/lectures');
  const isMyPage = location.pathname.startsWith('/mypage');

  return (
    <div className="h-[50px] px-[30px] py-2.5 pb-4 justify-between items-center inline-flex bg-white fixed bottom-0 left-0 right-0">
      <div
        onClick={() => {
          if (timetableId != null && timetableId !== '') {
            navigate(`/timetables/${timetableId}`);
          } else {
            console.error('timetableId is undefined.');
          }
        }}
        className="cursor-pointer"
      >
        {isTimePage ? (
          <TimetableOff width="30" height="30" />
        ) : (
          <TimetableOn width="30" height="30" />
        )}
      </div>
      <div>
        <SearchOff width="30" height="30" />
      </div>
      <div>
        <FriendOff width="30" height="30" />
      </div>
      <div>
        <ReviewOff width="30" height="30" />
      </div>
      <div
        onClick={() => {
          navigate('/mypage');
        }}
        className="cursor-pointer"
      >
        {isMyPage ? (
          <SettingOn width="30" height="30" />
        ) : (
          <SettingOff width="30" height="30" />
        )}
      </div>
    </div>
  );
};

export default MenuBar;
