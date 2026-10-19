import os
import json
import certifi
os.environ["SSL_CERT_FILE"] = certifi.where()

from scrapling import StealthyFetcher

print("[*] Fetching Canva Apps Marketplace (canva.com/apps)...")
try:
    fetcher = StealthyFetcher()
    page = fetcher.fetch("https://www.canva.com/apps/", headless=True, timeout=45000)
    print(f"[+] Status: {page.status}")
    
    # Extract app cards, categories, and titles
    app_titles = [t.strip() for t in page.css("h2::text, h3::text, h4::text, p::text").getall() if t.strip()]
    app_links = []
    for a in page.css("a[href*='/apps/']"):
        t = a.css("::text").get()
        h = a.attrib.get("href", "")
        if t and h:
            app_links.append({"title": t.strip(), "href": h})

    print(f"[+] Found {len(app_links)} app links and {len(app_titles)} text entries")
    
    with open("canva_apps_scraped.json", "w") as f:
        json.dump({
            "app_links": app_links[:60],
            "app_texts": app_titles[:60]
        }, f, indent=2)
    print("[+] Saved to canva_apps_scraped.json")
except Exception as e:
    print(f"[-] Error fetching apps: {e}")
