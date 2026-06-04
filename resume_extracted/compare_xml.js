const fs = require('fs');
const origXml = fs.readFileSync('C:/Users/AkashSingh/idbi_uat_angular_cordova/jira-auto/resume_extracted/word/document_backup.xml', 'utf8');
const newXml = fs.readFileSync('C:/Users/AkashSingh/idbi_uat_angular_cordova/jira-auto/resume_extracted/word/document.xml', 'utf8');

console.log('Original length:', origXml.length);
console.log('Updated length:', newXml.length);
console.log('Diff:', newXml.length - origXml.length);

const origParas = (origXml.match(/<\/w:p>/g)||[]).length;
const newParas = (newXml.match(/<\/w:p>/g)||[]).length;
console.log('Orig paragraphs:', origParas, ' New:', newParas, ' Diff:', newParas - origParas);

const origMC = (origXml.match(/<mc:AlternateContent/g)||[]).length;
const newMC = (newXml.match(/<mc:AlternateContent/g)||[]).length;
console.log('AlternateContent orig:', origMC, ' new:', newMC);

// Where exactly do the two files start to differ?
let diffAt = -1;
const minLen = Math.min(origXml.length, newXml.length);
for (let i = 0; i < minLen; i++) {
  if (origXml[i] !== newXml[i]) { diffAt = i; break; }
}
console.log('First difference at byte:', diffAt);
if (diffAt >= 0) {
  console.log('Orig context:', JSON.stringify(origXml.substring(diffAt - 80, diffAt + 200)));
  console.log('New context:', JSON.stringify(newXml.substring(diffAt - 80, diffAt + 200)));
}
