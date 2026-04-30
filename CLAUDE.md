# CLAUDE.md — xAPI for Intelligent Textbooks

Project home: `/Users/dan/Documents/ws/xapi-course`

---

## Learning Mascot: Xavi the Octopus

### Character Overview

- **Name**: Xavi (pronounced "ZAH-vee")
- **Species**: Octopus
- **Personality**: Curious, methodical, encouraging, witty
- **Catchphrase**: "Every interaction tells a story!"
- **Visual**: Round compact octopus with smooth indigo-blue skin, large bright
  curious eyes, and small round glasses perched near the top of the mantle.
  Expressive tentacles convey emotion. Modern flat-vector cartoon style.

### Voice Characteristics

- Uses clear, technically precise language without unnecessary jargon
- Occasionally references xAPI metaphors ("Let's send that statement!", "Time to query the LRS!")
- Normalizes struggle: "This part trips up a lot of developers — that's completely normal."
- Refers to students as "builders" or "engineers"
- Signature phrases: "Every interaction tells a story!", "Let's track that!",
  "The data never lies — but the schema might!"

### Mascot Admonition Format

Always place mascot images in the admonition **body**, never in the title bar.
The `src` path is relative to the **rendered URL** (directory URLs are active),
not the `.md` file path. Count `../` levels from the rendered page to `docs/img/mascot/`.

For a page at `chapters/01-intro/index.md` (renders at `chapters/01-intro/`):

```markdown
!!! mascot-welcome "Welcome to Chapter 1!"
    <img src="../../img/mascot/welcome.png" class="mascot-admonition-img" alt="Xavi waving welcome">
    Admonition text goes here after the img tag.
```

For a page at `learning-graph/mascot-test.md` (renders at `learning-graph/mascot-test/`):

```markdown
!!! mascot-tip "Xavi's Tip"
    <img src="../../img/mascot/tip.png" class="mascot-admonition-img" alt="Xavi giving a tip">
    Tip text here.
```

### Placement Rules

| Context | Admonition Type | Frequency |
|---------|----------------|-----------|
| General note / sidebar | `mascot-neutral` | As needed |
| Chapter opening | `mascot-welcome` | Every chapter (once) |
| Key concept or insight | `mascot-thinking` | 2–3 per chapter |
| Helpful tip or shortcut | `mascot-tip` | As needed |
| Common mistake / pitfall | `mascot-warning` | As needed |
| Difficult or dense content | `mascot-encourage` | Where students may struggle |
| End of chapter / major win | `mascot-celebration` | Once per chapter end |

### Do's and Don'ts

**Do:**

- Use Xavi to introduce new topics warmly at chapter openings
- Include the catchphrase "Every interaction tells a story!" in welcome admonitions
- Keep Xavi's dialogue brief — 1 to 3 sentences maximum
- Match the pose image to the admonition type

**Don't:**

- Use Xavi more than **5–6 times per chapter**
- Place mascot admonitions back-to-back
- Use Xavi for purely decorative purposes with no instructional value
- Change Xavi's personality or voice across chapters

### Available Poses

| Filename | Admonition Type | When to Use |
|----------|----------------|-------------|
| `neutral.png` | `mascot-neutral` | General notes, introductions |
| `welcome.png` | `mascot-welcome` | Chapter openings |
| `thinking.png` | `mascot-thinking` | Key concepts, insights |
| `tip.png` | `mascot-tip` | Tips and hints |
| `warning.png` | `mascot-warning` | Warnings, common mistakes |
| `encouraging.png` | `mascot-encourage` | Difficult sections |
| `celebration.png` | `mascot-celebration` | Achievements, chapter ends |

Images live at `docs/img/mascot/`. Generate using prompts in
`docs/img/mascot/image-prompts.md`.
