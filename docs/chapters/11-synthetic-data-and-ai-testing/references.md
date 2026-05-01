# References: Synthetic Data Generation and AI-Assisted LRS Testing

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
