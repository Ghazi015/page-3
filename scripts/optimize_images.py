#!/usr/bin/env python3
"""Optimasi foto: konversi ke WebP (varian full + thumb) ke public/photos/."""
import json
import os
from PIL import Image

SRC = "/home/user/uploads"
OUT = "/home/user/public/photos"
os.makedirs(OUT, exist_ok=True)

MAP = {
    "potret-putih": "Max_a_bikin_hadapannya_ked.png",
    "potret-hitam": "Max_a_hapus_tanduonya_dam_.png",
    "potret-langit": "IMG_20261001_130155.png",
    "kolase-senja": "Max_a_Bikin_gambar_yang_sa_33.png",
    "koin-high-table": "Max_a_Jadikan_lebih_jernih_2.png",
    "sakura-merpati": "Max_a_Jadikan_lebih_jernih_1.png",
    "sakura-merpati-2": "sakura-dove.png",
    "spiral-buku": "books.jpg",
    "buku-kuno": "ancient.jpg",
    "notebook-galeri": "notebook.jpg",
    "ruang-ungu": "content-2.png",
}

# batas sisi terpanjang untuk varian full & thumb
FULL_MAX = 1600
THUMB_MAX = 720

result = {}
for fid, fname in MAP.items():
    path = os.path.join(SRC, fname)
    im = Image.open(path)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
    else:
        im = im.convert("RGB")
    w, h = im.size

    # varian full
    full = im.copy()
    full.thumbnail((FULL_MAX, FULL_MAX), Image.LANCZOS)
    full_path = os.path.join(OUT, f"{fid}.webp")
    full.save(full_path, "WEBP", quality=78, method=6)

    # varian thumb
    th = im.copy()
    th.thumbnail((THUMB_MAX, THUMB_MAX), Image.LANCZOS)
    th_path = os.path.join(OUT, f"{fid}-thumb.webp")
    th.save(th_path, "WEBP", quality=70, method=6)

    result[fid] = {
        "src_w": w,
        "src_h": h,
        "w": full.size[0],
        "h": full.size[1],
        "tw": th.size[0],
        "th": th.size[1],
        "full_kb": round(os.path.getsize(full_path) / 1024, 1),
        "thumb_kb": round(os.path.getsize(th_path) / 1024, 1),
    }

print(json.dumps(result, indent=1))
