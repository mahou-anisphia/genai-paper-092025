const fs = require("fs");
const path = require("path");

// Clean out markdown-style comments or annotations
function cleanOutput(raw) {
  return raw
    .replace(/^\[Comment\]:.*$/gm, '') // remove markdown-style comments
    .replace(/^\s*(typescript|javascript|json|vue|bash|tex|yaml)\s*$/gim, '') // remove stray language labels
    .replace(/^##\s.*$/gm, '')
    .replace(/^\[```\]:.*$/gm, '')
    .trim();
}

function parseAndCreateFilesFromTextFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const cleaned = cleanOutput(raw);

  // Allow for optional blank lines between filename and code block
  const blockRegex = /###\s+([^\r\n]+)[\r\n]+```[a-zA-Z]*[\r\n]+([\s\S]*?)```/g;
  let match;
  let count = 0;

  while ((match = blockRegex.exec(cleaned)) !== null) {
    const filename = match[1].trim();
    const content = match[2].trim();

    if (!filename || !content) {
      console.warn(`⚠️ Skipped invalid block for filename: ${filename}`);
      continue;
    }

    const fullPath = path.join(__dirname, filename);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf-8");
    console.log(`✅ Created: ${filename}`);
    count++;
  }

  if (count === 0) {
    console.warn("⚠️ No valid blocks found. Check markdown format.");
  }
}

parseAndCreateFilesFromTextFile("C:/Users/Admin/OneDrive - Swinburne University/Documents/IT SWIN COURSE/Claude Output/claude.md");