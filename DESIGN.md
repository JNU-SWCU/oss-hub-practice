# JNU OSS Platform Design System

## 1. Atmosphere & Identity

JNU OSS Platform feels like an institutional command center for campus open-source activity: official, calm, and immediately useful. The signature is a green service-hub surface where contests, repositories, student activity, and staff review status appear together without marketing noise.

## 2. Color

### Palette

| Role | Token | Light | Dark | Usage |
| --- | --- | --- | --- | --- |
| Surface/primary | --surface-primary | #FAFAFA | #121614 | Page background |
| Surface/secondary | --surface-secondary | #FFFFFF | #18201C | Workspace bands and tables |
| Surface/elevated | --surface-elevated | #F3F7F5 | #202A25 | Repeated cards and drawers |
| Text/primary | --text-primary | #1F2A24 | #F6FAF8 | Headings and core data |
| Text/secondary | --text-secondary | #506057 | #B8C6BE | Descriptions and labels |
| Text/tertiary | --text-tertiary | #7E8A84 | #809189 | Metadata and hints |
| Border/default | --border-default | #DDE7E2 | #314038 | Table and panel borders |
| Border/subtle | --border-subtle | #EDF3F0 | #24332C | Soft dividers |
| Accent/primary | --accent-primary | #008735 | #38CBB2 | Primary actions and selected state |
| Accent/hover | --accent-hover | #277546 | #66D8C8 | Hover and focus |
| Accent/secondary | --accent-secondary | #38CBB2 | #38CBB2 | Secondary status and charts |
| Status/success | --status-success | #168B4B | #41C77C | Approved and healthy |
| Status/warning | --status-warning | #B7791F | #F3C44D | Attention and pending |
| Status/error | --status-error | #C2413D | #F16D68 | Rejected and anomaly |
| Status/info | --status-info | #2B6CB0 | #62A3EA | Informational states |

### Rules

Green and teal are reserved for action, status, and data emphasis. Neutral administrative surfaces do most of the work. Red, yellow, and blue appear only as semantic status colors.

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
