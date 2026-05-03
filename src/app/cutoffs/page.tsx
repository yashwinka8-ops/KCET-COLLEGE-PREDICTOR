'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  GraduationCap, 
  IndianRupee, 
  BarChart, 
  ChevronRight,
  TrendingUp,
  Star,
  X,
  ChevronDown,
  Globe,
  Phone,
  Link as LinkIcon,
  BookOpen,
  Trophy,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { College, Branch, CollegeBranch, CutoffData, Category, Round } from '@/lib/types';

import collegesData from '@/lib/data/colleges.json';
import branchesData from '@/lib/data/branches.json';
import collegeBranchesData from '@/lib/data/college_branches.json';
import cutoffDataJson from '@/lib/data/cutoff_data.json';
import { CATEGORIES } from '@/lib/predictor';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { useColleges } from '@/lib/contexts/CollegeContext';
import { Heart } from 'lucide-react';

const branches = branchesData as Branch[];
const collegeBranches = collegeBranchesData as CollegeBranch[];
const cutoffs = cutoffDataJson as CutoffData[];

const CATEGORY_LIST = CATEGORIES;

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
    const [isStatsOpen, setIsStatsOpen] = useState(false);
    const { toggleWishlist, isInWishlist } = useWishlist();
    
    if (!isOpen || !college) return null;

    // Get all branches for this college
    const collegeBrs = collegeBranches.filter(cb => cb.college_id === college.college_id);
    const branchData = collegeBrs.map(cb => {
        const branch = branches.find(b => b.branch_id === cb.branch_id)!;
        const branchCutoffs = cutoffs.filter(c => c.college_branch_id === cb.id && c.year === 2024 && c.category === selectedCategory);
        
        return {
            branch,
            r1: branchCutoffs.find(c => c.round === 1)?.closing_rank || 'N/A',
            r2: branchCutoffs.find(c => c.round === 2)?.closing_rank || 'N/A',
            r3: branchCutoffs.find(c => c.round === 3)?.closing_rank || 'N/A',
        };
    });

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
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
                    {/* Header */}
                    <div className="p-4 md:p-8 border-b border-white/5 bg-white/2">
                        <div className="flex justify-between items-start mb-6 gap-3">
                            <div className="flex gap-3 md:gap-5">
                                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
                                    <Building2 className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                                </div>
                                <div className="pr-2 md:pr-0">
                                    <h2 className="text-xl md:text-3xl font-bold mb-2 leading-tight">{college.full_name}</h2>
                                    <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                                            {college.city}, {college.region}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Trophy className={cn(
                                                "w-3 h-3 md:w-4 md:h-4 shrink-0",
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
                                                <LinkIcon className="w-3 h-3 md:w-4 md:h-4 shrink-0" />
                                                <span className="truncate max-w-[150px] md:max-w-none">{college.website}</span>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button onClick={onClose} className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                                <X className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                        </div>

                        {/* Mobile Accordion Toggle */}
                        <div 
                            className="flex md:hidden items-center justify-between mt-4 pt-4 border-t border-white/5 cursor-pointer text-muted-foreground hover:text-white transition-colors"
                            onClick={() => setIsStatsOpen(!isStatsOpen)}
                        >
                            <span className="text-[10px] font-bold uppercase tracking-widest">{isStatsOpen ? 'Hide' : 'View'} College Info (Fees & Placements)</span>
                            <ChevronDown className={cn("w-4 h-4 transition-transform", isStatsOpen && "rotate-180")} />
                        </div>

                        <div className={cn("grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4 md:mt-0 transition-all overflow-hidden", isStatsOpen ? "grid" : "hidden md:grid")}>
                            <div className="bg-white/5 rounded-2xl p-3 md:p-4 border border-white/5">
                                <div className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wider">Avg Package</div>
                                <div className="text-lg md:text-xl font-bold text-primary">
                                    {typeof college.avg_package === 'number' ? `${college.avg_package} LPA` : college.avg_package}
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-3 md:p-4 border border-white/5">
                                <div className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wider">Highest Package</div>
                                <div className="text-lg md:text-xl font-bold text-rose-400">
                                    {typeof college.highest_package === 'number' ? `${college.highest_package} LPA` : college.highest_package}
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-3 md:p-4 border border-white/5">
                                <div className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wider">College Fees</div>
                                <div className="text-lg md:text-xl font-bold text-emerald-400">
                                    {typeof college.fees === 'number' ? `₹${(college.fees/1000).toFixed(0)}k/yr` : college.fees}
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-3 md:p-4 border border-white/5">
                                <div className="text-[9px] md:text-[10px] uppercase font-bold text-muted-foreground mb-1 tracking-wider">Type</div>
                                <div className="text-lg md:text-xl font-bold text-amber-400">{college.college_type}</div>
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
                                        Note: Tier 3 institutions may have limited or no placement support. Average packages reflect a combined metric across all branches (Engineering, Non-Technical, etc).
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-10">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 md:mb-8 text-center md:text-left">
                            <div>
                                <h3 className="text-lg md:text-xl font-bold flex items-center justify-center md:justify-start gap-2">
                                    <BarChart className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0" />
                                    Cutoff Trends (2024)
                                </h3>
                                <p className="text-xs md:text-sm text-muted-foreground mt-1 md:mt-0">Select category to view round-wise closing ranks</p>
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 p-1.5 rounded-xl border border-white/10 w-full md:w-auto justify-between md:justify-start">
                                <span className="text-xs font-bold text-muted-foreground ml-2">Category:</span>
                                <select 
                                    className="bg-zinc-800 border border-white/10 rounded-lg py-1.5 px-3 text-xs font-bold focus:outline-none focus:border-primary transition-all cursor-pointer"
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value as Category)}
                                >
                                    {CATEGORY_LIST.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/10 overflow-hidden">
                            {/* Desktop Header */}
                            <div className="hidden md:grid grid-cols-12 bg-white/5 border-b border-white/10">
                                <div className="col-span-6 py-4 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">Branch Name</div>
                                <div className="col-span-2 py-4 px-2 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">Round 1</div>
                                <div className="col-span-2 py-4 px-2 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">Round 2</div>
                                <div className="col-span-2 py-4 px-2 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">Round 3</div>
                            </div>
                            
                            <div className="divide-y divide-white/5">
                                {branchData.map((item, idx) => {
                                    const cbId = `${college.college_id}-${item.branch.branch_id}`;
                                    const isWishlisted = isInWishlist(cbId);
                                    
                                    return (
                                    <div key={idx} className="flex flex-col md:grid md:grid-cols-12 hover:bg-white/2 transition-colors py-4 md:py-0">
                                        
                                        {/* Top Mobile Row / Left Desktop */}
                                        <div className="col-span-6 px-4 md:px-6 md:py-4 mb-4 md:mb-0">
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <button 
                                                    onClick={() => toggleWishlist({
                                                        id: cbId,
                                                        collegeName: college.full_name,
                                                        branchName: item.branch.branch_name,
                                                        collegeId: college.college_id
                                                    })}
                                                    className={cn(
                                                        "shrink-0 w-8 h-8 rounded-full border transition-all flex items-center justify-center",
                                                        isWishlisted 
                                                            ? "bg-rose-500/20 border-rose-500/50 text-rose-500 shadow-lg shadow-rose-500/20" 
                                                            : "bg-white/5 border-white/10 text-muted-foreground hover:border-white/30"
                                                    )}
                                                >
                                                    <Heart className={cn("w-4 h-4", isWishlisted && "fill-current")} />
                                                </button>
                                                <div>
                                                    <div className="font-bold text-sm text-white line-clamp-2 leading-tight">{item.branch.branch_name}</div>
                                                    <div className="text-[10px] text-muted-foreground uppercase mt-0.5">{item.branch.branch_code}</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Mobile Row (Grid) / Right Desktop */}
                                        <div className="col-span-6 grid grid-cols-3 items-center px-4 md:px-0 bg-white/2 md:bg-transparent rounded-xl mx-4 md:mx-0 py-3 md:py-0 border border-white/5 md:border-0">
                                            <div className="md:py-4 px-2 text-center flex flex-col md:block">
                                                <span className="md:hidden text-[9px] text-muted-foreground uppercase font-bold mb-1 tracking-wider">Round 1</span>
                                                <span className="font-mono font-bold text-sm">{item.r1}</span>
                                            </div>
                                            <div className="md:py-4 px-2 text-center flex flex-col md:block border-l border-white/5 md:border-0">
                                                <span className="md:hidden text-[9px] text-muted-foreground uppercase font-bold mb-1 tracking-wider">Round 2</span>
                                                <span className="font-mono font-bold text-sm">{item.r2}</span>
                                            </div>
                                            <div className="md:py-4 px-2 text-center flex flex-col md:block border-l border-white/5 md:border-0">
                                                <span className="md:hidden text-[9px] text-muted-foreground uppercase font-bold mb-1 tracking-wider">Round 3</span>
                                                <span className="font-mono font-bold text-sm text-primary">{item.r3}</span>
                                            </div>
                                        </div>
                                    </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default function CutoffsExplorer() {
  const { colleges, isLoading } = useColleges();
  const [search, setSearch] = useState('');
  const [filterCity, setFilterCity] = useState('All');
  const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
  
  const cities = useMemo(() => ['All', ...new Set(colleges.map(c => c.city))], [colleges]);
  
  const filteredColleges = useMemo(() => {
      return colleges.filter(c => {
          const matchesSearch = c.full_name.toLowerCase().includes(search.toLowerCase()) || 
                               c.city.toLowerCase().includes(search.toLowerCase());
          const matchesCity = filterCity === 'All' || c.city === filterCity;
          return matchesSearch && matchesCity;
      }).slice(0, 48);
  }, [search, filterCity, colleges]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <CollegeDetailsModal 
        isOpen={!!selectedCollege} 
        onClose={() => setSelectedCollege(null)} 
        college={selectedCollege} 
      />

      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center shadow-lg shadow-primary/20">
                  <Globe className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gradient">College Explorer</h1>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mt-1">Based on 2025 Official KCET Records</p>
              </div>
          </div>
          <p className="text-muted-foreground text-lg ml-1">Browse through all engineering colleges in Karnataka and their cutoff trends.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search by college name or location..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all text-lg"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
             <div className="relative">
                <select 
                  className="bg-white/5 border border-white/10 rounded-2xl py-4 px-6 appearance-none focus:outline-none focus:border-primary/50 cursor-pointer min-w-[160px] text-foreground"
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                >
                  {cities.map(city => <option key={city} value={city} className="bg-background text-foreground">{city}</option>)}
                </select>
                <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {filteredColleges.map((college, idx) => (
             <motion.div
               key={college.college_id}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: (idx % 12) * 0.05 }}
               onClick={() => setSelectedCollege(college)}
               className="glass-card group overflow-hidden cursor-pointer hover:border-primary/30 transition-all"
             >
                <div className="p-8">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                         <Building2 className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex flex-col items-end">
                         <div className={cn(
                             "flex items-center gap-1.5",
                             college.tier === "Tier 1" ? "text-amber-400" : 
                             college.tier === "Tier 1.5" ? "text-blue-400" : 
                             college.tier === "Tier 2" ? "text-emerald-400" : "text-zinc-400"
                         )}>
                             <Trophy className="w-3 h-3" />
                             <span className="text-xs font-black uppercase tracking-widest">{college.tier || "Tier 3"}</span>
                             {college.rating && (
                                 <span className="ml-1 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded-md text-[9px] font-black">
                                     {college.rating}
                                 </span>
                             )}
                         </div>
                         <div className="text-[10px] uppercase font-bold text-muted-foreground mt-1">{college.college_type}</div>
                      </div>
                   </div>
                   
                   <h3 className="text-xl font-bold mb-2 leading-tight group-hover:text-primary transition-colors min-h-[3.5rem] line-clamp-2">
                      {college.full_name}
                   </h3>
                   
                   <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                       <MapPin className="w-4 h-4" />
                       {college.city}, {college.region}
                   </div>

                       <div className="grid grid-cols-2 gap-4 mb-8">
                          <div className="space-y-1">
                            <div className="text-[10px] uppercase font-bold text-muted-foreground">Avg Package</div>
                            <div className="text-lg font-bold text-emerald-400">
                                {typeof college.avg_package === 'number' ? `${college.avg_package} LPA` : college.avg_package}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-[10px] uppercase font-bold text-muted-foreground">Tuition Fees</div>
                            <div className="text-lg font-bold text-primary">
                                {typeof college.fees === 'number' ? `₹${(college.fees / 1000).toFixed(0)}k/yr` : college.fees}
                            </div>
                          </div>
                       </div>

                        {college.tier === "Tier 3" && (
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-rose-400/80 mb-6 bg-rose-400/5 px-2 py-1 rounded-md border border-rose-400/10">
                                <AlertTriangle className="w-3 h-3" />
                                Placements not guaranteed. Branch-combined avg.
                            </div>
                        )}

                   <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">View Cutoff Trends</span>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                            <ChevronRight className="w-4 h-4" />
                        </div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
}
