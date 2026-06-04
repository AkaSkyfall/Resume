const fs = require('fs');

// Start from original backup EVERY time
let xml = fs.readFileSync(
  'C:/Users/AkashSingh/idbi_uat_angular_cordova/jira-auto/resume_extracted/word/document_backup.xml',
  'utf8'
);

// The file uses a double-encoded em-dash: â€" (3 chars) instead of –
// We preserve existing dashes as-is, use &#x2013; for new content (Word handles it)

const CHANGED = [];

// ============================================================
// 1. 3.9 years → 4.4+ years  (text-only, safe anywhere)
// ============================================================
xml = xml.replace('3.9 years', '4.4+ years');
CHANGED.push('1. 3.9→4.4+');

// ============================================================
// 2. Update Summary paragraph — REPLACE only the run content,
//    keep the <w:p><w:pPr>...</w:pPr> intact (same paragraph)
// ============================================================
const sumPrOpen = '<w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:line="259" w:lineRule="auto" w:before="109"/><w:ind w:left="180" w:right="302"/><w:jc w:val="both"/></w:pPr>';
const sumRunsOld = '<w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>Experienced Angular Developer with over 4.4+ years of hands-on experience in designing, developing, and maintaining web and embedded applications. Proven expertise in Angular framework, with a strong understanding of frontend</w:t></w:r>';

// Find the whole summary paragraph run block (from first run to </w:p>)
const sumPrIdx = xml.indexOf(sumPrOpen);
if (sumPrIdx >= 0) {
  const sumParaBodyStart = sumPrIdx + sumPrOpen.length;
  const sumParaEnd = xml.indexOf('</w:p>', sumParaBodyStart);
  const oldRuns = xml.substring(sumParaBodyStart, sumParaEnd);
  const newRun = '<w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t xml:space="preserve">Experienced Angular Developer with 4.4+ years of hands-on experience designing, developing, and maintaining web, mobile, and embedded applications. Currently leading the migration of IDBI Bank&#x2019;s Go Mobile+ and OMNI banking applications from AngularJS to Angular 21 for Android, iOS, and Web at SnapWork. Previously at Capgemini, delivered mission-critical frontend features across medical device projects for TerumoBCT. Proficient in Angular, RxJS, TypeScript, and Cordova, with additional expertise in Core Java, Agile methodologies, and AI-assisted development tools.</w:t></w:r>';
  xml = xml.substring(0, sumParaBodyStart) + newRun + xml.substring(sumParaEnd);
  CHANGED.push('2. Summary updated');
} else {
  CHANGED.push('2. WARN: summary pPr not found');
}

// ============================================================
// 3. Associate II title runs → SnapWork
//    Replace only the run sequence inside the paragraph
// ============================================================
const aiiRunsOld = 'Associate II \u00e2\u20ac\u201c Associate Product, System &amp; PLM Engineer </w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/><w:sz w:val="22"/></w:rPr><w:t>\u00e2\u20ac\u201c&gt; Capgemini, </w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/><w:spacing w:val="-2"/><w:sz w:val="22"/></w:rPr><w:t>Gandhinagar</w:t></w:r></w:p>';
const aiiRunsNew = 'Frontend Developer </w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/><w:sz w:val="22"/></w:rPr><w:t>&#x2013;&gt; SnapWork, Mumbai</w:t></w:r></w:p>';
if (xml.includes(aiiRunsOld)) {
  xml = xml.replace(aiiRunsOld, aiiRunsNew);
  CHANGED.push('3. Associate II → SnapWork');
} else {
  CHANGED.push('3. WARN: AII runs not found, trying hex match');
  // Try matching with Buffer
  const searchBuf = Buffer.from('Associate II ', 'utf8');
  const idx = xml.indexOf('Associate II ');
  if (idx >= 0) {
    const paraEnd = xml.indexOf('</w:p>', idx) + 6;
    const oldPara = xml.substring(xml.lastIndexOf('<w:p>', idx), paraEnd);
    const pPrEnd = oldPara.indexOf('</w:pPr>') + '</w:pPr>'.length;
    const newPara = oldPara.substring(0, pPrEnd) +
      '<w:r><w:rPr><w:b/><w:i/><w:color w:val="3A3838"/><w:sz w:val="22"/></w:rPr><w:t>Frontend Developer </w:t></w:r>' +
      '<w:r><w:rPr><w:color w:val="3A3838"/><w:sz w:val="22"/></w:rPr><w:t>&#x2013;&gt; SnapWork, Mumbai</w:t></w:r></w:p>';
    xml = xml.replace(oldPara, newPara);
    CHANGED.push('3b. SnapWork via fallback');
  }
}

// ============================================================
// 4. Associate II date → January 2026 – Present.
//    Replace the entire date paragraph (same paragraph structure)
// ============================================================
const aiiDateOld = '<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="2"/><w:ind w:left="269"/></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>October</w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/><w:spacing w:val="-3"/></w:rPr><w:t> </w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>2023</w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/><w:spacing w:val="-4"/></w:rPr><w:t> </w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>\u00e2\u20ac\u201c</w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/><w:spacing w:val="-4"/></w:rPr><w:t> </w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/><w:spacing w:val="-2"/></w:rPr><w:t>Present.</w:t></w:r></w:p>';
const aiiDateNew = '<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="2"/><w:ind w:left="269"/></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>January 2026 &#x2013; Present.</w:t></w:r></w:p>';
if (xml.includes(aiiDateOld)) {
  xml = xml.replace(aiiDateOld, aiiDateNew);
  CHANGED.push('4. SnapWork date → Jan 2026–Present');
} else {
  CHANGED.push('4. WARN: AII date para not found');
}

// ============================================================
// 5. Associate I title runs → Capgemini
// ============================================================
const aiRunsOld = 'Associate I \u00e2\u20ac\u201c Associate Product, System &amp; PLM Engineer </w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/><w:sz w:val="22"/></w:rPr><w:t>\u00e2\u20ac\u201c&gt; Capgemini, </w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/><w:spacing w:val="-2"/><w:sz w:val="22"/></w:rPr><w:t>Gandhinagar</w:t></w:r></w:p>';
const aiRunsNew = 'Associate Engineer </w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/><w:sz w:val="22"/></w:rPr><w:t>&#x2013;&gt; Capgemini, Gandhinagar</w:t></w:r></w:p>';
if (xml.includes(aiRunsOld)) {
  xml = xml.replace(aiRunsOld, aiRunsNew);
  CHANGED.push('5. Associate I → Capgemini');
} else {
  CHANGED.push('5. WARN: AI runs not found');
}

// ============================================================
// 6. Associate I date → March 2022 – December 2025.
// ============================================================
const aiDateOld = '<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:ind w:left="269"/></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>March</w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/><w:spacing w:val="-8"/></w:rPr><w:t> </w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>2022</w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/><w:spacing w:val="-2"/></w:rPr><w:t> </w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>\u00e2\u20ac\u201c</w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/><w:spacing w:val="-4"/></w:rPr><w:t> </w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>September</w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/><w:spacing w:val="-4"/></w:rPr><w:t> 2023.</w:t></w:r></w:p>';
const aiDateNew = '<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:ind w:left="269"/></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>March 2022 &#x2013; December 2025.</w:t></w:r></w:p>';
if (xml.includes(aiDateOld)) {
  xml = xml.replace(aiDateOld, aiDateNew);
  CHANGED.push('6. Capgemini dates → Mar 2022–Dec 2025');
} else {
  CHANGED.push('6. WARN: AI date para not found');
}

// ============================================================
// 7. Repurpose the EXISTING empty BodyText paragraph in Skills
//    (right after "Other: ... Software Design Patterns")
//    No new paragraph — just fill it with AI Tools content.
// ============================================================
const emptyParaOld = '<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:rPr><w:sz w:val="20"/></w:rPr></w:pPr></w:p>';
const emptyParaNew = '<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:line="254" w:lineRule="auto" w:before="100"/><w:ind w:left="148" w:right="0" w:firstLine="0"/><w:jc w:val="left"/><w:rPr><w:sz w:val="20"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">AI Tools: </w:t></w:r><w:r><w:rPr><w:color w:val="FFFFFF"/><w:sz w:val="20"/></w:rPr><w:t>Speckit, GSD, GitHub Copilot, Caveman, Claude</w:t></w:r></w:p>';
if (xml.includes(emptyParaOld)) {
  // Only replace first occurrence (the one in Skills section, before TOOLS)
  xml = xml.replace(emptyParaOld, emptyParaNew);
  CHANGED.push('7. AI Tools added (repurposed empty para)');
} else {
  CHANGED.push('7. WARN: empty para not found');
}

// ============================================================
// 8. ADD IDBI PROJECT in section 6 (safe zone: pos > 64930)
//    Insert before the Baxter project title paragraph.
//    Use exact same ListParagraph/numId=4 style as Baxter.
//    Section 6 is the last section — adding paragraphs here
//    only extends the last column, does NOT break earlier layout.
// ============================================================
const baxterTitleFull = '<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="202"/></w:pPr></w:p><w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="4"/></w:numPr><w:tabs><w:tab w:pos="430" w:val="left" w:leader="none"/></w:tabs><w:spacing w:line="240" w:lineRule="auto" w:before="0" w:after="0"/><w:ind w:left="430" w:right="0" w:hanging="359"/><w:jc w:val="left"/><w:rPr><w:b/><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:color w:val="3A3838"/><w:sz w:val="22"/></w:rPr><w:t>Baxter</w:t>';

// IDBI block — uses identical paragraph styles to Baxter for perfect formatting
const bullet4 = (text) =>
  `<w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="1"/><w:numId w:val="4"/></w:numPr><w:tabs><w:tab w:pos="868" w:val="left" w:leader="none"/></w:tabs><w:spacing w:line="256" w:lineRule="auto" w:before="134" w:after="0"/><w:ind w:left="868" w:right="254" w:hanging="360"/><w:jc w:val="left"/><w:rPr><w:sz w:val="28"/></w:rPr></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/><w:sz w:val="22"/></w:rPr><w:t xml:space="preserve">${text}</w:t></w:r></w:p>`;

const idbiBlock =
  // spacer
  '<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="202"/></w:pPr></w:p>' +
  // project title (same style as Baxter)
  '<w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="4"/></w:numPr><w:tabs><w:tab w:pos="430" w:val="left" w:leader="none"/></w:tabs><w:spacing w:line="240" w:lineRule="auto" w:before="0" w:after="0"/><w:ind w:left="430" w:right="0" w:hanging="359"/><w:jc w:val="left"/><w:rPr><w:b/><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:color w:val="3A3838"/><w:sz w:val="22"/></w:rPr><w:t>IDBI Bank &#x2013; IDBI Go Mobile+ &amp; OMNI</w:t></w:r></w:p>' +
  // date
  '<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="115"/><w:ind w:left="806"/></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>January 2026 &#x2013; Present</w:t></w:r></w:p>' +
  // role
  '<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="114"/><w:ind w:left="602"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="3A3838"/></w:rPr><w:t xml:space="preserve">Role: </w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>Frontend Developer (Angular)</w:t></w:r></w:p>' +
  // responsibilities heading
  '<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="114"/><w:ind w:left="602"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="3A3838"/></w:rPr><w:t>Responsibilities:</w:t></w:r></w:p>' +
  // bullets (same structure as Baxter bullets)
  bullet4('Leading the migration of IDBI Go Mobile+ and OMNI banking apps from AngularJS to Angular 21 for Android (Cordova), iOS (Cordova), and Web platforms.') +
  bullet4('Architecting a unified Angular standalone-component codebase ensuring full feature parity across Android, iOS, and Web from a single source.') +
  bullet4('Modernizing AngularJS controllers, services, and directives to Angular 21 with reactive forms and RxJS-driven state management.') +
  bullet4('Integrating IBM MobileFirst Platform (MFP/Worklight) adapters for secure banking API communication with SSL certificate pinning.') +
  bullet4('Collaborating with backend, QA, and UX teams to deliver a secure, accessible mobile banking experience.');

if (xml.includes(baxterTitleFull)) {
  xml = xml.replace(baxterTitleFull, idbiBlock + baxterTitleFull);
  CHANGED.push('8. IDBI project added before Baxter (section 6)');
} else {
  CHANGED.push('8. WARN: Baxter title anchor not found');
}

// ============================================================
// REPORT
// ============================================================
CHANGED.forEach(c => console.log(c));

// Paragraph count check
const origXml = fs.readFileSync('C:/Users/AkashSingh/idbi_uat_angular_cordova/jira-auto/resume_extracted/word/document_backup.xml', 'utf8');
const origParas = (origXml.match(/<\/w:p>/g)||[]).length;
const newParas = (xml.match(/<\/w:p>/g)||[]).length;
console.log(`\nParagraph count: orig=${origParas} new=${newParas} added=${newParas-origParas}`);
console.log('(New paras are ALL in section 6 — safe zone)');

// Save
fs.writeFileSync(
  'C:/Users/AkashSingh/idbi_uat_angular_cordova/jira-auto/resume_extracted/word/document.xml',
  xml,
  'utf8'
);
console.log('\ndocument.xml saved.');
