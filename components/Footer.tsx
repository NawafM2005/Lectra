"use client";

import LectraLogo from "@/public/Lectra_transparent.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  
  // Hide footer on course detail dashboard pages (e.g. /schools/mit/cs101)
  // Pattern: /schools/[schoolID]/[courseID]
  const isCourseDashboard = /^\/schools\/[^/]+\/[^/]+$/.test(pathname || '');

  if (isCourseDashboard) return null;

  return (
        <footer className="border-t-4 bg-lectra-bg border-lectra-error/60">
            <div className="max-w-7xl mx-auto px-8 py-3 text-center">
                <div className="flex flex-col md:flex-row justify-center items-center gap-16 mb-3">
                
                <div className="space-y-2 flex flex-col items-center">
                    <div className="flex items-center justify-center">
                    <Image src={LectraLogo} alt="Lectra Logo" className="h-[100px] w-[150px] object-cover"/>
                    </div>
                    
                    <p className="text-lg leading-relaxed max-w-md text-center text-lectra-text-secondary">
                        A student-created platform transforming learning with AI and community.            
                    </p>
                </div>
                
                <div className="space-y-2 flex flex-col items-center">
                    <h4 className="font-bold text-lg text-lectra-text">Quick Links</h4>
                    <ul className="space-y-1 text-center">
                    {['Schools', 'Courses', 'About'].map((link) => (
                        <li key={link}>
                        <Link href={`/${link.toLowerCase()}`} 
                                className="transition-all duration-300 hover:scale-105 inline-block text-lectra-text-secondary">
                            {link}
                        </Link>
                        </li>
                    ))}
                    </ul>
                </div>
                </div>

                <div className="pt-3 border-t border-lectra-border text-center">
                <p className="text-sm text-lectra-text-secondary">
                    © 2025 Lectra Ltd.
                </p>
                </div>
            </div>
        </footer>
  );
}
