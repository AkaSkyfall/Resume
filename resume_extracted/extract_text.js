const fs = require('fs');
const xml = fs.readFileSync('resume_extracted/word/document_backup.xml', 'utf8');
const t = xml
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/\s+/g, ' ');
fs.writeFileSync('resume_text.txt', t);
console.log('Done, length=' + t.length);
