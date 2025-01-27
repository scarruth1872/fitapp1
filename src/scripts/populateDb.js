import { populateExercises } from './populateExercises.js';

// Execute all database population scripts
async function populateDatabase() {
  console.log('Starting database population...');
  
  try {
    await populateExercises();
    console.log('Database population completed successfully!');
  } catch (error) {
    console.error('Error during database population:', error);
    process.exit(1);
  }
}

populateDatabase();
