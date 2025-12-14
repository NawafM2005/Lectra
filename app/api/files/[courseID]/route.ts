import { supabase } from "@/lib/supabase";
import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseID: string }> }
) {
    const { courseID } = await context.params;

    const { data: course, error: courseError } = await supabase
        .from("courses")
        .select("id")
        .ilike("course_code", courseID) 
        .single();

    if (courseError || !course) {
        return new Response(JSON.stringify({ error: "Course not found" }), { status: 404 });
    }

    const { data: files, error } = await supabase
        .from("files")
        .select("*")
        .eq("course_id", course.id);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
    
    return new Response(JSON.stringify(files), {status: 200});
}