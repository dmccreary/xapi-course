# References: Synthetic Data Generation and AI-Assisted LRS Testing

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
