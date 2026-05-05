import fs from 'fs';
import path from 'path';

const dataPath = 'y:/KCET COLLEGE PREDICTOR/kcet-predictor/src/lib/data/colleges_unified.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const branches = data.branches.map(b => ({
    code: b.branch_code || b.branch_id,
    name: b.branch_name
})).filter(b => b.code && b.name && !b.name.includes('--'));

// Sort by code
branches.sort((a, b) => a.code.localeCompare(b.code));

console.log('| Branch Code | Branch Name |');
console.log('|-------------|-------------|');
branches.forEach(b => {
    console.log(`| ${b.code} | ${b.name} |`);
});
