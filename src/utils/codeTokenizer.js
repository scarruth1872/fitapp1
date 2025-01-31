import { pipeline } from '@xenova/transformers';

export class CodeTokenizer {
  static technicalTerms = new Set([
    'fix', 'feature', 'refactor', 'bug', 'merge', 'commit',
    'revert', 'patch', 'hotfix', 'chore', 'docs', 'test'
  ]);

  static clean(text) {
    return text
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/[^\w\s#-]/g, ' ')     // Remove special chars
      .replace(/\s+/g, ' ')           // Collapse whitespace
      .trim();
  }

  static detectLanguage(text) {
    const patterns = {
      python: /(def |import |print\()/,
      javascript: /(function|const|let|=>)/,
      java: /(public class|System\.out\.println)/,
      cpp: /(#include|using namespace)/,
      generic: /(\bgit\b|\bdocker\b|\bnpm\b)/
    };
    
    return Object.entries(patterns).find(([lang, regex]) => 
      regex.test(text)
    )?.[0] || 'unknown';
  }

  static containsCodeTerms(text) {
    const cleanText = this.clean(text).toLowerCase();
    return [...this.technicalTerms].some(term => 
      cleanText.includes(term)
    );
  }
}
