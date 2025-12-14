export interface File {
  id: number;
  course_id: number;
  file_name: string;
  file_type: string;
  upload_date: string;
  file_url: string;
  embedding: string | null;
}
