import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { supabase } from "@/lib/supabase";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {

        const {message, courseID} = await req.json();


        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Create Embedding for Quesiton
        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: message,
        });

        const queryVector = embeddingResponse.data[0].embedding;

        const {data: documents, error: matchError} = await supabase.rpc('match_embeddings', {
            query_embedding: queryVector,
            match_threshold: 0.1,
            match_count: 20   
        });

        if (matchError) {
            console.error('Supabase match error:', matchError);
            throw new Error('Failed to search knowledge base');
        }

        const formatedCourseID = courseID.replace("-", " ");

        const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .select('id')
            .ilike('course_code', formatedCourseID)
            .single();

        if (courseError || !courseData) {
            console.error('Course lookup error:', courseError);
            // Fallback or error handling if course isn't found
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        const filteredDocs = documents?.filter((doc: any) => {
            return doc.course_id === courseData.id;
        }).slice(0, 10) || [];


        const contextText = filteredDocs.map((doc: any) => doc.content).join('\n\n---\n\n');

        const systemPrompt = `You are an AI teaching assistant for the course ${courseID}. 
            Your goal is to help students understand the course material.
            
            Use the following context (retrieved from course documents) to answer the user's question.
            If the answer is not explicitly in the context, use your general knowledge but mention that it might not be specific to this course's materials.
            
            Context:
            ${contextText || "No specific context found in the course materials."}
        `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            temperature: 0.5,
        });

        const aiResponse = completion.choices[0].message.content;

        return NextResponse.json({ response: aiResponse });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process chat request' },
            { status: 500 }
        );
    } 
}