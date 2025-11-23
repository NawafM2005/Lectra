"use client";

import Container from "@/components/Container";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";
import backgroundImg from "@/public/background-plain.jpg"

export default function Courses() {

  const courses = [
    { code: 'CS 101', name: 'Introduction to Computer Science', students: '2.3k+', color: 'bg-blue-600', department: 'Computer Science', school: 'University of Toronto' },
    { code: 'MATH 137', name: 'Calculus I for Honours Mathematics', students: '1.8k+', color: 'bg-purple-600', department: 'Mathematics', school: 'University of Waterloo' },
    { code: 'ECON 101', name: 'Microeconomic Theory', students: '3.1k+', color: 'bg-green-600', department: 'Economics', school: 'York University' },
    { code: 'PSY 102', name: 'Introduction to Psychology', students: '2.9k+', color: 'bg-pink-600', department: 'Psychology', school: 'Toronto Metropolitan University' },
    { code: 'ENG 200', name: 'Professional Communication', students: '1.5k+', color: 'bg-red-600', department: 'Engineering', school: 'University of Waterloo' },
    { code: 'BIO 120', name: 'Fundamentals of Biology', students: '2.2k+', color: 'bg-teal-600', department: 'Biology', school: 'University of Guelph' },
    { code: 'CHEM 123', name: 'General Chemistry I', students: '1.9k+', color: 'bg-orange-600', department: 'Chemistry', school: 'University of Toronto' },
    { code: 'PHIL 145', name: 'Critical Thinking', students: '1.4k+', color: 'bg-indigo-600', department: 'Philosophy', school: 'Wilfrid Laurier University' },
    { code: 'STAT 230', name: 'Probability', students: '1.7k+', color: 'bg-yellow-600', department: 'Statistics', school: 'University of Waterloo' },
  ];

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
            {courses.map((course) => (
              <CourseCard
                key={course.code}
                code={course.code}
                name={course.name}
                students={course.students}
                color={course.color}
                department={course.department}
                school={course.school}
              />
            ))}
          </div>
        </div>
      </section>

    </Container>
  );
}