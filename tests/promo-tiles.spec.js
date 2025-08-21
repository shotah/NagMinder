// tests/promo-tiles.spec.js
import { test } from "@playwright/test";

test.describe("Chrome Store Promotional Tiles", () => {
  test("Generate Small Promo Tile (440x280)", async ({ page }) => {
    // Set viewport to small tile size
    await page.setViewportSize({ width: 440, height: 280 });

    // Create a promotional tile with HTML/CSS
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #ff5555 0%, #ff3333 100%);
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100vh;
            text-align: center;
          }
          .logo {
            font-size: 48px;
            font-weight: bold;
            margin-bottom: 8px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          }
          .tagline {
            font-size: 16px;
            opacity: 0.95;
            margin-bottom: 20px;
            max-width: 350px;
            line-height: 1.4;
          }
          .features {
            font-size: 12px;
            opacity: 0.9;
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .features li {
            margin: 4px 0;
          }
          .features li:before {
            content: "✓ ";
            color: #90EE90;
            font-weight: bold;
          }
          .mock-bar {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            background: rgba(255,85,85,0.9);
            padding: 8px 12px;
            font-size: 11px;
            border-bottom: 1px solid rgba(255,255,255,0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .mock-time {
            font-weight: 600;
          }
          .mock-message {
            flex: 1;
            text-align: center;
            font-style: italic;
          }
          .mock-buttons {
            display: flex;
            gap: 6px;
          }
          .mock-btn {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
          }
        </style>
      </head>
      <body>
        <div class="mock-bar">
          <span class="mock-time">Today: 2h 34m</span>
          <span class="mock-message">Mindful moment: Your time is valuable</span>
          <div class="mock-buttons">
            <span class="mock-btn">Snooze 15m</span>
            <span class="mock-btn">×</span>
          </div>
        </div>
        
        <div class="logo">NagMinder</div>
        <div class="tagline">Mindful Social Media Time Tracking</div>
        <ul class="features">
          <li>Track time across social platforms</li>
          <li>Gentle awareness reminders</li>
          <li>Privacy-focused & customizable</li>
        </ul>
      </body>
      </html>
    `);

    // Wait a moment for rendering
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({
      path: "screenshots/promo-tile-small-440x280.png",
      fullPage: true,
      type: "png",
    });

    console.log(
      "✅ Generated small promo tile: screenshots/promo-tile-small-440x280.png"
    );
  });

  test("Generate Marquee Promo Tile (1400x560)", async ({ page }) => {
    // Set viewport to marquee tile size
    await page.setViewportSize({ width: 1400, height: 560 });

    // Create a larger promotional tile
    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            background: linear-gradient(135deg, #ff5555 0%, #ff3333 50%, #e60000 100%);
            color: white;
            display: flex;
            height: 100vh;
            overflow: hidden;
          }
          .left-panel {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 40px;
          }
          .right-panel {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: rgba(0,0,0,0.1);
            padding: 40px;
            position: relative;
          }
          .logo {
            font-size: 72px;
            font-weight: bold;
            margin-bottom: 16px;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.4);
          }
          .tagline {
            font-size: 24px;
            opacity: 0.95;
            margin-bottom: 24px;
            line-height: 1.4;
            max-width: 500px;
          }
          .subtitle {
            font-size: 16px;
            opacity: 0.8;
            line-height: 1.5;
            max-width: 480px;
          }
          .features-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            max-width: 600px;
          }
          .feature {
            background: rgba(255,255,255,0.1);
            padding: 16px;
            border-radius: 8px;
            text-align: center;
            backdrop-filter: blur(5px);
          }
          .feature-icon {
            font-size: 32px;
            margin-bottom: 8px;
          }
          .feature-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
          }
          .feature-desc {
            font-size: 12px;
            opacity: 0.9;
          }
          .mock-browser {
            background: #f0f0f0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            width: 500px;
            height: 300px;
          }
          .mock-browser-bar {
            background: #e0e0e0;
            padding: 8px 12px;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .mock-dots {
            display: flex;
            gap: 4px;
          }
          .mock-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
          }
          .mock-dot.red { background: #ff5f57; }
          .mock-dot.yellow { background: #ffbd2e; }
          .mock-dot.green { background: #28ca42; }
          .mock-url {
            background: white;
            padding: 4px 12px;
            border-radius: 16px;
            font-size: 12px;
            color: #666;
            margin-left: 12px;
            flex: 1;
          }
          .mock-nag-bar {
            background: #ff5555;
            color: white;
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
          }
          .mock-nag-left {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .mock-nag-title {
            font-weight: bold;
          }
          .mock-nag-time {
            font-weight: 600;
          }
          .mock-nag-message {
            font-style: italic;
            opacity: 0.95;
          }
          .mock-nag-buttons {
            display: flex;
            gap: 8px;
          }
          .mock-nag-btn {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 11px;
          }
          .mock-content {
            padding: 20px;
            background: white;
            color: #333;
            height: 220px;
            overflow: hidden;
          }
          .mock-post {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
          }
          .mock-post-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
          }
          .mock-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: #007bff;
          }
          .mock-username {
            font-weight: 600;
            font-size: 14px;
          }
          .mock-post-text {
            font-size: 13px;
            color: #666;
            line-height: 1.4;
          }
        </style>
      </head>
      <body>
        <div class="left-panel">
          <div class="logo">NagMinder</div>
          <div class="tagline">Take Control of Your Social Media Time</div>
          <div class="subtitle">A mindful approach to digital wellness through gentle awareness and time tracking</div>
        </div>
        
        <div class="right-panel">
          <div class="mock-browser">
            <div class="mock-browser-bar">
              <div class="mock-dots">
                <div class="mock-dot red"></div>
                <div class="mock-dot yellow"></div>
                <div class="mock-dot green"></div>
              </div>
              <div class="mock-url">reddit.com/r/productivity</div>
            </div>
            
            <div class="mock-nag-bar">
              <div class="mock-nag-left">
                <span class="mock-nag-title">NagMinder</span>
                <span class="mock-nag-time">Today: 1h 23m</span>
                <span>•••</span>
              </div>
              <div class="mock-nag-message">Mindful moment: Your time is valuable</div>
              <div class="mock-nag-buttons">
                <span class="mock-nag-btn">Snooze 15m</span>
                <span class="mock-nag-btn">Pause Today</span>
                <span class="mock-nag-btn">×</span>
              </div>
            </div>
            
            <div class="mock-content">
              <div class="mock-post">
                <div class="mock-post-header">
                  <div class="mock-avatar"></div>
                  <span class="mock-username">productivity_guru</span>
                </div>
                <div class="mock-post-text">Just discovered this amazing time tracking extension! Finally aware of how much time I spend scrolling...</div>
              </div>
              <div class="mock-post">
                <div class="mock-post-header">
                  <div class="mock-avatar"></div>
                  <span class="mock-username">focused_student</span>
                </div>
                <div class="mock-post-text">The gentle reminders actually work! No more aggressive blocking, just mindful awareness.</div>
              </div>
            </div>
          </div>
          
          <div class="features-grid" style="margin-top: 20px;">
            <div class="feature">
              <div class="feature-icon">📊</div>
              <div class="feature-title">Time Tracking</div>
              <div class="feature-desc">Daily, weekly, monthly stats</div>
            </div>
            <div class="feature">
              <div class="feature-icon">🔔</div>
              <div class="feature-title">Gentle Reminders</div>
              <div class="feature-desc">Mindful, not aggressive</div>
            </div>
            <div class="feature">
              <div class="feature-icon">🔒</div>
              <div class="feature-title">Privacy First</div>
              <div class="feature-desc">All data stays local</div>
            </div>
            <div class="feature">
              <div class="feature-icon">⚙️</div>
              <div class="feature-title">Customizable</div>
              <div class="feature-desc">Configure sites & settings</div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);

    // Wait a moment for rendering
    await page.waitForTimeout(500);

    // Take screenshot
    await page.screenshot({
      path: "screenshots/promo-tile-marquee-1400x560.png",
      fullPage: true,
      type: "png",
    });

    console.log(
      "✅ Generated marquee promo tile: screenshots/promo-tile-marquee-1400x560.png"
    );
  });
});
