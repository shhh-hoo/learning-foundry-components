# Learning Foundry — Component Presentation Spec v0.1

Status: **Design baseline**  
Scope: Learner-facing Learning Components in `learning-foundry-components`  
Audience: Component authors, Codex agents, reviewers, Foundry host/integration work  

## 0. Design intent

Learning Foundry Components should feel like **pages from the same modern illustrated workbook**, not like unrelated mini-sites and not like generic SaaS widgets.

The visual direction is:

> **quiet picture-book / hand-drawn warmth + modern product clarity**

The system should feel authored, tactile, friendly, and slightly imperfect, while remaining calm enough for serious secondary-school learning.

The core rule is:

> **Unified shell. Unified states. Unified information hierarchy. Open workspace.**

A Mechanism Builder may look radically different from a Data Investigation workspace in the center, but the learner should always know:

1. why this activity is here;
2. what they should do now;
3. what can be manipulated;
4. how to submit / ask for help / reset;
5. what happened after an attempt;
6. how the activity relates back to the Foundry learning session.

---

## 1. Reference lineage

### 1.1 `student-site/styles` is the primary visual ancestor

Carry forward these existing design traits rather than inventing a second brand language:

- warm paper backgrounds (`#f7f1e8`, `#f8eedb` family);
- dark brown ink instead of pure black (`#302520`, `#3f302b` family);
- serif display typography paired with restrained sans-serif UI text;
- 2–3px outlines on important objects;
- irregular-but-controlled rounded corners;
- offset hard shadows rather than glassy floating shadows;
- teal / rust / gold as authored accent colors;
- small rotations and imperfect geometry used sparingly;
- large quiet surfaces rather than dense dashboard chrome;
- chips, notes, and cards that resemble labels, slips, tabs, or pasted paper.

Do **not** mechanically import the student-site CSS into Components. Preserve the lineage as semantic tokens so Components remain independently deployable.

### 1.2 What to borrow from Flint

Borrow product behavior, not branding:

- low-friction learner workspace;
- strong single-task focus;
- AI/help tools embedded around the work instead of replacing the work;
- clear separation between activities and free chat;
- persistent session/state expectations.

### 1.3 What to borrow from SchoolAI

Borrow product behavior and composition:

- one obvious primary action/input at a time;
- generous rounded surfaces;
- contextual helper actions as chips rather than permanent heavy panels;
- focused “PowerUp” feeling: a tool can appear when useful without becoming a separate product;
- friendly personality without turning the interface into a game.

### 1.4 What to borrow from Flamingo / MyFlamingo

Borrow the sense of a **personal journey**:

- card-led progression;
- visually inviting previews;
- clear “this is for you / this is your next step” framing;
- optimism and youthfulness without childish gamification.

### 1.5 Explicit non-goals

Do not copy any external product’s brand assets, mascots, exact layouts, or proprietary UI.

Do not make Components look like:

- a corporate admin dashboard;
- a children’s mobile game;
- a generic ChatGPT clone;
- a glossy AI landing page;
- a collection of unrelated embedded websites.

---

## 2. Visual personality

Use five adjectives as the default review test:

**Warm · Drawn · Quiet · Clever · Clear**

If a screen is playful but no longer clear, clarity wins.  
If a screen is polished but no longer warm/drawn, bring back authored texture.  
If a screen is cute but looks primary-school-only, reduce decoration.

### 2.1 The hand-drawn rule

Hand-drawn does **not** mean messy.

Use authored imperfection in approximately 10–15% of the visible UI:

- a slightly rotated label;
- a hand-drawn underline;
- a single-line doodle in an empty corner;
- an offset border or shadow;
- a curved annotation arrow;
- irregular card radii;
- a “pencil” annotation after feedback.

Keep the other 85–90% geometrically disciplined.

### 2.2 Picture-book rule

A Component should feel illustrated even when no illustration is present.

Achieve this with:

- warm paper fields;
- editorial typography;
- composition with breathing room;
- small narrative labels (“Try this”, “Your prediction”, “What changed?”);
- visual objects that resemble movable cut-outs or workbook annotations.

Large decorative hero illustrations are optional and should not compete with the learning interaction.

---

## 3. Design tokens

These are v0.1 presentation defaults, intentionally close to `student-site`.

```css
:root {
  --fc-paper: #f7f1e8;
  --fc-paper-deep: #ede2d2;
  --fc-paper-bright: #fffaf3;
  --fc-paper-cool: #eef6f1;
  --fc-ink: #302520;
  --fc-ink-soft: #655750;
  --fc-line: #3f302b;
  --fc-line-soft: rgba(63, 48, 43, 0.18);
  --fc-line-hair: rgba(63, 48, 43, 0.09);
  --fc-teal: #136f63;
  --fc-teal-soft: #dcebe5;
  --fc-rust: #d55d35;
  --fc-rust-soft: #f6ddd1;
  --fc-gold: #f0be61;
  --fc-gold-soft: #faedc9;
  --fc-blue: #7aa9c6;
  --fc-blue-soft: #e0ecf3;
  --fc-lilac: #c7afd3;
  --fc-lilac-soft: #eee4f2;
  --fc-success: #4d7c62;
  --fc-warning: #b77a32;
  --fc-error: #b65443;
  --fc-radius-sm: 14px;
  --fc-radius-md: 20px;
  --fc-radius-lg: 28px;
  --fc-outline: 2px;
  --fc-outline-strong: 3px;
  --fc-shadow-sm: 4px 4px 0 rgba(63, 48, 43, 0.08);
  --fc-shadow-md: 7px 7px 0 rgba(63, 48, 43, 0.10);
  --fc-font-ui: "Avenir Next", "Segoe UI", system-ui, sans-serif;
  --fc-font-display: "Iowan Old Style", "Palatino Linotype", Georgia, serif;
  --fc-font-mono: "SFMono-Regular", Menlo, Consolas, monospace;
}
```

### 3.1 Color use

- Paper + ink dominate.
- One Component screen normally uses **one primary accent** plus one secondary accent.
- Color communicates role/state before decoration.
- Do not assign a different rainbow color to every concept.
- Avoid pure #000 and pure #fff except tiny technical details.

### 3.2 Accent family suggestions

These are suggestions, not semantic protocol fields:

- concept / causal exploration → teal;
- construction / mechanism / active manipulation → rust;
- recall / prompts / hints → gold;
- data / graph work → blue;
- reflection / explanation → lilac.

---

## 4. Typography

Use serif display for Component title, major question, feedback headline, and occasional section heading. Use sans-serif for controls, instructions, chips, metadata, helper text, and numerical values when clarity matters.

Recommended hierarchy:

```text
Component title          34–44px display serif
Current task / question  24–32px display serif or strong UI sans
Body / instruction       15–18px UI sans
Control label            13–15px semibold
Eyebrow / metadata       11–13px uppercase or small-caps feeling
```

Avoid more than two font families on a screen.

---

## 5. Three-layer composition

### Layer A — Foundry Host Context

Owned by Foundry host, not by the Component. It may contain learning goal/current focus, return/close, session context, global AI/help entry, and global session controls. A Component must **not** recreate the entire Foundry navigation inside itself.

### Layer B — Component Frame

Owned by the Component presentation system.

```text
┌──────────────────────────────────────────────────────────┐
│ eyebrow / activity type                     status chip │
│ Component title                                           │
│ one-sentence purpose / instruction                        │
├──────────────────────────────────────────────────────────┤
│                                                          │
│                    WORKSPACE                             │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ contextual hint / evidence note         actions          │
└──────────────────────────────────────────────────────────┘
```

### Layer C — Interaction Workspace

The flexible area: cards/classification zones, graphs, molecule/mechanism canvas, parameter simulation, calculation workspace, spectrum viewer, route planner, diagram/apparatus builder. **This is where Components are allowed to look different.**

---

## 6. Information hierarchy: Why → What → Do → Result

A Component should make the learning episode legible without exposing internal Agent reasoning.

- **Why** — optional, one short sentence describing the learning purpose.
- **What** — the immediate task; one screen should have one clear learner instruction whenever possible.
- **Do** — the workspace and primary interaction.
- **Result** — after meaningful submission/action, show what the learner did, what changed/matched/conflicted, and one next-action affordance.

Do not immediately turn every result into a long AI explanation.

---

## 7. Standard Component regions

- **Eyebrow** — small label such as `PREDICT + MANIPULATE`, `CLASSIFY`, `BUILD THE MECHANISM`, `READ THE DATA`.
- **Title** — short, concrete, active.
- **Purpose line** — one sentence maximum by default.
- **Workspace** — at least ~55% of visible Component area on desktop when interaction-heavy.
- **Action bar** — secondary utilities left; one primary progression action right.
- **Feedback sheet** — compact card/sheet attached to the workspace rather than a modal; preserve and annotate learner work.

---

## 8. Component states

Every interactive Component should visually support:

- **PREPARING** — paper-colored skeleton/faint line drawing; avoid spinner-only feedback.
- **READY** — interaction visible; primary action disabled until meaningful input if appropriate.
- **ACTIVE** — learner actions change local visuals immediately; no gratuitous celebration.
- **EVALUATING** — freeze duplicate submission; keep learner work visible; use subtle pencil-line/progress treatment.
- **FEEDBACK** — preserve original work; overlay/annotate rather than replace whenever possible.
- **COMPLETED** — quiet closure; one next action; no confetti by default.
- **ERROR** — explain what can be recovered; never clear learner work automatically.
- **CANCELLED / ABANDONED** — allow safe exit and preserve restorable state when supported.

---

## 9. Hand-drawn visual primitives

Create shared primitives rather than freehand styling per Component:

- **PaperCard** — 2px ink/soft border; irregular radius; subtle offset shadow; optional ±0.5° rotation.
- **TapeLabel** — lightly pasted label for “Your prediction”, “Evidence”, “Try this”.
- **PencilUnderline** — SVG path or pseudo-element under a key phrase.
- **SketchArrow** — curved single-line arrow for causality/movement/feedback.
- **ScribbleHalo** — loose one-line oval around selected datum/object.
- **MarginDoodle** — tiny optional line art such as spark, atom orbit, leaf, arrow, beaker; max 1–2 per viewport.

---

## 10. Buttons and controls

- **Primary** — filled accent, dark ink outline, 16–18px radius/pill, 3–4px offset shadow, hover translateY(-1px), no scale bounce.
- **Secondary** — paper surface, soft outline, little/no shadow.
- **Cancel** — do not use alarming red unless work will actually be lost.
- **Chips** — for contextual tools like Hint, Show labels, Compare, Read aloud, Ask Foundry; not primary navigation.
- **Sliders/knobs** — tactile track, labeled endpoints, current value always shown as text.

---

## 11. Workspace family guidance

### Classification / sorting

Objects resemble movable cards/cut-outs; destination zones resemble labeled paper trays; avoid bright game-board colors; show placement history subtly after submit.

### Causal / simulation

Required sequence:

```text
Predict → Change variable → Observe → Explain
```

Prediction remains visible after manipulation.

### Construction / mechanism / diagram

Canvas is the main surface; tools live in a small tray, not a Photoshop-like toolbar; allowed drop/connection areas use soft sketch lines; preserve learner construction during feedback.

### Calculation / structured reasoning

Resemble a workbook/working page more than a spreadsheet; each reasoning step is inspectable; annotate near the first meaningful mismatch; mathematical clarity overrides decorative typography.

### Data investigation

Graph/table remains visually dominant; prompt sits beside/above, not over the data; selected evidence gets a sketch circle/underline or margin note; palette remains restrained.

---

## 12. AI / Foundry presence inside a Component

The Component should not become another chat app. AI presence should normally appear as a small `Ask Foundry` chip, margin note, contextual hint sheet, or short next-question strip after an attempt.

Do not permanently reserve 40–50% of the screen for chat unless the learning action itself requires dialogue. The learner’s work remains the visual center of gravity.

---

## 13. Feedback language and tone

Feedback should feel like an intelligent pencil annotation, not a scoring machine.

Prefer specific language such as:

- “This part holds.”
- “These two moved together.”
- “Your prediction and the model disagree here.”
- “Check the denominator before changing the arithmetic.”

Avoid default celebratory gamification, giant green success screens, XP, or confetti after routine correctness.

---

## 14. Motion

Motion should explain state or causality.

- 120–180ms control transitions;
- 180–280ms card/zone movement;
- 300–500ms causal/simulation transition when instructional;
- subtle draw-on animation for annotation paths.

Avoid springy motion everywhere, infinite decorative animation, parallax, or bouncing primary buttons. Respect `prefers-reduced-motion`.

---

## 15. Responsive behavior

- Desktop/tablet landscape: wide editorial workspace; typical max width 1180–1280px.
- Tablet portrait: side notes collapse beneath workspace.
- Mobile: one task at a time; sticky/bottom action bar when useful; no horizontal drag without tap alternative; no tiny graph labels; compress title before workspace.

Do not reduce the Component to a miniature desktop canvas.

---

## 16. Accessibility baseline

Every Component must meet WCAG AA contrast for functional text/controls, provide keyboard/equivalent interaction, visible focus, no color-only meaning, labeled icon controls, reasonable 200% zoom behavior, text equivalents for meaningful visual feedback, reduced-motion support, and readable body typography. Hand-drawn aesthetic is visual texture, not an excuse for illegibility.

---

## 17. Component Lab presentation modes

Component Lab should include:

- **Canvas view** — Component alone in recommended learner container.
- **Host-context view** — lightweight Foundry host frame.
- **State switcher** — READY / ACTIVE / FEEDBACK / COMPLETED / ERROR.
- **Viewport switcher** — mobile / portrait tablet / laptop / wide desktop.
- **Fixture picker** — real family fixtures, not lorem ipsum.

---

## 18. Codex implementation rules

For a new Component, Codex should not independently invent presentation architecture. It should:

1. use shared tokens and shell primitives;
2. select an accent family;
3. keep the standard information hierarchy;
4. spend design effort on the workspace;
5. reuse shared PaperCard / TapeLabel / SketchArrow / feedback primitives;
6. test all declared states in Component Lab;
7. visually inspect desktop + mobile;
8. only introduce a new visual primitive when existing primitives cannot express the need cleanly.

New visual primitives belong in the shared primitive layer, not copied into one Component.

---

## 19. Visual acceptance checklist

A Component is not presentation-complete until the reviewer can answer “yes” to all:

- Does it unmistakably belong to the Foundry/student-site family?
- Is the learning task obvious within ~5 seconds?
- Is the learner’s work more visually important than AI/chat/help chrome?
- Does the center workspace get enough space?
- Does hand-drawn character appear without creating visual noise?
- Are primary and secondary actions unambiguous?
- Does feedback preserve and annotate learner work?
- Are READY / ACTIVE / FEEDBACK / COMPLETED / ERROR states visibly distinct?
- Does mobile remain usable rather than merely scaled down?
- Can the interaction be completed with keyboard/equivalent controls?
- Are visuals appropriate for older secondary-school learners, not only younger children?

---

## 20. Canonical style sentence

> **Design it like a clean modern learning tool printed into a warm illustrated workbook: paper, ink, a few hand-drawn marks, one focused task, and the learner’s work at the center.**
