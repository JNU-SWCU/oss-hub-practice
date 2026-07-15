# JNU OSS Platform Design System

## 1. Atmosphere & Identity

JNU OSS Platform feels like a calm illustrated campus service portal rather than a dense operations dashboard. The signature is a warm beige canvas, white rounded work surfaces, thin line illustration details, and restrained green institutional accents.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
| --- | --- | --- | --- | --- |
| Surface/primary | --surface-primary | #F5F0E8 | #121614 | Page background |
| Surface/secondary | --surface-secondary | #FFFFFF | #18201C | Workspace bands and tables |
| Surface/elevated | --surface-elevated | #FBF7EF | #202A25 | Repeated cards and drawers |
| Text/primary | --text-primary | #1F2A24 | #F6FAF8 | Headings and core data |
| Text/secondary | --text-secondary | #506057 | #B8C6BE | Descriptions and labels |
| Text/tertiary | --text-tertiary | #7E8A84 | #809189 | Metadata and hints |
| Border/default | --border-default | #E2DDD4 | #314038 | Table and panel borders |
| Border/subtle | --border-subtle | #EFE8DB | #24332C | Soft dividers |
| Accent/primary | --accent-primary | #FFE09C | #38CBB2 | Primary actions and selected state |
| Accent/hover | --accent-hover | #FFD36F | #66D8C8 | Hover and focus |
| Accent/secondary | --accent-secondary | #38CBB2 | #38CBB2 | Secondary status and charts |
| Status/success | --status-success | #168B4B | #41C77C | Approved and healthy |
| Status/warning | --status-warning | #B7791F | #F3C44D | Attention and pending |
| Status/error | --status-error | #C2413D | #F16D68 | Rejected and anomaly |
| Status/info | --status-info | #2B6CB0 | #62A3EA | Informational states |

### Rules

Warm yellow is reserved for primary actions and selected flow state. Green is reserved for institutional identity, icons, and positive status. Neutral beige and white surfaces do most of the work.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Tracking | Usage |
| --- | --- | --- | --- | --- | --- |
| Display | 40px | 700 | 1.15 | 0 | Product title |
| H1 | 32px | 700 | 1.2 | 0 | Workspace title |
| H2 | 24px | 700 | 1.3 | 0 | Section heading |
| H3 | 18px | 700 | 1.4 | 0 | Card and table title |
| Body/lg | 17px | 500 | 1.65 | 0 | Lead description |
| Body | 15px | 400 | 1.6 | 0 | Default Korean body |
| Body/sm | 13px | 400 | 1.55 | 0 | Secondary rows |
| Caption | 12px | 600 | 1.45 | 0 | Badges and metadata |
| Mono | 12px | 600 | 1.4 | 0 | GitHub IDs, repo slugs |

### Font Stack

- Primary: Pretendard, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- Mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace

### Rules

Text stays Korean-first and avoids one-character orphan lines by using conservative heading sizes and wider containers. Letter spacing remains 0 except monospace metadata inherited from the font.

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
- **Spacing**: --space-5 internal padding.
- **States**: default and hover for drillable cards.
- **Accessibility**: text values are visible; chart bars are decorative.
- **Motion**: hover lift only when clickable.

### Data Table
- **Structure**: caption/header, filter controls, table, row actions.
- **Variants**: public leaderboard, staff review queue, admin users.
- **Spacing**: --space-3 cells, --space-4 controls.
- **States**: selected row, hover, empty, disabled action.
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
- **Variants**: desktop horizontal text rail; mobile stacked text rail.
- **Spacing**: --space-2 step gap, --space-3 step padding, no outer card container.
- **States**: completed, current, upcoming; every state includes visible Korean text and a thin accent line.
- **Accessibility**: semantic navigation and ordered list; current state is not communicated by color alone.
- **Motion**: none; route changes provide the state transition.

### Consent Gate
- **Structure**: student journey, plain-language data-use summary, two line-separated disclosure rows, required consent control, primary continuation action.
- **Variants**: first student demo entry per browser tab.
- **Spacing**: --space-8 page rhythm, --space-5 column gap; avoid large enclosing cards.
- **States**: action disabled until consent; focus and checked states use browser-native controls.
- **Accessibility**: real checkbox label and disabled submit state; disclosure meaning remains available without icons.
- **Motion**: none.

### Role Login Portal
- **Structure**: minimal brand nav, centered rounded login panel, two large role buttons, secondary role buttons, line illustration, and compact status line.
- **Variants**: desktop illustrated login stage; mobile single-column login panel without decorative illustration.
- **Spacing**: --space-5 to --space-10 page rhythm, --space-3 button gap, --space-6 auth panel padding.
- **States**: role buttons use subtle lift, warm border, focus, and active states; reset remains a secondary action.
- **Accessibility**: H1 names the login step; every role entry is a semantic button.
- **Motion**: button feedback only; route navigation is the state transition.

### Connected App Shell
- **Structure**: thin top navigation, warm page canvas, open page headers, and softened work panels only where framing is necessary.
- **Variants**: role-specific nav labels with the same shell; mobile stacks nav, account chip, and content.
- **Spacing**: --space-6 page gutter, --space-6 to --space-8 panel interiors.
- **Brand typography**: institution label uses the Korean-first sans stack; product title uses a clean sans weight, never a serif display face.
- **States**: primary actions use warm yellow, secondary actions use beige outline, selected chips use warm fill.
- **Accessibility**: visible focus rings use the warm accent; CJK headings use keep-all wrapping.
- **Motion**: no decorative motion; only button and navigation state feedback.

### Staff Program Ops
- **Structure**: staff draft form beside a management table for current calls.
- **Variants**: desktop two-column creation/management layout; mobile stacked panels.
- **Spacing**: --space-5 grid gap and form-panel field rhythm.
- **States**: draft creation appends an upcoming internal call; table uses existing status labels.
- **Accessibility**: every input has a visible label; management data remains semantic table content.
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

Mixed tonal-shift and border hierarchy. Shadows are minimal and only used for sticky navigation or modal-like callouts.

| Level | Treatment | Use |
| --- | --- | --- |
| Base | --surface-primary | Page canvas |
| Raised | --surface-secondary with --border-default | Tables and form panels |
| Highlight | --surface-elevated with accent border | Selected state and important status |
| Sticky | subtle shadow plus border | Header only |
