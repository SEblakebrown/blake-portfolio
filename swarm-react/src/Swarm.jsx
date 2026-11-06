import React from "react";
import styles from "./Swarm.module.css";
export const agents=[
 ["LAYOUT","#59a5ee"],["CODEX","#8d7fe6"],["RESEARCH","#31b5aa"],["BUILDER","#59a5ee"],
 ["DEBUG","#8d7fe6"],["REVIEW","#31b5aa"],["SYSTEM","#59a5ee"],["MEMORY","#8d7fe6"],
 ["GITHUB","#31b5aa"],["TESTER","#59a5ee"],["DESIGN","#8d7fe6"],["DEPLOY","#31b5aa"]
];
export const sectionIds=["hero","work","engineering","experience","stack","contact"];
const Block=({id,jsxLine,agent,kind,children,heading})=>
 <div className={styles.block} data-block={id} data-jsx={jsxLine} data-agent={agent||""} data-kind={kind||""} data-heading={heading?"true":"false"} data-phase="empty">
  <div className={styles.fill}>{children}</div>
 </div>;
const Arrow=()=><svg width="19" height="24" viewBox="0 0 19 24" aria-hidden="true"><path d="M1 1L1 20L6.2 15L10 23L13.7 21.5L9.9 14L17.8 13.5Z" fill="currentColor" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/></svg>;
function Swarm(){
 return <div className={styles.page}>
  <div className={styles.opening} id="swarm-opening" aria-label="Blake Brown cinematic introduction" aria-hidden="true">
    <div className={styles.openingGrid} aria-hidden="true"></div>
    <div className={styles.openingGlow} aria-hidden="true"></div>
    <div className={styles.openingContent}>
      <span className={styles.openingKicker}>SOFTWARE · CLOUD · AUTOMATION</span>
      <strong className={styles.openingName}>BLAKE BROWN<span>.</span></strong>
      <p className={styles.openingSubtitle}>Engineering ideas into reality</p>
      <div className={styles.openingLine}><i /></div>
      <span className={styles.openingStatus}>INITIALIZING AGENT WORKSPACE</span>
    </div>
    <button type="button" className={styles.openingSkip} id="swarm-opening-skip">Skip everything ↗</button>
  </div>
  <header className={styles.nav}>
   <a className={styles.brand} href="#hero" aria-label="Blake Brown — Back to top">blake<span>●</span>brown</a>
   <span className={styles.navMiddle}>PORTFOLIO / AGENT-BUILT EXPERIENCE</span>
   <div className={styles.topControls}>
     <button type="button" id="swarm-skip">Skip</button>
     <button type="button" id="swarm-rebuild">Rebuild ↻</button>
     <details className={styles.menu} id="swarm-menu">
       <summary className={styles.menuToggle} aria-label="Open navigation menu"><span className={styles.burgerIcon} aria-hidden="true"><i/><i/><i/></span><span>Menu</span></summary>
       <nav className={styles.menuPanel} aria-label="Portfolio navigation">
         <a href="#hero">Home</a>
         <a href="#work">Projects</a>
         <a href="#engineering">Engineering Lab</a>
         <a href="#experience">Experience</a>
         <a href="#stack">Skills</a>
         <a href="#contact">Contact</a>
         <div className={styles.menuDivider}></div>
         <a href="assets/Blake-Brown-Resume.pdf" download>Download Resume ↓</a>
         <a href="agent-workshop.html">Real AI Workshop ↗</a>
         <a href="engineering-demos.html">Interactive Engineering Demos ↗</a>
         <a href="classic-portfolio.html">Original Portfolio ↗</a>
         <a href="https://github.com/SEblakebrown" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
       </nav>
     </details>
   </div>
  </header>
  <main id="content">
   <section className={styles.hero} id="hero" data-section="hero">
    <div className={styles.inner}>
     <div className={styles.heroGrid}>
      <div className={styles.heroCopy}>
     <Block id="hero-flag" kind="tag" jsxLine={'<Status availability="open" />'} agent="LAYOUT"><p className={styles.eyebrow}><span className={styles.signal}/> SOFTWARE / CLOUD / AUTOMATION</p></Block>
     <Block id="hero-title" kind="title" heading agent="CODEX" jsxLine={'<HeroTitle>Good ideas. Reliable systems.</HeroTitle>'}>
      <h1>Good ideas.<br/><em>Reliable systems.</em></h1>
     </Block>
     <Block id="hero-summary" agent="RESEARCH" jsxLine={'<Introduction role="Cloud Engineer" />'}>
      <p className={styles.lead}>I build useful software, scalable AWS infrastructure, and reliable data pipelines—turning engineering challenges into clear, maintainable systems.</p>
     </Block>
     <Block id="hero-buttons" agent="BUILDER" jsxLine={'<Actions primary="Work" secondary="Resume" />'}>
      <div className={styles.buttons}><a className={styles.primary} href="#work">Explore my work <span>↗</span></a><a href="assets/Blake-Brown-Resume.pdf" download>Download resume ↓</a></div>
     </Block>
      </div>
      <Block id="hero-photo" agent="DESIGN" kind="portrait" jsxLine={'<Portrait name="Blake Brown" />'}>
       <figure className={styles.portraitCard}>
        <img className={styles.portraitImage} src="assets/blake-brown-headshot-hd.webp" width="850" height="850" alt="Blake Brown in a navy suit and tie" decoding="async" fetchPriority="high" />
        <figcaption className={styles.portraitCaption}><span className={styles.portraitEyebrow}>THE PERSON BEHIND THE CODE</span><strong>Blake Brown</strong><span>Software &amp; Cloud Engineer</span></figcaption>
       </figure>
      </Block>
     </div>
     <Block id="hero-orbit" agent="BUILDER" jsxLine={'<SystemDiagram nodes={3} />'}>
       <div className={styles.diagram}><div className={styles.orbitRing}></div><div className={styles.orbitRingSmall}></div><div className={styles.orbitCore}>b<span>.</span></div><span className={styles.orbitA}>AWS</span><span className={styles.orbitB}>CODE</span><span className={styles.orbitC}>DATA</span></div>
     </Block>
    </div>
   </section>
   <section className={styles.section} id="work" data-section="work"><div className={styles.inner}>
    <Block id="work-label" agent="LAYOUT" kind="tag" jsxLine={'<SectionNumber index={1} />'}><p className={styles.eyebrow}>01 / SELECTED WORK</p></Block>
    <Block id="work-heading" heading kind="title" agent="CODEX" jsxLine={'<SectionTitle>Engineering in practice.</SectionTitle>'}><h2>Engineering <em>in practice.</em></h2></Block>
    <div className={styles.cards}>
     <Block id="work-cloud" agent="BUILDER" jsxLine={'<ProjectCard tech="AWS + Terraform" />'}>
      <article className={styles.card}><div className={styles.cardArt}>λ <span>→</span> AWS</div><p className={styles.eyebrow}>CLOUD INFRASTRUCTURE</p><h3>Serverless order quote API</h3><p>Python Lambda handler, IAM-protected endpoint and infrastructure as code.</p><a href="engineering-demos.html#lambda-demo">Explore demo ↗</a></article>
     </Block>
     <Block id="work-data" agent="RESEARCH" jsxLine={'<ProjectCard tech="dbt + DuckDB" />'}>
      <article className={styles.card}><div className={styles.cardArt}>dbt <span>→</span> SQL</div><p className={styles.eyebrow}>DATA ENGINEERING</p><h3>Customer revenue analytics</h3><p>Documented transformations, quality tests and customer-level revenue models.</p><a href="engineering-demos.html#dbt-demo">Explore demo ↗</a></article>
     </Block>
    </div>
   </div></section>
   <section className={styles.section} id="engineering" data-section="engineering"><div className={styles.inner}>
    <Block id="engineering-label" kind="tag" agent="LAYOUT" jsxLine={'<SectionNumber index={2} />'}><p className={styles.eyebrow}>02 / ENGINEERING LAB</p></Block>
    <Block id="engineering-heading" kind="title" heading agent="CODEX" jsxLine={'<SectionTitle>Try the technology.</SectionTitle>'}><h2>Try the <em>technology.</em></h2></Block>
    <div className={styles.cards}>
     <Block id="engineering-lambda" agent="TESTER" jsxLine={'<DemoPreview type="serverless" />'}><article className={styles.card}><p className={styles.eyebrow}>PYTHON · TERRAFORM · IAM</p><h3>Order quote API</h3><p>Validate a request and inspect a calculated response.</p><div className={styles.pillLine}><span>200 OK</span><span>JSON response</span></div><a href="engineering-demos.html#lambda-demo">Run example ↗</a></article></Block>
     <Block id="engineering-dbt" agent="DEBUG" jsxLine={'<DemoPreview type="analytics" />'}><article className={styles.card}><p className={styles.eyebrow}>SQL · DBT · DUCKDB</p><h3>Revenue pipeline</h3><p>Explore data transformation rules and aggregate revenue.</p><div className={styles.pillLine}><span>Models</span><span>Lineage</span><span>Tests</span></div><a href="engineering-demos.html#dbt-demo">Explore metrics ↗</a></article></Block>
    </div>
   </div></section>
   <section className={styles.section} id="experience" data-section="experience"><div className={styles.inner}>
    <Block id="experience-label" kind="tag" agent="MEMORY" jsxLine={'<SectionNumber index={3} />'}><p className={styles.eyebrow}>03 / EXPERIENCE</p></Block>
    <Block id="experience-heading" kind="title" heading agent="CODEX" jsxLine={'<SectionTitle>Real teams. Real systems.</SectionTitle>'}><h2>Real teams. <em>Real systems.</em></h2></Block>
    <Block id="experience-spectrum" agent="MEMORY" jsxLine={'<Experience role="DevOps Engineer" />'}><article className={styles.timeline}><span>2026</span><h3>DevOps Engineer · Spectrum</h3><p>Terraform, AWS infrastructure, GitLab CI/CD, Python automation and dbt workflows.</p></article></Block>
    <Block id="experience-omega" agent="REVIEW" jsxLine={'<Experience role="Data Engineer Intern" />'}><article className={styles.timeline}><span>INTERNSHIP</span><h3>Data Engineer · Omega</h3><p>SQL-based data integration, automation and reporting workflows.</p></article></Block>
   </div></section>
   <section className={styles.section} id="stack" data-section="stack"><div className={styles.inner}>
    <Block id="stack-label" kind="tag" agent="SYSTEM" jsxLine={'<SectionNumber index={4} />'}><p className={styles.eyebrow}>04 / TOOLKIT</p></Block>
    <Block id="stack-heading" kind="title" heading agent="CODEX" jsxLine={'<SectionTitle>Tools that deliver.</SectionTitle>'}><h2>Tools that <em>deliver.</em></h2></Block>
    <div className={styles.cards}>
     <Block id="stack-build" agent="BUILDER" jsxLine={'<SkillGroup category="Build" />'}><article className={styles.card}><h3>Build</h3><p>Python · JavaScript · React · SQL · C++ · Java</p></article></Block>
     <Block id="stack-deploy" agent="DEPLOY" jsxLine={'<SkillGroup category="Deploy" />'}><article className={styles.card}><h3>Deploy</h3><p>AWS · Terraform · Docker · GitLab CI/CD</p></article></Block>
     <Block id="stack-data" agent="RESEARCH" jsxLine={'<SkillGroup category="Data" />'}><article className={styles.card}><h3>Connect</h3><p>dbt · Databricks · Athena · Glue · ETL</p></article></Block>
    </div>
   </div></section>
   <section className={styles.section} id="contact" data-section="contact"><div className={styles.inner}>
    <Block id="contact-label" kind="tag" agent="LAYOUT" jsxLine={'<SectionNumber index={5} />'}><p className={styles.eyebrow}>05 / CONTACT</p></Block>
    <Block id="contact-heading" kind="title" heading agent="CODEX" jsxLine={'<SectionTitle>Let’s build something useful.</SectionTitle>'}><h2>Let's build <em>something useful.</em></h2></Block>
    <Block id="contact-card" agent="GITHUB" jsxLine={'<Contact email="brownblakecs@gmail.com" />'}><div className={styles.contact}><p>Software, cloud and automation opportunities</p><a href="mailto:brownblakecs@gmail.com">brownblakecs@gmail.com ↗</a><a href="https://github.com/SEblakebrown">GitHub ↗</a><a href="assets/Blake-Brown-Resume.pdf" download>Download resume ↓</a></div></Block>
   </div></section>
  </main>
  <div className={styles.log} id="swarm-log" role="log" aria-label="Agent construction activity" aria-live="off"><div className={styles.logTitle}>AGENT ACTIVITY · VISUAL SIMULATION</div><div id="swarm-log-lines"></div></div>
  <div className={styles.cursorLayer} aria-hidden="true" id="swarm-cursors">
   {agents.map(([name,color])=><div key={name} className={styles.cursor} data-cursor={name} style={{"--agent":color}}><Arrow/><span>{name}</span></div>)}
  </div>
  <div className={styles.disclaimer}>Animated design simulation · No code is generated or executed</div>
 </div>;
}
export default Swarm;
