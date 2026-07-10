# Shared

`shared` contains business-agnostic code only. The planned owners are `ui`,
`api`, `config`, `types`, and `lib`. Shared code must not import `app` or
`features`, and secrets must never enter client bundles.
