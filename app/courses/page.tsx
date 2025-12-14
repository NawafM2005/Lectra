"use client";

import Container from "@/components/Container";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";
import backgroundImg from "@/public/background-plain.jpg"
import { Course } from "@/app/types/course"
import { useEffect, useMemo, useState } from "react";

export default function Courses() {

  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

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

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSearchQuery(query);
  
      if (query.length > 0) {
        const filtered = courses.filter((course) => 
          course.course_name.toLowerCase().includes(query.toLowerCase()) ||
          course.course_code.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCourses(filtered);
        setShowDropdown(true);
      } else {
        setFilteredCourses([]);
        setShowDropdown(false);
      }
    };

  return (
    <Container>
      <section className="relative min-h-[60vh] flex items-center justify-center"
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
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => searchQuery.length > 0 && setShowDropdown(true)}
                placeholder="Search for course code (e.g. CS101) or name..."
                className="w-full px-6 py-6 text-lg font-medium bg-transparent text-lectra-text placeholder-lectra-text-secondary/50 focus:outline-none"
              />
              <div className="pr-2">
                <button className="bg-lectra-text text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors cursor-pointer">
                  Search
                </button>
              </div>
            </div>

            {/* Dropdown Results */}
            {showDropdown && searchQuery.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-80 overflow-y-auto">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => {
                    const courseFormatted = course.course_code.toLowerCase().replace(/\s/g, '-');
                    const schoolFormatted = course.school.name.toLowerCase().replace(/\s/g, '-');
                    const campusParam = course.school.campus 
                        ? `?campus=${encodeURIComponent(course.school.campus.toLowerCase())}`
                        : '';
                    const href = `/schools/${schoolFormatted}/${courseFormatted}${campusParam}`;

                    return (
                      <Link 
                        key={course.course_code + "-" + course.school.name + "-" + course.school.campus}
                        href={href}
                        className="block px-6 py-4 hover:bg-gray-50 border-b border-gray-50 last:border-none transition-colors text-left"
                        onClick={() => setShowDropdown(false)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-bold text-lectra-text flex items-center gap-2">
                              <span className="bg-lectra-accent/10 text-lectra-accent text-xs px-2 py-0.5 rounded-full">{course.course_code}</span>
                              {course.course_name}
                            </div>
                            <div className="text-sm text-lectra-text-secondary mt-1">
                              {course.school.name} {course.school.campus && `- ${course.school.campus}`}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="px-6 py-4 text-gray-400 text-center">
                    No courses found
                  </div>
                )}
              </div>
            )}
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