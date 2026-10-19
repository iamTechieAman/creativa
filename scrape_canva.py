import json
import os
from scrapling import Fetcher, Selector

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"macOS"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1"
}

targets = [
    ("features", "https://www.canva.com/features/"),
    ("templates", "https://www.canva.com/templates/"),
    ("apps", "https://www.canva.com/apps/"),
    ("colors", "https://www.canva.com/colors/color-palette-generator/"),
    ("photo_editor", "https://www.canva.com/photo-editor/")
]

scraped_results = {}

for name, url in targets:
    print(f"[*] Fetching {name}: {url}")
    try:
        resp = Fetcher.get(url, impersonate="chrome124", headers=headers, follow_redirects=True, timeout=15)
        print(f"  -> Status: {resp.status}, Length: {len(resp.text)} bytes")
        if len(resp.text) > 0:
            page = Selector(resp.text)
            title = page.css("title::text").get()
            meta_desc = page.css("meta[name='description']::attr(content)").get()
            
            # Extract links and feature lists
            links = []
            for a in page.css("a"):
                t = a.css("::text").get()
                h = a.attrib.get("href", "")
                if t and len(t.strip()) > 2 and h:
                    links.append({"text": t.strip(), "href": h})

            items = [t.strip() for t in page.css("h2::text, h3::text, h4::text, p::text").getall() if len(t.strip()) > 8]

            scraped_results[name] = {
                "title": title,
                "description": meta_desc,
                "items_sample": items[:40],
                "links_sample": links[:30]
            }
            print(f"  -> Scraped {len(items)} text elements, {len(links)} links")
        else:
            print("  -> Empty response (Cloudflare block or challenge)")
    except Exception as e:
        print(f"  -> Error: {e}")

with open("canva_scraped_data.json", "w") as f:
    json.dump(scraped_results, f, indent=2)

print("[+] Done! Results saved to canva_scraped_data.json")
