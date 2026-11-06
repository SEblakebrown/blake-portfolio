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

test("agents actually move blocks through construction states",async({page})=>{
 const errors=[];
 page.on("pageerror",err=>{errors.push(err.message);console.log("SWARM_PAGE_ERROR",err.stack||err.message);});
 page.on("console",msg=>{if(msg.type()==="error")console.log("SWARM_CONSOLE_ERROR",msg.text());});
 await page.goto("/swarm.html?play");
 await expect(page.locator("[data-cursor]")).toHaveCount(12);
 await page.waitForTimeout(1200);
 console.log("SWARM_RUNTIME_STATE",await page.evaluate(()=>({debug:window.__swarmDebug,phases:[...document.querySelectorAll("[data-block]")].map(e=>e.dataset.phase).slice(0,6),sections:document.querySelectorAll("[data-section]").length,log:document.querySelector("#swarm-log-lines")?.innerText})));
 await expect.poll(async()=>await page.locator('[data-block][data-phase="mark"],[data-block][data-phase="rough"],[data-block][data-phase="typing"],[data-block][data-phase="done"]').count(),{timeout:8000}).toBeGreaterThan(0);
 await expect(page.locator("#swarm-log-lines")).toContainText(/Targeted|Marquee|Outlined|Resolved|Typed/);
 const cursor=page.locator('[data-cursor="CODEX"]');
 await expect.poll(async()=>cursor.evaluate(el=>getComputedStyle(el).transform),{timeout:8000}).not.toBe("none");
 expect(errors).toEqual([]);
 await expect(page.locator("body")).not.toContainText("NOVA");
});
