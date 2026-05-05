import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Zap } from "lucide-react";
import { AuthProvider } from "@/lib/contexts/AuthContext";
import { CollegeProvider } from "@/lib/contexts/CollegeContext";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "KCET Predictor",
  description: "The most accurate and premium college prediction platform for KCET aspirants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <AuthProvider>
          <CollegeProvider>
            <Navbar />
            <main>{children}</main>

            <footer className="border-t border-white/5 bg-black/40 backdrop-blur-xl py-12 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold tracking-tight text-lg text-white">KCET Predictor</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            The most accurate and premium college prediction platform for KCET aspirants. 
                            Based on <span className="text-primary font-bold">2025 Official Data</span>.
                        </p>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                            © 2026 KCET Predictor. All Rights Reserved.
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-black uppercase tracking-widest text-white">Quick Links</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <Link href="/rank-predictor" className="text-primary font-bold hover:text-primary/80 transition-colors">Rank Predictor</Link>
                            <Link href="/predictor" className="hover:text-white transition-colors">Predictor</Link>
                            <Link href="/cutoffs" className="hover:text-white transition-colors">Cutoffs</Link>
                            <Link href="/compare" className="hover:text-white transition-colors">Compare</Link>
                            <Link href="/trends" className="hover:text-white transition-colors">Trends</Link>
                            <Link href="/instructions" className="hover:text-white transition-colors">Instructions</Link>
                            <Link href="/wishlist" className="hover:text-white transition-colors">Wishlist</Link>
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy & Disclaimer</Link>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-black uppercase tracking-widest text-white">Contact & Support</h4>
                        <div className="space-y-3">
                            <a href="mailto:yashwinka8@gmail.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-all">
                                    <span className="text-xs">@</span>
                                </div>
                                yashwinka8@gmail.com
                            </a>
                            <a href="https://t.me/flux_35" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-all">
                                    <Zap className="w-4 h-4" />
                                </div>
                                Telegram: @flux_35
                            </a>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center">
                     <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                        Disclaimer: Predictions are based on historical official data and should be used as a guide only.
                     </p>
                </div>
            </footer>
          </CollegeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
