import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "..", "screenshots");
const BASE_URL = process.env.APP_URL || "http://localhost:5173";

const shots = [
  { name: "home", path: "/", waitFor: "h1" },
  { name: "login", path: "/login", waitFor: "h1" },
  { name: "dashboard", path: "/dashboard", auth: true, waitFor: "text=Wellness Dashboard" },
  { name: "habits", path: "/habits", auth: true, waitFor: "text=Habit Library" },
  { name: "log-entry", path: "/log", auth: true, waitFor: "text=Log a Wellness Entry" },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });

async function login() {
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
  await page.fill("#email", "demo@welltrack.app");
  await page.fill("#password", "demo12345");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/dashboard", { timeout: 20000 });
  await page.waitForSelector("text=Wellness Dashboard", { timeout: 20000 });
}

async function capturePage(shot) {
  await page.goto(`${BASE_URL}${shot.path}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(shot.waitFor, { timeout: 20000 });
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: path.join(OUT_DIR, `${shot.name}.png`),
    fullPage: true,
  });
  console.log(`Saved ${shot.name}.png`);
}

let loggedIn = false;

for (const shot of shots) {
  if (shot.auth && !loggedIn) {
    await login();
    loggedIn = true;
  }

  await capturePage(shot);
}

await browser.close();
