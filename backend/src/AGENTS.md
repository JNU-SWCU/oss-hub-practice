# Backend Source Guidance

The first two levels are fixed as `modules`, `database`, and `common`.
Modules own bounded domain layers. Database owns infrastructure boundaries.
Common owns cross-cutting concerns. Do not create global controllers, services,
or repositories folders.
