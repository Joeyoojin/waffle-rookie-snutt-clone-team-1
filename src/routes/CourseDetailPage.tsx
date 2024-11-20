import { ChevronLeftIcon } from '@radix-ui/react-icons';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import loading_lottie from '../assets/loading_lottie.json';
import MenuBar from '../components/MenuBar';

type Day = 0 | 1 | 2 | 3 | 4;
const DAY_LABEL_MAP: { [key: number]: string } = {
  0: '월',
  1: '화',
  2: '수',
  3: '목',
  4: '금',
};

interface LectureBuilding {
  id: string;
  buildingNumber: string;
  buildingNameKor: string;
  buildingNameEng: string;
  locationInDMS: {
    latitude: number;
    longitude: number;
  };
  locationInDecimal: {
    latitude: number;
    longitude: number;
  };
  campus: string;
}

interface ClassTime {
  day: Day;
  place: string;
  startMinute: number;
  endMinute: number;
  start_time: string;
  end_time: string;
  len: number;
  start: number;
  lectureBuildings: LectureBuilding[];
}

interface Lecture {
  _id: string;
  academic_year: string;
  category: string;
  class_time_json: ClassTime[];
  classification: string;
  credit: number;
  department: string;
  instructor: string;
  lecture_number: string;
  quota: number;
  freshman_quota: number | undefined;
  remark: string;
  course_number: string;
  course_title: string;
  color:
    | {
        bg: string | undefined;
        fg: string | undefined;
      }
    | undefined;
  colorIndex: number;
  lecture_id: string;
  snuttEvLecture?: {
    evLectureId: number;
  };
  class_time_mask: number[];
}

interface TimetableResponse {
  _id: string;
  user_id: string;
  year: number;
  semester: string;
  lecture_list: Lecture[];
  title: string;
  theme: string;
  themeId: string;
  isPrimary: boolean;
  updated_at: string;
}

export default function CourseDetailPage() {
  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams<{ timetableId: string; lectureId: string }>();
  const { timetableId, lectureId } = params;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLectureDetail = async () => {
      const token = localStorage.getItem('token');

      if (
        token === null ||
        token === '' ||
        timetableId === '' ||
        lectureId === ''
      ) {
        setIsLoading(false);
        throw new Error('로그인이 필요합니다.');
      }

      try {
        if (timetableId === undefined) throw new Error('id is undefined');
        const response = await fetch(
          `https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/tables/${timetableId}`,
          {
            method: 'GET',
            headers: {
              'x-access-token': token,
            },
          },
        );

        if (!response.ok) {
          throw new Error('강의 정보를 불러오는데 실패했습니다.!!!!');
        }

        const data = (await response.json()) as TimetableResponse;

        const selectedLecture = data.lecture_list.find(
          (l) => l._id === lectureId,
        );
        if (selectedLecture != null) {
          setLecture(selectedLecture);
        } else {
          throw new Error('강의를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : '알 수 없는 오류가 발생했습니다.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchLectureDetail();

  }, [timetableId, lectureId, navigate]);

  const handleDelete = async () => {
    const token = localStorage.getItem('token');

    if (
      token === null ||
      token === '' ||
      timetableId === '' ||
      lectureId === ''
    ) {
      setIsLoading(false);
      throw new Error('로그인이 필요합니다.');
    }

    try {
      if (timetableId === undefined)
        throw new Error('timetableId is undefined');
      if (lectureId === undefined) throw new Error('lectureId is undefined');
      const response = await fetch(
        `https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/tables/${timetableId}/lecture/${lectureId}`,
        {
          method: 'DELETE',
          headers: {
            'x-access-token': token,
          },
        },
      );

      if (!response.ok) {
        throw new Error('강의 삭제에 실패했습니다.');
      }

      navigate(-1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.',
      );
    }
  };

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

  if (error !== null) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (lecture === null) {
    return <div className="p-4">강의 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto bg-gray-50 min-h-screen flex flex-col">
        {/* <header className="p-3 border-b border-gray-200 sticky top-0 z-50 bg-white">
          <div className="flex items-center">
            <button className="absolute left-3">
              뒤로
            </button>
            <div className="flex gap-2 absolute right-3">
              <button>알림</button>
              <button>북마크</button>
              <button>편집</button>
            </div>
          </div>
        </header> */}
        <div className="flex items-center h-11 flex-none pt-2 pb-1.5 pl-4 pr-3 border-b border-gray-300 sticky top-0 bg-white">
          <ChevronLeftIcon
            onClick={() => {
              if (timetableId !== undefined) {
                navigate(`/timetables/${timetableId}`);
              }
            }}
          />
          <p className="grow text-s font-normal">뒤로</p>
        </div>

        <main className="flex-1 p-3 mb-12">
          <div className="space-y-6">
            {/* first block*/}
            <div className="bg-white rounded-lg shadow">
              <div className="divide-y divide-gray-200">
                <div className="p-3 flex items-center">
                  <span className="text-sm text-gray-500">강의명</span>
                  <span className="text-sm ml-4">{lecture.course_title}</span>
                </div>
                <div className="p-3 flex items-center">
                  <span className="text-sm text-gray-500">교수</span>
                  <span className="text-sm ml-4">{lecture.instructor}</span>
                </div>
                <div className="p-3 flex items-center">
                  <span className="text-sm text-gray-500">색</span>
                  <div className="ml-4">
                    {lecture.color !== undefined ? lecture.color.fg : '(없음)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Second block */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-3 flex items-center">
                <span className="text-sm text-gray-500">강의평점</span>
                <span className="text-sm ml-4">★-- (0개)</span>
              </div>
            </div>

            {/* Third Block */}
            <div className="bg-white rounded-lg shadow">
              <div className="divide-y divide-gray-200">
                <div className="p-3 flex items-center">
                  <span className="text-sm text-gray-500">학과</span>
                  <span className="text-sm ml-4">
                    {lecture.department !== '' ? lecture.department : '(없음)'}
                  </span>
                </div>
                <div className="p-3 flex items-center">
                  <span className="text-sm text-gray-500">학년</span>
                  <span className="text-sm ml-4">
                    {lecture.academic_year !== ''
                      ? lecture.academic_year
                      : '(없음)'}
                  </span>
                </div>
                <div className="p-3 flex items-center">
                  <span className="text-sm text-gray-500">학점</span>
                  <span className="text-sm ml-4">{lecture.credit}</span>
                </div>
                <div className="p-3 flex items-center">
                  <span className="text-sm text-gray-500">분류</span>
                  <span className="text-sm ml-4">
                    {lecture.classification !== ''
                      ? lecture.classification
                      : '(없음)'}
                  </span>
                </div>
                <div className="p-3 flex items-center">
                  <span className="text-sm text-gray-500">구분</span>
                  <span className="text-sm ml-4">
                    {lecture.category !== '' ? lecture.category : '(없음)'}
                  </span>
                </div>
                <div className="p-3 flex items-center">
                  <span className="text-sm text-gray-500">강좌번호</span>
                  <span className="text-sm ml-4">
                    {lecture.course_number !== ''
                      ? lecture.course_number
                      : '(없음)'}
                  </span>
                </div>
                <div className="p-3 flex items-center">
                  <span className="text-sm text-gray-500">분반번호</span>
                  <span className="text-sm ml-4">
                    {lecture.lecture_number !== ''
                      ? lecture.lecture_number
                      : '(없음)'}
                  </span>
                </div>
                <div className="p-3 flex items-center">
                  <span className="text-sm text-gray-500">정원(재학생)</span>
                  <span className="text-sm ml-4">
                    {`${lecture.quota - (lecture.freshman_quota !== undefined ? lecture.freshman_quota : 0)}`}
                  </span>
                </div>
                <div className="p-3 flex items-center">
                  <span className="text-sm text-gray-500">비고</span>
                  <span className="text-sm ml-4">
                    {lecture.remark !== '' ? lecture.remark : '(없음)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Fourth block */}
            <div className="bg-white rounded-lg shadow">
              <h3 className="p-3 text-sm">시간 및 장소</h3>
              <div className="divide-y divide-gray-200">
                {lecture.class_time_json.map((time, index) => (
                  <div key={index} className="p-3 space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">시간</span>
                      <span className="text-sm ml-4">
                        {DAY_LABEL_MAP[time.day]}{' '}
                        {time.start_time !== '' ? time.start_time : '??:??'} ~{' '}
                        {time.end_time !== '' ? time.end_time : '??:??'}{' '}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500">장소</span>
                      <span className="text-sm ml-4">
                        {time.place !== '' ? time.place : '(없음)'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delete */}
            <div className="bg-white rounded-lg shadow">
              <button
                onClick={() => void handleDelete()}
                className="w-full p-3 text-sm text-red-500"
              >
                삭제
              </button>
            </div>
          </div>
        </main>

        <MenuBar />
      </div>
    </div>
  );
}
