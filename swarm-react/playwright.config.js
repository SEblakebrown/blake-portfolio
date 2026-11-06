import {defineConfig} from "@playwright/test";
export default defineConfig({
 testDir:"./tests",
 timeout:30000,
 retries:1,
 use:{baseURL:"http://127.0.0.1:8000",browserName:"chromium"},
 webServer:{
  command:"python3 -m http.server 8000 --directory ..",
  url:"http://127.0.0.1:8000/swarm.html",
  reuseExistingServer:false,
  timeout:30000
 }
});
