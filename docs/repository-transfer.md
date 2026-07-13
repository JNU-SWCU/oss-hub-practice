# Repository Handoff

The JNU-SWCU repositories have been created:

- `https://github.com/JNU-SWCU/oss-hub`
- `https://github.com/JNU-SWCU/oss-hub-practice`

The local checkout keeps the existing `origin` remote and adds:

- `jnu` -> production repository
- `practice` -> practice repository

> Historical setup note: the original checkout was intentionally not pushed automatically while a reviewed baseline was prepared. The practice repository now has its own reviewed Vercel overlay; future changes should use normal reviewed commits without copying secrets, database credentials, personal access tokens, or production environment files.
