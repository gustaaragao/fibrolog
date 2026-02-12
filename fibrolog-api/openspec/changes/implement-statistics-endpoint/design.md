## Context

The FibroLog application frontend displays various statistics to patients regarding their fibromyalgia management. Currently, these statistics are based on mock data. This change introduces a real backend implementation using FastAPI and SQLAlchemy to aggregate patient-specific data from daily records, crises, symptoms, and pain regions.

## Goals / Non-Goals

**Goals:**
- Provide real-time health statistics for the authenticated patient.
- Ensure efficient data aggregation using SQLAlchemy.
- Implement a new router for statistics.
- Maintain consistency with existing async database patterns.

**Non-Goals:**
- Implementation of patient-facing charts (this is a frontend concern).
- Historical data snapshots or pre-calculated statistics (aggregations will be performed on request for now).
- Cross-patient statistics or administrative dashboards.

## Decisions

- **Async Aggregation**: All database queries will use `AsyncSession` to match the project's existing pattern.
- **Aggregation Strategy**: Statistics will be calculated using SQLAlchemy `func` aggregations (count, avg, max) to minimize data transfer between the database and application.
- **Streak Calculation**: The "current streak" of consecutive days will be calculated in Python after retrieving unique record dates from the database, as complex date-gap analysis is more maintainable in application logic than pure SQL for this scale.
- **Schema Separation**: A new `EstatisticasDashboard` Pydantic model will be created in `fibrolog_api/schemas/estatistica.py`.
- **Router Isolation**: A new `fibrolog_api/routers/estatisticas.py` will be created to keep statistics logic separate from core patient management.

## Risks / Trade-offs

- **[Risk] Query Performance** → As the number of records grows, counting and averaging across multiple joined tables might become slow.
  - **Mitigation**: Use indexed columns (like `paciente_id` and `data_hora`) and consider caching or pre-aggregation in the future if performance degrades.
- **[Risk] Null Handling** → New patients will have no records, which can lead to `null` results from `avg` or `count`.
  - **Mitigation**: Use `scalar_one_or_none()` and provide sensible defaults (0 or None) in the Pydantic response model.
- **[Trade-off] App-side Streak Calculation** → Retrieving all record dates to calculate the streak in Python is less efficient than a recursive CTE in SQL.
  - **Rationale**: Given the expected number of records per patient (hundreds to low thousands), the overhead is negligible compared to the increased complexity of maintainable SQL.
