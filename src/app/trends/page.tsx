'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Trophy, 
  Star, 
  MapPin, 
  IndianRupee, 
  Building2, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart,
  Target,
  ArrowLeft,
  Filter,
  GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const tiers = [
  {
    id: 'tier1',
    name: 'Tier 1',
    subtitle: 'Top Tier (The Elite)',
    icon: Trophy,
    color: 'text-amber-400',
    bg: 'bg-amber-400/10',
    border: 'border-amber-400/20',
    data: [
      { name: 'R. V. College of Engineering (RVCE)', location: 'Bengaluru', fees: '₹1–11 Lakh', avg: '₹10–12 LPA', highest: '₹60+ LPA', rating: '9.8/10' },
      { name: 'PES University', location: 'Bengaluru', fees: '₹4–5 Lakh/yr', avg: '₹8–10 LPA', highest: '₹50+ LPA', rating: '9.6/10' },
      { name: 'M S Ramaiah Institute of Technology (MSRIT)', location: 'Bengaluru', fees: '₹1–5 Lakh/yr', avg: '₹7–9 LPA', highest: '₹45+ LPA', rating: '9.5/10' },
      { name: 'B M S College of Engineering', location: 'Bengaluru', fees: '₹1–5 Lakh/yr', avg: '₹7–8 LPA', highest: '₹50+ LPA', rating: '9.4/10' },
      { name: 'Ramaiah University of Applied Sciences', location: 'Bengaluru', fees: '₹3–4 Lakh/yr', avg: '₹6–8 LPA', highest: '₹30+ LPA', rating: '8.8/10' },
      { name: 'Siddaganga Institute of Technology', location: 'Tumakuru', fees: '₹1–2 Lakh/yr', avg: '₹5–7 LPA', highest: '₹40+ LPA', rating: '9.0/10' },
      { name: 'JSS Science and Technology University', location: 'Mysuru', fees: '₹1–2 Lakh/yr', avg: '₹5–7 LPA', highest: '₹35+ LPA', rating: '9.1/10' },
      { name: 'University of Visvesvaraya College of Engineering (UVCE)', location: 'Bengaluru', fees: '₹40K–70K/yr', avg: '₹5–7 LPA', highest: '₹25+ LPA', rating: '9.0/10' },
      { name: 'Sir M. Visvesvaraya Institute of Technology', location: 'Bengaluru', fees: '₹1–2 Lakh/yr', avg: '₹4–6 LPA', highest: '₹20+ LPA', rating: '8.6/10' },
      { name: 'BMS Institute of Technology & Management', location: 'Bengaluru', fees: '₹1–3 Lakh/yr', avg: '₹5–7 LPA', highest: '₹30+ LPA', rating: '8.8/10' },
      { name: 'RNS Institute of Technology', location: 'Bengaluru', fees: '₹1–3 Lakh/yr', avg: '₹5–7 LPA', highest: '₹25+ LPA', rating: '8.8/10' },
      { name: 'Dayananda Sagar College of Engineering', location: 'Bengaluru', fees: '₹1–4 Lakh/yr', avg: '₹5–7 LPA', highest: '₹30+ LPA', rating: '8.8/10' },
    ]
  },
  {
    id: 'tier1.5',
    name: 'Tier 1.5',
    subtitle: 'High Performance (Very Good)',
    icon: Star,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    data: [
      { name: 'Bangalore Institute of Technology (BIT)', location: 'Bengaluru', fees: '₹1–2 Lakh/yr', avg: '₹4–6 LPA', rating: '8.7/10' },
      { name: 'NIE (National Institute of Engineering)', location: 'Mysuru', fees: '₹1–2 Lakh/yr', avg: '₹4–6 LPA', rating: '8.7/10' },
      { name: 'SJCE / JSSSTU', location: 'Mysuru', fees: '₹1–2 Lakh/yr', avg: '₹5–7 LPA', rating: '9.0/10' },
      { name: 'KLE Technological University', location: 'Hubballi', fees: '₹2–3 Lakh/yr', avg: '₹4–6 LPA', rating: '8.5/10' },
      { name: 'BVB College (KLE Tech)', location: 'Hubballi', fees: '₹2–3 Lakh/yr', avg: '₹4–6 LPA', rating: '8.5/10' },
      { name: 'SDM College of Engineering', location: 'Dharwad', fees: '₹1–2 Lakh/yr', avg: '₹3–5 LPA', rating: '8.0/10' },
      { name: 'Malnad College of Engineering', location: 'Hassan', fees: '₹80K–1.5 Lakh/yr', avg: '₹4–5 LPA', rating: '8.4/10' },
      { name: 'SJBIT', location: 'Bengaluru', fees: '₹1–2 Lakh/yr', avg: '₹4–5 LPA', rating: '8.3/10' },
      { name: 'BNM Institute of Technology', location: 'Bengaluru', fees: '₹1–2 Lakh/yr', avg: '₹4–6 LPA', rating: '8.5/10' },
      { name: 'Global Academy of Technology', location: 'Bengaluru', fees: '₹1–2 Lakh/yr', avg: '₹4–5 LPA', rating: '8.1/10' },
      { name: 'New Horizon College of Engineering', location: 'Bengaluru', fees: '₹2–3 Lakh/yr', avg: '₹4–6 LPA', rating: '8.3/10' },
      { name: 'CMR Institute of Technology', location: 'Bengaluru', fees: '₹2–3 Lakh/yr', avg: '₹4–5 LPA', rating: '8.1/10' },
      { name: 'Acharya Institute of Technology', location: 'Bengaluru', fees: '₹2–3 Lakh/yr', avg: '₹4–5 LPA', rating: '8.0/10' },
      { name: 'RV Institute of Technology & Management', location: 'Bengaluru', fees: '₹2–3 Lakh/yr', avg: '₹4–5 LPA', rating: '8.0/10' },
      { name: 'Dayananda Sagar Academy of Technology & Management', location: 'Bengaluru', fees: '₹2–3 Lakh/yr', avg: '₹4–5 LPA', rating: '8.0/10' },
    ]
  },
  {
    id: 'tier2',
    name: 'Tier 2',
    subtitle: 'Quality & Growth (Good)',
    icon: Building2,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    data: [
      { name: 'Dr Ambedkar Institute of Technology', location: 'Bengaluru', avg: '₹3–5 LPA', rating: '7.8/10' },
      { name: 'MVJ College of Engineering', location: 'Bengaluru', avg: '₹3–5 LPA', rating: '7.8/10' },
      { name: 'K S Institute of Technology', location: 'Bengaluru', avg: '₹3–5 LPA', rating: '7.7/10' },
      { name: 'Vemana Institute of Technology', location: 'Bengaluru', avg: '₹3–5 LPA', rating: '7.7/10' },
      { name: 'Cambridge Institute of Technology', location: 'Bengaluru', avg: '₹3–5 LPA', rating: '7.6/10' },
      { name: 'AMC Engineering College', location: 'Bengaluru', avg: '₹3–4 LPA', rating: '7.3/10' },
      { name: 'East Point College', location: 'Bengaluru', avg: '₹3–4 LPA', rating: '7.2/10' },
      { name: 'Don Bosco Institute of Technology', location: 'Bengaluru', avg: '₹3–5 LPA', rating: '7.5/10' },
      { name: 'East West Institute of Technology', location: 'Bengaluru', avg: '₹3–4 LPA', rating: '7.2/10' },
      { name: 'Sapthagiri NPS University', location: 'Bengaluru', avg: '₹3–4 LPA', rating: '7.0/10' },
      { name: 'Sri Krishna Institute of Technology', location: 'Bengaluru', avg: '₹3–4 LPA', rating: '7.1/10' },
      { name: 'Rajarajeswari College of Engineering', location: 'Bengaluru', avg: '₹3–4 LPA', rating: '7.2/10' },
      { name: 'Presidency University', location: 'Bengaluru', avg: '₹4–6 LPA', rating: '7.8/10' },
      { name: 'REVA University', location: 'Bengaluru', avg: '₹5–7 LPA', rating: '8.3/10' },
      { name: 'Alliance University', location: 'Bengaluru', avg: '₹5–8 LPA', rating: '8.2/10' },
      { name: 'CMR University', location: 'Bengaluru', avg: '₹4–6 LPA', rating: '7.7/10' },
      { name: 'RV University', location: 'Bengaluru', avg: '₹5–8 LPA', rating: '8.2/10' },
      { name: 'Vidya Vardhaka College of Engineering', location: 'Mysuru', avg: '₹3–5 LPA', rating: '7.8/10' },
      { name: 'Sahyadri College of Engineering', location: 'Mangaluru', avg: '₹4–6 LPA', rating: '8.0/10' },
      { name: 'Canara Engineering College', location: 'Mangaluru', avg: '₹3–5 LPA', rating: '7.8/10' },
      { name: 'St Joseph Engineering College', location: 'Mangaluru', avg: '₹3–5 LPA', rating: '7.8/10' },
      { name: 'MITE', location: 'Mangaluru', avg: '₹3–5 LPA', rating: '7.8/10' },
      { name: 'Alva’s Institute of Engineering', location: 'Moodbidri', avg: '₹3–4 LPA', rating: '7.2/10' },
      { name: 'P A College of Engineering', location: 'Mangaluru', avg: '₹3–4 LPA', rating: '7.1/10' },
    ]
  }
];

const tier3Colleges = [
  "Ghousia Engineering College", "SJC Institute of Technology", "Dr TTIT", "Kalpatharu Institute of Technology", 
  "Tontadarya College of Engineering", "Rural Engineering College", "KVG College of Engineering", "SJM Institute of Technology", 
  "Bahubali College of Engineering", "Ballari Institute of Technology", "Oxford College of Engineering", "HKBK College of Engineering", 
  "APS College of Engineering", "Sri Sairam College of Engineering", "Vivekananda Institute of Technology", "Basavakalyana Engineering College", 
  "Atria Institute of Technology", "KNS Institute of Technology", "Sambhram Institute of Technology", "RL Jalappa Institute of Technology", 
  "Rajiv Gandhi Institute of Technology", "MS Engineering College", "Impact College of Engineering", "Srinivas Institute of Technology", 
  "T John Institute of Technology", "SEA College of Engineering", "Karavali Institute of Technology", "RR Institute of Technology", 
  "Sai Vidya Institute of Technology", "ACS College of Engineering", "Vijaya Vittala Institute of Technology", "Bangalore Technological Institute", 
  "Jyothi Institute of Technology", "Cauvery Institute of Technology", "East West College of Engineering", "Rai Technological University", 
  "Akash Institute of Engineering", "Seshadripuram Institute of Technology", "Harsha Institute of Technology"
];

const rankRanges = [
  { range: 'Under 2K', colleges: 'RVCE, PES, MSRIT, BMSCE' },
  { range: '2K–5K', colleges: 'DSCE, BIT, RNSIT, BMSIT' },
  { range: '5K–10K', colleges: 'SJBIT, BNMIT, NIE, SIT' },
  { range: '10K–20K', colleges: 'REVA, NHCE, CMRIT, GAT' },
  { range: '20K–40K', colleges: 'Acharya, Cambridge, MVJ' },
  { range: '40K+', colleges: 'Tier 3 colleges' },
];

export default function TrendsPage() {
  const [activeTier, setActiveTier] = useState('tier1');

  return (
    <div className="min-h-screen bg-black text-white pt-32 pb-20 px-4 md:px-8">
      {/* Background Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-xs font-bold uppercase tracking-widest mb-6"
          >
            <TrendingUp className="w-4 h-4" />
            Karnataka Engineering Intelligence (2026)
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-black mb-6 tracking-tight"
          >
            Tier-Wise <span className="text-gradient">College Dashboard</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          >
            Expertly curated tier lists, placement metrics, and admission insights. 
            Make data-driven decisions for your engineering future.
          </motion.p>
        </header>

        {/* Highlight Insights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Highest ROI Leader', value: 'UVCE Bengaluru', sub: 'Low Fees, High Pay', icon: IndianRupee, color: 'text-emerald-400' },
            { label: 'Placement Champion', value: 'RVCE Bengaluru', sub: '₹12 LPA Avg Package', icon: Target, color: 'text-primary' },
            { label: 'Best Campus Culture', value: 'PES University', sub: 'Innovation & Tech', icon: Zap, color: 'text-blue-400' },
            { label: 'Academic Rigor', value: 'MSRIT Bengaluru', sub: 'Top-Notch Faculty', icon: GraduationCap, color: 'text-amber-400' },
          ].map((insight, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="glass-card p-6 border-b-2 hover:border-white/20 transition-all group"
            >
              <div className={cn("w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10 group-hover:scale-110 transition-transform", insight.color)}>
                <insight.icon className="w-6 h-6" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{insight.label}</p>
              <h3 className="text-lg font-bold mb-1">{insight.value}</h3>
              <p className="text-xs text-muted-foreground">{insight.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Tier Selection Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {tiers.map((tier) => (
            <button
              key={tier.id}
              onClick={() => setActiveTier(tier.id)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all border",
                activeTier === tier.id 
                  ? "bg-white text-black border-white shadow-xl shadow-white/10" 
                  : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:text-white"
              )}
            >
              <tier.icon className="w-4 h-4" />
              {tier.name}
            </button>
          ))}
          <button
            onClick={() => setActiveTier('tier3')}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all border",
              activeTier === 'tier3' 
                ? "bg-white text-black border-white shadow-xl shadow-white/10" 
                : "bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:text-white"
            )}
          >
            <BarChart className="w-4 h-4" />
            Tier 3
          </button>
        </div>

        {/* Tier Content */}
        <div className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {tiers.find(t => t.id === activeTier) ? (
              <motion.div
                key={activeTier}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className={cn("w-14 h-14 rounded-3xl flex items-center justify-center border", tiers.find(t => t.id === activeTier)?.bg, tiers.find(t => t.id === activeTier)?.border)}>
                    {React.createElement(tiers.find(t => t.id === activeTier)!.icon, { className: cn("w-7 h-7", tiers.find(t => t.id === activeTier)?.color) })}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black">{tiers.find(t => t.id === activeTier)?.name}</h2>
                    <p className="text-muted-foreground">{tiers.find(t => t.id === activeTier)?.subtitle}</p>
                  </div>
                </div>

                <div className="glass-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/2">
                          <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">College</th>
                          <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Location</th>
                          {activeTier !== 'tier2' && <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Fees</th>}
                          <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Avg Package</th>
                          {activeTier === 'tier1' && <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Highest</th>}
                          <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground text-center">Rating</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {tiers.find(t => t.id === activeTier)?.data.map((college, idx) => (
                          <tr key={idx} className="hover:bg-white/2 transition-colors">
                            <td className="px-6 py-4 font-bold text-sm">{college.name}</td>
                            <td className="px-6 py-4 text-muted-foreground text-sm flex items-center gap-1.5">
                              <MapPin className="w-3 h-3" />
                              {college.location}
                            </td>
                            {activeTier !== 'tier2' && <td className="px-6 py-4 text-emerald-400 text-sm font-mono">{college.fees}</td>}
                            <td className="px-6 py-4 text-primary text-sm font-black">{college.avg}</td>
                            {activeTier === 'tier1' && <td className="px-6 py-4 text-rose-400 text-sm font-black">{college.highest}</td>}
                            <td className="px-6 py-4 text-center">
                              <span className="bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-black text-amber-400">
                                {college.rating}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="tier3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-3xl bg-zinc-800 flex items-center justify-center border border-white/10">
                    <BarChart className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black">Tier 3 Colleges</h2>
                    <p className="text-muted-foreground">Reliable for degree completion and local placements.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="flex flex-wrap gap-2">
                      {tier3Colleges.map((college, idx) => (
                        <div key={idx} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-bold text-muted-foreground hover:border-white/20 hover:text-white transition-all cursor-default">
                          {college}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="glass-card p-6 border-l-4 border-rose-500">
                      <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                        <BarChart className="w-4 h-4 text-rose-500" />
                        Average Performance
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Avg Package</p>
                          <p className="text-xl font-black">₹2.5–4 LPA</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Highest Package</p>
                          <p className="text-xl font-black">₹8–15 LPA</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Best Branches</p>
                          <p className="text-sm font-bold text-primary">CSE, AIML, ISE</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Special Lists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-24">
          {/* Rank Strategy */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <Target className="w-6 h-6 text-primary" />
              Strategy by Rank
            </h2>
            <div className="glass-card overflow-hidden">
              <table className="w-full text-left">
                <tbody className="divide-y divide-white/5">
                  {rankRanges.map((r, idx) => (
                    <tr key={idx} className="hover:bg-white/2 transition-colors">
                      <td className="px-4 py-4 text-xs font-black text-primary uppercase whitespace-nowrap">{r.range}</td>
                      <td className="px-4 py-4 text-[10px] font-bold text-muted-foreground leading-tight">{r.colleges}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Placement Leaders */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
              Top 10 Placement
            </h2>
            <div className="space-y-3">
              {[
                'RVCE', 'PES University', 'MSRIT', 'BMSCE', 'DSCE', 'RNSIT', 'BMSIT', 'BIT Bengaluru', 'NIE Mysuru', 'REVA University'
              ].map((name, idx) => (
                <div key={idx} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10 group hover:border-blue-400/30 transition-all">
                  <span className="text-xs font-black text-blue-400/50 w-4">{idx + 1}</span>
                  <span className="text-sm font-bold">{name}</span>
                  <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* Best Government / Low Fee */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-3">
              <GraduationCap className="w-6 h-6 text-emerald-400" />
              High ROI / Govt
            </h2>
            <div className="space-y-4">
              {[
                { name: 'UVCE', detail: '₹40K–70K/yr | Cheapest + Strong Alumni' },
                { name: 'SKSJTI', detail: '₹50K–80K/yr | Heritage + Affordable' },
                { name: 'JSSSTU', detail: '₹70K–1L/yr | Excellent Reputation' },
                { name: 'NIE Mysuru', detail: '₹1L–2L/yr | Historic Legacy' },
                { name: 'SIT Tumakuru', detail: '₹80K–1.2L/yr | Great Placements' },
                { name: 'KLE Tech', detail: '₹2L–3L/yr | Best Coding Culture' },
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                  <h4 className="text-sm font-black text-emerald-400 mb-1">{item.name}</h4>
                  <p className="text-[10px] font-bold text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Special Recognition Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Best for CSE/AI */}
          <div className="glass-card p-8 border-t-4 border-primary">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <Zap className="w-6 h-6 text-primary" />
              Best for CSE / AI Tech
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'RVCE', note: 'Elite coding culture' },
                { name: 'PES University', note: 'Strong startup culture' },
                { name: 'MSRIT', note: 'Excellent tech exposure' },
                { name: 'BMSCE', note: 'Strong placements' },
                { name: 'REVA University', note: 'Growing AI programs' },
                { name: 'RV University', note: 'Modern curriculum' },
                { name: 'Alliance University', note: 'Industry exposure' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-sm font-black text-white">{item.name}</span>
                  <span className="text-[10px] text-muted-foreground">{item.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top 15 Overall */}
          <div className="glass-card p-8 border-t-4 border-amber-400">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <Star className="w-6 h-6 text-amber-400" />
              Overall Top 15 Recognition
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                'RVCE', 'PES University', 'MSRIT', 'BMSCE', 'UVCE', 'JSSSTU', 'SIT Tumakuru', 
                'NIE Mysuru', 'DSCE', 'RNSIT', 'BIT Bengaluru', 'BMSIT', 'KLE Tech', 
                'REVA University', 'BNMIT'
              ].map((name, idx) => (
                <div key={idx} className="px-4 py-2 rounded-xl bg-amber-400/5 border border-amber-400/20 text-xs font-bold text-amber-400">
                  <span className="mr-2 text-[10px] opacity-50">#{idx + 1}</span>
                  {name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <footer className="mt-32 text-center py-20 border-t border-white/10">
          <h2 className="text-3xl md:text-5xl font-black mb-8">Ready to Predict?</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/predictor">
              <button className="px-10 py-5 rounded-3xl bg-primary text-black font-black hover:scale-105 transition-all shadow-2xl shadow-primary/20 flex items-center gap-3">
                <TrendingUp className="w-5 h-5" />
                Start Predicting
              </button>
            </Link>
            <Link href="/cutoffs">
              <button className="px-10 py-5 rounded-3xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all">
                Explore Cutoffs
              </button>
            </Link>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(to right, #ffffff, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
        }
      `}</style>
    </div>
  );
}
