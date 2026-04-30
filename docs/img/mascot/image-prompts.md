---
title: Xavi the Octopus — Image Generation Prompts
description: AI image prompts for generating all 7 mascot poses for Xavi, the xAPI course pedagogical agent.
---

# Xavi the Octopus — Image Generation Prompts

Xavi is the learning mascot for *xAPI for Intelligent Textbooks*. Use these prompts
in ChatGPT (DALL-E), Midjourney, Stable Diffusion, or any image generator that
supports transparent-background PNG output.

Generate at **1024×1024 pixels** with a **fully transparent background**.
After downloading, run the padding trimmer to remove excess whitespace:

```bash
python ../../../scripts/trim-padding-from-image.py docs/img/mascot/neutral.png
python ../../../scripts/trim-padding-from-image.py docs/img/mascot/welcome.png
python ../../../scripts/trim-padding-from-image.py docs/img/mascot/thinking.png
python ../../../scripts/trim-padding-from-image.py docs/img/mascot/tip.png
python ../../../scripts/trim-padding-from-image.py docs/img/mascot/warning.png
python ../../../scripts/trim-padding-from-image.py docs/img/mascot/celebration.png
python ../../../scripts/trim-padding-from-image.py docs/img/mascot/encouraging.png
```

---

## Base Character Description (included in every prompt below)

A modern flat-vector cartoon illustration of Xavi the Octopus, a friendly
pedagogical mascot for an xAPI and learning-technology textbook. Xavi is a round,
compact octopus with smooth indigo-blue skin, large bright curious eyes, and small
round glasses perched near the top of the mantle. Xavi has expressive, slightly
cartoonish tentacles that convey emotion. The character is small and compact,
suitable for icon-sized display. Xavi is not holding anything so the tentacles
are free to be expressive.

Style: modern flat vector, clean lines,
transparent background, suitable for embedding in educational content. No text in image.

---

## 1. Neutral Pose — `neutral.png`

```
Please generate a neutral pose for Xavi the Octopus.
A modern flat-vector cartoon illustration of Xavi the Octopus, a friendly
pedagogical mascot for an xAPI and learning-technology textbook. Xavi is a round,
compact octopus with smooth indigo-blue skin, large bright curious eyes, and small
round glasses perched near the top of the mantle. Xavi has expressive, slightly
cartoonish tentacles that convey emotion. The character is small and compact,
suitable for icon-sized display. Style: modern flat vector, clean lines,
transparent background, suitable for embedding in educational content. No text in image.

Xavi sits upright in a relaxed, neutral pose facing the viewer directly,
with a calm and friendly closed-mouth smile. All tentacles rest naturally
beneath the body. The pose is balanced and unassuming — suitable as a
general-purpose or default illustration.

Please generate a new PNG image with a fully transparent background.
The background MUST be fully transparent. DO NOT use a white, black, or checkered background.
```

---

## 2. Welcome Pose — `welcome.png`

```
Please generate a welcome pose for Xavi the Octopus.
A modern flat-vector cartoon illustration of Xavi the Octopus, a friendly
pedagogical mascot for an xAPI and learning-technology textbook. Xavi is a round,
compact octopus with smooth indigo-blue skin, large bright curious eyes, and small
round glasses perched near the top of the mantle. Xavi has expressive, slightly
cartoonish tentacles that convey emotion. The character is small and compact,
suitable for icon-sized display. Style: modern flat vector, clean lines,
transparent background, suitable for embedding in educational content. No text in image.

Xavi is waving one tentacle cheerfully upward, facing the viewer with a warm,
welcoming expression and a big open smile. The pose suggests "welcome" and
"let's get started!" Two or three other tentacles are visible underneath.

Please generate a new PNG image with a fully transparent background.
The background MUST be fully transparent. DO NOT use a white, black, or checkered background.
```

---

## 3. Thinking Pose — `thinking.png`

```
Please generate a thinking pose for Xavi the Octopus.
A modern flat-vector cartoon illustration of Xavi the Octopus, a friendly
pedagogical mascot for an xAPI and learning-technology textbook. Xavi is a round,
compact octopus with smooth indigo-blue skin, large bright curious eyes, and small
round glasses perched near the top of the mantle. Xavi has expressive, slightly
cartoonish tentacles that convey emotion. The character is small and compact,
suitable for icon-sized display. Style: modern flat vector, clean lines,
transparent background, suitable for embedding in educational content. No text in image.

Xavi has one tentacle tip touching the chin in a thoughtful pose, eyes looking
slightly upward. A small glowing lightbulb or thought bubble floats above the
mantle. The pose suggests deep thinking and discovery.

Please generate a new PNG image with a fully transparent background.
The background MUST be fully transparent. DO NOT use a white, black, or checkered background.
```

---

## 4. Tip Pose — `tip.png`

```
Please generate a tip pose for Xavi the Octopus.
A modern flat-vector cartoon illustration of Xavi the Octopus, a friendly
pedagogical mascot for an xAPI and learning-technology textbook. Xavi is a round,
compact octopus with smooth indigo-blue skin, large bright curious eyes, and small
round glasses perched near the top of the mantle. Xavi has expressive, slightly
cartoonish tentacles that convey emotion. The character is small and compact,
suitable for icon-sized display. Style: modern flat vector, clean lines,
transparent background, suitable for embedding in educational content. No text in image.

Xavi is pointing one tentacle upward as if sharing an important tip, with a
helpful and knowing expression. A small star or sparkle glows near the tip
of the raised tentacle. Another tentacle holds a small JSON document or
data packet to reinforce the API theme.

Please generate a new PNG image with a fully transparent background.
The background MUST be fully transparent. DO NOT use a white, black, or checkered background.
```

---

## 5. Warning Pose — `warning.png`

```
Please generate a friendly warning pose for Xavi the Octopus.
A modern flat-vector cartoon illustration of Xavi the Octopus, a friendly
pedagogical mascot for an xAPI and learning-technology textbook. Xavi is a round,
compact octopus with smooth indigo-blue skin, large bright curious eyes, and small
round glasses perched near the top of the mantle. Xavi has expressive, slightly
cartoonish tentacles that convey emotion. The character is small and compact,
suitable for icon-sized display. Style: modern flat vector, clean lines,
transparent background, suitable for embedding in educational content. No text in image.

Xavi holds up two tentacles in a gentle "stop" or "be careful" gesture,
with a concerned but caring expression. A small yellow exclamation mark or
caution triangle floats nearby. The pose is friendly — not alarming.

Please generate a new PNG image with a fully transparent background.
The background MUST be fully transparent. DO NOT use a white, black, or checkered background.
```

---

## 6. Encouraging Pose — `encouraging.png`

```
Please generate an encouraging pose for Xavi the Octopus.
A modern flat-vector cartoon illustration of Xavi the Octopus, a friendly
pedagogical mascot for an xAPI and learning-technology textbook. Xavi is a round,
compact octopus with smooth indigo-blue skin, large bright curious eyes, and small
round glasses perched near the top of the mantle. Xavi has expressive, slightly
cartoonish tentacles that convey emotion. The character is small and compact,
suitable for icon-sized display. Style: modern flat vector, clean lines,
transparent background, suitable for embedding in educational content. No text in image.

Xavi raises one tentacle in a thumbs-up equivalent (tentacle tip curved
upward) with a warm, reassuring smile. The pose radiates confidence and
"you can do it!" energy. Expression is supportive and steady.

Please generate a new PNG image with a fully transparent background.
The background MUST be fully transparent. DO NOT use a white, black, or checkered background.
```

---

## 7. Celebration Pose — `celebration.png`

```
Please generate a celebration pose for Xavi the Octopus.
A modern flat-vector cartoon illustration of Xavi the Octopus, a friendly
pedagogical mascot for an xAPI and learning-technology textbook. Xavi is a round,
compact octopus with smooth indigo-blue skin, large bright curious eyes, and small
round glasses perched near the top of the mantle. Xavi has expressive, slightly
cartoonish tentacles that convey emotion. The character is small and compact,
suitable for icon-sized display. Style: modern flat vector, clean lines,
transparent background, suitable for embedding in educational content. No text in image.

Xavi stretches all tentacles wide in an exuberant full-body celebration,
eyes squinted in a huge joyful smile. Bright confetti, small stars, and
tiny data-packet icons scatter around the character.  Use bright colors for the confetti
and small stars so they contrast to a dark background.

Please generate a new PNG image with a fully transparent background.
The background MUST be fully transparent. DO NOT use a white, black, or checkered background.
```
