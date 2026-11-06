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
