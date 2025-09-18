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

// Parse markdown and create all referenced folders and files (supports **path/to/file** + code block)
function parseAndCreateAllFromMarkdown(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  const cleaned = cleanOutput(raw);

  // Find all **path/to/file** followed by code block
  const fileBlockRegex = /\*\*([^*\n]+)\*\*\s*\n+```[a-zA-Z]*\s*\n([\s\S]*?)```/g;
  let match;
  let allFiles = [];
  let fileContents = {};
  while ((match = fileBlockRegex.exec(cleaned)) !== null) {
    const filename = match[1].trim();
    const content = match[2].replace(/\s+$/, "");
    allFiles.push(filename);
    fileContents[filename] = content;
  }

  // Also check for any explicit file paths in text (inline code)
  const inlineRegex = /`([a-zA-Z0-9_\-\/\.]+?\.(ts|tsx|js|json))`/g;
  let inlineMatch;
  while ((inlineMatch = inlineRegex.exec(cleaned)) !== null) {
    if (!allFiles.includes(inlineMatch[1])) allFiles.push(inlineMatch[1]);
  }

  // Remove duplicates and sort
  const uniqueFiles = [...new Set(allFiles)].sort();

  // Extract all FOLDER paths from file paths
  let allFolders = new Set();
  for (const file of uniqueFiles) {
    const parts = file.split("/");
    for (let i = 1; i < parts.length; i++) {
      allFolders.add(parts.slice(0, i).join("/"));
    }
  }
  const uniqueFolders = Array.from(allFolders).sort();

  // Create all folders
  for (const folder of uniqueFolders) {
    const fullPath = path.join(__dirname, folder);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`📁 Created folder: ${folder}`);
    }
  }

  // Create all files (with content if available, else empty)
  let totalCount = 0;
  for (const file of uniqueFiles) {
    const fullPath = path.join(__dirname, file);
    const content = fileContents[file] || "";
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, "utf-8");
    console.log(`✅ Created file: ${file}`);
    totalCount++;
  }

  if (totalCount === 0 && uniqueFolders.length === 0) {
    console.warn("⚠️ No valid files or folders found. Check markdown format.");
  }
}

// Change the path below to your actual markdown file
parseAndCreateAllFromMarkdown("C:/Users/Admin/OneDrive - Swinburne University/Documents/IT SWIN COURSE/Lab Software/phi4/phi4 (1).md");