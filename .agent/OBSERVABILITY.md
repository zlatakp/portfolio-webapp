# Agent Observability & Execution Spec
**Version:** 1.0.0
**Status:** ENFORCED
**Scope:** All autonomous and semi-autonomous tasks.

---

## 1. Pre-Flight Protocol (Grounding)
Before modifying any files or executing complex scripts, you MUST output a **Pre-Flight Block** to the chat. This ensures the "Gravity" of the project is respected.

**Template:**
> **GOAL:** [1-sentence summary of the task]
> **SPEC REFERENCE:** [e.g., Section 8.1 of PROJECT_SPEC.md]
> **STATE:** [Initialized / Resuming / Retrying]
> **PLAN:** [Brief bullet points of intended file changes]

---

## 2. The State Log (Flight Recorder)
You are required to maintain a transaction log at `.agent/state_log.jsonl`. This is a JSON Lines file. For every significant action, append a new line.

### Log Entry Schema:
`{"ts": "ISO8601", "act": "string", "file": "string", "status": "ok|fail", "try": int, "note": "string"}`

### Logging Rules:
1. **Atomic Log:** Append to the log *immediately* after an action (success or failure).
2. **No Overwrites:** Only append (`>>`). This file must preserve the full history of the session.
3. **Internal Audit:** Before retrying a failed command, read the last 5 lines of the log to ensure you aren't repeating a mistake.

---

## 3. Circuit Breakers (Loop Prevention)
To prevent infinite loops and "Token Drift," you must cease operations if these signals occur:

- **The Triple-Fail Rule:** If the same `act` + `file` combination has `status: "fail"` 3 times in the log, **STOP IMMEDIATELY**.
- **The Ghost File Rule:** If you search for the same non-existent file path twice, **STOP**.
- **The Chain Limit:** After 5 autonomous steps without human feedback, you must request a **MANDATORY SYNC**.

---

## 4. Post-Flight Reporting (The Delta)
When a task is finished, or if a Circuit Breaker is triggered, provide a **Delta Report**.

**Template:**
### 🏁 Execution Summary
- **Completed:** [List of files/logic successfully implemented]
- **Incomplete/Skipped:** [Items from the plan that were not reached]
- **Blocked By:** [Errors or missing info that stopped progress]
- **Next Step:** [The single most important task for the user to do next]

---

## 5. System Instructions
- You are **FORBIDDEN** from deleting `.agent/state_log.jsonl`.
- If the log file becomes too large (>500 lines), archive it to `.agent/logs/` and start a new one.
- You must prioritize the rules in this document over "getting the job done fast."