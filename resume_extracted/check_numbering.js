const fs = require('fs');
const numbering = fs.readFileSync('C:/Users/AkashSingh/idbi_uat_angular_cordova/jira-auto/resume_extracted/word/numbering.xml', 'utf8');

// Show all num entries
const numMatches = numbering.match(/<w:num w:numId="\d+">[^<]*<w:abstractNumId[^/]+\/>[^<]*<\/w:num>/g) || [];
console.log('Num entries:');
numMatches.forEach(m => console.log(' ', m));

// Also get all abstractNum IDs and their types
const abstractNums = numbering.match(/<w:abstractNum w:abstractNumId="\d+">/g) || [];
console.log('\nAbstractNums:', abstractNums);
