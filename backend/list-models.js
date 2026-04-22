// list-models.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Quick test with gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Respond with the word 'OK'");
    console.log("gemini-1.5-flash is WORKING:", result.response.text());
  } catch (error) {
    console.error("gemini-1.5-flash failed:", error.message);
    
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("Respond with the word 'OK'");
      console.log("gemini-pro is WORKING:", result.response.text());
    } catch (err2) {
      console.error("gemini-pro failed:", err2.message);
    }
  }
};

run();
