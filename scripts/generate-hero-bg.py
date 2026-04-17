#!/usr/bin/env python3
"""Generate hero background images using Gemini 3.1 Flash Image Preview."""

import base64
import json
import sys
import urllib.request
import os

API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not API_KEY:
    print("Error: GEMINI_API_KEY environment variable is required.")
    sys.exit(1)
MODEL = "gemini-3.1-flash-image-preview"
ENDPOINT = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"

OUTPUT_DIR = "/Users/sankalp/Projects/transient/public/images/hero-options"

PROMPTS = {
    "hero-bg-1.png": (
        "Generate an image: Abstract dark cinematic background for a website hero section. "
        "Subtle flowing light trails and wispy particles on deep black void. "
        "Long exposure photography aesthetic. Faint blue and warm amber accents. "
        "Minimal, premium, atmospheric. Ultra wide 16:9 aspect ratio. No text."
    ),
    "hero-bg-2.png": (
        "Generate an image: Dark abstract background with a subtle neural network visualization. "
        "Faint glowing nodes and delicate connections on pure black. "
        "Soft bokeh light dots scattered throughout. Cinematic depth of field. "
        "Minimal and elegant, suitable as a website background. 16:9 aspect ratio. No text."
    ),
    "hero-bg-3.png": (
        "Generate an image: Cinematic dark background with gentle smoke wisps and volumetric lighting. "
        "Light comes from above creating subtle highlights on dark fog. "
        "Deep blacks with occasional warm amber and cool blue accents. "
        "Atmospheric, moody, premium feel. 16:9 aspect ratio. No text."
    ),
}


def generate_image(prompt: str, output_path: str) -> bool:
    """Generate a single image using Gemini API."""
    payload = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["IMAGE", "TEXT"],
            "temperature": 1.0,
        },
    }).encode("utf-8")

    req = urllib.request.Request(
        ENDPOINT,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        print(f"  Generating: {os.path.basename(output_path)}...")
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read().decode("utf-8"))

        # Extract image from response
        for candidate in data.get("candidates", []):
            for part in candidate.get("content", {}).get("parts", []):
                if "inlineData" in part:
                    img_data = base64.b64decode(part["inlineData"]["data"])
                    with open(output_path, "wb") as f:
                        f.write(img_data)
                    size_kb = len(img_data) / 1024
                    print(f"  ✓ Saved {os.path.basename(output_path)} ({size_kb:.0f} KB)")
                    return True

        print(f"  ✗ No image data in response for {os.path.basename(output_path)}")
        print(f"    Response: {json.dumps(data, indent=2)[:500]}")
        return False

    except Exception as e:
        print(f"  ✗ Error generating {os.path.basename(output_path)}: {e}")
        return False


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Allow generating a specific image by index (1-3) or all
    targets = PROMPTS
    if len(sys.argv) > 1:
        idx = int(sys.argv[1])
        keys = list(PROMPTS.keys())
        if 1 <= idx <= len(keys):
            targets = {keys[idx - 1]: PROMPTS[keys[idx - 1]]}

    print(f"Generating {len(targets)} hero background(s)...\n")

    results = {}
    for filename, prompt in targets.items():
        output_path = os.path.join(OUTPUT_DIR, filename)
        ok = generate_image(prompt, output_path)
        results[filename] = ok

    print(f"\nDone. {sum(results.values())}/{len(results)} succeeded.")
    print(f"Output: {OUTPUT_DIR}/")


if __name__ == "__main__":
    main()
