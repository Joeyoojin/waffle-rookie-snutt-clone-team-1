import {
  ChevronLeftIcon,
  ClockIcon,
  FileTextIcon,
  PlusIcon,
  SewingPinIcon,
} from '@radix-ui/react-icons';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import loading_lottie from '../assets/loading_lottie.json';
import MenuBar from '../components/MenuBar';
import type { Lecture } from './TimePage';
import { DAY_LABEL_MAP } from './TimePage';

type LectureDetails = {
  id: string;
  name: string;
  professor: string;
  credit: number;
  department: string;
  academic_year: string;
  day: string;
  times: string[];
  location: string;
};

export default function LectureListPage() {
  const [lectures, setLectures] = useState<LectureDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    void (async () => {
      const token = localStorage.getItem('token');

      if (token === null || token.trim() === '') {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          'https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/tables/recent',
          {
            headers: {
              'x-access-token': token,
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch class data');
        }

        const data = (await response.json()) as {
          lecture_list: Lecture[];
        };

        const groupedLectures: { [name: string]: LectureDetails } = {};

        data.lecture_list.forEach((lecture) => {
          lecture.class_time_json.forEach((time) => {
            const day = parseInt(time.day);
            const dayLabel = DAY_LABEL_MAP[day];
            if (dayLabel !== undefined) {
              const timeRange = `${dayLabel}(${formatTime(time.startMinute)}~${formatTime(time.endMinute)})`;
              if (groupedLectures[lecture.course_title] !== undefined) {
                (
                  groupedLectures[lecture.course_title] as LectureDetails
                ).times.push(timeRange);
              } else {
                groupedLectures[lecture.course_title] = {
                  id: lecture._id,
                  name: lecture.course_title,
                  professor: lecture.instructor,
                  credit: lecture.credit,
                  department: lecture.department,
                  academic_year: lecture.academic_year,
                  day: dayLabel,
                  times: [timeRange],
                  location: time.place,
                };
              }
            }
          });
        });

        const lecturesWithDetails = Object.entries(groupedLectures).map(
          ([
            title,
            {
              id,
              professor,
              credit,
              department,
              academic_year,
              day,
              location,
              times,
            },
          ]) => ({
            id,
            name: title,
            professor,
            credit,
            department,
            academic_year,
            day,
            times,
            location,
          }),
        );

        setLectures(lecturesWithDetails);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch class data',
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const formatTime = (minutes: number): string => {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  if (error !== null) {
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
      <div className="flex items-center h-11 flex-none pt-2 pb-1.5 pl-4 pr-3 border-b border-gray-300 sticky top-0 bg-white">
        <ChevronLeftIcon
          onClick={() => {
            navigate('/timepage');
          }}
        />
        <p className="grow text-s font-normal">뒤로</p>
        <PlusIcon />
      </div>

      {/* Course List */}
      <div className="flex-1 min-h-0 pb-[50px] overflow-y-auto">
        <ul className="px-4">
          {lectures.length === 0 ? (
            <li className="text-s text-center text-gray-500">
              시간표에 강좌가 없습니다.
            </li>
          ) : (
            lectures.map((lecture) => (
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
