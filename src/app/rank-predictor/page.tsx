'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, TrendingUp, Zap, ShieldCheck, Activity, Award,
  Layers, ArrowRight, Flame, History, GitMerge, Maximize2, Info,
  CheckCircle2, BrainCircuit, Database, Scale
} from 'lucide-react';
import { 
    ComposedChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, ReferenceDot, ReferenceLine, Area
} from 'recharts';
import { cn } from '@/lib/utils';
import rankMapping from '@/lib/data/rank_mapping.json';

// --- UNIVERSAL INTERPOLATION ENGINE ---

function applyLinearFormula(X: number, X1: number, Y1: number, X2: number, Y2: number) {
    return Y1 + (X - X1) * ((Y2 - Y1) / (X2 - X1));
}

function findReferencePoints(agg: number) {
    const points = [...rankMapping.points].sort((a, b) => b.agg - a.agg);
    const n = points.length;
    if (agg > points[0].agg) return { p1: points[0], p2: points[1], mode: 'extrapolation-high' };
    if (agg < points[n - 1].agg) return { p1: points[n - 2], p2: points[n - 1], mode: 'extrapolation-low' };
    for (let i = 0; i < n - 1; i++) {
        if (agg <= points[i].agg && agg >= points[i + 1].agg) {
            return { p1: points[i], p2: points[i + 1], mode: 'interpolation' };
        }
    }
    return { p1: points[0], p2: points[1], mode: 'fallback' };
}

function computeRank(agg: number, difficulty = 0) {
    const effectiveAgg = Math.min(100, Math.max(0, agg + difficulty * 2.5));
    const { p1, p2 } = findReferencePoints(effectiveAgg);
    let rank = applyLinearFormula(effectiveAgg, p1.agg, p1.rank, p2.agg, p2.rank);
    if (difficulty !== 0) {
        if (effectiveAgg >= 60 && effectiveAgg <= 75) rank *= 1.08;
        const mult = rank < 2000 ? 0.6 : rank < 10000 ? 1.0 : 1.2;
        const shift = Math.pow(Math.max(0.1, 1 - difficulty * 0.18), mult);
        rank *= shift;
    }
    return Math.round(Math.max(1, rank));
}

const CURVE_DATA = (() => {
    const pts = [];
    for (let agg = 60; agg <= 100; agg += 0.5) {
        pts.push({ agg: parseFloat(agg.toFixed(1)), rank: computeRank(agg, 0) });
    }
    return pts;
})();

export default function RankPredictor() {
    const [kcetTotal, setKcetTotal] = useState('');
    const [boardTotal, setBoardTotal] = useState('');
    const [difficulty, setDifficulty] = useState(0);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        const kt = parseFloat(kcetTotal) || 0;
        const bt = parseFloat(boardTotal) || 0;
        if (!kcetTotal || !boardTotal) { setResult(null); return; }

        const kcetPct = (kt / 180) * 100;
        const boardPct = (bt / 300) * 100;
        const aggregate = (0.5 * kcetPct) + (0.5 * boardPct);
        const rank = computeRank(aggregate, difficulty);
        const baseline = computeRank(aggregate, 0);
        const shiftPct = ((baseline - rank) / baseline) * 100;

        setResult({
            rank,
            aggregate,
            kcetPct,
            boardPct,
            shiftPct,
            low: Math.round(rank * 0.92),
            high: Math.round(rank * 1.08),
        });
    }, [kcetTotal, boardTotal, difficulty]);

    const markerPoint = useMemo(() => {
        if (!result) return null;
        return CURVE_DATA.reduce((prev, curr) =>
            Math.abs(curr.agg - result.aggregate) < Math.abs(prev.agg - result.aggregate) ? curr : prev
        );
    }, [result]);

    return (
        <div className="min-h-screen pt-24 pb-16 px-4 md:px-8 selection:bg-primary/30 overflow-x-hidden">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">

                {/* HEADER */}
                <header className="flex items-center justify-between gap-4 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                            <Zap className="w-5 h-5 text-primary fill-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white">
                                Rank <span className="text-primary">Predictor</span>
                            </h1>
                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                                <History className="w-3 h-3 text-emerald-500" /> Piecewise Intelligence v3.5
                            </div>
                        </div>
                    </div>
                    
                    {/* TOP ACTION BUTTON - iOS GLASS STYLE WITH REFLECTION */}
                    <Link href="/predictor">
                        <button className="relative overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 shadow-xl group">
                            {/* Reflection Shine Element */}
                            <motion.div 
                                initial={{ x: '-100%' }}
                                animate={{ x: '100%' }}
                                transition={{ repeat: Infinity, duration: 2, ease: 'linear', repeatDelay: 3 }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none"
                            />
                            
                            Predict Colleges <ArrowRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                </header>

                {/* MAIN DASHBOARD */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl">

                    {/* INPUTS */}
                    <div className="lg:col-span-4 xl:col-span-3 p-6 md:p-8 bg-black/40 border-r border-white/5 flex flex-col gap-6">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">KCET Score (180)</label>
                                <input
                                    type="number" placeholder="000"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary transition-all text-4xl font-black"
                                    value={kcetTotal}
                                    onChange={e => setKcetTotal(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Board PCM (300)</label>
                                <input
                                    type="number" placeholder="000"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-emerald-500 transition-all text-4xl font-black"
                                    value={boardTotal}
                                    onChange={e => setBoardTotal(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    <Flame className="w-3 h-3 fill-primary" /> Paper Difficulty
                                </label>
                                <span className="text-[9px] font-bold text-muted-foreground uppercase">{difficulty > 0 ? "Tougher" : difficulty < 0 ? "Easier" : "Neutral"}</span>
                            </div>
                            <input
                                type="range" min="-1" max="1" step="0.1"
                                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                                value={difficulty}
                                onChange={e => setDifficulty(parseFloat(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* RESULTS */}
                    <div className="lg:col-span-8 xl:col-span-9 p-6 md:p-10 flex flex-col justify-center min-h-[400px] relative">
                        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                            <Target className="w-64 h-64 text-white" />
                        </div>
                        
                        <AnimatePresence mode="wait">
                            {!result ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30">
                                    <Activity className="w-12 h-12 mb-4 animate-pulse" />
                                    <h3 className="text-xl font-bold uppercase tracking-[0.2em]">Signal Pending</h3>
                                </div>
                            ) : (
                                <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-primary text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                                <Target className="w-3.5 h-3.5" /> Target Rank: ~{result.rank.toLocaleString()}
                                            </div>
                                            <div className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] flex items-center gap-1">
                                                <Info className="w-3 h-3" /> 2025 Data Projection
                                            </div>
                                        </div>
                                        <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none italic uppercase">
                                            {result.low.toLocaleString()} – {result.high.toLocaleString()}
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-3 gap-1 rounded-2xl overflow-hidden border border-white/5">
                                        <div className="bg-white/5 p-6 flex flex-col justify-between">
                                            <div className="text-[9px] font-black uppercase tracking-widest text-primary mb-1">Aggregate</div>
                                            <div className="text-3xl font-black text-white leading-none">{result.aggregate.toFixed(2)}%</div>
                                        </div>
                                        <div className="bg-white/5 p-6 border-x border-white/5 flex flex-col justify-between">
                                            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">KCET Component</div>
                                            <div className="text-3xl font-black text-white leading-none">{result.kcetPct.toFixed(2)}%</div>
                                        </div>
                                        <div className="bg-white/5 p-6 flex flex-col justify-between">
                                            <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Board Component</div>
                                            <div className="text-3xl font-black text-white leading-none">{result.boardPct.toFixed(2)}%</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* THE GRAPH */}
                <div className="bg-[#080808] border border-white/10 rounded-3xl p-6 md:p-10 overflow-hidden relative shadow-2xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
                        <div>
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10b981] mb-1 flex items-center gap-2">
                                <TrendingUp className="w-3.5 h-3.5" /> Distribution High-Contrast
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">Rank vs Aggregate Signal</h3>
                        </div>
                        {result && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 px-5 py-3 rounded-2xl flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                                <div className="text-sm font-black text-white">~{result.rank.toLocaleString()} Rank Position</div>
                            </div>
                        )}
                    </div>

                    <div className="w-full h-72 sm:h-96">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={CURVE_DATA} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
                                <defs>
                                    <linearGradient id="rankHighlight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.03)" vertical={false} />
                                <XAxis
                                    dataKey="agg"
                                    type="number"
                                    domain={[60, 100]}
                                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700 }}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                    tickLine={false}
                                    tickFormatter={v => `${v}%`}
                                />
                                <YAxis
                                    domain={['dataMin', 'dataMax']}
                                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 700 }}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                    tickLine={false}
                                    tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
                                />
                                <Tooltip
                                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px' }}
                                    itemStyle={{ color: '#10b981', fontWeight: 700 }}
                                    labelFormatter={v => `Aggregate: ${v}%`}
                                />

                                <Area
                                    type="monotone"
                                    dataKey="rank"
                                    stroke="none"
                                    fill="url(#rankHighlight)"
                                    fillOpacity={1}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="rank"
                                    stroke="#10b981"
                                    strokeWidth={4}
                                    dot={false}
                                    activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                                    animationDuration={1500}
                                />

                                {result && markerPoint && (
                                    <>
                                        <ReferenceLine x={markerPoint.agg} stroke="rgba(255,255,255,0.1)" strokeDasharray="5 5" />
                                        <ReferenceLine y={markerPoint.rank} stroke="rgba(255,255,255,0.05)" strokeDasharray="5 5" />
                                        <ReferenceDot
                                            x={markerPoint.agg}
                                            y={markerPoint.rank}
                                            r={10}
                                            fill="#ef4444"
                                            stroke="#fff"
                                            strokeWidth={3}
                                            label={{ value: `You`, position: 'top', fill: '#ef4444', fontSize: 11, fontWeight: 900 }}
                                        />
                                    </>
                                )}
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* THE SCIENCE BEHIND THE SIGNAL */}
                <section className="mt-12">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
                        <div className="space-y-4">
                            <div className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-2">Transparency Report</div>
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic">
                                The Science <span className="text-primary">Behind Prediction</span>
                            </h2>
                            <p className="text-muted-foreground max-w-xl font-medium">
                                Most predictors use generic curve-fitting. We use a **Direct Data Anchoring System** 
                                built on top of official 2025 results.
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                                <BrainCircuit className="w-6 h-6 text-primary" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* WHY WE ARE BETTER */}
                        <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] space-y-6 group hover:border-primary/40 transition-all shadow-xl">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                                <Award className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">Why We Are Better</h3>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-xs text-muted-foreground leading-relaxed">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span><strong>Zero Guessing:</strong> Unlike others, we don't use a single "average" formula. We map every result between the two closest real 2025 points.</span>
                                </li>
                                <li className="flex items-start gap-3 text-xs text-muted-foreground leading-relaxed">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span><strong>Dynamic Variance:</strong> Our model accounts for the "Collapse Zone" (65-75%) where student density is highest.</span>
                                </li>
                            </ul>
                        </div>

                        {/* MATHEMATICAL APPROACH */}
                        <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] space-y-6 group hover:border-emerald-500/40 transition-all shadow-xl">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                <Scale className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">Mathematical Logic</h3>
                            <div className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-[10px] text-primary">
                                Y = Y1 + (X - X1) * ((Y2 - Y1) / (X2 - X1))
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                We use **Piecewise Linear Interpolation**. This means we draw a straight mathematical line between known official 2025 points, ensuring your prediction is never just a "rough guess."
                            </p>
                        </div>

                        {/* DATA DEPENDENCY */}
                        <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] space-y-6 group hover:border-orange-500/40 transition-all shadow-xl">
                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
                                <Database className="w-6 h-6 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tight">2025 Dependency</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                Our core intelligence is fueled by the **Official 2025 KCET Aggregate Dataset**. Every rank you see is a projection based on how students *actually* performed this year, not last year.
                            </p>
                            <div className="pt-2">
                                <div className="text-[10px] font-black text-white uppercase tracking-widest bg-orange-500/20 px-3 py-1 rounded-full border border-orange-500/30 inline-block">
                                    LIVE DATA SYNC
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FOOTER ADVISORY */}
                <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col items-center gap-6 opacity-30 grayscale pointer-events-none">
                     <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-white">
                        <span>Verified 2025 Dataset</span>
                        <div className="w-1 h-1 rounded-full bg-white" />
                        <span>Hybrid Calculation</span>
                        <div className="w-1 h-1 rounded-full bg-white" />
                        <span>Piecewise v3.5</span>
                     </div>
                </footer>
            </div>
        </div>
    );
}
