import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Example: Multi-turn editing with chat sessions
const chat = ai.chats.create({
  model: "gemini-3-pro-image-preview",
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
    tools: [{ googleSearch: {} }],
  },
});

function saveImage(response, filename) {
  for (const part of response.candidates[0].content.parts) {
    if (!part.thought && part.inlineData) {
      const buffer = Buffer.from(part.inlineData.data, "base64");
      fs.writeFileSync(filename, buffer);
      console.log(`Saved: ${filename}`);
      return true;
    }
    if (!part.thought && part.text) {
      console.log("Model:", part.text);
    }
  }
  return false;
}

try {
  // Step 1: Generate initial image
  console.log("Step 1: Generating initial image...");
  let response = await chat.sendMessage({
    message: "Create a modern minimalist logo for a coffee shop called 'Morning Brew'",
  });
  saveImage(response, "step1_initial.png");

  // Step 2: Edit the image
  console.log("\nStep 2: Editing the image...");
  response = await chat.sendMessage({
    message: "Make the colors warmer and add a coffee cup icon",
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: { aspectRatio: '1:1', imageSize: '2K' },
    },
  });
  saveImage(response, "step2_edited.png");

  // Step 3: Final refinement
  console.log("\nStep 3: Final refinement...");
  response = await chat.sendMessage({
    message: "Add a tagline 'Start Your Day Right' below the logo in an elegant font",
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: { aspectRatio: '1:1', imageSize: '2K' },
    },
  });
  saveImage(response, "step3_final.png");

  console.log("\nDone! Check the output files.");
} catch (error) {
  console.error("Error:", error.message);
}
