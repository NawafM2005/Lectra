"use client";

import Container from "@/components/Container";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import backgroundImg from "@/public/background-plain.jpg"
import { Course } from "@/app/types/course"
import { useEffect, useMemo, useState } from "react";


export default function SchoolDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const schoolID = params.schoolID as string;
  const campusID = searchParams.get('campus');
  
  const schoolName = schoolID
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const campusName = campusID 
    ? decodeURIComponent(campusID)
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : null;

  const displayName = campusName ? `${schoolName} - ${campusName}` : schoolName;

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
    useEffect(() => {
        const fetchCourses = async() => {
          try {
            const url = campusID 
              ? `/api/courses/${schoolID}?campus=${campusID}`
              : `/api/courses/${schoolID}`;
            const res = await fetch(url);
            const data = await res.json();
            setCourses(data);
          } catch (error) {
            console.error("Failed to fetch courses", error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchCourses();
      }, [schoolID, campusID]);

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
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-lectra-surface"
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
            Browse all courses offered at {displayName}. Access lecture notes, study guides, and connect with fellow students.
          </p>

          {/* Search Bar */}
          <div className="mb-8 max-w-2xl mx-auto relative group border-4 border-black/10 rounded-2xl">
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl">
              <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => searchQuery.length > 0 && setShowDropdown(true)}
                placeholder={`Search courses at ${schoolName}...`}
                className="w-full px-6 py-6 text-lg font-medium bg-transparent text-lectra-text placeholder-lectra-text-secondary/50 focus:outline-none"
              />
              <div className="pr-2">
                <button className="bg-lectra-text text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors">
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
                        key={course.course_code}
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

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-lectra-text mb-1">{courses.length}+</h3>
              <p className="text-lectra-text-secondary text-sm">Courses</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl font-bold text-lectra-text mb-1">100+</h3>
              <p className="text-lectra-text-secondary text-sm">Files</p>
            </div>
          </div>

        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lectra-primary"></div>
            </div>
          ) : courses.length == 0 ? (
            <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-lectra-text mb-2">No Courses Yet!</h2>
              <p className="text-sm text-lectra-text-secondary font-medium">
                Don&apos;t see your course?{" "}
                <Link href="/request" className="text-lectra-primary-dark font-bold hover:underline decoration-2 underline-offset-4">
                  Request to add it here
                </Link>
              </p>
            </div>
          </div>
          ) : (
            <>
            <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-lectra-text mb-2">Popular Courses</h2>
              <p className="text-lectra-text-secondary">Most accessed courses at {displayName}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.slice(0,12).map((course) => (
              <CourseCard
                key={course.course_code}
                {...course}
              />
            ))}
          </div>
          </>
          )}
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