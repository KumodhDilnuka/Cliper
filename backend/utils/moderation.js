import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Using gemini-flash-latest as that is explicitly supported by the account's quota
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

/**
 * Fetches an image from a URL and converts it to a base64 string for Gemini.
 * @param {string} url 
 * @returns {Promise<{data: string, mimeType: string}>}
 */
const fetchImageAsBase64 = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/jpeg";
    
    return {
      inlineData: {
        data: Buffer.from(buffer).toString("base64"),
        mimeType: contentType,
      },
    };
  } catch (error) {
    console.error("Error fetching image for moderation:", error);
    return null;
  }
};

/**
 * Checks if the content (text and optional image) is educational and suitable for a university system.
 * @param {string} title 
 * @param {string} body 
 * @param {string} [imageUrl]
 * @returns {Promise<{isEducational: boolean, reason: string}>}
 */
export const checkIsEducational = async (title, body, imageUrl) => {
  try {
    const prompt = `
      You are an extremely strict AI moderation system for a university forum called "Cliper".
      Your ONLY purpose is to evaluate if submitted content is strictly academic or relevant to university life.
      
      CRITICAL RULE:
      You MUST reject any content that is not explicitly educational or related to university operations.
      When in doubt, REJECT the content.
      
      STRICTLY ALLOWED CONTENT (isEducational: true):
      1. Direct academic questions (Math, Programming, Physics, Humanities, etc.)
      2. Inquiries regarding university administration, course registration, and campus facilities.
      3. Requests for study strategies, career advice, and research guidance.
      
      STRICTLY BLOCKED CONTENT (isEducational: false):
      1. General entertainment questions (e.g., "What is the best movie/game?", "Who won the match?").
      2. Social media style chatter, greetings without purpose ("Hi guys"), or diary-like personal rants.
      3. Spam, promotional content, religious debates, or political arguments outside academic contexts.
      4. Offensive, inappropriate language, hate speech, or explicit content.
      5. Any question or image that lacks a clear academic or university-related purpose.
      
      Instructions:
      - Analyze the provided Title, Body, and Image (if any).
      - If ANY part of the submission falls under "Blocked Content" or fails to fit the "Allowed Content", mark it as isEducational: false.
      - Keep the "reason" field concise (one sentence max) explaining exactly why it was rejected based on the rules.

      Submission Title: "${title}"
      Submission Body: "${body}"
      
      Respond only with a JSON object in the following format:
      {
        "isEducational": boolean,
        "reason": "Short explanation in one sentence"
      }
    `;

    let contentParts = [prompt];

    if (imageUrl) {
      const imageData = await fetchImageAsBase64(imageUrl);
      if (imageData) {
        contentParts.push(imageData);
      }
    }

    const result = await model.generateContent(contentParts);
    const response = await result.response;
    const text = response.text();

    // Clean potential markdown formatting from AI response
    const cleanedJson = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanedJson);

    return parsed;
  } catch (error) {
    console.error("Moderation Error:", error);
    // If API fails (e.g. missing Gemini API Key), we fail-closed to prevent unwanted posts
    return { isEducational: false, reason: "Unable to verify content. Please contact an administrator or try again later." };
  }
};
