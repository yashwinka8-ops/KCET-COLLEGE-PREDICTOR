'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, Heart, LogOut, User as UserIcon, Menu, X } from "lucide-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { AnimatePresence, motion } from 'framer-motion';

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className="absolute top-0 left-0 right-0 z-[100] px-4 md:px-6 py-4 flex justify-center pointer-events-none">
        <div className="bg-black/40 backdrop-blur-xl px-4 md:px-6 py-3 rounded-full flex items-center gap-4 md:gap-8 border border-white/10 max-w-[1200px] w-full justify-between pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          
          <div className="flex items-center gap-3">
            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 -ml-2 text-white/70 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            
            <Link href="/" className="flex items-center gap-2 shrink-0" onClick={closeMenu}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold tracking-tight text-lg hidden sm:block">KCET Predictor</span>
            </Link>

            {/* Spiritual Accent - Visible everywhere */}
            <div className="flex items-center ml-1 sm:ml-2 sm:border-l sm:border-white/10 sm:pl-3 h-6 pointer-events-none select-none">
                <span className="text-[9px] sm:text-[11px] font-serif text-orange-500 tracking-[0.05em] sm:tracking-[0.1em] drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]">
                    श्रद्धावान् लभते ज्ञानम्
                </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/rank-predictor" className="text-primary hover:text-primary/80 font-bold flex items-center gap-1.5 transition-colors">
              Rank Predictor
              <div className="bg-primary/20 text-[8px] px-1.5 py-0.5 rounded-md border border-primary/30">PRO</div>
            </Link>
            <Link href="/predictor" className="hover:text-white transition-colors">Predictor</Link>
            <Link href="/cutoffs" className="hover:text-white transition-colors">Cutoffs</Link>
            <Link href="/compare" className="hover:text-white transition-colors">Compare</Link>
            <Link href="/trends" className="hover:text-white transition-colors">Trends</Link>
            <Link href="/guide" className="hover:text-white transition-colors">Guide</Link>
            <Link href="/instructions" className="hover:text-white transition-colors">Instructions</Link>
            <Link href="/wishlist" className="hover:text-white transition-colors flex items-center gap-1.5 bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-full border border-rose-500/20">
              <Heart className="w-4 h-4 fill-current" />
              Wishlist
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 md:gap-3 bg-white/5 pl-2 pr-1 py-1 rounded-full border border-white/10">
                {isAdmin && (
                  <Link href="/admin" onClick={closeMenu} className="hidden md:block ml-2 bg-orange-500/20 text-orange-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter hover:bg-orange-500 hover:text-white transition-all">
                    ADMIN
                  </Link>
                )}
                <span className="text-[10px] font-bold text-white/70 ml-1 md:ml-2 hidden md:block max-w-[80px] truncate">{user.name}</span>
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full overflow-hidden border border-white/20 shrink-0">
                  <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <button 
                  onClick={logout}
                  className="p-1.5 md:p-2 hover:bg-rose-500/10 hover:text-rose-500 rounded-full transition-all text-muted-foreground"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 md:w-4 md:h-4" />
                </button>
              </div>
            ) : (
              <Link href="/predictor" onClick={closeMenu}>
                <button className="bg-primary hover:bg-primary/90 text-white px-4 md:px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 flex items-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-xl lg:hidden flex flex-col pt-24 px-6 pb-6"
          >
            <div className="flex flex-col gap-4 text-xl font-bold">
              <Link href="/" onClick={closeMenu} className="py-3 border-b border-white/10 hover:text-primary transition-colors">Home</Link>
              <Link href="/rank-predictor" onClick={closeMenu} className="py-3 border-b border-white/10 text-primary flex items-center justify-between">
                Rank Predictor
                <span className="bg-primary/20 text-[10px] px-2 py-0.5 rounded-full border border-primary/30">NEW</span>
              </Link>
              <Link href="/predictor" onClick={closeMenu} className="py-3 border-b border-white/10 hover:text-primary transition-colors">Smart Predictor</Link>
              <Link href="/cutoffs" onClick={closeMenu} className="py-3 border-b border-white/10 hover:text-primary transition-colors">Cutoff Explorer</Link>
              <Link href="/compare" onClick={closeMenu} className="py-3 border-b border-white/10 hover:text-primary transition-colors">Compare Colleges</Link>
              <Link href="/trends" onClick={closeMenu} className="py-3 border-b border-white/10 hover:text-primary transition-colors">Trends</Link>
              <Link href="/guide" onClick={closeMenu} className="py-3 border-b border-white/10 hover:text-primary transition-colors">Counselling Guide</Link>
              <Link href="/instructions" onClick={closeMenu} className="py-3 border-b border-white/10 hover:text-primary transition-colors">Instructions</Link>
              
              <Link href="/wishlist" onClick={closeMenu} className="py-4 mt-2 flex items-center justify-center gap-2 bg-rose-500/10 text-rose-500 rounded-2xl border border-rose-500/20">
                <Heart className="w-5 h-5 fill-current" />
                My Wishlist
              </Link>

              {user && isAdmin && (
                <Link href="/admin" onClick={closeMenu} className="py-4 mt-2 flex items-center justify-center gap-2 bg-orange-500 text-black rounded-2xl shadow-lg shadow-orange-500/20 uppercase tracking-widest text-sm">
                  Admin Console
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
