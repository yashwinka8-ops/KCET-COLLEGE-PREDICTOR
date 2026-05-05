'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Search, 
  BarChart3, 
  ShieldCheck, 
  Smartphone,
  Target,
  User as UserIcon,
  Monitor,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div 
    whileHover={{ y: -8 }}
    className="glass-card p-8 group relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-6 border border-primary/20 group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const FloatingCard = ({ name, branch, rank, delay }: { name: string, branch: string, rank: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ 
      opacity: 1, 
      y: [0, -10, 0],
    }}
    transition={{ 
      opacity: { duration: 0.5, delay },
      y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay }
    }}
    className="glass-card p-4 flex flex-col gap-1 w-48 pointer-events-none"
  >
    <div className="text-[10px] uppercase tracking-wider text-primary font-bold">{branch}</div>
    <div className="text-sm font-semibold truncate">{name}</div>
    <div className="text-xs text-muted-foreground">Cutoff: {rank}</div>
  </motion.div>
);

export default function LandingPage() {
  return (
    <div className="min-h-screen selection:bg-primary/30">
      {/* Global Navbar is handled by layout.tsx */}

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 overflow-hidden min-h-[90vh] flex flex-col items-center">
        {/* Background Geometric Pattern */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-20">
            <svg className="w-full h-full" viewBox="0 0 1200 1200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="600" cy="600" r="300" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />
                <circle cx="600" cy="600" r="450" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" />
                <circle cx="600" cy="600" r="600" stroke="white" strokeWidth="0.5" strokeOpacity="0.05" />
                <path d="M600 0V1200" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="4 4" />
                <path d="M0 600H1200" stroke="white" strokeWidth="0.5" strokeOpacity="0.1" strokeDasharray="4 4" />
                <motion.circle 
                    cx="600" cy="600" r="300" 
                    stroke="var(--primary)" strokeWidth="1" strokeDasharray="10 20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                />
            </svg>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
            
            {/* Spiritual Header (Epic & Motivational) */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative flex flex-col items-center mb-10 w-full max-w-4xl mx-auto py-12 opacity-80 hover:opacity-100 transition-opacity duration-700 group"
            >
              {/* Kurukshetra Sunset Background */}
              <div 
                className="absolute inset-0 z-0 opacity-30 group-hover:opacity-50 transition-opacity duration-1000 bg-center bg-cover pointer-events-none"
                style={{ 
                  backgroundImage: "url('/kurukshetra.png')",
                  maskImage: "radial-gradient(ellipse at center, black 10%, transparent 60%)",
                  WebkitMaskImage: "radial-gradient(ellipse at center, black 10%, transparent 60%)"
                }}
              />

              <div className="relative z-10 flex flex-col items-center">
                <div className="text-[10px] font-black uppercase tracking-[0.5em] text-orange-500 mb-4 drop-shadow-[0_0_12px_rgba(249,115,22,0.6)]">
                  ॥ Bhagavad Gita • 2.37 ॥
                </div>
                
                <div className="flex flex-col items-center px-6">
                  <div className="text-xl md:text-3xl font-serif text-orange-400/90 mb-4 tracking-wider text-shadow-lg shadow-orange-900/50">
                    हतो वा प्राप्स्यसि स्वर्गं जित्वा वा भोक्ष्यसे महीम्।
                  </div>
                  <div className="flex gap-4 text-[10px] text-white/60 uppercase font-black tracking-[0.2em] drop-shadow-md">
                     <span className="hover:text-orange-400 transition-colors cursor-default">Arise with Determination</span>
                     <span className="text-white/20">•</span>
                     <span className="hover:text-orange-400 transition-colors cursor-default">ಯುದ್ಧಕ್ಕೆ ಸಿದ್ಧನಾಗು</span>
                  </div>
                </div>
              </div>
              
              {/* Short Accent Line */}
              <div className="w-px h-16 bg-linear-to-b from-orange-500/60 to-transparent mt-8 relative z-10" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <Link href="/simulator" className="group relative inline-flex items-center gap-3 bg-white/5 border border-white/10 hover:border-primary/50 px-4 py-2 rounded-full transition-all hover:bg-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Counseling Simulator 2025</span>
                </div>
                <div className="w-px h-3 bg-white/20" />
                <span className="text-[9px] font-bold text-primary group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Try Now <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </Link>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-white leading-tight"
            >
              KCET College <span className="text-primary">Predictor.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-lg text-muted-foreground mb-10 max-w-xl mx-auto font-medium"
            >
              Predict your engineering college instantly with 2025 official data and high-fidelity counseling analytics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-4 w-full sm:w-auto"
            >
              <Link href="/predictor" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 active:scale-95 group">
                  Predict Colleges
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/simulator" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto glass text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:bg-white/10 hover:scale-105 active:scale-95 group">
                  <Monitor className="w-5 h-5 text-primary" />
                  Counseling Simulator
                </button>
              </Link>
              <Link href="/rank-predictor" className="w-full sm:w-auto group relative">
                <button className="w-full sm:w-auto bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:border-primary/50 hover:scale-105 active:scale-95 group/btn">
                  Rank Predictor
                  <Zap className="w-4 h-4 text-primary group-hover/btn:text-white transition-colors" />
                </button>
              </Link>
              <Link href="/cutoffs" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto glass text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all hover:bg-white/10 hover:scale-105 active:scale-95">
                  Explore Cutoffs
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Floating Cards Demo */}
          <div className="mt-24 relative max-w-5xl mx-auto h-48 hidden lg:block">
            <div className="absolute top-0 left-0">
              <FloatingCard name="RVCE" branch="CSE" rank="242" delay={0} />
            </div>
            <div className="absolute top-12 left-1/4">
              <FloatingCard name="PESU AIML" branch="AIML" rank="850" delay={0.5} />
            </div>
            <div className="absolute top-4 right-1/4">
              <FloatingCard name="BMSCE ECE" branch="ECE" rank="1200" delay={1} />
            </div>
            <div className="absolute top-16 right-0">
              <FloatingCard name="MSRIT ISE" branch="ISE" rank="1500" delay={1.5} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Section */}
      <section className="py-24 bg-secondary/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Precision Counseling Tools</h2>
            <p className="text-muted-foreground">Everything you need to navigate the KCET counseling process.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Zap} 
              title="Instant Predictions" 
              description="Get immediate results based on your rank, category, and preferences with our high-speed algorithm."
            />
            <FeatureCard 
              icon={Search} 
              title="Smart Filters" 
              description="Narrow down your choices by city, fees, branch, and college type with powerful search capabilities."
            />
            <FeatureCard 
              icon={BarChart3} 
              title="Cutoff Trends" 
              description="Analyze how ranks have moved over the years to make data-driven decisions."
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Visually Trustworthy" 
              description="Data sourced directly from official KEA sources, presented with clarity and accuracy."
            />
            <FeatureCard 
              icon={Smartphone} 
              title="Mobile Friendly" 
              description="Predict on the go. Our platform is fully optimized for a premium mobile experience."
            />
            <FeatureCard 
              icon={Sparkles} 
              title="College Comparison" 
              description="Compare colleges side-by-side on placements, infrastructure, and historical trends."
            />
          </div>
        </div>
      </section>

      {/* Premium Simulator Showcase */}
      <section className="py-32 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
        
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            {/* Visual Side (Mock Interface Preview) */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 w-full relative"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-primary to-rose-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-zinc-950 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                  {/* Mock Portal Header */}
                  <div className="bg-[#E9ECEF] p-4 flex items-center justify-between border-b border-gray-300">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded shadow-sm flex items-center justify-center p-1">
                        <img src="https://www.crustindia.com/wp-content/uploads/2019/06/KEA-Logo.png" className="h-full object-contain" />
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-[8px] font-black text-gray-800 uppercase leading-none">Government of Karnataka</p>
                        <p className="text-[10px] font-bold text-[#00529B] leading-tight">Common Entrance Test 2025</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-px bg-gray-300" />
                      <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-[#00529B]" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Mock Content */}
                  <div className="p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-white/90 uppercase tracking-widest">Mock Allotment Status</h4>
                      <div className="bg-emerald-500/20 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black border border-emerald-500/30 animate-pulse">LIVE SYSTEM</div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
                        <p className="text-[8px] font-bold text-muted-foreground uppercase">College Allotted</p>
                        <p className="text-xs font-black text-primary">RV College of Engineering</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
                        <p className="text-[8px] font-bold text-muted-foreground uppercase">Course Name</p>
                        <p className="text-xs font-black text-white">Computer Science (CSE)</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-between group/row cursor-default">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                            <Monitor className="w-4 h-4 text-primary" />
                         </div>
                         <p className="text-[10px] font-bold text-white">Enter Round 1 Option Entry</p>
                      </div>
                      <ArrowRight className="w-3 h-3 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 flex items-center gap-3 z-20"
                >
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">System Fidelity</p>
                    <p className="text-xs font-bold text-gray-800">100% KEA Logic</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Text Side */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 space-y-8"
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Advanced Training Tool</span>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                  Master the KEA Portal <br />
                  <span className="text-primary">Before Results Day.</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Don't risk mistakes during the real counseling window. Our high-fidelity simulator lets you practice option entry and experience mock allotments in a risk-free environment.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <Target className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Option Entry Prep</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Practice adding, deleting, and re-ordering colleges exactly like the official portal.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1">Choice-1/2/3/4 Logic</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Understand the complex "Accept & Upgrade" flows with real-time feedback.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/simulator">
                  <button className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-primary hover:text-white transition-all shadow-2xl hover:scale-105 active:scale-95 group">
                    Launch KCET Simulator
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
                <p className="mt-4 text-[10px] text-muted-foreground font-medium flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                  Free for all KCET 2025 Aspirants
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Global Footer is handled by layout.tsx */}
    </div>
  );
}
