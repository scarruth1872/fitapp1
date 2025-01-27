import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, writeBatch } from 'firebase/firestore';
import { loadEnvironment } from './loadEnv.js';

// Load environment variables
const env = loadEnvironment();

// Firebase configuration
const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample exercise data with free-to-use media
const exercises = [
  {
    name: "Barbell Squat",
    category: "legs",
    description: "A compound exercise that primarily targets the quadriceps, hamstrings, and glutes while engaging core muscles for stability.",
    difficulty: "intermediate",
    imageUrl: "https://static.strengthlevel.com/images/illustrations/squat-1000x1000.jpg",
    videoUrl: "https://www.youtube.com/embed/ultWZbUMPL8",
    instructions: [
      "Stand with feet shoulder-width apart, barbell resting on upper back",
      "Keep chest up and core tight",
      "Bend knees and hips to lower into squat position",
      "Lower until thighs are parallel to ground",
      "Drive through heels to return to starting position"
    ],
    targetMuscles: ["quadriceps", "hamstrings", "glutes", "core"],
    recommendation: "3-5 sets of 5-8 reps"
  },
  {
    name: "Bench Press",
    category: "chest",
    description: "The classic chest exercise that also develops shoulder and triceps strength.",
    difficulty: "intermediate",
    imageUrl: "https://static.strengthlevel.com/images/illustrations/bench-press-1000x1000.jpg",
    videoUrl: "https://www.youtube.com/embed/rT7DgCr-3pg",
    instructions: [
      "Lie on bench with feet flat on ground",
      "Grip barbell slightly wider than shoulder width",
      "Lower bar to mid-chest while keeping elbows at 45° angle",
      "Press bar up to starting position",
      "Maintain control throughout movement"
    ],
    targetMuscles: ["chest", "shoulders", "triceps"],
    recommendation: "3-5 sets of 8-12 reps"
  },
  {
    name: "Deadlift",
    category: "back",
    description: "A fundamental compound movement that builds overall strength and muscle mass.",
    difficulty: "advanced",
    imageUrl: "https://static.strengthlevel.com/images/illustrations/deadlift-1000x1000.jpg",
    videoUrl: "https://www.youtube.com/embed/op9kVnSso6Q",
    instructions: [
      "Stand with feet hip-width apart, barbell over mid-foot",
      "Hinge at hips to grip bar just outside legs",
      "Keep chest up and back straight",
      "Drive through heels while keeping bar close to legs",
      "Lock out hips and knees at top"
    ],
    targetMuscles: ["back", "glutes", "hamstrings", "core"],
    recommendation: "3-5 sets of 3-5 reps"
  },
  {
    name: "Pull-up",
    category: "back",
    description: "An upper body compound exercise that builds back width and strength.",
    difficulty: "intermediate",
    imageUrl: "https://static.strengthlevel.com/images/illustrations/pull-ups-1000x1000.jpg",
    videoUrl: "https://www.youtube.com/embed/eGo4IYlbE5g",
    instructions: [
      "Hang from pull-up bar with hands slightly wider than shoulders",
      "Engage core and maintain straight body position",
      "Pull body up until chin clears bar",
      "Lower body with control to starting position",
      "Maintain shoulder blade engagement throughout"
    ],
    targetMuscles: ["back", "biceps", "shoulders", "core"],
    recommendation: "3-4 sets of 6-12 reps"
  },
  {
    name: "Overhead Press",
    category: "shoulders",
    description: "A fundamental pressing movement for building shoulder strength and stability.",
    difficulty: "intermediate",
    imageUrl: "https://static.strengthlevel.com/images/illustrations/overhead-press-1000x1000.jpg",
    videoUrl: "https://www.youtube.com/embed/2yjwXTZQDDI",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Hold barbell at shoulder height with hands just outside shoulders",
      "Brace core and press bar overhead",
      "Lock out arms at top",
      "Lower bar with control to starting position"
    ],
    targetMuscles: ["shoulders", "triceps", "upper chest", "core"],
    recommendation: "3-4 sets of 8-12 reps"
  },
  {
    name: "Romanian Deadlift",
    category: "legs",
    description: "An excellent exercise for developing hamstring strength and flexibility.",
    difficulty: "intermediate",
    imageUrl: "https://static.strengthlevel.com/images/illustrations/romanian-deadlift-1000x1000.jpg",
    videoUrl: "https://www.youtube.com/embed/JCXUYuzwNrM",
    instructions: [
      "Stand with feet hip-width apart, holding barbell at thighs",
      "Keep slight bend in knees throughout movement",
      "Hinge at hips while keeping back straight",
      "Lower bar along legs until you feel hamstring stretch",
      "Drive hips forward to return to starting position"
    ],
    targetMuscles: ["hamstrings", "glutes", "lower back"],
    recommendation: "3-4 sets of 8-12 reps"
  },
  {
    name: "Dumbbell Row",
    category: "back",
    description: "A unilateral exercise that develops back thickness and corrects imbalances.",
    difficulty: "beginner",
    imageUrl: "https://static.strengthlevel.com/images/illustrations/dumbbell-row-1000x1000.jpg",
    videoUrl: "https://www.youtube.com/embed/roCP6wCXPqo",
    instructions: [
      "Place one knee and hand on bench",
      "Hold dumbbell with free hand, arm fully extended",
      "Keep back parallel to ground",
      "Pull dumbbell to hip while keeping elbow close to body",
      "Lower weight with control"
    ],
    targetMuscles: ["back", "biceps", "shoulders"],
    recommendation: "3-4 sets of 10-15 reps per side"
  },
  {
    name: "Plank",
    category: "core",
    description: "An isometric exercise that builds core stability and endurance.",
    difficulty: "beginner",
    imageUrl: "https://static.strengthlevel.com/images/illustrations/plank-1000x1000.jpg",
    videoUrl: "https://www.youtube.com/embed/ASdvN_XEl_c",
    instructions: [
      "Start in push-up position with forearms on ground",
      "Keep body in straight line from head to heels",
      "Engage core and glutes",
      "Keep neck neutral",
      "Hold position while breathing steadily"
    ],
    targetMuscles: ["core", "shoulders", "back"],
    recommendation: "3-5 sets of 30-60 seconds"
  },
  {
    name: "Push-up",
    category: "chest",
    description: "A fundamental bodyweight exercise that builds upper body strength and stability.",
    difficulty: "beginner",
    imageUrl: "https://static.strengthlevel.com/images/illustrations/push-ups-1000x1000.jpg",
    videoUrl: "https://www.youtube.com/embed/IODxDxX7oi4",
    instructions: [
      "Start in plank position with hands slightly wider than shoulders",
      "Keep body in straight line from head to heels",
      "Lower chest to ground by bending elbows",
      "Push back up to starting position",
      "Maintain core engagement throughout"
    ],
    targetMuscles: ["chest", "shoulders", "triceps", "core"],
    recommendation: "3-4 sets of 10-20 reps"
  },
  {
    name: "Dumbbell Lunges",
    category: "legs",
    description: "A unilateral exercise that develops leg strength, balance, and coordination.",
    difficulty: "beginner",
    imageUrl: "https://static.strengthlevel.com/images/illustrations/dumbbell-lunge-1000x1000.jpg",
    videoUrl: "https://www.youtube.com/embed/D7KaRcUTQeE",
    instructions: [
      "Stand with dumbbells at sides",
      "Step forward with one leg",
      "Lower back knee toward ground",
      "Push through front heel to return to start",
      "Alternate legs with each rep"
    ],
    targetMuscles: ["quadriceps", "hamstrings", "glutes", "calves"],
    recommendation: "3-4 sets of 12-15 reps per leg"
  },
  {
    name: "Lat Pulldown",
    category: "back",
    description: "A machine exercise that targets the latissimus dorsi and builds back width.",
    difficulty: "beginner",
    imageUrl: "https://static.strengthlevel.com/images/illustrations/lat-pulldown-1000x1000.jpg",
    videoUrl: "https://www.youtube.com/embed/CAwf7n6Luuc",
    instructions: [
      "Sit with thighs secured under pad",
      "Grip bar wider than shoulder width",
      "Pull bar down to upper chest",
      "Control the return to starting position",
      "Keep chest up throughout movement"
    ],
    targetMuscles: ["back", "biceps", "shoulders"],
    recommendation: "3-4 sets of 10-15 reps"
  },
  {
    name: "Dumbbell Shoulder Press",
    category: "shoulders",
    description: "A compound movement for building shoulder strength and muscle.",
    difficulty: "beginner",
    imageUrl: "https://static.strengthlevel.com/images/illustrations/dumbbell-shoulder-press-1000x1000.jpg",
    videoUrl: "https://www.youtube.com/embed/qEwKCR5JCog",
    instructions: [
      "Sit with back supported",
      "Hold dumbbells at shoulder height",
      "Press weights overhead",
      "Lower with control to start position",
      "Keep core engaged throughout"
    ],
    targetMuscles: ["shoulders", "triceps", "upper chest"],
    recommendation: "3-4 sets of 10-15 reps"
  },
  {
    name: "Bicycle Crunches",
    category: "core",
    description: "A dynamic core exercise that targets multiple abdominal muscles.",
    difficulty: "beginner",
    imageUrl: "https://static.strengthlevel.com/images/illustrations/bicycle-crunch-1000x1000.jpg",
    videoUrl: "https://www.youtube.com/embed/9FGilxCbdz8",
    instructions: [
      "Lie on back with hands behind head",
      "Lift shoulders off ground",
      "Bring opposite elbow to opposite knee",
      "Alternate sides with pedaling motion",
      "Keep lower back pressed to ground"
    ],
    targetMuscles: ["abs", "obliques", "hip flexors"],
    recommendation: "3 sets of 20-30 reps per side"
  },
  {
    name: "Dips",
    category: "chest",
    description: "An advanced bodyweight exercise for upper body strength.",
    difficulty: "intermediate",
    imageUrl: "https://static.strengthlevel.com/images/illustrations/dips-1000x1000.jpg",
    videoUrl: "https://www.youtube.com/embed/2z8JmcrW-As",
    instructions: [
      "Grip parallel bars with straight arms",
      "Lower body by bending elbows",
      "Keep slight forward lean for chest focus",
      "Push back up to starting position",
      "Maintain controlled movement"
    ],
    targetMuscles: ["chest", "triceps", "shoulders"],
    recommendation: "3-4 sets of 8-12 reps"
  },
  {
    name: "Face Pulls",
    category: "shoulders",
    description: "An isolation exercise for rear deltoids and upper back.",
    difficulty: "beginner",
    imageUrl: "https://static.strengthlevel.com/images/illustrations/face-pull-1000x1000.jpg",
    videoUrl: "https://www.youtube.com/embed/rep-qVOkqgk",
    instructions: [
      "Set cable at head height",
      "Grip rope with palms facing",
      "Pull rope towards face, separating hands",
      "Squeeze shoulder blades together",
      "Return to start with control"
    ],
    targetMuscles: ["rear deltoids", "upper back", "rotator cuff"],
    recommendation: "3-4 sets of 12-15 reps"
  },
  {
    name: "Glute Bridges",
    category: "legs",
    description: "A fundamental exercise for glute activation and strength.",
    difficulty: "beginner",
    imageUrl: "https://static.strengthlevel.com/images/illustrations/glute-bridge-1000x1000.jpg",
    videoUrl: "https://www.youtube.com/embed/OUgsJ8-Vi0E",
    instructions: [
      "Lie on back with knees bent",
      "Plant feet flat on ground",
      "Drive hips up by squeezing glutes",
      "Hold at top for 2 seconds",
      "Lower with control"
    ],
    targetMuscles: ["glutes", "hamstrings", "lower back"],
    recommendation: "3-4 sets of 15-20 reps"
  }
];

// Function to populate exercises
async function populateExercises() {
  try {
    // Check if exercises already exist
    const exercisesRef = collection(db, 'exercises');
    const existingExercises = await getDocs(query(exercisesRef));
    
    if (!existingExercises.empty) {
      console.log('Exercises already exist in the database. Skipping population.');
      return;
    }

    // Add exercises in batches
    const batch = writeBatch(db);
    const exercisePromises = exercises.map(exercise => {
      const docRef = collection(db, 'exercises');
      return addDoc(docRef, {
        ...exercise,
        createdAt: new Date().toISOString()
      });
    });

    await Promise.all(exercisePromises);
    await batch.commit();

    console.log('Successfully populated exercise database!');
  } catch (error) {
    console.error('Error populating exercises:', error);
  }
}

// Export the populate function
export { populateExercises };

// Execute the population
populateExercises();
