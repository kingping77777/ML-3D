'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { PVCOrigin } from './pvcOrigins';

interface HotspotProps {
  origin: PVCOrigin;
  isSelected: boolean;
  onClick: (id: string) => void;
  onHover?: (id: string | null) => void;
}

export const Hotspot: React.FC<HotspotProps> = ({
  origin,
  isSelected,
  onClick,
  onHover
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Subtle pulse animation
  useFrame((state) => {
    if (meshRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2.5) * 0.15 + 1;
      const scale = isSelected ? 1.5 : hovered ? 1.3 : pulse;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={origin.hotspotPosition}>
      {/* Clean, minimalist clinical marker dot */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(origin.id);
        }}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
          if (onHover) onHover(origin.id);
        }}
        onPointerLeave={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'default';
          if (onHover) onHover(null);
        }}
      >
        <sphereGeometry args={[0.035, 24, 24]} />
        <meshStandardMaterial
          color={isSelected ? '#2563eb' : '#dc2626'}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Clean floating clinical label on hover */}
      {(hovered || isSelected) && (
        <Html
          position={[0, 0.08, 0]}
          center
          distanceFactor={5.5}
          style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}
        >
          <div style={{
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '4px',
            padding: '3px 8px',
            color: '#f8fafc',
            fontSize: '11px',
            fontWeight: 600,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
          }}>
            {origin.name}
          </div>
        </Html>
      )}
    </group>
  );
};
