
// Improved check.js: Extract all file and folder paths from markdown, compare to actual workspace
const fs = require("fs");
const path = require("path");

const mdPath = "C:/Users/Admin/OneDrive - Swinburne University/Documents/IT SWIN COURSE/Lab Software/Llama/llama4 (1).md"; 
const md = fs.readFileSync(mdPath, "utf-8");

// 1. Extract all file paths from code blocks (multiple files per block)
const codeBlockRegex = /```[a-zA-Z]*\s*\n([\s\S]*?)```/g;
let codeBlockMatch;
let allFiles = [];
while ((codeBlockMatch = codeBlockRegex.exec(md)) !== null) {
  const block = codeBlockMatch[1];
  // Find all lines like: // path/to/file.ts
  const fileHeaderRegex = /^\/\/\s*([^\n\r]+)\s*$/gm;
  let fileMatch;
  let fileHeaders = [];
  while ((fileMatch = fileHeaderRegex.exec(block)) !== null) {
    fileHeaders.push({
      filename: fileMatch[1].trim(),
      start: fileMatch.index + fileMatch[0].length
    });
  }
  // If multiple files in block, add all
  for (let i = 0; i < fileHeaders.length; i++) {
    allFiles.push(fileHeaders[i].filename);
  }
}

// 2. Also check for any explicit file paths in text (inline code)
const inlineRegex = /`([a-zA-Z0-9_\-\/\.]+?\.(ts|tsx|js|json))`/g;
let inlineMatch;
while ((inlineMatch = inlineRegex.exec(md)) !== null) {
  if (!allFiles.includes(inlineMatch[1])) allFiles.push(inlineMatch[1]);
}

// 3. Remove duplicates and sort
const uniqueFiles = [...new Set(allFiles)].sort();

// 4. Get all actual files in workspace recursively (relative to __dirname)
function getAllFiles(dir, baseDir = dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const relPath = path.relative(baseDir, filePath).replace(/\\/g, "/");
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, baseDir));
    } else {
      results.push(relPath);
    }
  }
  return results;
}

// Only check files under these root folders (to avoid node_modules etc)
const roots = ["backend", "frontend", "modules"];
let actualFiles = [];
for (const root of roots) {
  const absRoot = path.join(__dirname, root);
  if (fs.existsSync(absRoot)) {
    actualFiles = actualFiles.concat(getAllFiles(absRoot, __dirname));
  }
}
actualFiles = actualFiles.sort();

// 5. Compare
const missing = uniqueFiles.filter(f => !actualFiles.includes(f));
const extra = actualFiles.filter(f => !uniqueFiles.includes(f));


console.log("\n=== Files referenced in markdown but missing in workspace ===");
if (missing.length === 0) {
  console.log("✅ None! All referenced files exist.");
} else {
  for (const f of missing) {
    console.log("❌ MISSING:", f);
    // Create missing folders and empty files
    const absPath = path.join(__dirname, f);
    try {
      fs.mkdirSync(path.dirname(absPath), { recursive: true });
      if (!fs.existsSync(absPath)) {
        fs.writeFileSync(absPath, "", "utf-8");
        console.log("  ➕ Created:", f);
      }
    } catch (err) {
      console.error("  ⚠️ Error creating:", f, err);
    }
  }
}

console.log("\n=== Files present in workspace but NOT referenced in markdown ===");
if (extra.length === 0) {
  console.log("✅ None! No extra files.");
} else {
  for (const f of extra) console.log("⚠️ EXTRA:", f);
}

console.log("\n=== Summary ===");
console.log(`Markdown referenced: ${uniqueFiles.length} files\nWorkspace present: ${actualFiles.length} files`);
if (missing.length === 0 && extra.length === 0) {
  console.log("All files match between markdown and workspace.");
} else {
  if (missing.length > 0) console.log(`${missing.length} files missing.`);
  if (extra.length > 0) console.log(`${extra.length} extra files.`);
}
    

