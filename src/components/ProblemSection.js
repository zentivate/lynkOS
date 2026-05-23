import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  OrbitControls,
  RoundedBox,
  Text,
  useTexture,
} from "@react-three/drei";
import { NETWORK_COLOR } from "./globe/GlobeNetwork";

const MATERIAL_PROPS = {
  thickness: 0.7,
  roughness: 0,
  transmission: 1,
  ior: 1.5,
  chromaticAberration: 0.14,
  backside: false,
};

const LYNK_MATERIAL_PROPS = {
  ...MATERIAL_PROPS,
  thickness: 0.22,
  chromaticAberration: 0.09,
};

function createBlobGeometry() {
  const width = 2.4;
  const height = 1.2;
  const rightRadius = height / 2;
  const leftRadius = 0.12;
  const xMin = -width / 2;
  const xRightArcCenter = width / 2 - rightRadius;
  const yTop = height / 2;
  const yBottom = -height / 2;

  const shape = new THREE.Shape();
  shape.moveTo(xMin + leftRadius, yTop);
  shape.lineTo(xRightArcCenter, yTop);
  shape.absarc(
    xRightArcCenter,
    0,
    rightRadius,
    Math.PI / 2,
    -Math.PI / 2,
    true
  );
  shape.lineTo(xMin + leftRadius, yBottom);
  shape.quadraticCurveTo(xMin, yBottom, xMin, yBottom + leftRadius);
  shape.lineTo(xMin, yTop - leftRadius);
  shape.quadraticCurveTo(xMin, yTop, xMin + leftRadius, yTop);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.18,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
    curveSegments: 48,
  });
  geometry.center();
  return geometry;
}

function createCardBlobGeometry() {
  const geometry = new THREE.ExtrudeGeometry(createCardBlobShape(), {
    depth: 0.18,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
    curveSegments: 48,
  });
  geometry.center();
  return geometry;
}

function createBlobShape() {
  const width = 2.4;
  const height = 1.2;
  const rightRadius = height / 2;
  const leftRadius = 0.12;
  const xMin = -width / 2;
  const xRightArcCenter = width / 2 - rightRadius;
  const yTop = height / 2;
  const yBottom = -height / 2;

  const shape = new THREE.Shape();
  shape.moveTo(xMin + leftRadius, yTop);
  shape.lineTo(xRightArcCenter, yTop);
  shape.absarc(
    xRightArcCenter,
    0,
    rightRadius,
    Math.PI / 2,
    -Math.PI / 2,
    true
  );
  shape.lineTo(xMin + leftRadius, yBottom);
  shape.quadraticCurveTo(xMin, yBottom, xMin, yBottom + leftRadius);
  shape.lineTo(xMin, yTop - leftRadius);
  shape.quadraticCurveTo(xMin, yTop, xMin + leftRadius, yTop);
  return shape;
}

function createCardBlobShape() {
  const width = 2.4;
  const height = 1.2;
  const edgeRadius = 0.16;
  const xMin = -width / 2;
  const xMax = width / 2;
  const yTop = height / 2;
  const yBottom = -height / 2;

  const shape = new THREE.Shape();
  shape.moveTo(xMin + edgeRadius, yTop);
  shape.lineTo(xMax - edgeRadius, yTop);
  shape.quadraticCurveTo(xMax, yTop, xMax, yTop - edgeRadius);
  shape.lineTo(xMax, yBottom + edgeRadius);
  shape.quadraticCurveTo(xMax, yBottom, xMax - edgeRadius, yBottom);
  shape.lineTo(xMin + edgeRadius, yBottom);
  shape.quadraticCurveTo(xMin, yBottom, xMin, yBottom + edgeRadius);
  shape.lineTo(xMin, yTop - edgeRadius);
  shape.quadraticCurveTo(xMin, yTop, xMin + edgeRadius, yTop);

  return shape;
}

function createRoundedRectShape(width, height, radius) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const clampedRadius = Math.min(radius, halfWidth, halfHeight);

  const shape = new THREE.Shape();
  shape.moveTo(-halfWidth + clampedRadius, halfHeight);
  shape.lineTo(halfWidth - clampedRadius, halfHeight);
  shape.absarc(
    halfWidth - clampedRadius,
    halfHeight - clampedRadius,
    clampedRadius,
    Math.PI / 2,
    0,
    true
  );
  shape.lineTo(halfWidth, -halfHeight + clampedRadius);
  shape.absarc(
    halfWidth - clampedRadius,
    -halfHeight + clampedRadius,
    clampedRadius,
    0,
    -Math.PI / 2,
    true
  );
  shape.lineTo(-halfWidth + clampedRadius, -halfHeight);
  shape.absarc(
    -halfWidth + clampedRadius,
    -halfHeight + clampedRadius,
    clampedRadius,
    -Math.PI / 2,
    -Math.PI,
    true
  );
  shape.lineTo(-halfWidth, halfHeight - clampedRadius);
  shape.absarc(
    -halfWidth + clampedRadius,
    halfHeight - clampedRadius,
    clampedRadius,
    Math.PI,
    Math.PI / 2,
    true
  );

  return shape;
}

function normalizeUVs(geometry) {
  geometry.computeBoundingBox();
  const bbox = geometry.boundingBox;
  if (!bbox) {
    return;
  }

  const size = new THREE.Vector3();
  bbox.getSize(size);
  const pos = geometry.attributes.position;
  const uv = geometry.attributes.uv;

  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    uv.setXY(i, (x - bbox.min.x) / size.x, (y - bbox.min.y) / size.y);
  }
  uv.needsUpdate = true;
}

const BLOB_SHAPE = createBlobShape();
const BLOB_GEOMETRY = createBlobGeometry();
const BLOB_FACE_GEOMETRY = new THREE.ShapeGeometry(BLOB_SHAPE);
BLOB_FACE_GEOMETRY.center();
normalizeUVs(BLOB_FACE_GEOMETRY);
const CARD_BLOB_SHAPE = createCardBlobShape();
const CARD_BLOB_GEOMETRY = createCardBlobGeometry();
const CARD_BLOB_FACE_GEOMETRY = new THREE.ShapeGeometry(CARD_BLOB_SHAPE);
CARD_BLOB_FACE_GEOMETRY.center();
normalizeUVs(CARD_BLOB_FACE_GEOMETRY);
const LYNK_FACE_SHAPE = createRoundedRectShape(5.38, 1.76, 0.24);
const LYNK_FACE_GEOMETRY = new THREE.ShapeGeometry(LYNK_FACE_SHAPE);
LYNK_FACE_GEOMETRY.center();
normalizeUVs(LYNK_FACE_GEOMETRY);

const ARC_LAYOUT = [
  [0.35, 0.72, -0.16],
  [1.15, 1.02, -0.22],
  [1.22, 0.38, -0.2],
  [0.52, 0.1, -0.18],
  [1.5, -0.22, -0.2],
  [0.5, -0.48, -0.18],
  [1.2, -0.82, -0.2],
  [0.12, -0.98, -0.16],
  [0.85, -1.28, -0.18],
];
const DUPLICATE_RECT_LAYOUT = [
  [0.72, 1.62, -0.18],
  [0.72, 1.08, -0.18],
  [0.72, 0.54, -0.18],
  [0.72, 0, -0.18],
  [0.72, -0.54, -0.18],
  [0.72, -1.08, -0.18],
  [0.72, -1.62, -0.18],
];
const LEFT_DUPLICATE_RECT_LAYOUT = [
  [-0.72, 1.62, -0.18],
  [-0.72, 1.08, -0.18],
  [-0.72, 0.54, -0.18],
  [-0.72, 0, -0.18],
  [-0.72, -0.54, -0.18],
];
const DUPLICATE_SILO_STACK_TOP_Y = 1.62;

const DEPTH_MULTIPLIER = 1;
const HEIGHT_MULTIPLIER = 2.99;
const CAMERA_PULL_FACTOR = 0.3;
const SILO_SPREAD_FACTOR = 1.2;
const SILO_Y_SPREAD_FACTOR = 0.55;
const SILO_GLOBAL_Y_OFFSET = 0.52;
const GLOBAL_Z_SHIFT = 3.2;
const INTRO_START_PROGRESS = 0.22;
const INTRO_END_PROGRESS = 1;
const SILO_SLIDE_DISTANCE_X = 8.6;
const SILO_STAGGER_STEP = 0.028;
const SCROLL_DAMPING = 9;
const STAGE2_LAYOUT_START = 1;
const STAGE2_LAYOUT_END = 1.46;
const STAGE2_FOLLOW_START = STAGE2_LAYOUT_END;
const STAGE2_FOLLOW_END = 2;
const FINAL_SILO_X = [-4.2, -3.12, -2.04, -0.96, 0.12, 1.2, 2.28, 3.36, 4.44];
const LOCKED_SILO_END_Y = 2.092;
const LOCKED_SILO_END_Z = 5.039;
const STAGE2_STAGGER_STEP = 0.045;
const STAGE2_SCROLL_FOLLOW_DOWN = 0;
const FLOW_LINE_RADIUS = 0.0055;
const CAMERA_Z_DEFAULT = 7.64;
const DUPLICATE_SILO_ARC_Y_OFFSET = -2.05;
const SIDE_COLUMN_SLIDE_DISTANCE = 6.4;
const FLOW_TUBE_START_DELAY = 0.18;
const FLOW_TUBE_STAGGER = 0.045;
const LYNK_ENTRY_START_Y = -4.1;
const LYNK_ENTRY_END_Y = -0.35;
const SILO_TEXTURE_PATHS = [
  "/textures/1.png",
  "/textures/2.png",
  "/textures/3.png",
  "/textures/4.png",
  "/textures/5.png",
  "/textures/6.png",
  "/textures/7.png",
  "/textures/8.png",
  "/textures/9.png",
];
const DUPLICATE_SILO_TEXTURE_PATHS = [
  "/textures/brands.png",
  "/textures/employers.png",
  "/textures/landlords.png",
  "/textures/travel providers.png",
  "/textures/recruiters.png",
  "/textures/universities.png",
  "/textures/businesses.png",
];
const LEFT_DUPLICATE_SILO_TEXTURE_PATHS = [
  "/textures/users.png",
  "/textures/companies.png",
  "/textures/travellers.png",
  "/textures/students.png",
  "/textures/job seeker.png",
];
const SOLUTION_TOP_CHIPS = [
  "Users",
  "Companies",
  "Students",
  "Travellers",
  "Job Seekers",
];
const SOLUTION_BOTTOM_CHIPS = [
  "Employers",
  "Landlords",
  "Travel providers",
  "Recruiters",
  "Brands",
  "Universities",
  "Businesses",
];
const SOLUTION_CHIP_DEPTH = 0.05;
const SHOW_SIDE_BLOCK_GROUPS = false;
const SHOW_MAIN_LYNK_BLOCK = false;
const SOLUTION_TOP_CHIP_TEXTURES = [
  "/textures/users.png",
  "/textures/companies.png",
  "/textures/students.png",
  "/textures/travellers.png",
  "/textures/job seeker.png",
];
const SOLUTION_BOTTOM_CHIP_TEXTURES = [
  "/textures/employers.png",
  "/textures/landlords.png",
  "/textures/travel providers.png",
  "/textures/recruiters.png",
  "/textures/brands.png",
  "/textures/universities.png",
  "/textures/businesses.png",
];

function GlassModel({ controls, scrollTargetRef, scrollTune, sideBlockControls }) {
  const siloTextures = useTexture(SILO_TEXTURE_PATHS);
  const duplicateSiloTextures = useTexture(DUPLICATE_SILO_TEXTURE_PATHS);
  const leftDuplicateSiloTextures = useTexture(LEFT_DUPLICATE_SILO_TEXTURE_PATHS);
  const lynkTexture = useTexture("/textures/lynk.png");
  const topChipTextures = useTexture(
    SOLUTION_TOP_CHIP_TEXTURES.filter(Boolean)
  );
  const bottomChipTextures = useTexture(SOLUTION_BOTTOM_CHIP_TEXTURES);
  const siloRefs = useRef([]);
  const scrollProgressRef = useRef(0);
  const sceneRootRef = useRef(null);
  const textGroupRef = useRef(null);
  const phase2TextGroupRef = useRef(null);
  const solutionGroupRef = useRef(null);
  const centerStandaloneCardRef = useRef(null);
  const bottomChipsRef = useRef(null);
  const leftFlowMeshRefs = useRef([]);
  const leftFlowGeometryRefs = useRef([]);
  const leftFlowMaterialRefs = useRef([]);
  const rightFlowMeshRefs = useRef([]);
  const rightFlowGeometryRefs = useRef([]);
  const rightFlowMaterialRefs = useRef([]);
  const duplicateSiloRefs = useRef([]);
  const leftDuplicateSiloRefs = useRef([]);
  const leftColumnFlowCurves = useMemo(() => {
    const count = leftDuplicateSiloTextures.length;
    const lynkCardBaseScale = 0.352 * controls.siloScale * 1.08;
    const lynkHalfWidth = 1.2 * lynkCardBaseScale * controls.lynkCardScaleX;
    const lynkHalfHeight = 0.6 * lynkCardBaseScale * controls.lynkCardScaleY;

    return leftDuplicateSiloTextures.map((_, index) => {
      const [layoutX, , layoutZ] = LEFT_DUPLICATE_RECT_LAYOUT[index] ?? [-0.72, 0, -0.18];
      const layoutY = DUPLICATE_SILO_STACK_TOP_Y - index * controls.leftDuplicateSiloGapY;
      const normalizedIndex =
        count > 1 ? index / (count - 1) - 0.5 : 0;
      const startX =
        layoutX * 2.08 +
        0.85 +
        controls.siloX +
        controls.leftDuplicateSiloX +
        controls.leftFlowStartX;
      const startY =
        layoutY * 2.26 +
        SILO_GLOBAL_Y_OFFSET +
        controls.siloY +
        DUPLICATE_SILO_ARC_Y_OFFSET +
        controls.leftDuplicateSiloY +
        controls.leftFlowStartY -
        normalizedIndex * controls.leftFlowStartSpread;
      const startZ =
        (layoutZ - 0.18) * DEPTH_MULTIPLIER * CAMERA_PULL_FACTOR +
        GLOBAL_Z_SHIFT +
        controls.siloZ +
        controls.leftDuplicateSiloZ +
        controls.leftFlowStartZ;
      const endX = 0.15 + controls.lynkCardX - lynkHalfWidth + controls.leftFlowEndX;
      const endY =
        -0.35 +
        controls.lynkCardY +
        controls.leftFlowEndY -
        normalizedIndex * lynkHalfHeight * controls.leftFlowEndSpread;
      const endZ = scrollTune.lynkZEnd + controls.lynkCardZ + controls.leftFlowEndZ;

      return new THREE.CatmullRomCurve3([
        new THREE.Vector3(startX, startY, startZ),
        new THREE.Vector3(
          THREE.MathUtils.lerp(startX, endX, 0.28) + controls.leftFlowCurveX,
          startY +
            controls.leftFlowCurveY -
            normalizedIndex * controls.leftFlowOuterBulgeSpread,
          THREE.MathUtils.lerp(startZ, endZ, 0.2) + controls.leftFlowCurveZ
        ),
        new THREE.Vector3(
          THREE.MathUtils.lerp(startX, endX, 0.72) + controls.leftFlowCurveX * 0.3,
          endY +
            controls.leftFlowCurveY * 0.28 -
            normalizedIndex * controls.leftFlowBulgeSpread * 0.47,
          THREE.MathUtils.lerp(startZ, endZ, 0.78) + controls.leftFlowCurveZ * 0.3
        ),
        new THREE.Vector3(endX, endY, endZ),
      ]);
    });
  }, [
    leftDuplicateSiloTextures,
    controls.leftDuplicateSiloGapY,
    controls.siloX,
    controls.siloY,
    controls.siloZ,
    controls.siloScale,
    controls.leftDuplicateSiloX,
    controls.leftDuplicateSiloY,
    controls.leftDuplicateSiloZ,
    controls.lynkCardX,
    controls.lynkCardY,
    controls.lynkCardZ,
    controls.lynkCardScaleX,
    controls.lynkCardScaleY,
    controls.leftFlowStartX,
    controls.leftFlowStartY,
    controls.leftFlowStartZ,
    controls.leftFlowStartSpread,
    controls.leftFlowEndX,
    controls.leftFlowEndY,
    controls.leftFlowEndZ,
    controls.leftFlowEndSpread,
    controls.leftFlowCurveX,
    controls.leftFlowCurveY,
    controls.leftFlowCurveZ,
    controls.leftFlowOuterBulgeSpread,
    controls.leftFlowBulgeSpread,
    scrollTune.lynkZEnd,
  ]);
  const rightColumnFlowCurves = useMemo(() => {
    const count = duplicateSiloTextures.length;
    const lynkCardBaseScale = 0.352 * controls.siloScale * 1.08;
    const lynkHalfWidth = 1.2 * lynkCardBaseScale * controls.lynkCardScaleX;
    const lynkHalfHeight = 0.6 * lynkCardBaseScale * controls.lynkCardScaleY;

    return duplicateSiloTextures.map((_, index) => {
      const [layoutX, , layoutZ] = DUPLICATE_RECT_LAYOUT[index] ?? [0.72, 0, -0.18];
      const layoutY = DUPLICATE_SILO_STACK_TOP_Y - index * controls.duplicateSiloGapY;
      const normalizedIndex = count > 1 ? index / (count - 1) - 0.5 : 0;
      const startX = 0.15 + controls.lynkCardX + lynkHalfWidth + controls.rightFlowStartX;
      const startY =
        -0.35 +
        controls.lynkCardY +
        controls.rightFlowStartY -
        normalizedIndex * lynkHalfHeight * controls.rightFlowStartSpread;
      const startZ = scrollTune.lynkZEnd + controls.lynkCardZ + controls.rightFlowStartZ;
      const endX =
        layoutX * 2.08 +
        0.85 +
        controls.siloX +
        controls.duplicateSiloX +
        controls.rightFlowEndX;
      const endY =
        layoutY * 2.26 +
        SILO_GLOBAL_Y_OFFSET +
        controls.siloY +
        DUPLICATE_SILO_ARC_Y_OFFSET +
        controls.duplicateSiloY +
        controls.rightFlowEndY -
        normalizedIndex * controls.rightFlowEndSpread;
      const endZ =
        (layoutZ - 0.18) * DEPTH_MULTIPLIER * CAMERA_PULL_FACTOR +
        GLOBAL_Z_SHIFT +
        controls.siloZ +
        controls.duplicateSiloZ +
        controls.rightFlowEndZ;

      return new THREE.CatmullRomCurve3([
        new THREE.Vector3(startX, startY, startZ),
        new THREE.Vector3(
          THREE.MathUtils.lerp(startX, endX, 0.28) + controls.rightFlowCurveX,
          startY +
            controls.rightFlowCurveY -
            normalizedIndex * controls.rightFlowOuterBulgeSpread,
          THREE.MathUtils.lerp(startZ, endZ, 0.2) + controls.rightFlowCurveZ
        ),
        new THREE.Vector3(
          THREE.MathUtils.lerp(startX, endX, 0.72) + controls.rightFlowCurveX * 0.3,
          endY +
            controls.rightFlowCurveY * 0.28 -
            normalizedIndex * controls.rightFlowBulgeSpread * 0.47,
          THREE.MathUtils.lerp(startZ, endZ, 0.78) + controls.rightFlowCurveZ * 0.3
        ),
        new THREE.Vector3(endX, endY, endZ),
      ]);
    });
  }, [
    duplicateSiloTextures,
    controls.duplicateSiloGapY,
    controls.siloX,
    controls.siloY,
    controls.siloZ,
    controls.siloScale,
    controls.duplicateSiloX,
    controls.duplicateSiloY,
    controls.duplicateSiloZ,
    controls.lynkCardX,
    controls.lynkCardY,
    controls.lynkCardZ,
    controls.lynkCardScaleX,
    controls.lynkCardScaleY,
    controls.rightFlowStartX,
    controls.rightFlowStartY,
    controls.rightFlowStartZ,
    controls.rightFlowStartSpread,
    controls.rightFlowEndX,
    controls.rightFlowEndY,
    controls.rightFlowEndZ,
    controls.rightFlowEndSpread,
    controls.rightFlowCurveX,
    controls.rightFlowCurveY,
    controls.rightFlowCurveZ,
    controls.rightFlowOuterBulgeSpread,
    controls.rightFlowBulgeSpread,
    scrollTune.lynkZEnd,
  ]);

  useFrame((_, delta) => {
    const targetProgress = scrollTargetRef.current;
    scrollProgressRef.current = THREE.MathUtils.damp(
      scrollProgressRef.current,
      targetProgress,
      SCROLL_DAMPING,
      delta
    );

    const smoothedProgress = scrollProgressRef.current;
    const rawProgress = targetProgress;
    const stage1Raw =
      (smoothedProgress - INTRO_START_PROGRESS) /
      (INTRO_END_PROGRESS - INTRO_START_PROGRESS);
    const stage1Progress = THREE.MathUtils.clamp(stage1Raw, 0, 1);
    const layoutRange = Math.max(0.001, scrollTune.layoutEnd - scrollTune.layoutStart);
    const followRange = Math.max(0.001, scrollTune.followEnd - scrollTune.followStart);
    const stage2LayoutRaw = (smoothedProgress - scrollTune.layoutStart) / layoutRange;
    const stage2LayoutProgress = THREE.MathUtils.clamp(stage2LayoutRaw, 0, 1);
    const stage2Ease = 1 - Math.pow(1 - stage2LayoutProgress, 3);
    // Follow phase is direct scroll-mapping (no extra damp/ease) for tighter sync.
    const stage2FollowRaw = (rawProgress - scrollTune.followStart) / followRange;
    const stage2FollowProgress = THREE.MathUtils.clamp(stage2FollowRaw, 0, 1);
    const maxDelay = SILO_STAGGER_STEP * (siloTextures.length - 1);
    const stage2MaxDelay = STAGE2_STAGGER_STEP * (siloTextures.length - 1);
    const finalZ = scrollTune.siloEndZ;

    if (sceneRootRef.current) {
      sceneRootRef.current.position.y =
        -stage2FollowProgress * scrollTune.followDownStrength;
    }

    if (textGroupRef.current) {
      const textBaseX = -2.52 + controls.textX;
      const textBaseY = 0.16 * HEIGHT_MULTIPLIER + controls.textY;
      const textBaseZ =
        (-1.05 * DEPTH_MULTIPLIER) * CAMERA_PULL_FACTOR + GLOBAL_Z_SHIFT + controls.textZ;
      textGroupRef.current.position.set(
        textBaseX - stage2Ease * 4.8,
        textBaseY + stage2Ease * 0.36,
        THREE.MathUtils.lerp(textBaseZ, scrollTune.phase2TextZ, stage2Ease)
      );
    }

    if (phase2TextGroupRef.current) {
      phase2TextGroupRef.current.visible = stage2LayoutProgress > 0.08;
      phase2TextGroupRef.current.position.set(
        0,
        THREE.MathUtils.lerp(-2.42, -1.05, stage2Ease),
        THREE.MathUtils.lerp(6.8, 8.05, stage2Ease)
      );
    }

    if (solutionGroupRef.current) {
      solutionGroupRef.current.visible =
        SHOW_MAIN_LYNK_BLOCK && stage2LayoutProgress > 0.02;
      solutionGroupRef.current.position.set(
        0.15,
        THREE.MathUtils.lerp(LYNK_ENTRY_START_Y, LYNK_ENTRY_END_Y, stage2Ease),
        THREE.MathUtils.lerp(scrollTune.lynkZStart, scrollTune.lynkZEnd, stage2Ease)
      );
      solutionGroupRef.current.scale.setScalar(THREE.MathUtils.lerp(0.88, 1, stage2Ease));
    }

    if (centerStandaloneCardRef.current) {
      centerStandaloneCardRef.current.visible = stage2LayoutProgress > 0.02;
      centerStandaloneCardRef.current.position.set(
        0.15 + controls.lynkCardX,
        THREE.MathUtils.lerp(LYNK_ENTRY_START_Y, LYNK_ENTRY_END_Y, stage2Ease) +
          controls.lynkCardY,
        THREE.MathUtils.lerp(scrollTune.lynkZStart, scrollTune.lynkZEnd, stage2Ease) +
          controls.lynkCardZ
      );
      centerStandaloneCardRef.current.rotation.set(
        controls.lynkCardRotX,
        controls.lynkCardRotY,
        controls.lynkCardRotZ
      );
      const lynkCardBaseScale =
        0.352 * controls.siloScale * THREE.MathUtils.lerp(0.96, 1.08, stage2Ease);
      centerStandaloneCardRef.current.scale.set(
        lynkCardBaseScale * controls.lynkCardScaleX,
        lynkCardBaseScale * controls.lynkCardScaleY,
        lynkCardBaseScale
      );
    }

    if (bottomChipsRef.current) {
      bottomChipsRef.current.visible =
        SHOW_SIDE_BLOCK_GROUPS && stage2LayoutProgress > 0.08;
      bottomChipsRef.current.position.set(
        3.18 + sideBlockControls.rightColumnX,
        THREE.MathUtils.lerp(-3.2, -0.42, stage2Ease) + sideBlockControls.rightColumnY,
        THREE.MathUtils.lerp(scrollTune.bottomZStart, scrollTune.bottomZEnd, stage2Ease)
      );
      bottomChipsRef.current.scale.setScalar(THREE.MathUtils.lerp(0.92, 1, stage2Ease));
    }

    for (let i = 0; i < siloRefs.current.length; i += 1) {
      const node = siloRefs.current[i];
      if (!node) {
        continue;
      }

      const [x, y, z] = ARC_LAYOUT[i] ?? [0, 0, -0.2];
      const xCenter = 0.85;
      const spreadX =
        (x - xCenter) * (SILO_SPREAD_FACTOR + controls.siloGapX) +
        xCenter +
        controls.siloX;
      const raisedY =
        y * HEIGHT_MULTIPLIER * (SILO_Y_SPREAD_FACTOR + controls.siloGapY) +
        SILO_GLOBAL_Y_OFFSET +
        controls.siloY;
      const pushedBackZ =
        (z - 0.18) * DEPTH_MULTIPLIER * CAMERA_PULL_FACTOR +
        GLOBAL_Z_SHIFT +
        controls.siloZ;

      const localRaw = (stage1Progress - SILO_STAGGER_STEP * i) / (1 - maxDelay);
      const local = THREE.MathUtils.clamp(localRaw, 0, 1);
      const eased = 1 - Math.pow(1 - local, 3);
      const introX = spreadX - (1 - eased) * SILO_SLIDE_DISTANCE_X;
      const finalX = scrollTune.siloEndX[i] ?? spreadX;
      const finalY = scrollTune.siloEndY;
      const stage2LocalRaw =
        (stage2LayoutProgress - STAGE2_STAGGER_STEP * i) / (1 - stage2MaxDelay);
      const stage2Local = THREE.MathUtils.clamp(stage2LocalRaw, 0, 1);
      const stage2LocalEase = 1 - Math.pow(1 - stage2Local, 3);
      const t = stage2Local - 1;
      const c1 = 1.70158;
      const c3 = c1 + 1;
      const stage2LandingEase = 1 + c3 * t * t * t + c1 * t * t;

      node.position.set(
        THREE.MathUtils.lerp(introX, finalX, stage2LandingEase),
        THREE.MathUtils.lerp(raisedY, finalY, stage2LandingEase),
        THREE.MathUtils.lerp(pushedBackZ, finalZ, stage2LocalEase)
      );
      node.rotation.set(0, 0, THREE.MathUtils.lerp(0, Math.PI / 2, stage2LocalEase));
      const dynamicScale =
        0.352 * controls.siloScale * THREE.MathUtils.lerp(1, 1.16, stage2LocalEase);
      node.scale.set(dynamicScale, dynamicScale, dynamicScale);

    }

    const leftColumnMaxDelay =
      STAGE2_STAGGER_STEP * Math.max(0, leftDuplicateSiloTextures.length - 1);
    for (let i = 0; i < leftDuplicateSiloRefs.current.length; i += 1) {
      const node = leftDuplicateSiloRefs.current[i];
      if (!node) {
        continue;
      }

      const [layoutX, , layoutZ] = LEFT_DUPLICATE_RECT_LAYOUT[i] ?? [0, 0, -0.18];
      const layoutY = DUPLICATE_SILO_STACK_TOP_Y - i * controls.leftDuplicateSiloGapY;
      const finalX =
        layoutX * 2.08 + 0.85 + controls.siloX + controls.leftDuplicateSiloX;
      const finalY =
        layoutY * 2.26 +
        SILO_GLOBAL_Y_OFFSET +
        controls.siloY +
        DUPLICATE_SILO_ARC_Y_OFFSET +
        controls.leftDuplicateSiloY;
      const finalNodeZ =
        (layoutZ - 0.18) * DEPTH_MULTIPLIER * CAMERA_PULL_FACTOR +
        GLOBAL_Z_SHIFT +
        controls.siloZ +
        controls.leftDuplicateSiloZ;
      const stage2LocalRaw =
        (stage2LayoutProgress - STAGE2_STAGGER_STEP * i) / (1 - leftColumnMaxDelay);
      const stage2Local = THREE.MathUtils.clamp(stage2LocalRaw, 0, 1);
      const stage2LocalEase = 1 - Math.pow(1 - stage2Local, 3);

      node.visible = stage2LayoutProgress > 0.02;
      node.position.set(
        THREE.MathUtils.lerp(finalX - SIDE_COLUMN_SLIDE_DISTANCE, finalX, stage2LocalEase),
        finalY,
        finalNodeZ
      );
      node.rotation.set(
        controls.leftDuplicateSiloRotX,
        controls.leftDuplicateSiloRotY,
        controls.leftDuplicateSiloRotZ
      );
      node.scale.setScalar(0.352 * controls.siloScale);
    }

    const rightColumnMaxDelay =
      STAGE2_STAGGER_STEP * Math.max(0, duplicateSiloTextures.length - 1);
    for (let i = 0; i < duplicateSiloRefs.current.length; i += 1) {
      const node = duplicateSiloRefs.current[i];
      if (!node) {
        continue;
      }

      const [layoutX, , layoutZ] = DUPLICATE_RECT_LAYOUT[i] ?? [0, 0, -0.18];
      const layoutY = DUPLICATE_SILO_STACK_TOP_Y - i * controls.duplicateSiloGapY;
      const finalX =
        layoutX * 2.08 + 0.85 + controls.siloX + controls.duplicateSiloX;
      const finalY =
        layoutY * 2.26 +
        SILO_GLOBAL_Y_OFFSET +
        controls.siloY +
        DUPLICATE_SILO_ARC_Y_OFFSET +
        controls.duplicateSiloY;
      const finalNodeZ =
        (layoutZ - 0.18) * DEPTH_MULTIPLIER * CAMERA_PULL_FACTOR +
        GLOBAL_Z_SHIFT +
        controls.siloZ +
        controls.duplicateSiloZ;
      const stage2LocalRaw =
        (stage2LayoutProgress - STAGE2_STAGGER_STEP * i) / (1 - rightColumnMaxDelay);
      const stage2Local = THREE.MathUtils.clamp(stage2LocalRaw, 0, 1);
      const stage2LocalEase = 1 - Math.pow(1 - stage2Local, 3);

      node.visible = stage2LayoutProgress > 0.02;
      node.position.set(
        THREE.MathUtils.lerp(finalX + SIDE_COLUMN_SLIDE_DISTANCE, finalX, stage2LocalEase),
        finalY,
        finalNodeZ
      );
      node.rotation.set(
        controls.duplicateSiloRotX,
        controls.duplicateSiloRotY,
        controls.duplicateSiloRotZ
      );
      node.scale.setScalar(0.352 * controls.siloScale);
    }

    for (let i = 0; i < leftFlowMeshRefs.current.length; i += 1) {
      const mesh = leftFlowMeshRefs.current[i];
      const geometry = leftFlowGeometryRefs.current[i];
      const material = leftFlowMaterialRefs.current[i];
      if (!mesh || !geometry || !material) {
        continue;
      }

      const flowMaxDelay =
        FLOW_TUBE_STAGGER * Math.max(0, leftDuplicateSiloTextures.length - 1);
      const flowRaw =
        (stage2LayoutProgress - FLOW_TUBE_START_DELAY - FLOW_TUBE_STAGGER * i) /
        (1 - FLOW_TUBE_START_DELAY - flowMaxDelay);
      const flowProgress = THREE.MathUtils.clamp(flowRaw, 0, 1);
      const flowEase = 1 - Math.pow(1 - flowProgress, 3);
      const maxDrawCount = geometry.index
        ? geometry.index.count
        : geometry.attributes.position.count;

      mesh.visible = flowProgress > 0;
      material.opacity = THREE.MathUtils.lerp(0, 0.92, flowEase);
      geometry.setDrawRange(0, Math.max(2, Math.floor(maxDrawCount * flowEase)));
    }
    for (let i = 0; i < rightFlowMeshRefs.current.length; i += 1) {
      const mesh = rightFlowMeshRefs.current[i];
      const geometry = rightFlowGeometryRefs.current[i];
      const material = rightFlowMaterialRefs.current[i];
      if (!mesh || !geometry || !material) {
        continue;
      }

      const flowMaxDelay =
        FLOW_TUBE_STAGGER * Math.max(0, duplicateSiloTextures.length - 1);
      const flowRaw =
        (stage2LayoutProgress - FLOW_TUBE_START_DELAY - FLOW_TUBE_STAGGER * i) /
        (1 - FLOW_TUBE_START_DELAY - flowMaxDelay);
      const flowProgress = THREE.MathUtils.clamp(flowRaw, 0, 1);
      const flowEase = 1 - Math.pow(1 - flowProgress, 3);
      const maxDrawCount = geometry.index
        ? geometry.index.count
        : geometry.attributes.position.count;

      mesh.visible = flowProgress > 0;
      material.opacity = THREE.MathUtils.lerp(0, 0.92, flowEase);
      geometry.setDrawRange(0, Math.max(2, Math.floor(maxDrawCount * flowEase)));
    }
  });

  for (const tex of [
    ...siloTextures,
    ...duplicateSiloTextures,
    ...leftDuplicateSiloTextures,
  ]) {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.repeat.set(1, 1);
    tex.offset.set(0, 0);
    tex.needsUpdate = true;
  }

  lynkTexture.colorSpace = THREE.SRGBColorSpace;
  lynkTexture.anisotropy = 8;
  lynkTexture.wrapS = THREE.ClampToEdgeWrapping;
  lynkTexture.wrapT = THREE.ClampToEdgeWrapping;
  lynkTexture.repeat.set(1, 1);
  lynkTexture.offset.set(0, 0);
  lynkTexture.needsUpdate = true;

  const chipTextures = [...topChipTextures, ...bottomChipTextures];
  for (const tex of chipTextures) {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.repeat.set(1, 1);
    tex.offset.set(0, 0);
    tex.needsUpdate = true;
  }

  return (
    <group ref={sceneRootRef} scale={0.62}>
      <group
        ref={textGroupRef}
        scale={controls.textScale}
        position={[
          -2.52 + controls.textX,
          0.16 * HEIGHT_MULTIPLIER + controls.textY,
          (-1.05 * DEPTH_MULTIPLIER) * CAMERA_PULL_FACTOR +
            GLOBAL_Z_SHIFT +
            controls.textZ,
        ]}
      >
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.075}
          color={NETWORK_COLOR}
          toneMapped={false}
          fontWeight={300}
          anchorX="left"
          anchorY="middle"
          maxWidth={1.9}
          fillOpacity={1}
        >
          The problem
        </Text>
        <Text
          position={[0, 0.29, 0]}
          fontSize={0.165}
          color="white"
          fontWeight={300}
          anchorX="left"
          anchorY="top"
          maxWidth={2.15}
          lineHeight={1.2}
          fillOpacity={1}
        >
          Everything is trapped in silos
        </Text>
        <Text
          position={[0, -0.14, 0]}
          fontSize={0.068}
          color="white"
          fontWeight={300}
          anchorX="left"
          anchorY="top"
          maxWidth={2.15}
          lineHeight={1.5}
          fillOpacity={1}
        >
          Today, supply is everywhere. Jobs live on job boards. Rooms live on
          property sites. Services live in marketplaces. Local offers live in
          WhatsApp groups. AI agents can answer questions, but they cannot
          easily act across these disconnected systems.
        </Text>
      </group>

      <group ref={phase2TextGroupRef} visible={false} position={[0, -2.42, 6.8]}>
        <Text
          position={[0, 0.26, 0]}
          fontSize={0.165}
          color="white"
          fontWeight={300}
          anchorX="center"
          anchorY="top"
          maxWidth={5.2}
          lineHeight={1.2}
          fillOpacity={1}
          textAlign="center"
        >
          Lynk is the layer underneath
        </Text>
        <Text
          position={[0, -0.06, 0]}
          fontSize={0.068}
          color="white"
          fontWeight={300}
          anchorX="center"
          anchorY="top"
          maxWidth={6.2}
          lineHeight={1.5}
          fillOpacity={1}
          textAlign="center"
        >
          Lynk sits underneath apps and agents as the verified supply and communication
          layer. Anyone can connect. Lynk structures, verifies, translates, routes,
          and makes supply discoverable.
        </Text>
      </group>

      {siloTextures.map((texture, i) => {
        const [x, y, z] = ARC_LAYOUT[i] ?? [0, 0, -0.2];
        const xCenter = 0.85;
        const spreadX =
          (x - xCenter) * (SILO_SPREAD_FACTOR + controls.siloGapX) +
          xCenter +
          controls.siloX;
        const raisedY =
          y * HEIGHT_MULTIPLIER * (SILO_Y_SPREAD_FACTOR + controls.siloGapY) +
          SILO_GLOBAL_Y_OFFSET +
          controls.siloY;
        const pushedBackZ =
          (z - 0.18) * DEPTH_MULTIPLIER * CAMERA_PULL_FACTOR +
          GLOBAL_Z_SHIFT +
          controls.siloZ;

        return (
          <group key={texture.uuid}>
            <group
              ref={(node) => {
                siloRefs.current[i] = node;
              }}
              position={[spreadX - SILO_SLIDE_DISTANCE_X, raisedY, pushedBackZ]}
              scale={0.352 * controls.siloScale}
            >
              <mesh geometry={BLOB_GEOMETRY}>
                <MeshTransmissionMaterial {...MATERIAL_PROPS} />
              </mesh>
              <mesh geometry={BLOB_FACE_GEOMETRY} position={[0, 0, 0.093]} renderOrder={2}>
                <meshBasicMaterial
                  map={texture}
                  transparent
                  opacity={0.72}
                  toneMapped={false}
                  depthWrite={false}
                  side={THREE.DoubleSide}
                  polygonOffset
                  polygonOffsetFactor={-2}
                />
              </mesh>
            </group>

          </group>
        );
      })}

      {duplicateSiloTextures.map((texture, i) => {
        const [layoutX, , layoutZ] = DUPLICATE_RECT_LAYOUT[i] ?? [0, 0, -0.18];
        const layoutY = DUPLICATE_SILO_STACK_TOP_Y - i * controls.duplicateSiloGapY;
        const spreadX =
          layoutX * 2.08 + 0.85 + controls.siloX + controls.duplicateSiloX;
        const raisedY =
          layoutY * 2.26 +
          SILO_GLOBAL_Y_OFFSET +
          controls.siloY +
          DUPLICATE_SILO_ARC_Y_OFFSET +
          controls.duplicateSiloY;
        const pushedBackZ =
          (layoutZ - 0.18) * DEPTH_MULTIPLIER * CAMERA_PULL_FACTOR +
          GLOBAL_Z_SHIFT +
          controls.siloZ +
          controls.duplicateSiloZ;

        return (
          <group
            key={`${texture.uuid}-duplicate-card`}
            ref={(node) => {
              duplicateSiloRefs.current[i] = node;
            }}
            visible={false}
            position={[spreadX, raisedY, pushedBackZ]}
            rotation={[
              controls.duplicateSiloRotX,
              controls.duplicateSiloRotY,
              controls.duplicateSiloRotZ,
            ]}
            scale={0.352 * controls.siloScale}
          >
            <mesh geometry={CARD_BLOB_GEOMETRY}>
              <MeshTransmissionMaterial {...MATERIAL_PROPS} />
            </mesh>
            <mesh geometry={CARD_BLOB_FACE_GEOMETRY} position={[0, 0, 0.093]} renderOrder={2}>
              <meshBasicMaterial
                map={texture}
                transparent
                opacity={0.72}
                toneMapped={false}
                depthWrite={false}
                side={THREE.DoubleSide}
                polygonOffset
                polygonOffsetFactor={-2}
              />
            </mesh>
          </group>
        );
      })}

      {leftDuplicateSiloTextures.map((texture, i) => {
        const [layoutX, , layoutZ] = LEFT_DUPLICATE_RECT_LAYOUT[i] ?? [0, 0, -0.18];
        const layoutY = DUPLICATE_SILO_STACK_TOP_Y - i * controls.leftDuplicateSiloGapY;
        const spreadX =
          layoutX * 2.08 + 0.85 + controls.siloX + controls.leftDuplicateSiloX;
        const raisedY =
          layoutY * 2.26 +
          SILO_GLOBAL_Y_OFFSET +
          controls.siloY +
          DUPLICATE_SILO_ARC_Y_OFFSET +
          controls.leftDuplicateSiloY;
        const pushedBackZ =
          (layoutZ - 0.18) * DEPTH_MULTIPLIER * CAMERA_PULL_FACTOR +
          GLOBAL_Z_SHIFT +
          controls.siloZ +
          controls.leftDuplicateSiloZ;

        return (
          <group
            key={`${texture.uuid}-left-duplicate-card`}
            ref={(node) => {
              leftDuplicateSiloRefs.current[i] = node;
            }}
            visible={false}
            position={[spreadX, raisedY, pushedBackZ]}
            rotation={[
              controls.leftDuplicateSiloRotX,
              controls.leftDuplicateSiloRotY,
              controls.leftDuplicateSiloRotZ,
            ]}
            scale={0.352 * controls.siloScale}
          >
            <mesh geometry={CARD_BLOB_GEOMETRY}>
              <MeshTransmissionMaterial {...MATERIAL_PROPS} />
            </mesh>
            <mesh geometry={CARD_BLOB_FACE_GEOMETRY} position={[0, 0, 0.093]} renderOrder={2}>
              <meshBasicMaterial
                map={texture}
                transparent
                opacity={0.72}
                toneMapped={false}
                depthWrite={false}
                side={THREE.DoubleSide}
                polygonOffset
                polygonOffsetFactor={-2}
              />
            </mesh>
          </group>
        );
      })}

      {leftColumnFlowCurves.map((curve, index) => (
        <mesh
          key={`left-flow-${index}`}
          ref={(node) => {
            leftFlowMeshRefs.current[index] = node;
          }}
          visible={false}
          renderOrder={1}
        >
          <tubeGeometry
            ref={(node) => {
              leftFlowGeometryRefs.current[index] = node;
            }}
            args={[
              curve,
              64,
              Math.max(0.001, controls.leftFlowRadius),
              8,
              false,
            ]}
          />
          <meshBasicMaterial
            ref={(node) => {
              leftFlowMaterialRefs.current[index] = node;
            }}
            color={NETWORK_COLOR}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
      {rightColumnFlowCurves.map((curve, index) => (
        <mesh
          key={`right-flow-${index}`}
          ref={(node) => {
            rightFlowMeshRefs.current[index] = node;
          }}
          visible={false}
          renderOrder={1}
        >
          <tubeGeometry
            ref={(node) => {
              rightFlowGeometryRefs.current[index] = node;
            }}
            args={[
              curve,
              64,
              Math.max(0.001, controls.rightFlowRadius),
              8,
              false,
            ]}
          />
          <meshBasicMaterial
            ref={(node) => {
              rightFlowMaterialRefs.current[index] = node;
            }}
            color={NETWORK_COLOR}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}

      <group
        ref={solutionGroupRef}
        visible={SHOW_MAIN_LYNK_BLOCK}
        position={[0.15, LYNK_ENTRY_START_Y, 2.2]}
      >
        <RoundedBox args={[5.55, 1.9, 0.08]} radius={0.28} smoothness={10}>
          <MeshTransmissionMaterial {...LYNK_MATERIAL_PROPS} side={THREE.FrontSide} />
        </RoundedBox>
        <mesh geometry={LYNK_FACE_GEOMETRY} position={[0, 0, 0.091]} renderOrder={10}>
          <meshBasicMaterial
            map={lynkTexture}
            transparent
            opacity={0.72}
            toneMapped={false}
            depthWrite={false}
            side={THREE.FrontSide}
            polygonOffset
            polygonOffsetFactor={-2}
          />
        </mesh>

        <group
          visible={SHOW_SIDE_BLOCK_GROUPS}
          position={[
            -3.9 + sideBlockControls.leftColumnX,
            0.08 + sideBlockControls.leftColumnY,
            0.09,
          ]}
        >
          {SOLUTION_TOP_CHIPS.map((label, index) => {
            const y = 0.88 - index * sideBlockControls.leftColumnGap;
            const texturePath = SOLUTION_TOP_CHIP_TEXTURES[index];
            const textureIndex = SOLUTION_TOP_CHIP_TEXTURES.slice(0, index).filter(Boolean).length;
            const texture = texturePath ? topChipTextures[textureIndex] : null;
            return (
              <group key={label} position={[0, y, 0]}>
                <RoundedBox
                  args={[
                    sideBlockControls.blockWidth,
                    sideBlockControls.blockHeight,
                    SOLUTION_CHIP_DEPTH,
                  ]}
                  radius={0.08}
                  smoothness={6}
                >
                  <MeshTransmissionMaterial {...MATERIAL_PROPS} />
                </RoundedBox>
                {texture ? (
                  <mesh position={[0, 0, 0.03]} renderOrder={2}>
                    <planeGeometry
                      args={[sideBlockControls.blockWidth * 0.9, sideBlockControls.blockHeight * 0.67]}
                    />
                    <meshBasicMaterial
                      map={texture}
                      transparent
                      opacity={0.72}
                      toneMapped={false}
                      depthWrite={false}
                      side={THREE.FrontSide}
                      polygonOffset
                      polygonOffsetFactor={-2}
                    />
                  </mesh>
                ) : (
                  <Text
                    position={[0, 0, 0.03]}
                    fontSize={0.047}
                    color="#444444"
                    anchorX="center"
                    anchorY="middle"
                  >
                    {label}
                  </Text>
                )}
              </group>
            );
          })}
        </group>

      </group>

      <group
        ref={centerStandaloneCardRef}
        visible={false}
        position={[0.15, LYNK_ENTRY_START_Y, 2.2]}
      >
        <mesh geometry={CARD_BLOB_GEOMETRY}>
          <MeshTransmissionMaterial {...MATERIAL_PROPS} />
        </mesh>
        <mesh geometry={CARD_BLOB_FACE_GEOMETRY} position={[0, 0, 0.093]} renderOrder={2}>
          <meshBasicMaterial
            map={lynkTexture}
            transparent
            opacity={0.72}
            toneMapped={false}
            depthWrite={false}
            side={THREE.DoubleSide}
            polygonOffset
            polygonOffsetFactor={-2}
          />
        </mesh>
      </group>

      <group
        ref={bottomChipsRef}
        visible={false}
        position={[
          3.18 + sideBlockControls.rightColumnX,
          -3.2 + sideBlockControls.rightColumnY,
          2,
        ]}
      >
        <group visible={SHOW_SIDE_BLOCK_GROUPS} position={[-0.84, 1.02, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.1, 0.18, 28]} />
            <meshBasicMaterial color={NETWORK_COLOR} side={THREE.DoubleSide} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.005]}>
            <ringGeometry args={[0.03, 0.085, 24]} />
            <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
          </mesh>
        </group>
        {SOLUTION_BOTTOM_CHIPS.map((label, index) => (
          <group
            key={label}
            visible={SHOW_SIDE_BLOCK_GROUPS}
            position={[0, 0.78 - index * sideBlockControls.rightColumnGap, 0]}
          >
            <RoundedBox
              args={[
                sideBlockControls.blockWidth,
                sideBlockControls.blockHeight,
                SOLUTION_CHIP_DEPTH,
              ]}
              radius={0.09}
              smoothness={6}
            >
              <MeshTransmissionMaterial {...MATERIAL_PROPS} />
            </RoundedBox>
            <mesh position={[0, 0, 0.03]} renderOrder={2}>
              <planeGeometry
                args={[sideBlockControls.blockWidth * 0.9, sideBlockControls.blockHeight * 0.67]}
              />
              <meshBasicMaterial
                map={bottomChipTextures[index]}
                transparent
                opacity={0.72}
                toneMapped={false}
                depthWrite={false}
                side={THREE.FrontSide}
                polygonOffset
                polygonOffsetFactor={-2}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function ScrollLinkedGrid({ scrollTargetRef, scrollTune }) {
  const gridRef = useRef(null);

  useFrame(() => {
    const followRange = Math.max(0.001, scrollTune.followEnd - scrollTune.followStart);
    const stage2FollowRaw = (scrollTargetRef.current - scrollTune.followStart) / followRange;
    const stage2FollowProgress = THREE.MathUtils.clamp(stage2FollowRaw, 0, 1);

    if (gridRef.current) {
      gridRef.current.position.y =
        -stage2FollowProgress *
        scrollTune.followDownStrength *
        scrollTune.gridYAmplification;
    }
  });

  return (
    <group ref={gridRef} position={[0, 0, scrollTune.gridZ]}>
      <gridHelper
        args={[18, 48, new THREE.Color("#3a3a3a"), new THREE.Color("#252525")]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

function ScrollProgressDriver({ sectionRef, scrollTargetRef }) {
  const sectionTopRef = useRef(0);
  const viewportHeightRef = useRef(1);

  useEffect(() => {
    const sectionNode = sectionRef.current;
    if (!sectionNode) {
      return undefined;
    }

    const updateMetrics = () => {
      sectionTopRef.current = sectionNode.offsetTop || 0;
      viewportHeightRef.current = window.innerHeight || 1;
    };

    updateMetrics();
    window.addEventListener("resize", updateMetrics);

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateMetrics);
      resizeObserver.observe(sectionNode);
    }

    return () => {
      window.removeEventListener("resize", updateMetrics);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [sectionRef]);

  useFrame(() => {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    const viewportHeight = viewportHeightRef.current || 1;
    const sectionTop = sectionTopRef.current || 0;
    const raw = (scrollY + viewportHeight - sectionTop) / viewportHeight;
    scrollTargetRef.current = THREE.MathUtils.clamp(raw, 0, 4);
  });

  return null;
}

function ControlField({ label, value, min, max, step, onChange, precision = 3 }) {
  return (
    <label>
      {label} <span>{Number(value).toFixed(precision)}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function ControlSection({ title, defaultOpen = false, children }) {
  return (
    <details className="problem-controls-accordion" open={defaultOpen}>
      <summary>{title}</summary>
      <div className="problem-controls-group">{children}</div>
    </details>
  );
}

function ProblemSection() {
  const sectionRef = useRef(null);
  const orbitControlsRef = useRef(null);
  const scrollTargetRef = useRef(0);
  const [orbitEnabled, setOrbitEnabled] = useState(true);
  const [phase2Controls, setPhase2Controls] = useState({
    siloEndCenterX: -0.106,
    siloEndGapX: 0.594,
    siloEndY: 2.51,
    siloEndZ: 1.723,
    lynkZStart: 3.5,
    lynkZEnd: 4.754,
    bottomZStart: 2.0,
    bottomZEnd: 4.854,
    phase2TextZ: 8.195,
    gridZ: -1.6,
    followDownStrength: STAGE2_SCROLL_FOLLOW_DOWN,
  });
  const [controls, setControls] = useState({
    textX: -0.18,
    textY: -0.43,
    textZ: 5.31,
    textScale: 1,
    siloX: 0.65,
    siloY: -0.3,
    siloZ: 4.81,
    siloScale: 1,
    siloGapX: 0.27,
    siloGapY: -0.16,
    duplicateSiloX: 0.749,
    duplicateSiloY: 0.347,
    duplicateSiloZ: -2.353,
    duplicateSiloGapY: 0.242,
    duplicateSiloRotX: 0,
    duplicateSiloRotY: -0.314,
    duplicateSiloRotZ: 0,
    leftDuplicateSiloX: -3.931,
    leftDuplicateSiloY: -0.273,
    leftDuplicateSiloZ: -2.353,
    leftDuplicateSiloGapY: 0.242,
    leftDuplicateSiloRotX: 0,
    leftDuplicateSiloRotY: 0.379,
    leftDuplicateSiloRotZ: 0,
    lynkCardX: -0.188,
    lynkCardY: 0.806,
    lynkCardZ: 1.902,
    lynkCardRotX: 0,
    lynkCardRotY: 0,
    lynkCardRotZ: 0,
    lynkCardScaleX: 3.28,
    lynkCardScaleY: 2.572,
    leftFlowStartX: 0.462,
    leftFlowStartY: 0.007,
    leftFlowStartZ: 0,
    leftFlowStartSpread: 0,
    leftFlowEndX: -0.017,
    leftFlowEndY: 0.003,
    leftFlowEndZ: 0,
    leftFlowEndSpread: 0.431,
    leftFlowCurveX: 0.211,
    leftFlowCurveY: -0.055,
    leftFlowCurveZ: 0.042,
    leftFlowOuterBulgeSpread: -0.68,
    leftFlowBulgeSpread: 0.591,
    leftFlowRadius: FLOW_LINE_RADIUS,
    rightFlowStartX: 0.017,
    rightFlowStartY: 0.04,
    rightFlowStartZ: 0,
    rightFlowStartSpread: 0.506,
    rightFlowEndX: -0.462,
    rightFlowEndY: 0,
    rightFlowEndZ: 0,
    rightFlowEndSpread: 0,
    rightFlowCurveX: 0.371,
    rightFlowCurveY: -0.026,
    rightFlowCurveZ: -0.189,
    rightFlowOuterBulgeSpread: 0.539,
    rightFlowBulgeSpread: -1.127,
    rightFlowRadius: FLOW_LINE_RADIUS,
  });
  const [sideBlockControls, setSideBlockControls] = useState({
    blockWidth: 0.908,
    blockHeight: 0.404,
    leftColumnX: -0.553,
    leftColumnY: 0,
    rightColumnX: 0.913,
    rightColumnY: 0.962,
    leftColumnGap: 0.625,
    rightColumnGap: 0.577,
  });

  const updateControl = (key, value) => {
    setControls((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };
  const updatePhase2Control = (key, value) => {
    setPhase2Controls((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };
  const updateSideBlockControl = (key, value) => {
    setSideBlockControls((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };
  const safeNumber = (value, fallback) => (Number.isFinite(value) ? value : fallback);

  const scrollTune = {
    layoutStart: STAGE2_LAYOUT_START,
    layoutEnd: STAGE2_LAYOUT_END,
    followStart: STAGE2_FOLLOW_START,
    followEnd: STAGE2_FOLLOW_END,
    gridYAmplification: 1.37,
    ...phase2Controls,
    siloEndX: FINAL_SILO_X.map((_, index) => {
      const middleIndex = (FINAL_SILO_X.length - 1) / 2;
      return (
        safeNumber(phase2Controls.siloEndCenterX, 0.12) +
        (index - middleIndex) * safeNumber(phase2Controls.siloEndGapX, 1.08)
      );
    }),
    siloEndY: safeNumber(phase2Controls.siloEndY, LOCKED_SILO_END_Y),
    siloEndZ: safeNumber(phase2Controls.siloEndZ, LOCKED_SILO_END_Z),
    lynkZStart: safeNumber(phase2Controls.lynkZStart, 2.2),
    lynkZEnd: safeNumber(phase2Controls.lynkZEnd, 3.0),
    bottomZStart: safeNumber(phase2Controls.bottomZStart, 2.0),
    bottomZEnd: safeNumber(phase2Controls.bottomZEnd, 2.85),
    phase2TextZ: safeNumber(
      phase2Controls.phase2TextZ,
      (-1.05 * DEPTH_MULTIPLIER) * CAMERA_PULL_FACTOR + GLOBAL_Z_SHIFT + controls.textZ
    ),
    gridZ: safeNumber(phase2Controls.gridZ, -1.6),
    followDownStrength: safeNumber(
      phase2Controls.followDownStrength,
      STAGE2_SCROLL_FOLLOW_DOWN
    ),
  };

  const textFields = [
    ["textX", "X"],
    ["textY", "Y"],
    ["textZ", "Z"],
    ["textScale", "Scale", 0.2, 4],
  ];
  const siloFields = [
    ["siloX", "X"],
    ["siloY", "Y"],
    ["siloZ", "Z"],
    ["siloScale", "Scale", 0.2, 4],
    ["siloGapX", "Gap X"],
    ["siloGapY", "Gap Y"],
  ];
  const leftColumnFields = [
    ["leftDuplicateSiloX", "X"],
    ["leftDuplicateSiloY", "Y"],
    ["leftDuplicateSiloZ", "Z"],
    ["leftDuplicateSiloGapY", "Gap Y"],
    ["leftDuplicateSiloRotX", "Rot X", -3.142, 3.142],
    ["leftDuplicateSiloRotY", "Rot Y", -3.142, 3.142],
    ["leftDuplicateSiloRotZ", "Rot Z", -3.142, 3.142],
  ];
  const rightColumnFields = [
    ["duplicateSiloX", "X"],
    ["duplicateSiloY", "Y"],
    ["duplicateSiloZ", "Z"],
    ["duplicateSiloGapY", "Gap Y"],
    ["duplicateSiloRotX", "Rot X", -3.142, 3.142],
    ["duplicateSiloRotY", "Rot Y", -3.142, 3.142],
    ["duplicateSiloRotZ", "Rot Z", -3.142, 3.142],
  ];
  const lynkFields = [
    ["lynkCardX", "X"],
    ["lynkCardY", "Y"],
    ["lynkCardZ", "Z"],
    ["lynkCardRotX", "Rot X", -3.142, 3.142],
    ["lynkCardRotY", "Rot Y", -3.142, 3.142],
    ["lynkCardRotZ", "Rot Z", -3.142, 3.142],
    ["lynkCardScaleX", "Width", 0.2, 4],
    ["lynkCardScaleY", "Height", 0.2, 4],
  ];
  const leftFlowFields = [
    ["leftFlowStartX", "Start X"],
    ["leftFlowStartY", "Start Y"],
    ["leftFlowStartZ", "Start Z"],
    ["leftFlowStartSpread", "Start Spread"],
    ["leftFlowEndX", "End X"],
    ["leftFlowEndY", "End Y"],
    ["leftFlowEndZ", "End Z"],
    ["leftFlowEndSpread", "End Spread"],
    ["leftFlowCurveX", "Curve X"],
    ["leftFlowCurveY", "Curve Y"],
    ["leftFlowCurveZ", "Curve Z"],
    ["leftFlowOuterBulgeSpread", "Outer Bulge Spread"],
    ["leftFlowBulgeSpread", "Bulge Spread"],
    ["leftFlowRadius", "Radius", 0.001, 0.08, 0.0005, 4],
  ];
  const rightFlowFields = [
    ["rightFlowStartX", "Start X"],
    ["rightFlowStartY", "Start Y"],
    ["rightFlowStartZ", "Start Z"],
    ["rightFlowStartSpread", "Start Spread"],
    ["rightFlowEndX", "End X"],
    ["rightFlowEndY", "End Y"],
    ["rightFlowEndZ", "End Z"],
    ["rightFlowEndSpread", "End Spread"],
    ["rightFlowCurveX", "Curve X"],
    ["rightFlowCurveY", "Curve Y"],
    ["rightFlowCurveZ", "Curve Z"],
    ["rightFlowOuterBulgeSpread", "Outer Bulge Spread"],
    ["rightFlowBulgeSpread", "Bulge Spread"],
    ["rightFlowRadius", "Radius", 0.001, 0.08, 0.0005, 4],
  ];
  const sideLayoutFields = [
    ["blockWidth", "Block Width", 0.2, 3],
    ["blockHeight", "Block Height", 0.2, 3],
    ["leftColumnX", "Left Group X"],
    ["leftColumnY", "Left Group Y"],
    ["leftColumnGap", "Left Group Gap", 0.05, 2],
    ["rightColumnX", "Right Group X"],
    ["rightColumnY", "Right Group Y"],
    ["rightColumnGap", "Right Group Gap", 0.05, 2],
  ];
  const phase2Fields = [
    ["siloEndCenterX", "Silo End Center X"],
    ["siloEndGapX", "Silo End Gap X", 0.1, 3],
    ["siloEndY", "Silo End Y"],
    ["siloEndZ", "Silo End Z"],
    ["lynkZStart", "Lynk Z Start"],
    ["lynkZEnd", "Lynk Z End"],
    ["bottomZStart", "Bottom Z Start"],
    ["bottomZEnd", "Bottom Z End"],
    ["phase2TextZ", "Phase 2 Text Z"],
    ["gridZ", "Grid Z"],
    ["followDownStrength", "Follow Down Strength", -4, 4],
  ];


  return (
    <section className="problem-section" ref={sectionRef}>
      <div className="problem-stage-pin">
        <div className="problem-visual" aria-label="3D glass effect">
          <Canvas
            camera={{ position: [0, 0, CAMERA_Z_DEFAULT], fov: 44 }}
            style={{ background: "#000000" }}
          >
            <ScrollProgressDriver sectionRef={sectionRef} scrollTargetRef={scrollTargetRef} />
            <ambientLight intensity={0.35} />
            <directionalLight intensity={1.35} position={[0, 2, 3]} />
            <pointLight intensity={0.5} position={[-3, 1.5, 2]} color="#7a7a7a" />
            <ScrollLinkedGrid scrollTargetRef={scrollTargetRef} scrollTune={scrollTune} />
            <GlassModel
              controls={controls}
              scrollTargetRef={scrollTargetRef}
              scrollTune={scrollTune}
              sideBlockControls={sideBlockControls}
            />
            <OrbitControls
              ref={orbitControlsRef}
              enablePan={false}
              enabled={false}
              enableDamping
              dampingFactor={0.08}
            />
          </Canvas>
        </div>
      </div>

      <div className="problem-controls-panel" style={{ display: "none" }}>
        <p>3D Controls</p>
        <ControlSection title="Camera" defaultOpen>
          <label className="problem-controls-toggle">
            Orbit Controls <span>{orbitEnabled ? "ON" : "OFF"}</span>
            <input
              type="checkbox"
              checked={orbitEnabled}
              onChange={(event) => setOrbitEnabled(event.target.checked)}
            />
          </label>
          <button
            type="button"
            className="problem-controls-reset"
            onClick={() => orbitControlsRef.current?.reset()}
          >
            Reset Camera
          </button>
        </ControlSection>

        <ControlSection title="Left Flow Tube" defaultOpen>
          {leftFlowFields.map(([key, label, min = -4, max = 4, step = 0.001, precision = 3]) => (
            <ControlField
              key={key}
              label={label}
              value={controls[key]}
              min={min}
              max={max}
              step={step}
              precision={precision}
              onChange={(value) => updateControl(key, value)}
            />
          ))}
        </ControlSection>

        <ControlSection title="Right Flow Tube" defaultOpen>
          {rightFlowFields.map(([key, label, min = -4, max = 4, step = 0.001, precision = 3]) => (
            <ControlField
              key={key}
              label={label}
              value={controls[key]}
              min={min}
              max={max}
              step={step}
              precision={precision}
              onChange={(value) => updateControl(key, value)}
            />
          ))}
        </ControlSection>

        <ControlSection title="Lynk Block">
          {lynkFields.map(([key, label, min = -4, max = 4, step = 0.001]) => (
            <ControlField
              key={key}
              label={label}
              value={controls[key]}
              min={min}
              max={max}
              step={step}
              onChange={(value) => updateControl(key, value)}
            />
          ))}
        </ControlSection>

        <ControlSection title="Main Silo Arc">
          {siloFields.map(([key, label, min = -4, max = 4, step = 0.001]) => (
            <ControlField
              key={key}
              label={label}
              value={controls[key]}
              min={min}
              max={max}
              step={step}
              onChange={(value) => updateControl(key, value)}
            />
          ))}
        </ControlSection>

        <ControlSection title="Left Column Blocks">
          {leftColumnFields.map(([key, label, min = -4, max = 4, step = 0.001]) => (
            <ControlField
              key={key}
              label={label}
              value={controls[key]}
              min={min}
              max={max}
              step={step}
              onChange={(value) => updateControl(key, value)}
            />
          ))}
        </ControlSection>

        <ControlSection title="Right Column Blocks">
          {rightColumnFields.map(([key, label, min = -4, max = 4, step = 0.001]) => (
            <ControlField
              key={key}
              label={label}
              value={controls[key]}
              min={min}
              max={max}
              step={step}
              onChange={(value) => updateControl(key, value)}
            />
          ))}
        </ControlSection>

        <ControlSection title="Text Block">
          {textFields.map(([key, label, min = -4, max = 4, step = 0.001]) => (
            <ControlField
              key={key}
              label={label}
              value={controls[key]}
              min={min}
              max={max}
              step={step}
              onChange={(value) => updateControl(key, value)}
            />
          ))}
        </ControlSection>

        <ControlSection title="Side Block Layout">
          {sideLayoutFields.map(([key, label, min = -4, max = 4, step = 0.001]) => (
            <ControlField
              key={key}
              label={label}
              value={sideBlockControls[key]}
              min={min}
              max={max}
              step={step}
              onChange={(value) => updateSideBlockControl(key, value)}
            />
          ))}
        </ControlSection>

        <ControlSection title="Phase 2 / Scroll Tune">
          {phase2Fields.map(([key, label, min = -4, max = 6, step = 0.001]) => (
            <ControlField
              key={key}
              label={label}
              value={phase2Controls[key]}
              min={min}
              max={max}
              step={step}
              onChange={(value) => updatePhase2Control(key, value)}
            />
          ))}
        </ControlSection>

      </div>
    </section>
  );
}

export default ProblemSection;
