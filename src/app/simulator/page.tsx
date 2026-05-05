'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { exportChoiceEntryToPDF } from '@/lib/utils/choice-report';
import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { 
  Menu, 
  X, 
  Home, 
  BookOpen, 
  Building2, 
  LogOut, 
  ChevronDown,
  Monitor,
  ShieldCheck,
  HelpCircle,
  FileText,
  User as UserIcon,
  MousePointer2,
  AlertTriangle,
  CheckCircle,
  Zap,
  Clock,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/contexts/AuthContext';

// --- LOGOS ---
const KEALogo = ({ className }: { className?: string }) => (
    <img 
        src="https://www.crustindia.com/wp-content/uploads/2019/06/KEA-Logo.png" 
        alt="KEA Logo" 
        className={cn("h-16 w-auto object-contain", className)} 
    />
);

const NICLogo = () => (
    <img 
        src="https://www.uxdt.nic.in/wp-content/uploads/2020/06/nic-logo-nic-logo-1-bilingual-sans-01.jpg" 
        alt="NIC Logo" 
        className="h-12 w-auto object-contain" 
    />
);

const CAPLogo = () => (
    <div className="flex items-center gap-1.5">
        <div className="relative">
            <GraduationCapIcon className="w-10 h-10 text-gray-700" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
        </div>
        <div className="flex flex-col">
            <span className="text-gray-800 font-bold text-xl leading-none">CAP</span>
            <span className="text-[6px] text-gray-500 font-bold uppercase tracking-tighter">Unified Admission Portal</span>
        </div>
    </div>
);

const GraduationCapIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
);

export default function CounselingSimulator() {
    const { user, isAdmin } = useAuth();
    const [step, setStep] = useState<'landing' | 'declaration' | 'profile' | 'entry' | 'courses' | 'colleges' | 'submitted' | 'allotted' | 'waiting'>('landing');

    // --- NON-ADMIN COMING SOON SCREEN ---
    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-[#F0F2F5] flex flex-col items-center justify-center p-6 text-center space-y-8 relative overflow-hidden">
                {/* Background Animation Blobs */}
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00529B] rounded-full blur-[100px] -z-10"
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.3, 1],
                        rotate: [0, -90, 0],
                        opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ duration: 12, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-500 rounded-full blur-[120px] -z-10"
                />

                <div className="space-y-4 relative z-10">
                    <motion.div 
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-[#00529B]/10 relative"
                    >
                        <Zap className="w-16 h-16 text-[#00529B] animate-pulse" />
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-[-8px] border-2 border-dashed border-[#00529B]/30 rounded-full"
                        />
                    </motion.div>

                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-6xl font-black text-[#00529B] uppercase tracking-tighter">
                            Simulator <span className="text-gray-400">Loading...</span>
                        </h1>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center justify-center gap-3">
                            <Clock className="w-4 h-4" />
                            Activating on Results Day
                        </p>
                    </div>
                </div>

                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100 space-y-6"
                >
                    <div className="flex items-start gap-4 text-left">
                        <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center shrink-0 border border-rose-100">
                            <Monitor className="w-6 h-6 text-rose-500" />
                        </div>
                        <div>
                            <h4 className="font-black text-gray-800 uppercase text-xs tracking-wider mb-1">Interactive Mock Results</h4>
                            <p className="text-[11px] font-medium text-gray-500 leading-relaxed">Experience a pixel-perfect replica of the KEA portal. Practice option entry, see mock allotments, and master the Choice-1/2/3/4 system before the real window opens.</p>
                        </div>
                    </div>

                    <div className="pt-4 space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-black text-[#00529B] uppercase tracking-[0.2em]">
                            <div className="flex-1 h-px bg-gray-100" />
                            Status: Locked by Admin
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>
                        <Link href="/">
                            <button className="w-full bg-[#00529B] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-100 hover:scale-[1.02] active:scale-95 transition-all">
                                Return to Home
                            </button>
                        </Link>
                    </div>
                </motion.div>

                <div className="flex items-center gap-8 opacity-40">
                    <KEALogo className="h-12 grayscale" />
                    <NICLogo />
                </div>
            </div>
        );
    }
    const [searchTerm, setSearchTerm] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mockAllotment, setMockAllotment] = useState<any>(null);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
    const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
    const [choiceSubmitted, setChoiceSubmitted] = useState(false);
    const [submittedRound, setSubmittedRound] = useState<number>(1);
    const [previousAllotment, setPreviousAllotment] = useState<any>(null);
    
    // Load data
    const data = require('@/lib/data/colleges_unified.json');
    const colleges = data.colleges;
    const allBranches = data.branches;
    
    // --- Candidate Profile ---
    const [userProfile, setUserProfile] = useState({
        rank: '',
        category: 'GM',
        isKannadaMedium: false,
        isRural: false,
        isHydKar: false,
        gender: 'Male'
    });

    const cetNo = `25U2394${Math.floor(Math.random() * 999)}`;
    
    // --- Persistence Logic ---
    useEffect(() => {
        const loadSavedData = async () => {
            if (!user) return;
            try {
                const docRef = doc(db, 'users', user.id, 'simulation', 'state');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const saved = docSnap.data();
                    if (saved.userProfile) setUserProfile(saved.userProfile);
                    if (saved.options) setOptions(saved.options);
                    if (saved.mockAllotment) setMockAllotment(saved.mockAllotment);
                    if (saved.selectedChoice) setSelectedChoice(saved.selectedChoice);
                    if (saved.choiceSubmitted) setChoiceSubmitted(saved.choiceSubmitted);
                    if (saved.submittedRound) setSubmittedRound(saved.submittedRound);
                    if (saved.previousAllotment) setPreviousAllotment(saved.previousAllotment);
                    
                    // Auto-advance logic
                    if (saved.step) {
                        setStep(saved.step as any);
                    } else if (saved.userProfile?.rank) {
                        setStep('entry');
                    }
                }
            } catch (err) {
                console.error("Error loading simulation:", err);
            }
        };
        loadSavedData();
    }, [user]);

    const saveSimulationState = async (currentStep: string, extraData = {}) => {
        if (!user) return;
        try {
            await setDoc(doc(db, 'users', user.id, 'simulation', 'state'), {
                userId: user.id,
                email: user.email,
                userProfile,
                options,
                mockAllotment,
                step: currentStep,
                currentRound: globalConfig?.currentRound || 1,
                submittedRound: submittedRound,
                previousAllotment: previousAllotment,
                updatedAt: serverTimestamp(),
                ...extraData
            }, { merge: true });
        } catch (err) {
            console.error("Error saving simulation:", err);
        }
    };

    // --- Global Config Fetching ---
    const [globalConfig, setGlobalConfig] = useState<any>({
        currentRound: 1,
        isResultsLive: true,
        resultsReleaseDate: "2025-06-15T10:00:00Z",
        nextRoundStartDate: "2025-06-20T10:00:00Z"
    });

    useEffect(() => {
        const configRef = doc(db, 'config', 'simulation_state');
        const unsubscribe = onSnapshot(configRef, (snapshot) => {
            if (snapshot.exists()) {
                setGlobalConfig(snapshot.data());
            }
        }, (err) => {
            console.error("Real-time config error:", err);
        });
        
        return () => unsubscribe();
    }, []);
    
    // --- Simulator State ---
    const [selectedStream, setSelectedStream] = useState<'course' | 'college'>('course');
    const [selectedBranch, setSelectedBranch] = useState('CSE');
    const [selectedCollege, setSelectedCollege] = useState(colleges[0]?.college_id || '');
    const [options, setOptions] = useState<Record<string, string>>({}); // key: collegeId-branchId, value: priority string

    const representativeBranches = [
        { code: 'CSE', name: 'COMPUTER SCIENCE & ENGG' },
        { code: 'ISE', name: 'INFORMATION SCIENCE & ENGG' },
        { code: 'ECE', name: 'ELECTRONICS & COMMUNICATION ENGG' },
        { code: 'AIML', name: 'AI & MACHINE LEARNING' },
        { code: 'AIDS', name: 'AI & DATA SCIENCE' },
        { code: 'EEE', name: 'ELECTRICAL & ELECTRONICS ENGG' },
        { code: 'MECH', name: 'MECHANICAL ENGG' },
        { code: 'CIVIL', name: 'CIVIL ENGG' },
        { code: 'BT', name: 'BIO-TECHNOLOGY' },
        { code: 'CHEM', name: 'CHEMICAL ENGINEERING' },
        { code: 'CYBER', name: 'CYBER SECURITY ENGG' },
        { code: 'DS', name: 'DATA SCIENCES' },
        { code: 'EIE', name: 'ELECTRONICS & INSTRUMENTATION ENGG' },
        { code: 'ETE', name: 'ELECTRONICS & TELECOMMUNICATION ENGG' },
        { code: 'AERO', name: 'AERONAUTICAL ENGINEERING' },
        { code: 'ASE', name: 'AEROSPACE ENGINEERING' },
        { code: 'AUTO', name: 'AUTOMOBILE ENGINEERING' },
        { code: 'IEM', name: 'INDUSTRIAL ENGG & MANAGEMENT' },
        { code: 'RAI', name: 'ROBOTICS & ARTIFICIAL INTELLIGENCE' },
        { code: 'TT', name: 'TEXTILES TECHNOLOGY' }
    ];

    // Helper to find all raw IDs for a representative code
    const getRawBranchIds = (repCode: string) => {
        const branchIds: string[] = [repCode];
        if (repCode === 'CSE') branchIds.push('CS', 'BCS', 'BTCS', 'BTCS & EAI&ML');
        if (repCode === 'ISE') branchIds.push('IS', 'BIS');
        if (repCode === 'ECE') branchIds.push('EC', 'BEC', 'BTE & CE');
        if (repCode === 'AIML') branchIds.push('AI', 'ML', 'BTCS & EAI&ML');
        return branchIds;
    };

    // Derived: Selected Options for right pane
    const selectedOptions = Object.entries(options)
        .filter(([_, priority]) => priority !== '')
        .map(([key, priority]) => {
            const parts = key.split(':::');
            const cId = parts[0];
            const bId = parts[1];
            const college = colleges.find((c: any) => c.college_id === cId);
            const branch = representativeBranches.find(rb => rb.code === bId) || allBranches.find((b: any) => (b.branch_code || b.branch_id) === bId);
            return {
                priority: parseInt(priority),
                collegeId: cId,
                branchId: bId,
                collegeName: college?.name || '',
                branchName: branch?.name || branch?.branch_name || bId
            };
        })
        .sort((a, b) => a.priority - b.priority);

    const handlePriorityChange = (collegeId: string, branchId: string, value: string) => {
        if (value !== '' && !/^\d+$/.test(value)) return;
        setOptions(prev => ({
            ...prev,
            [`${collegeId}:::${branchId}`]: value
        }));
    };

    const handleFinalSubmit = () => {
        if (selectedOptions.length === 0) {
            alert('Please select at least one option before submitting.');
            return;
        }
        setShowSubmitConfirm(true);
    };

    const handleFinalConfirm = async () => {
        setIsSubmitting(true);
        setShowSubmitConfirm(false);
        setTimeout(async () => {
            setIsSubmitting(false);
            setStep('submitted');
            await saveSimulationState('submitted');
        }, 1500);
    };

    const handleDownloadReport = () => {
        exportChoiceEntryToPDF(selectedOptions, {
            name: user?.name || 'CANDIDATE NAME',
            cetNo: cetNo,
            rank: `${userProfile.rank} (${userProfile.category})`
        });
    };

    const handleCheckAllotment = async () => {
        if (!globalConfig?.isResultsLive) {
            alert("Results are not yet released for this round.");
            return;
        }

        setIsSubmitting(true);
        setTimeout(async () => {
            let allottedSeat = null;
            
            // Find the best seat based on priority
            for (const opt of selectedOptions) {
                const col = colleges.find((c: any) => c.college_id === opt.collegeId);
                if (!col) continue;

                const branchCutoffs = col.kcet_cutoffs.filter((cut: any) => 
                    cut.branch_id === opt.branchId || 
                    getRawBranchIds(opt.branchId).includes(cut.branch_id)
                );

                const gmCutoff = branchCutoffs.find((cut: any) => cut.category === 'GM');
                const gmRank = gmCutoff?.r1 || gmCutoff?.r2 || gmCutoff?.r3;

                const catCutoff = branchCutoffs.find((cut: any) => cut.category === userProfile.category);
                const catRank = catCutoff?.r1 || catCutoff?.r2 || catCutoff?.r3;

                const userRank = Number(userProfile.rank);

                if ((gmRank && userRank <= gmRank) || (catRank && userRank <= catRank)) {
                    allottedSeat = {
                        collegeId: opt.collegeId,
                        collegeName: col.name,
                        branchId: opt.branchId,
                        branchName: opt.branchName,
                        cutoffRank: gmRank && userRank <= gmRank ? gmRank : catRank,
                        collegeFees: col.fees || "96,000",
                        choiceNo: opt.priority
                    };
                    break;
                }
            }

            setMockAllotment(allottedSeat);
            setStep('allotted');
            setIsSubmitting(false);
            await saveSimulationState('allotted', { mockAllotment: allottedSeat });
        }, 1500);
    };

    const handleSubmitChoice = async () => {
        if (!selectedChoice) {
            alert('Please select a choice before submitting.');
            return;
        }
        setChoiceSubmitted(true);
        setSubmittedRound(globalConfig.currentRound);
        
        // If they choose Option 2, the current mock allotment becomes their "previous" held seat
        let updateData: any = { 
            selectedChoice, 
            choiceSubmitted: true, 
            submittedRound: globalConfig.currentRound 
        };
        
        if (selectedChoice === 2) {
            setPreviousAllotment(mockAllotment);
            updateData.previousAllotment = mockAllotment;
        } else if (selectedChoice === 3) {
            setPreviousAllotment(null);
            updateData.previousAllotment = null;
        }

        await saveSimulationState('allotted', updateData);
    };

    const choiceDescriptions = [
        {
            id: 1,
            title: "Choice 1 - FREEZE",
            desc: "Fully satisfied with the allotted seat. Ready to pay fees and report to college.",
            badge: "Out of Further Rounds",
            color: "emerald"
        },
        {
            id: 2,
            title: "Choice 2 - ACCEPT & UPGRADE",
            desc: "Satisfied with current seat but want to participate in Round 2 for higher options.",
            badge: "Round 2 Eligible",
            color: "blue"
        },
        {
            id: 3,
            title: "Choice 3 - REJECT & UPGRADE",
            desc: "Not satisfied with current seat. Rejecting it and participating in Round 2 directly.",
            badge: "Current Seat Lost",
            color: "amber"
        },
        {
            id: 4,
            title: "Choice 4 - EXIT",
            desc: "Not satisfied and leaving the counseling process completely.",
            badge: "Quit Counseling",
            color: "rose"
        }
    ];

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userProfile.rank || isNaN(Number(userProfile.rank))) {
            alert('Please enter a valid rank.');
            return;
        }
        setStep('entry');
        await saveSimulationState('entry');
    };

    const categories = ['GM', 'GMR', 'GMK', '1G', '1R', '1K', '2AG', '2AR', '2AK', '2BG', '2BR', '2BK', '3AG', '3AR', '3AK', '3BG', '3BR', '3BK', 'SCG', 'SCR', 'SCK', 'STG', 'STR', 'STK'];
    
    // Auth Check
    const { loginWithGoogle, isLoading: authLoading } = useAuth();

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#00529B] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-bold text-[#00529B] animate-pulse">Establishing secure connection...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="bg-[#00529B] p-10 text-center text-white space-y-4">
                        <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2 rotate-12">
                            <ShieldCheck className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-2xl font-black uppercase tracking-tight">Identity Verification</h2>
                        <p className="text-blue-100 text-xs font-medium leading-relaxed">To participate in the 2025 Mock Counseling Simulation, please verify your identity via Google.</p>
                    </div>
                    <div className="p-10 space-y-6">
                        <button 
                            onClick={loginWithGoogle}
                            className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-100 hover:border-[#00529B] p-4 rounded-2xl transition-all group shadow-sm"
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                            <span className="font-black text-gray-700 group-hover:text-[#00529B]">Continue with Google</span>
                        </button>
                        <div className="text-center">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                                By continuing, you agree to follow the KEA portal guidelines and ethical counseling practices.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Landing page to trigger "Start Counseling"
    if (step === 'landing') {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 pt-32">
                <div className="max-w-2xl w-full glass-card p-12 text-center border-primary/20 bg-primary/5">
                    <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/30">
                        <Monitor className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black mb-4 tracking-tight">Mock Option Entry <span className="text-primary">Simulator</span></h1>
                    <p className="text-muted-foreground mb-12 text-lg">
                        Practice the KCET 2025 option entry process in a risk-free environment. 
                        Same to same UI as the official KEA portal.
                    </p>
                    <button 
                        onClick={() => setStep('declaration')}
                        className="bg-primary hover:bg-primary/90 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-4 mx-auto"
                    >
                        Start Counseling Simulation
                        <MousePointer2 className="w-5 h-5 animate-bounce" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-[#B3D4FC]">
            {/* --- TOP HEADER BAR --- */}
            <header className="border-b border-gray-200 bg-[#F8F9FA] px-4 md:px-10 py-4">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Left: CAP & Welcome */}
                    <div className="flex items-center gap-8">
                        <CAPLogo />
                        <div className="h-10 w-px bg-gray-200 hidden md:block" />
                        <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600">Welcome</span>
                                <span className="bg-[#00529B] text-white px-3 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider shadow-sm">
                                    {user?.name || 'CANDIDATE NAME'}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-[11px] text-gray-500 font-bold">
                                    CET NO: <span className="text-gray-800">{cetNo}</span>
                                </div>
                                {step !== 'declaration' && step !== 'profile' && (
                                    <button 
                                        onClick={() => setStep('profile')}
                                        className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded text-[9px] font-black uppercase transition-colors border border-gray-200"
                                    >
                                        <Menu className="w-2.5 h-2.5" />
                                        Edit Details
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Middle: Title */}
                    <div className="text-center">
                        <h1 className="text-[#A52A2A] text-lg md:text-2xl font-bold leading-tight tracking-tight uppercase max-w-md">
                            Admission to UGCET & Other Professional Courses- 2025
                        </h1>
                    </div>

                    {/* Right: Nav Buttons */}
                    <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-1 bg-white border border-gray-300 rounded overflow-hidden shadow-sm">
                            <Link href="/" className="px-3 py-1.5 text-[11px] font-bold text-[#00529B] hover:bg-gray-50 border-r border-gray-300 transition-colors">Home</Link>
                            <button 
                                onClick={() => setStep('courses')}
                                className={cn("px-3 py-1.5 text-[11px] font-bold transition-colors border-r border-gray-300", step === 'courses' ? "bg-[#00529B] text-white" : "text-[#00529B] hover:bg-gray-50")}
                            >
                                Courses
                            </button>
                            <button 
                                onClick={() => setStep('colleges')}
                                className={cn("px-3 py-1.5 text-[11px] font-bold transition-colors border-r border-gray-300", step === 'colleges' ? "bg-[#00529B] text-white" : "text-[#00529B] hover:bg-gray-50")}
                            >
                                Colleges
                            </button>
                            <button className="px-3 py-1.5 text-[11px] font-bold text-[#00529B] hover:bg-gray-50 transition-colors">Log Out</button>
                        </div>
                        <button className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded text-[10px] font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                            Ranks
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                        </button>
                    </div>
                </div>
            </header>

            {/* --- MAIN LAYOUT --- */}
            <div className="flex min-h-[calc(100vh-200px)]">
                {/* CONTENT AREA */}
                <main className="flex-1 bg-white p-6 md:p-12 relative">
                    <AnimatePresence mode="wait">
                        {step === 'declaration' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-6xl mx-auto"
                            >
                                {/* Declaration Box */}
                                <div className="bg-[#F8F9FA] border border-[#E2E8F0] rounded-xl p-8 md:p-14 shadow-sm relative overflow-hidden">
                                    {/* Subtle pattern background like in screenshot */}
                                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#00529B_1px,transparent_1px)] [background-size:16px_16px]" />
                                    
                                    <div className="relative z-10 space-y-12">
                                        <div className="flex gap-6 items-start">
                                            <ShieldCheck className="w-10 h-10 text-[#00529B] shrink-0 mt-1" />
                                            <p className="text-[#2D3748] text-lg leading-relaxed font-medium">
                                                I am aware that the options entered will continue as it is that will continue as it is for all the subsequent rounds of online seat allotment. 
                                                I also know that I will not be allowed to add the options again in next round of option entry. 
                                                There will be no prove delete or alter or modify the order of options.
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-6">
                                            <button 
                                                onClick={() => setStep('profile')}
                                                className="w-fit bg-[#00529B] hover:bg-[#00407A] text-white px-10 py-3 rounded font-bold text-base shadow-md transition-all active:scale-[0.98]"
                                            >
                                                I Agree
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 'profile' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-2xl mx-auto py-10"
                            >
                                <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-xl overflow-hidden">
                                    <div className="bg-[#00529B] p-6 text-white text-center">
                                        <h2 className="text-xl font-black uppercase tracking-widest">Candidate Profile Setup</h2>
                                        <p className="text-blue-100 text-[10px] font-bold mt-1">Please enter your verified details from KCET-2025</p>
                                    </div>
                                    
                                    <form onSubmit={handleProfileSubmit} className="p-10 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* CET Rank */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">General Rank</label>
                                                <input 
                                                    type="text"
                                                    required
                                                    value={userProfile.rank}
                                                    onChange={(e) => setUserProfile({...userProfile, rank: e.target.value})}
                                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-lg px-4 py-3 text-lg font-black text-[#00529B] focus:border-[#00529B] focus:bg-white outline-none transition-all"
                                                    placeholder="Enter Rank"
                                                />
                                            </div>

                                            {/* Category */}
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Reservation Category</label>
                                                <select 
                                                    value={userProfile.category}
                                                    onChange={(e) => setUserProfile({...userProfile, category: e.target.value})}
                                                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-lg px-4 py-3 text-lg font-black text-gray-700 focus:border-[#00529B] focus:bg-white outline-none transition-all"
                                                >
                                                    {categories.map(cat => (
                                                        <option key={cat} value={cat}>{cat}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Other Details</label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:border-[#00529B] transition-all group">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={userProfile.isKannadaMedium}
                                                        onChange={(e) => setUserProfile({...userProfile, isKannadaMedium: e.target.checked})}
                                                        className="w-5 h-5 accent-[#00529B]"
                                                    />
                                                    <span className="text-[11px] font-bold text-gray-700">Kannada Medium</span>
                                                </label>
                                                <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 cursor-pointer hover:border-[#00529B] transition-all group">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={userProfile.isRural}
                                                        onChange={(e) => setUserProfile({...userProfile, isRural: e.target.checked})}
                                                        className="w-5 h-5 accent-[#00529B]"
                                                    />
                                                    <span className="text-[11px] font-bold text-gray-700">Rural Candidate</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button 
                                                type="submit"
                                                className="w-full bg-[#00529B] hover:bg-[#00407A] text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-4"
                                            >
                                                Proceed to Option Entry
                                                <ChevronDown className="w-5 h-5 -rotate-90" />
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {step === 'entry' && (
                            <div className="space-y-8 pb-32">
                                {/* Round & Seat Status Banner */}
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border-2 border-gray-100 p-6 rounded-3xl shadow-sm">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shadow-inner">
                                            <Zap className="w-8 h-8 text-[#00529B]" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Round {globalConfig.currentRound} Option Entry</h2>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Counseling Phase :: Live</p>
                                        </div>
                                    </div>
                                    
                                    {previousAllotment && (
                                        <div className="bg-emerald-50 border-2 border-emerald-100 px-6 py-4 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
                                            <div className="p-2 bg-emerald-500 rounded-lg text-white">
                                                <ShieldCheck className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Seat Held from Round {submittedRound}</p>
                                                <p className="text-sm font-black text-emerald-900">{previousAllotment.collegeName}</p>
                                                <p className="text-[9px] font-bold text-emerald-600 uppercase">{previousAllotment.branchName}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="w-full flex gap-1"
                                >
                                    {/* --- LEFT SIDE: OPTION ENTRY (70%) --- */}
                                    <div className="w-[70%] border border-gray-200 shadow-sm flex flex-col bg-white">
                                        {/* Header Tab */}
                                        <div className="bg-[#4FC3F7] text-white px-4 py-2 text-xs font-bold shadow-sm">
                                            Option Entry
                                        </div>

                                        {/* Filters Panel */}
                                        <div className="p-4 bg-[#F8F9FA] border-b border-gray-200 space-y-4">
                                            {/* IMPORTANT NOTE */}
                                            <div className="bg-[#FFF9C4] border-2 border-[#FBC02D] p-3 rounded flex items-center gap-3">
                                                <div className="bg-[#D32F2F] text-white text-[9px] font-black px-2 py-0.5 rounded shadow-sm shrink-0">
                                                    IMPORTANT
                                                </div>
                                                <p className="text-[10px] font-black text-[#37474F] leading-relaxed">
                                                    For a more efficient and faster option entry experience, we highly recommend selecting the <span className="text-[#D32F2F] underline underline-offset-2">"College"</span> filter below. This will allow you to see and prioritize all branches available within a single institution at once.
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="flex items-center gap-2">
                                                    <label className="text-[10px] font-bold text-gray-500">Select Discipline:</label>
                                                    <select className="border border-gray-300 rounded px-2 py-1 text-[10px] font-bold text-gray-700 outline-none w-48">
                                                        <option>Engineering</option>
                                                    </select>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <label className="text-[10px] font-bold text-gray-500">Filter by:</label>
                                                    <select className="border border-gray-300 rounded px-2 py-1 text-[10px] font-bold text-gray-700 outline-none w-48">
                                                        <option>Select</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[10px] font-bold text-gray-500">Select Stream:</span>
                                                    <div className="flex items-center gap-4">
                                                        <label className="flex items-center gap-1.5 text-[10px] font-bold cursor-pointer">
                                                            <input 
                                                                type="radio" 
                                                                name="stream" 
                                                                checked={selectedStream === 'course'} 
                                                                onChange={() => setSelectedStream('course')}
                                                                className="accent-[#00529B]" 
                                                            /> Course
                                                        </label>
                                                        <label className="flex items-center gap-1.5 text-[10px] font-bold cursor-pointer">
                                                            <input 
                                                                type="radio" 
                                                                name="stream" 
                                                                checked={selectedStream === 'college'} 
                                                                onChange={() => setSelectedStream('college')}
                                                                className="accent-[#00529B]" 
                                                            /> College
                                                        </label>
                                                    </div>
                                                </div>
                                                    <select 
                                                        value={selectedStream === 'course' ? selectedBranch : selectedCollege}
                                                        onChange={(e) => selectedStream === 'course' ? setSelectedBranch(e.target.value) : setSelectedCollege(e.target.value)}
                                                        className="flex-1 border border-gray-300 rounded px-2 py-1 text-[10px] font-bold text-gray-700 outline-none"
                                                    >
                                                        {selectedStream === 'course' ? (
                                                            representativeBranches.map((rb) => (
                                                                <option key={rb.code} value={rb.code}>
                                                                    {rb.code} - {rb.name}
                                                                </option>
                                                            ))
                                                        ) : (
                                                            colleges.map((c: any) => (
                                                                <option key={c.college_id} value={c.college_id}>
                                                                    {c.college_id} - {c.name}
                                                                </option>
                                                            ))
                                                        )}
                                                    </select>
                                            </div>
                                        </div>

                                        {/* Table Header */}
                                        <div className="bg-[#D8EDF9] border-b border-gray-300 flex text-[10px] font-black text-[#00529B] uppercase px-4 py-2">
                                            <div className="w-12 text-center">Sl.No.</div>
                                            <div className="flex-1 px-4">College Course</div>
                                            <div className="w-48 text-center">Course Fees per Annum (Rs)</div>
                                            <div className="w-20 text-center">Option No</div>
                                        </div>

                                        {/* List Items */}
                                        <div className="flex-1 overflow-y-auto max-h-[600px] divide-y divide-gray-100 bg-gray-50/20">
                                            {(() => {
                                                let filteredRows: any[] = [];
                                                
                                                if (selectedStream === 'course') {
                                                    const aliases = getRawBranchIds(selectedBranch);
                                                    const matchingColleges = colleges.filter((c: any) => 
                                                        c.kcet_cutoffs.some((cut: any) => aliases.includes(cut.branch_id) || cut.branch_id.startsWith(selectedBranch))
                                                    ).slice(0, 100); 
                                                    
                                                    const repBranch = representativeBranches.find(rb => rb.code === selectedBranch);
                                                    
                                                    filteredRows = matchingColleges.map((c: any) => ({
                                                        college: c,
                                                        branch: repBranch || { code: selectedBranch, name: selectedBranch },
                                                        courseCode: c.kcet_cutoffs.find((cut: any) => aliases.includes(cut.branch_id) || cut.branch_id.startsWith(selectedBranch))?.branch_id || ''
                                                    }));
                                                } else {
                                                    const targetColId = selectedCollege || colleges[0]?.college_id;
                                                    const col = colleges.find((c: any) => c.college_id === targetColId);
                                                    
                                                    if (col) {
                                                        // Get all unique branch IDs available in this college
                                                        const rawBranchIds = Array.from(new Set(col.kcet_cutoffs.map((cut: any) => cut.branch_id))) as string[];
                                                        
                                                        filteredRows = rawBranchIds.map(id => {
                                                            // Priority finding: 1. Exact/Alias, 2. Partial prefix (with caution)
                                                            let rep = representativeBranches.find(rb => id === rb.code || getRawBranchIds(rb.code).includes(id));
                                                            
                                                            // Fallback to prefix if no direct match, but avoid greedy 'BT' matches for B.Tech
                                                            if (!rep && !id.startsWith('BTCS') && !id.startsWith('BTE')) {
                                                                rep = representativeBranches.find(rb => id.startsWith(rb.code));
                                                            }
                                                            
                                                            // Prefer the raw name from the dataset if available for accuracy
                                                            const branchData = allBranches.find((b: any) => (b.branch_code || b.branch_id) === id);
                                                            const displayName = branchData?.branch_name || (rep ? rep.name : id);

                                                            return {
                                                                college: col,
                                                                branch: {
                                                                    code: rep?.code || id,
                                                                    name: displayName
                                                                },
                                                                courseCode: id
                                                            };
                                                        });
                                                    }
                                                }

                                                if (filteredRows.length === 0) {
                                                    return (
                                                        <div className="p-20 text-center text-gray-400 font-medium italic">
                                                            No data found for the selected criteria.
                                                        </div>
                                                    );
                                                }

                                                return filteredRows.map((row, i) => {
                                                    const bCode = row.branch.code || row.branch.branch_code || row.branch.branch_id;
                                                    const bName = row.branch.name || row.branch.branch_name || bCode;
                                                    const key = `${row.college.college_id}:::${bCode}`;
                                                    
                                                    return (
                                                        <div key={key} className="p-4 bg-white hover:bg-blue-50/50 transition-colors border-l-4 border-transparent hover:border-blue-400">
                                                            <div className="flex items-start">
                                                                <div className="w-12 text-center text-[11px] font-black text-gray-300 pt-6">{i + 1}</div>
                                                                <div className="flex-1 px-4 space-y-3">
                                                                    <div className="text-[11px] font-black text-[#00529B] border-b border-gray-100 pb-1 uppercase tracking-tight">
                                                                        {row.college.college_id} - {row.college.name}
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex flex-col gap-1">
                                                                            <div className="text-[11px] font-black text-gray-700 flex items-center gap-3">
                                                                                <span className="text-gray-400 font-bold bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 min-w-[24px] text-center">
                                                                                    {row.courseCode}
                                                                                </span>
                                                                                <span className="border-b-2 border-rose-400 uppercase tracking-tight">
                                                                                    {bCode} - {bName}
                                                                                </span>
                                                                            </div>
                                                                            <div className="text-[9px] font-bold text-emerald-600 italic">
                                                                                {row.college.fees || 'Fees shall be updated'} - as per current data
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="w-20 flex flex-col items-center gap-1 pt-4">
                                                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Priority</span>
                                                                    <input 
                                                                        type="text" 
                                                                        value={options[key] || ''}
                                                                        onChange={(e) => handlePriorityChange(row.college.college_id, bCode, e.target.value)}
                                                                        className="w-12 h-10 border-2 border-blue-100 rounded-lg bg-blue-50/30 text-center text-sm font-black text-[#00529B] focus:border-[#00529B] focus:bg-white outline-none shadow-inner transition-all"
                                                                        placeholder=""
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                });
                                            })()}
                                        </div>

                                        {/* Footer Action */}
                                        <div className="p-6 bg-white border-t border-gray-200 text-center space-y-4">
                                            <button 
                                                onClick={handleFinalSubmit}
                                                disabled={isSubmitting}
                                                className="bg-[#4FC3F7] hover:bg-[#29B6F6] text-white px-12 py-2.5 rounded font-bold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-3 mx-auto"
                                            >
                                                {isSubmitting ? 'Verifying Choices...' : 'Save & Submit'}
                                            </button>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-rose-500 font-bold">Please click on the Save and Submit button every 2 minutes to save your options</p>
                                                <p className="text-[9px] text-[#A52A2A] font-bold">NOTE: N/A-Fees shall be updated shortly</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* --- RIGHT SIDE: SELECTED OPTIONS (30%) --- */}
                                     <div className="w-[30%] border border-gray-200 shadow-sm flex flex-col bg-white">
                                        <div className="bg-[#1B703F] text-white px-4 py-2 text-xs font-bold shadow-sm">
                                            Selected Options
                                        </div>
                                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50/30">
                                            {selectedOptions.length === 0 ? (
                                                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                                        <ShieldCheck className="w-8 h-8 text-emerald-500" />
                                                    </div>
                                                    <h4 className="text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Priority List</h4>
                                                    <p className="text-[10px] text-gray-400">Your selected options will appear here once you enter priority numbers on the left.</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
                                                        <span className="text-[10px] font-black text-gray-500 uppercase">Selected Options</span>
                                                        <span className="bg-[#1B703F] text-white text-[9px] font-black px-1.5 py-0.5 rounded">{selectedOptions.length}</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {selectedOptions.map((opt) => (
                                                            <div key={`${opt.collegeId}-${opt.branchId}`} className="bg-white border border-gray-200 rounded p-2 shadow-sm flex gap-3 items-start hover:border-emerald-200 transition-colors">
                                                                <div className="bg-[#1B703F] text-white text-[10px] font-black w-6 h-6 rounded flex items-center justify-center shrink-0">
                                                                    {opt.priority}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="text-[9px] font-black text-[#00529B] uppercase truncate">{opt.collegeId} - {opt.collegeName}</div>
                                                                    <div className="text-[8px] font-bold text-gray-600 uppercase truncate">{opt.branchId} - {opt.branchName}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {step === 'courses' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-6xl mx-auto space-y-8"
                            >
                                <div className="text-center">
                                    <h2 className="text-[#00529B] text-3xl font-bold">Engineering Course List</h2>
                                </div>

                                <div className="border border-gray-200 shadow-sm bg-white overflow-hidden">
                                    {/* Category Header */}
                                    <div className="bg-[#E9D8E2] px-6 py-2 border-b border-gray-200">
                                        <span className="text-[11px] font-black text-gray-700 uppercase tracking-widest">Engineering</span>
                                    </div>

                                    {/* 3-Column Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                                        {/* Column 1 */}
                                        <div className="flex flex-col">
                                            {[
                                                { code: 'CSE', name: 'COMPUTER SCIENCE & ENGG' },
                                                { code: 'ISE', name: 'INFORMATION SCIENCE & ENGG' },
                                                { code: 'ECE', name: 'ELECTRONICS & COMMUNICATION ENGG' },
                                                { code: 'AIML', name: 'AI & MACHINE LEARNING' },
                                                { code: 'AIDS', name: 'AI & DATA SCIENCE' },
                                                { code: 'EEE', name: 'ELECTRICAL & ELECTRONICS ENGG' },
                                                { code: 'MECH', name: 'MECHANICAL ENGG' }
                                            ].map((course, idx) => (
                                                <div key={idx} className="px-4 py-2 hover:bg-gray-50 flex gap-2 border-b border-gray-100 last:border-0">
                                                    <span className="text-[10px] font-black text-[#00529B] shrink-0">{course.code} -</span>
                                                    <span className="text-[10px] font-bold text-gray-600 leading-tight uppercase">{course.name}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Column 2 */}
                                        <div className="flex flex-col">
                                            {[
                                                { code: 'CIVIL', name: 'CIVIL ENGG' },
                                                { code: 'BT', name: 'BIO-TECHNOLOGY' },
                                                { code: 'CHEM', name: 'CHEMICAL ENGINEERING' },
                                                { code: 'CYBER', name: 'CYBER SECURITY ENGG' },
                                                { code: 'DS', name: 'DATA SCIENCES' },
                                                { code: 'EIE', name: 'ELECTRONICS & INSTRUMENTATION ENGG' },
                                                { code: 'ETE', name: 'ELECTRONICS & TELECOMMUNICATION ENGG' }
                                            ].map((course, idx) => (
                                                <div key={idx} className="px-4 py-2 hover:bg-gray-50 flex gap-2 border-b border-gray-100 last:border-0">
                                                    <span className="text-[10px] font-black text-[#00529B] shrink-0">{course.code} -</span>
                                                    <span className="text-[10px] font-bold text-gray-600 leading-tight uppercase">{course.name}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Column 3 */}
                                        <div className="flex flex-col">
                                            {[
                                                { code: 'AERO', name: 'AERONAUTICAL ENGINEERING' },
                                                { code: 'ASE', name: 'AEROSPACE ENGINEERING' },
                                                { code: 'AUTO', name: 'AUTOMOBILE ENGINEERING' },
                                                { code: 'IEM', name: 'INDUSTRIAL ENGG & MANAGEMENT' },
                                                { code: 'RAI', name: 'ROBOTICS & ARTIFICIAL INTELLIGENCE' },
                                                { code: 'TT', name: 'TEXTILES TECHNOLOGY' }
                                            ].map((course, idx) => (
                                                <div key={idx} className="px-4 py-2 hover:bg-gray-50 flex gap-2 border-b border-gray-100 last:border-0">
                                                    <span className="text-[10px] font-black text-[#00529B] shrink-0">{course.code} -</span>
                                                    <span className="text-[10px] font-bold text-gray-600 leading-tight uppercase">{course.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button 
                                        onClick={() => setStep('entry')}
                                        className="text-[#00529B] text-xs font-bold underline hover:no-underline"
                                    >
                                        Return to Option Entry
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'colleges' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-7xl mx-auto space-y-4"
                            >
                                <div className="text-center space-y-2">
                                    <h2 className="text-[#00529B] text-2xl font-bold">Engineering College List</h2>
                                    <p className="text-[#6B2D8C] text-[10px] font-bold">
                                        Type = G-Government, A-Private Aided, B-Private Unaided, C-Deemed University, M-Minority (L,R)
                                    </p>
                                </div>

                                <div className="border border-gray-200 shadow-sm bg-white overflow-hidden flex flex-col max-h-[70vh]">
                                    <div className="overflow-y-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead className="bg-[#E9D8E2] border-b border-gray-300 sticky top-0 z-10">
                                                <tr className="text-[10px] font-black text-gray-700 uppercase">
                                                    <th className="p-3 border-r border-gray-200 w-12 text-center">S/N</th>
                                                    <th className="p-3 border-r border-gray-200 w-12 text-center">Type</th>
                                                    <th className="p-3 border-r border-gray-200 w-16">Code</th>
                                                    <th className="p-3 border-r border-gray-200">College Name</th>
                                                    <th className="p-3 text-center">Courses</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {require('@/lib/data/colleges_unified.json').colleges
                                                    .map((college: any, idx: number) => {
                                                        const type = idx % 5 === 0 ? 'G' : idx % 5 === 1 ? 'A' : idx % 5 === 2 ? 'B' : idx % 5 === 3 ? 'C' : 'M';
                                                        const mockCourses = ['AD', 'CE', 'CS', 'EC', 'EE', 'IE', 'ME'];
                                                        return (
                                                            <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#F8F9FA]"}>
                                                                <td className="p-3 border-r border-gray-200 text-center text-[11px] font-bold text-gray-400">{idx + 1}</td>
                                                                <td className="p-3 border-r border-gray-200 text-center text-[11px] font-black text-gray-600">{type}</td>
                                                                <td className="p-3 border-r border-gray-200 text-[11px] font-black text-[#00529B]">{college.college_id}</td>
                                                                <td className="p-3 border-r border-gray-200 text-[11px] font-bold text-gray-700 uppercase">{college.name}</td>
                                                                <td className="p-3">
                                                                    <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                                                                        {mockCourses.slice(0, 4 + (idx % 4)).map((c, i) => (
                                                                            <span key={i} className="text-[10px] font-black text-gray-600 border-b border-rose-400">
                                                                                {c}{i < 3 + (idx % 4) ? ',' : ''}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button 
                                        onClick={() => setStep('entry')}
                                        className="text-[#00529B] text-xs font-bold underline hover:no-underline"
                                    >
                                        Return to Option Entry
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 'submitted' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-4xl mx-auto space-y-8 py-10"
                            >
                                <div className="bg-white border-2 border-[#1B703F] rounded-xl overflow-hidden shadow-2xl">
                                    <div className="bg-[#1B703F] text-white p-8 text-center space-y-2">
                                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <ShieldCheck className="w-12 h-12 text-white" />
                                        </div>
                                        <h2 className="text-3xl font-black uppercase tracking-wider">Choices Locked Successfully</h2>
                                        <p className="text-emerald-100 font-medium">Your option entry has been verified and stored in the KEA database.</p>
                                    </div>

                                    <div className="p-8 space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-4">
                                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                    <FileText className="w-4 h-4" />
                                                    Official Documents
                                                </h3>
                                                <p className="text-[11px] text-gray-600 leading-relaxed font-bold">
                                                    Please download and print your Choice Entry Report for future reference during document verification.
                                                </p>
                                                <button 
                                                    onClick={handleDownloadReport}
                                                    className="w-full bg-[#00529B] hover:bg-[#00407A] text-white px-6 py-3 rounded font-black text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-3"
                                                >
                                                    Download Choice Report (PDF)
                                                </button>
                                            </div>

                                            <div className="bg-[#FFF9C4] p-6 rounded-lg border border-[#FBC02D] space-y-4">
                                                <h3 className="text-xs font-black text-[#F57F17] uppercase tracking-widest flex items-center gap-2">
                                                    <AlertTriangle className="w-4 h-4" />
                                                    Allotment Status
                                                </h3>
                                                <div className="space-y-1">
                                                    <p className="text-[11px] font-black text-gray-800">MOCK ALLOTMENT DATE:</p>
                                                    <p className="text-sm font-black text-[#B71C1C]">
                                                        {new Date(globalConfig.resultsReleaseDate).toLocaleDateString('en-IN', {
                                                            day: '2-digit',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        }).toUpperCase()} - {new Date(globalConfig.resultsReleaseDate).toLocaleTimeString('en-IN', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                                <div className="pt-2">
                                                    <button 
                                                        onClick={handleCheckAllotment}
                                                        className="w-full bg-[#1B703F] hover:bg-[#14532D] text-white px-6 py-3 rounded font-black text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-3"
                                                    >
                                                        Check Mock Allotment
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-100 pt-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-xs font-black text-gray-500 uppercase">Submission Summary</span>
                                                <span className="text-[10px] font-bold text-gray-400 italic">Choices count: {selectedOptions.length}</span>
                                            </div>
                                            <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                                {selectedOptions.map((opt) => (
                                                    <div key={`${opt.collegeId}:::${opt.branchId}`} className="bg-gray-50 border border-gray-100 p-3 rounded flex items-center gap-4">
                                                        <span className="w-8 h-8 bg-[#00529B] text-white text-xs font-black rounded flex items-center justify-center shrink-0">{opt.priority}</span>
                                                        <div className="min-w-0">
                                                            <div className="text-[10px] font-black text-[#00529B] uppercase truncate">{opt.collegeName}</div>
                                                            <div className="text-[9px] font-bold text-gray-500 uppercase">{opt.branchId} - {opt.branchName}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 'allotted' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-4xl mx-auto py-10"
                            >
                                <div className="bg-white border-2 border-gray-200 rounded shadow-2xl overflow-hidden">
                                    <div className="bg-[#D8EDF9] border-b border-gray-200 p-8 text-center relative">
                                        <div className="absolute top-4 left-4 opacity-10">
                                            <KEALogo className="h-24 w-auto" />
                                        </div>
                                        {/* Allotment Title */}
                                        <div className="text-center space-y-2">
                                            <div className="inline-block px-4 py-1 bg-blue-50 text-[#00529B] rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                                {globalConfig.currentRound === 3 ? "Final Allotment Order" : `Round ${globalConfig.currentRound} Allotment Results`}
                                            </div>
                                            <h2 className="text-4xl font-black text-gray-800 uppercase tracking-tight">
                                                {mockAllotment ? "Seat Allotted Successfully" : "No Seat Allotted"}
                                            </h2>
                                            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                                                Counseling Phase :: {globalConfig.currentRound === 3 ? "Termination Round" : "Upgrade Round"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-10">
                                        {mockAllotment ? (
                                            <div className="space-y-8">
                                                {/* Previous vs New Comparison (If applicable) */}
                                                {previousAllotment && mockAllotment && previousAllotment.collegeId !== mockAllotment.collegeId && (
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 opacity-60 grayscale scale-95 origin-left">
                                                            <p className="text-[9px] font-black text-gray-400 uppercase mb-2">Previous Allotment (Held)</p>
                                                            <p className="text-xs font-black text-gray-700">{previousAllotment.collegeName}</p>
                                                            <p className="text-[8px] font-bold text-gray-400">{previousAllotment.branchId}</p>
                                                        </div>
                                                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 relative overflow-hidden">
                                                            <div className="absolute -right-2 -top-2 p-2 bg-blue-500 text-white rounded-full">
                                                                <Zap className="w-3 h-3" />
                                                            </div>
                                                            <p className="text-[9px] font-black text-blue-500 uppercase mb-2">New Upgraded Allotment</p>
                                                            <p className="text-xs font-black text-blue-900">{mockAllotment.collegeName}</p>
                                                            <p className="text-[8px] font-bold text-blue-600">{mockAllotment.branchId}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex flex-col items-center text-center space-y-4">
                                                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center shadow-inner">
                                                        <ShieldCheck className="w-8 h-8 text-emerald-600" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h3 className="text-2xl font-black text-gray-800 uppercase leading-tight">
                                                            {mockAllotment.collegeName}
                                                        </h3>
                                                        <p className="text-base font-bold text-[#00529B] uppercase tracking-wide">
                                                            {mockAllotment.branchId} - {mockAllotment.branchName}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                                    <div className="border-2 border-gray-100 p-4 rounded-xl bg-gray-50/50">
                                                        <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">Choice No</span>
                                                        <span className="text-xl font-black text-gray-800">{mockAllotment.choiceNo}</span>
                                                    </div>
                                                    <div className="border-2 border-gray-100 p-4 rounded-xl bg-gray-50/50">
                                                        <span className="text-[9px] font-black text-gray-400 uppercase block mb-1">College Code</span>
                                                        <span className="text-xl font-black text-[#00529B]">{mockAllotment.collegeId}</span>
                                                    </div>
                                                    <div className="border-2 border-emerald-100 p-4 rounded-xl bg-[#E8F5E9]/50">
                                                        <span className="text-[9px] font-black text-emerald-600 uppercase block mb-1">Cutoff Rank</span>
                                                        <span className="text-xl font-black text-emerald-800">{mockAllotment.cutoffRank?.toLocaleString()}</span>
                                                    </div>
                                                    <div className="border-2 border-gray-100 p-4 rounded-xl bg-[#FFF9C4]/30">
                                                        <span className="text-[9px] font-black text-amber-600 uppercase block mb-1">Fees Allotted</span>
                                                        <span className="text-lg font-black text-amber-800 tracking-tighter">{mockAllotment.collegeFees}</span>
                                                    </div>
                                                    <div className="border-2 border-blue-100 p-4 rounded-xl bg-blue-50/50">
                                                        <span className="text-[9px] font-black text-blue-600 uppercase block mb-1">Your Rank</span>
                                                        <span className="text-xl font-black text-blue-800">{userProfile.rank}</span>
                                                    </div>
                                                    <div className="border-2 border-rose-100 p-4 rounded-xl bg-rose-50/50">
                                                        <span className="text-[9px] font-black text-rose-600 uppercase block mb-1">Category</span>
                                                        <span className="text-xl font-black text-rose-800">{userProfile.category}</span>
                                                    </div>
                                                </div>

                                                <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl space-y-4 shadow-sm">
                                                    <div className="flex items-start gap-4">
                                                        <AlertTriangle className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                                                        <div className="space-y-1">
                                                            <p className="text-xs font-black text-blue-900 uppercase">Choice Selection Required</p>
                                                            <p className="text-[10px] font-bold text-blue-700 leading-relaxed italic">
                                                                Choose one of the four options below to proceed. Your decision here is final for Round 1.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                                                        {choiceDescriptions.map((choice) => (
                                                            <button
                                                                key={choice.id}
                                                                disabled={choiceSubmitted}
                                                                onClick={() => setSelectedChoice(choice.id)}
                                                                className={`p-3 rounded-xl border-2 transition-all text-left space-y-1.5 relative overflow-hidden group ${
                                                                    selectedChoice === choice.id 
                                                                    ? `border-${choice.color}-500 bg-${choice.color}-50/50 shadow-md` 
                                                                    : 'border-gray-100 bg-white hover:border-blue-200'
                                                                } ${choiceSubmitted && selectedChoice !== choice.id ? 'opacity-40' : ''}`}
                                                            >
                                                                {selectedChoice === choice.id && (
                                                                    <div className={`absolute top-0 right-0 p-1.5 bg-${choice.color}-500 text-white rounded-bl-lg`}>
                                                                        <CheckCircle className="w-2.5 h-2.5" />
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center justify-between">
                                                                    <span className={`text-[8px] font-black uppercase tracking-widest ${selectedChoice === choice.id ? `text-${choice.color}-700` : 'text-gray-400'}`}>
                                                                        Choice {choice.id}
                                                                    </span>
                                                                    <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase bg-${choice.color}-100 text-${choice.color}-700`}>
                                                                        {choice.badge}
                                                                    </span>
                                                                </div>
                                                                <h4 className="text-[11px] font-black text-gray-800 leading-tight">{choice.title}</h4>
                                                                <p className="text-[8px] font-bold text-gray-500 leading-normal">{choice.desc}</p>
                                                            </button>
                                                        ))}
                                                    </div>

                                                    {!choiceSubmitted ? (
                                                        <div className="flex gap-4 pt-4">
                                                            <button 
                                                                onClick={() => setStep('entry')}
                                                                className="px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest text-gray-400 hover:bg-gray-100 transition-all"
                                                            >
                                                                Modify Options
                                                            </button>
                                                            <button 
                                                                onClick={handleSubmitChoice}
                                                                className="flex-1 bg-[#00529B] text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-[#00407A] transition-all flex items-center justify-center gap-3"
                                                            >
                                                                Submit & Process Choice
                                                                <ChevronDown className="w-4 h-4 -rotate-90" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <motion.div 
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            className="bg-white border-2 border-emerald-500 rounded-xl p-6 text-center space-y-4 shadow-xl"
                                                        >
                                                            <div className="flex items-center justify-center gap-3 text-emerald-600">
                                                                <ShieldCheck className="w-6 h-6" />
                                                                <span className="text-sm font-black uppercase">Choice {selectedChoice} Registered Successfully</span>
                                                            </div>
                                                            <div className="space-y-4">
                                                                {selectedChoice === 1 && (
                                                                    <div className="space-y-4">
                                                                        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                                                            <h4 className="text-sm font-black text-emerald-900 uppercase">Counseling Successfully Completed</h4>
                                                                            <p className="text-[10px] font-bold text-emerald-600">You have secured admission to {mockAllotment.collegeName}.</p>
                                                                        </div>
                                                                        <p className="text-xs font-bold text-gray-600">Please pay the fees of ₹{mockAllotment.collegeFees} to download your Final Admission Order.</p>
                                                                        <button className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-black text-xs uppercase tracking-widest w-full shadow-lg">Pay Fees & Download Final Order</button>
                                                                    </div>
                                                                )}
                                                                {selectedChoice === 2 && (
                                                                    <div className="space-y-4">
                                                                        <p className="text-xs font-bold text-gray-600">
                                                                            {globalConfig.currentRound === 3 
                                                                                ? "You have chosen to retain this seat in the Final Round." 
                                                                                : `Seat Locked. You are now entered into Round ${globalConfig.currentRound + 1} for higher preference options.`
                                                                            }
                                                                        </p>
                                                                        {globalConfig.currentRound < 3 && globalConfig.currentRound >= submittedRound ? (
                                                                             <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 space-y-2">
                                                                                <p className="text-[10px] font-black text-blue-800 uppercase tracking-[0.2em]">Next Phase Activation</p>
                                                                                <p className="text-sm font-black text-[#00529B]">
                                                                                    {new Date(globalConfig.nextRoundStartDate).toLocaleDateString('en-IN', {
                                                                                        day: '2-digit',
                                                                                        month: 'long',
                                                                                        year: 'numeric'
                                                                                    }).toUpperCase()} - {new Date(globalConfig.nextRoundStartDate).toLocaleTimeString('en-IN', {
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit'
                                                                                    })}
                                                                                </p>
                                                                                <p className="text-[9px] font-bold text-blue-600/70 uppercase">Round {globalConfig.currentRound + 1} Option Entry Schedule</p>
                                                                            </div>
                                                                        ) : globalConfig.currentRound === 3 ? (
                                                                            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                                                                                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Counseling Concluded :: Final Seat Retained</p>
                                                                            </div>
                                                                        ) : (
                                                                            <button 
                                                                                onClick={() => {
                                                                                    setChoiceSubmitted(false);
                                                                                    setSelectedChoice(null);
                                                                                    setStep('entry');
                                                                                }}
                                                                                className="bg-[#00529B] text-white px-8 py-3 rounded-lg font-black text-xs uppercase tracking-widest w-full shadow-lg animate-bounce"
                                                                            >
                                                                                Start Round {globalConfig.currentRound + 1} Option Entry
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {selectedChoice === 3 && (
                                                                    <div className="space-y-4">
                                                                        <p className="text-xs font-bold text-gray-600">You have rejected the current seat. You are now eligible for Round {globalConfig.currentRound + 1}.</p>
                                                                        {globalConfig.currentRound < 3 && globalConfig.currentRound >= submittedRound ? (
                                                                             <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 space-y-2">
                                                                                <p className="text-[10px] font-black text-amber-800 uppercase tracking-[0.2em]">Next Phase Activation</p>
                                                                                <p className="text-sm font-black text-[#B71C1C]">
                                                                                    {new Date(globalConfig.nextRoundStartDate).toLocaleDateString('en-IN', {
                                                                                        day: '2-digit',
                                                                                        month: 'long',
                                                                                        year: 'numeric'
                                                                                    }).toUpperCase()} - {new Date(globalConfig.nextRoundStartDate).toLocaleTimeString('en-IN', {
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit'
                                                                                    })}
                                                                                </p>
                                                                                <p className="text-[9px] font-bold text-amber-600/70 uppercase">Round {globalConfig.currentRound + 1} Option Entry Schedule</p>
                                                                            </div>
                                                                        ) : globalConfig.currentRound === 3 ? (
                                                                            <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                                                                                <p className="text-[10px] font-black text-rose-800 uppercase tracking-widest">Counseling Concluded :: Final Round (No Allotment Held)</p>
                                                                            </div>
                                                                        ) : (
                                                                            <button 
                                                                                onClick={() => {
                                                                                    setChoiceSubmitted(false);
                                                                                    setSelectedChoice(null);
                                                                                    setStep('entry');
                                                                                }}
                                                                                className="bg-[#00529B] text-white px-8 py-3 rounded-lg font-black text-xs uppercase tracking-widest w-full shadow-lg animate-bounce"
                                                                            >
                                                                                Start Round {globalConfig.currentRound + 1} Option Entry
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>

                                                <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                                                        <Monitor className="w-6 h-6 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-amber-900 uppercase">Expert Strategy Tip</p>
                                                        <p className="text-[9px] font-bold text-amber-800 leading-relaxed">
                                                            {selectedChoice === 2 ? `Great move! Round ${globalConfig.currentRound + 1} often sees significant movement. Keep an eye on the vacancy list.` : "Remember: Most students improve their seats in Round 2 by choosing Option 2."}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-20 space-y-8">
                                                <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto border-2 border-rose-100 shadow-inner">
                                                    <X className="w-12 h-12 text-rose-500" />
                                                </div>
                                                <div className="space-y-3">
                                                    <h3 className="text-3xl font-black text-gray-800 uppercase tracking-tight">No Seat Allotted</h3>
                                                    <p className="text-gray-500 font-medium max-w-md mx-auto text-sm leading-relaxed">
                                                        Based on your rank <span className="font-black text-[#B71C1C]">{userProfile.rank}</span> and category <span className="font-black text-[#B71C1C]">{userProfile.category}</span>, 
                                                        no seat could be allotted from your selected options in the first mock round.
                                                    </p>
                                                </div>
                                                <div className="pt-6">
                                                    <button 
                                                        onClick={() => setStep('entry')}
                                                        className="bg-[#00529B] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-[#00407A] transition-all active:scale-95 inline-flex items-center gap-4"
                                                    >
                                                        Add More Options
                                                        <Monitor className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl max-w-lg mx-auto">
                                                    <p className="text-[10px] font-bold text-amber-800 leading-relaxed uppercase tracking-widest">
                                                        Pro Tip: Try adding more colleges with higher closing ranks (Tiers 2 and 3) to ensure a seat in the next round.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        {step === 'waiting' && (
                            <motion.div
                                key="waiting-screen"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="max-w-2xl mx-auto py-20 text-center space-y-10"
                            >
                                <div className="relative">
                                    <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center mx-auto animate-pulse border-4 border-white shadow-xl">
                                        <Monitor className="w-16 h-16 text-[#00529B]" />
                                    </div>
                                    <div className="absolute top-0 right-1/4 bg-amber-500 text-white p-2 rounded-full shadow-lg">
                                        <Clock className="w-5 h-5 animate-spin-slow" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-4xl font-black text-gray-800 uppercase tracking-tight">Round {globalConfig.currentRound} Results Pending</h2>
                                    <p className="text-gray-500 font-medium max-w-md mx-auto text-sm leading-relaxed">
                                        Your option entries have been successfully locked. The provisional allotment for Round {globalConfig.currentRound} is currently under process.
                                    </p>
                                </div>
                                <div className="bg-white border-2 border-gray-100 p-8 rounded-3xl shadow-xl space-y-6 max-w-md mx-auto">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Expected Release Date</p>
                                        <p className="text-2xl font-black text-[#00529B]">
                                            {new Date(globalConfig.resultsReleaseDate).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className="h-px bg-gray-100 w-full" />
                                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed">
                                        You will be notified via email once the allotment order is ready for download.
                                    </p>
                                </div>
                                <div className="pt-6">
                                    <button 
                                        onClick={() => setStep('entry')}
                                        className="text-[#00529B] font-black text-xs uppercase tracking-widest hover:underline"
                                    >
                                        Review My Options
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* --- Submission Confirmation Modal --- */}
                    <AnimatePresence>
                        {showSubmitConfirm && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowSubmitConfirm(false)}
                                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                />
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
                                >
                                    <div className="bg-[#00529B] p-8 text-white text-center space-y-2">
                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                            <ShieldCheck className="w-8 h-8 text-white" />
                                        </div>
                                        <h2 className="text-2xl font-black uppercase tracking-tight">Final Submission</h2>
                                        <p className="text-blue-100 text-[11px] font-bold">Review your choices before locking them in the database.</p>
                                    </div>

                                    <div className="p-8 space-y-8">
                                        <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl space-y-3">
                                            <div className="flex items-center gap-3 text-amber-800">
                                                <FileText className="w-5 h-5" />
                                                <span className="text-xs font-black uppercase tracking-widest">Pre-Submission Report</span>
                                            </div>
                                            <p className="text-[11px] text-amber-700 font-bold leading-relaxed">
                                                It is highly recommended to download and verify your options list one last time before final submission.
                                            </p>
                                            <button 
                                                onClick={handleDownloadReport}
                                                className="w-full bg-white border-2 border-amber-200 text-amber-700 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-100 transition-all shadow-sm"
                                            >
                                                Download Choice List (PDF)
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between px-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Choices</span>
                                                <span className="text-[10px] font-black text-[#00529B] bg-blue-50 px-2 py-0.5 rounded">{selectedOptions.length} Items</span>
                                            </div>
                                            <div className="max-h-40 overflow-y-auto border border-gray-100 rounded-xl bg-gray-50/50 p-2 custom-scrollbar space-y-1">
                                                {selectedOptions.map(opt => (
                                                    <div key={`${opt.collegeId}:::${opt.branchId}`} className="text-[9px] font-bold text-gray-600 flex gap-3 p-2 bg-white rounded border border-gray-100/50">
                                                        <span className="text-[#00529B] font-black">{opt.priority}</span>
                                                        <span className="truncate">{opt.collegeName} - {opt.branchId}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-2">
                                            <button 
                                                onClick={() => setShowSubmitConfirm(false)}
                                                className="flex-1 px-6 py-4 rounded-xl font-black text-xs uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all"
                                            >
                                                Go Back
                                            </button>
                                            <button 
                                                onClick={handleFinalConfirm}
                                                className="flex-3 bg-[#00529B] hover:bg-[#00407A] text-white px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 transition-all active:scale-95 flex items-center justify-center gap-3"
                                            >
                                                Declare & Submit
                                                <ChevronDown className="w-4 h-4 -rotate-90" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            {/* --- FOOTER --- */}
            <footer className="border-t border-gray-200 py-10 bg-white">
                <div className="max-w-[1400px] mx-auto px-10 flex flex-col gap-8">
                    {/* Helpline */}
                    <div className="text-center">
                        <span className="text-[#A52A2A] font-bold text-xs uppercase tracking-widest">Helpline Numbers :: </span>
                        <span className="text-gray-800 font-bold text-xs">23460460</span>
                        <span className="text-gray-500 text-[10px] ml-1">(8:30am-7:30pm)</span>
                    </div>

                    {/* Attribution */}
                    <div className="text-center space-y-1">
                        <p className="text-[9px] text-gray-500 font-medium">To edunote you by</p>
                        <p className="text-[9px] text-gray-600 font-bold uppercase">Directorate Director. KEA</p>
                        <p className="text-[9px] text-gray-500">Comm: tact 3650460, 23554563</p>
                        <p className="text-[9px] text-gray-600">
                            KEA | <a href="#" className="text-blue-500 underline">kea.gov.in</a> | <a href="#" className="text-blue-500 underline">kea.kar.gov.in</a> | Version 1.5. Server-09
                        </p>
                        <p className="text-[9px] text-gray-400 max-w-xl mx-auto leading-relaxed">
                            National support of the Exaciaveal inovinitational support of NIC, Karnataka State Unit, Bangolore.
                            Semen services provision by rectified by e-Governance, Govt of Karnataka.
                        </p>
                    </div>

                    {/* Bottom Logos */}
                    <div className="flex justify-between items-end mt-4">
                        <KEALogo />
                        <NICLogo />
                    </div>
                </div>
            </footer>
        </div>
    );
}
