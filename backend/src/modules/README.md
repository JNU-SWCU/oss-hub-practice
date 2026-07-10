# Modules

Create `modules/<domain>/` only for a confirmed bounded context. Each module
owns its Nest module, controller, DTOs, service, repository, and domain-facing
types. Dependency direction is controller -> service -> repository -> Prisma boundary.
