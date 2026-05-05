import fs from 'fs';
import path from 'path';

const dataPath = 'y:/KCET COLLEGE PREDICTOR/kcet-predictor/src/lib/data/colleges_unified.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const branches = data.branches.map(b => ({
    code: b.branch_code || b.branch_id,
    name: b.branch_name
})).filter(b => b.code && b.name && !b.name.includes('--'));

function normalize(name) {
    if (!name) return '';
    return name.toUpperCase()
        .replace(/^B\.?TECH\s+IN\s+/i, '')
        .replace(/^BTECH\s+IN\s+/i, '')
        .replace(/^B\.\s*TECH\s+/i, '')
        .replace(/ENGINEERING/g, 'ENGG')
        .replace(/\s+/g, ' ')
        .replace(/[()]/g, '')
        .trim();
}

const groups = {};

branches.forEach(b => {
    const norm = normalize(b.name);
    if (!groups[norm]) {
        groups[norm] = [];
    }
    groups[norm].push(b);
});

console.log('# Grouped Branches (Aliases Detected)');
console.log('');

Object.keys(groups).sort().forEach(norm => {
    const members = groups[norm];
    if (members.length > 1) {
        console.log(`## ${norm}`);
        members.forEach(m => {
            console.log(`- **${m.code}**: ${m.name}`);
        });
        console.log('');
    }
});
