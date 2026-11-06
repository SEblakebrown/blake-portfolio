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

## Original runnable engineering projects

Two new standalone project folders demonstrate software and data engineering skills with real source code. These are included inside the portfolio repository (not separate GitHub repositories).

### Serverless Event API
- Source: [projects/serverless-event-api](projects/serverless-event-api)
- Python AWS Lambda request validation and integer-cent order quote handler
- Standard-library Python unit tests and optional Terraform AWS deployment using the external terraform-aws-lambda module
- IAM-protected Lambda Function URL; review infrastructure plans and AWS costs before any deployment

### DuckDB Analytics Pipeline
- Source: [projects/duckdb-analytics-pipeline](projects/duckdb-analytics-pipeline)
- Locally runnable dbt/DuckDB project with original CSV seeds, staging models, revenue mart, relationships and value tests
- Interactive browser explorer showing calculated revenue for different order statuses

[Try both interactive demos](engineering-demos.html). The web previews implement sample computation directly in browser JavaScript and do **not** execute the Python Lambda handler, Terraform, dbt, or DuckDB. Run the backend examples using their respective README instructions.

The original [terraform-aws-lambda](https://github.com/terraform-aws-modules/terraform-aws-lambda) module and [dbt Jaffle Shop DuckDB](https://github.com/dbt-labs/jaffle_shop_duckdb) learning project are credited as dependency and inspiration, respectively. No upstream ownership or contribution is claimed.

## Cinematic swarm homepage redesign

The feature branch `feature/cinematic-swarm-liquid-glass` adds an animated, **simulated** portfolio-construction sequence on the existing homepage while keeping the actual portfolio as semantic HTML.

- `styles/liquid-swarm.css`: dark liquid-glass overrides, SVG circuit background, cinematic workspace and agent styling
- `scripts/swarm-intro.js`: ten deterministic agent cursors, dynamic panels populated from existing page content, camera interpolation, user controls, replay, responsive zoom, and an automatic exit fail-safe
- `index.html`: intro stage and shared circuit backdrop; links to original engineering demos and standalone agent swarm remain intact
- `tests/smoke-portfolio.cjs`: static checks for critical controls, links, reduced-motion and the fallback; GitHub Actions runs the checks on pull requests

**Important:** The swarm construction is a visual portfolio demonstration, not a real AI multi-agent build. It does not run commands, modify files, make API calls, or perform tests. The underlying resume, skills, project and contact sections are real and remain accessible after the transition.

The intro runs for approximately 11.2 seconds, with a Skip intro control, Escape support, pause/resume, a Replay build button, and an immediate skip for users who prefer reduced motion or open a deep link. Its stylesheet includes a 15-second safety fallback to uncover the portfolio if initialization fails.

### Local preview

```bash
python3 -m http.server 8000
# Open http://localhost:8000/
```

### Static checks

```bash
node --check scripts/main.js
node --check scripts/swarm-intro.js
node tests/smoke-portfolio.cjs
```

Browser-based visual and interaction QA remains necessary before merging.

## Experimental real Ollama agents (local only)

The cinematic homepage and public `swarm.html` remain visual simulations.
A separate [Real Agent Workshop](agent-workshop.html) can connect to a **local Python server** that calls your own running Ollama model. The three actual model-backed roles are NOVA (plan), CODEX (generate HTML/CSS), and REVIEW (critique). The interface polls real model-generated progress events. Other swarm agent roles on the public site remain animated demonstrations.

### Start on your computer

1. Install and start [Ollama](https://ollama.com/), then download a model, for example `ollama pull llama3.2`.
2. From the repository root, run `python local-agents/server.py`.
3. Open **http://127.0.0.1:8765/** in the browser (not the GitHub Pages URL).
4. Enter a component request, click **Start real agents**, inspect the generated code and review, then **Approve and save draft** or **Reject draft**.

No API key or paid inference service is required for local Ollama. Performance and available models depend on your hardware. The server runs on loopback only, requires a per-process request token, and does not expose an internet-facing endpoint. It does not run shell commands, deploy to AWS, or push to GitHub. Generated content is shown in a script-disabled sandboxed iframe. Only explicit approval saves a generated standalone HTML snippet to `agent-output/`. This does not replace the homepage; review and integrate manually before publishing.

Do **not** expose this local development server to the public internet. GitHub Pages cannot host its Python backend. Production autonomous agents would require authenticated server-side hosting, a job/event service, strict scopes, audits, quotas, and a separate PR-based code review/publishing workflow.

### Important accuracy boundary

These are **real local LLM calls**, not ten independent autonomous code agents continuously reconstructing the site for every visitor. Public animations are still simulations, and the local workshop generates preview components rather than directly editing or rebuilding the existing portfolio.

## React/CSS Modules swarm block builder

The `swarm-react/` directory is the source of the redesigned [Swarm Lab](swarm.html). This is a **visual construction simulation**, not an autonomous agent coding service.

It uses React and CSS modules for the authoring system and **build-time server rendering** for the published `swarm.html`. GitHub Pages only serves the prebuilt HTML, JS, and CSS; it does not run React on a server. Every finished component is present in the HTML as a `data-block` with a `.fill` child. Only browsers with JavaScript and no reduced-motion preference hide blocks for staged construction. With scripting disabled or reduced motion enabled, the finished page is readable immediately.

Features:
- 25 real markup blocks across six sections; progressive `empty → mark → rough → done` state transitions
- Dashed live W × H marquee, outline handles, skeleton, JSX tooltip, final glow and blur resolve
- Twelve named SVG cursors in three brand colors, moved using a single animation-frame loop
- Assigned agent or round-robin scheduling, up to four active cursors per section, idle flocking
- Headline typing in an absolutely positioned overlay over the unchanged underlying heading box
- Timestamped fixed activity feed, automatic section scrolling, and viewport-only handover after deliberate wheel/touch/keyboard input (disabled by `?play`)
- Skip and Rebuild controls; abortable listeners and animation teardown

### Build

```bash
cd swarm-react
npm install
npm run build
```

Build outputs are committed to the repository as `swarm.html`, `assets/swarm-react.js`, and `assets/swarm-react.css`. A GitHub Actions workflow builds them on the feature branch and runs Playwright browser tests before updating generated artifacts.

### Testing

```bash
cd swarm-react
npx playwright install chromium
npm run test:e2e
```

The browser test suite verifies SSR markup, cursor count, skip, rebuild, no-script, reduced-motion and scroll handover. Actual outcome should be verified in GitHub Actions before merging.

The separate `agent-workshop.html` + local Ollama backend remains available for **real LLM code generation**, subject to manual approval. It is not connected to the public animated swarm.
