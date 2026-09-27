# AI Guidelines — Hong-Ruei Wu's personal website

**Definition:** "Spec" means a written requirements document in `docs/`, either handed to us or
written by us before any code is generated. `docs/UIUX-SPEC.md` and `docs/UIUX-PAGES.md` are the
spec for the 2026-09-27 UI/UX overhaul and are the reference implementation of this rule.

This is a solo project, so there is no code steward and no PR review. The owner is the only human
in the loop, which makes the acceptance rules in Section 3 the only thing standing between an AI
claim and the repo.

---

# Section 1 - What AI tools we use, and what we use each for

1. **For decisions**, we use Claude Code with `Opus` to make design decisions, write the spec, and
   accept the result — not to write the implementation. Colour values, type scale, file architecture,
   and interaction behaviour are decided once in the spec and encoded in `css/tokens.css`.

2. **For implementation**, we use `Sonnet` subagents to build exactly what the spec says, not to
   redesign anything. An agent that finds the spec unclear reports the ambiguity and its own
   judgement call; it does not silently invent a different design.

3. **For parallel work**, agents run concurrently only when their file sets do not overlap.
   Shared foundations (`tokens.css`, `base.css`, `layout.css`, `site.js`) are written once, accepted,
   and then declared read-only for every later agent.

4. **AI never commits.** No `git add`, no `git commit`, no `git push`, no branch creation, unless the
   owner asks for that specific action in that specific message. The owner decides what enters version
   control and when.

5. **AI never rewrites the owner's own words.** Personal prose — the self-introduction, photo captions,
   anything the owner wrote about themselves — is copied verbatim, typos included. Suspected typos are
   collected into a list and handed back for the owner to decide. AI may only add `alt` text,
   `aria-label`, `meta description`, and section leads that the spec explicitly assigns to it.

6. **AI does not touch out-of-scope directories.** For this repo that means `volleyball/` and any
   file the current task did not name.

7. **We never paste** API keys, passwords, `.env` files, Firebase credentials, or personal data of
   third parties into any AI tool. Note that `volleyball/firebase-init.js` contains live config —
   it stays out of every prompt.

---

# Section 2 - How we document AI interactions

1. **Spec first.** Before any implementation agent is launched, the decision layer exists in writing.
   An agent's prompt points at the spec rather than restating it, so there is one source of truth and
   no drift between parallel agents.

2. **Measured values, not estimated ones.** When one agent produces data a later agent depends on,
   it writes that data to a file. `docs/IMAGE-SIZES.md` exists because the image agent measured every
   output with PIL — the spec's own estimates were wrong (the hero photos turned out to be portrait,
   not landscape, because of EXIF rotation).

3. **Every delivery includes verification output.** An agent reports the actual stdout of the
   acceptance commands, not a summary claiming they passed. "All checks pass" without output is not a
   report.

4. **Judgement calls are declared.** Anything the agent decided that the spec did not cover goes in its
   report, so the decision layer can accept or reverse it.

5. **Findings that were deliberately not fixed are listed**, with the reason. This is how typos in the
   owner's prose, unreferenced legacy images, and pre-existing inconsistencies reach the owner instead
   of being silently "improved" or silently ignored.

---

# Section 3 - How we handle disagreements about AI output quality

1. **Who decides.** The owner has final say. An agent's self-assessment is not acceptance, and neither
   is the decision layer's review — `Opus` re-runs the checks itself rather than trusting the report,
   and the owner still looks at the result before it counts as done.

2. **Evidence required.** Structural claims need a command and its output (`grep`, `node --check`,
   file existence). Visual claims need a human looking at the rendered page. These are different kinds
   of evidence and neither substitutes for the other.

3. **Agents cannot verify what they cannot see.** During this overhaul, three agents were told to
   "check it in a browser". They cannot see rendered output; `open` merely throws a window at the
   owner's screen. Two of them stalled for 600s waiting on it and were killed. Never ask an agent for
   visual verification — ask for structural checks, and route the visual pass to a human or to a real
   browser-automation tool.

4. **When AI says the instruction is wrong, check.** It was right more often than not here: an agent
   caught that the variable-comparison command stripped hyphens and produced false positives, and
   another caught that a broken-image sweep failed under BSD `sed`. Both were defects in the
   instructions, not in the work. Verify the claim, then fix the instruction.

5. **When the spec is wrong, fix the spec first.** If review finds a real defect in an accepted
   foundation (the `.lightbox[hidden]` guard, the `.reveal` no-JS fallback), the spec is amended before
   the fix is dispatched, so later agents build against the corrected version rather than inheriting
   the bug.

6. **Silence is not completion.** An agent that finishes without mentioning part of its instructions
   probably did not do that part. Confirm against the file, not against the report — a TCSSH/TMSSH
   rename was reported as a completed task list while all 15 occurrences were still in place.
