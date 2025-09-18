const fs = require("fs");
const path = require("path");

// Remove markdown comments and unnecessary lines
function cleanOutput(raw) {
  return raw
    .replace(/^\[Comment\]:.*$/gm, "")
    .replace(/^\s*(typescript|javascript|json|vue|bash|tex|yaml|tsx)\s*$/gim, "")
    .replace(/^##\s.*$/gm, "")
    .replace(/^\[```\]:.*$/gm, "")
    .trim();
}

// Parse code blocks and handle multiple files per block
function parseAndCreateFilesFromGptOss(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const cleaned = cleanOutput(raw);

  // Match all code blocks
  const codeBlockRegex = /```[a-zA-Z]*\s*\n([\s\S]*?)```/g;
  let blockMatch;
  let totalCount = 0;

  while ((blockMatch = codeBlockRegex.exec(cleaned)) !== null) {
    const blockContent = blockMatch[1].trim();

    // Split block by lines that look like: // path/to/file.ts
    const fileSplitRegex = /^\/\/\s*([^\n\r]+)\s*$/gm;
    let fileMatch;
    let lastIndex = 0;
    let files = [];

    // Find all file headers in the block
    while ((fileMatch = fileSplitRegex.exec(blockContent)) !== null) {
      files.push({
        filename: fileMatch[1].trim(),
        start: fileMatch.index + fileMatch[0].length,
      });
    }

    // If no file headers, skip this block
    if (files.length === 0) continue;

    // For each file, extract its content
    for (let i = 0; i < files.length; i++) {
      const start = files[i].start;
      const end = i + 1 < files.length ? files[i + 1].start - files[i + 1].filename.length - 4 : blockContent.length;
      const content = blockContent.slice(start, end).trim();

      if (!files[i].filename || !content) {
        console.warn(`⚠️ Skipped invalid block for filename: ${files[i].filename}`);
        continue;
      }

      const fullPath = path.join(__dirname, files[i].filename);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, content, "utf-8");
      console.log(`✅ Created: ${files[i].filename}`);
      totalCount++;
    }
  }

  if (totalCount === 0) {
    console.warn("⚠️ No valid files found. Check markdown format.");
  }
}

// Change the path below to your actual markdown file
parseAndCreateFilesFromGptOss("C:/Users/Admin/OneDrive - Swinburne University/Documents/IT SWIN COURSE/Lab Software/Llama/llama4 (1).md");