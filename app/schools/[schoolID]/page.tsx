"use client";

import Container from "@/components/Container";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";
import { useParams } from "next/navigation";
import backgroundImg from "@/public/background-plain.jpg"


export default function SchoolDetailPage() {
  const params = useParams();
  const schoolID = params.schoolID as string;
  
  // Convert slug to readable name
  const schoolName = schoolID
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const schoolCourses = [
    { code: 'CS 101', name: 'Introduction to Computer Science', students: '2.3k+', color: 'bg-blue-600', department: 'Computer Science', school: schoolName },
    { code: 'MATH 137', name: 'Calculus I for Honours Mathematics', students: '1.8k+', color: 'bg-purple-600', department: 'Mathematics', school: schoolName },
    { code: 'ECON 101', name: 'Microeconomic Theory', students: '3.1k+', color: 'bg-green-600', department: 'Economics', school: schoolName },
    { code: 'PSY 102', name: 'Introduction to Psychology', students: '2.9k+', color: 'bg-pink-600', department: 'Psychology', school: schoolName },
    { code: 'ENG 200', name: 'Professional Communication', students: '1.5k+', color: 'bg-red-600', department: 'Engineering', school: schoolName },
    { code: 'BIO 120', name: 'Fundamentals of Biology', students: '2.2k+', color: 'bg-teal-600', department: 'Biology', school: schoolName },
  ];

  return (
    <Container>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-lectra-surface overflow-hidden"
      style={{
          backgroundImage: `url(${backgroundImg.src})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>

        <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
          <div className="flex flex-row w-full justify-between items-center mb-6">
            <Link href="/schools" className="flex items-center gap-2 text-lectra-text-secondary hover:text-red-400 font-medium transition-colors">
              <span>←</span> Back to Schools
            </Link>

            <div className="absolute left-1/2 transform -translate-x-1/2 px-4 py-1.5 rounded-full bg-red-400 border border-white shadow-sm">
              <span className="text-white font-semibold text-sm">{schoolName.toUpperCase()}</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-lectra-text tracking-tight">
            Explore <span className="text-lectra-primary-dark">Courses</span>
          </h1>

          <p className="text-xl text-lectra-text-secondary mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
            Browse all courses offered at {schoolName}. Access lecture notes, study guides, and connect with fellow students.
          </p>

          {/* Search Bar */}
          <div className="mb-8 max-w-2xl mx-auto relative group border-4 border-black/10 rounded-2xl">
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl">
              <input 
                type="text" 
                placeholder={`Search courses at ${schoolName}...`}
                className="w-full px-6 py-6 text-lg font-medium bg-transparent text-lectra-text placeholder-lectra-text-secondary/50 focus:outline-none"
              />
              <div className="pr-2">
                <button className="bg-lectra-text text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-lectra-text mb-1">500+</h3>
              <p className="text-lectra-text-secondary text-sm">Courses</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-lectra-text mb-1">12k+</h3>
              <p className="text-lectra-text-secondary text-sm">Files</p>
            </div>
          </div>

        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-lectra-text mb-2">Popular Courses</h2>
              <p className="text-lectra-text-secondary">Most accessed courses at {schoolName}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {schoolCourses.map((course) => (
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

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-lectra-text mb-4">
            Can&apos;t find your course?
          </h2>
          <p className="text-lectra-text-secondary mb-8 text-lg">
            Request to add new courses and help grow the {schoolName} community.
          </p>
          <Link href="/request">
            <button className="group inline-flex items-center gap-3 bg-lectra-primary text-lectra-text px-8 py-4 rounded-xl font-bold text-xl cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
              Request a Course
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </button>
          </Link>
        </div>
      </section>

    </Container>
  );
}