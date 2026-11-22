"""Check the public media register. Pass --sources to verify local master hashes too."""
import argparse
import csv
import hashlib
from collections import Counter
from pathlib import Path

from PIL import Image, ImageChops, ImageOps, ImageStat


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "apps/web/public"
REGISTER = ROOT / "docs/VISUALS_PLACEMENTS.csv"
STUDY_REGISTER = ROOT / "docs/KNOWLEDGE_STUDY_IMAGES.csv"
FOLDERS = ("media/hero", "media/tools", "media/canvas", "media/gallery", "media/briefs", "reference/editorial", "reference/studies")


def digest(path):
    with path.open("rb") as stream:
        return hashlib.file_digest(stream, "sha256").hexdigest()


def scene_signature(path):
    with Image.open(path) as image:
        return ImageOps.exif_transpose(image).convert("RGB").resize((32, 24), Image.Resampling.LANCZOS)


def verify(check_sources):
    with REGISTER.open(encoding="utf-8", newline="") as stream:
        rows = list(csv.DictReader(stream))
    with STUDY_REGISTER.open(encoding="utf-8", newline="") as stream:
        studies = list(csv.DictReader(stream))
    if len(studies) != 500 or len({row["article_slug"] for row in studies}) != 500:
        raise ValueError("Expected 500 distinct illustrated Knowledge studies")
    rows.extend(dict(row, placement="knowledge study", max_width=768) for row in studies)
    counts = Counter(row["placement"] for row in rows)
    for group, count in (("render gallery", 50), ("tool thumbnail", 17), ("tool editor sample", 17), ("room brief", 3)):
        if counts[group] != count:
            raise ValueError(f"{group} has {counts[group]} entries, expected {count}")
    if counts["hero before"] != counts["hero after"] or not counts["hero before"]:
        raise ValueError("Homepage comparison pairs are incomplete")
    registered = set()
    sources = set()
    public_hashes = set()
    for row in rows:
        site_path = row["site_path"]
        target = (PUBLIC / site_path.lstrip("/")).resolve()
        if not target.is_relative_to(PUBLIC) or site_path in registered:
            raise ValueError(f"Invalid or repeated placement {site_path}")
        registered.add(site_path)
        output_hash = digest(target)
        if row.get("derivative_sha256") and row["derivative_sha256"] != output_hash:
            raise ValueError(f"Changed public image at {site_path}")
        if row["source_sha256"] in sources or output_hash in public_hashes:
            raise ValueError(f"Repeated source or output at {site_path}")
        sources.add(row["source_sha256"])
        public_hashes.add(output_hash)
        with Image.open(target) as image:
            if image.format != "WEBP" or image.width > int(row["max_width"]) or image.getexif():
                raise ValueError(f"Invalid derivative at {site_path}")
            image.load()
        if check_sources:
            source = (ROOT / row["local_source"]).resolve()
            if not any(source.is_relative_to(ROOT / "assets" / folder) for folder in ("Visuals", "BeforeAfter")):
                raise ValueError(f"Unexpected source for {site_path}")
            if digest(source) != row["source_sha256"]:
                raise ValueError(f"Changed source for {site_path}")
            source_image = scene_signature(source)
            output_image = scene_signature(target)
            if max(ImageStat.Stat(ImageChops.difference(source_image, output_image)).mean) > 5:
                raise ValueError(f"Published pixels diverge from source for {site_path}")
        if row["placement"] == "render gallery":
            thumbnail_path = site_path.replace("/gallery/", "/gallery/thumbs/")
            thumbnail = PUBLIC / thumbnail_path.lstrip("/")
            with Image.open(thumbnail) as image:
                if image.format != "WEBP" or image.width != 520 or image.getexif():
                    raise ValueError(f"Invalid gallery grid image {thumbnail_path}")
                image.load()
            registered.add(thumbnail_path)
    files = {
        "/" + p.relative_to(PUBLIC).as_posix()
        for folder in FOLDERS for p in (PUBLIC / folder).rglob("*") if p.is_file()
    }
    if files != registered:
        raise ValueError(f"Register and public directories differ: {sorted(files ^ registered)}")
    size = sum((PUBLIC / name.lstrip("/")).stat().st_size for name in files)
    print(f"{len(rows)} distinct placements and {counts['render gallery']} grid sizes verified ({size:,} bytes).")
    if check_sources:
        print(f"All {len(sources)} local masters match their recorded SHA-256.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sources", action="store_true")
    verify(parser.parse_args().sources)
