import {
  BellIcon,
  HamburgerMenuIcon,
  ListBulletIcon,
  Share1Icon,
} from '@radix-ui/react-icons';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import loading_lottie from '../assets/loading_lottie.json';
import MenuBar from '../components/MenuBar';
import { useLectureContext } from '../contexts/LectureContext';

type Day = 0 | 1 | 2 | 3 | 4;
export const DAY_LABEL_MAP: { [key: number]: string } = {
  0: '월',
  1: '화',
  2: '수',
  3: '목',
  4: '금',
};
const dayList: Day[] = [0, 1, 2, 3, 4];

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
  const { id: timetableId } = useParams<{ id: string }>();
  const { lectures, isLoading, error, setTimetableId } = useLectureContext();
  const navigate = useNavigate();
  const [transformedClasses, setTransformedClasses] = useState<ClassItem[]>([]);

  useEffect(() => {
    if (timetableId !== undefined && timetableId !== '') {
      setTimetableId(timetableId);
    }
  }, [timetableId, setTimetableId]);

  useEffect(() => {
    const classes = lectures.flatMap((lecture) =>
      lecture.class_time_json.map((time) => ({
        day: parseInt(time.day) as Day,
        startTime: minutesToTime(time.startMinute),
        endTime: minutesToTime(time.endMinute),
        name: lecture.course_title,
        location: time.place,
      })),
    );
    setTransformedClasses(classes);
  }, [lectures]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Lottie
          animationData={loading_lottie}
          loop
          autoplay
          style={{ width: 200, height: 200 }}
        />
      </div>
    );
  }

  if (error !== null && error !== '') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Page Header */}
      <div className="flex items-center h-12 flex-none pt-2 pb-1.5 px-4 Smb-1 border-b border-gray-300">
        <HamburgerMenuIcon className="mr-3" />
        <p className="mr-2 text-lg font-bold">시간표</p>
        <p className="grow text-xs font-normal text-gray-400">
          ({lectures.reduce((sum, lecture) => sum + lecture.credit, 0)}학점)
        </p>
        <ListBulletIcon
          onClick={() => {
            if (timetableId !== undefined && timetableId !== '') {
              navigate(`/timetables/${timetableId}/lectures`);
            }
          }}
          className="mr-3 w-5 h-5"
        />
        <Share1Icon className="mr-3 w-5 h-5" />
        <BellIcon className="w-5 h-5" />
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
        <div className="grid grid-rows-13 h-[calc(100%-2rem)] pb-[50px]">
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
                  {transformedClasses
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
