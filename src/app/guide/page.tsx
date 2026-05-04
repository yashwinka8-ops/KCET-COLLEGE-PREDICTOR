'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardCheck, 
  UserCheck, 
  ListTodo, 
  MapPin, 
  CreditCard, 
  School,
  ChevronRight,
  Info,
  ExternalLink,
  Zap,
  FileText,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    id: "01",
    title: "Rank Declaration",
    description: "Results are curated based on KCET exam and 12th Std marks. Your rank is the golden ticket to counseling.",
    icon: ClipboardCheck,
    status: "Completed",
    color: "emerald"
  },
  {
    id: "02",
    title: "Document Verification",
    description: "Visit designated centers with originals for verification to receive your critical Secret Key.",
    icon: UserCheck,
    status: "Active",
    color: "primary"
  },
  {
    id: "03",
    title: "Option Entry",
    description: "The strategic core. Enter college and branch preferences in absolute order of priority.",
    icon: ListTodo,
    status: "Upcoming",
    color: "blue"
  },
  {
    id: "04",
    title: "Mock Allotment",
    description: "A trial result by KEA. Use this to refine and re-order your final option list.",
    icon: MapPin,
    status: "Upcoming",
    color: "rose"
  },
  {
    id: "05",
    title: "Seat Allotment",
    description: "Main rounds of allotment. Decide to Freeze (Confirm), Float (Better), or Surrender.",
    icon: School,
    status: "Upcoming",
    color: "amber"
  }
];

const documents = [
  {
    category: "Academic Foundation",
    icon: School,
    color: "emerald",
    items: [
      { name: "SSLC / 10th Marks Card", detail: "Original + 3 Photocopies + 1 Personal Copy" },
      { name: "2nd PUC / 12th Marks Card", detail: "Original + 3 Photocopies + 1 Personal Copy" },
      { name: "10th Study Certificate", detail: "Issued by school (3 Copies + 1 Personal)" },
      { name: "12th Study Certificate", detail: "Includes SSLC/PUC details (3 Copies + 1 Personal)" },
      { name: "Transfer Certificate (TC)", detail: "From last institution (3 Copies + 1 Personal)" }
    ]
  },
  {
    category: "KEA & Exam Essentials",
    icon: FileText,
    color: "primary",
    items: [
      { name: "KEA Verification Slip 2025", detail: "Official KEA document (3 Copies + 1 Personal)" },
      { name: "Online Application Form", detail: "Final submitted version (3 Copies + 1 Personal)" },
      { name: "Admit Card / Hall Ticket", detail: "Used during entrance (3 Copies + 1 Personal)" },
      { name: "Confirmation Page", detail: "Post-submission proof (3 Copies + 1 Personal)" },
      { name: "Fee Payment Receipt", detail: "Original + Copies of proof" }
    ]
  },
  {
    category: "Identity & Personal",
    icon: UserCheck,
    color: "blue",
    items: [
      { name: "Valid Photo ID Proof", detail: "Aadhaar / PAN / Passport / Voter ID (Original + 3 Copies)" },
      { name: "Aadhaar Card", detail: "Mandatory verification (3 Photocopies)" },
      { name: "Passport Size Photos", detail: "Recent copies (Carry at least 8 copies)" }
    ]
  },
  {
    category: "Reservation & Category",
    icon: Zap,
    color: "amber",
    items: [
      { name: "Caste / Income Certificate", detail: "Issued by Karnataka Tahsildar (3 Copies + 1 Personal)" },
      { name: "371(j) / HK Certificate", detail: "For regional reservation claims (3 Copies + 1 Personal)" },
      { name: "Rural Quota Certificate", detail: "If applying under rural reservation (3 Copies + 1 Personal)" }
    ]
  }
];

export default function CounsellingGuide() {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6 selection:bg-primary/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HERO SECTION */}
        <header className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Master Roadmap 2025</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9]">
            Navigating the <br />
            <span className="text-gradient">Counselling Maze.</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
            A high-fidelity guide to mastering the KCET & UG-NEET admission cycle. From document verification to the final seat allotment.
          </p>
        </header>

        {/* INTERACTIVE TIMELINE */}
        <section className="mb-32">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "glass-card p-6 cursor-pointer transition-all relative overflow-hidden group",
                  activeStep === idx ? "border-primary/40 ring-1 ring-primary/20" : "hover:border-white/20"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors",
                  activeStep === idx ? "bg-primary text-white" : "bg-white/5 text-muted-foreground group-hover:text-white"
                )}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Step {step.id}</div>
                <h3 className="text-sm font-bold truncate">{step.title}</h3>
                
                {activeStep === idx && (
                  <motion.div 
                    layoutId="activeGlow"
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Expanded Step Info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-8 glass-card p-8 md:p-12 border-primary/20 bg-primary/[0.02]"
            >
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-6xl font-black text-primary/20 italic tracking-tighter">#{steps[activeStep].id}</span>
                    <div>
                      <h2 className="text-3xl font-black mb-1">{steps[activeStep].title}</h2>
                      <div className="flex items-center gap-2">
                         <div className={cn(
                           "w-2 h-2 rounded-full",
                           steps[activeStep].status === "Completed" ? "bg-emerald-500" : "bg-primary"
                         )} />
                         <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status: {steps[activeStep].status}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-xl">
                    {steps[activeStep].description}
                  </p>
                  <button className="flex items-center gap-3 text-sm font-black text-primary group">
                    EXPLORE FULL PROCEDURE <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="w-full md:w-80 space-y-4">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-4">Critical Check</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Ensure your contact details in the KEA portal match your verified Aadhaar phone number.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                    <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500 mb-4">Pro Insight</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">Most students lose seats by failing to report within the stipulated deadline. Mark your calendar.</p>
                  </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* DOCUMENT VAULT */}
        <section className="mt-48">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-4">The Document <span className="text-emerald-400">Vault.</span></h2>
              <p className="text-muted-foreground max-w-lg">All essential documents required for 2025 verification. Carry 3 sets of photocopies for each.</p>
            </div>
            <div className="px-6 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400">Official KEA Format 2025</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {documents.map((group, idx) => (
              <div key={idx} className="glass-card p-10 border-l-4 border-emerald-500/40">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <group.icon className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="text-2xl font-black">{group.category}</h3>
                </div>

                <div className="space-y-6">
                  {group.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 group cursor-default">
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-1 group-hover:bg-emerald-500/20 transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Reservation Banner */}
          <div className="mt-8 p-10 rounded-3xl bg-amber-500/5 border border-amber-500/10 flex flex-col md:flex-row items-center gap-8">
             <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0">
                <Zap className="w-8 h-8 text-amber-500" />
             </div>
             <div>
                <h4 className="text-xl font-black text-amber-500 mb-1">Reservation & Quota Documentation</h4>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">
                  If claiming Rural, Kannada Medium, or HK Quota, ensure certificates are issued by the Tahsildar with current validity. Income certificates must be within the 5-year limit.
                </p>
             </div>
             <button className="md:ml-auto bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 px-8 py-4 rounded-2xl font-black text-xs transition-all border border-amber-500/20 uppercase tracking-widest">
                View Requirements
             </button>
          </div>

          {/* MASTER GUIDELINES */}
          <div className="mt-8 glass-card p-10 border-rose-500/30 bg-rose-500/[0.02]">
            <h4 className="text-sm font-black uppercase tracking-widest text-rose-500 mb-8 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                    <Info className="w-4 h-4" />
                </div>
                Submission & Verification Guidelines
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                    { t: "The 4-Copy Rule", d: "Keep 4 copies of every document (3 for submission + 1 backup backup)." },
                    { t: "Perfect Sequence", d: "Arrange documents in the exact same order as listed in the Vault above." },
                    { t: "Personal Archive", d: "Maintain a separate personal file with all copies for college admission." },
                    { t: "Document Integrity", d: "Ensure all originals are crystal clear and free from any damage or folds." },
                    { t: "Local Authority", d: "Category certificates must be issued by authorized Karnataka Tahsildars." },
                    { t: "Applicability", d: '“If Applicable” documents are only required for eligible quota candidates.' }
                ].map((rule, i) => (
                    <div key={i} className="space-y-2">
                        <h5 className="text-sm font-bold text-white">{rule.t}</h5>
                        <p className="text-[11px] leading-relaxed text-muted-foreground">{rule.d}</p>
                    </div>
                ))}
            </div>
          </div>
        </section>

        {/* FINAL ADVICE SECTION */}
        <section className="mt-48 grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 glass-card p-12 bg-primary/[0.03] border-primary/20 relative overflow-hidden">
              <Sparkles className="absolute top-10 right-10 w-24 h-24 text-primary opacity-10" />
              <h2 className="text-4xl font-black mb-8">Expert Counseling Wisdom.</h2>
              <div className="space-y-8">
                 {[
                   { t: "The 50+ Rule", d: "Always enter 50+ options in Round 1. It maximizes your chances of securing a seat in a premium college before they fill up." },
                   { t: "Sequential Strategy", d: "Order your choices by absolute preference (1 to X), regardless of cutoffs. KEA software will check your #1 first." },
                   { t: "HK Quota Verification", d: "Verify your HK status specifically during document verification. Many students miss out because of small clerical errors." }
                 ].map((tip, idx) => (
                   <div key={idx} className="flex gap-6">
                      <span className="text-2xl font-black text-primary/40">0{idx + 1}</span>
                      <div>
                        <h4 className="text-lg font-bold mb-1">{tip.t}</h4>
                        <p className="text-muted-foreground text-sm leading-relaxed">{tip.d}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="flex flex-col gap-8">
              <div className="glass-card p-10 border-rose-500/30 bg-rose-500/5 h-full flex flex-col justify-between">
                 <div>
                    <AlertCircle className="w-12 h-12 text-rose-500 mb-6" />
                    <h3 className="text-2xl font-black text-rose-500 mb-4">Critical Warning</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Never share your <strong>KEA Secret Key</strong> with anyone, including internet cafe operators or friends. This key allows anyone to modify your choices.
                    </p>
                 </div>
                 <div className="mt-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[10px] font-black uppercase tracking-widest text-rose-500 text-center">
                    Security Priority: High
                 </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
