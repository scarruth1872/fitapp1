// Wellness and Recovery Database
export const wellnessDatabase = {
  recovery: {
    methods: {
      sleep: {
        name: 'Sleep Optimization',
        importance: [
          'Muscle recovery and growth',
          'Hormonal balance',
          'Mental recovery',
          'Performance enhancement'
        ],
        guidelines: {
          duration: '7-9 hours per night',
          quality: [
            'Dark room',
            'Cool temperature (65-68°F)',
            'Regular schedule',
            'No screens 1 hour before bed'
          ],
          supplements: [
            'Magnesium',
            'Zinc',
            'Melatonin (if needed)'
          ]
        }
      },
      stretching: {
        name: 'Flexibility and Mobility',
        types: {
          static: {
            description: 'Holding stretches for 15-60 seconds',
            timing: 'Post-workout or separate session',
            benefits: [
              'Increased range of motion',
              'Reduced muscle tension',
              'Improved posture'
            ]
          },
          dynamic: {
            description: 'Moving stretches',
            timing: 'Pre-workout',
            benefits: [
              'Improved blood flow',
              'Enhanced movement patterns',
              'Reduced injury risk'
            ]
          }
        }
      }
    },
    
    injuryPrevention: {
      commonInjuries: {
        muscleStrain: {
          name: 'Muscle Strain',
          causes: [
            'Overtraining',
            'Poor form',
            'Inadequate warm-up'
          ],
          prevention: [
            'Proper warm-up',
            'Progressive overload',
            'Regular stretching'
          ],
          treatment: [
            'RICE protocol',
            'Gentle stretching',
            'Gradual return to activity'
          ]
        }
        // Add more injuries...
      }
    }
  },

  mentalWellness: {
    stressManagement: {
      techniques: [
        {
          name: 'Deep Breathing',
          method: 'Box breathing (4-4-4-4)',
          benefits: [
            'Reduced stress',
            'Improved focus',
            'Better recovery'
          ]
        },
        {
          name: 'Meditation',
          method: 'Guided or silent meditation',
          benefits: [
            'Mental clarity',
            'Stress reduction',
            'Enhanced mind-body connection'
          ]
        }
      ]
    },
    motivation: {
      strategies: [
        {
          name: 'Goal Setting',
          principles: [
            'SMART goals',
            'Progressive milestones',
            'Regular review and adjustment'
          ]
        },
        {
          name: 'Habit Formation',
          principles: [
            'Start small',
            'Consistency over intensity',
            'Environment design'
          ]
        }
      ]
    }
  },

  lifestyle: {
    workLifeBalance: {
      principles: [
        'Set boundaries',
        'Prioritize recovery',
        'Schedule exercise',
        'Plan meals ahead'
      ],
      strategies: {
        timeManagement: [
          'Block scheduling',
          'Priority matrix',
          'Regular review'
        ],
        stressReduction: [
          'Regular exercise',
          'Meditation',
          'Outdoor activities'
        ]
      }
    },
    environmentalFactors: {
      workspace: [
        'Ergonomic setup',
        'Regular movement breaks',
        'Proper lighting'
      ],
      sleep: [
        'Dark room',
        'Cool temperature',
        'Minimal noise'
      ],
      exercise: [
        'Dedicated space',
        'Proper equipment',
        'Good ventilation'
      ]
    }
  }
};
