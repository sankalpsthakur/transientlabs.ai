# Transient Labs — Video Production Briefs

Eight films for transientlabs.ai. Each brief is self-contained: share VID-02/03/04
directly with the named client, hand the rest to the edit team as-is.

Priority order: **VID-02, VID-03 (testimonials) → VID-05 (case film) → VID-01
(anthem) → the rest.** Two client testimonials and one case film transform the
site; everything else compounds.

---

## Global production standards (applies to every film)

**Formats.** Shoot/render a 16:9 master at 3840×2160 (4K) or minimum 1920×1080.
Deliver every film in two aspect ratios: 16:9 (site + YouTube) and 9:16 vertical
cutdown (Reels/Shorts/LinkedIn). Frame interviews with headroom for both crops —
subject center-weighted, key info inside the middle 9:16 column.

**Codecs & delivery.** H.264 MP4, high profile, 8–12 Mbps for 1080p web master.
Also deliver a poster frame per film: JPG, 1600×900, under 200 KB, no text baked
in. Use the exact filenames in the delivery matrix below — the site loads them
by name, zero renaming.

**Captions.** Every film ships with burned-in captions on the vertical cutdown
and a sidecar .srt for the 16:9 master. Most viewers watch muted. Caption style:
sentence case, max 2 lines, no emojis.

**Brand.** Warm paper background family `#fcf8f2 → #f6efe5`, ink text
`#1d1712`, accent blue `#1f3f93` (sparingly — one accent element per frame max).
Type on screen: clean grotesk for statements, monospace UPPERCASE for small
kickers/labels (matches the site's terminal-caps microcopy). Logo lockups live
in the repo under `public/brand/`.

**Hard rules.**
- No stock footage, no AI-generated b-roll, no fake UI. Real screens, real
  sites, real people. If a screen contains client-confidential data, blur in
  the edit or use the demo tenant — never mock it up.
- No background-music-only films: every film has either VO or interview audio.
- Music: minimal, low-tempo, no drops. Think instrument + room tone, not
  trailer. Duck −18 dB under speech.
- Tone of all VO and on-screen text: minimal, precise, confident. Short
  declaratives. No "revolutionary", no "unlock", no filler.

**Interview technique (testimonials).** Never hand clients a script — hand them
the question list and capture their words. Interviewer off-camera, subject
looking 10–15° off-lens. Record 2 min of room tone. Always capture: the
question repeated inside the answer ("We chose Transient Labs because…"), one
number, one moment of friction ("what almost went wrong"), and the
recommendation line. 30–40 min of tape per subject yields the 75–90 s cut.

---

## Delivery matrix

| ID | Film | Master runtime | Site file (video) | Site file (poster) |
|----|------|----------------|-------------------|--------------------|
| VID-01 | Studio anthem | 60 s | `/videos/proof/vid-01-anthem.mp4` | `/images/proof/vid-01-anthem-poster.jpg` |
| VID-02 | Climitra testimonial | 75–90 s | `/videos/proof/vid-02-climitra.mp4` | `/images/proof/vid-02-climitra-poster.jpg` |
| VID-03 | Visusta testimonial | 75–90 s | `/videos/proof/vid-03-visusta.mp4` | `/images/proof/vid-03-visusta-poster.jpg` |
| VID-04 | Alan Scott group testimonial | 75–90 s | `/videos/proof/vid-04-alanscott.mp4` | `/images/proof/vid-04-alanscott-poster.jpg` |
| VID-05 | Scope3 dashboard case film | 60 s | `/videos/proof/vid-05-scope3.mp4` | `/images/proof/vid-05-scope3-poster.jpg` |
| VID-06 | Live Call Assistant case film | 45–60 s | `/videos/proof/vid-06-livecall.mp4` | `/images/proof/vid-06-livecall-poster.jpg` |
| VID-07 | Six-week sprint explainer | 75 s | `/videos/proof/vid-07-sprint.mp4` | `/images/proof/vid-07-sprint-poster.jpg` |
| VID-08 | Industrial site film | 90 s | `/videos/proof/vid-08-industrial.mp4` | `/images/proof/vid-08-industrial-poster.jpg` |

Vertical cutdowns append `-vertical` (not loaded by the site; for social).

**Hosting.** Posters go in the repo at `public/images/proof/` (small JPGs).
Video masters do NOT go in the repo — `public/videos/*` is gitignored and
never reaches the production deploy. Host masters on a CDN (Cloudflare
R2/Stream or Mux) using the filenames above, then put the absolute URL in the
`src` field of the entry in `src/lib/proof-videos.ts`. Local previews can use
`public/videos/proof/` — swap to the hosted URL before publishing. Once an
entry is added, the homepage Proof section renders automatically.

---

## VID-01 — Studio anthem: "Weeks, not months." (60 s)

**Purpose.** The brand film. Answers "who are these people and are they real"
in one minute. Placement: proof section lead slot; also the pinned video on
LinkedIn/X profiles.

**Cast/location.** Founder on camera (one setup, natural light, paper-toned
wall or workshop background). Rest is screen capture and real b-roll from
delivered projects.

| Scene | Time | Picture | Sound / VO | On-screen text |
|-------|------|---------|------------|----------------|
| 1 | 0:00–0:04 | Black frame cuts to macro of a terminal running an agent swarm — tasks ticking to done | Single soft keystroke, room tone | `AGENT SWARM // LIVE` (mono, top-left) |
| 2 | 0:04–0:12 | Founder to camera, locked-off medium shot | "Most AI projects die between the demo and production. That gap is our entire business." | — |
| 3 | 0:12–0:22 | Fast montage, 2 s per shot: Scope3 dashboard live data → Live Call Assistant mid-call → industrial ops dashboard → mobile app scroll | VO: "We ship AI agents into real operations — carbon accounting, sales calls, plant floors, retail." | Product name kicker per shot (mono, lower-left) |
| 4 | 0:22–0:32 | Screen recording: the actual agent-swarm board from the site hero, real tasks routing across 5 teams | VO: "Our own delivery runs on the same swarms we sell. Engineering, content, QA — coordinated agents, one orchestrator." | `WE RUN ON WHAT WE SHIP` |
| 5 | 0:32–0:42 | Founder to camera, slight push-in | "Fixed scope. Fixed price. Six weeks from brief to production handoff — with evals, guardrails, and tracing built in, not bolted on." | `6 WEEKS · FIXED PRICE` |
| 6 | 0:42–0:52 | B-roll: real client site or workshop; hands on hardware; one genuine laugh/candid beat | VO: "We build close to the work. Kilns, pumps, aisles, runtimes." | — |
| 7 | 0:52–0:60 | Cut to paper background, logo lockup draws in | Music resolves, one beat of silence | Wordmark + `transientlabs.ai` + `We ship AI agents that boost margins in weeks, not months.` |

**Edit notes.** Cut on action, never on dissolves. Keep total on-screen-text
words under 30. The scene-3 montage must be real product capture — coordinate
with Sankalp for demo-tenant recordings.

---

## VID-02 — Client testimonial: Climitra (75–90 s)

**Purpose.** First client-on-record film. Outcome headline on the site card:
*"How Climitra runs CSRD-grade carbon ops on a lean team."* (Final headline
comes from the strongest captured line + number.)

**Subject.** The Climitra-side owner of the system (founder or ops lead —
whoever lives in it daily). One subject only.

**Location.** Their office or a clean neutral room. Subject 2 m off the
background, window key light. Capture 10 min of screen recording of the actual
control tower / carbon workflows they use (blur client names in edit if
needed).

**Interview questions (send ahead, capture verbatim answers):**
1. What was breaking before this system existed? What did it cost you in time or money?
2. Why Transient Labs and not hiring, or a bigger agency?
3. Walk me through the six weeks — what surprised you?
4. What almost went wrong, and what happened?
5. What runs automatically today that a person used to do? How many hours/week is that?
6. What number would you put on the change? (reports shipped, hours saved, deadlines hit)
7. Who should call Transient Labs? Who shouldn't?

| Scene | Time | Picture | Sound | On-screen text |
|-------|------|---------|-------|----------------|
| 1 | 0:00–0:06 | Cold open on the strongest soundbite, subject mid-thought | e.g. "…and that report used to take us three weeks. It's now a morning." | — |
| 2 | 0:06–0:12 | Wide of their workspace, subject walking in / at desk | Music enters low | `CLIMITRA` kicker + subject name & role (mono) |
| 3 | 0:12–0:28 | Interview: the "before" answer (Q1) | Their words | Caption key phrase only |
| 4 | 0:28–0:45 | Screen b-roll: the live system doing the thing they describe (Q5), cursor moving with intent | Their VO continues over screens | `BEFORE →` / `AFTER →` labels if a comparison lands |
| 5 | 0:45–0:60 | Interview: the number (Q6) — hold on their face for the stat | Their words | The number, large: e.g. `3 WEEKS → 1 MORNING` |
| 6 | 0:60–0:75 | Interview: friction + resolution (Q4) — this is what makes it credible | Their words | — |
| 7 | 0:75–0:90 | Their recommendation line (Q7), cut to paper end-card | Music resolves | Logo + `transientlabs.ai` + the outcome headline |

**Client needs to provide.** 60–90 min on site (interview + b-roll), screen
access to the live system (or demo tenant), logo approval for the site.

---

## VID-03 — Client testimonial: Visusta (75–90 s)

**Purpose.** Second on-record film, angled at *automation that runs unattended*.
Working outcome headline: *"Visusta's screening pipeline runs nightly — nobody
touches it."* The system genuinely runs on schedule (daily screening scheduler,
monthly QA summary) — the film's job is to make "it just runs" visceral.

**Subject.** Visusta's operational owner of screening/QA.

**Interview questions.** Same core seven as VID-02, plus:
- "What happens at 2 a.m. when the screening job runs? Where are you?"
- "When the monthly QA summary lands, what do you do with it?"

| Scene | Time | Picture | Sound | On-screen text |
|-------|------|---------|-------|----------------|
| 1 | 0:00–0:06 | Cold open soundbite | Strongest line from tape | — |
| 2 | 0:06–0:14 | A clock/terminal beat: cron firing at night — real log lines scrolling, timestamped 02:17 | Room tone, single key | `02:17 · SCREENING RUN #214` (mono) |
| 3 | 0:14–0:30 | Interview: what a screening cycle cost before (Q1) | Their words | Key phrase caption |
| 4 | 0:30–0:48 | Screen b-roll: the pipeline output — queues clearing, the monthly QA summary arriving in their inbox | Their VO over screens | `RUNS NIGHTLY · UNATTENDED` |
| 5 | 0:48–0:62 | Interview: the number (hours/week reclaimed, runs completed, error rate) | Their words | The number, large |
| 6 | 0:62–0:75 | Interview: friction moment + fix | Their words | — |
| 7 | 0:75–0:90 | Recommendation + end card | Music resolves | Logo + outcome headline |

---

## VID-04 — Client testimonial: Alan Scott group (75–90 s)

**Purpose.** The multi-brand operator story — one leadership team, four
operating companies (Automation & Robotics, LearniX, Retail, Satwik). Angle:
*one senior AI partner across very different businesses.* This film also
de-risks the "four logos, one client" read on the site by making the
relationship explicit and impressive.

**Subject.** The group principal, ideally walking between contexts (office →
retail floor → warehouse/workshop).

**Interview questions.** Core seven, plus:
- "You run four very different businesses. What made one partner workable across them?"
- "Which system surprised you most in production?"

| Scene | Time | Picture | Sound | On-screen text |
|-------|------|---------|-------|----------------|
| 1 | 0:00–0:06 | Cold open soundbite | Strongest line | — |
| 2 | 0:06–0:16 | Montage: four 2-s establishing shots — robotics floor, classroom/edtech screen, retail aisle, product warehouse | Music low | Brand kickers per shot (mono) |
| 3 | 0:16–0:32 | Interview: the problem of running four ops stacks (Q1) | Their words | Caption key phrase |
| 4 | 0:32–0:50 | Screen + floor b-roll: the actual systems (inventory copilot, ops dashboard) used in the real spaces | Their VO | `ONE PARTNER · FOUR OPERATIONS` |
| 5 | 0:50–0:64 | Interview: the number that matters to them (Q6) | Their words | The number, large |
| 6 | 0:64–0:78 | Interview: friction + fix; the "which surprised you" answer | Their words | — |
| 7 | 0:78–0:90 | Recommendation + end card | Music resolves | Logo + outcome headline |

---

## VID-05 — Case film: Scope3 Global Dashboard (60 s)

**Purpose.** Pure product film for the flagship case study. No talking heads —
screens carry it. Placement: proof section + the Scope3 case-study panel.

**Source material.** 4K screen recordings from the demo tenant. Record at
100% zoom, hide bookmarks bar, cursor moves slow and deliberate. Capture each
flow twice.

| Scene | Time | Picture | Sound / VO | On-screen text |
|-------|------|---------|------------|----------------|
| 1 | 0:00–0:05 | Dashboard loads: welcome view, live totals count up (391,800 tCO₂e) | VO: "Carbon accounting, as an operating system." | `SCOPE3 GLOBAL DASHBOARD` |
| 2 | 0:05–0:15 | Stage cards: Strategy → Calculate → Execute, cursor opens the materiality matrix | VO: "Strategy first — double materiality, IROs, ESRS alignment scored in one view." | `STAGE 1 · STRATEGY` |
| 3 | 0:15–0:28 | Data ingestion: supplier evidence uploads, OCR extracting a PDF invoice into structured rows | VO: "Suppliers upload evidence. OCR and agents turn documents into audit-ready data — with provenance on every number." | `EVIDENCE → STRUCTURED DATA` |
| 4 | 0:28–0:40 | Emissions breakdown donut + hotspot analysis; a −30% reduction target line | VO: "Hotspots surface where the tonnes are. Targets track against 2030." | `-30% BY 2030` |
| 5 | 0:40–0:50 | Export flow: CSRD/GHG report generates, ESRS-tagged sections scroll | VO: "One click from ledger to CSRD-compliant report." | `ESRS-COMPLIANT EXPORT` |
| 6 | 0:50–0:60 | Pull back to full dashboard; cut to paper end card | VO: "Built in six weeks. Running in production." | Logo + `transientlabs.ai` |

**Edit notes.** Every number shown must be real demo-tenant data — consistent
across scenes (391,800 tCO₂e appears twice; keep it identical). Speed-ramp long
loads, never cut them fake-instant.

---

## VID-06 — Case film: Live Call Assistant (45–60 s)

**Purpose.** The most kinetic case — AI assisting a live sales call. Placement:
proof section + Revenue Intelligence case panel.

**Source material.** Screen recording of a staged-but-real call on the demo
tenant (two team members, scripted scenario, genuine audio). Split-screen:
call left, assistant right.

| Scene | Time | Picture | Sound / VO | On-screen text |
|-------|------|---------|------------|----------------|
| 1 | 0:00–0:06 | A call connects; assistant pane sits empty, listening indicator pulses | Real call audio: greeting | `LIVE CALL · ASSISTANT ON` |
| 2 | 0:06–0:18 | Prospect raises an objection ("we already use X") — assistant surfaces the battlecard in <1 s | Call audio continues; no VO | `OBJECTION DETECTED → BATTLECARD` |
| 3 | 0:18–0:30 | Prospect asks a pricing detail — assistant pins the exact answer + the relevant case study | Call audio | `ANSWER SURFACED · 0.8 S` |
| 4 | 0:30–0:42 | Call ends; summary, action items, and CRM update write themselves | VO enters: "Every call ends with the follow-up already written." | `AUTO SUMMARY → CRM` |
| 5 | 0:42–0:52 | Manager view: call scored, coaching moments flagged | VO: "Managers coach from moments, not recordings." | `COACHING QUEUE` |
| 6 | 0:52–0:60 | End card | VO: "Live Call Assistant. Built by Transient Labs." | Logo + `transientlabs.ai` |

---

## VID-07 — The six-week sprint, week by week (75 s)

**Purpose.** Objection killer for "agencies drift." Makes the fixed-scope
promise concrete. Placement: proof section + Advantage section + sales deck.

**Source material.** Founder VO (record clean, no camera needed) + real
artifacts from one completed sprint: the actual brief, Figma/UX flow, PR list,
eval dashboard, deploy log, handoff doc. Screen-capture them scrolling.

| Scene | Time | Picture | Sound / VO | On-screen text |
|-------|------|---------|------------|----------------|
| 1 | 0:00–0:06 | A dated calendar strip draws: six weeks, day one highlighted | VO: "Six weeks. Here's exactly what happens." | `WEEK 1 → WEEK 6` |
| 2 | 0:06–0:18 | Week 1 artifacts: brief → scope doc → UX flow → architecture sketch, each stamped | VO: "Week one: scope locks. Commercials lock with it — the price cannot move after this point." | `WEEK 1 · SCOPE LOCK` |
| 3 | 0:18–0:38 | Weeks 2–4: commit graph filling, weekly demo recordings, integrations lighting up one by one | VO: "Weeks two to four: the core system. You see a working demo every single week — real product logic, real data." | `WEEKS 2–4 · CORE BUILD` |
| 4 | 0:38–0:54 | Weeks 5–6: eval dashboard runs green, regression suite passes, deploy log scrolls, prod URL loads | VO: "Weeks five and six: evals, hardening, deployment. Not a demo — production, with guardrails and tracing built in." | `WEEKS 5–6 · HARDEN & SHIP` |
| 5 | 0:54–0:66 | The handoff doc + a 2-week support calendar | VO: "Then a real handoff: docs, walkthrough, and a bug-fix window. Your team owns it — 100% of the IP." | `HANDOFF · 100% YOUR IP` |
| 6 | 0:66–0:75 | End card | VO: "Fixed scope. Fixed price. $15,000. Six weeks." | `$15,000 · 6 WEEKS` + logo |

---

## VID-08 — Industrial site film (90 s)

**Purpose.** Field proof for the $40k industrial path — and the authentic
footage that replaces every stock photo the site used to fake. Placement:
proof section + /industrial-energy-automation page. Shoot this at the first
willing industrial client site (kiln, pump floor, or plant).

**Crew note.** This is the only film needing a real shoot day: 1 operator,
gimbal + tripod, lav + shotgun mic, 6–8 hours on site. Safety induction first;
PPE visible in every frame where required (it reads as credibility, not
compliance).

| Scene | Time | Picture | Sound / VO | On-screen text |
|-------|------|---------|------------|----------------|
| 1 | 0:00–0:08 | Pre-dawn exterior of the site; lights on; machinery starts | Real ambient (motors, air), no music yet | `04:50 · SITE START` |
| 2 | 0:08–0:20 | The audit walk: engineer + site operator walking the floor, pointing at meters, clamp-on sensor going onto a panel | VO: "An audit starts at the meter, not in a spreadsheet." | `WEEK 1 · ENERGY BASELINE` |
| 3 | 0:20–0:36 | Close-ups: analog gauges, meter readings, a tablet logging readings next to the machine it measures | Site operator (lav): one authentic line about what they never had visibility on | `EVERY LOAD, LOGGED` |
| 4 | 0:36–0:52 | The data arrives: dashboard forming — load curves, losses highlighted in accent blue, one obvious spike | VO: "Then the losses get names: idle load, compressed-air leaks, off-shift baseline. Each with a number attached." | `LOSSES, NAMED` |
| 5 | 0:52–0:68 | Automation boundary: operator at a control panel; safety interlock shown deliberately; the system suggests, human confirms | VO: "Automation stops where safety starts. We design the control path with the people who run the floor." | `SAFETY BOUNDARY · HUMAN CONFIRM` |
| 6 | 0:68–0:82 | The roadmap review: printed/on-screen 4-week roadmap on the actual site desk, operator and engineer over it | VO: "Four weeks in: baseline, assessment, and a roadmap the site actually signs." | `WEEK 4 · ROADMAP` |
| 7 | 0:82–0:90 | Golden-hour exterior; machinery still running; end card | Ambient fades, music resolves | `$40,000 · 4 WEEKS` + logo + `transientlabs.ai` |

**Client needs to provide.** Site access + safety induction, one operator
willing to say one line on lav, permission for exterior + floor shots (we
blur badges/boards on request).

---

## Social cutdown rule (applies to all eight)

Every film yields: one 9:16 30-s cutdown (scenes 1 + number + end card), one
15-s teaser (cold open + end card), and 3 still frames for posts. Name them
`<master>-vertical-30.mp4`, `<master>-teaser-15.mp4`. The edit team should cut
these in the same session as the master — not as a later pass.
