# Repository Handoff

The JNU-SWCU repositories have been created:

- `https://github.com/JNU-SWCU/oss-hub`
- `https://github.com/JNU-SWCU/oss-hub-practice`

The local checkout keeps the existing `origin` remote and adds:

- `jnu` -> production repository
- `practice` -> practice repository

The checkout was intentionally not pushed automatically. The worktree contains
pre-existing intent-to-add, modified, deleted, and untracked files. Before the
first push, create a reviewed baseline commit that explicitly includes the
desired files; do not use `git add .` blindly. Push production first, then seed
the practice repository from the reviewed baseline without copying secrets,
Jenkins credentials, SSH keys, or production environment files.
