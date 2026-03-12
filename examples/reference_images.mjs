import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import * as path from "node:path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper: load image as base64
function loadImageAsBase64(imagePath) {
  const buffer = fs.readFileSync(imagePath);
  return buffer.toString("base64");
}

// Helper: get MIME type from extension
function getMimeType(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const types = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };
  return types[ext] || "image/jpeg";
}

// Usage: pass image paths as command line arguments
// node reference_images.mjs image1.jpg image2.jpg "prompt text"
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log("Usage: node reference_images.mjs <image1> [image2...] <prompt>");
  console.log('Example: node reference_images.mjs photo1.jpg photo2.jpg "Create a group photo in cartoon style"');
  process.exit(1);
}

const prompt = args[args.length - 1];
const imagePaths = args.slice(0, -1);

console.log(`Loading ${imagePaths.length} reference image(s)...`);

const contents = [{ text: prompt }];

for (const imgPath of imagePaths) {
  if (!fs.existsSync(imgPath)) {
    console.error(`File not found: ${imgPath}`);
    process.exit(1);
  }
  contents.push({
    inlineData: {
      mimeType: getMimeType(imgPath),
      data: loadImageAsBase64(imgPath),
    },
  });
  console.log(`  Loaded: ${imgPath}`);
}

try {
  console.log(`\nGenerating with prompt: "${prompt}"`);
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview",
    contents: contents,
    config: {
      responseModalities: ["TEXT", "IMAGE"],
      imageConfig: { aspectRatio: "1:1", imageSize: "2K" },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (!part.thought && part.text) {
      console.log("Model:", part.text);
    }
    if (!part.thought && part.inlineData) {
      const buffer = Buffer.from(part.inlineData.data, "base64");
      fs.writeFileSync("output_with_references.png", buffer);
      console.log("Saved: output_with_references.png");
    }
  }
} catch (error) {
  console.error("Error:", error.message);
}
