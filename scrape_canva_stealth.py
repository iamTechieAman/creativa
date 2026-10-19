import os
import json
import certifi
os.environ["SSL_CERT_FILE"] = certifi.where()

from scrapling import StealthyFetcher

print("[*] Launching Scrapling StealthyFetcher on Canva...")
try:
    fetcher = StealthyFetcher()
    # Fetch Canva homepage with stealth browser
    page = fetcher.fetch("https://www.canva.com/", headless=True, timeout=45000)
    print(f"[+] Status: {page.status}")
    title = page.css("title::text").get()
    print(f"[+] Title: {title}")
    
    # Extract navigation elements
    nav_items = [t.strip() for t in page.css("nav a::text, header a::text, button::text").getall() if t.strip()]
    headings = [h.strip() for h in page.css("h1::text, h2::text, h3::text, h4::text").getall() if h.strip()]
    
    print(f"[+] Nav items ({len(nav_items)}): {nav_items[:15]}")
    print(f"[+] Headings ({len(headings)}): {headings[:15]}")

    with open("canva_stealth_scraped.json", "w") as f:
        json.dump({
            "title": title,
            "nav_items": nav_items,
            "headings": headings
        }, f, indent=2)
    print("[+] Successfully saved canva_stealth_scraped.json")
except Exception as e:
    print(f"[-] Stealth fetch error: {e}")
