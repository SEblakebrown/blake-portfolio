
/**
 * Portfolio construction visualization — deliberately simulated.
 * It reads real section titles from the existing page, but does not execute
 * GitHub, file-system, terminal, web or AI-agent operations.
 */
(() => {
  "use strict";
  const overlay = document.getElementById("cine-intro");
  const stage = document.getElementById("cine-stage");
  const viewport = document.getElementById("cine-viewport");
  const identity = document.getElementById("cine-identity");
  const message = document.getElementById("cine-message");
  const meter = document.getElementById("cine-meter");
  const replay = document.getElementById("intro-replay");
  if (!overlay || !stage || !viewport || !identity || !message || !meter) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sectionData = [
    {title:"HERO / IDENTITY", selector:"#hero-title", sub:".hero .intro", color:"#88dfff", x:68,y:128},
    {title:"WORK / PROJECTS", selector:"#work h2", sub:".work .section-heading p", color:"#b49dff", x:519,y:128},
    {title:"ENGINEERING LAB", selector:"#open-source-title", sub:".open-source .section-heading p", color:"#91efd2", x:967,y:128},
    {title:"EXPERIENCE / HISTORY", selector:"#experience h2", sub:".experience-intro p", color:"#f5c78e", x:68,y:460},
    {title:"SKILLS / TOOLKIT", selector:"#skills h2", sub:".skill-group p", color:"#ff9fbd", x:519,y:460},
    {title:"CONTACT / NEXT", selector:"#contact h2", sub:".contact-content p:not(.eyebrow)", color:"#90c9f8", x:967,y:460}
  ];
  const agents = [
    ["NOVA","#bae7ff",420,70],["CODEX","#afa7ff",570,90],["RESEARCH","#ffc887",820,70],
    ["BUILDER","#86eacd",280,185],["DEBUG","#f79ab6",1060,80],["REVIEW","#d9b7ff",930,350],
    ["SYSTEM","#89bdfc",180,705],["MEMORY","#f6dc8e",760,680],["GITHUB","#c5d8f3",1160,735],
    ["TESTER","#96eab0",530,710]
  ];
  const events = [
    {at:1800, panel:0, agent:0, note:"NOVA → BUILDER: Initialize portfolio canvas", px:120,py:155},
    {at:2650, panel:0, agent:3, note:"BUILDER: Constructing hero structure", px:190,py:205},
    {at:3450, panel:0, agent:1, note:"CODEX: Writing hero markup (simulation)", px:265,py:284},
    {at:4250, panel:1, agent:2, note:"RESEARCH → CODEX: Project labels prepared", px:600,py:220},
    {at:5100, panel:2, agent:8, note:"GITHUB: Displaying engineering lab links", px:1050,py:225},
    {at:6000, panel:3, agent:7, note:"MEMORY: Assembling experience timeline", px:170,py:555},
    {at:6850, panel:4, agent:6, note:"SYSTEM: Connecting skills and services", px:605,py:558},
    {at:7600, panel:4, agent:4, note:"DEBUG: Inspecting sample UI state", px:655,py:595},
    {at:8250, panel:5, agent:9, note:"TESTER: Example layout checks shown", px:1090,py:568},
    {at:9000, panel:5, agent:5, note:"REVIEW → NOVA: Visual assembly ready", px:1180,py:604},
    {at:9720, panel:-1,agent:0,note:"NOVA: Portfolio visualization complete",px:710,py:335}
  ];
  const MAX=11200;
  const screen = () => ({w:window.innerWidth,h:window.innerHeight});
  let frame=0,startedAt=0,elapsed=0,paused=false,completed=false,activeEvents=0;
  const sprites=[],panels=[];
  const motion = agents.map((a,i)=>({x:a[2],y:a[3],fromX:a[2],fromY:a[3],toX:a[2],toY:a[3],began:0,length:700,offset:i*13}));
  const cam = {x:700,y:400,s:0.7};
  const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
  const ease=t=>1-Math.pow(1-clamp(t,0,1),3);
  const safeText=(sel,fallback)=>document.querySelector(sel)?.textContent?.replace(/\s+/g," ").trim().slice(0,112)||fallback;
  const make=(tag,cls,txt)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el;};

  // The actual DOM supplies the content shown during simulated construction.
  const snippets=sectionData.map((d,i)=>({
    ...d, heading:safeText(d.selector,["Good ideas. Reliable systems.","Selected work","Engineering Lab","Experience","Skills","Let's build something useful."][i]),
    summary:safeText(d.sub,["Software and cloud engineering.","Cloud and software projects.","Interactive coding demonstrations.","DevOps and data engineering.","Python, AWS, SQL and automation.","Contact and portfolio links."][i])
  }));
  snippets.forEach((p,i)=>{
    const win=make("section","cine-window");
    win.style.left=p.x+"px";win.style.top=p.y+"px";
    const head=make("header");
    const dots=make("span","cine-dots");
    for(let j=0;j<3;j++)dots.append(make("i"));
    head.append(dots,make("span","",p.title));win.append(head);
    const body=make("div","cine-winbody");
    const title=make("strong","",p.heading);
    const desc=make("p","",p.summary);
    const tags=make("div","cine-pills");
    const tokens=[
      ["Software","Cloud","Automation"],
      ["AWS","Terraform","Data"],
      ["Lambda","dbt","DuckDB"],
      ["Spectrum","Omega","CSU"],
      ["Python","SQL","Docker"],
      ["GitHub","Resume","Contact"]
    ];
    tokens[i].forEach(t=>tags.append(make("span","",t)));
    body.append(title,desc,tags);win.append(body);
    stage.append(win);panels.push({el:win,title,full:p.heading});
  });
  agents.forEach((a,i)=>{
    const sprite=make("div","cine-agent");
    sprite.style.setProperty("--agent",a[1]);
    sprite.append(make("div","cine-pointer"),make("span","cine-agent-name",a[0]));
    stage.append(sprite);sprites.push(sprite);
  });

  function fit(){
    const {w,h}=screen();
    return Math.min((w-40)/1400,(h-65)/800,1);
  }
  function cameraFor(x,y,focus){
    const {w,h}=screen();
    const base=fit(),scale=focus?(w<700?Math.max(base*1.14,.7):base*1.14):base;
    return {x:w/2-x*scale,y:h/2-y*scale,s:scale};
  }
  function renderCamera(ms){
    const montage=clamp((ms-1850)/8150,0,1);
    let targetX=700,targetY=400,focus=false;
    if(montage>0&&montage<.88){
      const focusIndex=clamp(Math.floor(montage*10),0,events.length-1);
      const e=events[focusIndex];
      targetX=e.px;targetY=e.py;focus=true;
    }
    // Ease the camera toward the current subject; all motion stays continuous.
    const target=cameraFor(targetX,targetY,focus);
    const amount=0.055;
    cam.x+=(target.x-cam.x)*amount;cam.y+=(target.y-cam.y)*amount;cam.s+=(target.s-cam.s)*amount;
    stage.style.transform="translate3d("+cam.x.toFixed(2)+"px,"+cam.y.toFixed(2)+"px,0) scale("+cam.s.toFixed(4)+")";
  }
  function moveAgent(i,x,y,at){
    const a=motion[i];
    // Start from its evaluated current position, never teleport.
    a.fromX=a.x;a.fromY=a.y;a.toX=x;a.toY=y;a.began=at;a.length=860;
  }
  function renderAgents(ms){
    motion.forEach((a,i)=>{
      const t=ease((ms-a.began)/a.length);
      const bend=Math.sin(Math.PI*t)*Math.sin(i*2.5)*33;
      a.x=a.fromX+(a.toX-a.fromX)*t+bend;
      a.y=a.fromY+(a.toY-a.fromY)*t+Math.sin(Math.PI*t)*17;
      sprites[i].style.transform="translate3d("+a.x.toFixed(1)+"px,"+a.y.toFixed(1)+"px,0)";
    });
  }
  function runEvent(e,at){
    if(e.panel>=0){
      panels[e.panel].el.classList.add("built");
      // One panel is actually reused and enhanced by multiple agents.
      if(e.panel===0 && e.agent===1){
        const line=panels[0].title,full=panels[0].full;
        line.textContent="";
        let count=0;
        const type=()=>{
          if(completed||paused||!overlay.classList.contains("is-ready"))return;
          count=Math.min(full.length,count+2);line.textContent=full.slice(0,count);
          if(count<full.length)window.setTimeout(type,40);
        };
        type();
      }
    }
    message.textContent=e.note+" · simulated";
    moveAgent(e.agent,e.px,e.py,at);
    if(e.agent!==0)moveAgent(0,e.px+90,e.py-45,at);
  }
  function reset(){
    completed=false;paused=false;elapsed=0;activeEvents=0;startedAt=0;
    panels.forEach(p=>{p.el.classList.remove("built");p.title.textContent=p.full;});
    motion.forEach((m,i)=>{m.x=m.fromX=m.toX=agents[i][2];m.y=m.fromY=m.toY=agents[i][3];m.began=0;});
    cam.x=screen().w/2-700*fit();cam.y=screen().h/2-400*fit();cam.s=fit();
    identity.classList.remove("is-gone");viewport.classList.remove("is-visible");
    overlay.classList.remove("is-ending");overlay.classList.add("is-ready");overlay.hidden=false;
    message.textContent="Preparing visual build sequence";
    meter.style.transform="scaleX(0)";
    document.getElementById("cine-pause")?.setAttribute("aria-pressed","false");
    document.getElementById("cine-pause").textContent="Pause";
  }
  function finish(){
    if(completed)return;
    completed=true;
    cancelAnimationFrame(frame);frame=0;
    overlay.classList.add("is-ending");
    // Actual webpage is already underneath the visual layer.
    window.setTimeout(()=>{if(completed){overlay.hidden=true;overlay.classList.remove("is-ready");}},1050);
  }
  function tick(now){
    if(completed||paused)return;
    if(!startedAt)startedAt=now-elapsed;
    elapsed=Math.min(MAX,now-startedAt);
    if(elapsed>=1500)identity.classList.add("is-gone");
    if(elapsed>=1750)viewport.classList.add("is-visible");
    while(activeEvents<events.length&&elapsed>=events[activeEvents].at){
      runEvent(events[activeEvents],elapsed);
      activeEvents++;
    }
    renderAgents(elapsed);renderCamera(elapsed);
    meter.style.transform="scaleX("+(elapsed/MAX).toFixed(4)+")";
    if(elapsed>=MAX){finish();return;}
    frame=requestAnimationFrame(tick);
  }
  function play(){
    cancelAnimationFrame(frame);
    reset();
    frame=requestAnimationFrame(tick);
  }
  function togglePause(){
    if(completed)return;
    paused=!paused;
    const btn=document.getElementById("cine-pause");
    if(btn){btn.textContent=paused?"Resume":"Pause";btn.setAttribute("aria-pressed",String(paused));}
    if(paused)cancelAnimationFrame(frame);
    else{startedAt=0;frame=requestAnimationFrame(tick);}
  }

  document.getElementById("cine-skip")?.addEventListener("click",finish);
  document.getElementById("cine-pause")?.addEventListener("click",togglePause);
  document.getElementById("cine-reduce")?.addEventListener("click",finish);
  replay?.addEventListener("click",()=>{
    if(reduced.matches){window.alert("The build animation is disabled while Reduce Motion is enabled.");return;}
    window.scrollTo({top:0,behavior:"instant"});play();
  });
  document.querySelector(".skip-link")?.addEventListener("click",finish);
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!overlay.hidden)finish();});
  window.addEventListener("resize",()=>{if(!overlay.hidden){const c=cameraFor(700,400,false);if(elapsed<1900){cam.x=c.x;cam.y=c.y;cam.s=c.s;}}});
  reduced.addEventListener("change",()=>{if(reduced.matches)finish();});
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden&&!completed&&!paused){togglePause();}
  });
  // Fail-safe also applies if a future animation callback is interrupted.
  window.setTimeout(()=>{if(!completed&&!overlay.hidden)finish();},15000);
  if(reduced.matches||(location.hash&&location.hash!=="#home"))finish();
  else play();
})();
