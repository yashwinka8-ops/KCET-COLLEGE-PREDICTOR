'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  GraduationCap,
  IndianRupee,
  TrendingUp,
  Star,
  Zap,
  Sparkles,
  ChevronDown,
  Info,
  Check,
  ChevronRight,
  ArrowLeftRight,
  Heart,
  Target,
  ExternalLink,
  Play,
  X,
  Calendar,
  Globe,
  ArrowUpDown,
  Building2,
  BarChart,
  Link as LinkIcon,
  Phone,
  BookOpen,
  Image as ImageIcon,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PredictorInput, Category, Gender, Round, PredictionResult, College, CutoffData, Branch } from '@/lib/types';
import { 
  predictColleges, 
  CATEGORIES, 
  BRANCHES, 
  getLevelBg, 
  getLevelColor,
  CS_IT_BRANCHES,
  CORE_BRANCHES,
  TOP_5_COLLEGES,
  TOP_10_COLLEGES,
  getRoundDetails
} from '@/lib/predictor';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useColleges } from '@/lib/contexts/CollegeContext';
import { AuthModal } from '@/components/AuthModal';
import { doc, setDoc, getDoc, addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

import collegesUnifiedRaw from '@/lib/data/colleges_unified.json';
import intelligenceData from '@/lib/data/intelligence.json';

const branchesList = (collegesUnifiedRaw as any).branches as Branch[];
const collegesUnified = (collegesUnifiedRaw as any).colleges as any[];
const branches = (collegesUnifiedRaw as any).branches as Branch[];
const TOP_GEMS = (intelligenceData as any).top_gems as any[];

const MultiSelectDropdown = ({ 
    label, 
    options, 
    selected, 
    onToggle, 
    placeholder = "Select options...",
    icon: Icon
}: { 
    label: string, 
    options: { id: string, name: string }[], 
    selected: string[], 
    onToggle: (id: string) => void,
    placeholder?: string,
    icon?: any
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredOptions = options.filter(o => 
        o.name.toLowerCase().includes(search.toLowerCase()) || 
        o.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-2 relative">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-2">
                {Icon && <Icon className="w-3 h-3" />} {label}
            </label>
            <div className="relative">
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 flex items-center justify-between text-sm transition-all hover:border-white/20",
                        isOpen && "border-primary/50 ring-4 ring-primary/10"
                    )}
                >
                    <span className={cn("truncate mr-2", selected.length === 0 && "text-muted-foreground")}>
                        {selected.length === 0 ? placeholder : `${selected.length} Selected`}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <>
                            <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl z-[70] overflow-hidden"
                            >
                                <div className="p-3 border-b border-white/5">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
                                        <input 
                                            autoFocus
                                            type="text"
                                            placeholder="Search..."
                                            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-8 pr-3 text-xs focus:outline-none focus:border-primary/50"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="max-h-60 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                    {filteredOptions.length === 0 ? (
                                        <div className="p-4 text-center text-xs text-muted-foreground italic">No matches found</div>
                                    ) : (
                                        filteredOptions.map(opt => (
                                            <button
                                                key={opt.id}
                                                onClick={() => onToggle(opt.id)}
                                                className={cn(
                                                    "w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-all group",
                                                    selected.includes(opt.id) 
                                                        ? "bg-primary/20 text-primary" 
                                                        : "hover:bg-white/5 text-muted-foreground"
                                                )}
                                            >
                                                <span className="truncate">{opt.name}</span>
                                                {selected.includes(opt.id) && <Check className="w-3 h-3" />}
                                            </button>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
            {selected.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {selected.slice(0, 3).map(id => (
                        <div key={id} className="bg-primary/10 border border-primary/20 rounded-md px-2 py-0.5 text-[9px] font-bold text-primary uppercase flex items-center gap-1.5">
                            {options.find(o => o.id === id)?.id || id}
                            <button onClick={() => onToggle(id)}><X className="w-2 h-2" /></button>
                        </div>
                    ))}
                    {selected.length > 3 && (
                        <div className="bg-white/5 border border-white/10 rounded-md px-2 py-0.5 text-[9px] font-bold text-muted-foreground uppercase">
                            +{selected.length - 3} More
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const REGIONS = Array.from(new Set(collegesUnified.map(c => c.region))).filter(r => r !== 'Other').sort();

interface GroupedResult {
    college: College;
    branches: PredictionResult[];
}

const CollegeDetailsModal = ({ 
    isOpen, 
    onClose, 
    college 
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    college: College | null 
}) => {
    const [selectedCategory, setSelectedCategory] = useState<Category>('GM');
    
    if (!isOpen || !college) return null;

    // Get college data from unified source
    const unifiedCollege = collegesUnified.find(c => c.college_id === college.college_id);
    const branchData = unifiedCollege?.kcet_cutoffs
        .filter((co: any) => co.category === selectedCategory)
        .map((co: any) => ({
            branch: branchesList.find(b => b.branch_id === co.branch_id) || { branch_name: co.branch_id, branch_id: co.branch_id },
            r1: co.r1 || 'N/A',
            r2: co.r2 || 'N/A',
            r3: co.r3 || 'N/A',
        })) || [];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-md" 
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-5xl max-h-[90vh] bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col"
                >
                    {/* Hero Image Section */}
                    {college.image_url && (
                        <div className="relative h-48 md:h-64 w-full overflow-hidden">
                            <img 
                                src={college.image_url} 
                                alt={college.full_name} 
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                        </div>
                    )}

                    {/* Header */}
                    <div className={cn(
                        "p-6 md:p-8 border-b border-white/5 bg-white/2",
                        college.image_url && "-mt-20 relative z-10 bg-transparent border-none"
                    )}>
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0 shadow-2xl">
                                    <Building2 className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">{college.full_name}</h2>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-4 h-4" />
                                            {college.city}, {college.region}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <TrophyIcon className={cn(
                                                "w-4 h-4 shrink-0",
                                                college.tier === "Tier 1" ? "text-amber-400" : 
                                                college.tier === "Tier 1.5" ? "text-blue-400" : 
                                                college.tier === "Tier 2" ? "text-emerald-400" : "text-zinc-400"
                                            )} />
                                            <span className="font-bold">{college.tier || "Tier 3"}</span>
                                            {college.rating && (
                                                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-black text-amber-400">
                                                    {college.rating}
                                                </span>
                                            )}
                                        </div>
                                        {college.website && (
                                            <a href={`https://${college.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-primary hover:underline">
                                                <LinkIcon className="w-4 h-4" />
                                                {college.website}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Avg Package (Overall)*</div>
                                <div className="text-xl font-bold text-primary">
                                    {typeof college.avg_package === 'number' ? `${college.avg_package} LPA` : college.avg_package}
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Highest Package</div>
                                <div className="text-xl font-bold text-rose-400">
                                    {typeof college.highest_package === 'number' ? `${college.highest_package} LPA` : college.highest_package}
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">College Fees</div>
                                <div className="text-xl font-bold text-emerald-400">
                                    {typeof college.fees === 'number' ? `₹${(college.fees/1000).toFixed(0)}k/yr` : college.fees}
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Type</div>
                                <div className="text-xl font-bold text-amber-400">{college.college_type}</div>
                            </div>
                        </div>

                        {college.tier === "Tier 3" && (
                            <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-3">
                                <div className="p-1.5 bg-rose-500/20 rounded-lg shrink-0">
                                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black uppercase text-rose-400 tracking-widest mb-1">Placement Warning</h4>
                                    <p className="text-[11px] text-rose-200/70 leading-relaxed font-medium">
                                        Note: Tier 3 institutions may have limited or no placement support. Average packages reflect a combined metric across all branches.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <BarChart className="w-5 h-5 text-primary" />
                                    Cutoff Trends (2024)
                                </h3>
                                <p className="text-sm text-muted-foreground">Select category to view round-wise closing ranks</p>
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-xl border border-white/10">
                                <span className="text-xs font-bold text-muted-foreground ml-2">Category:</span>
                                <select 
                                    className="bg-zinc-800 border border-white/10 rounded-lg py-1.5 px-3 text-xs font-bold focus:outline-none focus:border-primary transition-all cursor-pointer"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value as Category)}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-2xl border border-white/5">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-white/5">
                                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Branch Name</th>
                                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Round 1</th>
                                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Round 2</th>
                                        <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground text-center">Round 3</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {branchData.map((row: any, idx: number) => (
                                        <tr key={idx} className="border-t border-white/5 hover:bg-white/2 transition-colors">
                                            <td className="p-4">
                                                <div className="font-bold text-sm">{row.branch.branch_name}</div>
                                                <div className="text-[10px] text-muted-foreground uppercase">{row.branch.branch_id}</div>
                                            </td>
                                            <td className="p-4 text-center font-mono font-bold text-primary">{row.r1}</td>
                                            <td className="p-4 text-center font-mono font-bold text-primary">{row.r2}</td>
                                            <td className="p-4 text-center font-mono font-bold text-primary">{row.r3}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const TrophyIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);

const RoundDetailsModal = ({ 
    isOpen, 
    onClose, 
    details, 
    collegeName, 
    branchName 
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    details: { round: number, closing_rank: number | null }[], 
    collegeName: string, 
    branchName: string 
}) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10"
                >
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="flex items-center gap-2 text-primary mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Counseling History</span>
                                </div>
                                <h2 className="text-2xl font-bold">{collegeName}</h2>
                                <p className="text-muted-foreground text-sm font-medium">{branchName}</p>
                            </div>
                            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {[1, 2, 3].map(roundNum => {
                                const roundData = details.find(d => d.round === roundNum);
                                return (
                                    <div key={roundNum} className={cn(
                                        "p-6 rounded-2xl border transition-all",
                                        roundData ? "bg-white/5 border-white/10" : "bg-transparent border-dashed border-white/5 opacity-50"
                                    )}>
                                        <div className="text-[10px] font-bold text-muted-foreground uppercase mb-2">Round {roundNum}</div>
                                        <div className="text-3xl font-mono font-bold">
                                            {roundData ? roundData.closing_rank : "N/A"}
                                        </div>
                                        <div className="text-[10px] text-muted-foreground mt-1 uppercase font-bold tracking-tight">Closing Rank</div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
                             <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm mb-1 text-primary">Admission Strategy</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        Historically, this branch sees a rank jump of {details.length > 1 && details[0].closing_rank && details[details.length-1].closing_rank ? Math.round(((details[details.length-1].closing_rank! - details[0].closing_rank!)/details[0].closing_rank!)*100) : "0"}% between Round 1 and Round 3. 
                                        If your rank is slightly above the current cutoff, waiting for later rounds is highly recommended.
                                    </p>
                                </div>
                             </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

const CollegeGroupCard = ({ group, category, gender, onShowRounds, onShowCollege }: { group: GroupedResult, category: string, gender: string, onShowRounds: (collegeId: string, branchId: string, collegeName: string, branchName: string) => void, onShowCollege: (c: College) => void }) => {
  if (!group || !group.branches || group.branches.length === 0) return null;
  const { college, branches } = group;
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // Check if this college is a Hidden Gem
  const gemData = TOP_GEMS.find(g => g.college_id === college.college_id);

  const images = [
      "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?auto=format&fit=crop&q=80&w=400",
      "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&q=80&w=400"
  ];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-card overflow-hidden border transition-all mb-6 relative",
        gemData ? "border-primary/30 shadow-lg shadow-primary/5" : "border-white/5 hover:border-primary/20"
      )}
    >
        {/* Intelligence Overlays */}
        {gemData && (
            <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                <div className="bg-primary px-3 py-1.5 rounded-lg shadow-xl shadow-primary/20 flex items-center gap-2 border border-white/20">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">🔥 Hidden Gem</span>
                </div>
                <div className="bg-zinc-900/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-[8px] font-bold text-white">ROI: {gemData.score}</span>
                </div>
            </div>
        )}
      <div className="flex flex-col lg:flex-row">
        {/* Left: College Info */}
        <div className="lg:w-1/3 p-4 md:p-6 border-b lg:border-b-0 lg:border-r border-white/5 bg-white/2">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
               <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 
                onClick={() => onShowCollege(college)}
                className="text-xl font-bold leading-tight mb-1 break-words line-clamp-3 cursor-pointer hover:text-primary transition-colors decoration-primary/30 hover:decoration-primary underline underline-offset-4 decoration-dotted"
              >
                {college.full_name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{college.city}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 md:space-y-3 md:block mb-4 md:mb-6">
            <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-muted-foreground">{branches.length} High Probability Branches</span>
            </div>
            {college.placement_strength && (
                <div className="flex items-center gap-2 text-xs">
                    <Star className="w-3 h-3 text-rose-400" />
                    <span className="text-muted-foreground font-bold">Placement: {college.placement_strength}</span>
                </div>
            )}
            <div className="flex items-center gap-2 text-xs">
                <Star className="w-3 h-3 text-amber-400" />
                <span className="text-muted-foreground font-bold">
                    Highest Package: {typeof college.highest_package === 'number' ? `${college.highest_package} LPA` : college.highest_package}
                </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
                <IndianRupee className="w-3 h-3 text-primary" />
                <span className="text-muted-foreground font-bold">
                    Annual Fees: {typeof college.fees === 'number' ? `₹${(college.fees/1000).toFixed(0)}k` : college.fees}
                </span>
            </div>

            {college.tier === "Tier 3" && (
                <div className="mt-3 p-2.5 bg-rose-500/5 border border-rose-500/10 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span className="text-[9px] font-bold text-rose-400/80 leading-none">Placements not guaranteed. Branch-combined avg.</span>
                </div>
            )}
          </div>

          {/* Campus Hero Image - Hidden on Mobile for compactness */}
          <div className="hidden md:block aspect-video w-full rounded-xl overflow-hidden mb-4 relative group/img border border-white/5 bg-white/5">
              <img 
                src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600" 
                className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700" 
                alt="Campus Hero" 
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />
          </div>

          {college.address && (
              <div className="flex items-start gap-2 text-[10px] text-muted-foreground/60 leading-tight">
                  <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                  <span>{college.address}</span>
              </div>
          )}
        </div>

        {/* Right: Branch List (Ultra-Compact Mobile) */}
        <div className="lg:w-2/3 flex flex-col">
            {/* Desktop Header */}
            <div className="hidden md:flex border-b border-white/5 bg-white/2 py-4 px-6 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <div className="flex-[2]">Branch</div>
                <div className="flex-1 text-center group/pkg relative cursor-help">
                    Avg PKG*
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 p-2 bg-zinc-800 border border-white/10 rounded-lg text-[8px] normal-case font-medium leading-tight opacity-0 group-hover/pkg:opacity-100 transition-opacity pointer-events-none shadow-xl z-50 text-white text-center">
                        *Overall institutional average across all branches.
                    </div>
                </div>
                <div className="flex-1 text-center">Probability</div>
                <div className="flex-1 text-center">Closing Rank</div>
                <div className="flex-1 text-right">Action</div>
            </div>

            {/* List Body */}
            <div className="flex flex-col">
              {branches.map((b, idx) => {
                const cbId = `${college.college_id}-${b.branch.branch_id}`;
                const isWishlisted = isInWishlist(cbId);
                
                return (
                <div key={idx} className="flex flex-col md:flex-row md:items-center border-b border-white/5 hover:bg-white/2 transition-colors group/row py-3 md:py-5 px-4 md:px-6 gap-1 md:gap-0">
                  
                  {/* Top Mobile Row / Left Desktop */}
                  <div className="flex-[2] flex items-center justify-between md:justify-start gap-3">
                        <div className="flex items-center gap-2.5">
                            <button 
                                onClick={() => toggleWishlist({ id: cbId, collegeName: college.full_name, branchName: b.branch.branch_name, collegeId: college.college_id })}
                                className={cn(
                                    "shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full border transition-all flex items-center justify-center",
                                    isWishlisted ? "bg-rose-500/20 border-rose-500/50 text-rose-500" : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/30"
                                )}
                            >
                                <Heart className={cn("w-3 h-3 md:w-4 md:h-4", isWishlisted && "fill-current")} />
                            </button>
                            <div>
                                <div className="text-xs md:text-sm font-bold text-white group-hover/row:text-primary transition-colors line-clamp-2 leading-tight">{b.branch.branch_name}</div>
                                <div className="hidden md:block text-[10px] text-muted-foreground font-medium mt-0.5">Bachelor of Technology</div>
                            </div>
                        </div>
                        {/* Mobile Only Probability Badge */}
                        <div className="md:hidden shrink-0">
                            <span className={cn("text-[8px] font-bold px-1.5 py-0.5 rounded border inline-block", getLevelBg(b.level))}>
                                {b.probability}%
                            </span>
                        </div>
                  </div>
                  
                  {/* Bottom Mobile Row / Middle Desktop */}
                  <div className="flex md:flex-[3] items-center justify-between md:justify-center gap-2 md:gap-0 pl-8 md:pl-0 mt-1 md:mt-0">
                      
                      {/* Avg Package */}
                      <div className="flex-1 flex md:flex-col items-center md:justify-center gap-1.5 md:gap-0">
                        <span className="md:hidden text-[10px] text-muted-foreground uppercase tracking-widest">PKG (Avg)*:</span>
                        <span className="text-xs md:text-sm font-mono font-bold text-primary">
                            {typeof college.avg_package === 'number' ? `${college.avg_package}L` : college.avg_package}
                        </span>
                      </div>

                      {/* Desktop Only Probability */}
                      <div className="hidden md:flex flex-1 flex-col items-center justify-center text-center">
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded border inline-block", getLevelBg(b.level))}>
                            {b.probability}%
                        </span>
                      </div>

                      {/* Closing Rank */}
                      <div className="flex-1 flex md:flex-col items-center md:justify-center gap-1.5 md:gap-0">
                        <span className="md:hidden text-[10px] text-muted-foreground uppercase tracking-widest">Rank:</span>
                        <span className="text-xs md:text-sm font-mono font-bold text-white">{b.closing_rank}</span>
                      </div>

                      {/* Mobile Only Action */}
                      <div className="md:hidden flex-1 flex justify-end">
                        <button onClick={() => onShowRounds(college.college_id, b.branch.branch_id, college.full_name, b.branch.branch_name)} className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1.5">
                            Details <ExternalLink className="w-3 h-3 shrink-0" strokeWidth={2.5} />
                        </button>
                      </div>
                  </div>

                  {/* Desktop Only Action Button */}
                  <div className="hidden md:flex md:flex-1 justify-end">
                    <button 
                        onClick={() => onShowRounds(college.college_id, b.branch.branch_id, college.full_name, b.branch.branch_name)} 
                        className="text-[10px] font-bold text-white/70 hover:text-primary bg-white/5 hover:bg-primary/10 border border-white/10 hover:border-primary/40 transition-all flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl group/btn"
                    >
                        Round Details <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>
                  </div>

                </div>
              )})}
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function PredictorPage() {
    const { user, isGuest, isLoading, guestId } = useAuth();
    const { colleges, isLoading: collegesLoading } = useColleges();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [lastSaved, setLastSaved] = useState<string>('');
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(true);

    // Load latest profile from Firestore on mount (if user)
    useEffect(() => {
        if (user && !isLoading) {
            const loadProfile = async () => {
                const profileRef = doc(db, 'profiles', user.id);
                const snap = await getDoc(profileRef);
                if (snap.exists()) {
                    const data = snap.data();
                    setMarks({ kcet: data.kcetMarks || 0, pcm: data.pcmMarks || 0 });
                    setInput(prev => ({ 
                        ...prev, 
                        rank: data.rank || 0,
                        category: data.category || prev.category 
                    }));
                }
            };
            loadProfile();
        }
    }, [user, isLoading]);

    const saveSubmission = async (currentInput: PredictorInput, currentMarks: { kcet: number, pcm: number }) => {
        // Validation: Don't save 0,0 or just rank without marks
        if (currentInput.rank === 0 || (currentMarks.kcet === 0 && currentMarks.pcm === 0)) return;

        // Dedup: Don't save same data twice in a row
        const payloadStr = JSON.stringify({ r: currentInput.rank, k: currentMarks.kcet, p: currentMarks.pcm, c: currentInput.category });
        if (payloadStr === lastSaved) return;

        try {
            const payload = {
                userId: user?.id || 'guest',
                userName: user?.name || 'Guest User',
                userEmail: user?.email || 'N/A',
                guestId: guestId,
                rank: currentInput.rank,
                kcetMarks: currentMarks.kcet,
                pcmMarks: currentMarks.pcm,
                category: currentInput.category,
                updatedAt: new Date().toISOString()
            };

            // 1. Upsert to history collection to prevent duplicates per user/guest
            const submissionId = user?.id || guestId;
            if (submissionId) {
                await setDoc(doc(db, 'submissions', submissionId), payload, { merge: true });
            } else {
                await addDoc(collection(db, 'submissions'), payload);
            }
            
            // 2. If logged in, also update their "latest" profile
            if (user) {
                const profileRef = doc(db, 'profiles', user.id);
                await setDoc(profileRef, payload, { merge: true });
            }

            setLastSaved(payloadStr);
        } catch (err) {
            console.error("Submission failed:", err);
        }
    };

    useEffect(() => {
        // Only show modal if loading is finished AND no user/guest is found
        if (!isLoading) {
            if (!user && !isGuest) {
                setShowAuthModal(true);
            } else {
                setShowAuthModal(false);
            }
        }
    }, [user, isGuest, isLoading]);
  const [inputMode, setInputMode] = useState<'rank' | 'marks'>('rank');
  const [marks, setMarks] = useState({ kcet: 0, pcm: 0 });

  const calculateRank = (kcet: number, pcm: number) => {
    if (!kcet || !pcm) return 0;
    // Standard KCET Formula: 50% Boards (out of 300) + 50% KCET (out of 180)
    const normalizedPCM = (pcm / 300) * 50;
    const normalizedKCET = (kcet / 180) * 50;
    const combined = normalizedPCM + normalizedKCET;
    
    // Approximate mapping (Exponential decay model for rank)
    // 95+ -> < 500
    // 90 -> 2000
    // 80 -> 8000
    // 70 -> 20000
    // 50 -> 60000
    if (combined >= 98) return Math.round(100 + (100-combined)*50);
    if (combined >= 90) return Math.round(500 + (98-combined)*150);
    if (combined >= 80) return Math.round(2500 + (90-combined)*500);
    if (combined >= 70) return Math.round(7000 + (80-combined)*1200);
    if (combined >= 50) return Math.round(18000 + (70-combined)*2500);
    return Math.round(60000 + (50-combined)*4000);
  };

  const [input, setInput] = useState<PredictorInput>({
    rank: 0,
    category: 'GM',
    gender: 'Male',
    hk_quota: false,
    branches: [],
    colleges: [],
    regions: [],
    round: 3
  });

  const [sortBy, setSortBy] = useState<'rank' | 'package' | 'fee' | 'tier'>('tier');
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<{
    safe: GroupedResult[];
    moderate: GroupedResult[];
    dream: GroupedResult[];
  } | null>(null);

  // Round Details State
  const [roundModal, setRoundModal] = useState<{
      isOpen: boolean;
      details: { round: number, closing_rank: number | null }[];
      collegeName: string;
      branchName: string;
  }>({
      isOpen: false,
      details: [],
      collegeName: '',
      branchName: ''
  });

  // College Details Modal State
  const [collegeModal, setCollegeModal] = useState<{
      isOpen: boolean;
      college: College | null;
  }>({
      isOpen: false,
      college: null
  });

  const handlePredict = (currentInput?: PredictorInput) => {
    const data = currentInput || input;
    if (data.rank <= 0 || collegesLoading) return;
    
    // Save to Firestore
    saveSubmission(data, marks);

    setIsCalculating(true);
    setTimeout(() => {
      const predictionResults = predictColleges(data, colleges);
      
      const processResults = (list: PredictionResult[]): GroupedResult[] => {
          if (!list || list.length === 0) return [];
          const map = new Map<string, PredictionResult[]>();
          list.forEach(res => {
              if (res && res.college && res.college.college_id) {
                  if (!map.has(res.college.college_id)) map.set(res.college.college_id, []);
                  map.get(res.college.college_id)!.push(res);
              }
          });
          
          let grouped = Array.from(map.values())
              .filter(branches => branches.length > 0)
              .map(branches => ({
                  college: branches[0].college,
                  branches: branches.sort((x, y) => x.closing_rank - y.closing_rank)
              }));

          const cleanVal = (val: string | number | undefined) => {
              if (val === undefined) return 0;
              if (typeof val === 'number') return val;
              return parseFloat(val.replace(/[^\d.]/g, '')) || 0;
          };

          // Apply Sorting
          switch(sortBy) {
              case 'package':
                  grouped.sort((a, b) => cleanVal(b.college.avg_package) - cleanVal(a.college.avg_package));
                  break;
              case 'fee':
                  grouped.sort((a, b) => cleanVal(a.college.fees) - cleanVal(b.college.fees));
                  break;
              case 'tier':
                  const tierPriority: Record<string, number> = { "Tier 1": 1, "Tier 1.5": 2, "Tier 2": 3, "Tier 3": 4 };
                  grouped.sort((a, b) => {
                      const tierA = a.college.tier || "Tier 3";
                      const tierB = b.college.tier || "Tier 3";
                      const tierDiff = (tierPriority[tierA] || 5) - (tierPriority[tierB] || 5);
                      if (tierDiff !== 0) return tierDiff;
                      return (b.college.rating || 0) - (a.college.rating || 0);
                  });
                  break;
              case 'rank':
              default:
                  grouped.sort((a, b) => a.branches[0].closing_rank - b.branches[0].closing_rank);
                  break;
          }

          return grouped.slice(0, 40);
      };

      setResults({
          safe: processResults(predictionResults.safe),
          moderate: processResults(predictionResults.moderate),
          dream: processResults(predictionResults.dream)
      });
      setIsCalculating(false);
      setIsMobileFiltersOpen(false); // Auto-collapse on mobile after predicting
    }, 800);
  };

  // Re-predict when cloud data OR sorting changes
  React.useEffect(() => {
      if (input.rank > 0) handlePredict();
  }, [sortBy, colleges]);

  const handleShowRounds = (collegeId: string, branchId: string, collegeName: string, branchName: string) => {
    const details = getRoundDetails(collegeId, branchId, input.category);
    setRoundModal({
      isOpen: true,
      details,
      collegeName,
      branchName
    });
  };

  const handleShowCollege = (college: College) => {
      setCollegeModal({
          isOpen: true,
          college
      });
  };

  const toggleBranch = (id: string) => {
    const newInput = {
      ...input,
      branches: input.branches.includes(id)
        ? input.branches.filter(b => b !== id)
        : [...input.branches, id]
    };
    setInput(newInput);
    if (input.rank > 0) handlePredict(newInput);
  };

  const toggleRegion = (id: string) => {
      const newInput = {
          ...input,
          regions: input.regions.includes(id)
            ? input.regions.filter(r => r !== id)
            : [...input.regions, id]
      };
      setInput(newInput);
      if (input.rank > 0) handlePredict(newInput);
  };

  const applyQuickFilter = (type: 'TOP_5' | 'TOP_10' | 'CS_IT' | 'CORE') => {
      let newInput = { ...input };
      switch(type) {
          case 'TOP_5':
              newInput.colleges = input.colleges.length === TOP_5_COLLEGES.length ? [] : TOP_5_COLLEGES;
              break;
          case 'TOP_10':
              newInput.colleges = input.colleges.length === TOP_10_COLLEGES.length ? [] : TOP_10_COLLEGES;
              break;
          case 'CS_IT':
              newInput.branches = input.branches.length === CS_IT_BRANCHES.length ? [] : CS_IT_BRANCHES;
              break;
          case 'CORE':
              newInput.branches = input.branches.length === CORE_BRANCHES.length ? [] : CORE_BRANCHES;
              break;
      }
      setInput(newInput);
      if (input.rank > 0) handlePredict(newInput);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8 lg:px-12">
      <RoundDetailsModal 
        isOpen={roundModal.isOpen}
        onClose={() => setRoundModal({ ...roundModal, isOpen: false })}
        details={roundModal.details}
        collegeName={roundModal.collegeName}
        branchName={roundModal.branchName}
      />

      <CollegeDetailsModal 
        isOpen={collegeModal.isOpen}
        onClose={() => setCollegeModal({ ...collegeModal, isOpen: false })}
        college={collegeModal.college}
      />

      <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        {/* Input Panel (Compact Sidebar) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card p-4 md:p-6 sticky top-28">
            
            {/* Header / Mobile Toggle */}
            <div 
              className="flex items-center justify-between mb-2 md:mb-6 cursor-pointer lg:cursor-default"
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] shrink-0">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-lg leading-tight">Smart Predictor</h2>
                  <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Based on <span className="text-primary">2025 OFFICIAL DATA</span></p>
                </div>
              </div>
              <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform lg:hidden", isMobileFiltersOpen && "rotate-180")} />
            </div>

            {/* Expandable Content */}
            <div className={cn("space-y-4 transition-all overflow-hidden lg:!block", isMobileFiltersOpen ? "block mt-6" : "hidden")}>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Your KCET Rank</label>
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      type="number"
                      placeholder="e.g. 15000"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-mono text-base"
                      value={input.rank || ''}
                      onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          setInput({ ...input, rank: val });
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">KCET Score <span className="text-primary/60">(/180)</span></label>
                    <input
                      type="number"
                      max="180"
                      placeholder="Score"
                      className={cn(
                        "w-full bg-white/5 border rounded-xl py-2.5 px-3 focus:outline-none transition-all font-mono text-base",
                        marks.kcet > 180 ? "border-rose-500/50 text-rose-500 ring-4 ring-rose-500/10" : "border-white/10 focus:border-primary/50"
                      )}
                      value={marks.kcet || ''}
                      onChange={(e) => {
                          let val = parseInt(e.target.value) || 0;
                          if (val > 180) val = 180; // Hard cap
                          setMarks({ ...marks, kcet: val });
                      }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">PCM Board <span className="text-primary/60">(/300)</span></label>
                    <input
                      type="number"
                      max="300"
                      placeholder="Marks"
                      className={cn(
                        "w-full bg-white/5 border rounded-xl py-2.5 px-3 focus:outline-none transition-all font-mono text-base",
                        marks.pcm > 300 ? "border-rose-500/50 text-rose-500 ring-4 ring-rose-500/10" : "border-white/10 focus:border-primary/50"
                      )}
                      value={marks.pcm || ''}
                      onChange={(e) => {
                          let val = parseInt(e.target.value) || 0;
                          if (val > 300) val = 300; // Hard cap
                          setMarks({ ...marks, pcm: val });
                      }}
                    />
                  </div>
                </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Category</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 focus:outline-none focus:border-primary/50 text-[11px] appearance-none cursor-pointer"
                    value={input.category}
                    onChange={(e) => {
                        const newInput = { ...input, category: e.target.value as Category };
                        setInput(newInput);
                        if (input.rank > 0) handlePredict(newInput);
                    }}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-zinc-900 text-foreground">{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Round</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 focus:outline-none focus:border-primary/50 text-[11px] appearance-none cursor-pointer"
                    value={input.round}
                    onChange={(e) => {
                        const newInput = { ...input, round: parseInt(e.target.value) as Round };
                        setInput(newInput);
                        if (input.rank > 0) handlePredict(newInput);
                    }}
                  >
                    <option value="1" className="bg-zinc-900 text-foreground">Round 1</option>
                    <option value="2" className="bg-zinc-900 text-foreground">Round 2</option>
                    <option value="3" className="bg-zinc-900 text-foreground">Round 3</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <MultiSelectDropdown 
                  label="Regions"
                  icon={Globe}
                  options={REGIONS.map(r => ({ id: r, name: r }))}
                  selected={input.regions}
                  onToggle={toggleRegion}
                  placeholder="All Regions"
                />

                <MultiSelectDropdown 
                  label="Branches"
                  icon={BookOpen}
                  options={BRANCHES.map(b => ({ id: b.id, name: b.name }))}
                  selected={input.branches}
                  onToggle={toggleBranch}
                  placeholder="All Branches"
                />
              </div>

              <MultiSelectDropdown 
                label="Specific Colleges"
                icon={Building2}
                options={colleges.map(c => ({ id: c.college_id, name: c.full_name }))}
                selected={input.colleges}
                onToggle={(id) => {
                    const newInput = {
                        ...input,
                        colleges: input.colleges.includes(id)
                            ? input.colleges.filter(c => c !== id)
                            : [...input.colleges, id]
                    };
                    setInput(newInput);
                    if (input.rank > 0) handlePredict(newInput);
                }}
                placeholder="All Colleges"
              />

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Quick Filters</label>
                <div className="grid grid-cols-2 gap-2">
                    <button 
                        onClick={() => applyQuickFilter('TOP_5')} 
                        className={cn(
                            "py-1.5 px-3 rounded-lg border text-[9px] font-bold text-center transition-all",
                            input.colleges.length === TOP_5_COLLEGES.length ? "bg-primary/20 border-primary/50 text-primary" : "bg-white/2 border-white/5 hover:bg-white/10"
                        )}
                    >
                        TOP 5
                    </button>
                    <button 
                        onClick={() => applyQuickFilter('TOP_10')} 
                        className={cn(
                            "py-1.5 px-3 rounded-lg border text-[9px] font-bold text-center transition-all",
                            input.colleges.length === TOP_10_COLLEGES.length ? "bg-primary/20 border-primary/50 text-primary" : "bg-white/2 border-white/5 hover:bg-white/10"
                        )}
                    >
                        TOP 10
                    </button>
                    <button 
                        onClick={() => applyQuickFilter('CS_IT')} 
                        className={cn(
                            "py-1.5 px-3 rounded-lg border text-[9px] font-bold text-center transition-all",
                            input.branches.length === CS_IT_BRANCHES.length ? "bg-primary/20 border-primary/50 text-primary" : "bg-white/2 border-white/5 hover:bg-white/10"
                        )}
                    >
                        CS & IT
                    </button>
                    <button 
                        onClick={() => applyQuickFilter('CORE')} 
                        className={cn(
                            "py-1.5 px-3 rounded-lg border text-[9px] font-bold text-center transition-all",
                            input.branches.length === CORE_BRANCHES.length ? "bg-primary/20 border-primary/50 text-primary" : "bg-white/2 border-white/5 hover:bg-white/10"
                        )}
                    >
                        CORE
                    </button>
                </div>
              </div>

              <button
                onClick={() => handlePredict()}
                disabled={isCalculating || !input.rank}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2 group mt-2"
              >
                {isCalculating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    Get Predicted Colleges
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10 flex gap-3">
                  <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 opacity-60" />
                  <p className="text-[10px] text-amber-200/50 leading-relaxed font-medium italic">
                    Predictions are based on historical official data (2025). Do not solely rely on these for final counseling.
                  </p>
              </div>
            </div> {/* End Expandable Content */}
          </div>
        </div>

        {/* Results Panel (Expanded) */}
        <div className="lg:col-span-9 space-y-8">
          {results && (
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl relative overflow-hidden">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Sort Results By:</span>
                    </div>
                    <p className="text-[8px] text-muted-foreground/60 italic">*Average Package (PKG) represents overall institutional average across all branches.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'rank', label: 'Admission Rank', icon: ArrowUpDown },
                        { id: 'package', label: 'Average Package', icon: TrendingUp },
                        { id: 'fee', label: 'Lowest Fees', icon: IndianRupee },
                        { id: 'tier', label: 'Prestige/Tier', icon: Trophy }
                    ].map(option => (
                        <button
                            key={option.id}
                            onClick={() => setSortBy(option.id as any)}
                            className={cn(
                                "px-3 py-2 rounded-xl border text-[10px] font-bold transition-all flex items-center gap-2",
                                sortBy === option.id 
                                    ? "bg-primary/20 border-primary/50 text-primary shadow-lg shadow-primary/10" 
                                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                            )}
                        >
                            <option.icon className="w-3 h-3" />
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
          )}

          {!results ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 glass-card border-dashed border-white/10">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <GraduationCap className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white/80">Admission Prediction Ready</h3>
              <p className="text-muted-foreground max-w-sm">Enter your rank to see personalized college and branch recommendations.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* HIDDEN GEMS SPOTLIGHT */}
              {TOP_GEMS.length > 0 && (
                  <section className="space-y-6">
                      <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                  <Sparkles className="w-5 h-5 text-primary" />
                              </div>
                              <div>
                                  <h2 className="text-2xl font-bold">Intelligence Spotlight</h2>
                                  <p className="text-xs text-muted-foreground">Underrated colleges with exceptional ROI & Placements</p>
                              </div>
                          </div>
                      </div>
                      
                      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                          {TOP_GEMS.filter(gem => 
                              results.safe.some(s => s.college.college_id === gem.college_id) || 
                              results.moderate.some(m => m.college.college_id === gem.college_id)
                          ).slice(0, 4).map((gem, i) => (
                              <motion.div 
                                  key={i} 
                                  whileHover={{ y: -5 }}
                                  className="min-w-[280px] md:min-w-[320px] bg-white/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
                                  onClick={() => {
                                      const fullCollege = collegesUnified.find(c => c.college_id === gem.college_id);
                                      if (fullCollege) handleShowCollege(fullCollege);
                                  }}
                              >
                                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                      <TrendingUp className="w-20 h-20 text-primary" />
                                  </div>
                                  <div className="relative z-10">
                                      <div className="flex items-center gap-2 mb-3">
                                          <div className="bg-primary/20 p-2 rounded-lg"><Star className="w-4 h-4 text-primary" /></div>
                                          <span className="text-[10px] font-black uppercase tracking-widest text-primary">High Value Gem</span>
                                      </div>
                                      <h3 className="text-lg font-bold mb-1 truncate">{gem.name}</h3>
                                      <p className="text-xs text-muted-foreground mb-4">Avg Package: <span className="text-emerald-400 font-bold">{gem.metrics.salary.toFixed(1)} LPA</span></p>
                                      
                                      <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                                          <div>
                                              <p className="text-[9px] uppercase text-muted-foreground mb-1">ROI Score</p>
                                              <p className="text-sm font-bold text-white">{gem.score}</p>
                                          </div>
                                          <div>
                                              <p className="text-[9px] uppercase text-muted-foreground mb-1">Expected Cutoff</p>
                                              <p className="text-sm font-bold text-white">~{(gem.metrics.cutoff / 1000).toFixed(0)}k</p>
                                          </div>
                                      </div>
                                  </div>
                              </motion.div>
                          ))}
                      </div>
                  </section>
              )}

              {results.safe.length > 0 && (
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <Check className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Safe Chances</h2>
                            <p className="text-xs text-muted-foreground">High probability of admission based on current sorting</p>
                        </div>
                    </div>
                    {results.safe.map((group, i) => <CollegeGroupCard key={i} group={group} category={input.category} gender={input.gender} onShowRounds={handleShowRounds} onShowCollege={handleShowCollege} />)}
                </section>
              )}

              {results.moderate.length > 0 && (
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Moderate Chances</h2>
                            <p className="text-xs text-muted-foreground">Competitive options where you have a fair chance</p>
                        </div>
                    </div>
                    {results.moderate.map((group, i) => <CollegeGroupCard key={i} group={group} category={input.category} gender={input.gender} onShowRounds={handleShowRounds} onShowCollege={handleShowCollege} />)}
                </section>
              )}

              {results.dream.length > 0 && (
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                            <Star className="w-5 h-5 text-rose-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Dream Options</h2>
                            <p className="text-xs text-muted-foreground">Aspirational targets for your rank profile</p>
                        </div>
                    </div>
                    {results.dream.map((group, i) => <CollegeGroupCard key={i} group={group} category={input.category} gender={input.gender} onShowRounds={handleShowRounds} onShowCollege={handleShowCollege} />)}
                </section>
              )}
            </div>
          )}
        </div>
      </div>
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        allowSkip={true}
      />
    </div>
  );
}

const Trophy = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
);
const TOP_5_COLLELES = TOP_5_COLLEGES;
