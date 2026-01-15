
from playwright.sync_api import sync_playwright, expect
import os
import time

def run_verification(page):
    # Navigate to the local server
    page.goto("http://localhost:8000/index.html")

    # Bypass the OOBE screen by setting the localStorage key
    page.evaluate("localStorage.setItem('nx_oobe_v12.2', 'true')")

    # Reload the page to apply the OOBE bypass
    page.reload()

    # Wait for the page to be fully loaded
    page.wait_for_load_state("networkidle")

    # Wait for the MusicApp object to be defined
    page.wait_for_function("typeof MusicApp !== 'undefined'")

    # Open the music player by calling the function directly
    page.evaluate("MusicApp.toggle()")

    # Wait for the music window to be visible
    music_window = page.locator("#music-window")
    expect(music_window).to_be_visible()

    # Add a small delay to allow the iframe to load
    time.sleep(1)

    # Get the music player's iframe
    iframe = page.frame_locator("#music-frame")

    # Upload multiple music files
    iframe.locator('#file-input').set_input_files(
        [
            os.path.abspath('sample1.mp3'),
            os.path.abspath('sample2.mp3')
        ]
    )

    # Wait for the playlist to be populated
    playlist = iframe.locator("#playlist")
    expect(playlist).to_contain_text("sample1.mp3")
    expect(playlist).to_contain_text("sample2.mp3")

    # Take a screenshot
    page.screenshot(path="verification.png")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    run_verification(page)
    browser.close()
