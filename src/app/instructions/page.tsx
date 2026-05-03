'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  BookOpen, 
  Info, 
  Target, 
  BarChart2, 
  Heart, 
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  Zap
} from 'lucide-react';

const FEATURE_GUIDE = [
    {
        title: "KCET Predictor",
        desc: "Predict your potential engineering colleges based on your rank, category, and gender. Uses 2025 official data with high-fidelity algorithms.",
        icon: <Target className="w-5 h-5 text-primary" />
    },
    {
        title: "College Explorer",
        desc: "Browse comprehensive details of all engineering colleges in Karnataka, including historical cutoffs, placement stats, and campus photos.",
        icon: <GraduationCap className="w-5 h-5 text-emerald-400" />
    },
    {
        title: "Comparison Suite",
        desc: "Compare up to 4 colleges side-by-side to analyze differences in fees, placement packages, and cutoff trends.",
        icon: <BarChart2 className="w-5 h-5 text-blue-400" />
    },
    {
        title: "Smart Wishlist",
        desc: "Save your target choices and rearrange them to create your final option-entry list. Export the list as a professional PDF.",
        icon: <Heart className="w-5 h-5 text-rose-500" />
    }
];

const CATEGORY_GUIDE = [
    { code: "GM", full: "General Merit" },
    { code: "1G / 1K / 1R", full: "Category 1 (General / Kannada / Rural)" },
    { code: "2AG / 2AK / 2AR", full: "Category 2A (General / Kannada / Rural)" },
    { code: "2BG / 2BK / 2BR", full: "Category 2B (General / Kannada / Rural)" },
    { code: "3AG / 3AK / 3AR", full: "Category 3A (General / Kannada / Rural)" },
    { code: "3BG / 3BK / 3BR", full: "Category 3B (General / Kannada / Rural)" },
    { code: "SCG / SCK / SCR", full: "Scheduled Caste (General / Kannada / Rural)" },
    { code: "STG / STK / STR", full: "Scheduled Tribe (General / Kannada / Rural)" }
];

const BRANCH_GUIDE = [
    { code: "CS / CSE", full: "Computer Science & Engineering" },
    { code: "IS / ISE", full: "Information Science & Engineering" },
    { code: "EC / ECE", full: "Electronics & Communication Engineering" },
    { code: "AI / ADS", full: "Artificial Intelligence & Data Science" },
    { code: "ME / MECH", full: "Mechanical Engineering" },
    { code: "CV / CIVIL", full: "Civil Engineering" },
    { code: "EE / EEE", full: "Electrical & Electronics Engineering" },
    { code: "BT", full: "Biotechnology" },
    { code: "CY", full: "Computer Science (Cyber Security)" },
    { code: "AM", full: "CS (AI & Machine Learning)" }
];

export default function InstructionsPage() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-16 text-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6"
                    >
                        <HelpCircle className="w-4 h-4" /> User Guide & Documentation
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
                        Master the <span className="text-primary">Platform.</span>
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-medium">
                        Everything you need to know about navigating the KCET Counseling Assistant and understanding the official nomenclature.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Features Section */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                                <Zap className="w-6 h-6 text-primary" /> Key Features
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {FEATURE_GUIDE.map((feature, idx) => (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="glass-card p-6 border-white/5 hover:border-primary/30 transition-all"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </section>

                        <section className="pt-8">
                            <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                                <BookOpen className="w-6 h-6 text-emerald-400" /> Branch Codes Decoder
                            </h2>
                            <div className="glass-card overflow-hidden border-white/5">
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/5">
                                    {BRANCH_GUIDE.map((branch, idx) => (
                                        <div key={idx} className="bg-zinc-950 p-4">
                                            <div className="text-primary font-black text-xs mb-1">{branch.code}</div>
                                            <div className="text-[11px] font-medium text-white/70 leading-tight">{branch.full}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar: Categories */}
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                                <ShieldCheck className="w-6 h-6 text-rose-500" /> Category Suffixes
                            </h2>
                            <div className="glass-card p-6 space-y-4 border-white/5">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold shrink-0 mt-0.5">G</div>
                                    <p className="text-sm text-muted-foreground"><span className="text-white font-bold">General:</span> Open to all candidates of that category.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold shrink-0 mt-0.5">K</div>
                                    <p className="text-sm text-muted-foreground"><span className="text-white font-bold">Kannada:</span> Candidates with 10 years of study in Kannada medium.</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-primary text-[10px] font-bold shrink-0 mt-0.5">R</div>
                                    <p className="text-sm text-muted-foreground"><span className="text-white font-bold">Rural:</span> Candidates with 10 years of study in rural schools.</p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">
                                <Info className="w-6 h-6 text-blue-400" /> Category Codes
                            </h2>
                            <div className="space-y-2">
                                {CATEGORY_GUIDE.map((cat, idx) => (
                                    <div key={idx} className="glass-card p-3 border-white/5 flex items-center justify-between gap-4">
                                        <div className="text-xs font-black text-white px-2 py-1 bg-white/5 rounded min-w-[40px] text-center">{cat.code.split(' / ')[0]}</div>
                                        <div className="text-[11px] font-medium text-muted-foreground text-right">{cat.full.split(' (')[0]}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                <footer className="mt-20 p-8 rounded-3xl bg-primary/5 border border-primary/10 text-center">
                    <h3 className="text-xl font-bold mb-2 text-white">Still have questions?</h3>
                    <p className="text-muted-foreground mb-6">Contact the developer for technical support or data queries.</p>
                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-primary font-bold">Email:</span> yashwinka8@gmail.com
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-primary font-bold">Telegram:</span> @flux_35
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
