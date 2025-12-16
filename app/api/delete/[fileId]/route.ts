import { supabase } from "@/lib/supabase";
import { NextRequest } from 'next/server';

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ fileId: string }> }
) {
    const { fileId } = await context.params;

    const { data: file, error: fileError } = await supabase
        .from("files")
        .select("file_url")
        .eq("id", fileId)
        .single();

    if (fileError || !file) {
        return new Response(JSON.stringify({ error: "File not found" }), { status: 404 });
    }

    const urlParts = file.file_url.split('/course-files/');
    const filePath = urlParts[1];

    // Delete from storage
    const { error: storageError } = await supabase
        .storage
        .from('course-files')
        .remove([filePath]);

    if (storageError) {
        console.error("Storage deletion error:", storageError);
        return new Response(JSON.stringify({ error: "Failed to delete file from storage" }), { status: 500 });
    }

    const { error: embeddingsError } = await supabase
        .from("embeddings")
        .delete()
        .eq("metadata->>file_id", fileId);

    if (embeddingsError) {
        console.error("Embeddings deletion error:", embeddingsError);
    }

    // Delete from files table
    const { error: dbError } = await supabase
        .from("files")
        .delete()
        .eq("id", fileId);

    if (dbError) {
        console.error("Database deletion error:", dbError);
        return new Response(JSON.stringify({ error: "Failed to delete file from database" }), { status: 500 });
    }
    
    return new Response(JSON.stringify({ success: true, message: "File deleted successfully" }), { status: 200 });
}