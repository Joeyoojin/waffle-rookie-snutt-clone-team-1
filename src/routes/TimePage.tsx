import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

import loading_lottie from '../assets/loading_lottie.json';
import MenuBar from '../components/MenuBar';

type Day = 0 | 1 | 2 | 3 | 4;
const DAY_LABEL_MAP = {
  0: '월',
  1: '화',
  2: '수',
  3: '목',
  4: '금',
};
const dayList: Day[] = [0, 1, 2, 3, 4];

type ClassTime = {
  day: string;
  place: string;
  startMinute: number;
  endMinute: number;
};

type Lecture = {
  course_title: string;
  credit: number;
  class_time_json: ClassTime[];
};

type ClassItem = {
  day: Day;
  startTime: { hour: number; minute: number };
  endTime: { hour: number; minute: number };
  name: string;
  location: string;
};

const minutesToTime = (minutes: number) => ({
  hour: Math.floor(minutes / 60),
  minute: minutes % 60,
});

const timeInMinutesFromStart = (time: { hour: number; minute: number }) =>
  (time.hour - 9) * 60 + time.minute;

export default function TimePage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [totalCredits, setTotalCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        const uniqueCourses = new Set(
          data.lecture_list.map((l) => l.course_title),
        );
        const credits = data.lecture_list.reduce(
          (sum, lecture) =>
            uniqueCourses.has(lecture.course_title)
              ? (uniqueCourses.delete(lecture.course_title),
                sum + lecture.credit)
              : sum,
          0,
        );

        setTotalCredits(credits);

        const transformedClasses: ClassItem[] = data.lecture_list.flatMap(
          (lecture) =>
            lecture.class_time_json.map((time) => ({
              day: parseInt(time.day) as Day,
              startTime: minutesToTime(time.startMinute),
              endTime: minutesToTime(time.endMinute),
              name: lecture.course_title,
              location: time.place,
              credit: lecture.credit,
            })),
        );

        setClasses(transformedClasses);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch class data',
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

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
    <div className="flex flex-col h-screen pt-11 bg-white">
      {/* Page Header */}
      <div className="flex items-center h-11 flex-none pt-2 pb-1.5 pl-4 pr-3 mb-1 border-b border-gray-300">
        <HamburgerMenuIcon className="mr-3" />
        <p className="mr-2 text-lg font-bold">a안</p>
        <p className="text-xs font-normal text-gray-400">
          ({totalCredits}학점)
        </p>
      </div>

      {/* Schedule Content */}
      <div className="flex-1 min-h-0">
        {/* Days Header Row */}
        <div className="grid grid-cols-[15px_repeat(5,1fr)] h-8 border-b">
          <div />
          {dayList.map((day) => (
            <div
              key={day}
              className="text-center text-xs text-slate-500 font-thin border-l flex items-center justify-center"
            >
              {DAY_LABEL_MAP[day]}
            </div>
          ))}
        </div>

        {/* Schedule Grid */}
        <div className="grid grid-rows-13 h-[calc(100%-2rem)]">
          {Array.from({ length: 13 }, (_, i) => i + 9).map((hour) => (
            <div
              key={hour}
              className="grid grid-cols-[15px_repeat(5,1fr)] border-b"
            >
              {/* Time Column */}
              <div className="text-center text-[10px] text-slate-500 font-thin flex justify-center">
                {hour}
              </div>

              {/* Day Columns */}
              {dayList.map((day) => (
                <div key={day} className="border-l relative">
                  {classes
                    .filter((item) => item.day === day)
                    .map((item) => {
                      const classStart = timeInMinutesFromStart(item.startTime);
                      const hourStart = timeInMinutesFromStart({
                        hour: hour,
                        minute: 0,
                      });
                      const hourEnd = hourStart + 60;

                      if (
                        classStart < hourEnd &&
                        timeInMinutesFromStart(item.endTime) > hourStart
                      ) {
                        const startOffset =
                          ((classStart - hourStart) / 60) * 100;
                        const duration =
                          ((timeInMinutesFromStart(item.endTime) - classStart) /
                            60) *
                          100;

                        return (
                          <div
                            key={`${item.name}-${item.location}-${classStart}`}
                            className="absolute content-center bg-slate-600 w-full px-1.5 py-[17px] text-white text-center"
                            style={{
                              top: `${startOffset}%`,
                              height: `${duration}%`,
                            }}
                          >
                            <div className="font-normal text-[10px] mb-1">
                              {item.name}
                            </div>
                            <div className="font-bold text-xs">
                              {item.location}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <MenuBar />
    </div>
  );
}
