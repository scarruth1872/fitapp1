export const EthicalGuidelines = {
  validate: (data) => {
    const issues = [];
    
    // Validate licenses
    if (data?.license && !this.allowedLicenses.includes(data.license)) {
      issues.push(`Unapproved license: ${data.license}`);
    }
    
    // Check for prohibited content
    this.prohibitedContent.forEach(term => {
      const regex = new RegExp(term, 'gi');
      if (data?.body?.match(regex)) {
        issues.push(`Contains prohibited term: ${term}`);
      }
    });
    
    return issues;
  },
  
  allowedLicenses: ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'ISC'],
  prohibitedContent: [
    'personal information',
    'sensitive demographics',
    'protected health data',
    'credit card number',
    'social security number'
  ]
};
