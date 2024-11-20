import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useLectureContext } from '../contexts/LectureContext';

const CreatePage = () => {
  const navigate = useNavigate();
  const { lectures, addLecture, replaceLecture } = useLectureContext();
  const { id: timetableId } = useParams<{ id: string }>();

  const [courseTitle, setCourseTitle] = useState('');
  const [instructor, setInstructor] = useState('');
  const [credit, setCredit] = useState('');
  const [remark, setRemark] = useState('');
  const [place, setPlace] = useState('');

  useEffect(() => {
    if (timetableId == null || timetableId.trim() === '') {
      console.error('timetableId가 정의되지 않았습니다.');
      alert('올바르지 않은 시간표 ID입니다.');
      navigate('/');
    }
  }, [timetableId, navigate]);

  const isOverlapping = (newLecture: {
    class_time_json: { day: string; startMinute: number; endMinute: number }[];
  }) => {
    return lectures.some((existingLecture) =>
      existingLecture.class_time_json.some((existingTime) =>
        newLecture.class_time_json.some(
          (newTime) =>
            existingTime.day === newTime.day &&
            !(
              existingTime.endMinute <= newTime.startMinute ||
              existingTime.startMinute >= newTime.endMinute
            ),
        ),
      ),
    );
  };

  const handleSave = async () => {
    if (timetableId == null || timetableId.trim() === '') {
      alert('유효하지 않은 시간표 ID입니다.');
      return;
    }

    const newLecture = {
      _id: Date.now().toString(),
      course_title: courseTitle,
      instructor,
      credit: Number(credit),
      department: '-',
      academic_year: '-',
      class_time_json: [
        {
          day: '2',
          place,
          startMinute: 1140,
          endMinute: 1230,
          start_time: '19:00',
          end_time: '20:30',
          len: 90,
          start: 1140,
        },
      ],
      remark,
      color: { bg: 'bg-blue-500', fg: 'text-white' },
      colorIndex: 0,
      is_forced: true,
    };

    try {
      if (isOverlapping(newLecture)) {
        if (window.confirm('시간대가 겹치는 기존 강의를 덮어쓰시겠습니까?')) {
          await replaceLecture(newLecture);
        } else {
          return;
        }
      } else {
        await addLecture(newLecture);
      }

      navigate(`/timetables/${timetableId}/lectures`);
    } catch (error) {
      console.error('강의 저장 실패:', error);
      alert('강의 저장 중 문제가 발생했습니다.');
    }
  };

  return (
    <div className="w-screen h-screen">
      {/* 헤더 */}
      <div className="flex h-12 justify-between pt-3 pb-1.5 px-4 border-b border-gray-300 sticky top-0 bg-white">
        <button
          className="text-md font-normal"
          onClick={() => {
            if (timetableId != null && timetableId.trim() !== '') {
              navigate(`/timetables/${timetableId}/lectures`);
            } else {
              alert('올바르지 않은 시간표 ID입니다.');
              navigate('/');
            }
          }}
        >
          취소
        </button>
        <button
          className="text-md font-normal"
          onClick={() => {
            void handleSave();
          }}
        >
          저장
        </button>
      </div>

      {/* 본문 */}
      <div className="flex gap-4 h-full flex-col bg-gray-100">
        {/* 기본 정보 */}
        <div className="flex flex-col w-full py-2 px-5 mt-4 bg-white">
          <div className="flex justify-start items-center gap-2">
            <span className="text-[15px] text-gray-500 w-1/4">강의명</span>
            <input
              className="flex-grow p-3 text-md bg-white w-3/4 focus:outline-none placeholder-black"
              placeholder="새로운 강의"
              value={courseTitle}
              onChange={(e) => {
                setCourseTitle(e.target.value);
              }}
            />
          </div>
          <div className="flex justify-start items-center gap-2">
            <span className="text-[15px] text-gray-500 w-1/4">교수</span>
            <input
              className="flex-grow p-3 text-md bg-white w-3/4 focus:outline-none"
              placeholder="(없음)"
              value={instructor}
              onChange={(e) => {
                setInstructor(e.target.value);
              }}
            />
          </div>
          <div className="flex justify-start items-center gap-2">
            <span className="text-[15px] text-gray-500 w-1/4">학점</span>
            <input
              type="number"
              className="flex-grow p-3 text-md bg-white w-3/4 focus:outline-none placeholder-black"
              placeholder="0"
              value={credit}
              onChange={(e) => {
                setCredit(e.target.value);
              }}
            />
          </div>
        </div>

        {/* 비고 */}
        <div className="flex flex-col w-full py-2 px-5 bg-white">
          <div className="flex justify-start items-center gap-2">
            <span className="text-[15px] text-gray-500 w-1/4">비고</span>
            <input
              className="flex-grow p-3 text-md bg-white w-3/4 focus:outline-none"
              placeholder="(없음)"
              value={remark}
              onChange={(e) => {
                setRemark(e.target.value);
              }}
            />
          </div>
        </div>

        {/* 시간 및 장소 */}
        <div className="flex flex-col w-full py-2 px-5 bg-white">
          <span className="text-[15px] text-gray-600 py-3">시간 및 장소</span>
          <div className="flex justify-start items-center gap-2">
            <span className="text-[15px] text-gray-500 w-1/4">시간</span>
            <span className="flex-grow px-3 text-md bg-white w-3/4 focus:outline-none text-black">
              수 19:00 ~ 20:30
            </span>
          </div>
          <div className="flex justify-start pt-1 pb-3 items-center gap-2">
            <span className="text-[15px] text-gray-500 w-1/4">장소</span>
            <input
              className="flex-grow px-3 text-md bg-white w-3/4 focus:outline-none"
              placeholder="(없음)"
              value={place}
              onChange={(e) => {
                setPlace(e.target.value);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
