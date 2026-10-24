# Technical decisions

## State management — Redux Toolkit

Normalized catalog lives in `breedsSlice` (`breedsById`, `groupsById`, sync flags). Filter UI state lives in `filtersSlice` so list interactions don’t thrash catalog updates. Typed hooks (`useAppDispatch` / `useAppSelector`) keep screens thin. Chose RTK for predictable actions, Immer reducers, and team familiarity vs Zustand/Context.

## Persistence — AsyncStorage (versioned JSON snapshot)

SQLite / WatermelonDB would be stronger for incremental queries, but AsyncStorage was chosen for delivery risk under a same-day deadline. Schema:

```ts
{
  version: 1,
  syncedAt: string,
  breeds: Breed[],
  groups: Group[]
}
```

Trade-off: full rewrite on sync vs. row-level SQL. Acceptable at 283 records (~single JSON blob). Called out for a production follow-up to migrate to SQLite if write amplification or selective invalidation becomes an issue.

## Server state — TanStack Query

Handles retries, refetch-on-reconnect, and a single `['catalog']` query that owns network assembly. Redux remains the source of truth for UI after hydrate/sync.

## List virtualization — FlashList

Rows are heavier than flat records (nested traits, coat, origin, up to 9 images). Perf work is about **payload richness per row**, not raw count (283). Mitigation:

- FlashList recycling + `getItemType` for headers vs rows
- List thumbnails use `thumb` only (defer medium/large)
- Memoized `BreedRow`
- Filters/search applied in memory after one merged catalog (no per-keystroke network)

## Pagination strategy

Pages are fetched sequentially (`page[size]=48`) until `meta.pagination.next` is null, then de-duped by id. Sequential fetch keeps peak memory predictable while assembling six pages into one dataset.

## Size bands

Derived from `male_weight.max` (kg):

| Band | Max weight |
|---|---|
| Small | &lt; 10 |
| Medium | 10–25 |
| Large | 25–45 |
| Giant | &gt; 45 |

## Navigation

React Navigation native stack (bare RN). Detail tabs are a lightweight local tab bar (Overview / Traits / Gallery) to avoid extra native tab dependencies under the deadline.

## Image caching

Rely on React Native image HTTP cache for thumbs/mediums. No large/full upgrade in list. Gallery shows attribution required by the API payload.
