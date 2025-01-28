// Exercise Database with detailed anatomical information
export const exerciseDatabase = {
  categories: {
    strength: {
      name: 'Strength Training',
      exercises: [
        {
          id: 'bb-squat',
          name: 'Barbell Squat',
          type: 'compound',
          equipment: ['barbell', 'rack'],
          difficulty: 'intermediate',
          primaryMuscles: ['quadriceps', 'gluteus maximus', 'hamstrings'],
          secondaryMuscles: ['core', 'lower back', 'calves'],
          mechanics: 'compound',
          force: 'push',
          preparation: [
            'Position barbell on upper back',
            'Feet shoulder-width apart',
            'Chest up, core braced'
          ],
          execution: [
            'Break at hips and knees simultaneously',
            'Lower until thighs are parallel to ground',
            'Drive through heels to stand'
          ],
          tips: [
            'Keep chest up throughout movement',
            'Maintain neutral spine',
            'Drive knees out during descent'
          ],
          commonErrors: [
            'Knees caving in',
            'Rounding lower back',
            'Rising on toes'
          ],
          benefits: [
            'Builds lower body strength',
            'Improves core stability',
            'Enhances athletic performance'
          ],
          variations: [
            'Front squat',
            'Box squat',
            'Pause squat'
          ]
        },
        {
          id: 'bb-bench-press',
          name: 'Barbell Bench Press',
          type: 'compound',
          equipment: ['barbell', 'bench', 'rack'],
          difficulty: 'intermediate',
          primaryMuscles: ['chest', 'triceps', 'anterior deltoids'],
          secondaryMuscles: ['core', 'serratus anterior'],
          mechanics: 'compound',
          force: 'push',
          preparation: [
            'Lie on bench with feet flat on ground',
            'Grip barbell slightly wider than shoulder width',
            'Retract shoulder blades'
          ],
          execution: [
            'Lower bar to mid-chest with control',
            'Touch chest lightly',
            'Press bar up to starting position'
          ],
          tips: [
            'Keep wrists straight',
            'Drive with leg drive',
            'Maintain back arch'
          ],
          commonErrors: [
            'Bouncing bar off chest',
            'Flaring elbows excessively',
            'Lifting hips off bench'
          ],
          benefits: [
            'Builds upper body strength',
            'Improves pushing power',
            'Develops chest muscles'
          ],
          variations: [
            'Close-grip bench press',
            'Incline bench press',
            'Decline bench press'
          ]
        },
        {
          id: 'bb-deadlift',
          name: 'Barbell Deadlift',
          type: 'compound',
          equipment: ['barbell'],
          difficulty: 'advanced',
          primaryMuscles: ['lower back', 'hamstrings', 'gluteus maximus'],
          secondaryMuscles: ['core', 'trapezius', 'forearms'],
          mechanics: 'compound',
          force: 'pull',
          preparation: [
            'Stand with feet hip-width apart',
            'Barbell over mid-foot',
            'Grip bar just outside legs'
          ],
          execution: [
            'Hinge at hips to grip bar',
            'Keep back straight, chest up',
            'Drive through heels to stand'
          ],
          tips: [
            'Keep bar close to body',
            'Engage lats before lifting',
            'Breathe and brace properly'
          ],
          commonErrors: [
            'Rounding lower back',
            'Starting with hips too low',
            'Letting bar drift forward'
          ],
          benefits: [
            'Builds overall strength',
            'Improves posture',
            'Develops posterior chain'
          ],
          variations: [
            'Romanian deadlift',
            'Sumo deadlift',
            'Stiff-legged deadlift'
          ]
        },
        {
          id: 'bb-row',
          name: 'Barbell Row',
          type: 'compound',
          equipment: ['barbell'],
          difficulty: 'intermediate',
          primaryMuscles: ['latissimus dorsi', 'rhomboids', 'trapezius'],
          secondaryMuscles: ['biceps', 'rear deltoids', 'core'],
          mechanics: 'compound',
          force: 'pull',
          preparation: [
            'Hinge at hips, back straight',
            'Grip bar slightly wider than shoulder width',
            'Let bar hang at arms length'
          ],
          execution: [
            'Pull bar to lower chest/upper abdomen',
            'Keep elbows close to body',
            'Squeeze shoulder blades together'
          ],
          tips: [
            'Maintain neutral spine',
            'Keep core tight',
            'Control the descent'
          ],
          commonErrors: [
            'Using too much momentum',
            'Rounding the back',
            'Insufficient range of motion'
          ],
          benefits: [
            'Builds back strength',
            'Improves posture',
            'Develops pulling power'
          ],
          variations: [
            'Pendlay row',
            'Underhand barbell row',
            'Meadows row'
          ]
        },
        {
          id: 'overhead-press',
          name: 'Overhead Press',
          type: 'compound',
          equipment: ['barbell'],
          difficulty: 'intermediate',
          primaryMuscles: ['deltoids', 'triceps', 'upper chest'],
          secondaryMuscles: ['core', 'upper back', 'serratus anterior'],
          mechanics: 'compound',
          force: 'push',
          preparation: [
            'Stand with feet shoulder-width apart',
            'Grip bar just outside shoulders',
            'Elbows pointed forward'
          ],
          execution: [
            'Press bar overhead',
            'Move head back as bar passes face',
            'Lock out arms at top'
          ],
          tips: [
            'Keep core tight',
            'Full range of motion',
            'Breathe properly'
          ],
          commonErrors: [
            'Leaning back excessively',
            'Poor bar path',
            'Incomplete lockout'
          ],
          benefits: [
            'Builds shoulder strength',
            'Improves core stability',
            'Develops overhead pressing power'
          ],
          variations: [
            'Push press',
            'Behind-the-neck press',
            'Seated overhead press'
          ]
        },
        {
          id: 'front-squat',
          name: 'Front Squat',
          type: 'compound',
          equipment: ['barbell', 'rack'],
          difficulty: 'intermediate',
          primaryMuscles: ['quadriceps', 'core'],
          secondaryMuscles: ['glutes', 'upper back'],
          mechanics: 'compound',
          force: 'push',
          preparation: [
            'Bar on front deltoids',
            'Elbows high',
            'Core braced'
          ],
          execution: [
            'Break at knees and hips',
            'Keep torso upright',
            'Drive through heels'
          ],
          tips: [
            'Maintain elbow position',
            'Keep chest up',
            'Control descent'
          ],
          commonErrors: [
            'Dropping elbows',
            'Forward lean',
            'Heels rising'
          ],
          benefits: [
            'Quad development',
            'Core strength',
            'Posture improvement'
          ],
          variations: [
            'Zombie squat',
            'Cross-arm grip',
            'Belt squat'
          ]
        },
        {
          id: 'romanian-deadlift',
          name: 'Romanian Deadlift',
          type: 'compound',
          equipment: ['barbell'],
          difficulty: 'intermediate',
          primaryMuscles: ['hamstrings', 'glutes'],
          secondaryMuscles: ['lower back', 'core'],
          mechanics: 'hinge',
          force: 'pull',
          preparation: [
            'Hold bar at hips',
            'Slight knee bend',
            'Chest up'
          ],
          execution: [
            'Hip hinge back',
            'Bar close to legs',
            'Feel hamstring stretch'
          ],
          tips: [
            'Keep back straight',
            'Push hips back',
            'Control the bar'
          ],
          commonErrors: [
            'Rounding back',
            'Bar too far forward',
            'Squatting down'
          ],
          benefits: [
            'Hamstring development',
            'Hip mobility',
            'Back strength'
          ],
          variations: [
            'Single leg RDL',
            'Dumbbell RDL',
            'Banded RDL'
          ]
        },
        {
          id: 'incline-bench',
          name: 'Incline Bench Press',
          type: 'compound',
          equipment: ['barbell', 'bench'],
          difficulty: 'intermediate',
          primaryMuscles: ['upper chest', 'front deltoids'],
          secondaryMuscles: ['triceps', 'core'],
          mechanics: 'push',
          force: 'push',
          preparation: [
            'Set bench 30-45°',
            'Grip slightly wider than shoulders',
            'Feet planted'
          ],
          execution: [
            'Lower bar to upper chest',
            'Keep elbows 45°',
            'Press to lockout'
          ],
          tips: [
            'Control descent',
            'Keep shoulders back',
            'Full range of motion'
          ],
          commonErrors: [
            'Bouncing bar',
            'Bridge hips',
            'Flaring elbows'
          ],
          benefits: [
            'Upper chest development',
            'Shoulder strength',
            'Press variation'
          ],
          variations: [
            'Dumbbell incline',
            'Close grip incline',
            'Smith machine incline'
          ]
        },
        {
          id: 'good-morning',
          name: 'Good Morning',
          type: 'compound',
          equipment: ['barbell'],
          difficulty: 'intermediate',
          primaryMuscles: ['lower back', 'hamstrings'],
          secondaryMuscles: ['glutes', 'core'],
          mechanics: 'hinge',
          force: 'hinge',
          preparation: [
            'Bar on upper back',
            'Feet shoulder width',
            'Slight knee bend'
          ],
          execution: [
            'Hinge at hips',
            'Keep back straight',
            'Return to start'
          ],
          tips: [
            'Push hips back',
            'Look forward',
            'Control movement'
          ],
          commonErrors: [
            'Rounding back',
            'Bending knees too much',
            'Moving too fast'
          ],
          benefits: [
            'Back strength',
            'Hip mobility',
            'Deadlift assistance'
          ],
          variations: [
            'Seated good morning',
            'Band good morning',
            'Single leg'
          ]
        },
        {
          id: 'lat-pulldown',
          name: 'Lat Pulldown',
          type: 'compound',
          equipment: ['cable machine', 'lat bar'],
          difficulty: 'beginner',
          primaryMuscles: ['latissimus dorsi', 'biceps'],
          secondaryMuscles: ['rear deltoids', 'rhomboids'],
          mechanics: 'pull',
          force: 'pull',
          preparation: [
            'Grip bar wide',
            'Sit with thighs secured',
            'Chest up'
          ],
          execution: [
            'Pull bar to chest',
            'Lead with elbows',
            'Control return'
          ],
          tips: [
            'Keep chest up',
            'Full range of motion',
            'Squeeze lats'
          ],
          commonErrors: [
            'Leaning back too far',
            'Using momentum',
            'Incomplete range'
          ],
          benefits: [
            'Back width',
            'Pull-up progression',
            'Upper body strength'
          ],
          variations: [
            'Close grip',
            'Behind neck',
            'Single arm'
          ]
        },
        {
          id: 'dumbbell-row',
          name: 'Dumbbell Row',
          type: 'compound',
          equipment: ['dumbbell', 'bench'],
          difficulty: 'beginner',
          primaryMuscles: ['latissimus dorsi', 'rhomboids'],
          secondaryMuscles: ['biceps', 'rear deltoids'],
          mechanics: 'pull',
          force: 'pull',
          preparation: [
            'One knee on bench',
            'Other foot planted',
            'Back parallel to ground'
          ],
          execution: [
            'Pull dumbbell to hip',
            'Keep elbow close',
            'Lower with control'
          ],
          tips: [
            'Keep back straight',
            'Squeeze shoulder blade',
            'Full range of motion'
          ],
          commonErrors: [
            'Twisting body',
            'Using momentum',
            'Poor posture'
          ],
          benefits: [
            'Back thickness',
            'Unilateral strength',
            'Core stability'
          ],
          variations: [
            'Two-arm bent over row',
            'Meadows row',
            'Incline bench row'
          ]
        },
        {
          id: 'leg-press',
          name: 'Leg Press',
          type: 'compound',
          equipment: ['leg press machine'],
          difficulty: 'beginner',
          primaryMuscles: ['quadriceps', 'glutes'],
          secondaryMuscles: ['hamstrings', 'calves'],
          mechanics: 'push',
          force: 'push',
          preparation: [
            'Adjust seat position',
            'Feet shoulder width',
            'Back against pad'
          ],
          execution: [
            'Lower weight controlled',
            'Push through heels',
            'Dont lock knees'
          ],
          tips: [
            'Keep lower back pressed',
            'Control tempo',
            'Proper depth'
          ],
          commonErrors: [
            'Locking knees',
            'Bouncing bottom',
            'Too shallow depth'
          ],
          benefits: [
            'Leg development',
            'Squat alternative',
            'Lower body strength'
          ],
          variations: [
            'Single leg',
            'Wide stance',
            'High foot position'
          ]
        }
      ]
    },
    cardio: {
      name: 'Cardiovascular Training',
      exercises: [
        {
          id: 'treadmill',
          name: 'Treadmill',
          type: 'cardio',
          equipment: ['treadmill'],
          difficulty: 'beginner',
          primaryMuscles: ['legs', 'core'],
          secondaryMuscles: ['cardiovascular system'],
          mechanics: 'compound',
          force: 'dynamic',
          preparation: [
            'Adjust incline and speed',
            'Hold handrails',
            'Start walking or jogging'
          ],
          execution: [
            'Maintain steady pace',
            'Keep posture upright',
            'Monitor heart rate'
          ],
          tips: [
            'Start slow and increase intensity',
            'Focus on breathing',
            'Stay hydrated'
          ],
          commonErrors: [
            'Holding handrails too tight',
            'Looking down',
            'Not monitoring progress'
          ],
          benefits: [
            'Improves cardiovascular health',
            'Increases endurance',
            'Burns calories'
          ],
          variations: [
            'Incline walking',
            'Interval training',
            'Long steady state'
          ]
        },
        {
          id: 'stationary-bike',
          name: 'Stationary Bike',
          type: 'cardio',
          equipment: ['stationary bike'],
          difficulty: 'beginner',
          primaryMuscles: ['legs', 'core'],
          secondaryMuscles: ['cardiovascular system'],
          mechanics: 'compound',
          force: 'dynamic',
          preparation: [
            'Adjust seat height',
            'Hold handlebars',
            'Start pedaling'
          ],
          execution: [
            'Maintain steady pace',
            'Keep posture upright',
            'Monitor heart rate'
          ],
          tips: [
            'Start slow and increase intensity',
            'Focus on breathing',
            'Stay hydrated'
          ],
          commonErrors: [
            'Holding handlebars too tight',
            'Looking down',
            'Not monitoring progress'
          ],
          benefits: [
            'Improves cardiovascular health',
            'Increases endurance',
            'Burns calories'
          ],
          variations: [
            'High resistance',
            'Interval training',
            'Long steady state'
          ]
        },
        {
          id: 'elliptical',
          name: 'Elliptical Trainer',
          type: 'cardio',
          equipment: ['elliptical trainer'],
          difficulty: 'beginner',
          primaryMuscles: ['legs', 'core'],
          secondaryMuscles: ['cardiovascular system'],
          mechanics: 'compound',
          force: 'dynamic',
          preparation: [
            'Adjust resistance',
            'Hold handlebars',
            'Start moving'
          ],
          execution: [
            'Maintain steady pace',
            'Keep posture upright',
            'Monitor heart rate'
          ],
          tips: [
            'Start slow and increase intensity',
            'Focus on breathing',
            'Stay hydrated'
          ],
          commonErrors: [
            'Holding handlebars too tight',
            'Looking down',
            'Not monitoring progress'
          ],
          benefits: [
            'Improves cardiovascular health',
            'Increases endurance',
            'Burns calories'
          ],
          variations: [
            'High resistance',
            'Interval training',
            'Long steady state'
          ]
        },
        {
          id: 'mountain-climber',
          name: 'Mountain Climbers',
          type: 'cardio',
          equipment: ['none'],
          difficulty: 'intermediate',
          primaryMuscles: ['core', 'hip flexors'],
          secondaryMuscles: ['shoulders', 'quadriceps'],
          mechanics: 'compound',
          force: 'dynamic',
          preparation: [
            'Start in plank position',
            'Core engaged',
            'Shoulders stable'
          ],
          execution: [
            'Drive knees alternately',
            'Keep hips level',
            'Maintain rhythm'
          ],
          tips: [
            'Quick pace',
            'Control movement',
            'Keep core tight'
          ],
          commonErrors: [
            'Bouncing hips',
            'Slow pace',
            'Poor plank form'
          ],
          benefits: [
            'Cardio endurance',
            'Core strength',
            'Coordination'
          ],
          variations: [
            'Slow climbers',
            'Cross-body',
            'Sliding surface'
          ]
        },
        {
          id: 'rowing',
          name: 'Rowing Machine',
          type: 'cardio',
          equipment: ['rowing machine'],
          difficulty: 'beginner',
          primaryMuscles: ['back', 'legs'],
          secondaryMuscles: ['core', 'arms'],
          mechanics: 'compound',
          force: 'pull',
          preparation: [
            'Adjust foot straps',
            'Set resistance',
            'Grab handle'
          ],
          execution: [
            'Push with legs',
            'Lean back slightly',
            'Pull handle to chest'
          ],
          tips: [
            'Legs-core-arms sequence',
            'Control return',
            'Maintain rhythm'
          ],
          commonErrors: [
            'Arms first',
            'Rushing return',
            'Poor posture'
          ],
          benefits: [
            'Full body workout',
            'Low impact',
            'Cardio fitness'
          ],
          variations: [
            'High intensity intervals',
            'Long steady state',
            'Tabata style'
          ]
        },
        {
          id: 'jumping-jacks',
          name: 'Jumping Jacks',
          type: 'cardio',
          equipment: ['none'],
          difficulty: 'beginner',
          primaryMuscles: ['full body'],
          secondaryMuscles: ['shoulders', 'calves'],
          mechanics: 'compound',
          force: 'dynamic',
          preparation: [
            'Stand with feet together',
            'Arms at sides',
            'Core engaged'
          ],
          execution: [
            'Jump feet out wide',
            'Raise arms overhead',
            'Return to start'
          ],
          tips: [
            'Keep rhythm steady',
            'Land softly',
            'Breathe regularly'
          ],
          commonErrors: [
            'Arms not full range',
            'Poor coordination',
            'Heavy landing'
          ],
          benefits: [
            'Full body warmup',
            'Coordination',
            'Heart rate elevation'
          ],
          variations: [
            'Cross jacks',
            'Plyo jacks',
            'Low impact'
          ]
        },
        {
          id: 'battle-ropes',
          name: 'Battle Ropes',
          type: 'cardio',
          equipment: ['battle ropes'],
          difficulty: 'intermediate',
          primaryMuscles: ['shoulders', 'arms'],
          secondaryMuscles: ['core', 'back'],
          mechanics: 'compound',
          force: 'dynamic',
          preparation: [
            'Athletic stance',
            'Grip ropes ends',
            'Slight knee bend'
          ],
          execution: [
            'Alternate arm waves',
            'Keep waves consistent',
            'Maintain stance'
          ],
          tips: [
            'Keep core engaged',
            'Full arm motion',
            'Control breathing'
          ],
          commonErrors: [
            'Standing too upright',
            'Small movements',
            'Losing rhythm'
          ],
          benefits: [
            'Upper body endurance',
            'Core stability',
            'Power development'
          ],
          variations: [
            'Slams',
            'Circles',
            'Jumping waves'
          ]
        },
        {
          id: 'kettlebell-swing',
          name: 'Kettlebell Swing',
          type: 'cardio',
          equipment: ['kettlebell'],
          difficulty: 'intermediate',
          primaryMuscles: ['hips', 'glutes'],
          secondaryMuscles: ['core', 'shoulders'],
          mechanics: 'hinge',
          force: 'dynamic',
          preparation: [
            'Hip width stance',
            'Kettlebell between feet',
            'Hinge at hips'
          ],
          execution: [
            'Hike kettlebell back',
            'Explosive hip drive',
            'Float to chest height'
          ],
          tips: [
            'Hip hinge not squat',
            'Pack shoulders',
            'Breathe rhythm'
          ],
          commonErrors: [
            'Squatting motion',
            'Arms lifting',
            'Rounded back'
          ],
          benefits: [
            'Power endurance',
            'Hip mobility',
            'Cardio fitness'
          ],
          variations: [
            'American swing',
            'Single arm',
            'Double kettlebell'
          ]
        },
        {
          id: 'box-step-ups',
          name: 'Box Step-Ups',
          type: 'cardio',
          equipment: ['box', 'platform'],
          difficulty: 'beginner',
          primaryMuscles: ['quadriceps', 'glutes'],
          secondaryMuscles: ['hamstrings', 'calves'],
          mechanics: 'compound',
          force: 'push',
          preparation: [
            'Face box/platform',
            'Select appropriate height',
            'Stand close to box'
          ],
          execution: [
            'Step up with lead leg',
            'Drive through heel',
            'Alternate legs'
          ],
          tips: [
            'Maintain good posture',
            'Control descent',
            'Use arms naturally'
          ],
          commonErrors: [
            'Pushing off back leg',
            'Leaning forward',
            'Uneven pace'
          ],
          benefits: [
            'Unilateral strength',
            'Balance',
            'Cardio endurance'
          ],
          variations: [
            'High knee finish',
            'Weighted',
            'Speed step-ups'
          ]
        },
        {
          id: 'stair-climber',
          name: 'Stair Climber',
          type: 'cardio',
          equipment: ['stair climber machine'],
          difficulty: 'beginner',
          primaryMuscles: ['legs', 'glutes'],
          secondaryMuscles: ['core', 'calves'],
          mechanics: 'compound',
          force: 'push',
          preparation: [
            'Hold handrails lightly',
            'Stand upright',
            'Set appropriate speed'
          ],
          execution: [
            'Climb steadily',
            'Full foot placement',
            'Maintain posture'
          ],
          tips: [
            'Dont lean on rails',
            'Keep core engaged',
            'Look forward'
          ],
          commonErrors: [
            'Skipping steps',
            'Heavy rail support',
            'Poor posture'
          ],
          benefits: [
            'Lower body toning',
            'Cardio endurance',
            'Calorie burn'
          ],
          variations: [
            'Skip steps',
            'Side steps',
            'No hands'
          ]
        }
      ]
    },
    isolation: {
      name: 'Isolation Exercises',
      exercises: [
        {
          id: 'bicep-curl',
          name: 'Bicep Curl',
          type: 'isolation',
          equipment: ['dumbbells', 'barbell'],
          difficulty: 'beginner',
          primaryMuscles: ['biceps'],
          secondaryMuscles: ['forearms'],
          mechanics: 'isolation',
          force: 'pull',
          preparation: [
            'Stand straight',
            'Grip weights',
            'Arms at sides'
          ],
          execution: [
            'Curl weights up',
            'Squeeze biceps',
            'Lower with control'
          ],
          tips: [
            'Keep elbows still',
            'Full range of motion',
            'Control tempo'
          ],
          commonErrors: [
            'Swinging body',
            'Using momentum',
            'Half reps'
          ],
          benefits: [
            'Bicep strength',
            'Arm aesthetics',
            'Grip strength'
          ],
          variations: [
            'Hammer curls',
            'Preacher curls',
            'Concentration curls'
          ]
        },
        {
          id: 'tricep-extension',
          name: 'Tricep Extension',
          type: 'isolation',
          equipment: ['dumbbell', 'cable'],
          difficulty: 'beginner',
          primaryMuscles: ['triceps'],
          secondaryMuscles: ['shoulders'],
          mechanics: 'isolation',
          force: 'push',
          preparation: [
            'Stand or sit',
            'Weight overhead',
            'Elbows by ears'
          ],
          execution: [
            'Lower behind head',
            'Extend arms',
            'Control return'
          ],
          tips: [
            'Keep elbows in',
            'Full extension',
            'Steady tempo'
          ],
          commonErrors: [
            'Moving elbows',
            'Using momentum',
            'Incomplete extension'
          ],
          benefits: [
            'Tricep definition',
            'Arm strength',
            'Elbow stability'
          ],
          variations: [
            'Rope pushdown',
            'Single arm',
            'Reverse grip'
          ]
        },
        {
          id: 'lateral-raise',
          name: 'Lateral Raise',
          type: 'isolation',
          equipment: ['dumbbells'],
          difficulty: 'beginner',
          primaryMuscles: ['lateral deltoids'],
          secondaryMuscles: ['traps', 'anterior deltoids'],
          mechanics: 'isolation',
          force: 'push',
          preparation: [
            'Stand straight',
            'Dumbbells at sides',
            'Slight bend in elbows'
          ],
          execution: [
            'Raise arms out',
            'Up to shoulder height',
            'Lower slowly'
          ],
          tips: [
            'Lead with elbows',
            'Control descent',
            'Keep form strict'
          ],
          commonErrors: [
            'Using momentum',
            'Raising too high',
            'Internal rotation'
          ],
          benefits: [
            'Shoulder width',
            'Deltoid strength',
            'Better posture'
          ],
          variations: [
            'Cable raises',
            'Front raises',
            'Bent over raises'
          ]
        },
        {
          id: 'calf-raise',
          name: 'Calf Raise',
          type: 'isolation',
          equipment: ['none', 'machine'],
          difficulty: 'beginner',
          primaryMuscles: ['calves'],
          secondaryMuscles: ['ankle stabilizers'],
          mechanics: 'isolation',
          force: 'push',
          preparation: [
            'Stand on edge',
            'Balls of feet',
            'Heels hanging'
          ],
          execution: [
            'Rise up high',
            'Hold peak',
            'Lower slowly'
          ],
          tips: [
            'Full range motion',
            'Control movement',
            'Stay balanced'
          ],
          commonErrors: [
            'Partial reps',
            'Too fast',
            'Poor balance'
          ],
          benefits: [
            'Calf development',
            'Ankle strength',
            'Jump power'
          ],
          variations: [
            'Seated raises',
            'Single leg',
            'Smith machine'
          ]
        },
        {
          id: 'leg-extension',
          name: 'Leg Extension',
          type: 'isolation',
          equipment: ['machine'],
          difficulty: 'beginner',
          primaryMuscles: ['quadriceps'],
          secondaryMuscles: ['knee stabilizers'],
          mechanics: 'isolation',
          force: 'push',
          preparation: [
            'Sit in machine',
            'Adjust pad',
            'Back supported'
          ],
          execution: [
            'Extend legs',
            'Hold contraction',
            'Lower controlled'
          ],
          tips: [
            'Keep back flat',
            'Point toes up',
            'Full extension'
          ],
          commonErrors: [
            'Swinging weight',
            'Fast descent',
            'Poor alignment'
          ],
          benefits: [
            'Quad isolation',
            'Knee strength',
            'Muscle definition'
          ],
          variations: [
            'Single leg',
            'Pulse reps',
            'Drop sets'
          ]
        },
        {
          id: 'leg-curl',
          name: 'Leg Curl',
          type: 'isolation',
          equipment: ['machine'],
          difficulty: 'beginner',
          primaryMuscles: ['hamstrings'],
          secondaryMuscles: ['calves'],
          mechanics: 'isolation',
          force: 'pull',
          preparation: [
            'Lie face down',
            'Ankles under pad',
            'Hips pressed down'
          ],
          execution: [
            'Curl legs up',
            'Squeeze hamstrings',
            'Lower with control'
          ],
          tips: [
            'Keep hips down',
            'Full range motion',
            'Control tempo'
          ],
          commonErrors: [
            'Lifting hips',
            'Fast movement',
            'Incomplete curl'
          ],
          benefits: [
            'Hamstring strength',
            'Knee stability',
            'Leg balance'
          ],
          variations: [
            'Standing curl',
            'Single leg',
            'Seated curl'
          ]
        },
        {
          id: 'pec-deck',
          name: 'Pec Deck',
          type: 'isolation',
          equipment: ['machine'],
          difficulty: 'beginner',
          primaryMuscles: ['chest'],
          secondaryMuscles: ['anterior deltoids'],
          mechanics: 'isolation',
          force: 'push',
          preparation: [
            'Sit upright',
            'Grab handles',
            'Elbows bent'
          ],
          execution: [
            'Squeeze pecs',
            'Bring arms together',
            'Control return'
          ],
          tips: [
            'Keep back flat',
            'Maintain elbow height',
            'Focus on squeeze'
          ],
          commonErrors: [
            'Using momentum',
            'Elbows dropping',
            'Rush movement'
          ],
          benefits: [
            'Chest isolation',
            'Inner chest',
            'Muscle control'
          ],
          variations: [
            'Cable flyes',
            'Dumbbell flyes',
            'Low to high'
          ]
        },
        {
          id: 'face-pull',
          name: 'Face Pull',
          type: 'isolation',
          equipment: ['cable', 'resistance band'],
          difficulty: 'intermediate',
          primaryMuscles: ['rear deltoids'],
          secondaryMuscles: ['traps', 'rotator cuff'],
          mechanics: 'isolation',
          force: 'pull',
          preparation: [
            'Cable at head height',
            'Rope attachment',
            'Step back'
          ],
          execution: [
            'Pull to face',
            'External rotation',
            'Control return'
          ],
          tips: [
            'Lead with elbows',
            'Pull high',
            'Pause at peak'
          ],
          commonErrors: [
            'Too heavy weight',
            'Poor posture',
            'Internal rotation'
          ],
          benefits: [
            'Shoulder health',
            'Posture',
            'Upper back'
          ],
          variations: [
            'Band pulls',
            'High to low',
            'Single arm'
          ]
        },
        {
          id: 'wrist-curl',
          name: 'Wrist Curl',
          type: 'isolation',
          equipment: ['dumbbell', 'barbell'],
          difficulty: 'beginner',
          primaryMuscles: ['forearms'],
          secondaryMuscles: ['grip muscles'],
          mechanics: 'isolation',
          force: 'pull',
          preparation: [
            'Forearms on bench',
            'Wrists off edge',
            'Palms up'
          ],
          execution: [
            'Curl wrists up',
            'Full contraction',
            'Lower slowly'
          ],
          tips: [
            'Keep forearms still',
            'Full range',
            'Control movement'
          ],
          commonErrors: [
            'Using arms',
            'Too heavy',
            'Fast reps'
          ],
          benefits: [
            'Forearm strength',
            'Grip power',
            'Wrist stability'
          ],
          variations: [
            'Reverse curl',
            'Behind back',
            'Hammer curl'
          ]
        },
        {
          id: 'reverse-fly',
          name: 'Reverse Fly',
          type: 'isolation',
          equipment: ['dumbbells', 'cables'],
          difficulty: 'beginner',
          primaryMuscles: ['rear deltoids'],
          secondaryMuscles: ['traps', 'rhomboids'],
          mechanics: 'isolation',
          force: 'pull',
          preparation: [
            'Bend forward',
            'Arms hanging',
            'Slight elbow bend'
          ],
          execution: [
            'Raise arms out',
            'Squeeze shoulder blades',
            'Lower controlled'
          ],
          tips: [
            'Keep chest up',
            'Control movement',
            'Feel rear delts'
          ],
          commonErrors: [
            'Swinging weights',
            'Poor posture',
            'Using traps'
          ],
          benefits: [
            'Rear delt development',
            'Posture',
            'Shoulder balance'
          ],
          variations: [
            'Incline bench',
            'Pec deck reverse',
            'Single arm'
          ]
        }
      ]
    },
    core: {
      name: 'Core Training',
      exercises: [
        {
          id: 'plank',
          name: 'Plank',
          type: 'core',
          equipment: ['none'],
          difficulty: 'beginner',
          primaryMuscles: ['core'],
          secondaryMuscles: ['shoulders', 'lower back'],
          mechanics: 'isometric',
          force: 'static',
          preparation: [
            'Forearms on ground',
            'Elbows under shoulders',
            'Body straight'
          ],
          execution: [
            'Hold position',
            'Keep body rigid',
            'Maintain form'
          ],
          tips: [
            'Engage core',
            'Keep hips level',
            'Breathe steadily'
          ],
          commonErrors: [
            'Sagging hips',
            'Raised hips',
            'Head dropping'
          ],
          benefits: [
            'Core strength',
            'Stability',
            'Posture'
          ],
          variations: [
            'Side plank',
            'High plank',
            'Dynamic plank'
          ]
        },
        {
          id: 'russian-twist',
          name: 'Russian Twist',
          type: 'core',
          equipment: ['weight plate', 'dumbbell'],
          difficulty: 'intermediate',
          primaryMuscles: ['obliques', 'core'],
          secondaryMuscles: ['hip flexors'],
          mechanics: 'rotation',
          force: 'dynamic',
          preparation: [
            'Sit with knees bent',
            'Feet off ground',
            'Hold weight'
          ],
          execution: [
            'Rotate torso',
            'Touch weight to sides',
            'Control movement'
          ],
          tips: [
            'Keep chest up',
            'Engage core',
            'Smooth rotation'
          ],
          commonErrors: [
            'Using momentum',
            'Rounding back',
            'Fast movement'
          ],
          benefits: [
            'Rotational strength',
            'Core stability',
            'Oblique definition'
          ],
          variations: [
            'Feet down',
            'No weight',
            'Medicine ball'
          ]
        },
        {
          id: 'dead-bug',
          name: 'Dead Bug',
          type: 'core',
          equipment: ['none'],
          difficulty: 'beginner',
          primaryMuscles: ['core'],
          secondaryMuscles: ['hip flexors', 'lower back'],
          mechanics: 'compound',
          force: 'dynamic',
          preparation: [
            'Lie on back',
            'Arms up',
            'Knees bent 90'
          ],
          execution: [
            'Lower opposite limbs',
            'Keep back flat',
            'Return to start'
          ],
          tips: [
            'Press lower back down',
            'Move slowly',
            'Breathe steady'
          ],
          commonErrors: [
            'Arching back',
            'Fast movement',
            'Poor coordination'
          ],
          benefits: [
            'Core stability',
            'Coordination',
            'Back health'
          ],
          variations: [
            'Single limb',
            'With weights',
            'Straight legs'
          ]
        },
        {
          id: 'hanging-leg-raise',
          name: 'Hanging Leg Raise',
          type: 'core',
          equipment: ['pull-up bar'],
          difficulty: 'advanced',
          primaryMuscles: ['lower abs', 'hip flexors'],
          secondaryMuscles: ['upper abs', 'grip'],
          mechanics: 'compound',
          force: 'dynamic',
          preparation: [
            'Hang from bar',
            'Shoulders packed',
            'Core engaged'
          ],
          execution: [
            'Raise legs straight',
            'Control descent',
            'No swing'
          ],
          tips: [
            'Keep legs straight',
            'Slow movement',
            'Full range'
          ],
          commonErrors: [
            'Using momentum',
            'Bent knees',
            'Incomplete range'
          ],
          benefits: [
            'Lower ab strength',
            'Core control',
            'Grip strength'
          ],
          variations: [
            'Knee raises',
            'Toes to bar',
            'L-sit holds'
          ]
        },
        {
          id: 'ab-wheel-rollout',
          name: 'Ab Wheel Rollout',
          type: 'core',
          equipment: ['ab wheel'],
          difficulty: 'advanced',
          primaryMuscles: ['core', 'lats'],
          secondaryMuscles: ['shoulders', 'triceps'],
          mechanics: 'compound',
          force: 'dynamic',
          preparation: [
            'Kneel on pad',
            'Grip wheel',
            'Arms straight'
          ],
          execution: [
            'Roll forward',
            'Keep core tight',
            'Pull back'
          ],
          tips: [
            'Maintain curve',
            'Control movement',
            'Full extension'
          ],
          commonErrors: [
            'Sagging hips',
            'Arms bending',
            'Too far out'
          ],
          benefits: [
            'Core strength',
            'Stability',
            'Anti-extension'
          ],
          variations: [
            'Standing rollout',
            'Band resisted',
            'Half rollout'
          ]
        },
        {
          id: 'pallof-press',
          name: 'Pallof Press',
          type: 'core',
          equipment: ['cable machine', 'resistance band'],
          difficulty: 'intermediate',
          primaryMuscles: ['core', 'obliques'],
          secondaryMuscles: ['shoulders', 'glutes'],
          mechanics: 'anti-rotation',
          force: 'push',
          preparation: [
            'Stand sideways to cable',
            'Hold at chest',
            'Athletic stance'
          ],
          execution: [
            'Press straight out',
            'Resist rotation',
            'Return controlled'
          ],
          tips: [
            'Stay square',
            'Core tight',
            'Breathe steady'
          ],
          commonErrors: [
            'Rotating torso',
            'Leaning away',
            'Arms dropping'
          ],
          benefits: [
            'Core stability',
            'Anti-rotation',
            'Functional strength'
          ],
          variations: [
            'Half kneeling',
            'Split stance',
            'Band press'
          ]
        },
        {
          id: 'woodchop',
          name: 'Woodchop',
          type: 'core',
          equipment: ['cable machine', 'medicine ball'],
          difficulty: 'intermediate',
          primaryMuscles: ['core', 'obliques'],
          secondaryMuscles: ['shoulders', 'hips'],
          mechanics: 'rotation',
          force: 'pull',
          preparation: [
            'Stand diagonal',
            'High cable grip',
            'Feet planted'
          ],
          execution: [
            'Pull diagonally down',
            'Rotate core',
            'Control return'
          ],
          tips: [
            'Hips initiate',
            'Full rotation',
            'Keep arms straight'
          ],
          commonErrors: [
            'Arms only',
            'Poor posture',
            'Fast return'
          ],
          benefits: [
            'Rotational power',
            'Core strength',
            'Functional movement'
          ],
          variations: [
            'Low to high',
            'Medicine ball',
            'Half kneeling'
          ]
        },
        {
          id: 'farmers-carry',
          name: 'Farmers Carry',
          type: 'core',
          equipment: ['dumbbells', 'kettlebells'],
          difficulty: 'beginner',
          primaryMuscles: ['core', 'traps'],
          secondaryMuscles: ['forearms', 'shoulders'],
          mechanics: 'anti-lateral flexion',
          force: 'static',
          preparation: [
            'Grab weights',
            'Stand tall',
            'Shoulders back'
          ],
          execution: [
            'Walk steady',
            'Keep tension',
            'Control breath'
          ],
          tips: [
            'Stay upright',
            'Equal weight',
            'Controlled steps'
          ],
          commonErrors: [
            'Leaning side',
            'Rushing',
            'Shrugging'
          ],
          benefits: [
            'Core stability',
            'Grip strength',
            'Posture'
          ],
          variations: [
            'Single arm',
            'Overhead carry',
            'Suitcase carry'
          ]
        },
        {
          id: 'bird-dog',
          name: 'Bird Dog',
          type: 'core',
          equipment: ['none'],
          difficulty: 'beginner',
          primaryMuscles: ['core', 'lower back'],
          secondaryMuscles: ['shoulders', 'glutes'],
          mechanics: 'anti-rotation',
          force: 'static',
          preparation: [
            'Hands under shoulders',
            'Knees under hips',
            'Neutral spine'
          ],
          execution: [
            'Extend opposite limbs',
            'Hold position',
            'Return controlled'
          ],
          tips: [
            'Keep hips level',
            'Look down',
            'Move slow'
          ],
          commonErrors: [
            'Sagging back',
            'Rotating hips',
            'Fast movement'
          ],
          benefits: [
            'Core stability',
            'Balance',
            'Back strength'
          ],
          variations: [
            'Bird dog crunch',
            'With resistance',
            'Hold variations'
          ]
        },
        {
          id: 'copenhagen-plank',
          name: 'Copenhagen Plank',
          type: 'core',
          equipment: ['bench', 'box'],
          difficulty: 'advanced',
          primaryMuscles: ['obliques', 'adductors'],
          secondaryMuscles: ['core', 'hip flexors'],
          mechanics: 'isometric',
          force: 'static',
          preparation: [
            'Side plank position',
            'Top foot on bench',
            'Bottom leg straight'
          ],
          execution: [
            'Lift bottom leg',
            'Hold position',
            'Keep body straight'
          ],
          tips: [
            'Stack shoulders',
            'Engage core',
            'Breathe steady'
          ],
          commonErrors: [
            'Hip dropping',
            'Poor alignment',
            'Short hold'
          ],
          benefits: [
            'Adductor strength',
            'Core stability',
            'Hip control'
          ],
          variations: [
            'Bent knee',
            'Dynamic raises',
            'Hold time'
          ]
        }
      ]
    },
    olympic: {
      name: 'Olympic Weightlifting',
      exercises: [
        {
          id: 'snatch',
          name: 'Snatch',
          type: 'olympic',
          equipment: ['barbell', 'plates'],
          difficulty: 'advanced',
          primaryMuscles: ['full body'],
          secondaryMuscles: ['shoulders', 'traps'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Hip width stance',
            'Hook grip',
            'Bar over midfoot'
          ],
          execution: [
            'First pull',
            'Second pull',
            'Catch overhead'
          ],
          tips: [
            'Keep bar close',
            'Full extension',
            'Fast elbows'
          ],
          commonErrors: [
            'Bar swinging',
            'Early arm pull',
            'No full extension'
          ],
          benefits: [
            'Power development',
            'Coordination',
            'Full body strength'
          ],
          variations: [
            'Power snatch',
            'Hang snatch',
            'Block snatch'
          ]
        },
        {
          id: 'clean-and-jerk',
          name: 'Clean and Jerk',
          type: 'olympic',
          equipment: ['barbell', 'plates'],
          difficulty: 'advanced',
          primaryMuscles: ['full body'],
          secondaryMuscles: ['shoulders', 'core'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Shoulder width grip',
            'Bar over midfoot',
            'Hook or regular grip'
          ],
          execution: [
            'Clean pull',
            'Front rack catch',
            'Split jerk'
          ],
          tips: [
            'Stay over bar',
            'Aggressive extension',
            'Fast under bar'
          ],
          commonErrors: [
            'Pulling early',
            'Weak rack position',
            'Poor jerk timing'
          ],
          benefits: [
            'Total body power',
            'Strength development',
            'Athletic performance'
          ],
          variations: [
            'Power clean',
            'Hang clean',
            'Push jerk'
          ]
        },
        {
          id: 'power-clean',
          name: 'Power Clean',
          type: 'olympic',
          equipment: ['barbell', 'plates'],
          difficulty: 'intermediate',
          primaryMuscles: ['legs', 'back'],
          secondaryMuscles: ['shoulders', 'core'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Hip width stance',
            'Regular grip',
            'Bar over midfoot'
          ],
          execution: [
            'First pull',
            'Triple extension',
            'High catch'
          ],
          tips: [
            'Vertical bar path',
            'Full extension',
            'Fast elbows'
          ],
          commonErrors: [
            'Early arm bend',
            'Forward jump',
            'Slow elbows'
          ],
          benefits: [
            'Power development',
            'Athletic performance',
            'Explosive strength'
          ],
          variations: [
            'Hang power clean',
            'Block clean',
            'Clean pull'
          ]
        },
        {
          id: 'power-snatch',
          name: 'Power Snatch',
          type: 'olympic',
          equipment: ['barbell', 'plates'],
          difficulty: 'intermediate',
          primaryMuscles: ['full body'],
          secondaryMuscles: ['shoulders', 'traps'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Wide grip',
            'Hook grip',
            'Bar over midfoot'
          ],
          execution: [
            'First pull',
            'Explosive extension',
            'High catch'
          ],
          tips: [
            'Bar close to body',
            'Complete extension',
            'Lock overhead'
          ],
          commonErrors: [
            'Looping bar',
            'Early arm pull',
            'Jumping forward'
          ],
          benefits: [
            'Explosive power',
            'Overhead stability',
            'Coordination'
          ],
          variations: [
            'Hang power snatch',
            'Block snatch',
            'Muscle snatch'
          ]
        },
        {
          id: 'push-press',
          name: 'Push Press',
          type: 'olympic',
          equipment: ['barbell', 'plates'],
          difficulty: 'intermediate',
          primaryMuscles: ['shoulders', 'legs'],
          secondaryMuscles: ['triceps', 'core'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Rack position',
            'Shoulder width stance',
            'Elbows high'
          ],
          execution: [
            'Quick dip',
            'Drive up',
            'Press overhead'
          ],
          tips: [
            'Vertical dip',
            'Time the drive',
            'Full lockout'
          ],
          commonErrors: [
            'Forward lean',
            'Slow dip',
            'Press too early'
          ],
          benefits: [
            'Overhead strength',
            'Power development',
            'Core stability'
          ],
          variations: [
            'Behind neck',
            'Split stance',
            'Dumbbell'
          ]
        },
        {
          id: 'split-jerk',
          name: 'Split Jerk',
          type: 'olympic',
          equipment: ['barbell', 'plates'],
          difficulty: 'advanced',
          primaryMuscles: ['shoulders', 'legs'],
          secondaryMuscles: ['triceps', 'core'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Rack position',
            'Vertical torso',
            'Elbows up'
          ],
          execution: [
            'Dip drive',
            'Split legs',
            'Lock overhead'
          ],
          tips: [
            'Quick split',
            'Straight arms',
            'Head through'
          ],
          commonErrors: [
            'Press out',
            'Short split',
            'Forward torso'
          ],
          benefits: [
            'Overhead strength',
            'Speed',
            'Coordination'
          ],
          variations: [
            'Power jerk',
            'Push jerk',
            'Behind neck'
          ]
        },
        {
          id: 'hang-clean',
          name: 'Hang Clean',
          type: 'olympic',
          equipment: ['barbell', 'plates'],
          difficulty: 'intermediate',
          primaryMuscles: ['legs', 'back'],
          secondaryMuscles: ['shoulders', 'traps'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Bar at thighs',
            'Slight knee bend',
            'Back flat'
          ],
          execution: [
            'Hip extension',
            'Pull under',
            'Front rack catch'
          ],
          tips: [
            'Stay over bar',
            'Extend fully',
            'Fast elbows'
          ],
          commonErrors: [
            'Early arm pull',
            'No extension',
            'Slow elbows'
          ],
          benefits: [
            'Power development',
            'Technique work',
            'Speed strength'
          ],
          variations: [
            'High hang',
            'Low hang',
            'Power variation'
          ]
        },
        {
          id: 'muscle-snatch',
          name: 'Muscle Snatch',
          type: 'olympic',
          equipment: ['barbell', 'plates'],
          difficulty: 'intermediate',
          primaryMuscles: ['shoulders', 'traps'],
          secondaryMuscles: ['back', 'core'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Wide grip',
            'Bar at thighs',
            'Back flat'
          ],
          execution: [
            'Pull to shoulders',
            'Press overhead',
            'Lock out'
          ],
          tips: [
            'Keep bar close',
            'Controlled press',
            'Full lockout'
          ],
          commonErrors: [
            'Bar away',
            'Early press',
            'Poor balance'
          ],
          benefits: [
            'Snatch technique',
            'Shoulder strength',
            'Control'
          ],
          variations: [
            'Hang muscle snatch',
            'Power muscle snatch',
            'Tempo snatch'
          ]
        },
        {
          id: 'clean-pull',
          name: 'Clean Pull',
          type: 'olympic',
          equipment: ['barbell', 'plates'],
          difficulty: 'intermediate',
          primaryMuscles: ['back', 'legs'],
          secondaryMuscles: ['traps', 'core'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Clean grip',
            'Start position',
            'Back set'
          ],
          execution: [
            'First pull',
            'Second pull',
            'Full extension'
          ],
          tips: [
            'Bar close',
            'Finish tall',
            'Control descent'
          ],
          commonErrors: [
            'Early arm bend',
            'No extension',
            'Forward lean'
          ],
          benefits: [
            'Pull strength',
            'Position work',
            'Technique'
          ],
          variations: [
            'Halting clean pull',
            'Clean high pull',
            'Segment pulls'
          ]
        },
        {
          id: 'snatch-balance',
          name: 'Snatch Balance',
          type: 'olympic',
          equipment: ['barbell', 'plates'],
          difficulty: 'advanced',
          primaryMuscles: ['shoulders', 'legs'],
          secondaryMuscles: ['core', 'upper back'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Behind neck',
            'Wide grip',
            'Feet set'
          ],
          execution: [
            'Quick dip',
            'Drive under',
            'Catch overhead'
          ],
          tips: [
            'Fast transition',
            'Lock overhead',
            'Stay balanced'
          ],
          commonErrors: [
            'Slow drop',
            'Press out',
            'Poor stability'
          ],
          benefits: [
            'Receiving position',
            'Overhead stability',
            'Speed under bar'
          ],
          variations: [
            'Drop snatch',
            'Heaving snatch balance',
            'Press balance'
          ]
        }
      ]
    },
    plyometrics: {
      name: 'Plyometric Training',
      exercises: [
        {
          id: 'box-jump',
          name: 'Box Jump',
          type: 'plyometric',
          equipment: ['plyo box'],
          difficulty: 'intermediate',
          primaryMuscles: ['quadriceps', 'calves'],
          secondaryMuscles: ['glutes', 'hamstrings'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Stand before box',
            'Athletic stance',
            'Arms ready'
          ],
          execution: [
            'Explosive jump',
            'Land soft',
            'Step down'
          ],
          tips: [
            'Land quietly',
            'Use arms',
            'Step down always'
          ],
          commonErrors: [
            'Jumping down',
            'Poor landing',
            'Too high box'
          ],
          benefits: [
            'Explosive power',
            'Jump height',
            'Coordination'
          ],
          variations: [
            'Depth jump',
            'Single leg',
            'Continuous'
          ]
        },
        {
          id: 'depth-jump',
          name: 'Depth Jump',
          type: 'plyometric',
          equipment: ['plyo box'],
          difficulty: 'advanced',
          primaryMuscles: ['quadriceps', 'calves'],
          secondaryMuscles: ['glutes', 'core'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Stand on box',
            'Chest up',
            'Ready position'
          ],
          execution: [
            'Step off box',
            'Land soft',
            'Immediate jump'
          ],
          tips: [
            'Minimal ground time',
            'Land mid-foot',
            'Explode up'
          ],
          commonErrors: [
            'Too much depth',
            'Slow reaction',
            'Poor landing'
          ],
          benefits: [
            'Reactive strength',
            'Power output',
            'Jump height'
          ],
          variations: [
            'Box to box',
            'With turn',
            'To target'
          ]
        },
        {
          id: 'jump-squat',
          name: 'Jump Squat',
          type: 'plyometric',
          equipment: ['none', 'dumbbells'],
          difficulty: 'intermediate',
          primaryMuscles: ['quadriceps', 'glutes'],
          secondaryMuscles: ['calves', 'core'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Squat position',
            'Arms back',
            'Chest up'
          ],
          execution: [
            'Explosive jump',
            'Reach height',
            'Soft landing'
          ],
          tips: [
            'Full extension',
            'Use arms',
            'Land quietly'
          ],
          commonErrors: [
            'Shallow squat',
            'Forward lean',
            'Hard landing'
          ],
          benefits: [
            'Power development',
            'Jump height',
            'Athletic performance'
          ],
          variations: [
            'Weighted',
            'Split jump',
            'Continuous'
          ]
        },
        {
          id: 'broad-jump',
          name: 'Broad Jump',
          type: 'plyometric',
          equipment: ['none'],
          difficulty: 'intermediate',
          primaryMuscles: ['quadriceps', 'glutes'],
          secondaryMuscles: ['calves', 'hamstrings'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Athletic stance',
            'Arms back',
            'Hips loaded'
          ],
          execution: [
            'Jump forward',
            'Drive arms',
            'Stick landing'
          ],
          tips: [
            'Use arms',
            'Full extension',
            'Land soft'
          ],
          commonErrors: [
            'Short arm swing',
            'Poor landing',
            'Incomplete extension'
          ],
          benefits: [
            'Horizontal power',
            'Jump distance',
            'Athletic power'
          ],
          variations: [
            'Multiple jumps',
            'To box',
            'With sprint'
          ]
        },
        {
          id: 'plyo-pushup',
          name: 'Plyometric Push-Up',
          type: 'plyometric',
          equipment: ['none'],
          difficulty: 'advanced',
          primaryMuscles: ['chest', 'triceps'],
          secondaryMuscles: ['shoulders', 'core'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Push-up position',
            'Hands shoulder width',
            'Core tight'
          ],
          execution: [
            'Explosive push',
            'Hands leave ground',
            'Soft landing'
          ],
          tips: [
            'Stay rigid',
            'Full range',
            'Control landing'
          ],
          commonErrors: [
            'Sagging hips',
            'Incomplete push',
            'Hard landing'
          ],
          benefits: [
            'Upper body power',
            'Chest strength',
            'Explosive force'
          ],
          variations: [
            'Clap push-up',
            'Box push-up',
            'Single arm'
          ]
        },
        {
          id: 'bounding',
          name: 'Bounding',
          type: 'plyometric',
          equipment: ['none'],
          difficulty: 'intermediate',
          primaryMuscles: ['quadriceps', 'calves'],
          secondaryMuscles: ['hamstrings', 'hip flexors'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Athletic stance',
            'Slight forward lean',
            'Arms ready'
          ],
          execution: [
            'Exaggerated running',
            'Maximum height/distance',
            'Alternate legs'
          ],
          tips: [
            'Drive knees high',
            'Use arms',
            'Stay controlled'
          ],
          commonErrors: [
            'Short steps',
            'Poor rhythm',
            'Weak arm drive'
          ],
          benefits: [
            'Running power',
            'Stride length',
            'Athletic speed'
          ],
          variations: [
            'Single leg focus',
            'Distance focus',
            'Height focus'
          ]
        },
        {
          id: 'skater-jumps',
          name: 'Skater Jumps',
          type: 'plyometric',
          equipment: ['none'],
          difficulty: 'intermediate',
          primaryMuscles: ['glutes', 'quadriceps'],
          secondaryMuscles: ['calves', 'hip abductors'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Athletic stance',
            'Weight on one leg',
            'Slight knee bend'
          ],
          execution: [
            'Jump laterally',
            'Land opposite leg',
            'Immediate return'
          ],
          tips: [
            'Stay low',
            'Control landing',
            'Use arms'
          ],
          commonErrors: [
            'Standing tall',
            'Poor balance',
            'Short jumps'
          ],
          benefits: [
            'Lateral power',
            'Balance',
            'Agility'
          ],
          variations: [
            'Over line',
            'With hold',
            'Distance variation'
          ]
        },
        {
          id: 'medicine-ball-slam',
          name: 'Medicine Ball Slam',
          type: 'plyometric',
          equipment: ['medicine ball'],
          difficulty: 'intermediate',
          primaryMuscles: ['core', 'shoulders'],
          secondaryMuscles: ['triceps', 'lats'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Athletic stance',
            'Ball overhead',
            'Core engaged'
          ],
          execution: [
            'Slam ball down',
            'Hip hinge',
            'Catch and repeat'
          ],
          tips: [
            'Full extension',
            'Use hips',
            'Control bounce'
          ],
          commonErrors: [
            'Rounded back',
            'Weak slam',
            'Poor timing'
          ],
          benefits: [
            'Power development',
            'Core strength',
            'Stress relief'
          ],
          variations: [
            'Rotational slam',
            'Overhead throw',
            'Lateral slam'
          ]
        },
        {
          id: 'split-jump',
          name: 'Split Jump',
          type: 'plyometric',
          equipment: ['none'],
          difficulty: 'intermediate',
          primaryMuscles: ['quadriceps', 'glutes'],
          secondaryMuscles: ['calves', 'hip flexors'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Split stance',
            'Back knee low',
            'Torso upright'
          ],
          execution: [
            'Jump explosively',
            'Switch legs mid-air',
            'Land soft'
          ],
          tips: [
            'Stay balanced',
            'Land quiet',
            'Keep rhythm'
          ],
          commonErrors: [
            'Short jump',
            'Poor posture',
            'Heavy landing'
          ],
          benefits: [
            'Leg power',
            'Balance',
            'Coordination'
          ],
          variations: [
            'Continuous',
            'With pause',
            'Walking split jumps'
          ]
        },
        {
          id: 'tuck-jump',
          name: 'Tuck Jump',
          type: 'plyometric',
          equipment: ['none'],
          difficulty: 'intermediate',
          primaryMuscles: ['quadriceps', 'hip flexors'],
          secondaryMuscles: ['calves', 'core'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Athletic stance',
            'Arms ready',
            'Knees soft'
          ],
          execution: [
            'Jump explosively',
            'Pull knees high',
            'Land soft'
          ],
          tips: [
            'Drive knees up',
            'Use arms',
            'Quick ground contact'
          ],
          commonErrors: [
            'Low knees',
            'Hard landing',
            'Poor rhythm'
          ],
          benefits: [
            'Explosive power',
            'Hip flexor strength',
            'Coordination'
          ],
          variations: [
            'Single leg',
            'Continuous',
            'With twist'
          ]
        }
      ]
    },
    functional: {
      name: 'Functional Training',
      exercises: [
        {
          id: 'turkish-getup',
          name: 'Turkish Get-Up',
          type: 'functional',
          equipment: ['kettlebell', 'dumbbell'],
          difficulty: 'advanced',
          primaryMuscles: ['full body'],
          secondaryMuscles: ['core', 'shoulders'],
          mechanics: 'compound',
          force: 'push',
          preparation: [
            'Lie on back',
            'Weight overhead',
            'Knee bent'
          ],
          execution: [
            'Roll to elbow',
            'Post to hand',
            'Stand up'
          ],
          tips: [
            'Watch weight',
            'Move slow',
            'Stay tight'
          ],
          commonErrors: [
            'Losing alignment',
            'Rushing',
            'Poor stability'
          ],
          benefits: [
            'Full body control',
            'Shoulder stability',
            'Core strength'
          ],
          variations: [
            'No weight',
            'Half getup',
            'Heavy weight'
          ]
        },
        {
          id: 'racked-carry',
          name: 'Racked Carry',
          type: 'functional',
          equipment: ['kettlebell', 'dumbbell'],
          difficulty: 'intermediate',
          primaryMuscles: ['core', 'legs'],
          secondaryMuscles: ['shoulders', 'back'],
          mechanics: 'compound',
          force: 'static',
          preparation: [
            'Clean weight',
            'Rack position',
            'Stand tall'
          ],
          execution: [
            'Walk steady',
            'Maintain posture',
            'Control breathing'
          ],
          tips: [
            'Stay upright',
            'Brace core',
            'Even steps'
          ],
          commonErrors: [
            'Leaning side',
            'Poor rack',
            'Uneven gait'
          ],
          benefits: [
            'Core stability',
            'Carrying strength',
            'Posture'
          ],
          variations: [
            'Double rack',
            'Offset carry',
            'Walking lunge'
          ]
        },
        {
          id: 'sandbag-clean',
          name: 'Sandbag Clean',
          type: 'functional',
          equipment: ['sandbag'],
          difficulty: 'intermediate',
          primaryMuscles: ['legs', 'back'],
          secondaryMuscles: ['arms', 'core'],
          mechanics: 'compound',
          force: 'pull',
          preparation: [
            'Bag on ground',
            'Hip hinge',
            'Neutral spine'
          ],
          execution: [
            'Pull to lap',
            'Rotate elbows',
            'Rack position'
          ],
          tips: [
            'Use legs',
            'Keep close',
            'Quick elbows'
          ],
          commonErrors: [
            'All arms',
            'Rounded back',
            'Poor catch'
          ],
          benefits: [
            'Power development',
            'Grip strength',
            'Real-world strength'
          ],
          variations: [
            'Continental clean',
            'Shouldering',
            'Bear hug clean'
          ]
        },
        {
          id: 'tire-flip',
          name: 'Tire Flip',
          type: 'functional',
          equipment: ['tire'],
          difficulty: 'advanced',
          primaryMuscles: ['legs', 'back'],
          secondaryMuscles: ['core', 'arms'],
          mechanics: 'compound',
          force: 'push and pull',
          preparation: [
            'Squat stance',
            'Hands under tire',
            'Chest against tire'
          ],
          execution: [
            'Drive legs',
            'Explode up',
            'Push through'
          ],
          tips: [
            'Use leg drive',
            'Keep back flat',
            'Quick transition'
          ],
          commonErrors: [
            'All back',
            'Poor leverage',
            'Slow hands'
          ],
          benefits: [
            'Explosive power',
            'Full body strength',
            'Work capacity'
          ],
          variations: [
            'Double flip',
            'Team flip',
            'Lateral flip'
          ]
        },
        {
          id: 'sled-push',
          name: 'Sled Push',
          type: 'functional',
          equipment: ['sled'],
          difficulty: 'intermediate',
          primaryMuscles: ['legs', 'core'],
          secondaryMuscles: ['shoulders', 'triceps'],
          mechanics: 'compound',
          force: 'push',
          preparation: [
            'Grip handles',
            'Lean forward',
            'Arms straight'
          ],
          execution: [
            'Drive legs',
            'Push forward',
            'Quick steps'
          ],
          tips: [
            'Low position',
            'Full steps',
            'Keep pushing'
          ],
          commonErrors: [
            'Standing tall',
            'Short steps',
            'Weak push'
          ],
          benefits: [
            'Power endurance',
            'Leg strength',
            'Conditioning'
          ],
          variations: [
            'High push',
            'Low push',
            'Single arm'
          ]
        },
        {
          id: 'battlerope-waves',
          name: 'Battle Rope Waves',
          type: 'functional',
          equipment: ['battle ropes'],
          difficulty: 'intermediate',
          primaryMuscles: ['shoulders', 'arms'],
          secondaryMuscles: ['core', 'back'],
          mechanics: 'compound',
          force: 'push',
          preparation: [
            'Athletic stance',
            'Grip ropes',
            'Slight bend'
          ],
          execution: [
            'Alternate arms',
            'Create waves',
            'Keep moving'
          ],
          tips: [
            'Stay low',
            'Full range',
            'Keep rhythm'
          ],
          commonErrors: [
            'Standing tall',
            'Small waves',
            'Poor endurance'
          ],
          benefits: [
            'Conditioning',
            'Upper body power',
            'Core stability'
          ],
          variations: [
            'Double waves',
            'Slams',
            'Circles'
          ]
        },
        {
          id: 'farmers-walk',
          name: 'Farmers Walk',
          type: 'functional',
          equipment: ['dumbbells', 'kettlebells'],
          difficulty: 'beginner',
          primaryMuscles: ['forearms', 'traps'],
          secondaryMuscles: ['core', 'legs'],
          mechanics: 'compound',
          force: 'static',
          preparation: [
            'Grab weights',
            'Stand tall',
            'Shoulders back'
          ],
          execution: [
            'Walk steady',
            'Keep tension',
            'Control breath'
          ],
          tips: [
            'Neutral spine',
            'Pack shoulders',
            'Even steps'
          ],
          commonErrors: [
            'Leaning',
            'Dropping shoulders',
            'Short steps'
          ],
          benefits: [
            'Grip strength',
            'Core stability',
            'Work capacity'
          ],
          variations: [
            'Single arm',
            'Heavy load',
            'Uphill walk'
          ]
        },
        {
          id: 'medicine-ball-rotational-throw',
          name: 'Medicine Ball Rotational Throw',
          type: 'functional',
          equipment: ['medicine ball'],
          difficulty: 'intermediate',
          primaryMuscles: ['core', 'shoulders'],
          secondaryMuscles: ['hips', 'legs'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Athletic stance',
            'Hold ball',
            'Load hips'
          ],
          execution: [
            'Rotate back',
            'Explosive throw',
            'Follow through'
          ],
          tips: [
            'Use hips',
            'Stay grounded',
            'Full rotation'
          ],
          commonErrors: [
            'All arms',
            'Poor rotation',
            'Losing balance'
          ],
          benefits: [
            'Rotational power',
            'Core strength',
            'Athletic movement'
          ],
          variations: [
            'Kneeling throw',
            'Diagonal throw',
            'Rebound catch'
          ]
        },
        {
          id: 'box-jump-over',
          name: 'Box Jump Over',
          type: 'functional',
          equipment: ['plyo box'],
          difficulty: 'advanced',
          primaryMuscles: ['legs'],
          secondaryMuscles: ['core', 'calves'],
          mechanics: 'compound',
          force: 'explosive',
          preparation: [
            'Face box',
            'Athletic stance',
            'Arms ready'
          ],
          execution: [
            'Jump on box',
            'Step or jump off',
            'Repeat other side'
          ],
          tips: [
            'Land soft',
            'Stay controlled',
            'Use arms'
          ],
          commonErrors: [
            'Heavy landing',
            'Poor rhythm',
            'Rushing'
          ],
          benefits: [
            'Explosive power',
            'Coordination',
            'Agility'
          ],
          variations: [
            'Step over',
            'Lateral over',
            'Double response'
          ]
        },
        {
          id: 'burpee-pullup',
          name: 'Burpee Pull-Up',
          type: 'functional',
          equipment: ['pull-up bar'],
          difficulty: 'advanced',
          primaryMuscles: ['full body'],
          secondaryMuscles: ['core', 'back'],
          mechanics: 'compound',
          force: 'push and pull',
          preparation: [
            'Under pull-up bar',
            'Standing ready',
            'Grip planned'
          ],
          execution: [
            'Drop to burpee',
            'Push up jump',
            'Pull up'
          ],
          tips: [
            'Flow movement',
            'Full range',
            'Stay controlled'
          ],
          commonErrors: [
            'Broken rhythm',
            'Half reps',
            'Poor form'
          ],
          benefits: [
            'Full body strength',
            'Conditioning',
            'Work capacity'
          ],
          variations: [
            'Chest to bar',
            'No push-up',
            'Double burpee'
          ]
        }
      ]
    },
    mobility: {
      name: 'Mobility and Flexibility',
      exercises: [
        {
          id: 'hip-90-90',
          name: 'Hip 90/90',
          type: 'mobility',
          equipment: ['none'],
          difficulty: 'intermediate',
          primaryMuscles: ['hip flexors', 'hip rotators'],
          secondaryMuscles: ['glutes', 'adductors'],
          mechanics: 'isolation',
          force: 'static',
          preparation: [
            'Sit on floor',
            'Front leg 90°',
            'Back leg 90°'
          ],
          execution: [
            'Sit tall',
            'Switch positions',
            'Control movement'
          ],
          tips: [
            'Keep spine tall',
            'Equal angles',
            'Breathe steady'
          ],
          commonErrors: [
            'Rounded back',
            'Uneven angles',
            'Rushing'
          ],
          benefits: [
            'Hip mobility',
            'Rotation control',
            'Better posture'
          ],
          variations: [
            'Flow switches',
            'Weighted',
            'Isometric holds'
          ]
        },
        {
          id: 'thoracic-bridge',
          name: 'Thoracic Bridge',
          type: 'mobility',
          equipment: ['none'],
          difficulty: 'intermediate',
          primaryMuscles: ['thoracic spine', 'shoulders'],
          secondaryMuscles: ['core', 'neck'],
          mechanics: 'compound',
          force: 'static',
          preparation: [
            'On all fours',
            'Hand behind head',
            'Brace core'
          ],
          execution: [
            'Rotate thoracic',
            'Follow elbow',
            'Control return'
          ],
          tips: [
            'Keep hips level',
            'Move slow',
            'Full rotation'
          ],
          commonErrors: [
            'Lumbar rotation',
            'Hip shift',
            'Neck strain'
          ],
          benefits: [
            'Spine mobility',
            'Shoulder health',
            'Better posture'
          ],
          variations: [
            'Seated rotation',
            'Wall slides',
            'Foam roller'
          ]
        },
        {
          id: 'ankle-mobility',
          name: 'Ankle Mobility Flow',
          type: 'mobility',
          equipment: ['none'],
          difficulty: 'beginner',
          primaryMuscles: ['ankles', 'calves'],
          secondaryMuscles: ['feet', 'shins'],
          mechanics: 'isolation',
          force: 'dynamic',
          preparation: [
            'Half kneeling',
            'Front foot flat',
            'Tall posture'
          ],
          execution: [
            'Drive knee forward',
            'Keep heel down',
            'Rock back'
          ],
          tips: [
            'Control motion',
            'Track knee',
            'Feel stretch'
          ],
          commonErrors: [
            'Heel lifting',
            'Poor alignment',
            'Too fast'
          ],
          benefits: [
            'Ankle mobility',
            'Better squats',
            'Injury prevention'
          ],
          variations: [
            'Band assisted',
            'Wall supported',
            'Weight loaded'
          ]
        },
        {
          id: 'shoulder-cars',
          name: 'Shoulder CARs',
          type: 'mobility',
          equipment: ['none'],
          difficulty: 'intermediate',
          primaryMuscles: ['shoulders', 'rotator cuff'],
          secondaryMuscles: ['scapula', 'upper back'],
          mechanics: 'isolation',
          force: 'dynamic',
          preparation: [
            'Stand tall',
            'Arms relaxed',
            'Brace core'
          ],
          execution: [
            'Full rotation',
            'Control speed',
            'Maximum range'
          ],
          tips: [
            'Stay controlled',
            'Full circles',
            'Keep tension'
          ],
          commonErrors: [
            'Speed rushing',
            'Small circles',
            'Poor control'
          ],
          benefits: [
            'Joint health',
            'Range of motion',
            'Shoulder control'
          ],
          variations: [
            'Prone',
            'Side lying',
            'Weighted'
          ]
        },
        {
          id: 'world-greatest-stretch',
          name: 'World\'s Greatest Stretch',
          type: 'mobility',
          equipment: ['none'],
          difficulty: 'intermediate',
          primaryMuscles: ['full body'],
          secondaryMuscles: ['hips', 'thoracic'],
          mechanics: 'compound',
          force: 'dynamic',
          preparation: [
            'Lunge position',
            'Hands inside',
            'Tall spine'
          ],
          execution: [
            'Elbow to ground',
            'Thoracic rotate',
            'Hip stretch'
          ],
          tips: [
            'Flow movement',
            'Stay controlled',
            'Full range'
          ],
          commonErrors: [
            'Poor form',
            'Rushing',
            'Limited range'
          ],
          benefits: [
            'Full mobility',
            'Movement prep',
            'Flexibility'
          ],
          variations: [
            'With reach',
            'Extended hold',
            'Added rotation'
          ]
        },
        {
          id: 'jefferson-curl',
          name: 'Jefferson Curl',
          type: 'mobility',
          equipment: ['none', 'light weight'],
          difficulty: 'intermediate',
          primaryMuscles: ['spine', 'hamstrings'],
          secondaryMuscles: ['back', 'neck'],
          mechanics: 'compound',
          force: 'dynamic',
          preparation: [
            'Stand elevated',
            'Feet together',
            'Arms hanging'
          ],
          execution: [
            'Roll down spine',
            'Reach toes',
            'Roll up'
          ],
          tips: [
            'Segment spine',
            'Control descent',
            'Stack vertebrae'
          ],
          commonErrors: [
            'Fast movement',
            'Poor control',
            'Knee bend'
          ],
          benefits: [
            'Spinal mobility',
            'Hamstring length',
            'Body awareness'
          ],
          variations: [
            'Weighted',
            'Single leg',
            'Tempo'
          ]
        },
        {
          id: 'cossack-squat',
          name: 'Cossack Squat',
          type: 'mobility',
          equipment: ['none'],
          difficulty: 'advanced',
          primaryMuscles: ['hips', 'adductors'],
          secondaryMuscles: ['ankles', 'knees'],
          mechanics: 'compound',
          force: 'dynamic',
          preparation: [
            'Wide stance',
            'Toes forward',
            'Arms front'
          ],
          execution: [
            'Shift side',
            'Deep squat',
            'Alternate'
          ],
          tips: [
            'Keep heel down',
            'Chest up',
            'Control shift'
          ],
          commonErrors: [
            'Knee cave',
            'Heel lift',
            'Poor balance'
          ],
          benefits: [
            'Hip mobility',
            'Leg strength',
            'Ankle flexibility'
          ],
          variations: [
            'Weighted',
            'Hold position',
            'Flow pattern'
          ]
        },
        {
          id: 'skin-the-cat',
          name: 'Skin the Cat',
          type: 'mobility',
          equipment: ['rings', 'pull-up bar'],
          difficulty: 'advanced',
          primaryMuscles: ['shoulders', 'core'],
          secondaryMuscles: ['back', 'arms'],
          mechanics: 'compound',
          force: 'dynamic',
          preparation: [
            'Hang grip',
            'Arms straight',
            'Core tight'
          ],
          execution: [
            'Tuck knees',
            'Roll back',
            'Control return'
          ],
          tips: [
            'Stay tight',
            'Move slow',
            'Build control'
          ],
          commonErrors: [
            'Fast rolling',
            'Loose body',
            'Poor grip'
          ],
          benefits: [
            'Shoulder mobility',
            'Body control',
            'Core strength'
          ],
          variations: [
            'German hang',
            'Tuck hold',
            'Pike position'
          ]
        },
        {
          id: 'lizard-pose',
          name: 'Lizard Pose',
          type: 'mobility',
          equipment: ['none'],
          difficulty: 'intermediate',
          primaryMuscles: ['hip flexors', 'hamstrings'],
          secondaryMuscles: ['groin', 'quads'],
          mechanics: 'static',
          force: 'static',
          preparation: [
            'Low lunge',
            'Front foot out',
            'Back knee down'
          ],
          execution: [
            'Lower forearms',
            'Sink hips',
            'Hold position'
          ],
          tips: [
            'Breathe deep',
            'Relax hips',
            'Feel stretch'
          ],
          commonErrors: [
            'Poor alignment',
            'Holding breath',
            'Forcing depth'
          ],
          benefits: [
            'Hip opening',
            'Groin flexibility',
            'Better mobility'
          ],
          variations: [
            'Elevated front foot',
            'Twisted variation',
            'With blocks'
          ]
        },
        {
          id: 'wall-slides',
          name: 'Wall Slides',
          type: 'mobility',
          equipment: ['wall'],
          difficulty: 'beginner',
          primaryMuscles: ['shoulders', 'upper back'],
          secondaryMuscles: ['thoracic spine', 'scapula'],
          mechanics: 'isolation',
          force: 'dynamic',
          preparation: [
            'Back to wall',
            'Arms up',
            'Elbows bent'
          ],
          execution: [
            'Slide up',
            'Maintain contact',
            'Control down'
          ],
          tips: [
            'Keep contact',
            'Pinch blades',
            'Breathe steady'
          ],
          commonErrors: [
            'Losing contact',
            'Shrugging',
            'Arching back'
          ],
          benefits: [
            'Shoulder health',
            'Posture',
            'Scapular control'
          ],
          variations: [
            'Y slides',
            'With band',
            'Foam roller'
          ]
        }
      ]
    },
    balance: {
      name: 'Balance and Stability',
      exercises: [
        {
          id: 'single-leg-rdl',
          name: 'Single Leg Romanian Deadlift',
          type: 'balance',
          equipment: ['none', 'dumbbell', 'kettlebell'],
          difficulty: 'intermediate',
          primaryMuscles: ['hamstrings', 'glutes'],
          secondaryMuscles: ['core', 'lower back'],
          mechanics: 'compound',
          force: 'hinge',
          preparation: [
            'Stand on one leg',
            'Soft knee',
            'Core braced'
          ],
          execution: [
            'Hinge at hip',
            'Leg raises',
            'Return up'
          ],
          tips: [
            'Keep hips level',
            'Straight back',
            'Control motion'
          ],
          commonErrors: [
            'Rounding back',
            'Hip twist',
            'Poor balance'
          ],
          benefits: [
            'Balance',
            'Leg strength',
            'Core stability'
          ],
          variations: [
            'Weighted',
            'Eyes closed',
            'Hover hold'
          ]
        },
        {
          id: 'bosu-squat',
          name: 'Bosu Ball Squat',
          type: 'balance',
          equipment: ['bosu ball'],
          difficulty: 'intermediate',
          primaryMuscles: ['quadriceps', 'glutes'],
          secondaryMuscles: ['core', 'calves'],
          mechanics: 'compound',
          force: 'push',
          preparation: [
            'Stand on bosu',
            'Feet shoulder width',
            'Core engaged'
          ],
          execution: [
            'Lower body',
            'Keep balance',
            'Push up'
          ],
          tips: [
            'Stay centered',
            'Control descent',
            'Watch alignment'
          ],
          commonErrors: [
            'Leaning forward',
            'Knees caving',
            'Rush movement'
          ],
          benefits: [
            'Stability',
            'Leg strength',
            'Proprioception'
          ],
          variations: [
            'Dome up',
            'Dome down',
            'Single leg'
          ]
        },
        {
          id: 'bird-dog',
          name: 'Bird Dog',
          type: 'balance',
          equipment: ['none'],
          difficulty: 'beginner',
          primaryMuscles: ['core', 'back'],
          secondaryMuscles: ['shoulders', 'glutes'],
          mechanics: 'isolation',
          force: 'static',
          preparation: [
            'Hands knees',
            'Neutral spine',
            'Core tight'
          ],
          execution: [
            'Extend opposite limbs',
            'Hold position',
            'Return control'
          ],
          tips: [
            'Keep hips level',
            'Look down',
            'Move slow'
          ],
          commonErrors: [
            'Hip rotation',
            'Sagging back',
            'Fast movement'
          ],
          benefits: [
            'Core stability',
            'Balance',
            'Back strength'
          ],
          variations: [
            'With curl',
            'With band',
            'Flow pattern'
          ]
        },
        {
          id: 'pistol-squat',
          name: 'Pistol Squat',
          type: 'balance',
          equipment: ['none'],
          difficulty: 'advanced',
          primaryMuscles: ['quadriceps', 'glutes'],
          secondaryMuscles: ['core', 'calves'],
          mechanics: 'compound',
          force: 'push',
          preparation: [
            'Stand one leg',
            'Other leg front',
            'Arms forward'
          ],
          execution: [
            'Lower body',
            'Keep leg up',
            'Stand return'
          ],
          tips: [
            'Control descent',
            'Keep chest up',
            'Balance center'
          ],
          commonErrors: [
            'Knee cave',
            'Losing balance',
            'Incomplete depth'
          ],
          benefits: [
            'Single leg strength',
            'Balance',
            'Mobility'
          ],
          variations: [
            'Assisted',
            'Box pistol',
            'Weighted'
          ]
        },
        {
          id: 'stability-ball-plank',
          name: 'Stability Ball Plank',
          type: 'balance',
          equipment: ['stability ball'],
          difficulty: 'intermediate',
          primaryMuscles: ['core'],
          secondaryMuscles: ['shoulders', 'back'],
          mechanics: 'static',
          force: 'static',
          preparation: [
            'Forearms on ball',
            'Legs extended',
            'Body straight'
          ],
          execution: [
            'Hold position',
            'Stay stable',
            'Control breathing'
          ],
          tips: [
            'Keep line',
            'Core tight',
            'Don\'t sag'
          ],
          commonErrors: [
            'Hip drop',
            'Rolling ball',
            'Short holds'
          ],
          benefits: [
            'Core stability',
            'Balance',
            'Shoulder strength'
          ],
          variations: [
            'Pike rolls',
            'Circles',
            'Single leg'
          ]
        },
        {
          id: 'indo-board',
          name: 'Indo Board Balance',
          type: 'balance',
          equipment: ['indo board'],
          difficulty: 'intermediate',
          primaryMuscles: ['core', 'legs'],
          secondaryMuscles: ['ankles', 'feet'],
          mechanics: 'static',
          force: 'static',
          preparation: [
            'Center board',
            'Feet parallel',
            'Knees soft'
          ],
          execution: [
            'Find balance',
            'Control movement',
            'Stay centered'
          ],
          tips: [
            'Look forward',
            'Stay relaxed',
            'Small adjustments'
          ],
          commonErrors: [
            'Stiff legs',
            'Looking down',
            'Large movements'
          ],
          benefits: [
            'Balance',
            'Proprioception',
            'Core control'
          ],
          variations: [
            'Eyes closed',
            'Single leg',
            'Dynamic moves'
          ]
        },
        {
          id: 'slackline-walk',
          name: 'Slackline Walking',
          type: 'balance',
          equipment: ['slackline'],
          difficulty: 'advanced',
          primaryMuscles: ['core', 'legs'],
          secondaryMuscles: ['ankles', 'feet'],
          mechanics: 'dynamic',
          force: 'static',
          preparation: [
            'Line tension set',
            'Arms out',
            'Focus point'
          ],
          execution: [
            'Step forward',
            'Balance adjust',
            'Control sway'
          ],
          tips: [
            'Look ahead',
            'Bend knees',
            'Stay fluid'
          ],
          commonErrors: [
            'Looking down',
            'Stiff body',
            'Rush steps'
          ],
          benefits: [
            'Balance',
            'Focus',
            'Core control'
          ],
          variations: [
            'Static hold',
            'Turn around',
            'Sitting'
          ]
        },
        {
          id: 'balance-beam',
          name: 'Balance Beam Walk',
          type: 'balance',
          equipment: ['balance beam'],
          difficulty: 'intermediate',
          primaryMuscles: ['core', 'legs'],
          secondaryMuscles: ['ankles', 'feet'],
          mechanics: 'dynamic',
          force: 'static',
          preparation: [
            'Stand beam start',
            'Arms out',
            'Eyes forward'
          ],
          execution: [
            'Step forward',
            'Heel to toe',
            'Stay centered'
          ],
          tips: [
            'Control pace',
            'Stay tall',
            'Breathe normal'
          ],
          commonErrors: [
            'Rush steps',
            'Looking down',
            'Arms down'
          ],
          benefits: [
            'Balance',
            'Coordination',
            'Focus'
          ],
          variations: [
            'Backward walk',
            'Side step',
            'With tasks'
          ]
        },
        {
          id: 'yoga-tree-pose',
          name: 'Yoga Tree Pose',
          type: 'balance',
          equipment: ['none'],
          difficulty: 'beginner',
          primaryMuscles: ['legs', 'core'],
          secondaryMuscles: ['hips', 'ankles'],
          mechanics: 'static',
          force: 'static',
          preparation: [
            'Stand tall',
            'Shift weight',
            'Find focus'
          ],
          execution: [
            'Foot to leg',
            'Hands together',
            'Hold pose'
          ],
          tips: [
            'Steady breath',
            'Engage core',
            'Root down'
          ],
          commonErrors: [
            'Hip drop',
            'Losing focus',
            'Foot sliding'
          ],
          benefits: [
            'Balance',
            'Focus',
            'Hip strength'
          ],
          variations: [
            'Eyes closed',
            'Arms up',
            'Moving tree'
          ]
        },
        {
          id: 'standing-figure-4',
          name: 'Standing Figure 4',
          type: 'balance',
          equipment: ['none'],
          difficulty: 'intermediate',
          primaryMuscles: ['glutes', 'core'],
          secondaryMuscles: ['hips', 'legs'],
          mechanics: 'static',
          force: 'static',
          preparation: [
            'Stand tall',
            'Shift weight',
            'Core engaged'
          ],
          execution: [
            'Cross ankle',
            'Sit back',
            'Hold position'
          ],
          tips: [
            'Keep chest up',
            'Square hips',
            'Breathe steady'
          ],
          commonErrors: [
            'Leaning forward',
            'Hip twist',
            'Rushing'
          ],
          benefits: [
            'Hip mobility',
            'Balance',
            'Glute activation'
          ],
          variations: [
            'With reach',
            'Eyes closed',
            'Dynamic'
          ]
        }
      ]
    },
    bodyweight: {
      name: 'Bodyweight Training',
      exercises: [
        {
          id: 'pistol-squat',
          name: 'Pistol Squat',
          type: 'bodyweight',
          equipment: ['none'],
          difficulty: 'advanced',
          primaryMuscles: ['quadriceps', 'glutes'],
          secondaryMuscles: ['core', 'calves', 'hamstrings'],
          mechanics: 'compound',
          force: 'push',
          preparation: [
            'Stand on one leg',
            'Other leg extended',
            'Arms forward'
          ],
          execution: [
            'Lower on one leg',
            'Keep chest up',
            'Stand back up'
          ],
          tips: [
            'Control descent',
            'Keep heel down',
            'Stay balanced'
          ],
          commonErrors: [
            'Knee caving in',
            'Losing balance',
            'Incomplete depth'
          ],
          benefits: [
            'Single leg strength',
            'Balance',
            'Mobility'
          ],
          variations: [
            'Assisted pistol',
            'Box pistol',
            'Weighted pistol'
          ]
        },
        {
          id: 'handstand-pushup',
          name: 'Handstand Push-Up',
          type: 'bodyweight',
          equipment: ['wall'],
          difficulty: 'advanced',
          primaryMuscles: ['shoulders', 'triceps'],
          secondaryMuscles: ['core', 'upper chest'],
          mechanics: 'compound',
          force: 'push',
          preparation: [
            'Kick up to handstand',
            'Back to wall',
            'Hands shoulder width'
          ],
          execution: [
            'Lower head to ground',
            'Press back up',
            'Maintain balance'
          ],
          tips: [
            'Keep core tight',
            'Control movement',
            'Look at ground'
          ],
          commonErrors: [
            'Arching back',
            'Uneven pressing',
            'Kicking off wall'
          ],
          benefits: [
            'Shoulder strength',
            'Balance',
            'Upper body power'
          ],
          variations: [
            'Pike push-up',
            'Negative HSPU',
            'Deficit HSPU'
          ]
        },
        {
          id: 'l-sit',
          name: 'L-Sit',
          type: 'bodyweight',
          equipment: ['parallel bars', 'floor'],
          difficulty: 'advanced',
          primaryMuscles: ['core', 'hip flexors'],
          secondaryMuscles: ['shoulders', 'triceps'],
          mechanics: 'isometric',
          force: 'static',
          preparation: [
            'Support position',
            'Arms straight',
            'Core tight'
          ],
          execution: [
            'Lift legs parallel',
            'Hold position',
            'Maintain form'
          ],
          tips: [
            'Press shoulders down',
            'Point toes',
            'Breathe steadily'
          ],
          commonErrors: [
            'Bent knees',
            'Rounded back',
            'Short hold time'
          ],
          benefits: [
            'Core strength',
            'Straight arm strength',
            'Body control'
          ],
          variations: [
            'Tucked L-sit',
            'One leg L-sit',
            'V-sit'
          ]
        },
        {
          id: 'muscle-up',
          name: 'Muscle-Up',
          type: 'bodyweight',
          equipment: ['pull-up bar', 'rings'],
          difficulty: 'advanced',
          primaryMuscles: ['back', 'chest', 'triceps'],
          secondaryMuscles: ['shoulders', 'core'],
          mechanics: 'compound',
          force: 'pull and push',
          preparation: [
            'False grip',
            'Hang position',
            'Shoulders engaged'
          ],
          execution: [
            'Explosive pull',
            'Transition over bar',
            'Press to support'
          ],
          tips: [
            'Use momentum wisely',
            'Quick transition',
            'Full lockout'
          ],
          commonErrors: [
            'Weak pull',
            'Poor grip',
            'Chicken wing'
          ],
          benefits: [
            'Upper body power',
            'Coordination',
            'Strength'
          ],
          variations: [
            'Negative muscle-up',
            'Ring muscle-up',
            'Strict muscle-up'
          ]
        },
        {
          id: 'dragon-flag',
          name: 'Dragon Flag',
          type: 'bodyweight',
          equipment: ['bench'],
          difficulty: 'advanced',
          primaryMuscles: ['core', 'lower back'],
          secondaryMuscles: ['shoulders', 'hip flexors'],
          mechanics: 'compound',
          force: 'static',
          preparation: [
            'Lie on bench',
            'Grip behind head',
            'Brace core'
          ],
          execution: [
            'Lift body straight',
            'Lower with control',
            'Maintain rigid body'
          ],
          tips: [
            'Keep body straight',
            'Control descent',
            'Breathe steadily'
          ],
          commonErrors: [
            'Bending at hips',
            'Fast descent',
            'Poor grip'
          ],
          benefits: [
            'Core strength',
            'Body control',
            'Spinal stability'
          ],
          variations: [
            'Tuck dragon flag',
            'Single leg',
            'Negative only'
          ]
        },
        {
          id: 'front-lever',
          name: 'Front Lever',
          type: 'bodyweight',
          equipment: ['pull-up bar'],
          difficulty: 'advanced',
          primaryMuscles: ['lats', 'core'],
          secondaryMuscles: ['chest', 'shoulders'],
          mechanics: 'isometric',
          force: 'static',
          preparation: [
            'Hang from bar',
            'Retract shoulders',
            'Engage lats'
          ],
          execution: [
            'Pull to horizontal',
            'Hold position',
            'Body parallel to ground'
          ],
          tips: [
            'Keep arms straight',
            'Point toes',
            'Maintain line'
          ],
          commonErrors: [
            'Pike at hips',
            'Bent arms',
            'Sagging body'
          ],
          benefits: [
            'Back strength',
            'Core stability',
            'Body control'
          ],
          variations: [
            'Tuck front lever',
            'Single leg',
            'Straddle'
          ]
        },
        {
          id: 'planche',
          name: 'Planche',
          type: 'bodyweight',
          equipment: ['floor', 'parallettes'],
          difficulty: 'advanced',
          primaryMuscles: ['shoulders', 'chest'],
          secondaryMuscles: ['core', 'triceps'],
          mechanics: 'isometric',
          force: 'push',
          preparation: [
            'Lean forward',
            'Lock arms',
            'Engage shoulders'
          ],
          execution: [
            'Lift legs off ground',
            'Hold position',
            'Body parallel'
          ],
          tips: [
            'Protract shoulders',
            'Keep arms straight',
            'Squeeze everything'
          ],
          commonErrors: [
            'Insufficient lean',
            'Bent arms',
            'Arched back'
          ],
          benefits: [
            'Shoulder strength',
            'Balance',
            'Upper body power'
          ],
          variations: [
            'Tuck planche',
            'Advanced tuck',
            'Straddle'
          ]
        },
        {
          id: 'human-flag',
          name: 'Human Flag',
          type: 'bodyweight',
          equipment: ['vertical pole'],
          difficulty: 'advanced',
          primaryMuscles: ['lats', 'obliques'],
          secondaryMuscles: ['shoulders', 'arms'],
          mechanics: 'isometric',
          force: 'static',
          preparation: [
            'Grip pole firmly',
            'Upper arm locked',
            'Lower arm pulls'
          ],
          execution: [
            'Press body up',
            'Align vertically',
            'Hold position'
          ],
          tips: [
            'Stack shoulders',
            'Keep body straight',
            'Equal pressure arms'
          ],
          commonErrors: [
            'Weak grip',
            'Hip sag',
            'Poor alignment'
          ],
          benefits: [
            'Lateral core strength',
            'Grip strength',
            'Shoulder stability'
          ],
          variations: [
            'Tuck flag',
            'Single leg',
            'Negative only'
          ]
        },
        {
          id: 'shrimp-squat',
          name: 'Shrimp Squat',
          type: 'bodyweight',
          equipment: ['none'],
          difficulty: 'advanced',
          primaryMuscles: ['quadriceps', 'glutes'],
          secondaryMuscles: ['hamstrings', 'core'],
          mechanics: 'compound',
          force: 'push',
          preparation: [
            'Stand on one leg',
            'Other foot behind',
            'Arms forward'
          ],
          execution: [
            'Squat down',
            'Back knee to ground',
            'Stand back up'
          ],
          tips: [
            'Stay balanced',
            'Control descent',
            'Keep chest up'
          ],
          commonErrors: [
            'Losing balance',
            'Knee caving',
            'Incomplete ROM'
          ],
          benefits: [
            'Single leg strength',
            'Balance',
            'Mobility'
          ],
          variations: [
            'Assisted shrimp',
            'Advanced shrimp',
            'Weighted shrimp'
          ]
        },
        {
          id: 'back-lever',
          name: 'Back Lever',
          type: 'bodyweight',
          equipment: ['pull-up bar', 'rings'],
          difficulty: 'advanced',
          primaryMuscles: ['back', 'shoulders'],
          secondaryMuscles: ['core', 'chest'],
          mechanics: 'isometric',
          force: 'static',
          preparation: [
            'Hang from bar',
            'Grip pronated',
            'Engage shoulders'
          ],
          execution: [
            'Rotate backward',
            'Straighten body',
            'Hold horizontal'
          ],
          tips: [
            'Keep arms straight',
            'Body tension',
            'Breathe steadily'
          ],
          commonErrors: [
            'Bent arms',
            'Arched back',
            'Poor grip'
          ],
          benefits: [
            'Back strength',
            'Shoulder stability',
            'Body control'
          ],
          variations: [
            'Tuck back lever',
            'Single leg',
            'Straddle'
          ]
        }
      ]
    },
    recovery: {
      name: 'Recovery and Regeneration',
      exercises: [
        {
          id: 'foam-rolling-it-band',
          name: 'IT Band Foam Rolling',
          type: 'recovery',
          equipment: ['foam roller'],
          difficulty: 'beginner',
          primaryMuscles: ['it band'],
          secondaryMuscles: ['hip flexors', 'quads'],
          mechanics: 'self-myofascial release',
          force: 'compression',
          preparation: [
            'Side lying',
            'Roller under thigh',
            'Support body'
          ],
          execution: [
            'Roll slowly',
            'Find tender spots',
            'Apply pressure'
          ],
          tips: [
            'Control pressure',
            'Breathe steady',
            'Take time'
          ],
          commonErrors: [
            'Rolling too fast',
            'Too much pressure',
            'Poor support'
          ],
          benefits: [
            'Reduce tension',
            'Improve mobility',
            'Pain relief'
          ],
          variations: [
            'Static holds',
            'Cross friction',
            'Active movement'
          ]
        },
        {
          id: 'cat-cow',
          name: 'Cat-Cow Stretch',
          type: 'recovery',
          equipment: ['none'],
          difficulty: 'beginner',
          primaryMuscles: ['spine'],
          secondaryMuscles: ['core', 'neck'],
          mechanics: 'mobility',
          force: 'static',
          preparation: [
            'Hands knees',
            'Neutral spine',
            'Shoulders stable'
          ],
          execution: [
            'Arch back',
            'Round back',
            'Flow movement'
          ],
          tips: [
            'Move slow',
            'Full range',
            'Match breath'
          ],
          commonErrors: [
            'Rushed movement',
            'Limited range',
            'Poor breathing'
          ],
          benefits: [
            'Spine mobility',
            'Stress relief',
            'Better posture'
          ],
          variations: [
            'Standing',
            'Seated',
            'With rotation'
          ]
        },
        {
          id: 'static-stretching',
          name: 'Full Body Static Stretching',
          type: 'recovery',
          equipment: ['none'],
          difficulty: 'beginner',
          primaryMuscles: ['full body'],
          secondaryMuscles: ['none'],
          mechanics: 'static',
          force: 'static',
          preparation: [
            'Warm muscles',
            'Comfortable position',
            'Proper alignment'
          ],
          execution: [
            'Gentle stretch',
            'Hold position',
            'Release slow'
          ],
          tips: [
            'Don\'t bounce',
            'Breathe deep',
            'Feel stretch'
          ],
          commonErrors: [
            'Overstretching',
            'Holding breath',
            'Poor form'
          ],
          benefits: [
            'Flexibility',
            'Relaxation',
            'Recovery'
          ],
          variations: [
            'Partner assisted',
            'With bands',
            'Dynamic flow'
          ]
        },
        {
          id: 'lacrosse-ball-release',
          name: 'Lacrosse Ball Release',
          type: 'recovery',
          equipment: ['lacrosse ball'],
          difficulty: 'intermediate',
          primaryMuscles: ['trigger points'],
          secondaryMuscles: ['fascia'],
          mechanics: 'pressure point',
          force: 'compression',
          preparation: [
            'Identify area',
            'Position ball',
            'Control pressure'
          ],
          execution: [
            'Apply pressure',
            'Small movements',
            'Hold points'
          ],
          tips: [
            'Start gentle',
            'Breathe through',
            'Move slow'
          ],
          commonErrors: [
            'Too much pressure',
            'Wrong spot',
            'Rush process'
          ],
          benefits: [
            'Release tension',
            'Break adhesions',
            'Improve mobility'
          ],
          variations: [
            'Static pressure',
            'Active movement',
            'Multiple balls'
          ]
        },
        {
          id: 'meditation-practice',
          name: 'Recovery Meditation',
          type: 'recovery',
          equipment: ['none'],
          difficulty: 'beginner',
          primaryMuscles: ['mind'],
          secondaryMuscles: ['nervous system'],
          mechanics: 'mental',
          force: 'none',
          preparation: [
            'Quiet space',
            'Comfortable position',
            'Eyes closed'
          ],
          execution: [
            'Focus breath',
            'Clear mind',
            'Stay present'
          ],
          tips: [
            'Regular practice',
            'Patient approach',
            'Accept thoughts'
          ],
          commonErrors: [
            'Force clearing',
            'Tension held',
            'Rush practice'
          ],
          benefits: [
            'Stress reduction',
            'Mental recovery',
            'Better sleep'
          ],
          variations: [
            'Guided',
            'Movement based',
            'Breathing focus'
          ]
        },
        {
          id: 'epsom-salt-bath',
          name: 'Epsom Salt Recovery Bath',
          type: 'recovery',
          equipment: ['bathtub', 'epsom salt'],
          difficulty: 'beginner',
          primaryMuscles: ['full body'],
          secondaryMuscles: ['none'],
          mechanics: 'passive',
          force: 'none',
          preparation: [
            'Warm water',
            'Add salts',
            'Test temperature'
          ],
          execution: [
            'Soak body',
            'Relax muscles',
            'Stay hydrated'
          ],
          tips: [
            'Right temperature',
            'Proper time',
            'Stay comfortable'
          ],
          commonErrors: [
            'Water too hot',
            'Too long soak',
            'Dehydration'
          ],
          benefits: [
            'Muscle recovery',
            'Relaxation',
            'Mineral absorption'
          ],
          variations: [
            'With aromatherapy',
            'Contrast bath',
            'Partial soak'
          ]
        },
        {
          id: 'compression-therapy',
          name: 'Compression Recovery',
          type: 'recovery',
          equipment: ['compression gear'],
          difficulty: 'beginner',
          primaryMuscles: ['full body'],
          secondaryMuscles: ['circulatory system'],
          mechanics: 'compression',
          force: 'static',
          preparation: [
            'Clean gear',
            'Proper fit',
            'Rest position'
          ],
          execution: [
            'Apply gear',
            'Maintain position',
            'Monitor time'
          ],
          tips: [
            'Right pressure',
            'Move occasionally',
            'Stay comfortable'
          ],
          commonErrors: [
            'Too tight',
            'Too long',
            'Poor circulation'
          ],
          benefits: [
            'Blood flow',
            'Recovery speed',
            'Reduce swelling'
          ],
          variations: [
            'Sequential',
            'Targeted',
            'Active recovery'
          ]
        },
        {
          id: 'sleep-hygiene',
          name: 'Sleep Recovery Protocol',
          type: 'recovery',
          equipment: ['none'],
          difficulty: 'beginner',
          primaryMuscles: ['full body'],
          secondaryMuscles: ['nervous system'],
          mechanics: 'passive',
          force: 'none',
          preparation: [
            'Dark room',
            'Cool temperature',
            'Quiet space'
          ],
          execution: [
            'Regular schedule',
            'Wind down',
            'Quality sleep'
          ],
          tips: [
            'Consistent time',
            'No screens',
            'Proper environment'
          ],
          commonErrors: [
            'Irregular schedule',
            'Poor environment',
            'Screen exposure'
          ],
          benefits: [
            'Muscle recovery',
            'Hormone balance',
            'Mental clarity'
          ],
          variations: [
            'Nap protocol',
            'Travel adjustment',
            'Shift work'
          ]
        },
        {
          id: 'active-recovery',
          name: 'Active Recovery Session',
          type: 'recovery',
          equipment: ['none'],
          difficulty: 'beginner',
          primaryMuscles: ['full body'],
          secondaryMuscles: ['none'],
          mechanics: 'dynamic',
          force: 'light',
          preparation: [
            'Light warmup',
            'Low intensity',
            'Proper hydration'
          ],
          execution: [
            'Easy movement',
            'Maintain flow',
            'Stay relaxed'
          ],
          tips: [
            'Keep intensity low',
            'Listen to body',
            'Stay moving'
          ],
          commonErrors: [
            'Too intense',
            'Poor form',
            'Overexertion'
          ],
          benefits: [
            'Blood flow',
            'Recovery aid',
            'Maintain mobility'
          ],
          variations: [
            'Swimming',
            'Light cycling',
            'Walking'
          ]
        },
        {
          id: 'mindful-breathing',
          name: 'Recovery Breathing',
          type: 'recovery',
          equipment: ['none'],
          difficulty: 'beginner',
          primaryMuscles: ['diaphragm'],
          secondaryMuscles: ['intercostals'],
          mechanics: 'respiratory',
          force: 'none',
          preparation: [
            'Comfortable position',
            'Quiet space',
            'Mental focus'
          ],
          execution: [
            'Deep inhale',
            'Full exhale',
            'Control rhythm'
          ],
          tips: [
            'Belly breathing',
            'Natural pace',
            'Stay focused'
          ],
          commonErrors: [
            'Chest breathing',
            'Forced rhythm',
            'Poor focus'
          ],
          benefits: [
            'Stress reduction',
            'Better recovery',
            'Mental clarity'
          ],
          variations: [
            'Box breathing',
            'Alternate nostril',
            'Progressive'
          ]
        }
      ]
    }
  }
}
