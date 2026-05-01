#!/usr/bin/env python3
"""List MicroSim IDs from docs/sims/TODO filtered by chapter number(s).

Usage:
    python list_microsims_by_chapter.py 2
    python list_microsims_by_chapter.py 1 3 5
    python list_microsims_by_chapter.py 2-6
    python list_microsims_by_chapter.py 1-3 5 7-9

Each argument is either a single chapter number (e.g. "4") or an inclusive
range (e.g. "2-6"). Multiple arguments are combined into a single set of
chapter numbers. Output is one sim_id per line, grouped by chapter, sorted
by chapter number then sim_id.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
TODO_DIR = REPO_ROOT / "docs" / "sims" / "TODO"


def parse_chapter_spec(tokens: list[str]) -> set[int]:
    """Parse tokens like ['1-3', '5', '7-9'] into {1,2,3,5,7,8,9}."""
    chapters: set[int] = set()
    for tok in tokens:
        tok = tok.strip()
        if not tok:
            continue
        if "-" in tok:
            start_s, end_s = tok.split("-", 1)
            start, end = int(start_s), int(end_s)
            if start > end:
                raise ValueError(f"Invalid range '{tok}': start > end")
            chapters.update(range(start, end + 1))
        else:
            chapters.add(int(tok))
    return chapters


def collect_sims(todo_dir: Path, chapters: set[int]) -> list[tuple[int, str, str]]:
    """Return [(chapter_number, sim_id, source_filename), ...] for matches."""
    if not todo_dir.is_dir():
        raise FileNotFoundError(f"TODO dir not found: {todo_dir}")

    matches: list[tuple[int, str, str]] = []
    for json_path in sorted(todo_dir.glob("*.json")):
        try:
            data = json.loads(json_path.read_text())
        except json.JSONDecodeError as exc:
            print(f"WARN: skipping malformed JSON {json_path.name}: {exc}",
                  file=sys.stderr)
            continue

        ch = data.get("chapter_number")
        sim_id = data.get("sim_id")
        if ch is None or sim_id is None:
            print(f"WARN: {json_path.name} missing chapter_number or sim_id",
                  file=sys.stderr)
            continue
        if ch in chapters:
            matches.append((ch, sim_id, json_path.name))

    matches.sort(key=lambda row: (row[0], row[1]))
    return matches


def main() -> int:
    parser = argparse.ArgumentParser(
        description="List MicroSim IDs in docs/sims/TODO by chapter.",
    )
    parser.add_argument(
        "chapters",
        nargs="+",
        help="Chapter numbers or ranges (e.g. '2', '1-5', '1-3 5 7-9').",
    )
    parser.add_argument(
        "--todo-dir",
        type=Path,
        default=TODO_DIR,
        help=f"Override TODO dir (default: {TODO_DIR}).",
    )
    parser.add_argument(
        "--format",
        choices=("plain", "grouped", "json"),
        default="grouped",
        help="Output format (default: grouped).",
    )
    args = parser.parse_args()

    try:
        chapters = parse_chapter_spec(args.chapters)
    except ValueError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 2

    if not chapters:
        print("ERROR: no chapter numbers parsed from arguments", file=sys.stderr)
        return 2

    matches = collect_sims(args.todo_dir, chapters)

    if args.format == "plain":
        for _ch, sim_id, _src in matches:
            print(sim_id)
    elif args.format == "json":
        print(json.dumps(
            [{"chapter": c, "sim_id": s, "source": src} for c, s, src in matches],
            indent=2,
        ))
    else:  # grouped
        current_ch: int | None = None
        for ch, sim_id, _src in matches:
            if ch != current_ch:
                if current_ch is not None:
                    print()
                print(f"Chapter {ch}:")
                current_ch = ch
            print(f"  {sim_id}")
        if not matches:
            requested = ", ".join(str(c) for c in sorted(chapters))
            print(f"(no MicroSims found for chapter(s): {requested})")

    return 0


if __name__ == "__main__":
    sys.exit(main())
