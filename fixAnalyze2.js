const fs = require('fs');
const pt = 'f:/shivani/VSCode/projects/Oracle/darkagent/frontend/src/pages/darkagent/AnalyzeBlinkPage.jsx';
let content = fs.readFileSync(pt, 'utf8');

const replaceStr = \              </SectionCard>


            </div>\;

const newStr = \                <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                  <GlowButton onClick={() => setExecutionOpen(true)} disabled={verdict.status === 'blocked'} className="bg-vault-green text-black hover:bg-vault-green/90 disabled:cursor-not-allowed disabled:opacity-50">
                    <Wallet className="h-4 w-4" /> Continue
                  </GlowButton>
                  <GlowButton as={Link} to="/dashboard" className="border border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.08]">
                    Edit policy
                  </GlowButton>
                </div>
              </SectionCard>
            </div>\;

content = content.replace(replaceStr, newStr);
fs.writeFileSync(pt, content);
console.log("Fixed Continue button");
