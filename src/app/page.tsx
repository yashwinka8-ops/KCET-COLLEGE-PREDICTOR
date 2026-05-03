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
  Target
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

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              Accurate college predictions using previous KCET cutoff trends and smart analytics. Plan your counseling with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link href="/predictor" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-2xl hover:shadow-primary/40 active:scale-95 group">
                  Predict Colleges
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/cutoffs" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto glass text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:bg-white/10 hover:scale-105 active:scale-95">
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

      {/* Interactive Preview Section */}
      <section className="py-24 relative overflow-hidden">
         <div className="container mx-auto px-6">
            <div className="glass-card max-w-5xl mx-auto p-12 flex flex-col lg:flex-row items-center gap-12 border border-primary/20">
              <div className="flex-1">
                <h2 className="text-4xl font-bold mb-6 text-gradient">Realistic Simulator</h2>
                <p className="text-muted-foreground mb-8 text-lg">Experience the power of our prediction engine. Enter your rank and see how the platform categorizes colleges into Dream, Moderate, and Safe zones.</p>
                <Link href="/predictor">
                  <button className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105">
                    Try Live Predictor
                  </button>
                </Link>
              </div>
              <div className="flex-1 w-full relative">
                <div className="glass p-8 rounded-2xl border-white/10 relative overflow-hidden group">
                   <div className="absolute inset-0 bg-linear-to-tr from-primary/5 to-transparent pointer-events-none" />
                   <div className="flex flex-col gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Your KCET Rank</label>
                        <div className="h-12 glass rounded-xl border-white/10 flex items-center px-4 text-xl font-mono text-primary group-hover:border-primary/50 transition-colors">
                          1248
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-20 glass rounded-xl border-white/10 flex flex-col justify-center items-center text-center p-2">
                           <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Category</div>
                           <div className="font-semibold">General</div>
                        </div>
                        <div className="h-20 glass rounded-xl border-white/10 flex flex-col justify-center items-center text-center p-2">
                           <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Round</div>
                           <div className="font-semibold">Round 1</div>
                        </div>
                      </div>
                      <div className="h-32 glass rounded-xl border-primary/30 flex flex-col justify-center items-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary/20">
                          <motion.div 
                            className="h-full bg-primary"
                            animate={{ width: ["0%", "100%", "0%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />
                        </div>
                        <span className="text-sm font-semibold animate-pulse">Calculating Predictions...</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
         </div>
      </section>

      {/* Main Global Footer is handled by layout.tsx */}
    </div>
  );
}
