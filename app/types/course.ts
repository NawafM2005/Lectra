export interface Course {
  school_id: number;
  school: {
    name: string;
    campus: string;
  };
  course_code: string;
  course_name: string;
  description: string;
}