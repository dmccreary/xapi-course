#!/usr/bin/env python3
"""Strip YouTube-style timestamps from a transcript file.

The transcripts saved from YouTube's "Show transcript" panel interleave the
spoken text with two timestamp lines per chunk:

    Welcome to our second session on the Xapi collective. Um so today um we are
    0:20
    20 seconds
    joined by Shelley Blade Pac who I'll introduce a little bit later...
    0:30
    30 seconds

This tool removes both the `M:SS` / `MM:SS` line and the human-readable
duration line (e.g. "20 seconds", "1 minute, 5 seconds", "36 minutes,
46 seconds"), leaving the spoken text intact and collapsing runs of blank
lines.

Usage:
    python3 remove-transcript-timestamps.py <input.md> [output.md]

If no output path is given, the input file is overwritten in place.
"""

import re
import sys
from pathlib import Path

TIMESTAMP_RE = re.compile(r'^\s*\d{1,2}:\d{2}\s*$')
DURATION_RE = re.compile(
    r'^\s*('
    r'\d+\s+seconds?'
    r'|\d+\s+minutes?'
    r'|\d+\s+minutes?,\s+\d+\s+seconds?'
    r'|\d+\s+hours?(,\s+\d+\s+minutes?)?(,\s+\d+\s+seconds?)?'
    r')\s*$'
)


def strip_timestamps(text: str) -> str:
    kept = [
        line for line in text.splitlines()
        if not TIMESTAMP_RE.match(line) and not DURATION_RE.match(line)
    ]
    result = '\n'.join(kept)
    result = re.sub(r'\n{3,}', '\n\n', result)
    return result.rstrip() + '\n'


def main() -> int:
    if len(sys.argv) < 2 or sys.argv[1] in ('-h', '--help'):
        print(__doc__, file=sys.stderr)
        return 1

    in_path = Path(sys.argv[1])
    out_path = Path(sys.argv[2]) if len(sys.argv) > 2 else in_path

    if not in_path.is_file():
        print(f'error: input file not found: {in_path}', file=sys.stderr)
        return 2

    original = in_path.read_text()
    cleaned = strip_timestamps(original)
    out_path.write_text(cleaned)

    removed = len(original.splitlines()) - len(cleaned.splitlines())
    print(f'wrote {out_path} ({removed} timestamp/duration lines removed)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
