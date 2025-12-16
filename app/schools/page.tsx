"use client";

import Container from "@/components/Container";
import SchoolCard from "@/components/SchoolCard";
import Link from "next/link";
import backgroundImg from "@/public/background-plain.jpg"
import { useEffect, useMemo, useState } from "react";
import { School } from "@/app/types/school"

export default function Schools() {

  const [schools, setSchools] = useState<School[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchSchools = async() => {
      const res = await fetch("/api/schools");
      const data = await res.json();
      setSchools(data);
    };

    fetchSchools();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filtered = schools.filter((school) =>
        school.name.toLowerCase().includes(query.toLowerCase()) ||
        school.campus?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSchools(filtered);
      setShowDropdown(true);
    }
    else {
      setFilteredSchools([]);
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
            <span className="text-lectra-text-secondary font-semibold text-sm tracking-wide">🎓 JOIN 15+ UNIVERSITIES</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-lectra-text tracking-tight">
            Find Your <span className="text-lectra-primary-dark">Campus</span>
          </h1>

          <p className="text-xl text-lectra-text-secondary mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
            Connect with students from your university. Share notes, ace exams, and build your academic second brain together.
          </p>

          <div className="mb-8 max-w-2xl mx-auto relative group border-4 border-black/10 rounded-2xl">
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl">
              <input 
                type="text" 
                value={searchQuery}
                onChange={handleSearch}
                onFocus={() => searchQuery.length > 0 && setShowDropdown(true)}
                placeholder="Search for your university..."
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
                {filteredSchools.length > 0 ? (
                  filteredSchools.map((school) => {
                    const schoolFormatted = school.name.toLowerCase().replace(/\s/g, '-');
                    const campusFormatted = school.campus ? encodeURIComponent(school.campus.toLowerCase()) : "";
                    const href = school.campus 
                        ? `/schools/${schoolFormatted}?campus=${campusFormatted}`
                        : `/schools/${schoolFormatted}`;
                    
                    return (
                      <Link 
                        key={school.name + (school.campus || '')}
                        href={href}
                        className="block px-6 py-4 hover:bg-gray-50 border-b border-gray-50 last:border-none transition-colors text-left"
                        onClick={() => setShowDropdown(false)}
                      >
                        <div className="font-bold text-lectra-text">{school.name}</div>
                        {school.campus && (
                          <div className="text-sm text-lectra-text-secondary">{school.campus}</div>
                        )}
                      </Link>
                    );
                  })
                ) : (
                  <div className="px-6 py-4 text-gray-400 text-center">
                    No schools found
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </section>
      

      <section className="py-24 bg-white/60">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-lectra-text">Popular Institutions</h2>
          </div>
          
          <Container className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {schools.map((school) => (
              <SchoolCard
              key={school.name + "-" + school.campus}
              {...school}
              />
            ))}
          </Container>
        </div>
      </section>
    </Container>
  );
}