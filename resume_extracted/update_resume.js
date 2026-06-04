const fs = require('fs');

let xml = fs.readFileSync(
  'C:/Users/AkashSingh/idbi_uat_angular_cordova/jira-auto/resume_extracted/word/document.xml',
  'utf8'
);

// --- 1. Update 3.9 years to 4.4+ years ---
xml = xml.replace('3.9 years', '4.4+ years');
console.log('1. Updated 3.9 -> 4.4+:', xml.includes('4.4+ years'));

// --- 2. Change Associate II date: "Present." -> "December 2025." ---
// Find the first occurrence of Present. (which is the Associate II one)
const presentTag = '<w:t>Present.</w:t></w:r></w:p>';
const idx = xml.indexOf(presentTag);
if (idx >= 0) {
  xml = xml.substring(0, idx) +
        '<w:t>December 2025.</w:t></w:r></w:p>' +
        xml.substring(idx + presentTag.length);
  console.log('2. Updated Associate II date to December 2025');
} else {
  console.log('2. WARN: Present. pattern not found');
}

// --- 3. Add SnapWork entry BEFORE Associate II block ---
// The Associate II paragraph starts right after the WORK EXPERIENCE heading.
// We insert a new entry before it.
const assocIIPara = '<w:p><w:pPr><w:spacing w:line="259" w:lineRule="auto" w:before="162"/><w:ind w:left="269" w:right="0" w:firstLine="0"/><w:jc w:val="left"/><w:rPr><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:i/><w:color w:val="3A3838"/><w:sz w:val="22"/></w:rPr><w:t>Associate II';

const snapworkBlock = `<w:p><w:pPr><w:spacing w:line="259" w:lineRule="auto" w:before="162"/><w:ind w:left="269" w:right="0" w:firstLine="0"/><w:jc w:val="left"/><w:rPr><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:i/><w:color w:val="3A3838"/><w:sz w:val="22"/></w:rPr><w:t>Frontend Developer </w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/><w:sz w:val="22"/></w:rPr><w:t>&#x2013;&gt; SnapWork, Mumbai</w:t></w:r></w:p><w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="2"/><w:ind w:left="269"/></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>January 2026 &#x2013; Present.</w:t></w:r></w:p>`;

if (xml.includes(assocIIPara)) {
  xml = xml.replace(assocIIPara, snapworkBlock + assocIIPara);
  console.log('3. Added SnapWork entry');
} else {
  console.log('3. WARN: Associate II pattern not found, trying fallback');
  const idx2 = xml.indexOf('Associate II');
  console.log('   Associate II at:', idx2);
}

// --- 4. Add AI Tools section in Skills after "Other:" paragraph ---
// Find end of the "Other:" paragraph (contains "methodologies, Software Design Patterns")
const afterOther = 'methodologies, Software Design Patterns</w:t></w:r></w:p>';
const aiToolsPara = `<w:p><w:pPr><w:spacing w:line="254" w:lineRule="auto" w:before="167"/><w:ind w:left="148" w:right="0" w:firstLine="0"/><w:jc w:val="left"/><w:rPr><w:sz w:val="20"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="20"/></w:rPr><w:t>AI Tools: </w:t></w:r><w:r><w:rPr><w:color w:val="FFFFFF"/><w:sz w:val="20"/></w:rPr><w:t>Speckit, GSD, GitHub Copilot, Caveman, Claude</w:t></w:r></w:p>`;

if (xml.includes(afterOther)) {
  xml = xml.replace(afterOther, afterOther + aiToolsPara);
  console.log('4. Added AI Tools section in Skills');
} else {
  console.log('4. WARN: Other: end pattern not found');
  const idx3 = xml.indexOf('Software Design Patterns');
  console.log('   Software Design Patterns at:', idx3);
}

// --- 5. Add IDBI Go Mobile project before Baxter block ---
// Find the spacer paragraph before Baxter
const beforeBaxter = '<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="202"/></w:pPr></w:p>';
// The IDBI project block
const idbiBlock = `<w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="4"/></w:numPr><w:tabs><w:tab w:pos="430" w:val="left" w:leader="none"/></w:tabs><w:spacing w:line="240" w:lineRule="auto" w:before="0" w:after="0"/><w:ind w:left="430" w:right="0" w:hanging="359"/><w:jc w:val="left"/><w:rPr><w:b/><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:color w:val="3A3838"/><w:sz w:val="22"/></w:rPr><w:t>IDBI Bank &#x2013; IDBI Go Mobile+ &amp; OMNI</w:t></w:r></w:p><w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="115"/><w:ind w:left="806"/></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>January 2026 &#x2013; Present</w:t></w:r></w:p><w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="115"/><w:ind w:left="806"/></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>Role: Frontend Developer (Angular)</w:t></w:r></w:p><w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="115"/><w:ind w:left="806"/></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>Responsibilities:</w:t></w:r></w:p><w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="80"/><w:ind w:left="1100"/></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>&#x2022; Leading the migration of IDBI Go Mobile+ and OMNI banking applications from AngularJS to Angular 21, targeting Android, iOS, and Web platforms.</w:t></w:r></w:p><w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="80"/><w:ind w:left="1100"/></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>&#x2022; Architecting a unified Angular codebase that supports multi-platform delivery (Android via Cordova, iOS via Cordova, and responsive Web), ensuring feature parity across all channels.</w:t></w:r></w:p><w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="80"/><w:ind w:left="1100"/></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>&#x2022; Modernizing legacy AngularJS controllers, services, and directives to Angular 21 components with standalone architecture, reactive forms, and RxJS-driven state management.</w:t></w:r></w:p><w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="80"/><w:ind w:left="1100"/></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>&#x2022; Integrating MobileFirst Platform (MFP/IBM Worklight) adapters for secure banking API communication and implementing SSL certificate pinning for Android and iOS builds.</w:t></w:r></w:p><w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="80"/><w:ind w:left="1100"/></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>&#x2022; Collaborating with cross-functional teams including backend, QA, and UX to deliver a seamless, accessible, and performant mobile banking experience.</w:t></w:r></w:p><w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="202"/></w:pPr></w:p>`;

// Find last occurrence of the spacer before Baxter
const lastSpacerIdx = xml.lastIndexOf(beforeBaxter + '<w:p><w:pPr><w:pStyle w:val="ListParagraph"/>');
console.log('lastSpacerIdx:', lastSpacerIdx);

// Use exact insertion: right before the Baxter bold list paragraph
const baxterPara = '<w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="4"/></w:numPr><w:tabs><w:tab w:pos="430" w:val="left" w:leader="none"/></w:tabs><w:spacing w:line="240" w:lineRule="auto" w:before="0" w:after="0"/><w:ind w:left="430" w:right="0" w:hanging="359"/><w:jc w:val="left"/><w:rPr><w:b/><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:color w:val="3A3838"/><w:sz w:val="22"/></w:rPr><w:t>Baxter</w:t>';

if (xml.includes(baxterPara)) {
  // Insert spacer + IDBI block before Baxter
  xml = xml.replace(beforeBaxter + baxterPara, beforeBaxter + idbiBlock + baxterPara);
  console.log('5. Added IDBI project before Baxter');
} else {
  console.log('5. WARN: Baxter paragraph pattern not found');
  const bIdx = xml.indexOf('<w:t>Baxter</w:t>');
  console.log('   Baxter text at:', bIdx);
}

// Save final
fs.writeFileSync(
  'C:/Users/AkashSingh/idbi_uat_angular_cordova/jira-auto/resume_extracted/word/document.xml',
  xml,
  'utf8'
);
console.log('\nDone! document.xml updated.');
