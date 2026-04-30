---
title: "About This Book"
description: "About xAPI for Intelligent Textbooks — its purpose, audience, design, and the team behind it."
---

# About This Book

## Welcome from Xavi

![Xavi the Octopus waving welcome](./img/mascot/welcome.png){ width="140" align="left"}

Hi, I'm Xavi — your eight-tentacled guide through the wonderfully tangled
world of the Experience API. I love this standard because every interaction
tells a story, and xAPI is how we capture those stories without losing the
plot. Whether you're instrumenting your first quiz or architecting a
multi-tenant LRS pipeline, I'll be alongside you in the margins. Take your
time, try the MicroSims, and remember: the data never lies — but the schema
might. Every interaction tells a story!

<div style="clear: both;"></div>

## Why This Intelligent Textbook

Most software watches what users *click*. xAPI watches what they *learn* —
and that distinction is becoming load-bearing for an entire generation of
educational software. Level 3 intelligent textbooks, adaptive simulations,
AI tutors, and embedded assessments all generate streams of learner
behavior that were lost or trapped inside proprietary systems for the
SCORM era. xAPI is the open standard that finally lets engineers move
those signals across system boundaries without losing fidelity. Yet
practitioners building this infrastructure have, until now, had to stitch
together specs, vendor blog posts, and conference slides to learn how to
do it well.

**Standards momentum (United States, 2023–2026):**

- xAPI was ratified as **IEEE Standard 9274.1.1-2023** in October 2023,
  graduating the specification from a community standard maintained by the
  ADL Initiative into a formal IEEE-recognized standard with global
  citation status[^1]
- The **Advanced Distributed Learning (ADL) Initiative**, originally
  funded by the U.S. Department of Defense, shepherded xAPI from its
  Project Tin Can origins through IEEE standardization as part of the
  federal government's Total Learning Architecture vision for cross-system
  learner data[^2]
- In December 2025, open-source stewardship of xAPI, the xAPI Profile
  Server, conformance test suites, and TLA reference implementations
  transitioned from ADL to a new independent nonprofit, the **Institute
  for Infrastructure and Interoperable Data in Learning (I2IDL)**, based
  in Savage, Maryland. I2IDL announced its inaugural 25+ member
  **Technical Steering Committee** on January 30, 2026, with
  representatives from ADL, Rustici Software, CERT/SEI, the University of
  Florida, and other industry, academic, and government voices. The
  ratified standards continue to live at the IEEE Learning Technology
  Standards Committee; I2IDL maintains the open-source assets the
  community runs on[^6]
- According to the Association for Talent Development's **2024 State of
  the Industry** report, U.S. organizations spent an average of **$1,290
  per employee per year** on training and development — a market large
  enough that even small efficiency gains from better instrumentation are
  meaningful at portfolio scale[^3]

**Worldwide:**

- The **ADL xAPI Adopters Registry** lists hundreds of products,
  platforms, and authoring tools that emit or consume xAPI statements,
  spanning corporate L&D vendors, open-source LRS implementations, and
  K-12 / higher-education content systems[^4]
- IEEE Learning Technology Standards are referenced by curriculum and
  procurement frameworks in dozens of countries, so an IEEE-standardized
  xAPI is now part of the global vocabulary for educational
  interoperability[^1]
- Open-source LRS platforms — including **TRAX, Learning Locker, and
  Ralph** — have made conformant LRS infrastructure available to any
  organization willing to host a Docker container, removing the historic
  cost barrier that limited SCORM-era analytics to large enterprises[^5]

These trends point to a real, durable shift: the next decade of
educational software will be instrumented, queried, and optimized through
xAPI-style activity streams. The engineers who can design verb
vocabularies, run conformant LRS infrastructure, and reason about
bandwidth at classroom scale will be the ones building it.

This book takes a fundamentally different approach to teaching that
material. It is built on a **learning graph of 250 interconnected
concepts** organized into **12 taxonomy categories** — from foundational
specification history through privacy and compliance. Concepts are
introduced in dependency order, so each new idea lands on prerequisites
you have already established. Throughout the book you will find
**interactive MicroSims** — browser-based simulations that let you
manipulate statements, watch traffic move between an Activity Provider
and an LRS, and discover principles through experimentation rather than
memorization. The entire textbook is **open source and free** — no
paywalls, no access codes, no expensive annual editions. The source lives
on [GitHub](https://github.com/dmccreary/xapi-course); pull requests are
welcome.

## How to Use This Book

This textbook is designed for self-paced study. Each chapter builds on
previous material, so reading in order is recommended. The book includes:

- **14 Chapters** covering xAPI fundamentals, the statement model, verb
  vocabulary design, LRS architecture and platforms, instrumentation in
  intelligent textbooks, bandwidth optimization, monitoring and
  observability, AI-assisted synthetic data generation, conformance
  testing, production pipelines, and privacy compliance
- **Interactive MicroSims** embedded in chapters — browser-based
  simulations you can manipulate to explore Actor / Verb / Object
  structure, traffic patterns, and LRS query behavior
- **Annotated References** linking to the xAPI specification, ADL
  documentation, and authoritative learning-standards sources
- **Glossary** with definitions for every key concept introduced in the
  book
- **Learning Graph** visualizing 250 concept dependencies across the 12
  taxonomy categories
- **Search** available from any page using the search bar

The [Learning Graph](learning-graph/index.md) visualizes how concepts
connect across chapters. If you want to explore non-linearly or check
prerequisites for a specific topic, start there. The
[Course Description](course-description.md) lays out the full Bloom's
Taxonomy learning outcomes for each cognitive level.

## About the Author

![](./img/dan-headshot-small.png){ width="150px" align="right"}

Dan McCreary is a semi-retired AI researcher, solution architect, and
educator who has spent more than three decades helping Fortune 100
organizations reason over massive datasets. At Optum he founded the
Generative AI Center of Excellence and led the team that built one of the
world's largest healthcare knowledge graphs — spanning over 25 billion
vertices — to unify member, provider, and patient insights. Dan's deep
background in knowledge representation and systems thinking underpins the
precise learning graphs and intelligent textbook workflows used throughout
this course.

He is the co-author of *Making Sense of NoSQL* (Manning Publications), the
founding chair of the NoSQL Now! conference, and a frequent keynote
speaker on semantic search, ontology strategy, and AI hardware. Beyond
industry, Dan has mentored students as a STEM volunteer since 2014 and
now applies the same rigor to building open educational resources. You
can visit the
[Intelligent Textbooks Case Studies](https://dmccreary.github.io/intelligent-textbooks/case-studies/)
to see over 70 textbooks that Dan has created or co-created with other
authors.

**Selected Credentials**

- B.A. in Physics and Computer Science from Carleton College
- M.S.E.E. from the University of Minnesota
- MBA coursework at the University of St. Thomas
- Patent holder in semantic search and ontology management techniques
- Advocate for large-scale Enterprise Knowledge Graph adoption across
  healthcare and education
- Long-time promoter of accessible, low-cost AI-powered learning
  experiences

## How to Cite This Book

If you reference this textbook in academic work, curriculum proposals,
lesson plans, technical documentation, or other publications, please use
one of the following citation formats.

**APA (7th edition)**

McCreary, D. (2026). *xAPI for Intelligent Textbooks*. https://dmccreary.github.io/xapi-course/

**Chicago (17th edition)**

McCreary, Dan. 2026. *xAPI for Intelligent Textbooks*. https://dmccreary.github.io/xapi-course/.

**MLA (9th edition)**

McCreary, Dan. *xAPI for Intelligent Textbooks*. 2026, dmccreary.github.io/xapi-course/.

**BibTeX**

```bibtex
@book{mccreary2026xapi,
  title     = {xAPI for Intelligent Textbooks},
  author    = {McCreary, Dan},
  year      = {2026},
  url       = {https://dmccreary.github.io/xapi-course/},
  note      = {Interactive intelligent textbook}
}
```

To cite a specific chapter, append the chapter number and title — for
example:

McCreary, D. (2026). Chapter 1: Foundations and Standards. In
*xAPI for Intelligent Textbooks*.
https://dmccreary.github.io/xapi-course/chapters/01-foundations-and-standards/

## License

This work is released under the
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
License (CC BY-NC-SA 4.0)](license.md). You are free to share and adapt
the material for non-commercial purposes as long as you give appropriate
credit and share your adaptations under the same license.

## References

[^1]: IEEE Standards Association. (2023). *IEEE Standard for Learning Technology — JavaScript Object Notation (JSON) Data Model Format and Representational State Transfer (RESTful) Web Service for Learner Experience Data Tracking and Access (IEEE Std 9274.1.1-2023)*. https://standards.ieee.org/ieee/9274.1.1/7321/

[^2]: Advanced Distributed Learning Initiative. (2024). *xAPI Overview*. U.S. Department of Defense. https://adlnet.gov/projects/xapi/

[^3]: Association for Talent Development. (2024). *2024 State of the Industry Report*. ATD Research. https://www.td.org/research-reports/2024-state-of-the-industry

[^4]: Advanced Distributed Learning Initiative. (2024). *xAPI Adopters Registry*. https://adopters.adlnet.gov/

[^5]: ADL Initiative. (2024). *Conformant Learning Record Stores*. https://adlnet.gov/projects/xapi/learning-record-stores/

[^6]: Institute for Infrastructure and Interoperable Data in Learning. (2026). *Announcing the Inaugural I2IDL Technical Steering Committee*. https://www.i2idl.org/news/tsc
