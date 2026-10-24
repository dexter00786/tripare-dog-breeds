# Performance report

> Screenshots should be captured on a simulator/device before submission and dropped into `assets/screenshots/`.

## Targets

| Metric | Target | Status |
|---|---|---|
| Cold start to interactive (cached) | &lt; 3s | Designed via AsyncStorage hydrate-before-network |
| List scroll | 60fps sustained | FlashList + thumb-only images |
| Memory under normal use | &lt; 150MB | Single catalog in memory; thumbs in list |

## Bundle size

Run after install:

```bash
npx react-native bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output /tmp/tripare.ios.jsbundle \
  --assets-dest /tmp/tripare-assets

ls -lh /tmp/tripare.ios.jsbundle
```

Record the production JS bundle size here (replace after local profiling):

| Artifact | Size |
|---|---|
| iOS JS bundle (prod) | _TBD — run command above_ |
| Main dependencies | RN 0.76, Navigation, Query, Redux Toolkit, FlashList, AsyncStorage, NetInfo |

## Profiling checklist

1. Load full 283-breed list after sync.
2. Scroll rapidly through grouped sections with Instruments / Flipper.
3. Capture:
   - FPS overlay during scroll → `assets/screenshots/perf-fps.png`
   - Memory graph during scroll → `assets/screenshots/perf-memory.png`
4. Paste observations:

| Scenario | FPS | Memory |
|---|---|---|
| Full list scroll | _TBD_ | _TBD_ |
| Filters applied | _TBD_ | _TBD_ |
| Gallery swipe | _TBD_ | _TBD_ |

## Known trade-offs

- AsyncStorage loads the whole catalog into JS memory (fine at 283, not a general pattern).
- Sequential page fetch prioritizes predictable memory over wall-clock sync time.
- List uses thumbnails only; gallery upgrades to medium on demand.
