const { chromium } = require("playwright")
const path = require("path")
const fs = require("fs")

const BASE_URL = "http://localhost:3000"
const OUT_DIR = path.join(__dirname, "../public/screenshots")

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

async function capture() {
  const browser = await chromium.launch()

  const authCookie = { name: "uade-eats-auth", value: "1", domain: "localhost", path: "/" }

  const mkCtx = (opts = {}) =>
    browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      ...opts,
    })

  async function shot(ctx, name, url, setup) {
    const page = await ctx.newPage()
    try {
      console.log(`📸 ${name}...`)
      await page.goto(`${BASE_URL}${url}`, { waitUntil: "networkidle" })
      if (setup) await setup(page)
      await page.waitForTimeout(500)
      await page.screenshot({ path: path.join(OUT_DIR, `${name}.png`), fullPage: false })
    } catch (err) {
      console.error(`  ⚠️  ${name} failed: ${err.message.split("\n")[0]}`)
    } finally {
      await page.close()
    }
  }

  // --- Login (no auth) ---
  const publicCtx = await mkCtx()
  await shot(publicCtx, "login", "/login")
  await shot(publicCtx, "register", "/register")
  await publicCtx.close()

  // --- Authenticated pages ---
  const authCtx = await mkCtx()
  await authCtx.addCookies([authCookie])

  await shot(authCtx, "home", "/")
  await shot(authCtx, "store", "/store?id=cafeteria-pepe")

  // Cart: add an item first
  await shot(authCtx, "cart", "/store?id=cafeteria-pepe", async (page) => {
    await page.waitForTimeout(400)
    const addBtn = page.locator("button").filter({ hasText: /agregar/i }).first()
    if (await addBtn.isVisible({ timeout: 3000 }).catch(() => false)) await addBtn.click()
    await page.waitForTimeout(300)
    await page.goto(`${BASE_URL}/cart`, { waitUntil: "networkidle" })
  })

  await shot(authCtx, "orders", "/orders")
  await shot(authCtx, "profile", "/profile")
  await shot(authCtx, "notifications-settings", "/profile/notifications-settings")

  // Filter modal: open via search bar filter icon
  await shot(authCtx, "filters", "/", async (page) => {
    await page.waitForTimeout(400)
    // Try filter icon button (usually an SVG icon button near search)
    const filterIcon = page.locator("[aria-label*='filter' i], [aria-label*='filtro' i], button svg").first()
    // Fallback: click any button containing a funnel/filter icon
    const candidates = await page.locator("button").all()
    for (const btn of candidates) {
      const text = (await btn.textContent()) || ""
      const box = await btn.boundingBox()
      if (box && box.y < 200 && text.trim() === "") {
        // Small icon button near top — likely filter toggle
        await btn.click().catch(() => {})
        await page.waitForTimeout(400)
        break
      }
    }
  })

  await authCtx.close()

  // --- Dark mode (next-themes uses localStorage + class on <html>) ---
  const darkCtx = await mkCtx({ colorScheme: "dark" })
  await darkCtx.addCookies([authCookie])
  const darkPage = await darkCtx.newPage()
  console.log("📸 dark-mode...")
  try {
    await darkPage.goto(`${BASE_URL}/`, { waitUntil: "networkidle" })
    await darkPage.waitForTimeout(300)
    // Apply dark theme via localStorage + html class (next-themes pattern)
    await darkPage.evaluate(() => {
      localStorage.setItem("theme", "dark")
      document.documentElement.classList.remove("light")
      document.documentElement.classList.add("dark")
      document.documentElement.style.colorScheme = "dark"
    })
    await darkPage.waitForTimeout(500)
    await darkPage.screenshot({ path: path.join(OUT_DIR, "dark-mode.png") })
  } catch (err) {
    console.error(`  ⚠️  dark-mode failed: ${err.message.split("\n")[0]}`)
  } finally {
    await darkPage.close()
    await darkCtx.close()
  }

  await browser.close()
  const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith(".png"))
  console.log(`\n✅ ${files.length} screenshots saved to ${OUT_DIR}`)
  console.log(files.map((f) => `   • ${f}`).join("\n"))
}

capture().catch((err) => {
  console.error(err)
  process.exit(1)
})
