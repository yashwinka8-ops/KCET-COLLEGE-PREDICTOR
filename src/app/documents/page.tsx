'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  School, 
  FileText, 
  UserCheck, 
  Zap, 
  CheckCircle2, 
  Info, 
  ShieldCheck,
  AlertCircle,
  Download,
  ArrowLeft,
  History,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { jsPDF } from 'jspdf';

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

const historicalCutoffs = [
  {
    year: "2024",
    color: "primary",
    rounds: [
      { name: "Mock Allotment", path: "/cutoffs/kcet-2024-mock-round1-cutoffs.pdf" },
      { name: "Round 1 Cutoff", path: "/cutoffs/kcet-2024-round1-cutoffs.pdf" },
      { name: "Round 2 Cutoff", path: "/cutoffs/kcet-2024-round2-cutoffs.pdf" },
      { name: "Round 3 (Ext)", path: "/cutoffs/kcet-2024-round3(extended)-cutoffs.pdf" }
    ]
  },
  {
    year: "2023",
    color: "amber",
    rounds: [
      { name: "Round 1 Cutoff", path: "/cutoffs/kcet-2023-round1-cutoffs.pdf" },
      { name: "Round 2 Cutoff", path: "/cutoffs/kcet-2023-round2-cutoffs.pdf" },
      { name: "Round 3 (Ext)", path: "/cutoffs/kcet-2023-round3(extended)-cutoffs.pdf" }
    ]
  }
];

export default function DocumentChecklistPage() {
  const handleDownload = () => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = '/documents_1.png';
    
    img.onload = () => {
      const imgWidth = 190; // mm
      const imgHeight = (img.height * imgWidth) / img.width;
      
      doc.addImage(img, 'PNG', 10, 10, imgWidth, imgHeight);
      doc.save('KCET_Document_Checklist_2025.pdf');
    };
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <Link href="/guide" className="inline-flex items-center gap-2 text-muted-foreground hover:text-white transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Roadmap
        </Link>

        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
              Document <span className="text-emerald-400">Vault.</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              The definitive checklist for KCET & UG-NEET 2025 Verification. Ensure every document is ready for KEA.
            </p>
          </div>
          <button 
            onClick={handleDownload}
            className="bg-emerald-500 hover:bg-emerald-600 text-black px-8 py-4 rounded-2xl font-black text-xs transition-all flex items-center gap-2 shadow-xl shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" /> DOWNLOAD PRINTABLE PDF
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {documents.map((group, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-10 border-l-4 border-emerald-500/40 relative overflow-hidden"
            >
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
            </motion.div>
          ))}
        </div>

        {/* HISTORICAL ARCHIVES */}
        <div className="mt-32">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30">
              <History className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-black">Historical Intelligence.</h2>
              <p className="text-muted-foreground text-sm">Official KEA Cutoff Archives for trend analysis.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {historicalCutoffs.map((archive, idx) => (
              <div key={idx} className="glass-card p-8 border-t-4 border-primary/40">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-xl font-black text-primary">{archive.year} Archive</h4>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full border border-primary/20">Official KEA</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {archive.rounds.map((round, i) => (
                    <a 
                      key={i} 
                      href={round.path} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/40 hover:bg-primary/5 transition-all group"
                    >
                      <span className="text-sm font-bold text-muted-foreground group-hover:text-white">{round.name}</span>
                      <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GUIDELINES GRID */}
        <div className="mt-24">
          <h2 className="text-3xl font-black mb-12 flex items-center gap-4">
            <ShieldCheck className="w-8 h-8 text-rose-500" />
            Essential Submission Rules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { t: "The 4-Copy Rule", d: "Keep 4 copies of every document (3 for submission + 1 backup backup)." },
              { t: "Perfect Sequence", d: "Arrange documents in the exact same order as listed in the Vault above." },
              { t: "Personal Archive", d: "Maintain a separate personal file with all copies for college admission." },
              { t: "Document Integrity", d: "Ensure all originals are crystal clear and free from any damage or folds." },
              { t: "Local Authority", d: "Category certificates must be issued by authorized Karnataka Tahsildars." },
              { t: "Applicability", d: '“If Applicable” documents are only required for eligible quota candidates.' }
            ].map((rule, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="glass-card p-8 border-rose-500/20 bg-rose-500/[0.02]"
              >
                <h5 className="text-sm font-bold text-rose-400 mb-2 uppercase tracking-widest">{rule.t}</h5>
                <p className="text-xs leading-relaxed text-muted-foreground">{rule.d}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Security Warning */}
        <div className="mt-12 p-10 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center shrink-0 animate-pulse">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <div>
            <h4 className="text-xl font-black text-rose-500 mb-1">Critical Security Priority</h4>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl">
              Never share your <strong>KEA Secret Key</strong> with anyone. This key is your digital identity in the counseling portal. Sharing it can lead to unauthorized changes in your option list.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
