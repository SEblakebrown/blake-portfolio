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
