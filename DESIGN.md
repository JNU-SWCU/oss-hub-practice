# JNU OSS Platform Design System

## 1. Atmosphere & Identity

JNU OSS Platform keeps the warm illustrated campus palette across the product. Dacon is used as an information-hierarchy reference only: compact navigation, clear title/description hierarchy, visible status numbers, thin dividers, and dense but calm lists. The goal is an academic operations product, not a promotional AI landing page or a Dacon color clone.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
| --- | --- | --- | --- | --- |
| Surface/primary | --surface-primary | #F5F0E8 | #121614 | Connected page background |
| Surface/secondary | --surface-secondary | #FFFFFF | #18201C | Workspace bands and tables |
| Surface/elevated | --surface-elevated | #FBF7EF | #202A25 | Repeated cards and drawers |
| Surface/muted | --surface-muted | #FFFDF8 | #1A2420 | Subtle inner rows and readonly cells |
| Surface/nav | --surface-nav | rgba(255, 255, 255, 0.94) | rgba(18, 22, 20, 0.92) | Sticky connected navigation |
| Text/primary | --text-primary | #15120E | #F6FAF8 | Headings and core data |
| Text/secondary | --text-secondary | #5D5245 | #B8C6BE | Descriptions and labels |
| Text/tertiary | --text-tertiary | #8A7B64 | #809189 | Metadata and hints |
| Border/default | --border-default | #E2DDD4 | #314038 | Table and panel borders |
| Border/subtle | --border-subtle | #EFE8DB | #24332C | Soft dividers |
| Border/control | --border-control | #DED6CA | #3B4B43 | Form controls and compact markers |
| Accent/primary | --accent-primary | #FFE09C | #38CBB2 | Primary actions and selected state |
| Accent/hover | --accent-hover | #FFD36F | #66D8C8 | Hover and focus |
| Accent/soft | --accent-soft | #FFF1C7 | #18352F | Selected rows and active steps |
| Accent/border | --accent-border | #F0CB6A | #2D695F | Selected borders |
| Accent/secondary | --accent-secondary | #B79A5B | #38CBB2 | Secondary status and charts |
| Point/green | --point-green | #2F8F49 | #41C77C | Campus success and completed state |
| Point/teal | --point-teal | #008C8C | #66D8C8 | Navigation emphasis and utility links |
| Point/rose | --point-rose | #D83F6A | #F16D8A | Human support, 상담, attention labels |
| Point/orange | --point-orange | #E95E1B | #F59E47 | External tools and active submission actions |
| Point/blue | --point-blue | #1F6FA3 | #62A3EA | Digital service and GitHub/data accents |
| Point/gold | --point-gold | #B79A5B | #F3C44D | Current step, plus controls, campus portal tone |
| Focus/ring | --focus-ring | rgba(255, 224, 156, 0.78) | rgba(56, 203, 178, 0.28) | Keyboard focus |
| Shadow/sticky | --shadow-sticky | rgba(39, 31, 19, 0.04) | rgba(0, 0, 0, 0.24) | Top navigation only |
| Shadow/menu | --shadow-menu | rgba(39, 31, 19, 0.12) | rgba(0, 0, 0, 0.34) | Dropdown menus |
| Status/success | --status-success | #168B4B | #41C77C | Approved and healthy |
| Status/warning | --status-warning | #B7791F | #F3C44D | Attention and pending |
| Status/error | --status-error | #C2413D | #F16D68 | Rejected and anomaly |
| Status/info | --status-info | #2B6CB0 | #62A3EA | Informational states |

### Rules

Warm yellow is reserved for primary actions and selected flow state. Beige remains the dominant surface color. Green, teal, rose, orange, blue, and gold appear only as point colors for section labels, icons, metric values, and card rules; they should not become large background fields.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
| --- | --- | --- | --- | --- | --- |
| Display | 34px | 700 | 1.15 | 0 | Login product title only |
| H1 | 26px | 700 | 1.25 | 0 | Workspace title |
| H2 | 20px | 700 | 1.35 | 0 | Section heading |
| H3 | 16px | 700 | 1.4 | 0 | Card and table title |
| Body/lg | 15px | 500 | 1.6 | 0 | Lead description |
| Body | 14px | 400 | 1.6 | 0 | Default Korean body |
| Body/sm | 13px | 400 | 1.55 | 0 | Secondary rows |
| Caption | 12px | 600 | 1.45 | 0 | Badges and metadata |
| Mono | 12px | 600 | 1.4 | 0 | GitHub IDs, repo slugs |

### Font Stack

- Primary: Pretendard, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- Mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace

### Rules

Text stays Korean-first and avoids one-character orphan lines by using conservative heading sizes and wider containers. Numbers use tabular figures in cards, tables, and status rows. Letter spacing remains 0 except monospace metadata inherited from the font.

## 4. Spacing & Layout

### Base Unit

All spacing derives from 4px.

| Token | Value | Usage |
| --- | --- | --- |
| --space-1 | 4px | Icon and dense row gaps |
| --space-2 | 8px | Inline controls |
| --space-3 | 12px | Form field padding |
| --space-4 | 16px | Compact panels |
| --space-5 | 20px | List and card padding |
| --space-6 | 24px | Section interiors |
| --space-8 | 32px | Workspace groups |
| --space-10 | 40px | Major page rhythm |
| --space-12 | 48px | Large bands |

### Grid

- Max content width: 1440px
- Column system: responsive CSS grid, 12 columns on desktop, single column below 860px
- Breakpoints: sm 640px, md 768px, lg 1024px, xl 1280px

### Rules

Use full-width bands with constrained inner content. Cards are only for repeated records, status items, and framed forms; page sections are not nested inside cards.

## 5. Components

### Role Switcher
- **Structure**: segmented button group with four role buttons.
- **Variants**: public, student, staff, admin.
- **Spacing**: --space-1 internal gap, --space-2/--space-4 padding.
- **States**: default, hover, active, focus, selected.
- **Accessibility**: button group labelled by visible heading; focus ring uses --accent-primary.
- **Motion**: 120ms transform and background transition.

### Metric Card
- **Structure**: title, value, delta/status caption, optional bar.
- **Variants**: neutral, success, warning, error.
- **Spacing**: --space-4 internal padding in connected screens.
- **States**: default and hover for drillable cards.
- **Accessibility**: text values are visible; chart bars are decorative.
- **Motion**: border and background feedback only; avoid large lift.

### Data Table
- **Structure**: caption/header, filter controls, table, row actions.
- **Variants**: public leaderboard, staff review queue, admin users.
- **Spacing**: --space-3 cells, --space-4 controls.
- **States**: selected row, hover, loading, empty with next action, error with retry, success toast, disabled action.
- **Accessibility**: semantic table with visible headers and button labels.
- **Motion**: none except button states.

### Form Panel
- **Structure**: label above input, helper text below, grouped action row.
- **Variants**: student application, staff call setup, admin user creation.
- **Spacing**: --space-4 field gap, --space-5 panel padding.
- **States**: focus, disabled, success, error.
- **Accessibility**: every input has a real label; placeholders never replace labels.
- **Motion**: focus ring only.

### Activity Chart
- **Structure**: KPI title, segmented controls, CSS bars or rails, detail table.
- **Variants**: student trend, staff contest activity, admin API usage.
- **Spacing**: --space-4 between rows.
- **States**: selected metric, hover on bars, empty.
- **Accessibility**: numeric labels accompany every visual bar.
- **Motion**: 180ms bar width transition.

### Student Journey Stepper
- **Structure**: open heading, current position, and five ordered stages from consent to repository start.
- **Variants**: desktop horizontal text rail; mobile stacked text rail. This is an onboarding/setup aid only. Do not render this full stepper on post-onboarding student pages such as dashboard, program list, program detail, application form, or repository/status views; those pages use top navigation and local page actions instead.
- **Spacing**: --space-2 step gap, --space-3 step padding, no outer card container.
- **States**: completed, current, upcoming; every state includes visible Korean text and a thin accent line.
- **Action**: detail/application-stage alternatives may include one compact primary action when it removes uncertainty about how to continue; dashboard-stage skip actions are avoided because setup already collected the student's start path.
- **Accessibility**: semantic navigation and ordered list; current state is not communicated by color alone.
- **Motion**: none; route changes provide the state transition.

### Student First Participation Setup
- **Structure**: student-only setup page with compact header, five-step Stepper, one focused form panel, and persistent previous/next actions.
- **Variants**: first practice entry before dashboard; role, profile, GitHub preference, consent, and start-path selection.
- **Spacing**: --space-5 panel gap, --space-4 step buttons, single-column below md breakpoint.
- **States**: complete, current, disabled future step, validation error, disabled primary action.
- **Action**: the GitHub step lets students either mock-import GitHub history or continue with later manual entry; the final step routes to program browsing or existing activity management. Optional external activity is explained as a later path inside the program screen, not as a primary start choice.
- **Accessibility**: semantic step navigation, real labels for name/affiliation/GitHub ID, native radio groups for GitHub/start choices, and native checkboxes for confirmation and consent.
- **Motion**: none; the Stepper communicates progress through text, marker state, and border color.

### Student Program Entry Options
- **Structure**: student-only program screen shortcut area with two primary choices: browse open programs or return to the dashboard for team/repository status. Optional external activities are shown as a lower-weight support notice, not as an equal primary choice.
- **Rule**: do not show separate cards that route to the same dashboard. Status checking, team member confirmation, and existing activity management are one dashboard path.
- **Spacing**: --space-5 card padding, compact top accent rule, full-width support notice, responsive single column below md breakpoint.
- **States**: default, hover, focus; no selected state because these are navigation shortcuts rather than setup choices.
- **Accessibility**: each card uses one clear button label and plain Korean copy that explains the destination.
- **Motion**: button feedback only.

### Student Project Workspace
- **Structure**: dashboard-first activity list followed by selected project detail, team member GitHub IDs, linked repositories, and existing-activity guidance.
- **Rule**: team information and repository status are not represented as a second forced stepper after onboarding. Students confirm them from My Dashboard and use program pages only when they want to apply to a new program.
- **Multiple teams**: My Dashboard is the source of truth for every activity the current student belongs to. Show each team/program as a selectable activity card first; the detailed project workspace changes to the selected activity.
- **Spacing**: --space-5 panel padding, --space-4 card gap, two-column grid on desktop and one column below md breakpoint.
- **States**: empty state for no connected team, linked repository rows for existing teams, dashed chip for future member updates after correction requests.
- **Accessibility**: team members are visible text chips, repository URLs keep readable wrapping, and action labels name their destination.
- **Motion**: none beyond existing button feedback.

### Student Milestone Checklist
- **Structure**: dashboard table with milestone, gate, due date, status, guide, and one compact action column.
- **Rule**: submission management belongs inside My Dashboard after onboarding; do not force students through the old top stepper to reach repository or submission stages.
- **Spacing**: --space-3 table cells and compact action buttons so the table remains scannable.
- **States**: pending, submitted, needs revision, approved, and local submitted confirmation; status is always written as text.
- **Accessibility**: semantic table headers remain visible, and the action button names the task as submission management.
- **Motion**: none; state changes use visible text and the existing notice banner.

### Legacy Consent Route
- **Structure**: `/consent` remains a compatibility route; first-time students complete consent inside Student First Participation Setup.
- **Variants**: completed students who revisit `/consent` land on the dashboard; incomplete students are redirected into setup.
- **Spacing**: --space-8 page rhythm, --space-5 column gap; avoid large enclosing cards.
- **States**: setup action stays disabled until consent; legacy route has no separate consent form state.
- **Accessibility**: consent remains a real checkbox label inside setup; disclosure meaning remains available without icons.
- **Motion**: none.

### Role Login Portal
- **Structure**: minimal brand nav, centered rounded login panel, two large role buttons, secondary role buttons, line illustration, and compact status line.
- **Variants**: desktop illustrated login stage; mobile single-column login panel without decorative illustration.
- **Spacing**: --space-5 to --space-10 page rhythm, --space-3 button gap, --space-6 auth panel padding.
- **States**: role buttons use subtle lift, warm border, focus, and active states; reset remains a secondary action.
- **Accessibility**: H1 names the login step; every role entry is a semantic button.
- **Motion**: button feedback only; route navigation is the state transition.

### Connected App Shell
- **Structure**: thin full-width top navigation, white page canvas, compact page headers, and simple bordered panels only where framing is necessary.
- **Variants**: role-specific nav labels with the same shell; mobile stacks nav, account chip, and content.
- **Spacing**: --space-6 page gutter, --space-4 to --space-5 panel interiors.
- **Brand typography**: institution label uses the Korean-first sans stack; product title uses a clean sans weight, never a serif display face.
- **Navigation rule**: top-level menu labels are direct destinations. Avoid dropdowns in the practice flow unless a future feature has genuinely separate child destinations; never split two labels that both open the same route.
- **States**: primary actions use warm yellow fill, secondary actions use white/beige outline, selected chips use warm fill.
- **Accessibility**: visible focus rings use the warm accent; CJK headings use keep-all wrapping.
- **Motion**: no decorative motion; only button and navigation state feedback.

### Staff Program Ops
- **Structure**: staff draft form beside a management table for current calls.
- **Variants**: desktop two-column creation/management layout; mobile stacked panels.
- **Spacing**: --space-5 grid gap and form-panel field rhythm.
- **States**: draft creation appends an upcoming internal call with toast; table uses existing status labels; unsaved draft changes trigger browser exit warning.
- **Accessibility**: every input has a visible label; management data remains semantic table content.
- **Motion**: none.

### Confirmation Dialog
- **Structure**: modal-like fixed overlay, icon, title, plain-language consequence, cancel and confirm actions.
- **Usage**: public asset conversion, staff approval/correction, admin account status changes, and future irreversible actions such as team leave or milestone delete.
- **Spacing**: --space-5 panel padding, --space-3 action gap.
- **States**: warning and danger tone; confirm action always names the consequence.
- **Accessibility**: role `dialog`, `aria-modal`, visible heading and button text; never rely on color alone.
- **Motion**: none; focus and button states carry interaction feedback.

### Data State Panel
- **Structure**: icon, short status title, explanatory text, optional recovery action.
- **Variants**: loading, empty, error, success.
- **Usage**: every data-loading surface must have the four-state path available: loading skeleton, empty with next action, error with retry, and success confirmation/toast.
- **Spacing**: --space-4 padding and --space-3 grid gap.
- **Accessibility**: visible Korean text accompanies every state; loading motion is decorative and non-blocking.
- **Motion**: loading icon and skeleton pulse only; no layout animation.

### Success Toast
- **Structure**: fixed compact status message with success icon, message, and dismiss action.
- **Usage**: mutation completion after staff/admin/program operations.
- **Spacing**: --space-3 padding, --space-2 inline gap.
- **Accessibility**: role `status`; message remains visible until dismissed.
- **Motion**: none.

## 6. Motion & Interaction

| Type | Duration | Easing | Usage |
| --- | --- | --- | --- |
| Micro | 120ms | ease-out | Buttons and chips |
| Standard | 200ms | ease-in-out | Tab and row detail changes |
| Emphasis | 360ms | cubic-bezier(0.16, 1, 0.3, 1) | First dashboard mount |

Motion only communicates role selection, state change, focus, or row detail. Reduced-motion users receive static state changes.

## 7. Depth & Surface

### Strategy

Mixed tonal-shift and border hierarchy. Connected screens avoid soft beige shadows and large radii; most depth comes from white panels, thin borders, and compact spacing. Shadows are minimal and only used for sticky navigation or modal-like callouts.

| Level | Treatment | Use |
| --- | --- | --- |
| Base | --surface-primary | Page canvas |
| Raised | --surface-secondary with --border-default | Tables and form panels |
| Highlight | --surface-elevated with accent border | Selected state and important status |
| Sticky | subtle shadow plus border | Header only |
