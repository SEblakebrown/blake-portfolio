import {test,expect} from "@playwright/test";

test("unfinished block content remains hidden in travel, marquee, rough and typing",async({page})=>{
 await page.goto("/?play");
 await expect(page.locator("#swarm-opening")).toBeVisible();
 const before=await page.locator('[data-block="hero-photo"] > div').first().evaluate(el=>getComputedStyle(el).visibility);
 expect(before).toBe("hidden");
 await expect(page.locator("#swarm-opening")).toBeHidden({timeout:7500});
 for(let i=0;i<22;i++){
   const statuses=await page.locator("[data-block]").evaluateAll(blocks=>blocks.map(el=>({
     id:el.dataset.block,phase:el.dataset.phase,
     visibility:getComputedStyle(el.firstElementChild).visibility
   })));
   for(const item of statuses){
     if(item.phase!=="done")expect(item.visibility,item.id+" "+item.phase).toBe("hidden");
   }
   await page.waitForTimeout(120);
 }
 await page.locator("#swarm-skip").click();
 await expect(page.locator('[data-block]:not([data-phase="done"])')).toHaveCount(0);
 await expect(page.locator('[data-block="hero-photo"] > div').first()).toBeVisible();
});
test("complete page is visible when JavaScript is disabled",async({browser})=>{
 const context=await browser.newContext({javaScriptEnabled:false});
 const page=await context.newPage();
 await page.goto("http://127.0.0.1:8000/");
 await expect(page.locator('[data-block="hero-photo"] > div').first()).toBeVisible();
 await expect(page.getByRole("heading",{name:/Good ideas/})).toBeVisible();
 await context.close();
});
test("reduced motion still shows all final content",async({browser})=>{
 const context=await browser.newContext({reducedMotion:"reduce"});
 const page=await context.newPage();
 await page.goto("http://127.0.0.1:8000/");
 await expect(page.locator('[data-block="hero-photo"] > div').first()).toBeVisible();
 await context.close();
});
