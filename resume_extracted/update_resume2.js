const fs = require('fs');

let xml = fs.readFileSync(
  'C:/Users/AkashSingh/idbi_uat_angular_cordova/jira-auto/resume_extracted/word/document.xml',
  'utf8'
);

// ============================================================
// 1. REPLACE SUMMARY TEXT
// The summary is one continuous <w:t> run (first chunk) followed by word-split runs.
// Replace the entire paragraph's text content with new summary.
// ============================================================

const oldSummaryStart = 'Experienced Angular Developer with over 4.4+ years of hands-on experience in designing, developing, and maintaining web and embedded applications. Proven expertise in Angular framework, with a strong understanding of frontend';
const summaryStartIdx = xml.indexOf(oldSummaryStart);

// The summary paragraph ends at </w:p> after this text
const summaryParaEnd = xml.indexOf('</w:p>', summaryStartIdx) + '</w:p>'.length;
const summaryParaStart = xml.lastIndexOf('<w:p>', summaryStartIdx);

const oldSummaryPara = xml.substring(summaryParaStart, summaryParaEnd);

// New summary paragraph — single clean run like the original structure
const newSummaryPara = `<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:line="259" w:lineRule="auto" w:before="109"/><w:ind w:left="180" w:right="302"/><w:jc w:val="both"/></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>Experienced Angular Developer with 4.4+ years of hands-on experience designing, developing, and maintaining web, mobile, and embedded banking applications. Currently leading the migration of IDBI Bank&#x2019;s Go Mobile+ and OMNI applications from AngularJS to Angular 21 for Android, iOS, and Web platforms at SnapWork. Previously at Capgemini, delivered mission-critical frontend features across medical device applications for TerumoBCT. Proficient in Angular, RxJS, TypeScript, and Cordova, with expertise in Core Java, Agile methodologies, and AI-assisted development tools. Track record of Angular version upgrades (v7 to v21), cross-platform delivery, and maintaining zero-vulnerability codebases.</w:t></w:r></w:p>`;

if (oldSummaryPara) {
  xml = xml.replace(oldSummaryPara, newSummaryPara);
  console.log('1. Summary updated');
} else {
  console.log('1. WARN: summary paragraph not found');
}

// ============================================================
// 2. REORDER PROJECTS: IDBI (1st) → Terumo (2nd) → Baxter (3rd)
//
// Strategy: extract the three project blocks, remove them from
// their current positions, then reinsert in correct order at
// the start of the project list (right after PROJECT heading).
// ============================================================

// After update_resume.js, IDBI was inserted BEFORE Baxter.
// Current order in XML: Terumo ... Baxter spacer + IDBI block + Baxter
// We need: IDBI → Terumo → Baxter

// Markers to find project block boundaries
const LIST_PARA = '<w:p><w:pPr><w:pStyle w:val="ListParagraph"><w:numPr>';
// All three project bold-title paragraphs start with this ListParagraph pattern with numId=4
const LP4 = '<w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="4"/>';

// Find all LP4 positions
let searchFrom = 0;
const lp4Positions = [];
while (true) {
  const pos = xml.indexOf(LP4, searchFrom);
  if (pos === -1) break;
  lp4Positions.push(pos);
  searchFrom = pos + 1;
}
console.log('LP4 positions:', lp4Positions);

// The project heading (PROJECT) comes right before the first project
const projectHeadingIdx = xml.indexOf('<w:t>PROJECT</w:t>');
console.log('PROJECT heading at:', projectHeadingIdx);

// Find the three project blocks by their title text
// After LP4 start, their title texts appear within ~500 chars
function findProjectLP4(titleText) {
  let pos = 0;
  while (true) {
    const lp4Pos = xml.indexOf(LP4, pos);
    if (lp4Pos === -1) return -1;
    const snippet = xml.substring(lp4Pos, lp4Pos + 500);
    if (snippet.includes(titleText)) return lp4Pos;
    pos = lp4Pos + 1;
  }
}

const idbiBlockStart = findProjectLP4('IDBI Bank');
const terumoBlockStart = findProjectLP4('Terumo');
const baxterBlockStart = findProjectLP4('Baxter');
console.log('IDBI LP4 start:', idbiBlockStart);
console.log('Terumo LP4 start:', terumoBlockStart);
console.log('Baxter LP4 start:', baxterBlockStart);

// Each project block runs from its LP4 start to just before the next project's LP4 start
// (or for Baxter, to its natural end before EDUCATION-side content)
// We also need to include the spacer paragraph before each project title

// The spacer paragraph just before each project LP4 block
const SPACER = '<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="202"/></w:pPr></w:p>';

// Find the spacer just before each project LP4
function findSpacerBefore(lp4Pos) {
  // Walk backwards to find the last spacer before this LP4
  const region = xml.substring(Math.max(0, lp4Pos - 300), lp4Pos);
  const spacerInRegion = region.lastIndexOf(SPACER);
  if (spacerInRegion === -1) return lp4Pos; // no spacer found, start at LP4
  return Math.max(0, lp4Pos - 300) + spacerInRegion;
}

const idbiWithSpacer = findSpacerBefore(idbiBlockStart);
const terumoWithSpacer = findSpacerBefore(terumoBlockStart);
const baxterWithSpacer = findSpacerBefore(baxterBlockStart);
console.log('IDBI block (with spacer) starts at:', idbiWithSpacer);
console.log('Terumo block (with spacer) starts at:', terumoWithSpacer);
console.log('Baxter block (with spacer) starts at:', baxterWithSpacer);

// Determine end of each block = start of next block's spacer (or for baxter = end of baxter responsibilities)
// Sort by position
const blocks = [
  { name: 'IDBI', start: idbiWithSpacer, lp4: idbiBlockStart },
  { name: 'Terumo', start: terumoWithSpacer, lp4: terumoBlockStart },
  { name: 'Baxter', start: baxterWithSpacer, lp4: baxterBlockStart },
].sort((a, b) => a.start - b.start);

console.log('Block order in XML:', blocks.map(b => b.name).join(' → '));

// Block ends: each block ends where the next one starts
// For the last block, we need to find its natural end
blocks[0].end = blocks[1].start;
blocks[1].end = blocks[2].start;
// Baxter block end: find the spacer paragraph after Baxter's last responsibility bullet
// Look for 2 consecutive spacer paragraphs or the EDUCATION section
const afterBaxter = xml.indexOf('</w:p>', baxterBlockStart + 500);
// Find double spacer after baxter
let baxterSearchFrom = baxterBlockStart;
// The section after projects typically has a larger spacing paragraph before EDUCATION
// Look for w:before="202" spacer after Baxter content
let bEnd = xml.indexOf(SPACER, baxterWithSpacer + 100);
// Find one more spacer after that (double spacer marks project section end)
if (bEnd >= 0) {
  const bEnd2 = xml.indexOf(SPACER, bEnd + SPACER.length);
  if (bEnd2 >= 0 && bEnd2 - bEnd < 200) {
    blocks[2].end = bEnd2 + SPACER.length;
  } else {
    blocks[2].end = bEnd + SPACER.length;
  }
}
console.log('Block ends:', blocks.map(b => `${b.name}:${b.end}`).join(', '));

// Extract each block's XML
const idbiBlock_xml = xml.substring(
  blocks.find(b=>b.name==='IDBI').start,
  blocks.find(b=>b.name==='IDBI').end
);
const terumoBlock_xml = xml.substring(
  blocks.find(b=>b.name==='Terumo').start,
  blocks.find(b=>b.name==='Terumo').end
);
const baxterBlock_xml = xml.substring(
  blocks.find(b=>b.name==='Baxter').start,
  blocks.find(b=>b.name==='Baxter').end
);

console.log('IDBI block length:', idbiBlock_xml.length);
console.log('Terumo block length:', terumoBlock_xml.length);
console.log('Baxter block length:', baxterBlock_xml.length);

// Reconstruct: replace the entire combined block region with reordered blocks
const combinedStart = Math.min(
  blocks.find(b=>b.name==='IDBI').start,
  blocks.find(b=>b.name==='Terumo').start,
  blocks.find(b=>b.name==='Baxter').start
);
const combinedEnd = Math.max(
  blocks.find(b=>b.name==='IDBI').end,
  blocks.find(b=>b.name==='Terumo').end,
  blocks.find(b=>b.name==='Baxter').end
);

const reordered = idbiBlock_xml + terumoBlock_xml + baxterBlock_xml;
xml = xml.substring(0, combinedStart) + reordered + xml.substring(combinedEnd);
console.log('2. Projects reordered: IDBI → Terumo → Baxter');

// Save
fs.writeFileSync(
  'C:/Users/AkashSingh/idbi_uat_angular_cordova/jira-auto/resume_extracted/word/document.xml',
  xml,
  'utf8'
);
console.log('\nAll changes saved to document.xml');
