'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Users, 
  LineChart,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Database,
  Zap,
  Target,
  Trash2,
  AlertCircle,
  School,
  Search,
  Edit2,
  Save,
  X,
  Plus,
  Settings2,
  CheckCircle2,
  Replace,
  GitMerge,
  Filter,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useColleges } from '@/lib/contexts/CollegeContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, deleteDoc, doc, setDoc, writeBatch, limit } from 'firebase/firestore';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { College } from '@/lib/types';
import localColleges from '@/lib/data/colleges.json';

interface StudentProfile {
    id: string;
    name: string;
    email: string;
    rank: number;
    kcetMarks: number;
    pcmMarks: number;
    category: string;
    updatedAt: string;
    userId?: string;
    userName?: string;
    guestId?: string;
}

export default function AdminPage() {
    const { user, isLoading: authLoading, isAdmin } = useAuth();
    const { colleges, refreshData } = useColleges();
    const forceSync = async () => {
        setIsLoading(true);
        await refreshData();
        alert("✅ Dashboard synced with latest Cloud data!");
        setIsLoading(false);
    };
    const [activeTab, setActiveTab] = useState<'submissions' | 'colleges'>('submissions');
    const [profiles, setProfiles] = useState<StudentProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<College>>({});
    
    const [showFindReplace, setShowFindReplace] = useState(false);
    const [findText, setFindText] = useState('');
    const [replaceText, setReplaceText] = useState('');
    
    const [showMergeWizard, setShowMergeWizard] = useState(false);
    const [mergePrimaryId, setMergePrimaryId] = useState('');
    const [mergeSecondaryId, setMergeSecondaryId] = useState('');

    const [filters, setFilters] = useState({
        tier: 'All',
        region: 'All',
        type: 'All'
    });
    
    const [stats, setStats] = useState({
        totalUsers: 0,
        predictionsDone: 0,
        dailyActive: 0
    });

    useEffect(() => {
        if (isAdmin) {
            fetchData();
        }
    }, [isAdmin]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const q = query(
                collection(db, 'submissions'), 
                orderBy('updatedAt', 'desc'),
                limit(100)
            );
            const querySnapshot = await getDocs(q);
            const data: StudentProfile[] = [];
            const now = new Date();
            const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
            let dailyActive = 0;
            let predictionsDone = 0;

            querySnapshot.forEach((doc) => {
                const d = doc.data();
                const updatedAt = new Date(d.updatedAt);
                data.push({ id: doc.id, ...d } as StudentProfile);
                if (updatedAt > oneDayAgo) dailyActive++;
                if (d.rank > 0) predictionsDone++;
            });

            setProfiles(data);
            setStats({ totalUsers: data.length, predictionsDone, dailyActive });
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const seedDatabase = async () => {
        if (!window.confirm(`MIGRATE ${localColleges.length} COLLEGES TO FIRESTORE? This will overwrite existing cloud data.`)) return;
        setIsSeeding(true);
        try {
            let batch = writeBatch(db);
            let count = 0;
            
            for (const college of localColleges) {
                const docRef = doc(db, 'colleges', college.college_id);
                batch.set(docRef, college);
                count++;
                
                if (count % 400 === 0) {
                    await batch.commit();
                    batch = writeBatch(db);
                }
            }
            await batch.commit();
            alert(`SUCCESS: ${count} colleges migrated to Live Firestore!`);
        } catch (error) {
            console.error("Seed failed:", error);
            alert("Migration failed. Check console.");
        } finally {
            setIsSeeding(false);
        }
    };

    const filteredColleges = useMemo(() => {
        return colleges.filter(c => {
            const matchesSearch = !searchQuery || 
                c.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                c.college_id.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesTier = filters.tier === 'All' || c.tier === filters.tier;
            const matchesRegion = filters.region === 'All' || c.region === filters.region;
            
            return matchesSearch && matchesTier && matchesRegion;
        });
    }, [colleges, searchQuery, filters]);

    const handleEditStart = (college: College) => {
        setEditingId(college.college_id);
        setEditForm(college);
    };

    const [pendingChanges, setPendingChanges] = useState<Record<string, College>>({});

    // Load drafts on mount
    useEffect(() => {
        const saved = localStorage.getItem('admin_drafts');
        if (saved) setPendingChanges(JSON.parse(saved));
    }, []);

    // Save drafts to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('admin_drafts', JSON.stringify(pendingChanges));
    }, [pendingChanges]);

    const handleEditSave = () => {
        if (!editingId || !editForm) return;
        setPendingChanges(prev => ({
            ...prev,
            [editingId]: editForm
        }));
        setEditingId(null);
        alert("Draft Saved! Click 'Deploy' to make it live for users.");
    };

    const deployChanges = async () => {
        const changeCount = Object.keys(pendingChanges).length;
        if (changeCount === 0) return alert("No changes to deploy.");
        if (!window.confirm(`DEPLOY ${changeCount} STAGED CHANGES TO ALL USERS?`)) return;

        setIsLoading(true);
        try {
            const BATCH_LIMIT = 450;
            const changes = Object.values(pendingChanges);

            for (let i = 0; i < changes.length; i += BATCH_LIMIT) {
                const batch = writeBatch(db);
                const chunk = changes.slice(i, i + BATCH_LIMIT);
                chunk.forEach(c => {
                    batch.set(doc(db, 'colleges', c.college_id), c, { merge: true });
                });
                await batch.commit();
            }

            // Update Version to trigger user cache refreshes
            const newVersion = Date.now();
            await setDoc(doc(db, 'metadata', 'config'), { version: newVersion }, { merge: true });

            setPendingChanges({});
            localStorage.removeItem('admin_drafts');
            alert(`🚀 DEPLOY SUCCESSFUL! All ${changeCount} changes are now live.`);
        } catch (error: any) {
            console.error(error);
            alert(`Deploy failed: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFindReplace = async () => {
        if (!findText) return;
        const matches = colleges.filter(c => c.full_name.includes(findText) || c.short_name.includes(findText));
        if (!window.confirm(`Update ${matches.length} colleges in Firestore?`)) return;

        setIsLoading(true);
        try {
            let batch = writeBatch(db);
            let count = 0;
            for (const c of matches) {
                const docRef = doc(db, 'colleges', c.college_id);
                const updated = {
                    full_name: c.full_name.replaceAll(findText, replaceText),
                    short_name: c.short_name.replaceAll(findText, replaceText)
                };
                batch.update(docRef, updated);
                count++;
                if (count % 400 === 0) {
                    await batch.commit();
                    batch = writeBatch(db);
                }
            }
            await batch.commit();
            setShowFindReplace(false);
            alert("Bulk Live Replace Successful!");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCollege = async (id: string) => {
        if (!window.confirm("DELETE PERMANENTLY FROM FIRESTORE? This cannot be undone.")) return;
        try {
            await deleteDoc(doc(db, 'colleges', id));
        } catch (error) {
            alert("Delete failed.");
        }
    };

    const handleMerge = async () => {
        const primary = colleges.find(c => c.college_id === mergePrimaryId);
        const secondary = colleges.find(c => c.college_id === mergeSecondaryId);
        if (!primary || !secondary) return;

        if (!window.confirm(`MERGE ${secondary.short_name} INTO ${primary.short_name} LIVE?`)) return;

        try {
            const batch = writeBatch(db);
            // 1. Update Primary with Aliases
            const primaryRef = doc(db, 'colleges', mergePrimaryId);
            batch.update(primaryRef, {
                aliases: [...(primary.aliases || []), secondary.full_name, secondary.short_name, secondary.college_id]
            });
            // 2. Delete Secondary
            const secondaryRef = doc(db, 'colleges', mergeSecondaryId);
            batch.delete(secondaryRef);

            await batch.commit();
            setShowMergeWizard(false);
            alert("Live Merge Complete!");
        } catch (error) {
            console.error(error);
        }
    };

    const calculateAggregate = (rawKcet: number, rawPcm: number) => {
        let kcet = Number(rawKcet) || 0;
        let pcm = Number(rawPcm) || 0;
        kcet = Math.min(Math.max(kcet, 0), 180);
        pcm = Math.min(Math.max(pcm, 0), 300);
        const aggregate = ((kcet / 180) * 100 + (pcm / 300) * 100) / 2;
        return aggregate.toFixed(4);
    };

    const handleDeleteSubmission = async (id: string) => {
        if (!window.confirm("Delete this submission?")) return;
        try {
            await deleteDoc(doc(db, 'submissions', id));
            setProfiles(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const exportCSV = () => {
        const headers = ['Name', 'Email', 'Rank', 'KCET Marks', 'PCM Marks', 'Aggregate %', 'Category', 'Date'];
        const rows = profiles.map(p => [
            p.name || p.userName || 'Unknown',
            p.email || 'N/A',
            p.rank,
            p.kcetMarks,
            p.pcmMarks,
            `${calculateAggregate(p.kcetMarks, p.pcmMarks)}%`,
            p.category,
            new Date(p.updatedAt).toLocaleDateString()
        ]);
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "KCET_Student_Intelligence.csv");
        link.click();
    };

    if (authLoading) return <div className="min-h-screen flex items-center justify-center text-white">Authenticating Admin...</div>;

    if (!isAdmin) {
        return (
            <div className="min-h-screen pt-40 px-6 flex flex-col items-center justify-center text-center text-white">
                <ShieldAlert className="w-20 h-20 text-orange-500 mb-6" />
                <h1 className="text-4xl font-bold mb-4">Access Restricted</h1>
                <Link href="/"><button className="text-primary font-bold">Back to Home</button></Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 text-white">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-orange-500/20 flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <Settings2 className="w-7 h-7 text-orange-500" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gradient">Live Intelligence</h1>
                            <div className="flex gap-4 mt-2">
                                <button onClick={() => setActiveTab('submissions')} className={cn("text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all", activeTab === 'submissions' ? "text-orange-500 border-orange-500" : "text-muted-foreground border-transparent")}>
                                    Submissions
                                </button>
                                <button onClick={() => setActiveTab('colleges')} className={cn("text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all", activeTab === 'colleges' ? "text-orange-500 border-orange-500" : "text-muted-foreground border-transparent")}>
                                    Live Database
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {activeTab === 'colleges' && (
                            <>
                                <button 
                                    onClick={seedDatabase} 
                                    disabled={isSeeding}
                                    className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2.5 rounded-xl text-[10px] font-black hover:bg-orange-500 hover:text-white transition-all uppercase tracking-widest disabled:opacity-50"
                                >
                                    <Database className="w-4 h-4" /> {isSeeding ? 'Migrating...' : 'Seed Live Data'}
                                </button>
                                <button onClick={() => setShowFindReplace(true)} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-[10px] font-black hover:bg-white/10 transition-all uppercase tracking-widest">
                                    <Replace className="w-4 h-4 text-blue-400" /> Find & Replace
                                </button>
                                <button onClick={() => setShowMergeWizard(true)} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2.5 rounded-xl text-[10px] font-black hover:bg-white/10 transition-all uppercase tracking-widest">
                                    <GitMerge className="w-4 h-4 text-purple-400" /> Merge
                                </button>
                            </>
                        )}
                        {activeTab === 'colleges' && Object.keys(pendingChanges).length > 0 && (
                            <button 
                                onClick={deployChanges}
                                className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-[10px] font-black flex items-center gap-2 shadow-lg shadow-primary/30 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
                            >
                                <Zap className="w-4 h-4 fill-current" />
                                Deploy Changes ({Object.keys(pendingChanges).length})
                            </button>
                        )}
                        {activeTab === 'submissions' && (
                             <button onClick={exportCSV} className="bg-white/5 border border-white/10 px-6 py-2.5 rounded-xl text-[10px] font-black hover:bg-white/10 transition-all uppercase tracking-widest">
                                Export Submissions
                             </button>
                        )}
                    </div>
                </header>

                {activeTab === 'submissions' ? (
                    <div className="space-y-12">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-card p-6 border-l-4 border-orange-500">
                                <Users className="w-5 h-5 text-orange-500 mb-4" />
                                <div className="text-3xl font-black mb-1">{stats.totalUsers}</div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Registered</div>
                            </div>
                            <div className="glass-card p-6 border-l-4 border-blue-500">
                                <Zap className="w-5 h-5 text-blue-500 mb-4" />
                                <div className="text-3xl font-black mb-1">{stats.predictionsDone}</div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Predictions Done</div>
                            </div>
                            <div className="glass-card p-6 border-l-4 border-rose-500">
                                <Target className="w-5 h-5 text-rose-500 mb-4" />
                                <div className="text-3xl font-black mb-1">{stats.dailyActive}</div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Daily Active</div>
                            </div>
                        </div>

                        <div className="glass-card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/2 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-white/5">
                                        <tr>
                                            <th className="px-6 py-4">Student Identity</th>
                                            <th className="px-6 py-4">Rank</th>
                                            <th className="px-6 py-4">AGG %</th>
                                            <th className="px-6 py-4">Category</th>
                                            <th className="px-6 py-4">Timestamp</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {profiles.map((p) => (
                                            <tr key={p.id} className="hover:bg-white/2 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold">{(p as any).userName || p.name || 'Guest'}</span>
                                                        <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">{p.email || 'Anonymous'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-orange-500">{p.rank.toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-orange-400/10 px-2 py-1 rounded text-orange-400 font-bold text-xs border border-orange-400/20">
                                                        {calculateAggregate(p.kcetMarks, p.pcmMarks)}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-[10px] uppercase font-bold text-muted-foreground">{p.category}</td>
                                                <td className="px-6 py-4 text-[10px] text-muted-foreground">{new Date(p.updatedAt).toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button onClick={() => handleDeleteSubmission(p.id)} className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Advanced Filters */}
                        <div className="flex flex-wrap gap-4 items-center bg-white/2 p-6 rounded-3xl border border-white/5">
                            <div className="relative flex-1 min-w-[300px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input 
                                    type="text" 
                                    placeholder="Instant Search by ID or Name..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-sm focus:border-orange-500 outline-none transition-all"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-muted-foreground" />
                                <select 
                                    value={filters.tier}
                                    onChange={(e) => setFilters(prev => ({ ...prev, tier: e.target.value }))}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                                >
                                    <option value="All">All Tiers</option>
                                    <option value="Tier 1">Tier 1</option>
                                    <option value="Tier 1.5">Tier 1.5</option>
                                    <option value="Tier 2">Tier 2</option>
                                    <option value="Tier 3">Tier 3</option>
                                </select>
                                <select 
                                    value={filters.region}
                                    onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold outline-none"
                                >
                                    <option value="All">All Regions</option>
                                    <option value="Bangalore">Bangalore</option>
                                    <option value="Mysore">Mysore</option>
                                    <option value="North">North</option>
                                    <option value="Other">Other</option>
                                </select>
                                <button 
                                    onClick={() => setFilters({ tier: 'All', region: 'All', type: 'All' })}
                                    className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-orange-500 transition-all"
                                    title="Reset Filters"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* College Database Table */}
                        <div className="glass-card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/2 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-white/5">
                                        <tr>
                                            <th className="px-6 py-5">Code</th>
                                            <th className="px-6 py-5">Institution</th>
                                            <th className="px-6 py-5">Tier</th>
                                            <th className="px-6 py-5">Location</th>
                                            <th className="px-6 py-5">Avg Package</th>
                                            <th className="px-6 py-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {filteredColleges.map((college) => {
                                            const hasPending = !!pendingChanges[college.college_id];
                                            const displayCollege = hasPending ? pendingChanges[college.college_id] : college;

                                            return (
                                            <tr key={college.college_id} className={cn(
                                                "hover:bg-white/[0.02] transition-colors group",
                                                hasPending && "bg-primary/[0.03]"
                                            )}>
                                                <td className="px-6 py-4 font-mono text-xs text-primary font-bold">
                                                    {college.college_id}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-bold group-hover:text-primary transition-colors flex items-center gap-2">
                                                                {displayCollege.full_name}
                                                                {hasPending && (
                                                                    <span className="px-1.5 py-0.5 rounded-md bg-primary/20 border border-primary/30 text-[7px] font-black uppercase tracking-widest animate-pulse">
                                                                        Pending
                                                                    </span>
                                                                )}
                                                            </span>
                                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{displayCollege.short_name}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                        displayCollege.tier === "Tier 1" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                                                        displayCollege.tier === "Tier 1.5" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                                                        "bg-white/5 text-muted-foreground border-white/10"
                                                    )}>
                                                        {displayCollege.tier || 'Tier 3'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                                        {displayCollege.city} <br/>
                                                        <span className="text-[9px] font-normal opacity-50">{displayCollege.region}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-xs text-emerald-400 font-bold">
                                                    {displayCollege.avg_package}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => handleEditStart(college)}
                                                            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-orange-500 hover:text-white transition-all"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteCollege(college.college_id)}
                                                            className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Find & Replace Modal */}
            <AnimatePresence>
                {showFindReplace && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFindReplace(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-lg bg-[#0a0a0b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-blue-500/20 rounded-2xl"><Replace className="w-6 h-6 text-blue-500" /></div>
                                <div>
                                    <h2 className="text-xl font-bold">Bulk Find & Replace</h2>
                                    <p className="text-xs text-muted-foreground">Scans full and short names across all records.</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Find Pattern</label>
                                    <input type="text" value={findText} onChange={(e) => setFindText(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" placeholder="e.g. Soceity" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Replace With</label>
                                    <input type="text" value={replaceText} onChange={(e) => setReplaceText(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none" placeholder="e.g. Society" />
                                </div>
                                <button onClick={handleFindReplace} className="w-full bg-blue-500 text-white py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-lg shadow-blue-500/20 uppercase tracking-widest text-xs">
                                    Execute Bulk Replacement
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Merge Wizard Modal */}
            <AnimatePresence>
                {showMergeWizard && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowMergeWizard(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-xl bg-[#0a0a0b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-purple-500/20 rounded-2xl"><GitMerge className="w-6 h-6 text-purple-500" /></div>
                                <div>
                                    <h2 className="text-xl font-bold">Merge Wizard</h2>
                                    <p className="text-xs text-muted-foreground">Consolidate two colleges into one unified record.</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Secondary ID (To Remove)</label>
                                        <input type="text" value={mergeSecondaryId} onChange={(e) => setMergeSecondaryId(e.target.value.toUpperCase())} className="w-full bg-white/5 border border-rose-500/30 rounded-xl px-4 py-3 text-sm focus:border-rose-500 outline-none font-mono" placeholder="E001" />
                                    </div>
                                    <div className="flex justify-center"><ArrowRight className="w-6 h-6 text-muted-foreground opacity-20" /></div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Primary ID (To Keep)</label>
                                        <input type="text" value={mergePrimaryId} onChange={(e) => setMergePrimaryId(e.target.value.toUpperCase())} className="w-full bg-white/5 border border-emerald-500/30 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none font-mono" placeholder="E005" />
                                    </div>
                                </div>
                                <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20 flex gap-3">
                                    <AlertCircle className="w-5 h-5 text-orange-500 shrink-0" />
                                    <p className="text-[10px] text-orange-200 uppercase font-bold leading-relaxed">
                                        Data from the secondary ID will be migrated to the primary ID's alias list. The secondary record will be deleted.
                                    </p>
                                </div>
                                <button onClick={handleMerge} className="w-full bg-purple-500 text-white py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-lg shadow-purple-500/20 uppercase tracking-widest text-xs">
                                    Confirm Intelligence Merge
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Modal (re-used from previous step) */}
            <AnimatePresence>
                {editingId && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingId(null)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl bg-[#0a0a0b] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
                            <div className="p-8 border-b border-white/5 bg-white/2 flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-orange-500/20 rounded-2xl"><School className="w-6 h-6 text-orange-500" /></div>
                                    <div><h2 className="text-xl font-bold">{editingId} Editor</h2></div>
                                </div>
                                <button onClick={() => setEditingId(null)}><X className="w-6 h-6 text-muted-foreground" /></button>
                            </div>
                            <div className="p-8 grid grid-cols-2 gap-6">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Full Name</label>
                                    <input type="text" value={editForm.full_name || ''} onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-orange-500 outline-none font-bold text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Short Name</label>
                                    <input type="text" value={editForm.short_name || ''} onChange={(e) => setEditForm(prev => ({ ...prev, short_name: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-orange-500 outline-none font-bold text-white" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Tier</label>
                                    <select value={editForm.tier || ''} onChange={(e) => setEditForm(prev => ({ ...prev, tier: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-orange-500 outline-none text-white">
                                        <option value="Tier 1">Tier 1</option>
                                        <option value="Tier 1.5">Tier 1.5</option>
                                        <option value="Tier 2">Tier 2</option>
                                        <option value="Tier 3">Tier 3</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Avg Pkg</label>
                                    <input type="text" value={editForm.avg_package || ''} onChange={(e) => setEditForm(prev => ({ ...prev, avg_package: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-emerald-500 outline-none font-bold text-emerald-400" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Fees</label>
                                    <input type="text" value={editForm.fees || ''} onChange={(e) => setEditForm(prev => ({ ...prev, fees: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-blue-500 outline-none font-bold text-blue-400" />
                                </div>
                            </div>
                            <div className="p-8 bg-white/2 flex justify-end gap-4">
                                <button onClick={() => setEditingId(null)} className="px-6 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:bg-white/5 transition-all">CANCEL</button>
                                <button onClick={handleEditSave} className="bg-orange-500 text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-orange-500/20 flex items-center gap-2"><Save className="w-4 h-4" /> SAVE CHANGES</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
