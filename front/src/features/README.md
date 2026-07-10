# Features

Create `features/<domain>/` only when the PRD names a bounded product domain.
Keep domain UI, client behavior, feature transport calls, and domain types here.
Expose a small public entrypoint; do not deep-import another feature's internals.
