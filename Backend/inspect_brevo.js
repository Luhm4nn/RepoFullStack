import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const BrevoRoot = require('@getbrevo/brevo');

console.log('--- BREVO PACKAGE INSPECTION ---');
console.log('Main Object Keys:', Object.keys(BrevoRoot));

if (BrevoRoot.default) {
  console.log('Default Object Keys:', Object.keys(BrevoRoot.default));
} else {
  console.log('Default property NOT FOUND');
}

// Try specific searches
const searchClasses = ['TransactionalEmailsApi', 'SendSmtpEmail'];
searchClasses.forEach((cls) => {
  if (BrevoRoot[cls]) {
    console.log(`${cls} found in ROOT`);
  } else if (BrevoRoot.default && BrevoRoot.default[cls]) {
    console.log(`${cls} found in ROOT.DEFAULT`);
  } else {
    // Deep search if needed
    console.log(`${cls} NOT FOUND at standard locations`);
  }
});
