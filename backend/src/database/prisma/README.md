# Prisma Boundary

Only this owner may instantiate or import the generated Prisma Client. Domain
repositories depend on an injected Prisma boundary and must map persistence
rows to domain-facing types. Controllers and services never import Prisma.
