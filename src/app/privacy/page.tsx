'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Lock, Database, Info, Scale } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-24 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none -z-10">
                <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-rose-500/10 blur-[100px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 max-w-4xl">
                {/* Header */}
                <div className="text-center space-y-4 mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest"
                    >
                        <Scale className="w-4 h-4" />
                        Legal Compliance & Privacy
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black tracking-tighter"
                    >
                        Privacy <span className="text-primary">&</span> Disclaimer.
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-muted-foreground text-lg"
                    >
                        Last Updated: May 2025
                    </motion.p>
                </div>

                <div className="space-y-16">
                    {/* Official Disclaimer */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                                <ShieldAlert className="w-6 h-6 text-rose-500" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">Official Disclaimer</h2>
                        </div>
                        <div className="glass-card p-8 space-y-4 border-rose-500/10">
                            <p className="text-muted-foreground leading-relaxed">
                                <strong className="text-white">NOT AN OFFICIAL KEA PLATFORM:</strong> This website (KCET Predictor / Simulator) is an <span className="text-rose-400 font-bold underline underline-offset-4">Independent Educational Resource</span>. We are <span className="text-white font-bold">NOT</span> affiliated with, authorized by, or in any way officially connected to the <span className="text-white">Karnataka Examinations Authority (KEA)</span>, the <span className="text-white">National Informatics Centre (NIC)</span>, or any Government of Karnataka department.
                            </p>
                            <p className="text-muted-foreground leading-relaxed">
                                The official website for KCET counseling is <a href="https://cetonline.karnataka.gov.in/kea/ugcet2025" className="text-primary hover:underline font-bold" target="_blank">cetonline.karnataka.gov.in/kea/ugcet2025</a>. Users are strictly advised to refer to the official KEA portal for actual registration, document verification, and seat allotment.
                            </p>
                            
                            <div className="pt-6 border-t border-white/5 space-y-4">
                                <h4 className="font-bold text-white uppercase text-xs tracking-widest">Trademark & Fair Use Notice</h4>
                                <p className="text-[11px] text-muted-foreground leading-relaxed">
                                    The use of the <span className="text-white">KEA (Karnataka Examinations Authority)</span> logo and branding elements on this platform is for **identification, educational, and simulation purposes only**. This usage falls under the principles of <span className="text-white font-bold">"Fair Use"</span> to provide a realistic training environment for students. We do not claim ownership of these trademarks, and no copyright infringement is intended. Our goal is to assist students in navigating the complex counseling process through a simulated environment, not to replicate or replace the official government infrastructure.
                                </p>
                            </div>

                            <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-xl">
                                <p className="text-[11px] font-bold text-rose-300 italic">
                                    Note: Predictions and simulation results are generated using historical algorithms and should be used as a guide only. Final allotments depend entirely on KEA's current year algorithms and seat matrix.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Privacy Policy */}
                    <section className="space-y-8">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                <Lock className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight">Privacy Policy</h2>
                        </div>

                        <div className="grid gap-8">
                            <div className="flex gap-6">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                    <Database className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-white uppercase text-sm tracking-wider">Data Collection</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        We collect information provided by you during the use of our Predictor and Simulator tools, including but not limited to your **KCET Rank, Category, and College Preferences**. This data is used solely to provide accurate predictions and counseling guidance.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-white uppercase text-sm tracking-wider">Future Usage & Analytics</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        By using this platform, you acknowledge and agree that your anonymized rank and preference data may be used to **improve our prediction algorithms for future years**. This historical data helps us provide better insights for future KCET aspirants. We do not sell your personal identification to third-party marketing agencies.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-6">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                                    <Info className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-white uppercase text-sm tracking-wider">Cookies & Tracking</h4>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        We use standard web cookies to maintain your session and save your college wishlist locally on your device. We may use analytics tools (like Google Analytics) to monitor platform traffic and performance.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Liability */}
                    <section className="bg-zinc-900/50 p-12 rounded-[3rem] border border-white/5 text-center space-y-6">
                        <h3 className="text-xl font-bold text-white uppercase tracking-widest">Limitation of Liability</h3>
                        <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Under no circumstances shall the creators of this platform be held liable for any loss of seat, incorrect choice entry, or psychological distress resulting from the use of this simulator. The student is solely responsible for their final submissions on the official KEA website.
                        </p>
                        <div className="pt-4">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
                                Use Responsibly • Plan Wisely
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
