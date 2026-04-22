// run-cleanup.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';
import Answer from './models/Answer.js';

dotenv.config();

const cleanDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");

    // Find questions with gibberish titles or bodies
    const result = await Question.deleteMany({
      $or: [
        { title: /aasasadad/i },
        { title: /fefegege/i },
        { title: /test/i },
        { body: /dadadada/i },
        { body: /aaaaaaaaa/i }
      ]
    });

    console.log(`Deleted ${result.deletedCount} test questions.`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to clean up:", error);
    process.exit(1);
  }
};

cleanDB();
