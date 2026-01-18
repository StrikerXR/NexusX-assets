from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page()
    page.goto("http://localhost:8000")
    # Wait for script to load
    page.wait_for_timeout(2000)
    res_motion_upper = page.evaluate("typeof Motion")
    res_motion_lower = page.evaluate("typeof motion")
    print(f"Motion: {res_motion_upper}")
    print(f"motion: {res_motion_lower}")
    browser.close()
