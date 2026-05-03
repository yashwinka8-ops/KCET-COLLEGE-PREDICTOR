'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ClipboardCheck, 
  UserCheck, 
  ListTodo, 
  MapPin, 
  CreditCard, 
  School,
  ChevronRight,
  Info,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  {
    title: "KCET Result & Rank Declaration",
    description: "Results are announced based on KCET exam and 12th Std marks. Rank is used for counseling.",
    icon: ClipboardCheck,
    status: "Completed"
  },
  {
    title: "Document Verification",
    description: "Visit designated centers with original documents for verification and receive Secret Key.",
    icon: UserCheck,
    status: "Upcoming"
  },
  {
    title: "Option Entry",
    description: "The most critical step. Enter your college and branch preferences in order of priority.",
    icon: ListTodo,
    status: "Next"
  },
  {
    title: "Mock Allotment",
    description: "KEA releases a trial allotment. You can change your options after this result.",
    icon: MapPin,
    status: "Future"
  },
  {
    title: "Seat Allotment Rounds",
    description: "Three main rounds of allotment. You can choose to Freeze, Float, or Surrender your seat.",
    icon: School,
    status: "Future"
  },
  {
    title: "Fee Payment & Reporting",
    description: "Pay the admission fee and report to the allotted college with your admission order.",
    icon: CreditCard,
    status: "Future"
  }
];

export default function CounsellingGuide() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-16 text-center">
           <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">Counselling Guide</h1>
           <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Master the KCET counseling process with our step-by-step roadmap and professional tips.</p>
        </header>

        <div className="relative space-y-12">
          {/* Timeline Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-white/5 -translate-x-1/2" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={cn(
                "relative flex flex-col md:flex-row items-center gap-8",
                idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              )}
            >
              {/* Content Card */}
              <div className="flex-1 w-full">
                 <div className={cn(
                   "glass-card p-8 group hover:border-primary/30 transition-all",
                   idx % 2 === 0 ? "md:text-right" : "md:text-left"
                 )}>
                    <div className={cn(
                      "inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4",
                      step.status === "Completed" ? "bg-emerald-500/10 text-emerald-500" : 
                      step.status === "Upcoming" ? "bg-amber-500/10 text-amber-500" :
                      "bg-white/5 text-muted-foreground"
                    )}>
                      {step.status}
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                    <button className={cn(
                      "mt-6 flex items-center gap-2 text-sm font-bold text-primary hover:underline",
                      idx % 2 === 0 ? "md:ml-auto" : ""
                    )}>
                      Read More <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
              </div>

              {/* Icon Circle */}
              <div className="relative z-10 w-12 h-12 rounded-full bg-background border-4 border-white/10 flex items-center justify-center shrink-0">
                 <step.icon className="w-5 h-5 text-primary" />
              </div>

              {/* Spacer */}
              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>

        {/* Resources Section */}
        <section className="mt-32">
           <div className="glass-card p-12 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Info className="w-32 h-32" />
              </div>
              <div className="relative z-10 max-w-2xl">
                 <h2 className="text-3xl font-bold mb-6">Expert Counselling Tips</h2>
                 <ul className="space-y-4 mb-8">
                    <li className="flex gap-4">
                       <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                          <span className="text-[10px] font-bold text-primary">01</span>
                       </div>
                       <p className="text-muted-foreground">Always enter at least 50+ options in Round 1 to ensure a seat allocation.</p>
                    </li>
                    <li className="flex gap-4">
                       <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                          <span className="text-[10px] font-bold text-primary">02</span>
                       </div>
                       <p className="text-muted-foreground">Don't rely solely on last year's cutoffs; ranks fluctuate based on student preferences.</p>
                    </li>
                    <li className="flex gap-4">
                       <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                          <span className="text-[10px] font-bold text-primary">03</span>
                       </div>
                       <p className="text-muted-foreground">Verify your HK quota status during document verification to avoid last-minute issues.</p>
                    </li>
                 </ul>
                 <button className="bg-primary text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all">
                    Download Full PDF Guide <ExternalLink className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
