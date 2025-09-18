





const fs = require("fs");
const path = require("path");

const mdPath = path.join(__dirname, "gemma3 (1).md");
const md = fs.readFileSync(mdPath, "utf-8");

function parseAndCreateFilesFromGemmaMD(md) {
  let created = 0;
  let files = new Set();

  // Split into lines for easier processing
  const lines = md.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    // Look for lines like: `modules/customer.ts`:
    const fileLine = lines[i].match(/^`([^`]+)`:/);
    if (fileLine) {
      const filename = fileLine[1].trim();
      // Tolerate up to 2 blank lines before code block
      let codeStart = -1;
      let j = i + 1;
      let blankCount = 0;
      while (j < lines.length && blankCount <= 2) {
        if (/^```([a-zA-Z]*)\s*$/.test(lines[j])) {
          codeStart = j;
          break;
        }
        if (lines[j].trim() === "") blankCount++;
        else break;
        j++;
      }
      if (codeStart !== -1) {
        // Find end of code block
        let codeEnd = -1;
        for (let k = codeStart + 1; k < lines.length; k++) {
          if (lines[k].startsWith("```")) {
            codeEnd = k;
            break;
          }
        }
        if (codeEnd !== -1) {
          const content = lines.slice(codeStart + 1, codeEnd).join("\n");
          const fullPath = path.join(__dirname, filename);
          fs.mkdirSync(path.dirname(fullPath), { recursive: true });
          fs.writeFileSync(fullPath, content, "utf-8");
          console.log(`✅ Created: ${filename}`);
          files.add(filename);
          created++;
          i = codeEnd; // Skip to end of code block
        } else {
          console.warn(`⚠️ Found filename (${filename}) but no closing code block after line ${i+1}`);
        }
      } else {
        console.warn(`⚠️ Found filename (${filename}) but no code block after line ${i+1}`);
      }
    }
  }
  if (created === 0) {
    console.warn("⚠️ No valid code blocks with filenames found. Check markdown format.");
  }
}

parseAndCreateFilesFromGemmaMD(md);