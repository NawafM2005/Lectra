import { supabase } from "@/lib/supabase";
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ schoolID: string }> }
) {
  const { schoolID } = await context.params;
  const { searchParams } = new URL(request.url);
  const campusParam = searchParams.get('campus');

  const schoolName = schoolID
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  let schoolQuery = supabase
    .from("schools")
    .select("id")
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

  const { data: courses, error } = await supabase
    .from("courses")
    .select(`
      id,
      course_code,
      course_name,
      description,
      school:school_id(name, campus)
    `)
    .eq("school_id", school.id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(courses), { status: 200 });
}