'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  MapPin, 
  IndianRupee, 
  TrendingUp, 
  Star, 
  Check, 
  Plus,
  X,
  ArrowLeftRight,
  ChevronRight,
  Zap,
  Globe,
  Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { College, Branch, CollegeBranch, CutoffData } from '@/lib/types';

import { useColleges } from '@/lib/contexts/CollegeContext';
import branchesData from '@/lib/data/branches.json';
import collegeBranchesData from '@/lib/data/college_branches.json';
import cutoffDataJson from '@/lib/data/cutoff_data.json';

const branches = branchesData as Branch[];
const collegeBranches = collegeBranchesData as CollegeBranch[];
const cutoffs = cutoffDataJson as CutoffData[];

const BranchSelectorModal = ({ 
    isOpen, 
    onClose, 
    college,
    onSelect,
    selectedIds
}: { 
    isOpen: boolean, 
    onClose: () => void, 
    college: College | null,
    onSelect: (cbId: string) => void,
    selectedIds: string[]
}) => {
    if (!isOpen || !college) return null;

    const collegeBrs = collegeBranches.filter(cb => cb.college_id === college.college_id);
    const branchList = collegeBrs.map(cb => {
        const branch = branches.find(b => b.branch_id === cb.branch_id)!;
        const cutoff = cutoffs.find(c => c.college_branch_id === cb.id && c.category === 'GM' && c.round === 1 && c.year === 2024);
        return {
            cbId: cb.id,
            branch,
            cutoff: cutoff?.closing_rank || 'N/A'
        };
    });

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/90 backdrop-blur-md" 
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10"
                >
                    <div className="p-6 border-b border-white/5">
                        <div className="flex justify-between items-center mb-2">
                             <h3 className="text-xl font-bold">Select Branch</h3>
                             <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10">
                                <X className="w-4 h-4" />
                             </button>
                        </div>
                        <p className="text-sm text-muted-foreground">{college.full_name}</p>
                    </div>
                    <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
                        {branchList.map(item => {
                            const isSelected = selectedIds.includes(item.cbId);
                            return (
                                <button
                                    key={item.cbId}
                                    onClick={() => {
                                        onSelect(item.cbId);
                                        onClose();
                                    }}
                                    className={cn(
                                        "w-full text-left p-4 rounded-2xl border transition-all flex justify-between items-center",
                                        isSelected 
                                            ? "bg-primary/20 border-primary/50 text-primary" 
                                            : "bg-white/5 border-white/10 hover:border-white/20"
                                    )}
                                >
                                    <div>
                                        <div className="font-bold text-sm">{item.branch.branch_name}</div>
                                        <div className="text-[10px] uppercase font-bold text-muted-foreground">GM Cutoff: {item.cutoff}</div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 opacity-50" />
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default function ComparePage() {
  const { colleges, isLoading } = useColleges();
  const [selectedCbIds, setSelectedCbIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectionCollege, setSelectionCollege] = useState<College | null>(null);
  
  const toggleSelect = (cbId: string) => {
    if (selectedCbIds.includes(cbId)) {
      setSelectedCbIds(selectedCbIds.filter(i => i !== cbId));
    } else if (selectedCbIds.length < 3) {
      setSelectedCbIds([...selectedCbIds, cbId]);
    }
  };

  const selectedItems = useMemo(() => {
    if (isLoading) return [];
    return selectedCbIds.map(cbId => {
        const cb = collegeBranches.find(x => x.id === cbId)!;
        const college = colleges.find(c => c.college_id === cb.college_id)!;
        const branch = branches.find(b => b.branch_id === cb.branch_id)!;
        const cutoff = cutoffs.find(c => c.college_branch_id === cbId && c.category === 'GM' && c.round === 1 && c.year === 2024);
        return {
            id: cbId,
            college,
            branch,
            closing_rank: cutoff?.closing_rank || 'N/A'
        };
    });
  }, [selectedCbIds, colleges, isLoading]);

  const filteredColleges = useMemo(() => {
      if (isLoading) return [];
      return colleges.filter(c => 
          c.full_name.toLowerCase().includes(search.toLowerCase()) || 
          c.city.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 48);
  }, [search, colleges, isLoading]);

  return (
    <div className="min-h-screen pt-20 pb-12 px-6">
      <BranchSelectorModal 
        isOpen={!!selectionCollege} 
        onClose={() => setSelectionCollege(null)} 
        college={selectionCollege}
        onSelect={toggleSelect}
        selectedIds={selectedCbIds}
      />

      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shadow-lg shadow-primary/20">
                  <ArrowLeftRight className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gradient">Compare Colleges</h1>
                <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mt-1">Based on 2025 Official Institutional Records</p>
              </div>
          </div>
          <p className="text-muted-foreground text-sm ml-1 font-medium">Compare institutional metrics and placement data side-by-side.</p>
        </header>

        {/* Comparison Table */}
        <div className="mb-12 overflow-x-auto">
           <div className="min-w-[800px] grid grid-cols-4 gap-4">
              <div className="pt-[140px]">
                 <div className="space-y-10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <div className="h-14 flex items-center">Institution Info</div>
                    <div className="h-14 flex items-center">Average Package</div>
                    <div className="h-14 flex items-center">Highest Package</div>
                    <div className="h-14 flex items-center">Fees (Annual)</div>
                    <div className="h-14 flex items-center">Placement Strength</div>
                    <div className="h-14 flex items-center">GM Closing Rank</div>
                 </div>
              </div>

              {[0, 1, 2].map((idx) => {
                const item = selectedItems[idx];
                return (
                  <div key={idx} className={cn(
                    "glass-card p-5 min-h-[480px] transition-all relative overflow-hidden",
                    item ? "border-primary/20 bg-primary/2" : "border-dashed border-white/10 flex flex-col items-center justify-center bg-transparent"
                  )}>
                    {item ? (
                      <>
                        <div className="relative mb-6 text-center h-[100px]">
                           <button 
                            onClick={() => toggleSelect(item.id)}
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white/5 text-muted-foreground flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-xl"
                           >
                             <X className="w-4 h-4" />
                           </button>
                           <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 mx-auto border border-white/10">
                               <Building2 className="w-7 h-7 text-primary" />
                           </div>
                           <h3 className="text-sm font-bold leading-tight mb-1 line-clamp-1">{item.college.full_name}</h3>
                           <div className="inline-block px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[8px] font-bold uppercase tracking-widest">{item.branch.branch_name}</div>
                        </div>

                        <div className="space-y-10 text-center font-bold">
                           <div className="h-14 flex flex-col justify-center items-center gap-1">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span className="text-[10px]">{item.college.city}</span>
                           </div>
                           <div className="h-14 flex flex-col justify-center items-center text-emerald-400 text-sm">
                               <TrendingUp className="w-3 h-3 mb-1" />
                               {typeof item.college.avg_package === 'number' ? `${item.college.avg_package} LPA` : item.college.avg_package}
                           </div>
                           <div className="h-14 flex flex-col justify-center items-center text-sm">
                               <Star className="w-3 h-3 mb-1 text-rose-400" />
                               {typeof item.college.highest_package === 'number' ? `${item.college.highest_package} LPA` : item.college.highest_package}
                           </div>
                           <div className="h-14 flex flex-col justify-center items-center text-sm">
                               <IndianRupee className="w-3 h-3 mb-1 text-primary" />
                               {typeof item.college.fees === 'number' ? `₹${(item.college.fees/1000).toFixed(0)}k/yr` : item.college.fees}
                           </div>
                           <div className="h-14 flex flex-col justify-center items-center">
                              <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[9px] text-amber-400 uppercase tracking-widest font-black">
                                {item.college.placement_strength || 'Good'}
                              </div>
                           </div>
                           <div className="h-14 flex flex-col justify-center items-center text-primary text-xl font-mono">
                               {item.closing_rank}
                           </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-6 group">
                         <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 mx-auto group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                            <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-all" />
                         </div>
                         <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Select to Compare</p>
                      </div>
                    )}
                  </div>
                );
              })}
           </div>
        </div>


        {/* Selection Grid */}
        <section>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-12">
            <div>
                <h2 className="text-3xl font-bold">Select Institutions</h2>
                <p className="text-sm text-muted-foreground">Choose a college first, then pick a branch to compare.</p>
            </div>
            <div className="relative w-full max-w-md group">
               <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search by college name or city..." 
                 className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary transition-all text-foreground text-lg shadow-2xl"
                 value={search}
                 onChange={(e) => setSearch(e.target.value)}
               />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {filteredColleges.map((college, idx) => {
               return (
                 <div 
                  key={college.college_id}
                  onClick={() => setSelectionCollege(college)}
                  className="glass-card p-6 cursor-pointer border-white/5 transition-all hover:border-primary/30 group relative overflow-hidden"
                 >
                    <div className="flex justify-between items-start mb-6">
                       <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all">
                          <Building2 className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                       </div>
                       <div className="flex flex-col items-end">
                           <div className={cn(
                               "flex items-center gap-1.5",
                               college.tier === "Tier 1" ? "text-amber-400" : 
                               college.tier === "Tier 1.5" ? "text-blue-400" : 
                               college.tier === "Tier 2" ? "text-emerald-400" : "text-zinc-400"
                           )}>
                               <Trophy className="w-3 h-3" />
                               <span className="text-[10px] font-black uppercase tracking-widest">{college.tier || "Tier 3"}</span>
                               {college.rating && (
                                   <span className="bg-white/5 border border-white/10 px-1 py-0.5 rounded text-[8px] font-black">
                                       {college.rating}
                                   </span>
                               )}
                           </div>
                           <div className="text-[9px] uppercase font-bold text-muted-foreground mt-1">{college.region}</div>
                       </div>
                    </div>
                    <h4 className="font-bold text-sm leading-tight mb-4 min-h-[2.5rem] line-clamp-2">
                       {college.full_name}
                    </h4>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                       <span className="text-[10px] font-black uppercase text-muted-foreground group-hover:text-primary transition-colors">Select Branch</span>
                       <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                           <ChevronRight className="w-3 h-3" />
                       </div>
                    </div>
                 </div>
               );
             })}
          </div>
        </section>
      </div>
    </div>
  );
}
