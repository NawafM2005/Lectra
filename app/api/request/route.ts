import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseName, courseCode, description, schoolId } = body;

    // Validate required fields
    if (!courseName || !courseCode || !schoolId) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
      });
    }

    // Insert into Supabase
    const { data, error } = await supabase
      .from("courses")
      .insert([
        {
          course_name: courseName,
          course_code: courseCode,
          description: description,
          school_id: schoolId,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
