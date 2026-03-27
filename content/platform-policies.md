---
title: "Platform Content Policies: Twitter and LinkedIn"
description: "Content policies for Twitter/X and LinkedIn at Transient Labs: tone archetypes, length limits, hook styles, and scoring targets for each platform."
keywords:
  - content policies
  - social media content strategy
  - Twitter content guidelines
  - LinkedIn content guidelines
author: "Transient Labs"
date: "2026-02-21"
type: "article"
---

# Platform Content Policies

This document defines content policies for each distribution platform used by Transient Labs. It covers tone archetypes, character limits, hook styles, and quality scoring targets. Use this as the reference whenever writing or reviewing platform-specific content.

For context on the broader content pipeline, see our [AI MVP content strategy](/blog/how-we-ship-ai-mvps-in-3-weeks) and [AI agency content approach](/blog/ai-agency-for-startups).

---

## Twitter/X (Warrior Energy)

**Archetype:** WARRIOR - Ship fast, decide now
**Max length:** 280 chars (ideal: <180)
**Hook style:** Number + action, no hedging
**Tone:** Direct, decisive, provocative

Twitter/X rewards brevity and specificity. Every post competes with hundreds of others in a fast-moving feed. The goal is to stop the scroll with a provocative truth or concrete number, then deliver value in the fewest possible words.

**What works:**
- Short, punchy statements
- Hot takes with specifics
- "Here's what we use" stacks
- Contrarian + number combo
- Action-oriented CTAs

**What fails:**
- "I learned..." framing (too soft)
- Long explanations
- Hedging language
- Generic insights

**Example hook:**
```
60% of agent failures = one bug.

Not the model. Not the prompt.

OAuth token refresh.

Fix your auth. Ship faster.
```

The best Twitter content from technical accounts is either extremely specific (a number, a finding, a tool) or sharply contrarian (a common belief that's wrong). Avoid the middle ground — balanced, nuanced content performs poorly on the platform.

---

## LinkedIn (Sage Energy)

**Archetype:** SAGE - Reflect, synthesize, share wisdom
**Max length:** 3000 chars (ideal: 300-600)
**Hook style:** "After X...", pattern recognition
**Tone:** Thoughtful, data-backed, professional

LinkedIn rewards depth and professional credibility. Posts that share real data from real experience outperform generic takes. The audience is looking for actionable frameworks and validated patterns, not opinions without evidence.

**What works:**
- "After debugging/shipping/building X..."
- Failure distributions with percentages
- Insight → implication → recommendation
- Technical depth with business framing
- Structured lists/breakdowns

**What fails:**
- Pure hot takes (feels unprofessional)
- Too short (no substance)
- Generic advice
- Missing the "so what"

**Example hook:**
```
After debugging 47 production agent failures, one pattern emerged.

It's rarely the model.

The failure distribution we found:
• 60% - Auth/token expiration
• 25% - Rate limiting cascades
• 10% - Context window overflow
• 5% - Actual model issues

The boring work is the important work.
```

The LinkedIn audience skews toward decision-makers and practitioners. Posts that bridge technical reality with business impact consistently outperform purely technical posts. Always answer "so what does this mean for my team?"

---

## Content Scoring Targets

Each piece of content is scored on three dimensions before publishing: hook quality, signal density, and virality potential. Minimum grades are enforced per platform.

| Platform | Hook | Signal | Virality | Min Grade |
|----------|------|--------|----------|-----------|
| Twitter | 50+ | 60+ | 20+ | C |
| LinkedIn | 75+ | 100 | 20+ | B |

Content that does not meet minimum grade is returned for revision before scheduling.

---

## Buffer Channel IDs

Use these IDs when scheduling content via the Buffer integration:

- **Twitter:** `638a53af8a2a0f4b456a4636`
- **LinkedIn:** `685d3799acfb098c694a5a47`
- **Organization:** `638a5374e3541470367eed3a`

---

## Review Process

All content passes through the automated pipeline before reaching Buffer. The scoring system evaluates hook quality, keyword presence, and signal density. Content below threshold is flagged and returned to the writing stage.

For questions about content strategy or to scope a content sprint, [Book a scope call](https://100xai.engineering/#contact) with the Transient Labs team.
