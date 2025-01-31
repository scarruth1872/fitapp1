// NLP Specialist Agent(s)
// Role: Focuses on natural language processing tasks to interpret change logs and discussions.
// Capabilities:
// - Language understanding and semantic analysis.
// - Context extraction and sentiment analysis.

import { pipeline } from '@xenova/transformers';
import { CodeTokenizer } from '../utils/codeTokenizer.js';
import { DataScientistAgent } from './DataScientistAgent.js';

export class NLPSpecialistAgent {
  constructor() {
    this.classifier = null;
    this.ner = null;
    this.embeddings = null;
    this.dataAgent = new DataScientistAgent();
    this.initModels();
  }

  async initModels() {
    [this.classifier, this.ner, this.embeddings] = await Promise.all([
      pipeline('text-classification', { model: 'codebert-base-multilingual'}),
      pipeline('token-classification', { model: 'codebert-ner'}),
      pipeline('feature-extraction', { model: 'codebert-embeddings'})
    ]);
  }

  async analyzeTechnicalText(texts, contextType = 'commit') {
    try {
      const preprocessed = await this.dataAgent.preprocessData({texts});
      const results = [];
      
      for (const text of preprocessed.texts) {
        const [classification, entities] = await Promise.all([
          this.classifyText(text, contextType),
          this.detectEntities(text)
        ]);
        
        results.push({
          text,
          classification,
          entities,
          embeddings: await this.getEmbeddings(text),
          relationships: this.findRelations(text, preprocessed.metadata)
        });
      }
      
      return this.postProcess(results);
    } catch (error) {
      console.error(`NLP analysis failed: ${error.message}`);
      return [];
    }
  }

  async classifyText(text, contextType) {
    const labels = {
      commit: ['feature', 'bugfix', 'refactor', 'docs', 'chore'],
      discussion: ['question', 'bugreport', 'feature-request', 'review'],
      changelog: ['added', 'changed', 'deprecated', 'removed', 'fixed']
    };
    
    return this.classifier(text, {
      topk: 3,
      labels: labels[contextType]
    });
  }

  detectEntities(text) {
    return this.ner(text, {
      aggregation_strategy: 'simple',
      ignore_labels: ['O']
    });
  }

  async getEmbeddings(text) {
    const { data } = await this.embeddings(text, { 
      pooling: 'mean',
      normalize: true
    });
    return Array.from(data);
  }

  findRelations(text, metadata) {
    return {
      linkedCommits: this.matchCommitPatterns(text),
      relatedIssues: this.findIssueReferences(text),
      temporalContext: metadata.temporalFeatures
    };
  }

  // Technical text processing
  matchCommitPatterns(text) {
    const patterns = {
      fix: /fix(es|ed)?\s+#?(\d+)/gi,
      feature: /add(s|ed)?\s+(\w+)\s+feature/gi,
      refactor: /refactor(s|ed)?\s+(\w+)/gi
    };
    
    return Object.entries(patterns).reduce((acc, [key, regex]) => {
      acc[key] = [...text.matchAll(regex)].map(m => m[2] || m[1]);
      return acc;
    }, {});
  }

  findIssueReferences(text) {
    return [...text.matchAll(/#(\d+)|issues?\/(\d+)/gi)]
      .map(m => m[1] || m[2])
      .filter(Boolean);
  }

  postProcess(results) {
    return results.map(r => ({
      ...r,
      cleanText: CodeTokenizer.clean(r.text),
      language: CodeTokenizer.detectLanguage(r.text),
      isTechnical: CodeTokenizer.containsCodeTerms(r.text)
    }));
  }
}

// Example usage:
// const nlpAgent = new NLPSpecialistAgent();
// const analysis = await nlpAgent.analyzeTechnicalText(commitMessages, 'commit');
