import os
import sys
import subprocess

# Ensure Pillow is installed
try:
    from PIL import Image
except ImportError:
    print("Pillow library not found. Installing now...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

def compress_image(src_path, dest_path, max_size_kb, quality_start=85):
    img = Image.open(src_path)
    # Convert RGBA to RGB if saving to WebP without transparency, or keep RGBA if transparency is needed.
    # Logo usually needs transparency, profile might not. Let's preserve RGBA (mode RGBA).
    
    quality = quality_start
    while True:
        img.save(dest_path, "WEBP", quality=quality, optimize=True)
        size_kb = os.path.getsize(dest_path) / 1024
        print(f"Compressed {src_path} -> {dest_path} | Quality: {quality} | Size: {size_kb:.2f} KB")
        
        if size_kb <= max_size_kb or quality <= 10:
            break
        quality -= 5

if __name__ == "__main__":
    public_dir = "/Users/siamhossain/Project/PORTFOLIO/frontend/public"
    
    logo_src = os.path.join(public_dir, "logo.png")
    logo_dest = os.path.join(public_dir, "logo.webp")
    
    profile_src = os.path.join(public_dir, "profile.png")
    profile_dest = os.path.join(public_dir, "profile.webp")
    
    if os.path.exists(logo_src):
        # Target logo < 100 KB
        compress_image(logo_src, logo_dest, 100)
    else:
        print(f"Source logo not found at {logo_src}")
        
    if os.path.exists(profile_src):
        # Target profile < 150 KB
        compress_image(profile_src, profile_dest, 150)
    else:
        print(f"Source profile not found at {profile_src}")
        
    print("Image optimization finished!")
