"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Course } from "@/app/types/course"

export default function CourseDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const courseID = params.courseID as string;
    const schoolID = params.schoolID as string;
    const campusParam = searchParams.get('campus');

    const [activeTab, setActiveTab] = useState<'materials' | 'upload'>('materials');
    const [uploadType, setUploadType] = useState('quiz');

    const [course, setCourse] = useState<Course | null>(null);
        
    const schoolName = schoolID
        ? schoolID.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        : 'Loading...';
    
    const campusName = campusParam 
    ? decodeURIComponent(campusParam)
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : null;

    const displayName = campusName ? `${schoolName} - ${campusName}` : schoolName;

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const url = campusParam 
                    ? `/api/courses/${schoolID}/${courseID}?campus=${campusParam}`
                    : `/api/courses/${schoolID}/${courseID}`;
                
                const res = await fetch(url);
                const data = await res.json();
                setCourse(data);
            } catch (error) {
                console.error("Error fetching course:", error);
            }
        }

        fetchCourse();
    }, [schoolID, courseID, campusParam]);

    if (!course){
        return null;
    }


    // Mock Data
    const quizzes = [
        { title: 'Week 1 Quiz', date: 'Nov 10', score: '10/10' },
        { title: 'HTML Basics', date: 'Nov 12', score: '8/10' },
        { title: 'CSS Selectors', date: 'Nov 15', score: '9/10' },
        { title: 'Flexbox Froggy', date: 'Nov 18', score: '-' },
        { title: 'Grid Garden', date: 'Nov 20', score: '-' },
    ];

    const assignments = [
        { title: 'Build a Portfolio', date: 'Due Nov 25', status: 'Pending' },
        { title: 'Responsive Layout', date: 'Due Dec 01', status: 'Not Started' },
        { title: 'JS Calculator', date: 'Due Dec 05', status: 'Locked' },
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-80px)] bg-white overflow-hidden">
        
        {/* Compact Header */}
        <header className="flex-none h-14 border-b border-lectra-border bg-white px-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-lectra-text-secondary">
                    <Link href={`/schools/${schoolID}${campusParam ? `?campus=${campusParam}` : ''}`}
                    className="hover:text-black font-bold transition-colors">{displayName}</Link>
                    <span>/</span>
                </div>
                <h1 className="text-xs font-bold text-lectra-text max-w-[300px]">{course.course_name}</h1>
                <span className="bg-lectra-primary text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">{course.course_code}</span>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden lg:flex items-center gap-4 text-md text-lectra-text-secondary border-r border-lectra-border pr-6">
                    <span className="flex items-center gap-1"> <b>{course.num_of_files}</b> Files</span>
                </div>
            </div>
        </header>

        {/* Main Content - Split View */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* Left: Chat (Scrollable) */}
            <div className="w-1/4 hover:w-1/2 border-r border-lectra-border bg-lectra-surface flex flex-col min-w-[350px] transition-all duration-300 ease-in-out">
                {/* Chat Header */}
                <div className="p-4 border-b border-lectra-border bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-lectra-accent to-lectra-accent-hover rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-lectra-accent/20">
                            🤖
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-lectra-text leading-tight">Lectra AI</h2>
                            <p className="text-[10px] text-lectra-text-secondary font-medium uppercase tracking-wider">Course Assistant</p>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    <div className="flex gap-3">
                    <div className="w-8 h-8 bg-lectra-accent rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 shadow-md">AI</div>
                    <div className="bg-white border border-lectra-border rounded-2xl rounded-tl-none px-4 py-3 flex-1 shadow-sm max-w-[85%]">
                        <p className="text-lectra-text text-sm leading-relaxed">
                        Hello! I&apos;m ready to help you with <strong></strong>. Need help finding a quiz or understanding a topic?
                        </p>
                    </div>
                    </div>
                    
                    {/* Example User Message */}
                    <div className="flex gap-3 justify-end">
                    <div className="bg-lectra-primary rounded-2xl rounded-tr-none px-4 py-3 max-w-[85%] shadow-md">
                        <p className="text-lectra-text text-sm font-medium">Show me the latest quizzes.</p>
                    </div>
                    <div className="w-8 h-8 bg-lectra-text rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 shadow-md">You</div>
                    </div>

                    {/* Example AI Response */}
                    <div className="flex gap-3">
                    <div className="w-8 h-8 bg-lectra-accent rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 shadow-md">AI</div>
                    <div className="bg-white border border-lectra-border rounded-2xl rounded-tl-none px-4 py-3 flex-1 shadow-sm max-w-[85%]">
                        <p className="text-lectra-text text-sm mb-2">Here are the most recent quizzes uploaded for this course:</p>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="bg-lectra-surface p-2 rounded border border-lectra-border text-xs">
                                <span className="font-bold block">Week 1 Quiz</span>
                                <span className="text-lectra-text-secondary">Nov 10</span>
                            </div>
                            <div className="bg-lectra-surface p-2 rounded border border-lectra-border text-xs">
                                <span className="font-bold block">HTML Basics</span>
                                <span className="text-lectra-text-secondary">Nov 12</span>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-lectra-border bg-white">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Ask about quizzes, assignments, or topics..."
                            className="w-full pl-4 pr-12 py-3 border-2 border-lectra-border rounded-xl text-sm text-lectra-text focus:outline-none focus:border-lectra-primary transition-all"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-lectra-accent text-white rounded-lg flex items-center justify-center hover:bg-lectra-accent-hover transition-all cursor-pointer">
                            ↑
                        </button>
                    </div>
                </div>
            </div>

            {/* Right: Tabs (Scrollable) */}
            <div className="flex flex-1 flex-col bg-white min-w-[350px]">
                {/* Tabs Header */}
                <div className="flex border-b border-lectra-border bg-white sticky top-0 z-10">
                    <button 
                        onClick={() => setActiveTab('materials')}
                        className={`py-4 text-sm font-bold transition-all border-b-2 cursor-pointer ${activeTab === 'materials' ? 'w-3/4 border-lectra-primary text-lectra-text bg-lectra-surface/50' : 'w-1/4 border-transparent text-lectra-text-secondary hover:text-lectra-text hover:bg-gray-50'}`}
                    >
                        Course Materials
                    </button>
                    <button 
                        onClick={() => setActiveTab('upload')}
                        className={`py-4 text-sm font-bold transition-all border-b-2 cursor-pointer ${activeTab === 'upload' ? 'w-3/4 border-lectra-primary text-lectra-text bg-lectra-surface/50' : 'w-1/4 border-transparent text-lectra-text-secondary hover:text-lectra-text hover:bg-gray-50'}`}
                    >
                        Upload & Share
                    </button>
                </div>

                {/* Tab Content Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                    {activeTab === 'materials' ? (
                        <div className="space-y-6 pb-10">
                            {/* Section: Quizzes */}
                            <section>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-[10px] font-bold text-lectra-text-secondary uppercase tracking-wider flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                        Quizzes
                                    </h3>
                                    <button className="text-[10px] font-bold text-lectra-primary hover:underline bg-lectra-primary/5 px-2 py-0.5 rounded">View All</button>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {quizzes.map((quiz, idx) => (
                                        <div key={idx} className="bg-white rounded-lg border border-lectra-border p-2.5 hover:border-lectra-primary hover:shadow-sm transition-all cursor-pointer group flex items-center gap-3">
                                            <div className="w-8 h-8 bg-red-50 rounded-md flex items-center justify-center text-sm group-hover:scale-110 transition-transform flex-shrink-0">
                                                📝
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-lectra-text text-xs truncate" title={quiz.title}>{quiz.title}</h4>
                                                <p className="text-[10px] text-lectra-text-secondary truncate">{quiz.date} • {quiz.score}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Section: Assignments */}
                            <section>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-[10px] font-bold text-lectra-text-secondary uppercase tracking-wider flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                        Assignments
                                    </h3>
                                    <button className="text-[10px] font-bold text-lectra-primary hover:underline bg-lectra-primary/5 px-2 py-0.5 rounded">View All</button>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                    {assignments.map((assign, idx) => (
                                        <div key={idx} className="bg-white rounded-lg border border-lectra-border p-2.5 hover:border-lectra-primary hover:shadow-sm transition-all cursor-pointer group flex items-center gap-3">
                                            <div className="w-8 h-8 bg-blue-50 rounded-md flex items-center justify-center text-sm group-hover:scale-110 transition-transform flex-shrink-0">
                                                💻
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-bold text-lectra-text text-xs truncate" title={assign.title}>{assign.title}</h4>
                                                <p className="text-[10px] text-lectra-text-secondary truncate">{assign.date} • {assign.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Section: Tests */}
                            <section>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-[10px] font-bold text-lectra-text-secondary uppercase tracking-wider flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                        Tests & Exams
                                    </h3>
                                    <button className="text-[10px] font-bold text-lectra-primary hover:underline bg-lectra-primary/5 px-2 py-0.5 rounded">View All</button>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                    <div className="bg-white rounded-lg border border-lectra-border p-2.5 hover:border-lectra-primary hover:shadow-sm transition-all cursor-pointer group flex items-center gap-3">
                                        <div className="w-8 h-8 bg-purple-50 rounded-md flex items-center justify-center text-sm group-hover:scale-110 transition-transform flex-shrink-0">
                                            🎓
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="font-bold text-lectra-text text-xs truncate">Midterm Exam</h4>
                                            <p className="text-[10px] text-lectra-text-secondary truncate">Oct 25 • 85%</p>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-4">
                            <div className="w-full max-w-md bg-white rounded-2xl border border-lectra-border p-8 shadow-sm">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-lectra-primary/10 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                        📤
                                    </div>
                                    <h3 className="text-xl font-bold text-lectra-text">Upload Material</h3>
                                    <p className="text-sm text-lectra-text-secondary mt-1">Share your knowledge with the class</p>
                                </div>
                                
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-lectra-text-secondary mb-3 uppercase tracking-wider">What are you uploading?</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['Quiz', 'Test', 'Assignment', 'Notes', 'Lecture', 'Other'].map(type => (
                                                <button 
                                                    key={type}
                                                    onClick={() => setUploadType(type.toLowerCase())}
                                                    className={`px-2 py-2.5 rounded-lg text-xs font-bold border transition-all ${
                                                        uploadType === type.toLowerCase() 
                                                        ? 'bg-lectra-primary text-lectra-text border-lectra-primary shadow-sm ring-2 ring-lectra-primary/20' 
                                                        : 'bg-white border-lectra-border text-lectra-text-secondary hover:border-lectra-primary hover:text-lectra-text'
                                                    }`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="border-2 border-dashed border-lectra-border rounded-xl p-8 text-center hover:border-lectra-primary hover:bg-lectra-primary/5 transition-all cursor-pointer group">
                                        <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">📂</span>
                                        <span className="text-sm font-bold text-lectra-text block">Click to browse files</span>
                                        <span className="text-xs text-lectra-text-secondary mt-1 block">or drag and drop here</span>
                                    </div>

                                    <button className="w-full bg-lectra-text text-white py-3.5 rounded-xl font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95">
                                        Upload {uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
        </div>
    );
}