# Frontend Guidance

- This package is the Next.js App Router surface.
- Keep route composition in `src/app`; feature behavior in `src/features/<domain>`;
  business-agnostic code in `src/shared/<concern>`.
- Do not add product domains until the PRD names the bounded context.
- `app -> features -> shared`; shared code imports neither app nor features.
- Root `front/app` and `front/pages` must not coexist with `front/src/app`.
