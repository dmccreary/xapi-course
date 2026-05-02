# References: Synthetic Data Generation and AI-Assisted LRS Testing

<<<<<<< HEAD
1. [Synthetic Data](https://en.wikipedia.org/wiki/Synthetic_data) - Wikipedia - Overview of synthetic data generation methods, statistical fidelity criteria, and the privacy-vs-utility trade-offs that motivate LLM-driven xAPI corpus generation.

2. [Load Testing](https://en.wikipedia.org/wiki/Load_testing) - Wikipedia - Background on load-testing methodology, including the distinction between smoke, load, stress, and soak tests — all relevant patterns for stressing an LRS.

3. [Large Language Model](https://en.wikipedia.org/wiki/Large_language_model) - Wikipedia - Background on LLM capabilities, with sections on structured-output generation that map onto using Claude or similar tools to produce valid xAPI statements.

4. The Art of Software Testing (3rd Edition) - Glenford J. Myers, Corey Sandler & Tom Badgett - Wiley - Classic text on test design; the equivalence-class and boundary-value chapters frame what "realistic synthetic data" actually means.

5. Software Performance Engineering - Connie U. Smith & Lloyd G. Williams - Addison-Wesley - Methodology for capacity planning and load characterization; particularly useful for designing the cohort-mix specifications that drive realistic test runs.

6. [k6 Documentation](https://k6.io/docs/) - Grafana Labs - Open-source load-testing tool that scripts xAPI emit traffic in JavaScript; the constant-arrival-rate and ramping-arrival-rate executors map onto common LRS test scenarios.

7. [Locust Documentation](https://docs.locust.io/) - Locust project - Python-based load testing framework with a clean user-modeling abstraction that maps naturally onto learner archetypes.

8. [Faker.js](https://github.com/faker-js/faker) - Faker.js community - Library for generating fake names, emails, and identifiers, useful for the deterministic-pseudonym side of xAPI synthetic data.

9. [JSON Schema](https://json-schema.org/learn/getting-started-step-by-step) - JSON Schema Organization - Schema authoring tutorial — critical for validating LLM-generated statements before they hit the LRS so you don't bake in malformed data.

10. [Anthropic API Documentation](https://docs.claude.com/) - Anthropic - Reference for Claude API capabilities including structured-output generation, tool use, and the patterns most useful for producing schema-conformant xAPI statements at scale.
=======
1. [Synthetic Data](https://en.wikipedia.org/wiki/Synthetic_data) - Wikipedia - Comprehensive overview of synthetic data techniques, distributional fidelity, and the privacy advantages that make synthetic xAPI cohorts a better choice than scrubbed real data for most testing.

2. [Large language model](https://en.wikipedia.org/wiki/Large_language_model) - Wikipedia - The technology behind Claude Code; explains how LLMs convert prompts into structured JSON output and the constraints that govern statement-generation quality.

3. [Load testing](https://en.wikipedia.org/wiki/Load_testing) - Wikipedia - Covers ramp-up profiles, sustained throughput tests, and breakpoint testing — the patterns this chapter applies to LRS endpoints with synthetic statement streams.

4. The Art of Application Performance Testing (2nd Edition) - Ian Molyneaux - O'Reilly Media - Practitioner-focused treatment of load-test design, ramp profiles, and result interpretation that grounds the synthetic-cohort strategy this chapter teaches.

5. Statistical Rethinking (2nd Edition) - Richard McElreath - CRC Press - The statistical foundation for evaluating whether a synthetic learner cohort is "representative" — distribution comparison, posterior predictive checks, and the discipline that prevents synthetic data from quietly lying.

6. [Anthropic API Documentation](https://docs.anthropic.com/) - Anthropic - The reference for the Claude API used throughout this chapter, including prompt-caching, structured tool use for JSON output, and rate-limit considerations for batch generation runs.

7. [Claude Code Documentation](https://docs.claude.com/en/docs/claude-code/overview) - Anthropic - The CLI tool this chapter uses to author synthetic-statement scripts; covers the agent-loop model, tool permissions, and the workflows the synthetic-data examples are built on.

8. [Faker Library](https://faker.readthedocs.io/) - joke2k - The Python library for generating realistic names, emails, and timestamps; commonly used as a deterministic component alongside an LLM that handles the verb/object choices.

9. [Locust Load Testing Tool](https://docs.locust.io/) - Locust Project - Python-based distributed load tester that pairs naturally with synthetic-statement generators for stress-testing an LRS at production scale.

10. [k6 Load Testing](https://k6.io/docs/) - Grafana Labs - JavaScript-scriptable load tester whose statement-generation scripts can share JSON fixtures with the textbook's xAPI client. Excellent for end-to-end load tests of the full pipeline.
>>>>>>> d2ecc9b (iframe updates)
