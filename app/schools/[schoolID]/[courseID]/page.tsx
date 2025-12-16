"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Course } from "@/app/types/course"
import { File } from "@/app/types/file"
import dynamic from 'next/dynamic';
import FilePopUp from "@/components/FilePopUp";
import { Message } from "@/app/types/message"

// Dynamically import react-pdf components with no SSR
const Document = dynamic(
    () => import('react-pdf').then((mod) => mod.Document),
    { ssr: false }
);

const Page = dynamic(
    () => import('react-pdf').then((mod) => mod.Page),
    { ssr: false }
);

// Configure PDF.js worker on client side only
if (typeof window !== 'undefined') {
    import('react-pdf').then((pdfjs) => {
        pdfjs.pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.pdfjs.version}/build/pdf.worker.min.mjs`;
    });
}

export default function CourseDetailPage() {
    const params = useParams();
    const searchParams = useSearchParams();

    const courseID = params.courseID as string;
    const schoolID = params.schoolID as string;
    const campusParam = searchParams.get('campus');

    const [activeTab, setActiveTab] = useState<'materials' | 'upload'>('materials');
    const [uploadType, setUploadType] = useState('quiz');
    const [materialFilter, setMaterialFilter] = useState<'all' | 'test' | 'assignment' | 'notes' | 'lecture' | 'other'>('all');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [course, setCourse] = useState<Course | null>(null);
    const [files, setFiles] = useState<File[] | null>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [filesToUpload, setFilesToUpload] = useState<globalThis.File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
        
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
    }, [activeTab]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const formatedCourseID = courseID.replace("-", " ");
                const res = await fetch(`/api/files/${formatedCourseID}`);
                const data = await res.json();

                if (Array.isArray(data)) {
                    const formattedData = data.map((file: File) => ({
                        ...file,
                        upload_date: new Date(file.upload_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })
                    }));
                    
                    setFiles(formattedData);
                }
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        }

        fetchFiles();
    }, [activeTab]);

    useEffect(() => {
        const savedChat = localStorage.getItem(`lectra-chat-${schoolID}-${courseID}`);
        if (savedChat) {
            try {
                setMessages(JSON.parse(savedChat));
            } catch (e) {
                console.error("Failed to parse chat history", e);
            }
        } else {
            setMessages([{
                role: 'ai',
                content: "Hello! I'm ready to help you with this course. Need help finding a quiz or understanding a topic?",
                timestamp: Date.now()
            }]);
        }
    }, [schoolID, courseID]);

    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(`lectra-chat-${schoolID}-${courseID}`, JSON.stringify(messages));
        }
    }, [messages, schoolID, courseID]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isChatLoading, isTyping]);

     if (!course){
        return null;
    }

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isChatLoading) return;

        const userMsg: Message = {
            role: 'user',
            content: inputMessage,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputMessage('');
        setIsChatLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: userMsg.content,
                    courseID,
                })
            });

            if (!response.ok) throw new Error('Failed to fetch response');

            const data = await response.json();
            const fullResponse = data.response || data.message || "Here is what I found.";
            
            setIsChatLoading(false);
            setIsTyping(true);

            setMessages(prev => [...prev, {
                role: 'ai',
                content: '',
                timestamp: Date.now()
            }]);

            let i = 0;
            const typingSpeed = 10;

            const intervalId = setInterval(() => {
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastMsgIndex = newMessages.length - 1;
                    
                    if (lastMsgIndex < 0 || newMessages[lastMsgIndex].role !== 'ai') {
                        clearInterval(intervalId);
                        setIsTyping(false);
                        return prev;
                    }

                    newMessages[lastMsgIndex] = {
                        ...newMessages[lastMsgIndex],
                        content: fullResponse.slice(0, i + 1)
                    };

                    return newMessages;
                });

                i++;
                if (i >= fullResponse.length) {
                    clearInterval(intervalId);
                    setIsTyping(false);
                }
            }, typingSpeed);

        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "Sorry, I'm having trouble connecting right now. Please try again later.",
                timestamp: Date.now()
            }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleClearChat = () => {
        localStorage.removeItem(`lectra-chat-${schoolID}-${courseID}`);
        setMessages([{
            role: 'ai',
            content: "Hello! I'm ready to help you with this course. Need help finding a quiz or understanding a topic?",
            timestamp: Date.now()
        }]);
    };

    // Filter materials based on selected filter
    const filteredMaterials = materialFilter === 'all' 
        ? files 
        : files?.filter(f => f.file_type === materialFilter);
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFilesToUpload(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (filesToUpload.length === 0) return;

        setIsUploading(true);
        try {
            const uploadPromises = filesToUpload.map(async (file) => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('courseID', courseID);
                formData.append('schoolID', schoolID);
                formData.append('type', uploadType);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ error: 'Unknown server error' }));
                    throw new Error(errorData.error || `Upload failed for ${file.name}`);
                }

                const data = await response.json();

                fetch('/api/process-embedding', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({fileID: data.id})
                });
                
                return data;
            });

            await Promise.all(uploadPromises);

            setFilesToUpload([]);
            if (fileInputRef.current) fileInputRef.current.value = '';
            setActiveTab('materials');
        } catch (error) {
            console.error("Error uploading files:", error);
            alert("Failed to upload some files. Please try again.");
        } finally {
            setIsUploading(false);
        }
    }


    return (
        <>
        <div className="lg:hidden flex flex-col items-center justify-center h-[calc(100vh-80px)] bg-gray-50 p-8 text-center">
            <div className="text-6xl mb-6">💻</div>
            <h2 className="text-2xl font-bold text-lectra-text mb-3">Screen too small</h2>
            <p className="text-lectra-text-secondary max-w-md mx-auto">
                Please use a laptop or desktop computer to access this course page.
            </p>
        </div>
        <div className="hidden lg:flex flex-col h-[calc(100vh-80px)] bg-white overflow-hidden">
        
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
        </header>

        {/* Main Content - Split View */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* Left: Chat (Scrollable) */}
            <div className="w-1/4 hover:w-1/2 border-r border-lectra-border bg-lectra-surface flex flex-col min-w-[350px] transition-all duration-600 ease-in-out">
                {/* Chat Header */}
                <div className="p-4 border-b border-lectra-border bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-lectra-accent to-lectra-accent-hover rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-lectra-accent/20">
                                🤖
                            </div>
                            <div>
                                <h2 className="text-base font-bold text-lectra-text leading-tight">Lectra AI</h2>
                                <p className="text-[10px] text-lectra-text-secondary font-medium uppercase tracking-wider">Course Assistant</p>
                            </div>
                        </div>

                        <button 
                            onClick={handleClearChat}
                            className="text-[10px] font-bold text-lectra-text-secondary hover:text-red-500 transition-colors uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-200 cursor-pointer"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={chatContainerRef}>
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 shadow-md ${
                                msg.role === 'ai' ? 'bg-lectra-accent text-white' : 'bg-lectra-primary text-black'
                            }`}>
                                {msg.role === 'ai' ? 'AI' : 'You'}
                            </div>
                            <div className={`border rounded-2xl px-4 py-3 flex-1 shadow-sm max-w-[85%] ${
                                msg.role === 'ai' 
                                ? 'bg-white border-lectra-border rounded-tl-none' 
                                : 'bg-lectra-surface border-lectra-primary/20 rounded-tr-none'
                            }`}>
                                <p className="text-lectra-text text-sm leading-relaxed whitespace-pre-wrap">
                                    {msg.content}
                                </p>
                                <p className="text-[10px] text-lectra-text-secondary mt-1 text-right opacity-70">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isChatLoading && (
                        <div className="flex gap-3">
                             <div className="w-8 h-8 bg-lectra-accent rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 shadow-md">AI</div>
                             <div className="bg-white border border-lectra-border rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-lectra-border bg-white">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Ask about quizzes, assignments, or topics..."
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={isChatLoading}
                            className="w-full pl-4 pr-12 py-3 border-2 border-lectra-border rounded-xl text-sm text-lectra-text focus:outline-none focus:border-lectra-primary transition-all"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-lectra-accent text-white rounded-lg flex items-center justify-center hover:bg-lectra-accent-hover transition-all cursor-pointer"
                                onClick={handleSendMessage}
                                disabled={!inputMessage.trim() || isChatLoading}
                        >
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
                        className={`py-4 text-sm font-bold transition-all border-b-2 cursor-pointer transition-all duration-500 ease-in-out ${activeTab === 'materials' ? 'w-3/4 border-lectra-primary text-lectra-text bg-lectra-surface/50' : 'w-1/4 border-transparent text-lectra-text-secondary hover:text-lectra-text hover:bg-gray-50'}`}
                    >
                        Course Materials
                    </button>
                    <button 
                        onClick={() => setActiveTab('upload')}
                        className={`py-4 text-sm font-bold transition-all border-b-2 cursor-pointer transition-all duration-500 ease-in-out ${activeTab === 'upload' ? 'w-3/4 border-lectra-primary text-lectra-text bg-lectra-surface/50' : 'w-1/4 border-transparent text-lectra-text-secondary hover:text-lectra-text hover:bg-gray-50'}`}
                    >
                        Upload & Share
                    </button>
                </div>

                {/* Filter Tabs */}
                {activeTab === 'materials' && (
                    <div className="flex border-b border-lectra-border bg-white overflow-x-auto">
                        <button 
                            onClick={() => setMaterialFilter('all')}
                            className={`px-6 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                                materialFilter === 'all' 
                                    ? 'border-lectra-primary text-lectra-text bg-lectra-surface/50' 
                                    : 'border-transparent text-lectra-text-secondary hover:text-lectra-text hover:bg-gray-50'
                            }`}
                        >
                            All Materials
                        </button>
                        <button 
                            onClick={() => setMaterialFilter('test')}
                            className={`px-6 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                                materialFilter === 'test' 
                                    ? 'border-lectra-primary text-lectra-text bg-lectra-surface/50' 
                                    : 'border-transparent text-lectra-text-secondary hover:text-lectra-text hover:bg-gray-50'
                            }`}
                        >
                            Test
                        </button>
                        <button 
                            onClick={() => setMaterialFilter('assignment')}
                            className={`px-6 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                                materialFilter === 'assignment' 
                                    ? 'border-lectra-primary text-lectra-text bg-lectra-surface/50' 
                                    : 'border-transparent text-lectra-text-secondary hover:text-lectra-text hover:bg-gray-50'
                            }`}
                        >
                            Assignment
                        </button>
                        <button 
                            onClick={() => setMaterialFilter('notes')}
                            className={`px-6 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                                materialFilter === 'notes' 
                                    ? 'border-lectra-primary text-lectra-text bg-lectra-surface/50' 
                                    : 'border-transparent text-lectra-text-secondary hover:text-lectra-text hover:bg-gray-50'
                            }`}
                        >
                            Notes
                        </button>
                        <button 
                            onClick={() => setMaterialFilter('lecture')}
                            className={`px-6 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                                materialFilter === 'lecture' 
                                    ? 'border-lectra-primary text-lectra-text bg-lectra-surface/50' 
                                    : 'border-transparent text-lectra-text-secondary hover:text-lectra-text hover:bg-gray-50'
                            }`}
                        >
                            Lecture
                        </button>
                        <button 
                            onClick={() => setMaterialFilter('other')}
                            className={`px-6 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer whitespace-nowrap ${
                                materialFilter === 'other' 
                                    ? 'border-lectra-primary text-lectra-text bg-lectra-surface/50' 
                                    : 'border-transparent text-lectra-text-secondary hover:text-lectra-text hover:bg-gray-50'
                            }`}
                        >
                            Other
                        </button>
                    </div>
                )}

                {/* Tab Content Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                    {activeTab === 'materials' ? (
                        <div className="space-y-6 pb-10">
                            {filteredMaterials && filteredMaterials.length > 0 ? (
                                <section>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-[10px] font-bold text-lectra-text-secondary uppercase tracking-wider">
                                            {materialFilter === 'all' ? 'All Course Materials' : 
                                             materialFilter === 'test' ? 'Tests & Exams' :
                                             materialFilter === 'assignment' ? 'Assignments' :
                                             materialFilter === 'notes' ? 'Notes & Resources' :
                                             materialFilter === 'lecture' ? 'Lecture Materials' :
                                             'Other Materials'}
                                            <span className="ml-2 text-lectra-error">({filteredMaterials.length})</span>
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                        {filteredMaterials.map((item, idx) => {
                                            return (
                                                <div 
                                                    key={idx}
                                                    onClick={() => setSelectedFile(item)} 
                                                    className={`bg-white rounded-lg border-3 p-2.5 hover:border-lectra-primary-dark hover:shadow-md transition-all cursor-pointer group`}
                                                >
                                                    <div className="w-full h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                                                        <Document
                                                            file={item.file_url}
                                                            loading={
                                                                <div className="flex items-center justify-center h-full">
                                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lectra-primary"></div>
                                                                </div>
                                                            }
                                                            error={
                                                                <div className="flex items-center justify-center h-full text-gray-400">
                                                                    <span className="text-3xl">📄</span>
                                                                </div>
                                                            }
                                                        >
                                                            <Page 
                                                                pageNumber={1} 
                                                                width={300}
                                                                renderTextLayer={false}
                                                                renderAnnotationLayer={false}
                                                            />
                                                        </Document>
                                                    </div>

                                                    {/* Material Info */}
                                                    <div className="p-2.5 bg-lectra-border">
                                                        <h4 className="font-bold text-lectra-text text-xs truncate" title={item.file_name}>
                                                            {item.file_name}
                                                        </h4>
                                                        <p className="text-[10px] text-lectra-text-secondary truncate">
                                                            {item.upload_date}
                                                        </p>
                                                        <p className="text-[10px] text-lectra-text-secondary truncate">
                                                            {item.file_type.charAt(0).toUpperCase() + item.file_type.slice(1)}
                                                        </p>
                                                    </div>

                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <div className="text-4xl mb-4">📭</div>
                                    <h3 className="text-lg font-bold text-lectra-text mb-2">No materials found</h3>
                                    <p className="text-sm text-lectra-text-secondary">
                                        There are no {materialFilter === 'all' ? '' : materialFilter} materials available yet.
                                    </p>
                                </div>
                            )}
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
                                            {['Test', 'Assignment', 'Notes', 'Lecture', 'Other'].map(type => (
                                                <button 
                                                    key={type}
                                                    onClick={() => setUploadType(type.toLowerCase())}
                                                    className={`px-2 py-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
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

                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        accept=".pdf,.png,.jpg,.jpeg"
                                        multiple                                    
                                    />
                                    
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer group ${
                                            filesToUpload.length > 0
                                            ? 'border-lectra-primary bg-lectra-primary/5' 
                                            : 'border-lectra-border hover:border-lectra-primary hover:bg-lectra-primary/5'
                                        }`}
                                    >
                                        <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">
                                            {filesToUpload.length > 0 ? '📄' : '📂'}
                                        </span>
                                        <span className="text-sm font-bold text-lectra-text block">
                                            {filesToUpload.length > 0 
                                                ? `${filesToUpload.length} file(s) selected` 
                                                : 'Click to browse files'}
                                        </span>
                                        <span className="text-xs text-lectra-text-secondary mt-1 block">
                                            {filesToUpload.length > 0
                                                ? filesToUpload.map(f => f.name).join(', ')
                                                : 'Supports PDF and Images (Multiple allowed)'}
                                        </span>
                                    </div>

                                    <button
                                        onClick={handleUpload} 
                                        disabled={filesToUpload.length === 0 || isUploading}
                                        className={`w-full py-3.5 rounded-xl font-bold transition-all shadow-lg cursor-pointer ${
                                            filesToUpload.length === 0 || isUploading
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-lectra-text text-white hover:bg-black hover:shadow-xl active:scale-95'
                                        }`}
                                        >
                                        {isUploading ? 'Uploading...' : `Upload ${filesToUpload.length > 0 ? `(${filesToUpload.length})` : ''} ${uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}`} 
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {selectedFile && (
                <FilePopUp 
                    file={selectedFile} 
                    onClose={() => setSelectedFile(null)} 
                />
            )}

        </div>
        </div>
        </>
    );
}