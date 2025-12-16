"use client";

import Container from "@/components/Container";
import Link from "next/link";

export default function Home() {
  return (
    <Container>
      {/* Hero Section with 3D Mockup */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-lectra-primary/20 blur-[120px] rounded-full opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-lectra-accent/10 blur-[100px] rounded-full opacity-30"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-lectra-border backdrop-blur-sm mb-8 shadow-sm hover:scale-105 transition-transform cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-lectra-success animate-pulse"></span>
            <span className="text-sm font-bold text-lectra-text-secondary">V.1 IS LIVE</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-extrabold text-lectra-text tracking-tight mb-8 leading-[1.1]">
            Your Academic <br />
            <span className="text-lectra-primary-dark">Second Brain</span>
          </h1>

          <p className="text-xl md:text-2xl text-lectra-text-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
            Lectra is the AI-powered workspace for high-performance students. 
            Upload your slides, recordings, and notes. <span className="text-lectra-text font-bold">We handle the rest.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link href="/schools" className="bg-lectra-text text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-black/80 hover:scale-105 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2">
              Get Started for Free
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="relative bg-white rounded-2xl border-5 border-black/20 shadow-2xl shadow-lectra-primary/10 overflow-hidden transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out">
              <div className="h-12 bg-gray-50 border-b border-lectra-border flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <div className="ml-4 bg-white border border-gray-200 rounded-md px-3 py-1 text-xs text-gray-400 flex-1 text-center font-mono">lectra.app</div>
              </div>
              <div className="p-8 bg-white min-h-[400px] flex flex-col items-center justify-center bg-[url('/grid.svg')] bg-center">
                 <div className="text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center text-4xl animate-bounce">🧠</div>
                    <h3 className="text-2xl font-bold text-lectra-text">Ready to study?</h3>
                 </div>
              </div>
            </div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-lectra-accent/30 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-lectra-primary/30 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </section>

      <section className="py-12 border-y border-lectra-border bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-lectra-text-secondary uppercase tracking-widest mb-8">Trusted by students at top universities</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {['McMaster', 'York', 'Western', 'UofT', 'Waterloo', 'TMU'].map(uni => (
               <span key={uni} className="text-2xl font-serif font-bold text-lectra-text">{uni}</span>
             ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold text-lectra-text mb-6">Everything you need to <br/>boost that GPA.</h2>
            <p className="text-xl text-lectra-text-secondary max-w-2xl mx-auto">
              We&apos;ve combined the best study tools into one seamless platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 grid-rows-2 gap-6 h-auto md:h-[800px]">
            
            <div className="md:col-span-2 md:row-span-2 bg-lectra-surface rounded-3xl p-8 md:p-12 border border-lectra-border relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl mb-6 shadow-sm">💬</div>
                <h3 className="text-3xl font-bold text-lectra-text mb-4">Chat with your Course</h3>
                <p className="text-lg text-lectra-text-secondary max-w-md">
                  Don&apos;t just read. Get involved! Ask questions about your lecture slides and get answers that are directly relevant to your course. No more guessing, only real, accurate info!</p>
              </div>
              <div className="absolute right-0 bottom-0 w-3/4 h-3/4 bg-white rounded-tl-3xl border-t border-l border-lectra-border shadow-2xl translate-y-25 translate-x-12 group-hover:translate-x-8 group-hover:translate-y-20 transition-transform duration-500 p-6">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3 text-sm text-gray-600 w-2/3">What is the difference between mitosis and meiosis?</div>
                  </div>
                  <div className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-lectra-primary flex items-center justify-center text-xs font-bold">AI</div>
                    <div className="bg-lectra-primary/10 rounded-2xl rounded-tr-none p-3 text-sm text-lectra-text w-3/4">
                      <span className="font-bold block mb-1 text-xs uppercase tracking-wide text-lectra-primary-dark">Answer</span>
                      Mitosis results in two identical daughter cells, while meiosis results in four genetically unique sex cells... &apos;Lecture 05&apos;
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Top Right - Search */}
            <div className="bg-black text-white rounded-3xl p-8 border border-gray-800 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">Course Materials</h3>
                <p className="text-white/60 text-sm">Find all your course materials for free! Search for quizzes, assignments, and tests — and maybe even upload your own to make life easier for others!</p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {/* Feature 3: Bottom Right - Flashcards */}
            <div className="bg-lectra-primary rounded-3xl p-8 border border-lectra-primary-dark/10 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold text-lectra-text mb-2">Instant Mock Tests, Flash Cards, and More!</h3>
                <p className="text-lectra-text/80 text-sm">Get ready for exams with instant access to mock tests, flashcards, and more, all powered by your specific course materials. 
                Our AI uses only the content you provide to generate relevant practice questions, quizzes, and reviews, ensuring a focused and personalized study experience with no irrelevant internet content.</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            </div>

          </div>
        </div>
      </section>

      {/* Stats / Trust - Dark Mode */}
      <section className="py-24 bg-lectra-text text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            <div className="space-y-2">
              <h4 className="text-5xl font-bold text-lectra-primary">500+</h4>
              <p className="text-white/60 font-medium">Files Processed</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-5xl font-bold text-lectra-primary">10+</h4>
              <p className="text-white/60 font-medium">Universities</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-5xl font-bold text-lectra-primary">4000+</h4>
              <p className="text-white/60 font-medium">Courses</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-5xl font-bold text-lectra-primary">$0</h4>
              <p className="text-white/60 font-medium">Cost to Start</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-6xl md:text-8xl font-extrabold text-lectra-text mb-8 tracking-tighter">
            Stop studying harder.
          </h2>
          <p className="text-2xl text-lectra-text-secondary mb-12 max-w-2xl mx-auto">
            Join thousands of students who have already upgraded their academic workflow.
          </p>
          <Link href="/schools">
            <button className="bg-lectra-primary text-lectra-text px-12 py-6 rounded-2xl font-bold text-2xl hover:bg-lectra-primary-dark hover:scale-105 transition-all cursor-pointer shadow-2xl shadow-lectra-primary/30">
              Launch Lectra
            </button>
          </Link>
        </div>
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-lectra-primary/10 to-lectra-accent/10 rounded-full blur-3xl -z-10"></div>
      </section>

    </Container>
  );
}