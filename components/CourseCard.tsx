import Link from "next/link";
import Container from "./Container";
import { Course } from "@/app/types/course"

export default function CourseCard(course: Course) {
    const {school, course_code, course_name, description} = course;
    const courseFormatted = course_code.toLowerCase().replace(/\s/g, '-');
    const schoolFormatted = school.name.toLowerCase().replace(/\s/g, '-');

    const campusParam = school.campus 
        ? `?campus=${encodeURIComponent(school.campus.toLowerCase())}`
        : '';
    
    const href = `/schools/${schoolFormatted}/${courseFormatted}${campusParam}`;

    return (
        <Link href={href}>
            <Container className="group relative bg-lectra-surface border-3 border-lectra-border rounded-2xl p-6 hover:border-lectra-primary/50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer overflow-hidden">
              
                <div className="relative z-10">
                    {/* Course Code & Name */}
                    <div className="mb-5">
                        <span className="inline-block bg-lectra-accent/80 text-white font-bold text-xs px-3 py-1 rounded-full mb-3">
                            {course_code}
                        </span>
                        <h3 className="text-2xl font-bold text-black leading-tight">
                            {course_name}
                        </h3>
                    </div>

                    {/* School Name - Large and Prominent */}
                    <div className="mb-4 pb-4 border-b border-black/40">
                        <p className="text-red-400 font-bold text-lectra-text">
                            {school.name}
                        </p>
                        <p className="text-sm text-lectra-text-secondary mt-1">
                            {description}
                        </p>
                    </div>
                    
                    {/* CTA */}
                    <div className="flex items-center justify-between">
                        <span className="text-lectra-accent font-bold text-sm group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            View Materials <span className="text-lg">→</span>
                        </span>
                    </div>
                </div>
            </Container>
        </Link>
    );
}