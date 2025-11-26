"use client";

import Container from "@/components/Container";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";
import backgroundImg from "@/public/background-plain.jpg"
import { Course } from "@/app/types/course"
import { useEffect, useMemo, useState } from "react";

export default function Courses() {

  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
      const fetchCourses = async() => {
        const res = await fetch("/api/courses");
        const data = await res.json();
        setCourses(data);
      };
  
      fetchCourses();
    }, []);
  
    const topCourses = useMemo(() => {
      return [...courses]
        .sort((a, b) => b.num_of_files - a.num_of_files);
    }, [courses]);

  return (
    <Container>
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${backgroundImg.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
          
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white border border-lectra-border shadow-sm">
            <span className="text-lectra-text-secondary font-semibold text-sm tracking-wide">📚 ACCESS 10,000+ COURSES</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-lectra-text tracking-tight">
            Find Your <span className="text-lectra-error">Course</span>
          </h1>

          <p className="text-xl text-lectra-text-secondary mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
            Browse lecture notes, study guides, and past exams for your specific courses. Join the discussion and study smarter.
          </p>

          <div className="mb-8 max-w-2xl mx-auto relative group border-4 border-black/10 rounded-2xl">
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl">
              <input 
                type="text" 
                placeholder="Search for course code (e.g. CS101) or name..."
                className="w-full px-6 py-6 text-lg font-medium bg-transparent text-lectra-text placeholder-lectra-text-secondary/50 focus:outline-none"
              />
              <div className="pr-2">
                <button className="bg-lectra-text text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors cursor-pointer">
                  Search
                </button>
              </div>
            </div>
          </div>

          <p className="text-sm text-lectra-text-secondary font-medium">
            Don&apos;t see your course?{" "}
            <Link href="/request" className="text-lectra-primary-dark font-bold hover:underline decoration-2 underline-offset-4">
              Request to add it here
            </Link>
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-lectra-text">Popular Courses</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topCourses.map((course) => (
              <CourseCard
                key={course.course_code + "-" + course.school.name + "-" + course.school.campus}
                {...course}
              />
            ))}
          </div>
        </div>
      </section>

    </Container>
  );
}