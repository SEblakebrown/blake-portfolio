import {test,expect} from "@playwright/test";
test("SSR content exists and Skip resolves every block",async({page})=>{
 await page.goto("/swarm.html");
 await expect(page.locator("[data-block]")).toHaveCount(25);
 await expect(page.locator("[data-cursor]")).toHaveCount(12);
 await page.locator("#swarm-skip").click();
 await expect(page.locator('[data-block]:not([data-phase="done"])')).toHaveCount(0);
 await expect(page.getByText("Good ideas.")).toBeVisible();
});
test("Rebuild reverses and starts again",async({page})=>{
 await page.goto("/swarm.html");
 await page.locator("#swarm-skip").click();
 await page.locator("#swarm-rebuild").click();
 await expect.poll(()=>page.locator('[data-block][data-phase="empty"]').count()).toBeGreaterThan(0);
 await page.locator("#swarm-skip").click();
 await expect(page.locator('[data-block]:not([data-phase="done"])')).toHaveCount(0);
});
test("no scripting still displays server-rendered content",async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});
 const page=await context.newPage();
 await page.goto("http://127.0.0.1:8000/swarm.html");
 await expect(page.locator("[data-block]")).toHaveCount(25);
 await expect(page.locator("h1")).toBeVisible();
 await context.close();
});
test("reduced motion displays the completed page",async({browser})=>{
 const context=await browser.newContext({reducedMotion:"reduce"});
 const page=await context.newPage();
 await page.goto("http://127.0.0.1:8000/swarm.html");
 await expect(page.locator("h1")).toBeVisible();
 await expect(page.locator('[data-block]:not([data-phase="done"])')).toHaveCount(0);
 await context.close();
});
test("manual scrolling hands construction over unless ?play is set",async({page})=>{
 await page.goto("/swarm.html");
 await page.mouse.wheel(0,190);
 await page.mouse.wheel(0,180);
 await expect(page.locator("#swarm-log-lines")).toContainText("Manual navigation detected");
});
