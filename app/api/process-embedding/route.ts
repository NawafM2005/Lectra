import { NextResponse } from 'next/server';
import { supabase } from "@/lib/supabase";
import OpenAI from 'openai';
import pdf from 'pdf-parse/lib/pdf-parse.js';


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req : Request) {
    try {

        const { fileID } = await req.json();

        if (!fileID) {
            return NextResponse.json({ error: 'Missing fileID' }, { status: 400 });
        }

        console.log(`Processing file ID: ${fileID}`);

        const { data: fileRecord, error: fetchError } = await supabase
            .from('files')
            .select('*')
            .eq('id', fileID)
            .single();

        if (fetchError || !fileRecord) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        const response = await fetch(fileRecord.file_url);
        if (!response.ok) throw new Error("Failed to download file");
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const data = await pdf(buffer);
        const text = data.text;

        const cleanText = text.replace(/\n/g, ' ');
        const chunks = splitTextIntoChunks(cleanText, 1000);

        console.log(`Generated ${chunks.length} chunks for Course ${fileRecord.course_id}`);

        for (const chunk of chunks) {
            const embeddingResponse = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: chunk,
            });

            const embedding = embeddingResponse.data[0].embedding;

            const { error: insertError } = await supabase
                .from('embeddings')
                .insert({
                    content: chunk,
                    metadata: { 
                        file_id: fileID,
                        file_name: fileRecord.file_name,
                        type: fileRecord.file_type
                    },
                    course_id: fileRecord.course_id,
                    embedding: embedding
                });

            if (insertError) console.error("Chunk save error:", insertError);
        }

        return NextResponse.json({ success: true, chunks: chunks.length });


    } catch (error: unknown) {
        console.error("Embedding Error:", error);
        const message = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

function splitTextIntoChunks(text: string, chunkSize: number): string[] {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
}