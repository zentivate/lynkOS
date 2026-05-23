import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  OrbitControls,
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
const LOCK_SCENE_LAYOUT = true;

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

const DEPTH_MULTIPLIER = 1;
const HEIGHT_MULTIPLIER = 2.99;
const CAMERA_PULL_FACTOR = 0.3;
const SILO_SPREAD_FACTOR = 1.2;
const SILO_Y_SPREAD_FACTOR = 0.55;
const SILO_GLOBAL_Y_OFFSET = 0.52;
const GLOBAL_Z_SHIFT = 3.2;
const INTRO_START_PROGRESS = 0.22;
const INTRO_END_PROGRESS = 1;
const INTRO_DAMPING = 7.5;
const SILO_SLIDE_DISTANCE_X = 8.6;
const SILO_STAGGER_STEP = 0.028;

function GlassModel({ controls, introTargetRef }) {
  const texturePaths = [
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
  const siloTextures = useTexture(texturePaths);
  const siloRefs = useRef([]);
  const introProgressRef = useRef(0);

  useFrame((_, delta) => {
    const targetProgress = introTargetRef.current;
    introProgressRef.current = THREE.MathUtils.damp(
      introProgressRef.current,
      targetProgress,
      INTRO_DAMPING,
      delta
    );

    const globalProgress = introProgressRef.current;
    const maxDelay = SILO_STAGGER_STEP * (siloTextures.length - 1);

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

      const localRaw = (globalProgress - SILO_STAGGER_STEP * i) / (1 - maxDelay);
      const local = THREE.MathUtils.clamp(localRaw, 0, 1);
      const eased = 1 - Math.pow(1 - local, 3);
      node.position.set(
        spreadX - (1 - eased) * SILO_SLIDE_DISTANCE_X,
        raisedY,
        pushedBackZ
      );
    }
  });

  for (const tex of siloTextures) {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.repeat.set(1, 1);
    tex.offset.set(0, 0);
    tex.needsUpdate = true;
  }

  return (
    <group scale={0.62}>
      <group
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
          <group
            key={texture.uuid}
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
        );
      })}
    </group>
  );
}

function ProblemSection() {
  const sectionRef = useRef(null);
  const orbitControlsRef = useRef(null);
  const introTargetRef = useRef(0);
  const [controls, setControls] = useState({
    textX: 0,
    textY: 1.28,
    textZ: 5.31,
    textScale: 1,
    siloX: 0.65,
    siloY: 1.39,
    siloZ: 5.15,
    siloScale: 1,
    siloGapX: 0.27,
    siloGapY: -0.16,
  });

  const updateControl = (key, value) => {
    if (LOCK_SCENE_LAYOUT) {
      return;
    }
    setControls((prev) => ({
      ...prev,
      [key]: Number(value),
    }));
  };

  useEffect(() => {
    const sectionNode = sectionRef.current;
    if (!sectionNode) {
      return undefined;
    }

    let rafId = 0;
    const updateIntroProgress = () => {
      const rect = sectionNode.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const raw = (viewportHeight - rect.top) / viewportHeight;
      const normalized =
        (raw - INTRO_START_PROGRESS) / (INTRO_END_PROGRESS - INTRO_START_PROGRESS);
      introTargetRef.current = THREE.MathUtils.clamp(normalized, 0, 1);
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateIntroProgress);
    };

    updateIntroProgress();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, []);

  return (
    <section className="problem-section" ref={sectionRef}>
      <div className="problem-visual" aria-label="3D glass effect">
        <Canvas camera={{ position: [0, 0, 10.5], fov: 44 }} style={{ background: "#000000" }}>
          <ambientLight intensity={0.35} />
          <directionalLight intensity={1.35} position={[0, 2, 3]} />
          <pointLight intensity={0.5} position={[-3, 1.5, 2]} color="#7a7a7a" />
          <gridHelper
            args={[18, 48, new THREE.Color("#3a3a3a"), new THREE.Color("#252525")]}
            position={[0, 0, -1.6]}
            rotation={[Math.PI / 2, 0, 0]}
          />
          <GlassModel controls={controls} introTargetRef={introTargetRef} />
          <OrbitControls
            ref={orbitControlsRef}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
          />
        </Canvas>
      </div>

      <div className="problem-controls-panel">
        <p>3D Controls</p>
        <button
          type="button"
          className="problem-controls-reset"
          onClick={() => orbitControlsRef.current?.reset()}
        >
          Reset Camera
        </button>
        {LOCK_SCENE_LAYOUT && <small>Text and silo layout locked</small>}

        <label>
          Text X <span>{controls.textX.toFixed(2)}</span>
          <input
            type="range"
            min="-6"
            max="6"
            step="0.01"
            value={controls.textX}
            disabled={LOCK_SCENE_LAYOUT}
            onChange={(event) => updateControl("textX", event.target.value)}
          />
        </label>

        <label>
          Text Y <span>{controls.textY.toFixed(2)}</span>
          <input
            type="range"
            min="-6"
            max="6"
            step="0.01"
            value={controls.textY}
            disabled={LOCK_SCENE_LAYOUT}
            onChange={(event) => updateControl("textY", event.target.value)}
          />
        </label>

        <label>
          Text Z <span>{controls.textZ.toFixed(2)}</span>
          <input
            type="range"
            min="-8"
            max="8"
            step="0.01"
            value={controls.textZ}
            disabled={LOCK_SCENE_LAYOUT}
            onChange={(event) => updateControl("textZ", event.target.value)}
          />
        </label>

        <label>
          Text Scale <span>{controls.textScale.toFixed(2)}</span>
          <input
            type="range"
            min="0.25"
            max="3"
            step="0.01"
            value={controls.textScale}
            disabled={LOCK_SCENE_LAYOUT}
            onChange={(event) => updateControl("textScale", event.target.value)}
          />
        </label>

        <label>
          Silos X <span>{controls.siloX.toFixed(2)}</span>
          <input
            type="range"
            min="-6"
            max="6"
            step="0.01"
            value={controls.siloX}
            disabled={LOCK_SCENE_LAYOUT}
            onChange={(event) => updateControl("siloX", event.target.value)}
          />
        </label>

        <label>
          Silos Y <span>{controls.siloY.toFixed(2)}</span>
          <input
            type="range"
            min="-6"
            max="6"
            step="0.01"
            value={controls.siloY}
            disabled={LOCK_SCENE_LAYOUT}
            onChange={(event) => updateControl("siloY", event.target.value)}
          />
        </label>

        <label>
          Silos Z <span>{controls.siloZ.toFixed(2)}</span>
          <input
            type="range"
            min="-8"
            max="8"
            step="0.01"
            value={controls.siloZ}
            disabled={LOCK_SCENE_LAYOUT}
            onChange={(event) => updateControl("siloZ", event.target.value)}
          />
        </label>

        <label>
          Silo Scale <span>{controls.siloScale.toFixed(2)}</span>
          <input
            type="range"
            min="0.25"
            max="3"
            step="0.01"
            value={controls.siloScale}
            disabled={LOCK_SCENE_LAYOUT}
            onChange={(event) => updateControl("siloScale", event.target.value)}
          />
        </label>

        <label>
          Silo Gap X <span>{controls.siloGapX.toFixed(2)}</span>
          <input
            type="range"
            min="-1.2"
            max="2.2"
            step="0.01"
            value={controls.siloGapX}
            disabled={LOCK_SCENE_LAYOUT}
            onChange={(event) => updateControl("siloGapX", event.target.value)}
          />
        </label>

        <label>
          Silo Gap Y <span>{controls.siloGapY.toFixed(2)}</span>
          <input
            type="range"
            min="-0.5"
            max="1.2"
            step="0.01"
            value={controls.siloGapY}
            disabled={LOCK_SCENE_LAYOUT}
            onChange={(event) => updateControl("siloGapY", event.target.value)}
          />
        </label>

        <pre>
{`const CONTROLS = {
  textX: ${controls.textX.toFixed(2)},
  textY: ${controls.textY.toFixed(2)},
  textZ: ${controls.textZ.toFixed(2)},
  textScale: ${controls.textScale.toFixed(2)},
  siloX: ${controls.siloX.toFixed(2)},
  siloY: ${controls.siloY.toFixed(2)},
  siloZ: ${controls.siloZ.toFixed(2)},
  siloScale: ${controls.siloScale.toFixed(2)},
  siloGapX: ${controls.siloGapX.toFixed(2)},
  siloGapY: ${controls.siloGapY.toFixed(2)},
};`}
        </pre>
      </div>
    </section>
  );
}

export default ProblemSection;
