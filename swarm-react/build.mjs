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
<meta name="theme-color" content="#eaf5ff">
<meta name="description" content="Live React agent construction simulation with twelve cursors building real portfolio blocks.">
<title>Agent Swarm Builder · Blake Brown</title>
<link rel="stylesheet" href="assets/swarm-react.css">
</head><body>
<div id="swarm-root">${markup}</div>
<script type="module" src="assets/swarm-react.js"></script>
</body></html>`;
await writeFile(resolve(out,"swarm.html"),page);
console.log("Built server-rendered swarm.html and React/CSS-module assets.");
