// Nutrition Database
export const nutritionDatabase = {
  macronutrients: {
    protein: {
      name: 'Protein',
      role: 'Building blocks for muscle tissue, enzymes, and hormones',
      recommendedIntake: {
        general: '0.8-1.0g per kg of body weight',
        athletic: '1.2-2.0g per kg of body weight',
        strength: '1.6-2.2g per kg of body weight'
      },
      sources: {
        animal: [
          'Chicken breast',
          'Eggs',
          'Fish',
          'Lean beef',
          'Greek yogurt'
        ],
        plant: [
          'Lentils',
          'Quinoa',
          'Tofu',
          'Chickpeas',
          'Hemp seeds'
        ]
      },
      timing: {
        preworkout: '20-30g 2-3 hours before',
        postworkout: '20-40g within 30 minutes after',
        daily: 'Spread evenly throughout the day'
      }
    },
    // Add more macronutrients...
  },

  mealPlans: {
    strengthTraining: {
      name: 'Strength Training Meal Plan',
      calories: '2500-3000',
      macroDistribution: {
        protein: '30-35%',
        carbs: '40-50%',
        fats: '20-25%'
      },
      meals: {
        breakfast: {
          options: [
            {
              name: 'High-Protein Oatmeal',
              ingredients: [
                'Rolled oats',
                'Whey protein',
                'Banana',
                'Almonds',
                'Cinnamon'
              ],
              macros: {
                calories: 450,
                protein: 30,
                carbs: 65,
                fats: 12
              }
            }
            // Add more options...
          ]
        }
        // Add more meals...
      }
    }
    // Add more meal plans...
  },

  supplementation: {
    essential: {
      name: 'Essential Supplements',
      items: [
        {
          name: 'Whey Protein',
          benefits: [
            'Muscle recovery and growth',
            'Convenient protein source',
            'Fast absorption'
          ],
          timing: 'Post-workout or between meals',
          dosage: '20-30g per serving',
          considerations: [
            'Choose quality sources',
            'Check for allergies',
            'Consider digestibility'
          ]
        }
        // Add more supplements...
      ]
    }
    // Add more categories...
  },

  hydration: {
    guidelines: {
      general: '30-35ml per kg of body weight',
      athletic: 'Additional 500-1000ml per hour of exercise',
      preworkout: '500ml 2-3 hours before',
      duringWorkout: '200-300ml every 15-20 minutes',
      postworkout: 'Replace 150% of weight lost'
    },
    signs: {
      dehydration: [
        'Dark urine',
        'Thirst',
        'Fatigue',
        'Decreased performance'
      ],
      overhydration: [
        'Clear urine',
        'Frequent urination',
        'Nausea',
        'Headache'
      ]
    },
    electrolytes: {
      sodium: '500-700mg/L during exercise',
      potassium: '80-120mg/L during exercise',
      magnesium: '10-30mg/L during exercise'
    }
  }
};
