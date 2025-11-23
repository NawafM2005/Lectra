"use client"
import Image from "next/image";
import Link from "next/link";
import LectraLogo from "@/public/Lectra_transparent.svg";
import { useState, useEffect } from "react"

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled || isMenuOpen ? 'bg-white/80 backdrop-blur-xl border-b-3 border-lectra-error/60 shadow-sm' : 'bg-transparent border-b-3 border-lectra-error/60'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex-shrink-0">
            <Link href="/">
                <Image src={LectraLogo} alt="Lectra Logo" className="h-20 w-auto object-contain hover:opacity-80 transition-opacity"/>
            </Link>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-8">
            {['Schools', 'Courses', 'About'].map((link) => (
                <Link key={link} href={`/${link.toLowerCase()}`}>
                    <li className="text-md font-bold text-lectra-text/80 hover:text-lectra-primary-dark transition-colors cursor-pointer">
                    {link}
                    </li>
                </Link>
            ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
            <Link href="/schools">
                <li className="bg-lectra-text text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-black/80 transition-all shadow-lg shadow-black/10 hover:scale-105 cursor-pointer">
                    Get Started
                </li>
            </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
            className="md:hidden p-2 text-lectra-text cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
        >
            <div className="w-6 flex flex-col gap-1.5">
                <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-full bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
        </button>

        {/* Mobile Dropdown Menu */}
        <div className={`absolute top-full left-0 w-full bg-white border-b border-lectra-border md:hidden transition-all duration-300 origin-top ${
            isMenuOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-0 invisible'
        }`}>
            <ul className="flex flex-col p-4 gap-2">
            {['Home', 'Schools', 'Courses', 'About'].map((link) => (
                <Link key={link} href={`/${link === "Home" ? "" : link.toLowerCase()}`}>
                <li 
                    className="px-4 py-3 rounded-xl font-bold text-lectra-text hover:bg-lectra-surface transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                >
                    {link}
                </li>
                </Link>
            ))}
            <div className="h-px bg-lectra-border my-2"></div>
            <Link href="/schools">
                <li className="bg-lectra-text text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-black/80 transition-all shadow-lg shadow-black/10 hover:scale-105 cursor-pointer">
                    Get Started
                </li>
            </Link>
            </ul>
        </div>

      </div>
    </nav>
  );
}
