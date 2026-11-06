# Blake Brown — Portfolio

A responsive, dependency-free portfolio for software, cloud, and DevOps opportunities.

## Pages
- `index.html`: recruiter-focused portfolio, professional project summaries, experience, skills, and resume.
- `assets/Blake-Brown-Resume.pdf`: concise resume built from the latest supplied resume.
- `playground.html`: preserved browser games.

## Preview
Serve the repository with any static web server. For example, `python3 -m http.server 8000`, then visit `http://localhost:8000`.

## Design and accessibility
Scroll-triggered section reveals, floating hero illustration, reading progress, responsive layouts, keyboard focus indicators, a skip link, and reduced-motion support. Core content and navigation work without JavaScript. Google Fonts is optional; system fonts are fallbacks. No build step or third-party JavaScript is needed for the main portfolio.

## Content
Professional project descriptions reflect supplied resume material; illustrations are workflow sketches, not production screenshots. Professional code is not published. Employer references and unverified testimonial quotes are excluded from the main page. The older PDF is retained for history.

## Updating
Edit `index.html` for content, `styles/style.css` for presentation, and `scripts/main.js` for animation. Keep resume links synchronized with the PDF in `assets/`.

## Agent Swarm Lab

Open `swarm.html` from the portfolio homepage for an interactive React-based animated agent swarm visualization, featuring:

- Ten color-coded agents and individually tracked cursors.
- Animated workspace creation across editor, browser, terminal, research, design, review, testing, and system windows.
- Pannable and zoomable stage, draggable windows, camera follow, cinematic mode, show-all view, pause/resume, replay, and focus selected agent.
- Agent details, collaboration connectors, and an activity feed.
- Reduced-motion preference and a manual animation-reduction control.

**Simulation disclaimer:** All agent actions, sample code, commands, search results, reviews, test output, and GitHub panel activity are visual demonstrations. The page does not run tests, modify files, execute shell commands, connect to accounts, or orchestrate actual autonomous agents. Logs and example activity are explicitly marked as simulated. The public portfolio page remains dependency-free; the separate swarm experience loads React 19 from esm.sh, so its interactive UI requires internet access.

The lab is designed as a frontend animation showcase, not an AI backend. To connect it to real activity in the future, use a server-side event adapter with explicit user authorization, event provenance, and approval controls.
