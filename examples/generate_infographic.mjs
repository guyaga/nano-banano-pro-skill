import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const prompt = `Create a beautiful, professional infographic titled "Popular Baby Names & Their Meanings" with the following 5 baby names. Use a clean, modern design with soft pastel colors and elegant typography.

For each name, display:
- The name prominently
- Origin country/culture with a small flag or cultural icon
- The meaning in quotes
- Style category (Classic/Modern/Unique) as a small badge
- A brief interesting note

THE 5 NAMES:

1. ALEXANDER
   Origin: Greek (use Greek column or laurel wreath icon)
   Meaning: "Defender of the people"
   Style: Classic
   Note: Strong historical name

2. LIAM
   Origin: Irish (use shamrock or Celtic knot icon)
   Meaning: "Strong-willed warrior"
   Style: Modern
   Note: Very popular worldwide

3. KAI
   Origin: Hawaiian/Japanese (use wave or ocean icon)
   Meaning: "Sea / Forgiveness"
   Style: Unique
   Note: Short and versatile

4. BENJAMIN
   Origin: Hebrew (use star of David or scroll icon)
   Meaning: "Son of the right hand"
   Style: Classic
   Note: Timeless, nickname Ben

5. MATEO
   Origin: Spanish (use sun or Spanish tile pattern icon)
   Meaning: "Gift of God"
   Style: Modern
   Note: International appeal

Design requirements:
- Vertical layout (portrait orientation)
- Each name in its own card/section with visual separation
- Use icons/symbols that represent each name's origin or meaning
- Include a decorative header with the title
- Soft, baby-friendly color palette (pastels, soft blues, greens, yellows)
- All text must be clearly legible
- Professional infographic style suitable for sharing`;

console.log("Generating baby names infographic...");

try {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: prompt,
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
      imageConfig: {
        aspectRatio: '9:16',
        imageSize: '2K',
      },
    },
  });

  let imageCount = 0;
  for (const part of response.candidates[0].content.parts) {
    if (part.thought) {
      if (part.text) console.log('Thinking:', part.text);
    } else {
      if (part.text) {
        console.log('Response:', part.text);
      }
      if (part.inlineData) {
        imageCount++;
        const buffer = Buffer.from(part.inlineData.data, "base64");
        const outputPath = "output_infographic.png";
        fs.writeFileSync(outputPath, buffer);
        console.log(`Image saved to: ${outputPath}`);
      }
    }
  }

  if (imageCount === 0) {
    console.log("No image was generated. Response:", JSON.stringify(response, null, 2));
  }
} catch (error) {
  console.error("Error generating image:", error.message);
  if (error.message.includes("API key")) {
    console.error("Please ensure GEMINI_API_KEY environment variable is set.");
  }
}
