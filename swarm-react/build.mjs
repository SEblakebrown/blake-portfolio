import {build} from "esbuild";
import {createRequire} from "node:module";
import {mkdir,writeFile} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";
const root=dirname(fileURLToPath(import.meta.url));
const out=resolve(root,"..");
const assets=resolve(out,"assets");
await mkdir(assets,{recursive:true});
const shared={
 bundle:true,
 jsx:"automatic",
 loader:{".module.css":"local-css"},
 logLevel:"warning",
};
await build({...shared,entryPoints:[resolve(root,"src/client.jsx")],platform:"browser",format:"esm",
 outfile:resolve(assets,"swarm-react.js"),metafile:false});
const ssrPath=resolve(root,".tmp-server.mjs");
await build({...shared,entryPoints:[resolve(root,"src/ssr.jsx")],platform:"node",format:"esm",
 packages:"external",outfile:ssrPath,write:true});
const {renderPage}=await import(ssrPath+"?build="+Date.now());
const markup=renderPage();
const page=`<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#eaf5ff">\n<script>document.documentElement.dataset.swarmJs="true";</script>
<meta name="description" content="Blake Brown is a software and cloud engineer. Explore projects, experience, and real engineering demos through an animated agent-built portfolio.">
<title>Blake Brown — Software & Cloud Engineer</title>
<link rel="stylesheet" href="assets/swarm-visibility.css?v=2">\n<link rel="stylesheet" href="assets/swarm-react.css?v=portrait-sharp-20261106">
</head><body>
<div id="swarm-root">${markup}</div>
<script type="module" src="assets/swarm-react.js?v=portrait-sharp-20261106"></script>
</body></html>`;
await writeFile(resolve(out,"index.html"),page);
await writeFile(resolve(out,"swarm.html"),page);
console.log("Built server-rendered index.html and swarm.html with React/CSS-module assets.");
