const fs = require('fs');
const xml = fs.readFileSync(
  'C:/Users/AkashSingh/idbi_uat_angular_cordova/jira-auto/resume_extracted/word/document_backup.xml',
  'utf8'
);

// Section boundaries (sectPr inside paragraphs)
const sectPrPositions = [];
let p = 0;
while (true) {
  const i = xml.indexOf('<w:sectPr', p);
  if (i < 0) break;
  sectPrPositions.push(i);
  p = i + 1;
}
console.log('Section boundaries at:', sectPrPositions);

// Find the empty/spacer BodyText paragraphs in the Skills sidebar
// (between position 0 and ~18000 = before summary)
const skillsRegion = xml.substring(0, 18200);
// Look for BodyText paragraphs that contain no <w:t> text
let pos2 = 0;
const emptyParas = [];
while (true) {
  const pStart = skillsRegion.indexOf('<w:p>', pos2);
  if (pStart < 0) break;
  const pEnd = skillsRegion.indexOf('</w:p>', pStart) + 6;
  const para = skillsRegion.substring(pStart, pEnd);
  if (!para.includes('<w:t>')) {
    emptyParas.push({ pos: pStart, xml: para });
  }
  pos2 = pEnd;
}
console.log('\nEmpty paragraphs in Skills area (first 18200 bytes):');
emptyParas.forEach(e => console.log('  pos:', e.pos, 'xml:', e.xml.substring(0, 150)));

// Also look for empty paragraphs in last section (after 64930) but before Baxter (93903)
const lastSectionRegion = xml.substring(64930, 93903);
let pos3 = 0;
const emptyParas2 = [];
while (true) {
  const pStart = lastSectionRegion.indexOf('<w:p>', pos3);
  if (pStart < 0) break;
  const pEnd = lastSectionRegion.indexOf('</w:p>', pStart) + 6;
  const para = lastSectionRegion.substring(pStart, pEnd);
  if (!para.includes('<w:t>')) {
    emptyParas2.push({ pos: 64930 + pStart, xml: para });
  }
  pos3 = pEnd;
}
console.log('\nEmpty paragraphs in last section before Baxter (64930-93903):');
emptyParas2.forEach(e => console.log('  pos:', e.pos, 'xml:', e.xml.substring(0, 150)));
