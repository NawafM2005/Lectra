"use client";

import { useState, useEffect } from "react";
import Container from "@/components/Container";
import { School } from "@/app/types/school";

export default function Request() {
  const [schools, setSchools] = useState<School[]>([]);
  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    description: "",
    university: "",
    schoolId: 0,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchSchools() {
      try {
        const res = await fetch("/api/schools");
        if (res.ok) {
          const data = await res.json();
          setSchools(data);
        }
      } catch (error) {
        console.error("Failed to fetch schools", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSchools();
  }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccess(false);

        try {
        const res = await fetch("/api/request", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            courseName: formData.courseName,
            courseCode: formData.courseCode,
            description: formData.description,
            schoolId: formData.schoolId,
            }),
        });

        if (res.ok) {
            setSuccess(true);
            setFormData({
            courseName: "",
            courseCode: "",
            description: "",
            university: "",
            schoolId: 0,
            });
        }
        } catch (error) {
        console.error("Failed to submit request", error);
        } finally {
        setSubmitting(false);
        }
    };
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "university") {
        const selectedSchool = schools.find(s => s.name === value);
        setFormData(prev => ({
            ...prev,
            university: value,
            schoolId: selectedSchool ? selectedSchool.id : 0
        }));
    } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <Container className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Request a Course</h1>
        <p className="text-gray-600 mb-8">
          Can&apos;t find the course you&apos;re looking for? Fill out the form below and we&apos;ll add it to our database.
        </p>

        {success ? (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
                Request submitted successfully! You should see your course now!
            </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
              Course Name
            </label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              required
              value={formData.courseName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="e.g. Introduction to Computer Science"
            />
          </div>

          <div>
            <label htmlFor="courseCode" className="block text-sm font-medium text-gray-700 mb-1">
              Course Code
            </label>
            <input
              type="text"
              id="courseCode"
              name="courseCode"
              required
              value={formData.courseCode}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="e.g. CS101"
            />
          </div>

          <div>
            <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
              University
            </label>
            <select
              id="university"
              name="university"
              required
              value={formData.university}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white cursor-pointer"
              disabled={loading}
            >
              <option value="">Select a university</option>
              {schools.map((school, index) => (
                <option key={index} value={school.name}>
                  {school.name}{school.campus ? ` (${school.campus})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              placeholder="Brief description of the course..."
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
          >
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
        )}
      </div>
    </Container>
  );
}
