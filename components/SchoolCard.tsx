import Link from "next/link";
import Container from "./Container";

interface SchoolCardProps {
    name: string;
    students: string;
    color: string;
}

export default function SchoolCard({name, students, color}: SchoolCardProps) {
    const schoolFormatted = name.toLowerCase().replace(/\s/g, '-');

    return (
        <Link href={`/schools/${schoolFormatted}`}>
            <Container className="group relative bg-lectra-surface border-3 border-lectra-border rounded-2xl p-6 hover:border-lectra-primary-dark transition-all duration-500 hover:shadow-xl hover:shadow-lectra-primary/5 cursor-pointer">
                <div className="flex items-start justify-between mb-6">
                    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                        {name.charAt(0)}
                    </div>
                    <span className="bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full border border-lectra-border">
                        100+ Files
                    </span>
                </div>
        
                <h3 className="text-xl font-bold text-black mb-2">
                    {name}
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