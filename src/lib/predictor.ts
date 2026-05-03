import { 
  College, 
  Branch, 
  CollegeBranch, 
  CutoffData, 
  PredictionResult, 
  PredictorInput 
} from "./types";

import branchesData from "./data/branches.json";
import collegeBranchesData from "./data/college_branches.json";
import cutoffData from "./data/cutoff_data.json";

// Cast JSON data to types
const branches = branchesData as Branch[];
const collegeBranches = collegeBranchesData as CollegeBranch[];
const cutoffs = cutoffData as CutoffData[];

// Create lookups for performance (branches and mappings remain static)
const branchLookup = new Map(branches.map(b => [b.branch_id, b]));
const cbLookup = new Map(collegeBranches.map(cb => [cb.id, cb]));

function calculateProbability(rank: number, cutoff: number): number {
  const ratio = rank / cutoff;
  if (ratio < 0.5) return 99;
  if (ratio < 0.9) return Math.round(99 - (ratio - 0.5) * 40);
  if (ratio < 1.0) return Math.round(80 - (ratio - 0.9) * 150);
  if (ratio < 1.1) return Math.round(50 - (ratio - 1.0) * 200);
  return Math.max(5, Math.round(30 - (ratio - 1.1) * 100));
}

export function predictColleges(input: PredictorInput, liveColleges: College[]) {
  // Create dynamic lookup for live colleges
  const collegeLookup = new Map(liveColleges.map(c => [c.college_id, c]));

  // 1. Identify valid combinations
  const validCbIds = new Set<string>();
  for (const cb of collegeBranches) {
    const college = collegeLookup.get(cb.college_id);
    if (!college) continue;
    
    const branchMatch = input.branches.length === 0 || input.branches.includes(cb.branch_id);
    const collegeMatch = input.colleges.length === 0 || input.colleges.includes(cb.college_id);
    const regionMatch = input.regions.length === 0 || input.regions.includes(college.region);
    
    if (branchMatch && collegeMatch && regionMatch) {
      validCbIds.add(cb.id);
    }
  }

  // 2. Filter cutoffs
  const relevantCutoffs = cutoffs.filter(c => 
    c.round === input.round && 
    c.hk_quota === input.hk_quota &&
    validCbIds.has(c.college_branch_id)
  );

  // 3. Group by college_branch_id
  const cutoffsByCb = new Map<string, CutoffData[]>();
  for (const c of relevantCutoffs) {
    if (!cutoffsByCb.has(c.college_branch_id)) {
      cutoffsByCb.set(c.college_branch_id, []);
    }
    cutoffsByCb.get(c.college_branch_id)!.push(c);
  }

  const safe: PredictionResult[] = [];
  const moderate: PredictionResult[] = [];
  const dream: PredictionResult[] = [];

  // 4. Determine effectiveness
  for (const [cbId, cbCutoffs] of cutoffsByCb.entries()) {
    let effectiveCutoff = 0;
    let isFallback = false;

    const exactMatch = cbCutoffs.find(c => c.category === input.category);
    const gmMatch = cbCutoffs.find(c => c.category === 'GM');

    if (exactMatch) {
      effectiveCutoff = exactMatch.closing_rank;
    } else if (gmMatch) {
      effectiveCutoff = gmMatch.closing_rank;
      isFallback = true;
    } else {
      effectiveCutoff = Math.max(...cbCutoffs.map(c => c.closing_rank));
      isFallback = true;
    }

    const cb = cbLookup.get(cbId)!;
    const college = collegeLookup.get(cb.college_id)!;
    const branch = branchLookup.get(cb.branch_id)!;

    const prob = calculateProbability(input.rank, effectiveCutoff);

    const result: PredictionResult = {
      college,
      branch,
      closing_rank: effectiveCutoff,
      level: "dream",
      probability: prob,
      isFallback
    };

    if (prob >= 80) {
      result.level = "safe";
      safe.push(result);
    } else if (prob >= 50) {
      result.level = "moderate";
      moderate.push(result);
    } else {
      result.level = "dream";
      dream.push(result);
    }
  }

  const sortByRank = (a: PredictionResult, b: PredictionResult) => a.closing_rank - b.closing_rank;
  
  return {
    safe: safe.sort(sortByRank),
    moderate: moderate.sort(sortByRank),
    dream: dream.sort(sortByRank),
  };
}

export function getRoundDetails(collegeBranchId: string, category: string, gender: string) {
    const rounds = cutoffs.filter(c => 
        c.college_branch_id === collegeBranchId && 
        c.category === category && 
        c.gender === gender
    );
    return rounds.sort((a, b) => a.round - b.round);
}

export function getLevelColor(level: string) {
  switch (level) {
    case "safe": return "text-emerald-400";
    case "moderate": return "text-amber-400";
    default: return "text-rose-400";
  }
}

export function getLevelBg(level: string) {
  switch (level) {
    case "safe": return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
    case "moderate": return "bg-amber-500/10 border-amber-500/30 text-amber-400";
    default: return "bg-rose-500/10 border-rose-500/30 text-rose-400";
  }
}

export const CATEGORIES = ["1G", "1K", "1R", "2AG", "2AK", "2AR", "2BG", "2BK", "2BR", "3AG", "3AK", "3AR", "3BG", "3BK", "3BR", "GM", "GMK", "GMR", "SCG", "SCK", "SCR", "STG", "STK", "STR"];

export const BRANCHES = branches.map(b => ({ id: b.branch_id, name: b.branch_name }));

export const CS_IT_BRANCHES = ['COMP', 'INFO', 'ARTI', 'AIML', 'DATS', 'CYBE', 'BTEC'];
export const CORE_BRANCHES = ['MECH', 'CIVI', 'ELEE', 'ELEC', 'CHEM', 'BIOT', 'INDU'];

export const TOP_5_COLLEGES = ['E005', 'E009', 'E006', 'E003', 'E001'];
export const TOP_10_COLLEGES = ['E005', 'E009', 'E006', 'E003', 'E001', 'E007', 'E008', 'E022', 'E021', 'E103'];
