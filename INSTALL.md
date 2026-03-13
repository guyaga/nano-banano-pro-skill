# How to Install Nano Banano Pro in Claude Code

A step-by-step guide to installing and using the Nano Banano Pro skill in [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — Anthropic's official CLI for Claude.

---

## Prerequisites

Before you begin, make sure you have:

- **Claude Code** installed and working ([installation guide](https://docs.anthropic.com/en/docs/claude-code/overview))
- **Node.js** v18 or later ([download](https://nodejs.org/))
- **Git** installed ([download](https://git-scm.com/))
- A **Google Gemini API key** (free tier available)

---

## Step 1: Get Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select or create a Google Cloud project
5. Copy the generated key — it starts with `AIzaSy...`

> Keep this key safe. You'll need it in Step 3.

---

## Step 2: Clone the Skill

Open your terminal and run:

```bash
# Go to the Claude Code skills directory
cd ~/.claude/skills/

# If the skills directory doesn't exist yet, create it
mkdir -p ~/.claude/skills/
cd ~/.claude/skills/

# Clone the repo
git clone https://github.com/guyaga/nano-banano-pro-skill.git nano-banano-pro

# Install the Node.js dependency
cd nano-banano-pro
npm install
```

Your skill is now at `~/.claude/skills/nano-banano-pro/`.

---

## Step 3: Set Your API Key

You need to make the `GEMINI_API_KEY` environment variable available to Claude Code. Choose the method that matches your system:

### macOS / Linux

Add this line to your shell profile (`~/.bashrc`, `~/.zshrc`, or `~/.bash_profile`):

```bash
export GEMINI_API_KEY="paste-your-key-here"
```

Then reload your shell:

```bash
source ~/.zshrc    # or ~/.bashrc
```

### Windows (PowerShell)

Add to your PowerShell profile (`$PROFILE`):

```powershell
$env:GEMINI_API_KEY="paste-your-key-here"
```

Or set it permanently via System Settings:

1. Search **"Environment Variables"** in the Start menu
2. Click **"Environment Variables..."**
3. Under **User variables**, click **New**
4. Variable name: `GEMINI_API_KEY`
5. Variable value: paste your key
6. Click OK

### Windows (Git Bash / MSYS2)

Add to `~/.bashrc`:

```bash
export GEMINI_API_KEY="paste-your-key-here"
```

### Alternative: `.env` File

If you prefer not to set a global environment variable, create a `.env` file inside the skill directory:

```bash
cd ~/.claude/skills/nano-banano-pro
cp .env.example .env
```

Edit `.env` and paste your key:

```
GEMINI_API_KEY=paste-your-key-here
```

> **Security note:** The `.env` file is gitignored and will never be committed.

---

## Step 4: Register the Skill in Claude Code

There are two ways to register the skill:

### Option A: Via Claude Code CLI

Open Claude Code and type:

```
/skills add ~/.claude/skills/nano-banano-pro/SKILL.md
```

### Option B: Edit Settings Manually

Open your Claude Code settings file at `~/.claude/settings.local.json` and add the skill path:

```json
{
  "skills": [
    "~/.claude/skills/nano-banano-pro/SKILL.md"
  ]
}
```

If you already have other skills, just add it to the existing array:

```json
{
  "skills": [
    "~/.claude/skills/some-other-skill/SKILL.md",
    "~/.claude/skills/nano-banano-pro/SKILL.md"
  ]
}
```

---

## Step 5: Verify It Works

1. **Restart Claude Code** (close and reopen your terminal, then run `claude`)
2. Ask Claude to generate an image:

```
> Create a simple infographic about the water cycle
```

If everything is set up correctly, Claude will:
1. Write a generation script using the Gemini API
2. Run it to generate the image
3. Save the output image and show you where it is

---

## How to Use It

Once installed, you don't need to do anything special. Just ask Claude to create or edit images in natural language. The skill activates automatically.

### Generate Images

```
> Create a professional infographic about healthy eating habits

> Generate a minimalist logo for a tech startup called "NovaTech"

> Make a 4K landscape wallpaper of a Japanese garden in autumn
```

### Edit Images Iteratively

```
> Create a poster for a music festival

> Make the background darker and add more contrast

> Change the title font to something bolder
```

### Use Reference Images

If you have images on disk, point Claude to them:

```
> Use the photo at ~/photos/product.jpg and create a professional mockup on a marble background

> Take these team photos at ~/photos/team/ and create a fun cartoon group portrait
```

### Specify Size and Format

```
> Create a 4K (16:9) banner for my YouTube channel

> Generate a square (1:1) product photo for Instagram

> Make a 9:16 story-sized graphic announcing our sale
```

### Use Real-Time Data (Google Search Grounding)

```
> Create an infographic showing the current weather in Tokyo

> Visualize today's top trending topics as a modern graphic
```

---

## Configuration Reference

| Setting | Options | Default |
|---------|---------|---------|
| Image size | `1K`, `2K`, `4K` | `2K` |
| Aspect ratio | `1:1`, `4:3`, `3:4`, `16:9`, `9:16`, `5:4` | `16:9` |
| Search grounding | Enable with `tools: [{googleSearch: {}}]` | Off |
| Reference images | Up to 14 (6 objects + 5 humans) | None |

---

## Troubleshooting

### "GEMINI_API_KEY is not set"

Your environment variable isn't reaching Claude Code. Make sure:
- You added it to the correct shell profile file
- You restarted your terminal after setting it
- You're using the same shell that has the variable set

Test it:
```bash
echo $GEMINI_API_KEY
```
If this prints nothing, the variable isn't set in your current shell.

### "Cannot find module '@google/genai'"

Run `npm install` inside the skill directory:
```bash
cd ~/.claude/skills/nano-banano-pro
npm install
```

### "Skill not found" or skill doesn't activate

1. Check that the path in `settings.local.json` is correct
2. Make sure the `SKILL.md` file exists at that path
3. Restart Claude Code

### Image generation fails or returns text only

- Try a more specific, descriptive prompt
- Make sure your API key is valid and has quota remaining
- Check your internet connection

### "Permission denied" errors

On macOS/Linux, make sure the skill directory is readable:
```bash
chmod -R 755 ~/.claude/skills/nano-banano-pro
```

---

## Updating the Skill

To get the latest version:

```bash
cd ~/.claude/skills/nano-banano-pro
git pull
npm install
```

---

## Uninstalling

1. Remove the skill path from `~/.claude/settings.local.json`
2. Delete the skill directory:
   ```bash
   rm -rf ~/.claude/skills/nano-banano-pro
   ```

---

## Links

- [GitHub Repository](https://github.com/guyaga/nano-banano-pro-skill)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code)
- [Google AI Studio (API Keys)](https://aistudio.google.com/apikey)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)
