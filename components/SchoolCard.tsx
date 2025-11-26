import Link from "next/link";
import Container from "./Container";
import { School } from "@/app/types/school"
import Image from "next/image";

export default function SchoolCard(school: School) {
    const { name, campus, num_of_files, logo_url } = school;
    const schoolFormatted = name.toLowerCase().replace(/\s/g, '-');
    const campusFormatted = campus ? encodeURIComponent(campus.toLowerCase()) : "";

    const href = campus 
        ? `/schools/${schoolFormatted}?campus=${campusFormatted}`
        : `/schools/${schoolFormatted}`;
    return (
        <Link href={`${href}`}>
            <Container className="group relative bg-lectra-surface border-3 border-lectra-border rounded-2xl p-6 hover:border-lectra-primary-dark transition-all duration-500 hover:shadow-xl hover:shadow-lectra-primary/5 cursor-pointer">
                <div className="flex items-start justify-between mb-6">
                    <div className="rounded-xl flex items-center justify-center font-bold text-xl shadow-lg overflow-hidden bg-white">
                        <Image 
                            src={logo_url} 
                            alt={`${name} logo`}
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-auto h-auto max-w-[120px] max-h-[60px] p-1 object-contain"
                        />
                    </div>
                    <span className="bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full border border-lectra-border">
                        {num_of_files} Files
                    </span>
                </div>
        
                <h3 className="text-xl font-bold text-black mb-2">
                    {campus ? `${name} - ${campus}` : name}
                </h3>
                <p className="text-black/80 text-sm mb-6">
                    Access shared notes, past exams, and study guides.
                </p>
            
                <div className="flex items-center text-lectra-accent font-bold text-sm group-hover:translate-x-1 transition-transform">
                    View Courses <span className="ml-1">→</span>
                </div>
            </Container>
        </Link>
)}