# Problem Section Locked Baseline

This document captures the locked baseline for the 3D Problem section.

## Snapshot files

- Active file: `src/components/ProblemSection.js`
- Locked snapshot copy: `src/components/ProblemSection.locked.snapshot.js`

To restore exactly to this baseline:

```bash
cp src/components/ProblemSection.locked.snapshot.js src/components/ProblemSection.js
```

## Locked state

- `LOCK_SCENE_LAYOUT = true`
- Text and silo sliders are disabled in UI
- Camera orbit reset is available via the `Reset Camera` button

## Baseline control defaults

```js
const CONTROLS = {
  textX: 0.00,
  textY: 1.28,
  textZ: 5.31,
  textScale: 1.00,
  siloX: 0.65,
  siloY: 1.39,
  siloZ: 5.15,
  siloScale: 1.00,
  siloGapX: 0.27,
  siloGapY: -0.16,
};
```

## Baseline animation constants

```js
const INTRO_START_PROGRESS = 0.22;
const INTRO_END_PROGRESS = 1;
const INTRO_DAMPING = 7.5;
const SILO_SLIDE_DISTANCE_X = 8.6;
const SILO_STAGGER_STEP = 0.028;
```

## Baseline material constants

```js
const MATERIAL_PROPS = {
  thickness: 0.9,
  roughness: 0,
  transmission: 1,
  ior: 1.2,
  chromaticAberration: 0.14,
  backside: false,
};
```

## Notes

- Silo entrance is scroll-based (first viewport progress window), smoothed with `THREE.MathUtils.damp`.
- Silo layout and text layout values above are the currently locked defaults.
