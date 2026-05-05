import fs from 'fs';

const dataPath = 'y:/KCET COLLEGE PREDICTOR/kcet-predictor/src/lib/data/colleges_unified.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const branchesRaw = data.branches.map(b => ({
    code: b.branch_code || b.branch_id,
    name: b.branch_name
})).filter(b => b.code && b.name && !b.name.includes('--'));

function getSuperNormalizedName(name) {
    if (!name) return '';
    let n = name.toUpperCase()
        .replace(/^B\.?TECH\s+IN\s+/i, '')
        .replace(/^BTECH\s+IN\s+/i, '')
        .replace(/^B\.\s*TECH\s+/i, '')
        .replace(/ENGINEERING/g, 'ENGG')
        .replace(/AND/g, '&')
        .replace(/\s+/g, ' ')
        .replace(/[()]/g, '')
        .trim();
    
    // Group all variations of core branches
    if (n.includes('COMPUTER SCIENCE') || n === 'COMPUTER SCIENCE' || n === 'COMPUTER SCIENCE & ENGG' || n === 'CS') return 'COMPUTER SCIENCE & ENGG';
    if (n.includes('INFORMATION SCIENCE') || n === 'INFORMATION SCIENCE' || n === 'INFORMATION SCIENCE & ENGG' || n === 'IS') return 'INFORMATION SCIENCE & ENGG';
    if (n.includes('ELECTRONICS & COMMUNICATION') || n === 'ECE') return 'ELECTRONICS & COMMUNICATION ENGG';
    if (n.includes('MECHANICAL') || n === 'MECH') return 'MECHANICAL ENGG';
    if (n.includes('CIVIL')) return 'CIVIL ENGG';
    if (n.includes('ELECTRICAL & ELECTRONICS') || n === 'EEE') return 'ELECTRICAL & ELECTRONICS ENGG';
    if (n.includes('ARTIFICIAL INTELLIGENCE') && n.includes('DATA SCIENCE')) return 'AI & DATA SCIENCE';
    if (n.includes('ARTIFICIAL INTELLIGENCE') && n.includes('MACHINE LEARNING')) return 'AI & MACHINE LEARNING';
    if (n.includes('ELECTRONICS & INSTRUMENTATION')) return 'ELECTRONICS & INSTRUMENTATION ENGG';
    
    return n;
}

const uniqueBranches = {};

branchesRaw.forEach(b => {
    const superNorm = getSuperNormalizedName(b.name);
    
    // Prefer shorter codes or standard codes
    const standardCodes = ['CSE', 'ISE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'AIML', 'AIDS', 'ETE', 'BT', 'CHEM'];
    
    if (!uniqueBranches[superNorm]) {
        uniqueBranches[superNorm] = b.code;
    } else {
        // If current code is a standard one, prefer it
        if (standardCodes.includes(b.code)) {
            uniqueBranches[superNorm] = b.code;
        } else if (b.code.length < uniqueBranches[superNorm].length && !standardCodes.includes(uniqueBranches[superNorm])) {
            // Otherwise prefer shorter code
            uniqueBranches[superNorm] = b.code;
        }
    }
});

const finalSorted = Object.entries(uniqueBranches).sort((a, b) => a[1].localeCompare(b[1]));

console.log('| Final Code | Representative Branch Name |');
console.log('| :--- | :--- |');
finalSorted.forEach(([name, code]) => {
    console.log(`| **${code}** | ${name} |`);
});
