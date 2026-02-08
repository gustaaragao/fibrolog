## Context

Currently, the `GET /registros-diarios/` endpoints return a shallow representation of `RegistroDiario`. The associated `RegistroSintoma` and `RegistroRegiaoDor` records are not fetched, requiring multiple round-trips if details were needed (which they aren't currently provided).

## Goals / Non-Goals

**Goals:**
- Update Pydantic schemas to include detailed lists of symptoms and pain regions.
- Use SQLAlchemy's `selectinload` to efficiently fetch relationships in a single (or few) optimized queries.
- Maintain compatibility with the existing frontend format for IDs and intensities.

**Non-Goals:**
- Modifying the POST logic.
- Adding filters or pagination at this stage (unless strictly necessary).

## Decisions

### 1. Schema Enrichment
We will update `RegistroDiarioPublic` to include:
- `symptoms: List[SymptomEntry]`
- `painRegions: List[PainRegionEntry]`

**Rationale:** This provides a self-contained object for the frontend to render the complete log details.

### 2. Efficient Data Fetching
We will use `selectinload` for fetching `sintomas` and `regioes_dor`.
```python
select(RegistroDiario).options(
    selectinload(RegistroDiario.sintomas),
    selectinload(RegistroDiario.regioes_dor)
)
```
**Rationale:** `selectinload` is generally better for 1:N relationships to avoid the N+1 problem while keeping the query logic clean and performant for small to medium sets of related data.

## Risks / Trade-offs

- **[Risk] Increased Payload Size** → Mitigation: Daily logs usually have few items (max 8 symptoms, 50 regions). The payload increase is negligible for modern networks.
- **[Risk] Performance impact of selectinload** → Mitigation: SQLAlchemy optimizes this with a second query using `IN`, which is efficient.
