import React, { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { VesselName } from '../../types/predictions';
import { VESSEL_MAPPINGS } from './heartMapping';

interface VesselProps {
  vesselKey: VesselName;
  geometry: THREE.BufferGeometry;
  probability: number;
  status: string;
  isSelected: boolean;
  isAnySelected: boolean;
  onSelect: (vessel: VesselName) => void;
  onHover: (vessel: VesselName | null, event?: { x: number; y: number }) => void;
}

export const Vessel: React.FC<VesselProps> = ({
  vesselKey,
  geometry,
  probability,
  status,
  isSelected,
  isAnySelected,
  onSelect,
  onHover
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mapping = VESSEL_MAPPINGS[vesselKey];
  const isElevated = status === 'elevated_risk' || probability >= 0.5;

  // Determine base color based on model output risk
  const baseColor = isElevated ? mapping.elevatedRiskColor : mapping.normalRiskColor;

  // Pulse effect when selected
  useFrame(({ clock }) => {
    if (meshRef.current && isSelected) {
      const pulse = Math.sin(clock.getElapsedTime() * 4) * 0.15 + 1.0;
      meshRef.current.scale.set(pulse, pulse, pulse);
    } else if (meshRef.current) {
      meshRef.current.scale.set(1, 1, 1);
    }
  });

  // Calculate visual opacity & intensity
  let opacity = 1.0;
  let emissiveIntensity = 0.2;

  if (isAnySelected && !isSelected) {
    opacity = 0.35; // De-emphasize unselected vessels
    emissiveIntensity = 0.05;
  }
  if (isHovered) {
    emissiveIntensity = 0.6;
    opacity = 1.0;
  }
  if (isSelected) {
    emissiveIntensity = 0.8;
  }

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(vesselKey);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        onHover(vesselKey, { x: e.clientX, y: e.clientY });
      }}
      onPointerOut={() => {
        setIsHovered(false);
        onHover(null);
      }}
    >
      <meshStandardMaterial
        color={baseColor}
        emissive={baseColor}
        emissiveIntensity={emissiveIntensity}
        roughness={0.25}
        metalness={0.2}
        transparent={true}
        opacity={opacity}
      />
    </mesh>
  );
};
