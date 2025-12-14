"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
const Document = dynamic(() => import('react-pdf').then((mod) => mod.Document), { ssr: false });
const Page = dynamic(() => import('react-pdf').then((mod) => mod.Page), { ssr: false });
import { File } from "@/app/types/file"

interface FilePopupProps {
    file: File;
    onClose: () => void;
}

export default function FilePopUp({ file, onClose }: FilePopupProps) {
    const [numPages, setNumPages] = useState<number | null>(null);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = file.file_url;
        link.download = `${file.file_name}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }   

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
                
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white z-10">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{file.file_name}</h2>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            {file.file_type} • {file.upload_date}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-2 cursor-pointer"
                                onClick={handleDownload}
                        >
                            Download
                        </button>
                        
                        <button 
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors text-xl cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-100 p-6 flex justify-center">
                    <Document
                        file={file.file_url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="flex flex-col items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-4"></div>
                                <p className="text-gray-500 font-medium">Loading Document...</p>
                            </div>
                        }
                        error={
                            <div className="flex flex-col items-center justify-center h-full text-red-500">
                                <span className="text-4xl mb-2">⚠️</span>
                                <p>Failed to load PDF.</p>
                            </div>
                        }
                        className="max-w-full"
                    >
                        {numPages && Array.from(new Array(numPages), (el, index) => (
                            <div key={`page_${index + 1}`} className="mb-6 shadow-lg">
                                <Page 
                                    pageNumber={index + 1} 
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    width={800} 
                                    className="bg-white"
                                />
                                <p className="text-center text-[10px] text-gray-400 mt-1">
                                    Page {index + 1} of {numPages}
                                </p>
                            </div>
                        ))}
                    </Document>
                </div>
            </div>
        </div>
    );
}