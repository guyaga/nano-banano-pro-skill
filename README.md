# Nano Banano Pro

A [Claude Code](https://docs.anthropic.com/en/docs/claude-code) skill for generating and editing images using Google's **Gemini 3 Pro Image Preview** model.

## What It Does

This skill gives Claude Code the ability to generate and edit images directly from your conversation. Ask Claude to create infographics, product mockups, logos, data visualizations, and more — all powered by Gemini's advanced image generation.

### Key Features

- **High-resolution output** — 1K, 2K, or 4K images
- **Advanced text rendering** — legible text for infographics, menus, diagrams
- **Multi-turn editing** — iteratively refine images through conversation
- **Up to 14 reference images** — maintain character/object consistency
- **Google Search grounding** — generate images based on real-time data
- **Multiple aspect ratios** — 1:1, 4:3, 3:4, 16:9, 9:16, 5:4

---

## Installation

### 1. Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create or select a project
3. Generate an API key
4. Copy it — you'll need it in the next step

### 2. Set Your API Key

Choose one of these methods:

**Option A: Environment variable (recommended)**

```bash
# Linux/macOS — add to ~/.bashrc or ~/.zshrc
export GEMINI_API_KEY=your-api-key-here

# Windows (PowerShell) — add to your profile
$env:GEMINI_API_KEY="your-api-key-here"

# Windows (Command Prompt)
set GEMINI_API_KEY=your-api-key-here
```

**Option B: `.env` file in the skill directory**

```bash
# Copy the template
cp .env.example .env

# Edit .env and paste your key
GEMINI_API_KEY=your-api-key-here
```

> **Important:** Never commit your `.env` file. It's already in `.gitignore`.

### 3. Install the Skill in Claude Code

```bash
# Navigate to your Claude Code skills directory
cd ~/.claude/skills/

# Clone this repo
git clone https://github.com/guyaga/nano-banano-pro-skill.git nano-banano-pro

# Install dependencies
cd nano-banano-pro
npm install
```

### 4. Register the Skill

Add the skill to your Claude Code settings. Open `~/.claude/settings.local.json` and add to the `skills` array:

```json
{
  "skills": [
    "~/.claude/skills/nano-banano-pro/SKILL.md"
  ]
}
```

Or install it as a global skill via Claude Code:
```
/skills add ~/.claude/skills/nano-banano-pro/SKILL.md
```

---

## Usage

Once installed, just ask Claude to generate images in your conversation. The skill activates automatically when you request image generation.

### Basic Image Generation

```
> Create a professional infographic about the solar system

> Generate a minimalist logo for a coffee shop called "Morning Brew"

> Make a 4K wallpaper of a mountain landscape at sunset
```

### Editing Images (Multi-Turn)

```
> Create a logo for my brand

> Make the colors warmer and add a tagline "Start Your Day Right"

> Now make it work on a dark background
```

### Using Reference Images

```
> Here's my product photo [attach image]. Create a professional product mockup on a clean white background.

> Here are photos of our team members [attach images]. Create a fun cartoon group photo.
```

### With Google Search Grounding

```
> Create an infographic showing today's weather forecast for New York

> Visualize the current top 5 trending topics as an engaging graphic
```

### Specifying Options

```
> Generate a 4K portrait (9:16) infographic about healthy eating habits

> Create a 1:1 square image for Instagram showing our product features
```

---

## Configuration Options

| Option | Values | Notes |
|--------|--------|-------|
| `imageSize` | `'1K'`, `'2K'`, `'4K'` | Must be uppercase |
| `aspectRatio` | `'1:1'`, `'4:3'`, `'3:4'`, `'16:9'`, `'9:16'`, `'5:4'` | |
| `responseModalities` | `['TEXT', 'IMAGE']` | Required for image output |
| `tools` | `[{googleSearch: {}}]` | Enable real-time data grounding |

---

## Examples

The `examples/` directory contains standalone scripts you can run directly:

```bash
# Set your API key first
export GEMINI_API_KEY=your-key-here

# Generate an infographic
node examples/generate_infographic.mjs

# Multi-turn editing demo
node examples/edit_image.mjs

# Use reference images
node examples/reference_images.mjs photo1.jpg photo2.jpg "Create a cartoon version"
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `API key not found` | Make sure `GEMINI_API_KEY` is set in your environment or `.env` file |
| `Module not found: @google/genai` | Run `npm install` in the skill directory |
| No image in response | The model may have returned text-only. Try a more specific image prompt |
| Low quality output | Use `imageSize: '4K'` and be more detailed in your prompt |

---

## License

MIT
