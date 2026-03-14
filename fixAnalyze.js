const fs = require('fs');
const pt = 'f:/shivani/VSCode/projects/Oracle/darkagent/frontend/src/pages/darkagent/AnalyzeBlinkPage.jsx';
let content = fs.readFileSync(pt, 'utf8');

// remove Why this verdict block
const verdictRegex = /<div className="mt-5 rounded-2xl border border-white\/8 bg-black\/20 p-4">[\s\S]*?<div className="text-xs uppercase tracking-\[0\.24em\] text-vault-slate">Why this verdict<\/div>[\s\S]*?<\/div>\s*<\/div>/;
content = content.replace(verdictRegex, '');

// remove the right column
const rightColumnRegex = /<div className="grid gap-5">[\s\S]*?<SectionCard>[\s\S]*?Execution[\s\S]*?<\/SectionCard>[\s\S]*?<SectionCard>[\s\S]*?Source taken from the Blink\.[\s\S]*?<\/SectionCard>[\s\S]*?<\/div>/;
content = content.replace(rightColumnRegex, '');

// make layout full
content = content.replace('lg:grid-cols-[1.08fr_0.92fr]', 'max-w-4xl mx-auto w-full');

fs.writeFileSync(pt, content);
console.log("Fixed Analyze");
