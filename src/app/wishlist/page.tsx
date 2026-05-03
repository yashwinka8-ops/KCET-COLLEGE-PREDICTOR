'use client';

import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { 
  Heart, 
  Trash2, 
  GraduationCap, 
  ChevronRight,
  ClipboardList,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Download,
  FileText,
  Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/lib/hooks/useWishlist';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/predictor';
import { Category } from '@/lib/types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import cutoffDataJson from '@/lib/data/cutoff_data.json';
import { useAuth } from '@/lib/contexts/AuthContext';
import { AuthModal } from '@/components/AuthModal';

export default function WishlistPage() {
    const { wishlist, setWishlist, toggleWishlist, reorderWishlist } = useWishlist();
    const { user } = useAuth();
    const [exportCategory, setExportCategory] = useState<Category>('GM');

    const handleExportPDF = () => {
        if (!user) return;
        const doc = new jsPDF();
        // ... (rest of the function)
        
        // Header
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.text('KCET 2026 - My Target Colleges', 14, 22);
        
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Category: ${exportCategory} | Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
        doc.text('Based on 2025 Official Data - Prepared by Yashwin Anand', 14, 35);

        const tableData = wishlist.map((item, idx) => {
            const cutoffs = (cutoffDataJson as any[]).filter(c => 
                c.college_branch_id === item.id && 
                c.category === exportCategory && 
                c.year === 2024
            );

            const r1 = cutoffs.find(c => c.round === 1)?.closing_rank || '-';
            const r2 = cutoffs.find(c => c.round === 2)?.closing_rank || '-';
            const r3 = cutoffs.find(c => c.round === 3)?.closing_rank || '-';

            return [
                idx + 1,
                item.collegeName,
                item.branchName,
                r1,
                r2,
                r3
            ];
        });

        autoTable(doc, {
            head: [['#', 'College Name', 'Branch', 'Round 1', 'Round 2', 'Round 3']],
            body: tableData,
            startY: 45,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [244, 63, 94] }, // Rose-500
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });

        doc.save('KCET_Target_Colleges.pdf');
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-rose-500/20 flex items-center justify-center shadow-lg shadow-rose-500/20">
                            <Heart className="w-7 h-7 text-rose-500 fill-current" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold text-gradient">My Wishlist</h1>
                            <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mt-1">Your Selected Target Colleges</p>
                        </div>
                    </div>
                    <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/10 text-muted-foreground text-sm max-w-md">
                        <p className="leading-relaxed">
                            <span className="text-white font-bold">Pro Tip:</span> Drag and drop colleges to prioritize them. This order should match your real KCET choice-filling priority.
                        </p>
                    </div>
                </header>

                {wishlist.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-20 text-center border-dashed border-white/10 max-w-3xl mx-auto"
                    >
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8">
                            <ClipboardList className="w-12 h-12 text-muted-foreground/40" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Your wishlist is empty</h2>
                        <p className="text-muted-foreground mb-10 text-lg leading-relaxed max-w-md mx-auto">Start exploring colleges and add them to your wishlist to build your target counseling list.</p>
                        <Link href="/predictor">
                            <button className="bg-primary text-white px-10 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-xl shadow-primary/20">
                                Start Predicting Now
                            </button>
                        </Link>
                    </motion.div>
                ) : (
        <div className="flex flex-col gap-1.5">
                        {/* Compact Table Header */}
                        <div className="hidden md:flex items-center gap-6 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground border-b border-white/5 bg-white/2 rounded-t-xl opacity-60">
                            <div className="w-10 shrink-0">#</div>
                            <div className="flex-1">College & Branch</div>
                            <div className="w-32 text-right">Actions</div>
                        </div>

                        <Reorder.Group 
                            axis="y" 
                            values={wishlist} 
                            onReorder={setWishlist}
                            className="space-y-1"
                        >
                            {wishlist.map((item, idx) => (
                                <Reorder.Item
                                    key={item.id}
                                    value={item}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.01 }}
                                    className="glass-card px-6 py-2.5 flex flex-col md:flex-row items-center gap-6 hover:border-primary/40 transition-all group cursor-grab active:cursor-grabbing relative overflow-hidden"
                                >
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500/20 group-hover:bg-primary transition-colors" />
                                    
                                    {/* Column 1: Priority */}
                                    <div className="w-10 shrink-0 flex items-center gap-3">
                                        <div className="text-muted-foreground/10 group-hover:text-primary transition-colors">
                                            <GripVertical className="w-4 h-4" />
                                        </div>
                                        <div className="font-mono font-black text-sm text-white/20 group-hover:text-primary transition-colors">
                                            {String(idx + 1).padStart(2, '0')}
                                        </div>
                                    </div>

                                    {/* Column 2: Combined College & Branch Info */}
                                    <div className="flex-1 min-w-0 flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                                            <GraduationCap className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold truncate group-hover:text-primary transition-colors leading-tight mb-0.5">
                                                {item.collegeName}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-rose-500" />
                                                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                                                    {item.branchName}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 3: Actions */}
                                    <div className="w-32 shrink-0 flex items-center justify-end gap-1.5">
                                        <Link href="/cutoffs" onClick={(e) => e.stopPropagation()}>
                                            <button className="p-2 rounded-lg bg-white/5 text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all" title="View Details">
                                                <FileText className="w-4 h-4" />
                                            </button>
                                        </Link>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); toggleWishlist(item); }}
                                            className="p-2 rounded-lg bg-white/5 text-muted-foreground hover:bg-rose-500/20 hover:text-rose-500 transition-all"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>

                        <div className="mt-8 p-6 rounded-2xl bg-white/2 border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <ClipboardList className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-0.5">Choice Strategy</p>
                                    <p className="text-xl font-black text-white">{wishlist.length} <span className="text-[10px] font-medium text-muted-foreground ml-1 uppercase tracking-widest">SAVED CHOICES</span></p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 w-full lg:w-auto">
                                <div className="flex items-center gap-3 px-3 w-full md:w-auto">
                                    <Filter className="w-3.5 h-3.5 text-muted-foreground" />
                                    <select 
                                        value={exportCategory}
                                        onChange={(e) => setExportCategory(e.target.value as Category)}
                                        className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
                                    >
                                        {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>)}
                                    </select>
                                </div>

                                <div className="w-px h-8 bg-white/10 hidden md:block" />

                                <button 
                                    onClick={handleExportPDF}
                                    className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Download className="w-4 h-4" />
                                    EXPORT PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <AuthModal 
                isOpen={!user} 
                allowSkip={false} 
                title="Sign in to Access Wishlist"
                subtitle="Your target list is securely stored in your account. Please sign in to view and manage your choices."
            />
        </div>
    );
}
