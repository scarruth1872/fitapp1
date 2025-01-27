// Advanced response analyzer that combines multiple datasets
import {
  spiritualPrinciples,
  healingResponses,
  therapeuticApproaches,
  healingGuidance
} from '../data/spiritualData';

import {
  mentalHealthDisorders,
  therapeuticModalities,
  wellnessInterventions,
  integrativeApproaches
} from '../data/clinicalData';

// Utility function to calculate relevance score
const calculateRelevance = (text, keywords) => {
  const lowercaseText = text.toLowerCase();
  return keywords.reduce((score, keyword) => {
    return score + (lowercaseText.includes(keyword.toLowerCase()) ? 1 : 0);
  }, 0);
};

// Extract keywords from text
const extractKeywords = (text) => {
  const stopWords = new Set(['the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'with', 'by']);
  return text.toLowerCase()
    .split(/\W+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
};

// Find relevant spiritual principles
const findSpiritualPrinciples = (message, keywords) => {
  const results = [];
  
  for (const [domain, content] of Object.entries(spiritualPrinciples)) {
    const relevance = calculateRelevance(domain + ' ' + content.core_concepts?.join(' '), keywords);
    if (relevance > 0) {
      results.push({
        type: 'spiritual',
        domain,
        content,
        relevance,
        practices: content.healing_through_love?.mind_complex?.practices || []
      });
    }
  }
  
  return results.sort((a, b) => b.relevance - a.relevance);
};

// Find relevant clinical approaches
const findClinicalApproaches = (message, keywords) => {
  const results = [];
  
  // Search through mental health disorders
  for (const [category, disorders] of Object.entries(mentalHealthDisorders)) {
    for (const [disorder, data] of Object.entries(disorders)) {
      const relevance = calculateRelevance(
        disorder + ' ' + data.diagnostic_criteria?.core_symptoms?.join(' '),
        keywords
      );
      if (relevance > 0) {
        results.push({
          type: 'clinical',
          category,
          disorder,
          data,
          relevance,
          treatments: data.evidence_based_treatments
        });
      }
    }
  }
  
  return results.sort((a, b) => b.relevance - a.relevance);
};

// Find relevant therapeutic approaches
const findTherapeuticApproaches = (message, keywords) => {
  const results = [];
  
  for (const [approach, data] of Object.entries(therapeuticApproaches)) {
    const relevance = calculateRelevance(
      approach + ' ' + data.description + ' ' + data.methods?.join(' '),
      keywords
    );
    if (relevance > 0) {
      results.push({
        type: 'therapeutic',
        approach,
        data,
        relevance
      });
    }
  }
  
  return results.sort((a, b) => b.relevance - a.relevance);
};

// Create integrated response plan
const createResponsePlan = (spiritualResults, clinicalResults, therapeuticResults) => {
  return {
    // Step 1: Integration
    integration: {
      spiritual: spiritualResults[0]?.content?.core_concepts?.[0] || '',
      clinical: clinicalResults[0]?.data?.holistic_integration?.mind_complex?.understanding || '',
      therapeutic: therapeuticResults[0]?.data?.description || ''
    },
    // Step 2: Enhancement
    enhancement: {
      practices: [
        ...(spiritualResults[0]?.practices || []).slice(0, 2),
        ...(clinicalResults[0]?.treatments?.psychotherapy?.[0]?.techniques || []).slice(0, 2),
        ...(therapeuticResults[0]?.data?.methods || []).slice(0, 2)
      ],
      guidance: healingGuidance?.spiritual_healing?.principles?.slice(0, 2) || []
    },
    // Step 3: Implementation
    implementation: {
      immediate: therapeuticResults[0]?.data?.applications?.[0] || '',
      shortTerm: clinicalResults[0]?.treatments?.psychotherapy?.[0]?.description || '',
      longTerm: spiritualResults[0]?.content?.healing_through_love?.spirit_complex?.practices?.[0] || ''
    }
  };
};

// Format the final response
const formatResponse = (plan, message) => {
  const lovePerspective = healingResponses?.love_based?.[
    Math.floor(Math.random() * (healingResponses?.love_based?.length || 1))
  ] || "I honor your journey and presence.";

  return `${lovePerspective}

Understanding Your Journey:
${plan.integration.spiritual}
${plan.integration.clinical}
${plan.integration.therapeutic}

Recommended Practices:
${plan.enhancement.practices.map(practice => `• ${practice}`).join('\n')}

Spiritual Guidance:
${plan.enhancement.guidance.map(guide => `• ${guide}`).join('\n')}

Implementation Path:
1. Immediate Step: ${plan.implementation.immediate}
2. Short-term Practice: ${plan.implementation.shortTerm}
3. Long-term Integration: ${plan.implementation.longTerm}

${healingResponses?.integration?.[
  Math.floor(Math.random() * (healingResponses?.integration?.length || 1))
] || "How does this resonate with your journey?"}

${healingResponses?.guidance?.[
  Math.floor(Math.random() * (healingResponses?.guidance?.length || 1))
] || "Trust in your inner wisdom as you move forward."}`;
};

// Main analysis function
export const analyzeUserMessage = (message) => {
  try {
    const keywords = extractKeywords(message);
    
    // Step 1: Gather relevant information from all datasets
    const spiritualResults = findSpiritualPrinciples(message, keywords);
    const clinicalResults = findClinicalApproaches(message, keywords);
    const therapeuticResults = findTherapeuticApproaches(message, keywords);
    
    // Step 2: Create integrated response plan
    const responsePlan = createResponsePlan(
      spiritualResults,
      clinicalResults,
      therapeuticResults
    );
    
    // Step 3: Format and return the response
    return formatResponse(responsePlan, message);
  } catch (error) {
    console.error('Error in analyzeUserMessage:', error);
    return "I honor you as the infinite Creator. Would you please share your thoughts again, that I might better serve?";
  }
};
