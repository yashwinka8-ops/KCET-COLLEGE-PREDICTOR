'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rss, 
  Clock, 
  ExternalLink, 
  Bell, 
  Calendar, 
  ArrowUpRight,
  ShieldAlert,
  Zap,
  Globe,
  Monitor,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const latestNotifications = [
  {
    date: "May 04, 2026",
    title: "UGCET 2026: Document Verification Schedule Released",
    category: "Circular",
    link: "https://kea.kar.nic.in"
  },
  {
    date: "May 02, 2026",
    title: "Revised Rank List for Engineering & Architecture",
    category: "Notification",
    link: "https://kea.kar.nic.in"
  },
  {
    date: "April 28, 2026",
    title: "Guidelines for Online Option Entry - Round 1",
    category: "Instructions",
    link: "https://kea.kar.nic.in"
  }
];

const milestones = [
  {
    event: "Document Verification",
    status: "In Progress",
    date: "May 05 - May 15",
    color: "emerald"
  },
  {
    event: "Option Entry (Round 1)",
    status: "Upcoming",
    date: "May 20, 2026",
    color: "primary"
  },
  {
    event: "Mock Allotment Result",
    status: "Upcoming",
    date: "May 28, 2026",
    color: "blue"
  }
];

export default function KEATrackerPage() {
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [lastSync, setLastSync] = React.useState<string>("");

  const fetchLatest = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tracker/sync');
      const json = await res.json();
      if (json.success) {
        setNotifications(json.data);
        setLastSync(new Date(json.timestamp).toLocaleTimeString());
      }
    } catch (err) {
      console.error("Failed to sync with KEA");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchLatest();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
              >
                <Activity className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Live Command Center</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                KEA Tracker <br />
                <span className="text-gradient">UGCET 2026.</span>
              </h1>
            </div>
            
            <button 
              onClick={fetchLatest}
              disabled={loading}
              className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all group disabled:opacity-50"
            >
               <div className={cn("w-2 h-2 rounded-full bg-emerald-500", loading && "animate-ping")} />
               <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-white transition-colors">Sync Intelligence</p>
                  <p className="text-[9px] text-muted-foreground">Last updated: {lastSync || 'Never'}</p>
               </div>
               <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </button>
          </div>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
            Real-time intelligence on official KEA notifications, counseling phases, and critical admission deadlines.
          </p>
        </header>

        {/* PULSE INDICATOR & QUICK LINKS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-32">
          {/* Main Status */}
          <div className="lg:col-span-2 glass-card p-10 border-emerald-500/30 bg-emerald-500/[0.02] flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Globe className="w-32 h-32 text-emerald-500" />
             </div>
             <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                   <span className="text-xs font-black uppercase tracking-widest text-emerald-500">Live Status</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black mb-4">Admissions <br /> Open.</h2>
                <p className="text-muted-foreground max-w-md">KEA has officially commenced the UGCET 2026 application cycle. Document verification is next.</p>
             </div>
             <div className="mt-12 flex gap-4 relative z-10">
                <a href="https://cetonline.karnataka.gov.in/kea/ugcet2026" target="_blank" className="bg-emerald-500 text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/20">Official Portal</a>
                <Link href="/guide" className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Roadmap 2026</Link>
             </div>
          </div>

          {/* Quick Portal Dock */}
          <div className="glass-card p-8 border-white/10 flex flex-col gap-4">
             <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Official Portals</h3>
             {[
               { name: "KEA UGCET 2026", icon: Globe, link: "https://cetonline.karnataka.gov.in/kea/ugcet2026" },
               { name: "Candidate Login", icon: Monitor, link: "https://cetonline.karnataka.gov.in/cet2026/index.aspx" },
               { name: "Instructions PDF", icon: Zap, link: "#" },
               { name: "Previous Cutoffs", icon: Rss, link: "/cutoffs" }
             ].map((portal, i) => (
               <a 
                 key={i} 
                 href={portal.link} 
                 target="_blank" 
                 className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all group"
               >
                 <div className="flex items-center gap-3">
                    <portal.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="font-bold text-sm">{portal.name}</span>
                 </div>
                 <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
               </a>
             ))}
          </div>
        </div>

        {/* NOTIFICATIONS & MILESTONES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Notification Stream */}
          <section>
            <div className="flex items-center justify-between mb-10">
               <h2 className="text-3xl font-black flex items-center gap-4">
                  <Bell className="w-6 h-6 text-rose-500" />
                  Latest Circulars
               </h2>
               <button className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View Archive</button>
            </div>
            
            <div className="space-y-4">
               {loading ? (
                 Array(5).fill(0).map((_, i) => (
                   <div key={i} className="glass-card p-6 border-white/5 animate-pulse h-24" />
                 ))
               ) : notifications.length > 0 ? (
                 notifications.map((notif, i) => (
                   <motion.a 
                     key={i}
                     href={notif.link}
                     target="_blank"
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: i * 0.05 }}
                     className="glass-card p-6 border-white/5 hover:border-rose-500/20 transition-all group block relative overflow-hidden"
                   >
                     <div className="flex justify-between items-start mb-4 relative z-10">
                        <span className="text-[10px] font-bold text-muted-foreground">{notif.date}</span>
                        <span className="text-[9px] font-black uppercase px-2 py-1 rounded bg-white/5 text-rose-400 border border-rose-500/20">{notif.category}</span>
                     </div>
                     <h4 className="text-lg font-bold group-hover:text-rose-400 transition-colors leading-tight relative z-10">{notif.title}</h4>
                     
                     <div className="absolute inset-0 bg-gradient-to-r from-rose-500/0 to-rose-500/[0.02] translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                   </motion.a>
                 ))
               ) : (
                 <div className="glass-card p-12 text-center border-dashed border-white/10">
                    <p className="text-muted-foreground text-sm">No notifications found at the moment.</p>
                 </div>
               )}
            </div>
          </section>

          {/* Counselling Milestones */}
          <section>
            <h2 className="text-3xl font-black mb-10 flex items-center gap-4">
               <Clock className="w-6 h-6 text-primary" />
               Timeline Tracker
            </h2>
            <div className="space-y-6">
               {[
                 {
                   event: "UGCET 2026 Applications",
                   status: "Live",
                   date: "Active Now",
                   color: "emerald"
                 },
                 {
                   event: "Hall Ticket Download",
                   status: "Released",
                   date: "April 2026",
                   color: "primary"
                 },
                 {
                   event: "Document Verification",
                   status: "Upcoming",
                   date: "May 2026",
                   color: "blue"
                 }
               ].map((milestone, i) => (
                 <div key={i} className="flex gap-6 relative group">
                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all group-hover:scale-110",
                      milestone.status === "Live" ? "bg-emerald-500/20 border-emerald-500/40" : "bg-white/5 border-white/10"
                    )}>
                       <Calendar className={cn(
                         "w-5 h-5",
                         milestone.status === "Live" ? "text-emerald-500" : "text-muted-foreground"
                       )} />
                    </div>

                    <div className="pt-1">
                       <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-bold">{milestone.event}</h4>
                          <span className={cn(
                            "text-[8px] font-black uppercase px-2 py-0.5 rounded-full border",
                            milestone.status === "Live" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-white/5 text-muted-foreground border-white/10"
                          )}>{milestone.status}</span>
                       </div>
                       <p className="text-sm font-black text-muted-foreground italic">{milestone.date}</p>
                    </div>
                 </div>
               ))}
            </div>

            {/* Warning Advice */}
            <div className="mt-16 p-8 rounded-3xl bg-rose-500/5 border border-rose-500/10 flex gap-6 items-start">
               <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0" />
               <p className="text-xs text-muted-foreground leading-relaxed">
                 Intelligence gathered from the official KEA UGCET 2026 portal. Always cross-verify with the official notification for specific time-slots.
               </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
