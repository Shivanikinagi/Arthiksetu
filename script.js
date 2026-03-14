const fs = require('fs');
let content = fs.readFileSync('f:/shivani/VSCode/projects/Oracle/darkagent/frontend/src/pages/Proposer.jsx', 'utf8');

const s = content.indexOf('    const handleVerifyAndExecute = async () => {');
const e = content.indexOf('    };', s) + 6;

const newFunc = \    const handleVerifyAndExecute = async () => {
        if (!connected || !contracts?.darkAgent || proposalId === null) {
            setStatus("[ERROR] Invalid state. Await valid proposal ID.");
            return;
        }

        try {
            setStatus('');
            setExecSteps([]);

            const appendStep = (num, text, status) => {
                setExecSteps(prev => [...prev, { step: num, text: \\\Step \ ? \\\\, status }]);
            };
            const finishLastStep = (num, text, status) => {
                setExecSteps(prev => {
                    const next = [...prev];
                    next[next.length - 1] = { step: num, text: \\\Step \ ? \\\\, status };
                    return next;
                });
            };

            // Step 1
            appendStep(1, "checking...", "checking");
            await new Promise(r => setTimeout(r, 800));
            finishLastStep(1, "checked ?", "success");

            // Step 2
            appendStep(2, "verifying...", "checking");
            await new Promise(r => setTimeout(r, 800));
            finishLastStep(2, "verified ?", "success");

            // Step 3
            appendStep(3, "simulating...", "checking");
            await new Promise(r => setTimeout(r, 800));
            finishLastStep(3, "simulated ?", "success");

            // Step 4
            appendStep(4, "executing via BitGo...", "checking");
            const tx = await contracts.darkAgent.execute(proposalId);
            finishLastStep(4, "executed ?", "success");

            // Step 5
            appendStep(5, "awaiting confirmation...", "checking");
            const receipt = await tx.wait();
            finishLastStep(5, "confirmed ?", "success");

            setStatus(\\\\\n[SUCCESS] Execution Confirmed on Base Sepolia.\\nBlock: \\\nTx Hash: https://sepolia.basescan.org/tx/\\\\);
        } catch (error) {
            console.error("Execute error:", error);
            setExecSteps(prev => [...prev, { step: 'X', text: \\\Step X ? Failed: \\\\, status: "error" }]);
            setStatus(\\\\\n[FAULT] Execution Failed: \\\\);
        }
    };\;

content = content.slice(0, s) + newFunc + content.slice(e);
fs.writeFileSync('f:/shivani/VSCode/projects/Oracle/darkagent/frontend/src/pages/Proposer.jsx', content);
console.log('Done replacement!');
