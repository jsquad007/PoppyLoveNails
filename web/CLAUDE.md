@AGENTS.md

# CLAUDE.md

Behavioral and architectural guidelines for reliable AI-assisted project development.

These guidelines are designed to reduce common LLM mistakes, improve execution reliability, and support scalable agentic workflows.

**Tradeoff:** These guidelines bias toward correctness, clarity, and maintainability over raw speed. For trivial tasks, use judgment.

---

# 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

* State assumptions explicitly
* If uncertainty exists, ask clarifying questions
* If multiple interpretations exist, present them instead of silently choosing one
* If a simpler approach exists, say so
* Push back when requirements introduce unnecessary complexity
* If something is unclear, stop and identify the ambiguity

Reasoning quality matters more than implementation speed.

---

# 2. Simplicity First

**Use the minimum complexity necessary to solve the problem well.**

* No speculative features
* No abstractions for single-use code
* No configurability that was not requested
* No architecture inflation
* No unnecessary frameworks or dependencies
* No defensive engineering for impossible scenarios

If a solution can be:

* 50 lines instead of 200
* one component instead of five
* one service instead of microservices

prefer the simpler option unless requirements justify otherwise.

Ask:

> "Would a strong senior engineer consider this overengineered?"

If yes, simplify.

---

# 3. Surgical Changes

**Change only what is required.**

When modifying existing systems:

* Avoid unrelated refactors
* Avoid formatting churn
* Match existing conventions unless instructed otherwise
* Do not rewrite working systems unnecessarily
* Do not optimize code without evidence of need

If unrelated issues are discovered:

* mention them
* do not silently fix them

Remove only the dead code directly caused by your own changes.

Every changed line should trace directly to the requested outcome.

---

# 4. Goal-Driven Execution

**Define success criteria before implementation.**

Convert requests into verifiable outcomes.

Examples:

* "Fix the bug"
  → reproduce issue → implement fix → verify fix

* "Add validation"
  → create invalid test cases → make tests pass

* "Refactor component"
  → preserve behaviour → verify existing functionality remains intact

For multi-step work, define a concise execution plan:

1. [Task]
   → verify: [validation]

2. [Task]
   → verify: [validation]

3. [Task]
   → verify: [validation]

Strong verification loops reduce ambiguity and unnecessary back-and-forth.

---

# 5. System Architecture

Operate using a separation of concerns between reasoning, orchestration, and execution.

## Layer 1: Directives (What to do)

Human-readable operational instructions.

May include:

* SOPs
* workflows
* requirements
* constraints
* edge cases
* expected outputs

These define intent and process.

---

## Layer 2: Orchestration (Decision making)

This is the reasoning layer.

Responsibilities include:

* interpreting directives
* selecting execution paths
* coordinating tools and workflows
* handling failures
* validating outputs
* requesting clarification when needed

The orchestration layer should focus on intelligent decision-making rather than repetitive operational work.

---

## Layer 3: Execution (Doing the work)

Execution should be deterministic whenever possible.

Possible execution layers include:

* scripts
* APIs
* services
* automation workflows
* CI/CD pipelines
* infrastructure tooling
* compiled programs
* external platforms

Choose the implementation approach best suited to the project.

The goal is reliability and repeatability — not commitment to a specific language or framework.

---

# 6. Prefer Deterministic Systems

**Reasoning is for decisions. Deterministic systems are for repeatable execution.**

For operational or precision-sensitive workflows:

* prefer reusable tooling over repeated manual reasoning
* automate repetitive transformations
* centralize business logic where appropriate
* reduce ambiguity in repeatable processes

LLMs are best used for:

* interpretation
* planning
* orchestration
* exception handling
* communication

Deterministic systems are better for:

* data processing
* validation
* state management
* infrastructure operations
* repeatable workflows
* API interactions

Push repeatable complexity into reliable systems whenever practical.

---

# 7. Reuse Before Creation

Before creating new tooling, workflows, abstractions, or services:

* check whether existing systems already solve the problem
* extend proven execution paths when appropriate
* avoid duplicate logic and parallel systems

Prefer improving reliable systems over creating redundant ones.

---

# 8. Self-Improving Workflow

Treat failures as opportunities to improve the system.

When something breaks:

1. Identify the root cause
2. Fix the issue
3. Verify the solution
4. Improve the underlying workflow or tooling if appropriate
5. Update operational knowledge or documentation with important learnings

Avoid repeatedly solving the same class of problem manually.

System quality should improve over time.

---

# 9. Recommended Project Structure

Example organizational structure:

* `directives/`
  → operational instructions and workflows

* `execution/`
  → deterministic tooling and automation

* `.tmp/`
  → temporary/intermediate artifacts

* `.env/`
  → environment configuration and secrets

Adapt structure to the needs of the project rather than enforcing rigid conventions.

---

# 10. Communication Principles

* Be explicit about uncertainty
* Explain important tradeoffs
* Surface risks early
* Do not pretend confidence where none exists
* Prefer clarity over verbosity
* Prefer directness over performative certainty

When blocked:

* explain why
* explain what information is missing
* explain the best next step

---

# Summary

The system should:

* think carefully before acting
* prefer simplicity over sophistication
* make minimal necessary changes
* define clear verification criteria
* separate reasoning from execution
* prefer deterministic systems for repeatable work
* improve workflows over time
* remain pragmatic and adaptable

The objective is not just producing code.

The objective is building reliable, maintainable, verifiable systems.
