import { supabase } from "@/lib/supabase";
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ schoolID: string; courseID: string }> }
) {
  const { schoolID, courseID } = await context.params;
  const { searchParams } = new URL(request.url);
  const campusParam = searchParams.get('campus');

  const schoolName = decodeURIComponent(schoolID)
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const courseCode = decodeURIComponent(courseID)
    .split('-')
    .map(word => word.toUpperCase())
    .join(' ');

  let schoolQuery = supabase
    .from("schools")
    .select("id, name, campus")
    .ilike("name", schoolName);
  
  if (campusParam) {
    const campusName = decodeURIComponent(campusParam)
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    schoolQuery = schoolQuery.ilike("campus", campusName);
  }

  const { data: school, error: schoolError } = await schoolQuery.single();

  if (schoolError || !school) {
    return new Response(JSON.stringify({ error: "School not found" }), { status: 404 });
  }

  const { data: course, error } = await supabase
    .from("courses")
    .select(`
      id,
      course_code,
      course_name,
      description,
      school:school_id(id, name, campus)
    `)
    .eq("school_id", school.id)
    .ilike("course_code", courseCode)
    .single();

  if (error || !course) {
    return new Response(JSON.stringify({ error: "Course not found" }), { status: 404 });
  }

  return new Response(JSON.stringify(course), { status: 200 });
}