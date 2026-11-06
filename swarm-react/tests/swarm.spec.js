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

test("the homepage plays opening identity before beginning the animated build",async({page})=>{
 const errors=[];
 page.on("pageerror",error=>errors.push(error.message));
 await page.goto("/");
 await expect(page.locator("#swarm-opening")).toBeVisible();
 await expect(page.locator("#swarm-opening")).toContainText("BLAKE BROWN");
 await expect(page.locator("#swarm-log-lines")).toContainText("Opening identity sequence");
 await expect(page.locator("#swarm-opening")).toBeHidden({timeout:7500});
 await expect(page.locator("#swarm-log-lines")).toContainText("starting agent construction");
 await expect.poll(async()=>page.locator('[data-block][data-phase="mark"],[data-block][data-phase="rough"],[data-block][data-phase="done"]').count(),{timeout:7000}).toBeGreaterThan(0);
 expect(errors).toEqual([]);
});

test("Skip during opening completes all blocks and cursors exit below viewport",async({page})=>{
 await page.goto("/");
 await expect(page.locator("#swarm-opening")).toBeVisible();
 await page.locator("#swarm-opening-skip").click();
 await expect(page.locator('[data-block]:not([data-phase="done"])')).toHaveCount(0);
 await expect(page.locator("#swarm-opening")).toBeHidden();
 await expect.poll(async()=>page.locator("#swarm-cursors").evaluate(el=>getComputedStyle(el).opacity),{timeout:5000}).toBe("0");
 await expect(page.locator("#swarm-log-lines")).toContainText("moving agents off screen");
});

test("the homepage hamburger contains every route and closes after selection",async({page})=>{
 await page.goto("/");
 await page.locator("#swarm-opening-skip").click();
 const menu=page.locator("#swarm-menu");
 await expect(menu).not.toHaveAttribute("open");
 await menu.locator("summary").click();
 await expect(menu).toHaveAttribute("open","");
 await expect(menu.getByRole("link",{name:"Experience"})).toBeVisible();
 await expect(menu.getByRole("link",{name:"Download Resume"})).toHaveAttribute("href","assets/Blake-Brown-Resume.pdf");
 await menu.getByRole("link",{name:"Projects"}).click();
 await expect(menu).not.toHaveAttribute("open");
 await expect(page).toHaveURL(/#work$/);
});

test("homepage is fully rendered without JavaScript or with reduced motion",async({browser})=>{
 const noJs=await browser.newContext({javaScriptEnabled:false});
 const page=await noJs.newPage();
 await page.goto("http://127.0.0.1:8000/");
 await expect(page.locator('[data-block]')).toHaveCount(25);
 await expect(page.getByRole("heading",{name:/Good ideas/})).toBeVisible();
 await expect(page.locator("#swarm-opening")).toBeHidden();
 await noJs.close();
 const lowMotion=await browser.newContext({reducedMotion:"reduce"});
 const page2=await lowMotion.newPage();
 await page2.goto("http://127.0.0.1:8000/");
 await expect(page2.locator('[data-block]:not([data-phase="done"])')).toHaveCount(0);
 await expect(page2.locator("#swarm-opening")).toBeHidden();
 await lowMotion.close();
});

test("Rebuild runs after Skip and begins constructing blocks again",async({page})=>{
 await page.goto("/");
 await page.locator("#swarm-opening-skip").click();
 await expect.poll(async()=>page.locator("#swarm-cursors").evaluate(el=>getComputedStyle(el).opacity)).toBe("0");
 await page.locator("#swarm-rebuild").click();
 await expect.poll(async()=>page.locator('[data-block][data-phase="empty"]').count(),{timeout:10000}).toBeGreaterThan(0);
 await expect.poll(async()=>page.locator('[data-block][data-phase="mark"],[data-block][data-phase="rough"],[data-block][data-phase="done"]').count(),{timeout:11000}).toBeGreaterThan(0);
});
