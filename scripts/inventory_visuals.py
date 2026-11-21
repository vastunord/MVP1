"""Metadata-only inventory. Never copies, uploads, renames or edits source assets."""
import csv
from pathlib import Path
from PIL import Image, UnidentifiedImageError

SOURCE = Path('assets/Visuals')
DEST = Path('docs/VISUALS_ASSET_MANIFEST.csv')
FIELDS = ['filename','relative_path','file_type','bytes','width','height','intended_gallery_category','rights_provenance_status','approval_status','suggested_caption','public_publishing_eligibility']

def category(name: str) -> str:
    lower = name.lower()
    for label, words in [
        ('Kitchen', ('kitchen',)), ('Bathroom', ('bathroom','bath-room')),
        ('Bedroom', ('bedroom','bed-room')), ('Living room', ('living-room','lounge')),
        ('Garden and exterior', ('garden','terrace','courtyard','landscape','exterior','pool')),
        ('Wellness and recreation', ('yoga','meditation','gym','spa','music-room')),
        ('Family spaces', ('kids-room','nursery','children')),
    ]:
        if any(word in lower for word in words): return label
    return 'Unclassified — review required'

def main() -> None:
    rows = []
    for path in sorted((p for p in SOURCE.rglob('*') if p.is_file()), key=lambda p: str(p).lower()):
        ext = path.suffix.lower().lstrip('.')
        width = height = ''
        detected = ext.upper() or 'UNKNOWN'
        if ext in {'png','jpg','jpeg','webp'}:
            try:
                with Image.open(path) as img:
                    detected = img.format or detected
                    width, height = img.size
            except (UnidentifiedImageError, OSError):
                detected = 'UNREADABLE IMAGE — REVIEW'
        stem = path.stem.rsplit(' (',1)[0].replace('-',' ').strip()
        caption = f'Candidate visual: {stem[:80]}. Subject and context require human verification.' if ext in {'png','jpg','jpeg','webp'} else 'Caption requires manual review.'
        rows.append({
            'filename':path.name,'relative_path':path.as_posix(),'file_type':detected,'bytes':path.stat().st_size,
            'width':width,'height':height,'intended_gallery_category':category(path.name),
            'rights_provenance_status':'UNKNOWN — owner documentation required',
            'approval_status':'NOT REVIEWED',
            'suggested_caption':caption,
            'public_publishing_eligibility':'NO — rights, consent and editorial approval pending',
        })
    DEST.parent.mkdir(parents=True,exist_ok=True)
    with DEST.open('w',encoding='utf-8',newline='') as stream:
        writer = csv.DictWriter(stream,fieldnames=FIELDS,lineterminator='\n')
        writer.writeheader(); writer.writerows(rows)
    print(f'Inventoried {len(rows)} files; {sum(row["bytes"] for row in rows)} bytes. No source file modified.')

if __name__ == '__main__': main()
