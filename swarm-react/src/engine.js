import styles from "./Swarm.module.css";
import {agents,sectionIds} from "./Swarm.jsx";

const EASE = t => t*t*(3-2*t);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const prefersReduced=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const stamp=()=>new Date().toLocaleTimeString([], {hour12:false,minute:"2-digit",second:"2-digit"});

export function startSwarmEngine(){
 const root=document.getElementById("swarm-root");
 if(!root)return()=>{};
 const sections=sectionIds.map(id=>document.querySelector('[data-section="'+id+'"]')).filter(Boolean);
 const blockSections=sections.map(section=>[...section.querySelectorAll("[data-block]")]);
 const allBlocks=blockSections.flat();
 const sprites=new Map([...document.querySelectorAll("[data-cursor]")].map(el=>[el.dataset.cursor,el]));
 const statuses=new Map(agents.map(([name],i)=>[name,{name,i,x:-120,y:-120,fromX:-120,fromY:-120,toX:-120,toY:-120,started:0,duration:650,assigned:null,bow:0}]));
 const feed=document.getElementById("swarm-log-lines");
 const skip=document.getElementById("swarm-skip"),rebuild=document.getElementById("swarm-rebuild");
 const opening=document.getElementById("swarm-opening");
 const openingSkip=document.getElementById("swarm-opening-skip");
 const cursorLayer=document.getElementById("swarm-cursors");
 const menu=document.getElementById("swarm-menu");
 const introTimers=new Set();
 let introPlaying=false,exiting=false,exitStarted=0;
 const sectionVisible=new Set();
 let raf=0,last=0,generation=0,active=true,paused=false,mode="sequential",current=0,finished=false,rewinding=false,rewindIndex=0,rewindAt=0;
 let wheelCount=0,wheelAt=0,touchY=null;
 const noHandover=new URLSearchParams(location.search).has("play");
 const aborter=new AbortController();
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>entry.isIntersecting?sectionVisible.add(entry.target.id):sectionVisible.delete(entry.target.id));
 },{rootMargin:"-12% 0px -20% 0px",threshold:[0,.12,.3]});
 sections.forEach(s=>observer.observe(s));
 const jobs=allBlocks.map((element,index)=>({
  element,index,section:sections.indexOf(element.closest("[data-section]")),
  phase:"queued",cursor:null,started:0,marquee:null,readout:null,handles:[],typing:null,textNode:null,
  width:0,height:0
 }));
 window.__swarmDebug={sectionCount:sections.length,blockCount:jobs.length,ticks:0,lastError:"",assigned:0};
 function record(name,detail){
  const div=document.createElement("div");
  div.textContent=stamp()+"  "+name+" — "+detail;
  feed?.prepend(div);
  while(feed&&feed.children.length>22)feed.lastElementChild.remove();
 }
 function clearDecor(job){
  job.marquee?.remove();job.readout?.remove();job.typing?.remove();
  job.handles.forEach(el=>el.remove());
  job.marquee=job.readout=job.typing=job.textNode=null;job.handles=[];
  job.element.classList.remove(styles.typing);
 }
 function setPhase(job,phase){
  job.phase=phase;
  job.element.dataset.phase=phase;
 }
 function rectPage(el){
  const r=el.getBoundingClientRect();
  return{x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:r.height};
 }
 function moveTo(cursor,x,y,now,duration=650){
  cursor.fromX=cursor.x;cursor.fromY=cursor.y;
  cursor.toX=x;cursor.toY=y;cursor.started=now;cursor.duration=duration;
  cursor.bow=(cursor.i%2?1:-1)*(18+cursor.i%4*4);
 }
 function positionCursor(cursor,now){
  const t=clamp((now-cursor.started)/Math.max(1,cursor.duration),0,1);
  const k=EASE(t);
  // A small perpendicular bow blends two endpoints without jumps.
  const dx=cursor.toX-cursor.fromX,dy=cursor.toY-cursor.fromY;
  const length=Math.max(1,Math.hypot(dx,dy));
  const offset=Math.sin(Math.PI*k)*cursor.bow;
  cursor.x=cursor.fromX+dx*k-dy/length*offset;
  cursor.y=cursor.fromY+dy*k+dx/length*offset;
  const el=sprites.get(cursor.name);
  if(el)el.style.transform="translate3d("+cursor.x.toFixed(1)+"px,"+cursor.y.toFixed(1)+"px,0)";
 }
 function addMarquee(job){
  const box=document.createElement("div");
  box.className=styles.marquee;
  const label=document.createElement("span");
  label.className=styles.marqueeLabel;
  box.append(label);job.element.append(box);
  job.marquee=box;job.readout=label;
 }
 function addHandles(job){
  for(let i=0;i<4;i++){
   const span=document.createElement("span");span.className=styles.handle+" "+[styles.tl,styles.tr,styles.bl,styles.br][i];
   job.element.append(span);job.handles.push(span);
  }
 }
 function addTyping(job){
  const h=job.element.querySelector("h1,h2");
  if(!h)return false;
  const clone=h.cloneNode(true);
  clone.textContent="";
  clone.className=styles.typedText;
  clone.style.fontFamily=getComputedStyle(h).fontFamily;
  clone.style.fontSize=getComputedStyle(h).fontSize;
  clone.style.fontWeight=getComputedStyle(h).fontWeight;
  clone.style.letterSpacing=getComputedStyle(h).letterSpacing;
  clone.style.lineHeight=getComputedStyle(h).lineHeight;
  const c=document.createElement("span");
  c.className=styles.caret;
  c.style.background=job.cursor?agents.find(a=>a[0]===job.cursor.name)?.[1]:"#398ed3";
  clone.append(c);
  job.element.append(clone);
  job.typing=clone;job.textNode=document.createTextNode("");
  clone.insertBefore(job.textNode,c);
  job.fullText=h.innerText||h.textContent||"";
  job.caret=c;
  return true;
 }
 function startJob(job,cursor,now){
  if(job.phase!=="queued")return;
  const r=rectPage(job.element);
  job.cursor=cursor;cursor.assigned=job;job.started=now;job.width=r.w;job.height=r.h;
  setPhase(job,"travel");moveTo(cursor,r.x,r.y,now,620);
  record(cursor.name,"Targeted "+job.element.dataset.block);
 }
 function updateJob(job,now){
  const elapsed=now-job.started;
  const c=job.cursor,r=rectPage(job.element);
  if(job.phase==="travel"&&elapsed>=650){
   job.started=now;setPhase(job,"mark");addMarquee(job);
   record(c.name,"Marquee "+job.element.dataset.block);
  }
  if(job.phase==="mark"){
   const k=EASE(clamp((now-job.started)/850,0,1));
   job.marquee.style.width=Math.max(1,r.w*k)+"px";
   job.marquee.style.height=Math.max(1,r.h*k)+"px";
   job.readout.textContent=Math.round(r.w*k)+" × "+Math.round(r.h*k);
   c.x=r.x+r.w*k;c.y=r.y+r.h*k;
   c.fromX=c.toX=c.x;c.fromY=c.toY=c.y;c.started=now;c.duration=1;
   if(now-job.started>=850){
    job.marquee.remove();job.marquee=null;job.readout=null;
    addHandles(job);setPhase(job,"rough");job.started=now;
    record(c.name,"Outlined "+job.element.dataset.block+" · "+Math.round(r.w)+" × "+Math.round(r.h));
   }
  }else if(job.phase==="rough"&&elapsed>=740){
   job.handles.forEach(x=>x.remove());job.handles=[];
   if(job.element.dataset.heading==="true"&&addTyping(job)){
    setPhase(job,"typing");job.started=now;record(c.name,"Typing "+job.element.dataset.block);
   }else{
    setPhase(job,"done");record(c.name,"Resolved "+job.element.dataset.block);
    c.assigned=null;job.cursor=null;
   }
  }else if(job.phase==="typing"){
   const total=Math.max(1,job.fullText.length),progress=clamp((now-job.started)/1200,0,1);
   const count=Math.min(total,Math.floor(progress*total));
   job.textNode.textContent=job.fullText.slice(0,count);
   const span=job.caret.getBoundingClientRect();
   c.x=span.left+scrollX;c.y=span.top+scrollY;
   c.fromX=c.toX=c.x;c.fromY=c.toY=c.y;c.started=now;c.duration=1;
   if(progress>=1){
    job.typing.remove();job.typing=job.textNode=null;
    setPhase(job,"done");record(c.name,"Typed "+job.element.dataset.block);
    c.assigned=null;job.cursor=null;
   }
  }
 }
 function schedule(fn,delay){
  const id=window.setTimeout(()=>{introTimers.delete(id);if(active)fn();},delay);
  introTimers.add(id);return id;
 }
 function stopIntro(){
  introTimers.forEach(id=>clearTimeout(id));introTimers.clear();
  introPlaying=false;
  opening?.classList.remove(styles.openingActive,styles.openingExit);
 }
 function beginIntro(){
  if(!opening){reset(false);return;}
  introPlaying=true;
  cursorLayer?.style.setProperty("opacity","0");
  opening.classList.remove(styles.openingExit);
  opening.classList.add(styles.openingActive);
  record("SYSTEM","Opening identity sequence");
  schedule(()=>{
   opening.classList.add(styles.openingExit);
   schedule(()=>{
    stopIntro();
    if(!active||finished)return;
    record("SYSTEM","Identity complete · starting agent construction");
    reset(false);
   },680);
  },2450);
 }
 function finishAll(){
  if(!active)return;
  stopIntro();
  jobs.forEach(job=>{clearDecor(job);setPhase(job,"done");job.cursor=null;});
  finished=true;rewinding=false;
  record("SYSTEM","All blocks complete · moving agents off screen");
  // Do not freeze cursors where Skip was pressed: tween them below the visible
  // viewport and hide the entire cursor layer after the exit completes.
  const now=performance.now();
  exiting=!prefersReduced();
  exitStarted=now;
  statuses.forEach((c,i)=>{
   c.assigned=null;
   moveTo(c,Math.round((i+1)*innerWidth/(statuses.size+1)),scrollY+innerHeight+105,now,780);
  });
  if(cursorLayer)cursorLayer.style.opacity=exiting?"1":"0";
  cancelAnimationFrame(raf);raf=0;
  if(exiting)raf=requestAnimationFrame(frame);
 }
 function sectionEligible(i){
  if(mode==="sequential")return i===current;
  return sectionVisible.has(sections[i]?.id);
 }
 function assign(now){
  for(let i=0;i<sections.length;i++){
   if(!sectionEligible(i))continue;
   const queued=jobs.filter(j=>j.section===i&&j.phase==="queued");
   const running=jobs.filter(j=>j.section===i&&j.cursor);
   let capacity=4-running.length;
   for(const job of queued){
    if(capacity<=0)break;
    const name=job.element.dataset.agent;
    let free;
    if(name)free=statuses.get(name);
    if(free?.assigned)continue;
    if(!free){
      free=[...statuses.values()].find(c=>!c.assigned);
    }
    if(!free)break;
    startJob(job,free,now);capacity--;
   }
  }
 }
 function guideScroll(){
  if(mode!=="sequential"||finished||rewinding)return;
  const working=jobs.filter(j=>j.section===current&&j.cursor);
  if(!working.length)return;
  const boxes=working.map(j=>j.element.getBoundingClientRect());
  const minTop=Math.min(...boxes.map(r=>r.top)),maxBottom=Math.max(...boxes.map(r=>r.bottom));
  const safeTop=95,safeBottom=innerHeight-145;
  if(maxBottom>safeBottom&&minTop>safeTop){
   const correction=Math.min(maxBottom-safeBottom,minTop-safeTop);
   window.scrollBy({top:clamp(correction,0,110),behavior:"smooth"});
  }
 }
 function nextSequential(){
  if(mode!=="sequential"||rewinding)return;
  const sectionJobs=jobs.filter(j=>j.section===current);
  if(sectionJobs.length&&sectionJobs.every(j=>j.phase==="done")){
   current++;
   if(current>=sections.length){finishAll();return;}
   sections[current]?.scrollIntoView({behavior:"smooth",block:"start"});
   record("SYSTEM","Beginning "+sections[current].id+" while camera scrolls");
  }
 }
 function idleFlock(cursor,now){
  if(cursor.assigned)return;
  const section=sections[mode==="sequential"?Math.min(current,sections.length-1):Math.max(0,sections.findIndex(s=>sectionVisible.has(s.id)))];
  if(!section)return;
  const r=rectPage(section);
  const angle=now/2300+cursor.i*2.4;
  const radius=75+(cursor.i%5)*27;
  const goalX=r.x+r.w/2+Math.cos(angle)*radius;
  const goalY=r.y+Math.min(250,r.h/2)+Math.sin(angle)*radius*.55;
  cursor.x+=(goalX-cursor.x)*.022;cursor.y+=(goalY-cursor.y)*.022;
  const el=sprites.get(cursor.name);
  if(el)el.style.transform="translate3d("+cursor.x.toFixed(1)+"px,"+cursor.y.toFixed(1)+"px,0)";
 }
 function updateRewind(now){
  if(now-rewindAt<140)return;
  rewindAt=now;
  if(rewindIndex<0){
   rewinding=false;current=0;mode="sequential";
   jobs.forEach(j=>{j.phase="queued";j.cursor=null;j.element.dataset.phase="empty";});
   window.scrollTo({top:0,behavior:"smooth"});
   record("SYSTEM","Rebuild initialized");
   return;
  }
  const job=jobs[rewindIndex];
  clearDecor(job);
  setPhase(job,job.phase==="done"?"rough":"empty");
  if(job.phase==="empty")rewindIndex--;
 }
 function frame(now){
  if(!active)return;
  if(introPlaying){raf=requestAnimationFrame(frame);return;}
  if(exiting){
    statuses.forEach(c=>positionCursor(c,now));
    if(now-exitStarted>=800){
      exiting=false;
      if(cursorLayer)cursorLayer.style.opacity="0";
      raf=0;return;
    }
    raf=requestAnimationFrame(frame);return;
  }
  window.__swarmDebug.ticks++;
  window.__swarmDebug.assigned=jobs.filter(j=>j.cursor).length;
  if(rewinding)updateRewind(now);
  else if(!finished){
   assign(now);
   jobs.filter(j=>j.cursor).forEach(j=>updateJob(j,now));
   nextSequential();
   if(now-last>220){guideScroll();last=now;}
  }
  statuses.forEach(c=>c.assigned?positionCursor(c,now):idleFlock(c,now));
  raf=requestAnimationFrame(frame);
 }
 function stop(){
  active=false;stopIntro();cancelAnimationFrame(raf);aborter.abort();observer.disconnect();
  jobs.forEach(clearDecor);
 }
 function reset(rewind){
  // A single animation-frame loop owns all cursors and gets cancelled on reset.
  stopIntro();
  cancelAnimationFrame(raf);raf=0;generation++;
  exiting=false;
  if(cursorLayer)cursorLayer.style.opacity="1";
  finished=false;current=0;mode="sequential";
  statuses.forEach(c=>{c.assigned=null;});
  if(rewind){
   rewinding=true;rewindIndex=jobs.length-1;rewindAt=0;
   record("SYSTEM","Rewinding blocks from bottom to top");
  }else{
   rewinding=false;
   jobs.forEach(j=>{clearDecor(j);j.phase="queued";j.element.dataset.phase="empty";j.cursor=null;j.started=0;});
  }
  raf=requestAnimationFrame(frame);
 }
 function handover(){
  if(noHandover||mode==="viewport"||finished||rewinding)return;
  mode="viewport";record("SYSTEM","Manual navigation detected · building visible sections only");
 }
 const listen={signal:aborter.signal,passive:true};
 window.addEventListener("wheel",e=>{
  if(Math.abs(e.deltaY)<8)return;
  const now=performance.now();
  wheelCount=now-wheelAt<500?wheelCount+1:1;wheelAt=now;
  if(wheelCount>=2)handover();
 },listen);
 window.addEventListener("touchstart",e=>{touchY=e.touches[0]?.clientY??null;},listen);
 window.addEventListener("touchmove",e=>{if(touchY!==null&&Math.abs(e.touches[0].clientY-touchY)>=60)handover();},listen);
 window.addEventListener("keydown",e=>{if(["ArrowUp","ArrowDown","PageUp","PageDown","Home","End"," "].includes(e.key))handover();},{signal:aborter.signal});
 skip?.addEventListener("click",finishAll,{signal:aborter.signal});
 openingSkip?.addEventListener("click",finishAll,{signal:aborter.signal});
 menu?.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener("click",()=>{menu.open=false;},{signal:aborter.signal}));
 window.addEventListener("keydown",e=>{if(e.key==="Escape"&&menu?.open)menu.open=false;},{signal:aborter.signal});
 rebuild?.addEventListener("click",()=>reset(true),{signal:aborter.signal});
 if(prefersReduced()||location.hash&&sectionIds.includes(location.hash.slice(1))){
  stopIntro();
  jobs.forEach(j=>setPhase(j,"done"));
  if(cursorLayer)cursorLayer.style.opacity="0";
  finished=true;
 }else{
  window.scrollTo({top:0,behavior:"instant"});
  beginIntro();
 }
 return stop;
}
