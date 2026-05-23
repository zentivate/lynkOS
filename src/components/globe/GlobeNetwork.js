import React, { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

const BG = "#ffffff";
const HOLOGRAM = "#000000";
export const NETWORK_COLOR = "#39ff14";
const EARTH_MASK = "/textures/earth-land-mask.jpg";
const GLOBE_RADIUS = 2.25;
const ASSEMBLY_DURATION = 1.5;
const NETWORK_EDGE_DURATION = 0.45;
const NETWORK_LINE_RADIUS = 0.0125;
const NETWORK_CURVE_SEGMENTS = 18;
const INTERACTION_RADIUS = 0.6;
const INTERACTION_SURFACE_OFFSET = 0.04;
const INTERACTION_FLYOUT_DISTANCE = 3.0;
const INTERACTION_SCALE_BOOST = 0;
const INTERACTION_FALLOFF_POWER = 2.38;
const INTERACTION_TANGENT_AMOUNT = 0.7;
const INTERACTION_RANDOM_AMOUNT = 0.975;
const INTERACTION_EASE_IN = 6.708;
const INTERACTION_EASE_OUT = 2.081;
const MARKER_INNER_RADIUS = 0.1;
const MARKER_OUTER_RADIUS = 0.2;
const MARKER_PULSE_SPEED = 6;
const MARKER_PULSE_AMPLITUDE = 0.14;

const DEFAULT_INTERACTION_SETTINGS = {
  enabled: true,
  radius: INTERACTION_RADIUS,
  flyoutDistance: INTERACTION_FLYOUT_DISTANCE,
  scaleBoost: INTERACTION_SCALE_BOOST,
  falloffPower: INTERACTION_FALLOFF_POWER,
  tangentAmount: INTERACTION_TANGENT_AMOUNT,
  randomAmount: INTERACTION_RANDOM_AMOUNT,
  easeInSpeed: INTERACTION_EASE_IN,
  easeOutSpeed: INTERACTION_EASE_OUT,
  markerOffset: INTERACTION_SURFACE_OFFSET,
  markerInnerRadius: MARKER_INNER_RADIUS,
  markerOuterRadius: MARKER_OUTER_RADIUS,
  markerPulseSpeed: MARKER_PULSE_SPEED,
  markerPulseAmplitude: MARKER_PULSE_AMPLITUDE,
};

const NETWORK_CITIES = [
  { id: "london", name: "London", lat: 51.5074, lon: -0.1278 },
  { id: "paris", name: "Paris", lat: 48.8566, lon: 2.3522 },
  { id: "amsterdam", name: "Amsterdam", lat: 52.3676, lon: 4.9041 },
  { id: "barcelona", name: "Barcelona", lat: 41.3874, lon: 2.1686 },
  { id: "milan", name: "Milan", lat: 45.4642, lon: 9.19 },
  { id: "berlin", name: "Berlin", lat: 52.52, lon: 13.405 },
  { id: "munich", name: "Munich", lat: 48.1351, lon: 11.582 },
  { id: "zurich", name: "Zurich", lat: 47.3769, lon: 8.5417 },
  { id: "vienna", name: "Vienna", lat: 48.2082, lon: 16.3738 },
  { id: "boston", name: "Boston", lat: 42.3601, lon: -71.0589 },
  { id: "new-york", name: "New York", lat: 40.7128, lon: -74.006 },
  { id: "toronto", name: "Toronto", lat: 43.6532, lon: -79.3832 },
  { id: "singapore", name: "Singapore", lat: 1.3521, lon: 103.8198 },
  { id: "seoul", name: "Seoul", lat: 37.5665, lon: 126.978 },
  { id: "tokyo", name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { id: "melbourne", name: "Melbourne", lat: -37.8136, lon: 144.9631 },
  { id: "sydney", name: "Sydney", lat: -33.8688, lon: 151.2093 },
  { id: "mumbai", name: "Mumbai", lat: 19.076, lon: 72.8777 },
  { id: "delhi", name: "Delhi", lat: 28.6139, lon: 77.209 },
  { id: "bengaluru", name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { id: "lahore", name: "Lahore", lat: 31.5497, lon: 74.3436 },
  { id: "dhaka", name: "Dhaka", lat: 23.8103, lon: 90.4125 },
];

const NETWORK_CONNECTIONS = [
  { from: "london", to: "paris", offset: 0.0 },
  { from: "london", to: "amsterdam", offset: 0.12 },
  { from: "paris", to: "barcelona", offset: 0.16 },
  { from: "paris", to: "milan", offset: 0.26 },
  { from: "amsterdam", to: "berlin", offset: 0.18 },
  { from: "berlin", to: "munich", offset: 0.18 },
  { from: "munich", to: "zurich", offset: 0.16 },
  { from: "munich", to: "vienna", offset: 0.28 },
  { from: "london", to: "boston", offset: 0.34 },
  { from: "boston", to: "new-york", offset: 0.18 },
  { from: "new-york", to: "toronto", offset: 0.18 },
  { from: "london", to: "singapore", offset: 0.48 },
  { from: "singapore", to: "seoul", offset: 0.18 },
  { from: "seoul", to: "tokyo", offset: 0.18 },
  { from: "singapore", to: "melbourne", offset: 0.3 },
  { from: "melbourne", to: "sydney", offset: 0.16 },
  { from: "london", to: "mumbai", offset: 0.42 },
  { from: "mumbai", to: "delhi", offset: 0.18 },
  { from: "delhi", to: "bengaluru", offset: 0.18 },
  { from: "delhi", to: "lahore", offset: 0.28 },
  { from: "delhi", to: "dhaka", offset: 0.38 },
];

function latLonToVector3(lat, lon, radius) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(180 - lon);

  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function buildSurfaceArcPoints(start, end, segments, baseRadius) {
  const startDir = start.clone().normalize();
  const endDir = end.clone().normalize();
  const dot = THREE.MathUtils.clamp(startDir.dot(endDir), -1, 1);
  const angle = Math.acos(dot);
  const sinTotal = Math.sin(angle);
  const points = [];
  const arcLift = 0.045 + angle * 0.055;

  for (let index = 0; index <= segments; index += 1) {
    const t = index / segments;
    let direction;

    if (sinTotal < 0.0001) {
      direction = startDir.clone().lerp(endDir, t).normalize();
    } else {
      const startWeight = Math.sin((1 - t) * angle) / sinTotal;
      const endWeight = Math.sin(t * angle) / sinTotal;
      direction = startDir
        .clone()
        .multiplyScalar(startWeight)
        .add(endDir.clone().multiplyScalar(endWeight))
        .normalize();
    }

    const liftedRadius = baseRadius * (1 + Math.sin(Math.PI * t) * arcLift);
    points.push(direction.multiplyScalar(liftedRadius));
  }

  return points;
}

function GlobeMesh({ pointerStateRef, interactionSettings, startAnimation }) {
  const groupRef = useRef(null);
  const oceanRef = useRef(null);
  const continentRef = useRef(null);
  const networkSegmentRefs = useRef([]);
  const interactionMarkerRef = useRef(null);
  const spinRef = useRef(0);
  const animationProgressRef = useRef(0);
  const networkTimeRef = useRef(0);
  const mask = useLoader(THREE.TextureLoader, EARTH_MASK);
  const baseQuaternion = useMemo(
    () =>
      new THREE.Quaternion().setFromEuler(
        new THREE.Euler(0.3490658504, 0, 0.3490658504, "XYZ")
      ),
    []
  );
  const localSpinAxis = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const spinQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const tempVector = useMemo(() => new THREE.Vector3(), []);
  const tempVectorB = useMemo(() => new THREE.Vector3(), []);
  const tempVectorC = useMemo(() => new THREE.Vector3(), []);
  const tempVectorD = useMemo(() => new THREE.Vector3(), []);
  const tempVectorE = useMemo(() => new THREE.Vector3(), []);
  const tempVectorF = useMemo(() => new THREE.Vector3(), []);
  const dotDummy = useMemo(() => new THREE.Object3D(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const globeWorldCenter = useMemo(() => new THREE.Vector3(), []);
  const worldHitPoint = useMemo(() => new THREE.Vector3(), []);
  const localHitPoint = useMemo(() => new THREE.Vector3(), []);
  const markerDirection = useMemo(() => new THREE.Vector3(), []);
  const animationDuration = ASSEMBLY_DURATION;
  const staggerPortion = 0.28;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const { oceanDots, continentDots } = useMemo(() => {
    const img = mask.image;

    if (!img || !img.width || !img.height) {
      return { oceanDots: [], continentDots: [] };
    }

    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return { oceanDots: [], continentDots: [] };
    }

    ctx.drawImage(img, 0, 0);

    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const oceanDotsResult = [];
    const continentDotsResult = [];
    const radius = GLOBE_RADIUS;
    const oceanLatSteps = 96;
    const oceanLonSteps = 192;
    const continentLatSteps = 192;
    const continentLonSteps = 384;

    const getBrightness = (u, v) => {
      const xPixel = Math.min(canvas.width - 1, Math.floor(u * canvas.width));
      const yPixel = Math.min(
        canvas.height - 1,
        Math.floor(v * canvas.height)
      );
      const pixelIndex = (yPixel * canvas.width + xPixel) * 4;

      const r = pixels[pixelIndex];
      const g = pixels[pixelIndex + 1];
      const b = pixels[pixelIndex + 2];

      return (r + g + b) / 3;
    };

    const pushDot = (target, u, v, size) => {
      const lat = 90 - v * 180;
      const lon = 180 - u * 360;
      const phi = THREE.MathUtils.degToRad(90 - lat);
      const theta = THREE.MathUtils.degToRad(lon + 180);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const targetDirection = new THREE.Vector3(x, y, z).normalize();
      const spreadScale = 5.8 + Math.random() * 4.4;
      const lateralNoise = new THREE.Vector3(
        (Math.random() - 0.5) * 2.1,
        (Math.random() - 0.5) * 2.1,
        (Math.random() - 0.5) * 1.6
      );
      const startPosition = new THREE.Vector3(
        targetDirection.x * spreadScale,
        targetDirection.y * spreadScale,
        targetDirection.z * spreadScale
      ).add(lateralNoise);
      const tangentReference =
        Math.abs(targetDirection.y) > 0.82
          ? new THREE.Vector3(1, 0, 0)
          : new THREE.Vector3(0, 1, 0);
      const tangentDirection = new THREE.Vector3()
        .crossVectors(targetDirection, tangentReference)
        .normalize();
      const bitangentDirection = new THREE.Vector3()
        .crossVectors(targetDirection, tangentDirection)
        .normalize();
      const randomDirection = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ).normalize();
      const tangentMix = Math.random() * 2 - 1;
      const bitangentMix = Math.random() * 2 - 1;
      const burstStrength = 0.72 + Math.random() * 0.7;

      target.push({
        startPosition,
        targetPosition: new THREE.Vector3(x, y, z),
        delay: Math.random() * staggerPortion,
        size,
        targetDirection,
        tangentDirection,
        bitangentDirection,
        randomDirection,
        tangentMix,
        bitangentMix,
        burstStrength,
        interactionAlpha: 0,
      });
    };

    for (let latIndex = 0; latIndex <= oceanLatSteps; latIndex += 1) {
      const v = latIndex / oceanLatSteps;

      for (let lonIndex = 0; lonIndex < oceanLonSteps; lonIndex += 1) {
        const u = lonIndex / oceanLonSteps;
        const brightness = getBrightness(u, v);
        const isBrightMask = brightness > 120;
        const keepChance = isBrightMask ? 0.22 : 1;

        if (Math.random() > keepChance) {
          continue;
        }

        if (isBrightMask) {
          pushDot(oceanDotsResult, u, v, 0.006);
        } else {
          pushDot(continentDotsResult, u, v, 0.01078);
        }
      }
    }

    for (let latIndex = 0; latIndex <= continentLatSteps; latIndex += 1) {
      const v = latIndex / continentLatSteps;

      for (let lonIndex = 0; lonIndex < continentLonSteps; lonIndex += 1) {
        const u = lonIndex / continentLonSteps;
        const brightness = getBrightness(u, v);

        if (brightness > 120) {
          continue;
        }

        if (Math.random() > 0.9) {
          continue;
        }

        pushDot(continentDotsResult, u, v, 0.01078);
      }
    }

    return {
      oceanDots: oceanDotsResult,
      continentDots: continentDotsResult,
    };
  }, [mask]);

  const networkData = useMemo(() => {
    if (!continentDots.length) {
      return { cities: [], edges: [] };
    }

    const usedIndices = new Set();
    const cityMap = new Map();

    NETWORK_CITIES.forEach((city) => {
      const cityVector = latLonToVector3(city.lat, city.lon, GLOBE_RADIUS);
      let bestIndex = -1;
      let bestDistance = Infinity;

      continentDots.forEach((dot, index) => {
        if (usedIndices.has(index)) {
          return;
        }

        const distance = dot.targetPosition.distanceToSquared(cityVector);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });

      if (bestIndex === -1) {
        return;
      }

      usedIndices.add(bestIndex);
      const markerPosition = continentDots[bestIndex].targetPosition.clone();
      const linePosition = markerPosition.clone();

      cityMap.set(city.id, {
        ...city,
        markerIndex: bestIndex,
        markerPosition,
        linePosition,
      });
    });

    const cityActivationTimes = new Map([["london", 0]]);
    const edges = NETWORK_CONNECTIONS.map((edge) => {
      const fromCity = cityMap.get(edge.from);
      const toCity = cityMap.get(edge.to);

      if (!fromCity || !toCity) {
        return null;
      }

      const fromActivation = cityActivationTimes.get(edge.from) ?? 0;
      const startAt = fromActivation + edge.offset;
      const endAt = startAt + NETWORK_EDGE_DURATION;
      const curvePoints = buildSurfaceArcPoints(
        fromCity.linePosition,
        toCity.linePosition,
        NETWORK_CURVE_SEGMENTS,
        GLOBE_RADIUS * 1.002
      );

      cityActivationTimes.set(edge.to, endAt);

      return {
        ...edge,
        startAt,
        endAt,
        duration: NETWORK_EDGE_DURATION,
        curvePoints,
      };
    }).filter(Boolean);

    return {
      cities: Array.from(cityMap.values()),
      edges,
    };
  }, [continentDots]);

  useLayoutEffect(() => {
    const setDots = (meshRef, dots, progress) => {
      if (!meshRef.current) {
        return;
      }

      dots.forEach((dot, index) => {
        const localProgress =
          progress <= dot.delay
            ? 0
            : Math.min(1, (progress - dot.delay) / (1 - dot.delay));

        dotDummy.position
          .copy(dot.startPosition)
          .lerp(dot.targetPosition, localProgress);
        dotDummy.scale.setScalar(dot.size);
        dotDummy.updateMatrix();
        meshRef.current.setMatrixAt(index, dotDummy.matrix);
      });

      meshRef.current.instanceMatrix.needsUpdate = true;
    };

    setDots(oceanRef, oceanDots, 0);
    setDots(continentRef, continentDots, 0);
    animationProgressRef.current = 0;
    spinRef.current = 0;
    networkTimeRef.current = 0;

    networkSegmentRefs.current = networkSegmentRefs.current.slice(
      0,
      networkData.edges.length
    );

    networkData.edges.forEach((edge, index) => {
      const segmentRefs = networkSegmentRefs.current[index] || [];
      segmentRefs.forEach((mesh) => {
        if (mesh) {
          mesh.visible = false;
        }
      });
    });
  }, [oceanDots, continentDots, networkData, dotDummy]);

  useFrame((state, delta) => {
    if (!startAnimation) {
      return;
    }

    const resolveInteraction = () => {
      if (
        !interactionSettings.enabled ||
        !groupRef.current ||
        !pointerStateRef.current.inside
      ) {
        return null;
      }

      groupRef.current.getWorldPosition(globeWorldCenter);
      raycaster.setFromCamera(pointerStateRef.current.ndc, state.camera);

      const toCenter = tempVectorB.copy(globeWorldCenter).sub(raycaster.ray.origin);
      const projectionLength = toCenter.dot(raycaster.ray.direction);
      const closestDistanceSq =
        toCenter.lengthSq() - projectionLength * projectionLength;
      const radiusSq = GLOBE_RADIUS * GLOBE_RADIUS;

      if (closestDistanceSq > radiusSq) {
        return null;
      }

      const offset = Math.sqrt(radiusSq - closestDistanceSq);
      const hitDistance = projectionLength - offset;

      if (hitDistance < 0) {
        return null;
      }

      worldHitPoint.copy(raycaster.ray.direction).multiplyScalar(hitDistance);
      worldHitPoint.add(raycaster.ray.origin);
      localHitPoint.copy(worldHitPoint);
      groupRef.current.worldToLocal(localHitPoint);

      return localHitPoint;
    };

    const setAnimatedDots = (meshRef, dots, progress) => {
      if (!meshRef.current) {
        return;
      }
      const interactionPoint = resolveInteraction();

      dots.forEach((dot, index) => {
        const localProgress =
          progress <= dot.delay
            ? 0
            : Math.min(1, (progress - dot.delay) / (1 - dot.delay));

        tempVector
          .copy(dot.startPosition)
          .lerp(dot.targetPosition, localProgress);

        let scale = dot.size;
        if (interactionPoint) {
          const distanceToInteraction = tempVector.distanceTo(interactionPoint);
          const rawInfluence = Math.max(
            0,
            1 - distanceToInteraction / interactionSettings.radius
          );
          const easingSpeed =
            rawInfluence > dot.interactionAlpha
              ? interactionSettings.easeInSpeed
              : interactionSettings.easeOutSpeed;
          dot.interactionAlpha = THREE.MathUtils.damp(
            dot.interactionAlpha,
            rawInfluence,
            easingSpeed,
            delta
          );
          const featheredInfluence = THREE.MathUtils.smootherstep(
            dot.interactionAlpha,
            0,
            1
          );
          const influence = Math.pow(featheredInfluence, interactionSettings.falloffPower);

          if (influence > 0) {
            tempVectorC
              .copy(dot.targetDirection)
              .multiplyScalar(dot.burstStrength);
            tempVectorD
              .copy(dot.tangentDirection)
              .multiplyScalar(dot.tangentMix * interactionSettings.tangentAmount);
            tempVectorE
              .copy(dot.bitangentDirection)
              .multiplyScalar(
                dot.bitangentMix * interactionSettings.tangentAmount * 0.85
              );
            tempVectorF
              .copy(dot.randomDirection)
              .multiplyScalar(interactionSettings.randomAmount);
            tempVectorC
              .add(tempVectorD)
              .add(tempVectorE)
              .add(tempVectorF)
              .normalize()
              .multiplyScalar(influence * interactionSettings.flyoutDistance);
            tempVector.add(tempVectorC);
            scale *= 1 + featheredInfluence * interactionSettings.scaleBoost;
          }
        } else if (dot.interactionAlpha > 0.0001) {
          dot.interactionAlpha = THREE.MathUtils.damp(
            dot.interactionAlpha,
            0,
            interactionSettings.easeOutSpeed,
            delta
          );
          const featheredInfluence = THREE.MathUtils.smootherstep(
            dot.interactionAlpha,
            0,
            1
          );
          const influence = Math.pow(featheredInfluence, interactionSettings.falloffPower);

          if (influence > 0) {
            tempVectorC
              .copy(dot.targetDirection)
              .multiplyScalar(dot.burstStrength);
            tempVectorD
              .copy(dot.tangentDirection)
              .multiplyScalar(dot.tangentMix * interactionSettings.tangentAmount);
            tempVectorE
              .copy(dot.bitangentDirection)
              .multiplyScalar(
                dot.bitangentMix * interactionSettings.tangentAmount * 0.85
              );
            tempVectorF
              .copy(dot.randomDirection)
              .multiplyScalar(interactionSettings.randomAmount);
            tempVectorC
              .add(tempVectorD)
              .add(tempVectorE)
              .add(tempVectorF)
              .normalize()
              .multiplyScalar(influence * interactionSettings.flyoutDistance);
            tempVector.add(tempVectorC);
            scale *= 1 + featheredInfluence * interactionSettings.scaleBoost;
          }
        }

        dotDummy.position.copy(tempVector);
        dotDummy.scale.setScalar(scale);
        dotDummy.updateMatrix();
        meshRef.current.setMatrixAt(index, dotDummy.matrix);
      });

      meshRef.current.instanceMatrix.needsUpdate = true;
    };

    const updateNetworkLines = (networkTime) => {
      networkData.edges.forEach((edge, index) => {
        const edgeProgressRaw = THREE.MathUtils.clamp(
          (networkTime - edge.startAt) / edge.duration,
          0,
          1
        );
        const edgeProgress = easeOutCubic(edgeProgressRaw);
        const totalSegments = edge.curvePoints.length - 1;
        const scaledProgress = edgeProgress * totalSegments;
        const completedSegments = Math.floor(scaledProgress);
        const partialProgress = scaledProgress - completedSegments;
        const segmentRefs = networkSegmentRefs.current[index] || [];

        segmentRefs.forEach((mesh, segmentIndex) => {
          if (!mesh) {
            return;
          }

          const start = edge.curvePoints[segmentIndex];
          const end = edge.curvePoints[segmentIndex + 1];

          if (!start || !end) {
            mesh.visible = false;
            return;
          }

          if (segmentIndex < completedSegments) {
            const direction = new THREE.Vector3().subVectors(end, start);
            const length = direction.length();

            if (!length) {
              mesh.visible = false;
              return;
            }

            mesh.visible = true;
            mesh.position.copy(start).add(end).multiplyScalar(0.5);
            mesh.scale.set(NETWORK_LINE_RADIUS, length, NETWORK_LINE_RADIUS);
            mesh.quaternion.setFromUnitVectors(
              new THREE.Vector3(0, 1, 0),
              direction.normalize()
            );
            return;
          }

          if (segmentIndex === completedSegments && partialProgress > 0) {
            const partialEnd = tempVector.copy(start).lerp(end, partialProgress);
            const direction = new THREE.Vector3().subVectors(partialEnd, start);
            const length = direction.length();

            if (!length) {
              mesh.visible = false;
              return;
            }

            mesh.visible = true;
            mesh.position.copy(start).add(partialEnd).multiplyScalar(0.5);
            mesh.scale.set(NETWORK_LINE_RADIUS, length, NETWORK_LINE_RADIUS);
            mesh.quaternion.setFromUnitVectors(
              new THREE.Vector3(0, 1, 0),
              direction.normalize()
            );
            return;
          }

          mesh.visible = false;
        });
      });
    };

    if (groupRef.current) {
      spinRef.current += 0.0025;
      spinQuaternion.setFromAxisAngle(localSpinAxis, spinRef.current);
      const interactionPoint = resolveInteraction();

      if (interactionMarkerRef.current) {
        interactionMarkerRef.current.visible = Boolean(interactionPoint);

        if (interactionPoint) {
          const pulse =
            1 +
            Math.sin(state.clock.elapsedTime * interactionSettings.markerPulseSpeed) *
              interactionSettings.markerPulseAmplitude;
          markerDirection
            .copy(interactionPoint)
            .normalize()
            .multiplyScalar(GLOBE_RADIUS + interactionSettings.markerOffset);
          interactionMarkerRef.current.position.copy(markerDirection);
          interactionMarkerRef.current.lookAt(
            tempVectorD.copy(markerDirection).multiplyScalar(2)
          );
          interactionMarkerRef.current.scale.setScalar(pulse);
        }
      }

      if (animationProgressRef.current < 1) {
        animationProgressRef.current = Math.min(
          1,
          animationProgressRef.current + delta / animationDuration
        );

        const easedProgress = easeOutCubic(animationProgressRef.current);
        setAnimatedDots(oceanRef, oceanDots, easedProgress);
        setAnimatedDots(continentRef, continentDots, easedProgress);
        groupRef.current.quaternion.copy(baseQuaternion).multiply(spinQuaternion);
      } else {
        setAnimatedDots(oceanRef, oceanDots, 1);
        setAnimatedDots(continentRef, continentDots, 1);
        networkTimeRef.current += delta;
        updateNetworkLines(networkTimeRef.current);
        groupRef.current.quaternion.copy(baseQuaternion).multiply(spinQuaternion);
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -2.29425, 0]}>
      <instancedMesh
        ref={oceanRef}
        args={[null, null, oceanDots.length]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={HOLOGRAM} />
      </instancedMesh>

      <instancedMesh
        ref={continentRef}
        args={[null, null, continentDots.length]}
        frustumCulled={false}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#ffffff" vertexColors />
      </instancedMesh>

      <mesh ref={interactionMarkerRef} visible={false} frustumCulled={false}>
        <ringGeometry
          args={[
            interactionSettings.markerInnerRadius,
            interactionSettings.markerOuterRadius,
            48,
          ]}
        />
        <meshBasicMaterial
          color={NETWORK_COLOR}
          transparent
          opacity={0.95}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {networkData.edges.map((edge, edgeIndex) => (
        <group key={`${edge.from}-${edge.to}`}>
          {Array.from({ length: NETWORK_CURVE_SEGMENTS }).map((_, segmentIndex) => (
            <mesh
              key={`${edge.from}-${edge.to}-${segmentIndex}`}
              ref={(node) => {
                if (!networkSegmentRefs.current[edgeIndex]) {
                  networkSegmentRefs.current[edgeIndex] = [];
                }
                networkSegmentRefs.current[edgeIndex][segmentIndex] = node;
              }}
              frustumCulled={false}
            >
              <cylinderGeometry args={[1, 1, 1, 8, 1, true]} />
              <meshBasicMaterial color={NETWORK_COLOR} toneMapped={false} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function GlobeNetwork({ startAnimation = true }) {
  const pointerStateRef = useRef({
    inside: false,
    ndc: new THREE.Vector2(),
  });
  const interactionSettings = DEFAULT_INTERACTION_SETTINGS;

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerStateRef.current.inside = true;
    pointerStateRef.current.ndc.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );
  };

  const handlePointerLeave = () => {
    pointerStateRef.current.inside = false;
  };

  return (
    <div
      className="hero-globe"
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <Canvas camera={{ position: [0, 0, 7.4], fov: 42 }}>
        <color attach="background" args={[BG]} />
        <ambientLight intensity={1} />
        <GlobeMesh
          pointerStateRef={pointerStateRef}
          interactionSettings={interactionSettings}
          startAnimation={startAnimation}
        />
      </Canvas>
    </div>
  );
}

export default GlobeNetwork;
