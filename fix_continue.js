const fs = require('fs');
const pt = 'f:/shivani/VSCode/projects/Oracle/darkagent/frontend/src/pages/darkagent/AnalyzeBlinkPage.jsx';
let content = fs.readFileSync(pt, 'utf8');

content = content.replace("disabled={verdict.status === 'blocked'} ", "");

fs.writeFileSync(pt, content);
console.log("Fixed Continue");
