const fs = require('fs');
const pt = 'f:/shivani/VSCode/projects/Oracle/darkagent/frontend/src/pages/darkagent/CreateBlinkPage.jsx';
let content = fs.readFileSync(pt, 'utf8');

content = content.replace("  const [copied, setCopied] = useState(false)\n", "");
content = content.replaceAll("    setCopied(false)\n", "");

const oldGen = \  async function generateBlink() {
    await ensureShareLink()
    setPosted(false)
  }\;

const newGen = \  async function generateBlink() {
    const payload = await ensureShareLink()
    setPosted(false)
    if (payload?.share?.id) {
      navigate(\\"/analyze/\\" + payload.share.id)
    }
  }\;

content = content.replace(oldGen, newGen);

const oldCopy = \  async function copyBlink() {
    const payload = await ensureShareLink()
    await navigator.clipboard.writeText(payload.shareUrl)
    setCopied(true)
  }

\;
content = content.replace(oldCopy, "");

const buttonRegex = /<GlowButton onClick=\{copyBlink\}.+?Copied' : 'Copy link'\}.+?<\/GlowButton>\n*/;
content = content.replace(buttonRegex, "");

// also pass empty to onCopy to not break TwitterShareDialog
content = content.replace(/onCopy=\{copyBlink\}/, "onCopy={() => {}}");

fs.writeFileSync(pt, content);
console.log("Fixed!");
