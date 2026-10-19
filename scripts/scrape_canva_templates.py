import json
import re
import os
from scrapling import StealthyFetcher

fetcher = StealthyFetcher()

CATEGORIES = [
    { 'cat': 'Presentation', 'url': 'https://www.canva.com/presentations/templates/', 'w': 1920, 'h': 1080 },
    { 'cat': 'Social Media', 'url': 'https://www.canva.com/instagram-posts/templates/', 'w': 1080, 'h': 1080 },
    { 'cat': 'Marketing', 'url': 'https://www.canva.com/flyers/templates/', 'w': 1080, 'h': 1920 },
    { 'cat': 'Logo', 'url': 'https://www.canva.com/logos/templates/', 'w': 800, 'h': 800 },
    { 'cat': 'Poster', 'url': 'https://www.canva.com/posters/templates/', 'w': 1080, 'h': 1350 },
    { 'cat': 'Business', 'url': 'https://www.canva.com/resumes/templates/', 'w': 794, 'h': 1123 },
    { 'cat': 'Invitation', 'url': 'https://www.canva.com/invitations/templates/', 'w': 1080, 'h': 1920 },
    { 'cat': 'Video', 'url': 'https://www.canva.com/youtube-thumbnails/templates/', 'w': 1280, 'h': 720 },
]

all_templates = []
seen_titles = set()

for c_info in CATEGORIES:
    cat_name = c_info['cat']
    cat_url = c_info['url']
    width = c_info['w']
    height = c_info['h']
    
    print(f"Scraping category: {cat_name} from {cat_url}...")
    try:
        page = fetcher.fetch(cat_url, headless=True, timeout=15000)
        imgs = page.find_all('img')
        added = 0
        
        for img in imgs:
            src = img.attrib.get('src', '')
            alt = (img.attrib.get('alt', '')).strip()
            
            if 'template.canva.com' in src and alt and len(alt) > 5 and alt not in seen_titles:
                clean_src = src.split('?')[0]
                seen_titles.add(alt)
                
                # Derive search keywords from title
                words = re.findall(r'[a-zA-Z0-9]+', alt.lower())
                keywords = list(set(words + [cat_name.lower(), 'canva', 'official']))
                
                # Template ID
                safe_slug = re.sub(r'[^a-z0-9]+', '-', alt.lower()).strip('-')[:40]
                tpl_id = f"canva-{safe_slug}"
                
                # Create editable template structure with background image and text layers
                template_def = {
                    'id': tpl_id,
                    'title': alt,
                    'category': cat_name,
                    'width': width,
                    'height': height,
                    'backgroundColor': '#ffffff',
                    'previewUrl': clean_src,
                    'keywords': keywords,
                    'objects': [
                        # Background template art from Canva CDN
                        {
                            'type': 'image',
                            'src': clean_src,
                            'left': 0,
                            'top': 0,
                            'width': width,
                            'height': height,
                            'scaleX': 1,
                            'scaleY': 1,
                            'selectable': True,
                            'crossOrigin': 'anonymous'
                        },
                        # Editable Headline Layer
                        {
                            'type': 'textbox',
                            'text': alt.upper()[:35],
                            'left': width / 2,
                            'top': height * 0.18,
                            'fontSize': max(24, int(width * 0.045)),
                            'fontWeight': 'bold',
                            'fontFamily': 'Montserrat',
                            'fill': '#ffffff',
                            'textAlign': 'center',
                            'originX': 'center',
                            'originY': 'center',
                            'width': int(width * 0.8)
                        }
                    ]
                }
                
                all_templates.append(template_def)
                added += 1
                if added >= 8:
                    break
                    
        print(f"-> Successfully extracted {added} templates for {cat_name}")
    except Exception as e:
        print(f"Error scraping {cat_name}: {e}")

print(f"\nTotal scraped Canva templates: {len(all_templates)}")

# Write to src/data/scrapedCanvaTemplates.js
out_path = '/Users/amankumar/Downloads/canva/src/data/scrapedCanvaTemplates.js'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write("// Auto-scraped official Canva templates via Scrapling\n")
    f.write("export const SCRAPED_CANVA_TEMPLATES = ")
    json.dump(all_templates, f, indent=2)
    f.write(";\n")

print(f"Saved to {out_path}")
