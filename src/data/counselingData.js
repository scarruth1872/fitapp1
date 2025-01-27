export const counselingData = {
  services: [
    {
      name: 'Individual Counseling',
      description: 'One-on-one counseling sessions tailored to your unique needs. Our experienced counselors provide a safe, confidential space to explore personal challenges, develop coping strategies, and work towards your goals.',
      benefits: [
        'Personalized attention and support',
        'Confidential environment for open discussion',
        'Flexible scheduling options',
        'Custom treatment plans',
        'Progress tracking and goal setting'
      ],
      modalities: ['In-person', 'Virtual'],
      durations: [30, 45, 60],
      keywords: ['individual', 'personal', 'one-on-one', 'private', 'therapy'],
      recommendedFor: [
        'Personal growth and self-discovery',
        'Anxiety and stress management',
        'Depression and mood disorders',
        'Relationship issues',
        'Life transitions'
      ]
    },
    {
      name: 'Group Counseling',
      description: 'Join a supportive community in our group counseling sessions. Share experiences, learn from others, and develop valuable interpersonal skills in a structured, therapeutic environment.',
      benefits: [
        'Peer support and shared experiences',
        'Cost-effective treatment option',
        'Development of social skills',
        'Multiple perspectives on challenges',
        'Practice of new behaviors in a safe space'
      ],
      modalities: ['In-person', 'Virtual'],
      durations: [60, 90],
      keywords: ['group', 'support group', 'group therapy', 'community'],
      recommendedFor: [
        'Social anxiety',
        'Interpersonal skills development',
        'Shared experiences and challenges',
        'Building support networks',
        'Learning from peers'
      ]
    },
    {
      name: 'Crisis Intervention',
      description: 'Immediate support for urgent mental health needs. Our crisis counselors are available to help you navigate difficult situations and develop immediate coping strategies.',
      benefits: [
        'Immediate professional support',
        'Quick access to resources',
        'Safety planning',
        'Short-term coping strategies',
        'Referral to ongoing support'
      ],
      modalities: ['In-person', 'Virtual', 'Phone'],
      durations: [30, 45, 60],
      keywords: ['crisis', 'emergency', 'urgent', 'immediate help'],
      recommendedFor: [
        'Acute stress or anxiety',
        'Immediate safety concerns',
        'Overwhelming emotions',
        'Sudden life changes',
        'Urgent mental health needs'
      ]
    },
    {
      name: 'Family Counseling',
      description: 'Strengthen family bonds and improve communication through family counseling. Work together to resolve conflicts, enhance understanding, and create a more harmonious home environment.',
      benefits: [
        'Improved family communication',
        'Conflict resolution skills',
        'Stronger family relationships',
        'Better understanding between members',
        'Healthy boundary setting'
      ],
      modalities: ['In-person', 'Virtual'],
      durations: [60, 90],
      keywords: ['family', 'family therapy', 'family counseling', 'parenting'],
      recommendedFor: [
        'Family conflicts',
        'Parenting challenges',
        'Blended family adjustment',
        'Communication issues',
        'Life transitions affecting family'
      ]
    }
  ],
  assessmentQuestions: [
    {
      category: 'Initial Assessment',
      questions: [
        'What brings you to counseling at this time?',
        'Have you experienced these feelings or situations before?',
        'What have you tried so far to address these concerns?',
        'How are these challenges affecting your daily life?',
        'What would you like to achieve through counseling?'
      ]
    },
    {
      category: 'Service Matching',
      questions: [
        'Do you prefer working one-on-one or in a group setting?',
        'How comfortable are you with virtual sessions?',
        'What days and times work best for your schedule?',
        'Do you have a preference for session duration?',
        'Are you interested in incorporating specific therapeutic approaches?'
      ]
    },
    {
      category: 'Support System',
      questions: [
        'Do you have support from family or friends?',
        'Are you currently working with any other mental health professionals?',
        'What types of support have you found helpful in the past?',
        'How do you typically cope with stress or difficult situations?',
        'Would you be interested in involving family members in your counseling?'
      ]
    }
  ],
  schedulingPrompts: {
    initial: "I can help you schedule an appointment. Would you prefer in-person or virtual sessions?",
    modality: "Great choice. What days of the week work best for you?",
    duration: "Our sessions are available in different lengths. Would you prefer a 30, 45, or 60-minute session?",
    confirmation: "I've found some available appointments that match your preferences. Would you like to see the options?"
  },
  errorMessages: {
    serviceUnavailable: "I apologize, but this service is temporarily unavailable. Please try again later or consider an alternative option.",
    schedulingError: "There was an issue with scheduling. Please try again or contact our office directly.",
    invalidInput: "I didn't quite understand that. Could you please rephrase or provide more information?",
    networkError: "We're experiencing connection issues. Please check your internet connection and try again."
  }
};
