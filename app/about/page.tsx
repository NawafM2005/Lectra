"use client";

import Container from "@/components/Container";
import Link from "next/link";

export default function About() {
  return (
    <Container>
      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-lectra-surface overflow-hidden">

        <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white border border-lectra-border shadow-sm">
            <span className="text-lectra-text-secondary font-semibold text-sm tracking-wide">🚀 OUR MISSION</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-lectra-text tracking-tight">
            Democratizing <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-lectra-primary to-lectra-primary-dark">Education</span>
          </h1>

          <p className="text-xl text-lectra-text-secondary mb-8 font-medium leading-relaxed max-w-2xl mx-auto">
            Lectra is an open-source initiative built by a student, for students. I believe that high-quality educational resources should be accessible to everyone, everywhere.
          </p>
        </div>
      </section>

      {/* The Problem & Solution */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-lectra-text mb-6">The Problem</h2>
              <p className="text-lg text-lectra-text-secondary mb-6 leading-relaxed">
                University students are drowning in information. Between 500-page textbooks, hours of lecture recordings, and scattered PDF notes, finding the specific answer you need is a nightmare.
              </p>
              <p className="text-lg text-lectra-text-secondary leading-relaxed">
                Traditional study tools are either expensive, outdated, or locked behind paywalls. Knowledge is siloed within specific universities or even specific friend groups.
              </p>
            </div>
            <div className="bg-lectra-surface p-8 rounded-3xl border border-lectra-border">
              <h2 className="text-3xl md:text-4xl font-bold text-lectra-text mb-6">The Lectra Solution</h2>
              <ul className="space-y-4">
                {[
                  "Centralized Knowledge Base for every course",
                  "AI-Powered Semantic Search (No more Ctrl+F)",
                  "Community-driven resource sharing",
                  "100% Free and Open Source"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-lectra-success/20 flex items-center justify-center text-lectra-success font-bold text-sm">✓</div>
                    <span className="text-lectra-text font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Stack */}
      <section className="py-24 bg-lectra-text text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built with Modern Tech</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Lectra leverages the latest advancements in web development and artificial intelligence to deliver a lightning-fast experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Frontend */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-6 text-2xl">⚛️</div>
              <h3 className="text-xl font-bold mb-4">Frontend</h3>
              <p className="text-white/70 mb-4">
                Built on <span className="text-white font-bold">Next.js 16</span> with the App Router for server-side rendering and optimal performance. Styled with <span className="text-white font-bold">Tailwind CSS</span> for a responsive, custom design.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono">React Server Components</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono">TypeScript</span>
              </div>
            </div>

            {/* AI & Backend */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6 text-2xl">🧠</div>
              <h3 className="text-xl font-bold mb-4">AI Engine</h3>
              <p className="text-white/70 mb-4">
                Uses <span className="text-white font-bold">RAG (Retrieval-Augmented Generation)</span> to ground LLM responses in your actual course material. Vector embeddings allow for semantic search across thousands of documents.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono">Vector DB</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono">OpenAI / Anthropic</span>
              </div>
            </div>

            {/* Infrastructure */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-6 text-2xl">☁️</div>
              <h3 className="text-xl font-bold mb-4">Infrastructure</h3>
              <p className="text-white/70 mb-4">
                Deployed on the edge for low latency. Images and documents are stored securely with high availability.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono">Vercel</span>
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono">PostgreSQL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Source / Contribute */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-lectra-text mb-6">Join the Movement</h2>
          <p className="text-xl text-lectra-text-secondary mb-12">
            Lectra is open source. Whether you&apos;re a developer, designer, or just a student with a great idea, I want your help building the future of education.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a href="https://github.com/nawafm2005/lectra" target="_blank" rel="noopener noreferrer">
              <button className="w-full sm:w-auto bg-black text-white px-8 py-4 rounded-xl font-bold text-lg cursor-pointer hover:bg-gray-800 transition-all flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                Star on GitHub
              </button>
            </a>
          </div>
        </div>
      </section>

    </Container>
  );
}
