---
name: nano-banano-pro
description: Generate and edit images using Gemini 3 Pro Image Preview (gemini-3-pro-image-preview) API. Use when the user wants to create images, edit images, generate infographics, visualizations, or any image generation task. Supports multi-turn editing, up to 14 reference images, 4K resolution, Google Search grounding, and advanced text rendering.
allowed-tools: Read, Write, Edit, Bash, Glob
---

# Nano Banano Pro (Gemini 3 Pro Image Preview)

Generate and edit professional images using Google's Gemini 3 Pro Image model.

## Setup

1. Set your API key as an environment variable:
   ```bash
   # Windows (Command Prompt)
   set GEMINI_API_KEY=your-api-key-here

   # Windows (PowerShell)
   $env:GEMINI_API_KEY="your-api-key-here"

   # Linux/macOS
   export GEMINI_API_KEY=your-api-key-here
   ```

2. Install the SDK:
   ```bash
   npm install @google/genai
   ```

## Quick Start - Single Image Generation

```javascript
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: 'gemini-3-pro-image-preview',
  contents: 'Your prompt here',
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
    imageConfig: {
      aspectRatio: '16:9',  // Options: '1:1', '4:3', '3:4', '16:9', '9:16', '5:4'
      imageSize: '2K',      // Options: '1K', '2K', '4K' (must be uppercase)
    },
  },
});

// Save the generated image
for (const part of response.candidates[0].content.parts) {
  if (part.text) {
    console.log(part.text);
  } else if (part.inlineData) {
    const buffer = Buffer.from(part.inlineData.data, "base64");
    fs.writeFileSync("output.png", buffer);
  }
}
```

## Multi-Turn Conversational Editing

Use chat sessions to iteratively edit images:

```javascript
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const chat = ai.chats.create({
  model: "gemini-3-pro-image-preview",
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
    tools: [{googleSearch: {}}],
  },
});

// First message - generate initial image
let response = await chat.sendMessage({
  message: "Create a vibrant infographic about photosynthesis"
});

// Second message - edit the image
response = await chat.sendMessage({
  message: 'Update this infographic to be in Spanish',
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
    imageConfig: {
      aspectRatio: '16:9',
      imageSize: '2K',
    },
  },
});
```

## Using Reference Images (Up to 14)

Mix reference images for the final output:
- Up to 6 object images (high-fidelity inclusion)
- Up to 5 human images (character consistency)

```javascript
const contents = [
  { text: 'An office group photo of these people making funny faces.' },
  { inlineData: { mimeType: "image/jpeg", data: base64Image1 } },
  { inlineData: { mimeType: "image/jpeg", data: base64Image2 } },
  { inlineData: { mimeType: "image/jpeg", data: base64Image3 } },
];

const response = await ai.models.generateContent({
  model: 'gemini-3-pro-image-preview',
  contents: contents,
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
    imageConfig: { aspectRatio: '5:4', imageSize: '2K' },
  },
});
```

## Google Search Grounding

Generate images based on real-time data (weather, stocks, events):

```javascript
const response = await ai.models.generateContent({
  model: 'gemini-3-pro-image-preview',
  contents: 'Visualize the current weather forecast for San Francisco as a modern chart',
  config: {
    responseModalities: ['TEXT', 'IMAGE'],
    tools: [{googleSearch: {}}],
    imageConfig: { aspectRatio: '16:9', imageSize: '2K' },
  },
});

// Response includes groundingMetadata with searchEntryPoint and groundingChunks
```

## Key Configuration Options

| Option | Values | Notes |
|--------|--------|-------|
| `imageSize` | `'1K'`, `'2K'`, `'4K'` | Must be uppercase! |
| `aspectRatio` | `'1:1'`, `'4:3'`, `'3:4'`, `'16:9'`, `'9:16'`, `'5:4'` | |
| `responseModalities` | `['TEXT', 'IMAGE']` | Required for image output |
| `tools` | `[{googleSearch: {}}]` | Enable real-time data grounding |

## Accessing Thinking Process

The model uses "thinking" for complex prompts (enabled by default):

```javascript
for (const part of response.candidates[0].content.parts) {
  if (part.thought) {
    // This is an interim thought image (not charged)
    if (part.text) console.log('Thought:', part.text);
  } else {
    // This is the final output
    if (part.inlineData) {
      fs.writeFileSync('final.png', Buffer.from(part.inlineData.data, 'base64'));
    }
  }
}
```

## Thought Signatures (Multi-Turn)

When using chat/multi-turn, thought signatures are handled automatically by the SDK. If manually managing history, pass back `thought_signature` fields exactly as received.

## Model Capabilities

- High-resolution output: 1K, 2K, 4K
- Advanced text rendering: legible text for infographics, menus, diagrams
- Google Search grounding: real-time data visualization
- Thinking mode: reasoning through complex prompts
- Up to 14 reference images
- Multi-turn conversational editing

## Common Use Cases

1. **Infographics**: Create educational visuals with accurate text
2. **Product mockups**: Generate professional marketing assets
3. **Data visualization**: Charts and graphs from real-time data
4. **Character consistency**: Maintain same characters across images
5. **Style transfer**: Apply artistic styles to concepts
6. **Iterative refinement**: Edit and refine through conversation
