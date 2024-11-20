import {
  ChevronLeftIcon,
  ClockIcon,
  FileTextIcon,
  PlusIcon,
  SewingPinIcon,
} from '@radix-ui/react-icons';
import Lottie from 'lottie-react';
import { useNavigate, useParams } from 'react-router-dom';

import loading_lottie from '../assets/loading_lottie.json';
import MenuBar from '../components/MenuBar';
import { useLectureContext } from '../contexts/LectureContext';
import { DAY_LABEL_MAP } from './TimePage';

type LectureDetails = {
  id: string;
  name: string;
  professor: string;
  credit: number;
  department: string;
  academic_year: string;
  day: string | undefined;
  times: string[];
  location: string;
};

const formatTime = (minutes: number): string => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
};

export default function LectureListPage() {
  const { lectures, isLoading, error } = useLectureContext();
  const { id: timetableId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const transformedLectures: LectureDetails[] = lectures.map((lecture) => {
    const times: string[] = lecture.class_time_json.map((time) => {
      const day = parseInt(time.day);
      const dayLabel = DAY_LABEL_MAP[day];
      return `${dayLabel ?? ''}(${formatTime(time.startMinute)}~${formatTime(time.endMinute)})`;
    });

    return {
      id: lecture._id,
      name: lecture.course_title,
      professor: lecture.instructor,
      credit: lecture.credit,
      department: lecture.department,
      academic_year: lecture.academic_year,
      day: times.length > 0 && times[0] != null ? times[0].split('(')[0] : '',
      times,
      location:
        lecture.class_time_json[0] != null &&
        lecture.class_time_json[0].place !== ''
          ? lecture.class_time_json[0].place
          : '(없음)',
    };
  });

  if (error != null && error !== '') {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

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
    <div>
      {/* Header */}
      <div className="flex h-12 justify-between flex-none pt-3 pb-1.5 px-3 border-b border-gray-300 sticky top-0 bg-white">
        <div className="flex justify-start items-center gap-1">
          <ChevronLeftIcon
            onClick={() => {
              if (timetableId != null && timetableId !== '') {
                navigate(`/timetables/${timetableId}`);
              } else {
                console.error('timetableId가 정의되지 않았습니다.');
              }
            }}
            className="w-5 h-5"
          />
          <p className="text-md font-normal">뒤로</p>
        </div>
        <div className="flex justify-start items-center gap-1">
          <PlusIcon
            onClick={() => {
              if (timetableId != null && timetableId !== '') {
                navigate(`/timetables/${timetableId}/new`);
              } else {
                console.error('timetableId가 정의되지 않았습니다.');
                alert('유효하지 않은 시간표 ID입니다.');
              }
            }}
            className="w-5 h-5"
          />
        </div>
      </div>

      {/* Course List */}
      <div className="flex-1 min-h-0 pb-[50px] overflow-y-auto">
        <ul className="px-4">
          {transformedLectures.length === 0 ? (
            <li className="text-s text-center text-gray-500">
              시간표에 강좌가 없습니다.
            </li>
          ) : (
            transformedLectures.map((lecture) => (
              <li key={lecture.id} className="py-3 border-b-[1px]">
                <div className="flex mb-2">
                  <span className="grow text-sm font-semibold">
                    {lecture.name}
                  </span>
                  <span className="text-xs">
                    {lecture.professor}/{lecture.credit}학점
                  </span>
                </div>
                <div className="flex mb-2">
                  <FileTextIcon className="mr-1" />
                  <span className="text-xs">
                    {lecture.department}, {lecture.academic_year}
                  </span>
                </div>
                <div className="flex mb-2">
                  <ClockIcon className="mr-1" />
                  {lecture.times.map((time, idx) => (
                    <span key={idx} className="text-xs mr-1">
                      {time}
                    </span>
                  ))}
                </div>
                <div className="flex">
                  <SewingPinIcon className="mr-1" />
                  <span className="text-xs">{lecture.location}</span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      <MenuBar />
    </div>
  );
}
