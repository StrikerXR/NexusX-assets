import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context()
        page = await context.new_page()

        # Navigate to the app
        await page.goto("http://localhost:8000")

        # Bypass OOBE
        await page.evaluate("localStorage.setItem('nx_oobe_v13', 'true')")
        await page.reload()

        # Open music player
        await page.evaluate("MusicApp.toggle()")

        # Get frame
        await page.wait_for_selector("#music-frame")
        frame = None
        for f in page.frames:
            if "music-frame" in f.name or f.url == "about:srcdoc":
                frame = f
                break

        if not frame:
            print("Could not find music-frame")
            exit(1)

        # Check for video element
        video_exists = await frame.evaluate("!!document.getElementById('video-player')")
        print(f"Video element exists: {video_exists}")

        # Check for easter egg elements
        overlay_exists = await frame.evaluate("!!document.getElementById('secret-overlay')")
        print(f"Easter egg overlay exists: {overlay_exists}")

        # Check for easter egg code
        code = await frame.evaluate("document.body.innerHTML + document.head.innerHTML")
        has_easter_egg_code = "twentyonepilots" in code or "checkSecretProtocol" in code
        print(f"Easter egg code present: {has_easter_egg_code}")

        if not video_exists or overlay_exists or has_easter_egg_code:
            print("Verification FAILED")
            exit(1)

        print("Verification SUCCESSFUL")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(verify())
