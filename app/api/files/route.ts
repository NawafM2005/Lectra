import { supabase } from "@/lib/supabase";

export async function GET() {
    const {data: files, error } = await supabase
    .from("files")
    .select("*");

    if (error) {
        return new Response(JSON.stringify({error: error.message }), {status: 500});
    }

    return new Response(JSON.stringify(files), {status: 200});
}