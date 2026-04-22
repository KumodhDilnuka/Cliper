// fetch-models.js
import dotenv from "dotenv";

dotenv.config();

const run = async () => {
  try {
    const url = "https://generativelanguage.googleapis.com/v1beta/models?key=" + process.env.GEMINI_API_KEY;
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Failed to fetch models:", await response.text());
      return;
    }
    const data = await response.json();
    console.log("Allowed Models:");
    data.models.forEach(m => console.log(m.name));
  } catch (err) {
    console.log("Error:", err.message);
  }
}
run();
