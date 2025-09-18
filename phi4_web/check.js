
// check.js: Extract all file and folder paths from markdown, compare to actual workspace (entire folder)
const fs = require("fs");
const path = require("path");

const mdPath = "C:/Users/Admin/OneDrive - Swinburne University/Documents/IT SWIN COURSE/Lab Software/PHI4/phi4 (1).md"; // Adjust if needed
const md = fs.readFileSync(mdPath, "utf-8");


// 1. Extract all file paths using **path/to/file** followed by code block
const fileBlockRegex = /\*\*([^*\n]+)\*\*\s*\n+```[a-zA-Z]*\s*\n([\s\S]*?)```/g;
let match;
let allFiles = [];
while ((match = fileBlockRegex.exec(md)) !== null) {
  const filename = match[1].trim();
  allFiles.push(filename);
}

// 2. Also check for any explicit file paths in text (inline code)
const inlineRegex = /`([a-zA-Z0-9_\-\/\.]+?\.(ts|tsx|js|json))`/g;
let inlineMatch;
while ((inlineMatch = inlineRegex.exec(md)) !== null) {
  if (!allFiles.includes(inlineMatch[1])) allFiles.push(inlineMatch[1]);
}

// 3. Remove duplicates and sort
const uniqueFiles = [...new Set(allFiles)].sort();

// 4. Extract all FOLDER paths from file paths
let allFolders = new Set();
for (const file of uniqueFiles) {
  const parts = file.split("/");
  for (let i = 1; i < parts.length; i++) {
    allFolders.add(parts.slice(0, i).join("/"));
  }
}
const uniqueFolders = Array.from(allFolders).sort();

// 5. Get all actual files and folders in workspace recursively (relative to __dirname)
function getAllFilesAndFolders(dir, baseDir = dir) {
  let files = [];
  let folders = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const relPath = path.relative(baseDir, filePath).replace(/\\/g, "/");
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      folders.push(relPath);
      const { files: subFiles, folders: subFolders } = getAllFilesAndFolders(filePath, baseDir);
      files = files.concat(subFiles);
      folders = folders.concat(subFolders);
    } else {
      files.push(relPath);
    }
  }
  return { files, folders };
}

const { files: actualFiles, folders: actualFolders } = getAllFilesAndFolders(__dirname, __dirname);
const sortedActualFiles = actualFiles.sort();
const sortedActualFolders = actualFolders.sort();

// 6. Compare
const missingFiles = uniqueFiles.filter(f => !sortedActualFiles.includes(f));
const extraFiles = sortedActualFiles.filter(f => !uniqueFiles.includes(f));
const missingFolders = uniqueFolders.filter(f => !sortedActualFolders.includes(f));
const extraFolders = sortedActualFolders.filter(f => !uniqueFolders.includes(f));

console.log("\n=== Files referenced in markdown but missing in workspace ===");
if (missingFiles.length === 0) {
  console.log("✅ None! All referenced files exist.");
} else {
  for (const f of missingFiles) console.log("❌ MISSING FILE:", f);
}

console.log("\n=== Folders referenced in markdown but missing in workspace ===");
if (missingFolders.length === 0) {
  console.log("✅ None! All referenced folders exist.");
} else {
  for (const f of missingFolders) console.log("❌ MISSING FOLDER:", f);
}

console.log("\n=== Files present in workspace but NOT referenced in markdown ===");
if (extraFiles.length === 0) {
  console.log("✅ None! No extra files.");
} else {
  for (const f of extraFiles) console.log("⚠️ EXTRA FILE:", f);
}

console.log("\n=== Folders present in workspace but NOT referenced in markdown ===");
if (extraFolders.length === 0) {
  console.log("✅ None! No extra folders.");
} else {
  for (const f of extraFolders) console.log("⚠️ EXTRA FOLDER:", f);
}

console.log("\n=== Summary ===");
console.log(`Markdown referenced: ${uniqueFiles.length} files, ${uniqueFolders.length} folders\nWorkspace present: ${sortedActualFiles.length} files, ${sortedActualFolders.length} folders`);
if (missingFiles.length === 0 && extraFiles.length === 0 && missingFolders.length === 0 && extraFolders.length === 0) {
  console.log("All files and folders match between markdown and workspace.");
} else {
  if (missingFiles.length > 0) console.log(`${missingFiles.length} files missing.`);
  if (extraFiles.length > 0) console.log(`${extraFiles.length} extra files.`);
  if (missingFolders.length > 0) console.log(`${missingFolders.length} folders missing.`);
  if (extraFolders.length > 0) console.log(`${extraFolders.length} extra folders.`);
}
    

