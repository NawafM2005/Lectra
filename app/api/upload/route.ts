import { supabase } from "@/lib/supabase";
import { NextResponse } from 'next/server';
import { PDFDocument } from 'pdf-lib';


export async function POST(req: Request) {
    try {
        console.log("Connected");
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const courseCodeRaw = formData.get('courseID') as string;
        const schoolNameRaw = formData.get('schoolID') as string;
        const fileType = formData.get('type') as string;

        if (!file || !courseCodeRaw || !schoolNameRaw) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const formattedCourseCode = courseCodeRaw.replace(/-/g, ' '); 
        console.log(formattedCourseCode);

        const { data: courseData, error: courseError } = await supabase
            .from('courses')
            .select('id, school_id')
            .ilike('course_code', formattedCourseCode)
            .single();

        if (courseError || !courseData) {
            console.error("Course lookup error:", courseError);
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        const courseIdInt = courseData.id;

        let fileBuffer = await file.arrayBuffer();
        let finalFileName = file.name;
        let mimeType = file.type;

        if (file.type.startsWith('image/')) {
            try {
                const pdfDoc = await PDFDocument.create();
                const page = pdfDoc.addPage();
                const { width, height } = page.getSize();
                
                let image;
                if (file.type === 'image/png') {
                    image = await pdfDoc.embedPng(fileBuffer);
                } else {
                    image = await pdfDoc.embedJpg(fileBuffer);
                }

                const imgDims = image.scaleToFit(width - 40, height - 40);
                page.drawImage(image, {
                    x: (width - imgDims.width) / 2,
                    y: (height - imgDims.height) / 2,
                    width: imgDims.width,
                    height: imgDims.height,
                });

                const pdfBytes = await pdfDoc.save();
                fileBuffer = pdfBytes.buffer as ArrayBuffer;
                finalFileName = file.name.substring(0, file.name.lastIndexOf('.')) + '.pdf';
                mimeType = 'application/pdf';
            } catch (e) {
                console.error("Image conversion failed, uploading original", e);
            }
        }

        const timestamp = Date.now();
        const cleanFileName = finalFileName.replace(/[^a-zA-Z0-9.]/g, '_');
        const storagePath = `${schoolNameRaw}/${courseCodeRaw}/${timestamp}_${cleanFileName}`;

        const { error: uploadError } = await supabase
            .storage
            .from('course-files')
            .upload(storagePath, fileBuffer, {
                contentType: mimeType,
                upsert: false
            });
        
        if (uploadError) {
            console.error('Storage upload error:', uploadError);
            return NextResponse.json({ error: 'Storage upload failed' }, { status: 500 });
        }

        const { data: { publicUrl } } = supabase
            .storage
            .from('course-files')
            .getPublicUrl(storagePath);

        const { data: fileRecord, error: dbError } = await supabase
            .from('files')
            .insert({
                course_id: courseIdInt,
                file_name: finalFileName,
                file_type: fileType,
                upload_date: new Date().toISOString(),
                file_url: publicUrl
            })
            .select()
            .single();

        if (dbError) {
            console.error('DB insert error:', dbError);
            return NextResponse.json({ error: 'Database insert failed' }, { status: 500 });
        }

        return NextResponse.json(fileRecord);

    } catch (error) {
        console.error('Server error:', error);
        return NextResponse.json({ error: 'Error'});
    }
}