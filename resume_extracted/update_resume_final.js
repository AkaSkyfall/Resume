const fs = require('fs');

let xml = fs.readFileSync(
  'C:/Users/AkashSingh/idbi_uat_angular_cordova/jira-auto/resume_extracted/word/document.xml',
  'utf8'
);

// ============================================================
// Helper to make a simple run with color 3A3838
// ============================================================
const run = (text) =>
  `<w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>${text}</w:t></w:r>`;
const boldRun = (text) =>
  `<w:r><w:rPr><w:b/><w:color w:val="3A3838"/></w:rPr><w:t>${text}</w:t></w:r>`;

// ============================================================
// 1. UPDATE 3.9 → 4.4+ years
// ============================================================
xml = xml.replace('3.9 years', '4.4+ years');
console.log('1. 3.9 → 4.4+:', xml.includes('4.4+ years'));

// ============================================================
// 2. UPDATE SUMMARY
// Replace old summary paragraph content with new text.
// The summary paragraph contains the first long text run.
// ============================================================
const oldSummaryText = 'Experienced Angular Developer with over 4.4+ years of hands-on experience in designing, developing, and maintaining web and embedded applications. Proven expertise in Angular framework, with a strong understanding of frontend';
const summaryRunStart = xml.indexOf(oldSummaryText);
const summaryParaStart = xml.lastIndexOf('<w:p>', summaryRunStart);
const summaryParaEnd = xml.indexOf('</w:p>', summaryRunStart) + '</w:p>'.length;
const oldSummaryPara = xml.substring(summaryParaStart, summaryParaEnd);

const newSummaryPara = `<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:line="259" w:lineRule="auto" w:before="109"/><w:ind w:left="180" w:right="302"/><w:jc w:val="both"/></w:pPr>${run(
  'Experienced Angular Developer with 4.4+ years of hands-on experience designing, developing, and maintaining web, mobile, and embedded applications. Currently leading the migration of IDBI Bank\u2019s Go Mobile+ and OMNI applications from AngularJS to Angular 21 for Android, iOS, and Web platforms at SnapWork. Previously at Capgemini, delivered mission-critical frontend features across medical device applications for TerumoBCT. Proficient in Angular, RxJS, TypeScript, and Cordova, with expertise in Core Java, Agile methodologies, and AI-assisted development tools. Track record of Angular version upgrades (v7 to v21), cross-platform delivery, and zero-vulnerability codebases.'
)}</w:p>`;

xml = xml.replace(oldSummaryPara, newSummaryPara);
console.log('2. Summary updated');

// ============================================================
// 3. UPDATE Associate II date: "Present." → "December 2025."
// ============================================================
const presentTag = '<w:t>Present.</w:t></w:r></w:p>';
const presentIdx = xml.indexOf(presentTag);
if (presentIdx >= 0) {
  xml = xml.substring(0, presentIdx) +
    '<w:t>December 2025.</w:t></w:r></w:p>' +
    xml.substring(presentIdx + presentTag.length);
  console.log('3. Associate II → December 2025');
}

// ============================================================
// 4. ADD SnapWork BEFORE Associate II
// ============================================================
const assocIIPara = '<w:p><w:pPr><w:spacing w:line="259" w:lineRule="auto" w:before="162"/><w:ind w:left="269" w:right="0" w:firstLine="0"/><w:jc w:val="left"/><w:rPr><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:i/><w:color w:val="3A3838"/><w:sz w:val="22"/></w:rPr><w:t>Associate II';

const snapworkBlock =
  `<w:p><w:pPr><w:spacing w:line="259" w:lineRule="auto" w:before="162"/><w:ind w:left="269" w:right="0" w:firstLine="0"/><w:jc w:val="left"/><w:rPr><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:b/><w:i/><w:color w:val="3A3838"/><w:sz w:val="22"/></w:rPr><w:t>Frontend Developer </w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/><w:sz w:val="22"/></w:rPr><w:t>\u2013&gt; SnapWork, Mumbai</w:t></w:r></w:p>` +
  `<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="2"/><w:ind w:left="269"/></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>January 2026 \u2013 Present.</w:t></w:r></w:p>`;

if (xml.includes(assocIIPara)) {
  xml = xml.replace(assocIIPara, snapworkBlock + assocIIPara);
  console.log('4. SnapWork added');
}

// ============================================================
// 5. ADD AI Tools in Skills (after "Other:" line)
// ============================================================
const afterOther = 'methodologies, Software Design Patterns</w:t></w:r></w:p>';
const aiToolsPara =
  `<w:p><w:pPr><w:spacing w:line="254" w:lineRule="auto" w:before="167"/><w:ind w:left="148" w:right="0" w:firstLine="0"/><w:jc w:val="left"/><w:rPr><w:sz w:val="20"/></w:rPr></w:pPr>` +
  `<w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="20"/></w:rPr><w:t>AI Tools: </w:t></w:r>` +
  `<w:r><w:rPr><w:color w:val="FFFFFF"/><w:sz w:val="20"/></w:rPr><w:t>Speckit, GSD, GitHub Copilot, Caveman, Claude</w:t></w:r></w:p>`;

if (xml.includes(afterOther)) {
  xml = xml.replace(afterOther, afterOther + aiToolsPara);
  console.log('5. AI Tools section added');
}

// ============================================================
// 6. ADD IDBI PROJECT — inserted RIGHT BEFORE Terumo (first project)
//    using same Heading4/numId=1 style as Terumo
// ============================================================

// The Terumo title paragraph (Heading4/numId=1)
const terumoTitlePara = '<w:p><w:pPr><w:pStyle w:val="Heading4"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr><w:tabs><w:tab w:pos="601" w:val="left" w:leader="none"/></w:tabs><w:spacing w:line="240" w:lineRule="auto" w:before="139" w:after="0"/><w:ind w:left="601" w:right="0" w:hanging="359"/><w:jc w:val="left"/></w:pPr>';

// Build bullet paragraph using the same list style as Terumo bullets (numId=1, ilvl=1)
const bullet = (text) =>
  `<w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="1"/><w:numId w:val="1"/></w:numPr><w:tabs><w:tab w:pos="1039" w:val="left" w:leader="none"/></w:tabs><w:spacing w:line="256" w:lineRule="auto" w:before="183" w:after="0"/><w:ind w:left="1039" w:right="0" w:hanging="359"/><w:jc w:val="left"/><w:rPr><w:sz w:val="22"/></w:rPr></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/><w:sz w:val="22"/></w:rPr><w:t>${text}</w:t></w:r></w:p>`;

const idbiBlock =
  // Title paragraph (same style as Terumo)
  `${terumoTitlePara}` +
  `<w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>IDBI Bank \u2013 IDBI Go Mobile+ &amp; OMNI</w:t></w:r></w:p>` +
  // Date
  `<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="115"/><w:ind w:left="806"/></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t>January 2026 \u2013 Present</w:t></w:r></w:p>` +
  // Role
  `<w:p><w:pPr><w:pStyle w:val="BodyText"/><w:spacing w:before="114"/><w:ind w:left="602"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="3A3838"/></w:rPr><w:t>Role:</w:t></w:r><w:r><w:rPr><w:color w:val="3A3838"/></w:rPr><w:t> Frontend Developer (Angular)</w:t></w:r></w:p>` +
  // Responsibilities heading
  `<w:p><w:pPr><w:pStyle w:val="Heading4"/><w:ind w:left="602" w:firstLine="0"/></w:pPr><w:r><w:rPr><w:color w:val="3A3838"/><w:spacing w:val="-2"/></w:rPr><w:t>Responsibilities:</w:t></w:r></w:p>` +
  // Bullets
  bullet('Leading the migration of IDBI Go Mobile+ and OMNI banking applications from AngularJS to Angular 21, targeting Android, iOS, and Web platforms.') +
  bullet('Architecting a unified Angular codebase for multi-platform delivery (Android via Cordova, iOS via Cordova, and responsive Web), ensuring feature parity across all channels.') +
  bullet('Modernizing legacy AngularJS controllers, services, and directives to Angular 21 components with standalone architecture, reactive forms, and RxJS-driven state management.') +
  bullet('Integrating MobileFirst Platform (MFP/IBM Worklight) adapters for secure banking API communication and implementing SSL certificate pinning for Android and iOS builds.') +
  bullet('Collaborating with cross-functional teams (backend, QA, UX) to deliver a seamless, accessible, and performant mobile banking experience.');

if (xml.includes(terumoTitlePara)) {
  xml = xml.replace(terumoTitlePara, idbiBlock + terumoTitlePara);
  console.log('6. IDBI project inserted before Terumo');
} else {
  console.log('6. WARN: Terumo title para not found');
}

// ============================================================
// SAVE
// ============================================================
fs.writeFileSync(
  'C:/Users/AkashSingh/idbi_uat_angular_cordova/jira-auto/resume_extracted/word/document.xml',
  xml,
  'utf8'
);
console.log('\nAll changes saved.');
