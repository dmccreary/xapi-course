# xAPI for Intelligent Textbooks

[![MkDocs](https://img.shields.io/badge/Made%20with-MkDocs-526CFE?logo=materialformkdocs)](https://www.mkdocs.org/)
[![Material for MkDocs](https://img.shields.io/badge/Material%20for%20MkDocs-526CFE?logo=materialformkdocs)](https://squidfunk.github.io/mkdocs-material/)
[![GitHub Pages](https://img.shields.io/badge/View%20on-GitHub%20Pages-blue?logo=github)](https://dmccreary.github.io/xapi-course/)
[![Claude Code](https://img.shields.io/badge/Built%20with-Claude%20Code-DA7857?logo=anthropic)](https://claude.ai/code)
[![Claude Skills](https://img.shields.io/badge/Uses-Claude%20Skills-DA7857?logo=anthropic)](https://github.com/dmccreary/claude-skills)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![p5.js](https://img.shields.io/badge/p5.js-ED225D?logo=p5.js&logoColor=white)](https://p5js.org/)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

## View the Live Site

Visit the interactive textbook at: [https://dmccreary.github.io/xapi-course/](https://dmccreary.github.io/xapi-course/)

## Overview

This is an interactive, AI-generated intelligent textbook on the xAPI (Experience API) standard, designed for software professionals implementing xAPI in Level 3 intelligent textbooks and learning systems. Built with MkDocs Material, it covers the full arc of xAPI work: from the statement model and verb vocabulary design, through LRS architecture and authentication, to bandwidth optimization, privacy compliance, and production pipeline operations.

The textbook is structured around a learning graph of concepts with explicit dependency sequencing. Every visual element is interactive — 50 MicroSims built with p5.js and vis-network let you manipulate real xAPI constructs, explore LRS architectures, compare authentication schemes, and walk through statement lifecycle flows. This isn't a spec document with screenshots; it's a hands-on workbench.

Whether you're instrumenting your first MicroSim, designing a verb vocabulary, or sizing an LRS deployment for production traffic, this textbook gives you the conceptual grounding and interactive tools to move fast and avoid the footguns that catch most xAPI implementers off guard.

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/dmccreary/xapi-course.git
cd xapi-course
```

### Install Dependencies

```bash
pip install mkdocs mkdocs-material mkdocs-glightbox
```

### Serve Locally

```bash
mkdocs serve
```

Open your browser to `http://localhost:8000/xapi-course/`

### Deploy to GitHub Pages

```bash
mkdocs gh-deploy
```

### Using the Book

- Use the left sidebar to browse chapters and MicroSims
- Each MicroSim runs standalone in the browser — adjust sliders, click nodes, explore flows
- The Learning Graph section maps all concepts and their prerequisites
- The Glossary defines every term used across chapters

## Repository Structure

```
xapi-course/
├── docs/                          # MkDocs documentation source
│   ├── chapters/                  # 14 chapter directories
│   │   ├── 01-foundations-and-standards/
│   │   ├── 02-statement-model/
│   │   └── ...
│   ├── sims/                      # 50 interactive p5.js MicroSims
│   │   ├── xapi-statement-triple/
│   │   ├── lrs-architecture-overview/
│   │   └── ...
│   ├── learning-graph/            # Concept graph data and analysis
│   │   ├── concept-list.md
│   │   ├── concept-taxonomy.md
│   │   └── quality-metrics.md
│   ├── img/mascot/                # Xavi the Octopus mascot poses
│   ├── css/                       # Custom styles
│   ├── glossary.md
│   ├── references.md
│   └── license.md
├── mkdocs.yml                     # MkDocs configuration
└── README.md                      # This file
```

## Reporting Issues

Found a bug, typo, or have a suggestion? Please open an issue:

[GitHub Issues](https://github.com/dmccreary/xapi-course/issues)

When reporting, please include:
- Description of the problem or suggestion
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots (for MicroSim display issues)
- Browser and OS details

## License

This work is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).

**You are free to:**
- Share — copy and redistribute the material
- Adapt — remix, transform, and build upon the material

**Under the following terms:**
- **Attribution** — Give appropriate credit with a link to the original
- **NonCommercial** — No commercial use without permission
- **ShareAlike** — Distribute contributions under the same license

See [license.md](docs/license.md) for full details.

## Acknowledgements

This project is built on the shoulders of giants:

- **[MkDocs](https://www.mkdocs.org/)** — Static site generator optimized for project documentation
- **[Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)** — Beautiful, responsive theme with powerful search
- **[p5.js](https://p5js.org/)** — Creative coding library from NYU ITP, powering the MicroSims
- **[vis-network](https://visjs.org/)** — Network visualization library for learning graphs and architecture diagrams
- **[Claude AI](https://claude.ai)** by Anthropic — AI-assisted content generation and MicroSim authoring
- **[GitHub Pages](https://pages.github.com/)** — Free hosting for open source projects
- **[ADL Initiative](https://adlnet.gov/)** — Stewards of the xAPI specification

Special thanks to the xAPI community, the open-source education technology ecosystem, and every developer who has debugged an LRS response at 2 a.m. so the rest of us don't have to.

## Contact

**Dan McCreary**

- LinkedIn: [linkedin.com/in/danmccreary](https://www.linkedin.com/in/danmccreary/)
- GitHub: [@dmccreary](https://github.com/dmccreary)

Questions, collaboration opportunities, or just want to talk xAPI? Connect on LinkedIn or open an issue on GitHub.
