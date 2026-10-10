'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { PredictionResponse, VesselName } from '../../types/predictions';
import { pvcOrigins } from './pvcOrigins';
import { Hotspot } from './Hotspot';

interface HeartModelProps {
  data: PredictionResponse;
  selectedVessel: VesselName | null;
  selectedPvcOrigin?: string | null;
  onSelectVessel: (vessel: VesselName) => void;
  onSelectPvcOrigin?: (originId: string) => void;
  onHoverVessel: (vessel: VesselName | null, event?: { x: number; y: number }) => void;
  enableHeartbeat?: boolean;
  showPvcHotspots?: boolean;
}

/**
 * 3D Heart Model Loader - Pure, authentic CAD render preserving the original GLB textures
 * without neon overlays or synthetic color modifications.
 */
function GLTFHeartModel({
  selectedVessel,
  selectedPvcOrigin,
  onSelectVessel,
  onSelectPvcOrigin,
  enableHeartbeat = true,
  showPvcHotspots = false
}: HeartModelProps) {
  const { scene } = useGLTF('/models/cardiac_anatomy_external_view_of_human_heart.glb');
  const groupRef = useRef<THREE.Group>(null);

  // Clone scene and auto-center/normalize scale while preserving native authentic materials
  const { clonedScene, computedScale } = useMemo(() => {
    const cloned = scene.clone(true);

    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Center mesh around origin
    cloned.position.set(-center.x, -center.y, -center.z);

    // Scale to fit viewport (~2.8 units)
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? 2.8 / maxDim : 1.0;

    return { clonedScene: cloned, computedScale: scale };
  }, [scene]);

  // Gentle anatomical cardiac cycle pulsation
  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (groupRef.current && enableHeartbeat) {
      const beatCycle = (time * 1.17 * Math.PI * 2) % (Math.PI * 2);
      const pulse = Math.sin(beatCycle) * 0.5 + Math.sin(beatCycle * 2) * 0.25;
      const beatScale = computedScale * (1.0 + Math.max(0, pulse) * 0.015);
      groupRef.current.scale.set(beatScale, beatScale, beatScale);
    }
  });

  return (
    <group ref={groupRef} scale={[computedScale, computedScale, computedScale]}>
      <primitive
        object={clonedScene}
        onClick={(e: THREE.Event) => {
          e.stopPropagation();
          const meshName = e.object.name.toLowerCase();
          if (meshName.includes('lad') || meshName.includes('anterior_descending')) {
            onSelectVessel('lad');
          } else if (meshName.includes('lcx') || meshName.includes('circumflex')) {
            onSelectVessel('lcx');
          } else if (meshName.includes('rca') || meshName.includes('right_coronary')) {
            onSelectVessel('rca');
          }
        }}
      />

      {/* Clean, medical-grade PVC origin markers */}
      {showPvcHotspots && pvcOrigins.map((origin) => (
        <Hotspot
          key={origin.id}
          origin={origin}
          isSelected={selectedPvcOrigin === origin.id}
          onClick={(id) => {
            if (onSelectPvcOrigin) onSelectPvcOrigin(id);
          }}
        />
      ))}
    </group>
  );
}

useGLTF.preload('/models/cardiac_anatomy_external_view_of_human_heart.glb');

export const HeartModel: React.FC<HeartModelProps> = (props) => {
  return <GLTFHeartModel {...props} />;
};
