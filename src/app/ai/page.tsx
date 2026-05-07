"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, User, Loader2, ChevronDown, Cpu, Zap, BrainCircuit, Globe, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const MODELS = [
  { id: "nvidia-nvidia/nemotron-3-super-120b-a12b", name: "Nemotron-3 Super 120B", provider: "NVIDIA", icon: Cpu, color: "text-green-400", desc: "Your Primary high-reasoning engine. Specialist in complex institutional data." },
  { id: "llama-3.3-70b-versatile", name: "Llama 3.3 70B Instruct", provider: "Meta", icon: Bot, color: "text-indigo-400", desc: "State-of-the-art versatile assistant on Groq hardware." },
  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash", provider: "Google", icon: Zap, color: "text-sky-400", desc: "Next-gen speed and multimodal intelligence." },
  { id: "qwen/qwen3-32b", name: "Qwen 2.5 72B Instruct", provider: "Alibaba", icon: Cpu, color: "text-orange-400", desc: "Leader in mathematical and logical reasoning benchmarks." },
  { id: "nvidia-nvidia/llama-3.1-nemotron-70b-instruct", name: "Llama 3.1 Nemotron 70B", provider: "NVIDIA", icon: BrainCircuit, color: "text-emerald-400", desc: "NVIDIA-tuned Llama model for superior alignment." },
  { id: "nvidia-mistralai/mistral-small-4-119b-2603", name: "Mistral Small 3.1 24B", provider: "Mistral", icon: Zap, color: "text-amber-400", desc: "Efficient, high-performance logic from the Mistral team." },
];

export default function AIPage() {
  const [selectedModel, setSelectedModel] = useState(MODELS[1]); // Default to Llama 3.3 for stability
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const textToSend = overrideText || inputValue;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, userMessage],
          modelId: selectedModel.id
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
    } catch (error: any) {
      setMessages((prev) => [...prev, { role: "assistant", content: `Error: ${error.message}. Please check your API keys.` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 h-[calc(100vh-160px)]">
        
        {/* Left Sidebar: Model Selection */}
        <div className="hidden lg:flex flex-col gap-6 h-full overflow-y-auto pr-4 custom-scrollbar">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40 mb-2">AI Control Center</h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-[0.2em]">Select Intelligence Engine</p>
          </div>

          <div className="space-y-3">
            {MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 relative group overflow-hidden ${
                  selectedModel.id === model.id 
                    ? "bg-white/5 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                    : "bg-transparent border-white/5 hover:border-white/10"
                }`}
              >
                {selectedModel.id === model.id && (
                  <motion.div 
                    layoutId="activeModel"
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" 
                  />
                )}
                <div className="flex items-center gap-3 mb-2 relative z-10">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    selectedModel.id === model.id ? "bg-white/10" : "bg-white/5"
                  }`}>
                    <model.icon className={`w-4 h-4 ${model.color}`} />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold">{model.name}</div>
                    <div className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">{model.provider}</div>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed relative z-10 group-hover:text-white/70 transition-colors">
                  {model.desc}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px] font-bold text-indigo-300">Live Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-muted-foreground">All systems operational</span>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3 flex flex-col bg-zinc-950/50 rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden relative backdrop-blur-3xl">
          
          {/* Header Mobile Only */}
          <div className="lg:hidden p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <selectedModel.icon className={`w-5 h-5 ${selectedModel.color}`} />
              <div>
                <div className="text-sm font-bold">{selectedModel.name}</div>
                <div className="text-[10px] text-muted-foreground uppercase">{selectedModel.provider}</div>
              </div>
            </div>
            <button 
              onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
              className="p-2 hover:bg-white/5 rounded-full"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${isModelMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 blur-3xl bg-purple-500/20 rounded-full" />
                  <Sparkles className="w-16 h-16 text-purple-400 relative z-10 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-3">AI Counseling Hub</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Welcome to the professional counseling AI. This engine has deep context about Bangalore colleges, placement stats, and KCET trends. Choose a brain on the left and start your journey.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                  <button 
                    onClick={() => handleSubmit(undefined, "Suggest me the best Tier 1 colleges for 10,000 rank.")}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 hover:border-white/20 transition-all text-left group"
                  >
                    <MessageSquare className="w-4 h-4 mb-2 text-indigo-400 group-hover:scale-110 transition-transform" />
                    Best Tier 1 colleges for 10k rank?
                  </button>
                  <button 
                    onClick={() => handleSubmit(undefined, "Compare the hostel life and campus at RVCE vs BMSCE.")}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 hover:border-white/20 transition-all text-left group"
                  >
                    <MessageSquare className="w-4 h-4 mb-2 text-rose-400 group-hover:scale-110 transition-transform" />
                    Hostel life: RVCE vs BMSCE?
                  </button>
                </div>
              </div>
            ) : (
              messages.map((message, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={i}
                  className={`flex gap-4 md:gap-6 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                    message.role === "user" ? "bg-zinc-800" : "bg-gradient-to-br from-indigo-500 to-purple-600"
                  }`}>
                    {message.role === "user" ? <User className="w-5 h-5" /> : <selectedModel.icon className="w-5 h-5" />}
                  </div>
                  <div className={`flex flex-col gap-2 max-w-[85%] md:max-w-[70%] ${
                    message.role === "user" ? "items-end" : ""
                  }`}>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                      {message.role === "user" ? "You" : selectedModel.name}
                    </div>
                    <div className={`p-4 md:p-5 rounded-[1.5rem] text-[15px] leading-relaxed whitespace-pre-wrap shadow-xl ${
                      message.role === "user" 
                        ? "bg-indigo-600 text-white rounded-tr-none" 
                        : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none backdrop-blur-md"
                    }`}>
                      {message.content}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-4 md:gap-6">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">AI Thinking...</div>
                  <div className="p-5 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center gap-2 rounded-tl-none">
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 md:p-8 bg-zinc-900/50 border-t border-white/5 backdrop-blur-xl">
            <form onSubmit={handleSubmit} className="relative group max-w-4xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2rem] blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
              <div className="relative flex items-center bg-zinc-950 border border-white/10 rounded-[2rem] p-2 pr-4 shadow-2xl">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={`Ask ${selectedModel.name} anything about colleges...`}
                  className="w-full bg-transparent border-none py-4 pl-6 pr-12 text-sm focus:outline-none focus:ring-0 placeholder:text-zinc-600"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="p-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 disabled:grayscale transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-600/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
            <p className="text-center text-[10px] text-muted-foreground mt-4">
              Our AI can make mistakes. Always verify cutoff data in the <a href="/cutoffs" className="text-primary hover:underline">Cutoff Explorer</a>.
            </p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}} />
    </div>
  );
}
