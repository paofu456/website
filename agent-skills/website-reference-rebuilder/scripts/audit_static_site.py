#!/usr/bin/env python3
"""Audit a static website tree for missing, external, and oversize assets."""

from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import asdict, dataclass
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


EXTERNAL_SCHEMES = {"http", "https"}
IGNORED_SCHEMES = {"data", "mailto", "tel", "javascript", "blob", "about"}
CSS_URL_RE = re.compile(r"url\(\s*(['\"]?)(.*?)\1\s*\)", re.IGNORECASE)
CSS_IMPORT_RE = re.compile(
    r"@import\s+(?:url\(\s*)?(['\"])(.*?)\1\s*\)?", re.IGNORECASE
)


@dataclass(frozen=True)
class Reference:
    source: str
    value: str
    kind: str


class ReferenceParser(HTMLParser):
    ATTRIBUTES = {"src", "href", "poster", "data-src", "data-href", "action"}

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.references: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        for name, value in attrs:
            if not value:
                continue
            lowered = name.lower()
            if lowered in self.ATTRIBUTES:
                self.references.append((f"{tag}:{lowered}", value.strip()))
            elif lowered == "srcset":
                for candidate in value.split(","):
                    url = candidate.strip().split()[0] if candidate.strip() else ""
                    if url:
                        self.references.append((f"{tag}:srcset", url))
            elif lowered == "style":
                for match in CSS_URL_RE.finditer(value):
                    self.references.append((f"{tag}:style-url", match.group(2).strip()))


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("root", type=Path, help="Static output directory")
    parser.add_argument(
        "--max-file-mib",
        type=float,
        default=None,
        help="Fail when a file exceeds this size in MiB",
    )
    parser.add_argument(
        "--fail-on-external",
        action="store_true",
        help="Treat every HTTP(S) or protocol-relative reference as a failure",
    )
    parser.add_argument(
        "--fail-on-external-runtime",
        action="store_true",
        help="Fail on external runtime dependencies, but allow navigation links",
    )
    parser.add_argument("--json", type=Path, dest="json_path", help="Write JSON report")
    return parser.parse_args()


def collect_references(path: Path, root: Path) -> list[Reference]:
    source = path.relative_to(root).as_posix()
    text = path.read_text(encoding="utf-8", errors="replace")
    found: list[Reference] = []
    if path.suffix.lower() in {".html", ".htm"}:
        parser = ReferenceParser()
        parser.feed(text)
        found.extend(Reference(source, value, kind) for kind, value in parser.references)
    elif path.suffix.lower() == ".css":
        found.extend(
            Reference(source, match.group(2).strip(), "css-url")
            for match in CSS_URL_RE.finditer(text)
        )
        found.extend(
            Reference(source, match.group(2).strip(), "css-import")
            for match in CSS_IMPORT_RE.finditer(text)
        )
    return found


def classify(value: str) -> str:
    if not value or value.startswith("#"):
        return "ignored"
    if value.startswith("//"):
        return "external"
    parsed = urlsplit(value)
    scheme = parsed.scheme.lower()
    if scheme in EXTERNAL_SCHEMES:
        return "external"
    if scheme in IGNORED_SCHEMES:
        return "ignored"
    if scheme:
        return "ignored"
    return "local"


def candidate_paths(reference: Reference, root: Path) -> list[Path]:
    parsed = urlsplit(reference.value)
    raw_path = unquote(parsed.path).replace("\\", "/")
    if not raw_path:
        return []
    if raw_path.startswith("/"):
        base = root / raw_path.lstrip("/")
    else:
        base = (root / reference.source).parent / raw_path
    candidates = [base]
    if raw_path.endswith("/"):
        candidates.append(base / "index.html")
    elif not Path(raw_path).suffix:
        candidates.extend((Path(f"{base}.html"), base / "index.html"))
    return candidates


def audit(root: Path, max_file_mib: float | None) -> dict[str, object]:
    root = root.resolve()
    files = sorted(path for path in root.rglob("*") if path.is_file())
    references: list[Reference] = []
    for path in files:
        if path.suffix.lower() in {".html", ".htm", ".css"}:
            references.extend(collect_references(path, root))

    external = sorted(
        (asdict(ref) for ref in references if classify(ref.value) == "external"),
        key=lambda item: (item["source"], item["value"]),
    )
    navigation_kinds = {"a:href", "area:href"}
    external_navigation = [
        item for item in external if str(item["kind"]) in navigation_kinds
    ]
    external_runtime = [
        item for item in external if str(item["kind"]) not in navigation_kinds
    ]
    missing: list[dict[str, object]] = []
    for ref in references:
        if classify(ref.value) != "local":
            continue
        candidates = candidate_paths(ref, root)
        if candidates and not any(path.is_file() for path in candidates):
            missing.append(
                {
                    **asdict(ref),
                    "candidates": [
                        path.resolve().relative_to(root).as_posix()
                        if path.resolve().is_relative_to(root)
                        else str(path.resolve())
                        for path in candidates
                    ],
                }
            )

    byte_limit = None if max_file_mib is None else int(max_file_mib * 1024 * 1024)
    oversize = []
    if byte_limit is not None:
        oversize = [
            {
                "path": path.relative_to(root).as_posix(),
                "bytes": path.stat().st_size,
                "mib": round(path.stat().st_size / (1024 * 1024), 3),
            }
            for path in files
            if path.stat().st_size > byte_limit
        ]

    suffix_counts: dict[str, int] = {}
    for path in files:
        suffix = path.suffix.lower() or "<no-extension>"
        suffix_counts[suffix] = suffix_counts.get(suffix, 0) + 1

    return {
        "root": str(root),
        "files": len(files),
        "html_files": sum(path.suffix.lower() in {".html", ".htm"} for path in files),
        "references": len(references),
        "missing": missing,
        "external": external,
        "external_navigation": external_navigation,
        "external_runtime": external_runtime,
        "oversize": oversize,
        "max_file_mib": max_file_mib,
        "suffix_counts": dict(sorted(suffix_counts.items())),
    }


def main() -> int:
    args = parse_args()
    if not args.root.is_dir():
        print(f"error: static root does not exist: {args.root}", file=sys.stderr)
        return 2
    report = audit(args.root, args.max_file_mib)
    rendered = json.dumps(report, ensure_ascii=False, indent=2)
    print(rendered)
    if args.json_path:
        args.json_path.parent.mkdir(parents=True, exist_ok=True)
        args.json_path.write_text(rendered + "\n", encoding="utf-8")
    failed = bool(report["missing"] or report["oversize"])
    if args.fail_on_external and report["external"]:
        failed = True
    if args.fail_on_external_runtime and report["external_runtime"]:
        failed = True
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())


