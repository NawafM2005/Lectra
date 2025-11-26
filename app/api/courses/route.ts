import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data: courses, error } = await supabase
    .from("courses")
    .select(`
      id,
      course_code,
      course_name,
      description,
      school:school_id(name, campus)
    `);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify(courses), { status: 200 });
}
