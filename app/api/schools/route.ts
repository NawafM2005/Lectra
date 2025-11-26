import { supabase } from "@/lib/supabase";

export async function GET() {
    const {data: schools, error } = await supabase
    .from("schools")
    .select("*");

    if (error) {
        return new Response(JSON.stringify({error: error.message }), {status: 500});
    }

    return new Response(JSON.stringify(schools), {status: 500});
}