"""Inventory local media without modifying it. Editorial decisions are bound to exact bytes and path."""
import csv
import hashlib
from collections import Counter
from pathlib import Path
from struct import unpack
from PIL import Image, UnidentifiedImageError

SOURCE = Path("assets/Visuals")
DEST = Path("docs/VISUALS_ASSET_MANIFEST.csv")
EDITORIAL_FIELDS = ("rights_provenance_status", "approval_status", "public_publishing_eligibility", "approved_uses")
FIELDS = ("filename", "relative_path", "file_type", "bytes", "width", "height", "intended_gallery_category",
          "rights_provenance_status", "approval_status", "suggested_caption", "public_publishing_eligibility",
          "sha256", "identical_files", "orientation", "hero_review", "matched_pair", "approved_uses")
REVIEWED = {
    "fjord-panorama-cantilever-villa-living-room-projec.png": "Fjord-facing living area, open facade and reflection. Landscape crop shortlisted.",
    "aerial-drone-shot-of-norwegian-lakeside-glass-pavi.png": "Pavilion and reflection on a lake. Landscape alternate.",
    "drone-view-of-a-minimalist-scandinavian-modern-hom.png": "Long glazed facade against snowy terrain. Landscape alternate.",
}
CATEGORIES = (
    ("Kitchen", ("kitchen",)), ("Bathroom", ("bathroom", "bath-room")),
    ("Bedroom", ("bedroom", "bed-room")), ("Living room", ("living-room", "lounge")),
    ("Garden and exterior", ("garden", "terrace", "courtyard", "landscape", "exterior", "pool", "drone")),
    ("Wellness and recreation", ("yoga", "meditation", "gym", "spa", "music-room")),
    ("Family spaces", ("kids-room", "nursery", "children")),
)

def movie_dimensions(path):
    # In this collection the visual track has display dimensions in the tkhd header.
    # Track headers for audio have zero width/height. Skip large media payloads.
    def atoms(stream, start, end):
        while start + 8 <= end:
            stream.seek(start)
            size, tag = unpack(">I4s", stream.read(8))
            header = 8
            if size == 1:
                if start + 16 > end:
                    break
                size, = unpack(">Q", stream.read(8))
                header = 16
            if size == 0:
                size = end - start
            if size < header or start + size > end:
                break
            yield tag, start + header, start + size
            start += size

    with path.open("rb") as stream:
        for tag, begin, end in atoms(stream, 0, path.stat().st_size):
            if tag != b"moov":
                continue
            for tag, track, stop in atoms(stream, begin, end):
                if tag != b"trak":
                    continue
                for tag, head, tail in atoms(stream, track, stop):
                    if tag == b"tkhd" and tail - head >= 84:
                        stream.seek(tail - 8)
                        w, h = unpack(">II", stream.read(8))
                        if w and h:
                            return w >> 16, h >> 16
    return "", ""

def inventory():
    if not SOURCE.is_dir():
        raise FileNotFoundError(SOURCE)
    previous = {}
    if DEST.exists():
        with DEST.open(encoding="utf-8-sig", newline="") as stream:
            previous = {(r.get("relative_path"), r.get("sha256")):r for r in csv.DictReader(stream)}
    rows = []
    for path in sorted(SOURCE.rglob("*"), key=lambda p:p.as_posix().casefold()):
        if not path.is_file() or path.is_symlink():
            continue
        detected = path.suffix.lstrip(".").upper()
        w = h = ""
        if detected in {"PNG","JPG","JPEG","WEBP","AVIF"}:
            try:
                with Image.open(path) as img:
                    detected, (w, h) = img.format, img.size
            except (UnidentifiedImageError, OSError):
                detected = "UNREADABLE IMAGE"
        elif detected == "MP4":
            w, h = movie_dimensions(path)
        with path.open("rb") as stream:
            digest = hashlib.file_digest(stream,"sha256").hexdigest()
        name = path.name.lower()
        kind = next((label for label, words in CATEGORIES if any(w in name for w in words)), "Unclassified — review required")
        row = dict(filename=path.name, relative_path=path.as_posix(), file_type=detected, bytes=path.stat().st_size,
                   width=w, height=h, intended_gallery_category=kind, rights_provenance_status="UNKNOWN — owner documentation required",
                   approval_status="NOT REVIEWED", public_publishing_eligibility="NO — rights, consent and editorial approval pending",
                   suggested_caption=REVIEWED.get(name, "Candidate visual: "+path.stem.rsplit(" (",1)[0].replace("-"," ")[:80]+". Subject requires review."),
                   sha256=digest, orientation=("landscape" if w>h else "portrait" if h>w else "square") if w and h else "unknown",
                   hero_review=REVIEWED.get(name,"Uninspected"), matched_pair="UNVERIFIED", approved_uses="NONE")
        existing = previous.get((row["relative_path"], digest))
        if existing:
            row.update({field:existing[field] for field in EDITORIAL_FIELDS if existing.get(field)})
            for field in ("matched_pair", "suggested_caption", "intended_gallery_category", "hero_review"):
                if existing.get(field):
                    row[field] = existing[field]
        rows.append(row)
    if not rows:
        raise ValueError("Source contains no media. Existing inventory retained.")
    counts = Counter(row["sha256"] for row in rows)
    temp = DEST.with_suffix(".csv.tmp")
    with temp.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream,fieldnames=FIELDS,lineterminator="\n")
        writer.writeheader()
        for row in rows:
            writer.writerow(dict(row, identical_files=counts[row["sha256"]]))
    temp.replace(DEST)
    print(f'{len(rows)} files, {sum(r["bytes"] for r in rows)} bytes, {len(counts)} distinct digests, {sum(n>1 for n in counts.values())} byte-identical groups.')

if __name__ == "__main__":
    inventory()
