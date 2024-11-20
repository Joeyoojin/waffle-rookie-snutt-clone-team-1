import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type ClassTime = {
  day: string;
  place: string;
  startMinute: number;
  endMinute: number;
};

type Lecture = {
  _id: string;
  course_title: string;
  instructor: string;
  credit: number;
  department: string;
  academic_year: string;
  class_time_json: ClassTime[];
  remark?: string;
};

type LectureContextType = {
  lectures: Lecture[];
  timetableId: string | null;
  setTimetableId: (id: string) => void;
  isLoading: boolean;
  error: string | null;
  refetchLectures: () => Promise<void>;
  addLecture: (lecture: Lecture) => Promise<void>;
  replaceLecture: (lecture: Lecture) => Promise<void>;
};

const LectureContext = createContext<LectureContextType | undefined>(undefined);

export const LectureProvider = ({ children }: { children: ReactNode }) => {
  const [timetableId, setTimetableId] = useState<string | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWithToken = async <T,>(
    url: string,
    options: RequestInit = {},
  ): Promise<T> => {
    const token = localStorage.getItem('token');
    if (token === null || token === '') {
      throw new Error('토큰이 없으므로 재로그인 하세요');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'x-access-token': token,
      },
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(
        message !== ''
          ? message
          : `Failed to fetch data. Status: ${response.status}`,
      );
    }

    return response.json() as Promise<T>;
  };

  const refetchLectures = useCallback(async () => {
    if (timetableId === null || timetableId === '') {
      setError('No timetable ID');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = `https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/tables/${timetableId}`;
      const data = await fetchWithToken<{ lecture_list: Lecture[] }>(url);
      setLectures(data.lecture_list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred.');
      console.error('Error fetching lectures:', err);
    } finally {
      setIsLoading(false);
    }
  }, [timetableId]);

  useEffect(() => {
    const fetchLecturesIfNeeded = async () => {
      if (timetableId !== null && timetableId !== '') {
        await refetchLectures();
      }
    };
    void fetchLecturesIfNeeded();
  }, [timetableId, refetchLectures]);

  const addLecture = async (lecture: Lecture) => {
    if (timetableId === null || timetableId === '') {
      throw new Error('No timetableId set');
    }

    try {
      const url = `https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/tables/${timetableId}/lecture`;
      await fetchWithToken<Lecture>(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lecture),
      });

      await refetchLectures();
    } catch (err) {
      console.error('Error adding lecture:', err);
      throw err;
    }
  };

  const replaceLecture = async (lecture: Lecture) => {
    if (timetableId === null || timetableId === '') {
      throw new Error('No timetableId set.');
    }

    try {
      const url = `https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/tables/${timetableId}/lecture`;
      const updatedLecture = await fetchWithToken<Lecture>(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lecture),
      });

      setLectures((prevLectures) =>
        prevLectures.map((l) => (l._id === lecture._id ? updatedLecture : l)),
      );
    } catch (err) {
      console.error('Error replacing lecture:', err);
      throw err;
    }
  };

  return (
    <LectureContext.Provider
      value={{
        timetableId,
        setTimetableId,
        lectures,
        isLoading,
        error,
        refetchLectures,
        addLecture,
        replaceLecture,
      }}
    >
      {children}
    </LectureContext.Provider>
  );
};

export const useLectureContext = () => {
  const context = useContext(LectureContext);
  if (context === undefined) {
    throw new Error();
  }
  return context;
};
