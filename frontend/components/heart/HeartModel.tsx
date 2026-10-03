'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';
import { PredictionResponse, VesselName } from '../../types/predictions';

interface HeartModelProps {
  data: PredictionResponse;
  selectedVessel: VesselName | null;
  onSelectVessel: (vessel: VesselName) => void;
  onHoverVessel: (vessel: VesselName | null, event?: { x: number; y: number }) => void;
}

// Risk Color Generator
function getVesselColor(probability: number): string {
  if (probability >= 0.70) return '#ef4444'; // High Risk (Red)
  if (probability >= 0.40) return '#f59e0b'; // Moderate Risk (Amber)
  return '#10b981'; // Normal Risk (Emerald)
}

export const HeartModel: React.FC<HeartModelProps> = ({
  data,
  selectedVessel,
  onSelectVessel,
  onHoverVessel
}) => {
  const isAnySelected = selectedVessel !== null;

  // 1. Procedural Heart Ventricle / Body Geometry
  const heartBodyGeo = useMemo(() => {
    const geo = new THREE.SphereGeometry(1.0, 32, 32);
    // Deform sphere into anatomical conical cardiac shape
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const factor = 1.0 - 0.4 * ((y - 0.5) / 1.5);
      pos.setX(i, pos.getX(i) * Math.max(0.4, factor));
      pos.setZ(i, pos.getZ(i) * Math.max(0.4, factor));
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  // 2. Aorta Arch Geometry
  const aortaGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.7, 0),
      new THREE.Vector3(0.1, 1.3, -0.1),
      new THREE.Vector3(-0.3, 1.4, -0.2),
      new THREE.Vector3(-0.5, 0.8, -0.3)
    ]);
    return new THREE.TubeGeometry(curve, 32, 0.22, 16, false);
  }, []);

  // 3. Pulmonary Artery Geometry
  const paGeo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.1, 0.6, 0.3),
      new THREE.Vector3(-0.3, 1.1, 0.1),
      new THREE.Vector3(-0.6, 1.2, -0.1)
    ]);
    return new THREE.TubeGeometry(curve, 32, 0.18, 16, false);
  }, []);

  // 4. Coronary Vessels Paths (LAD, LCX, RCA)
  const vesselGeometries = useMemo(() => {
    // LAD: Runs down the anterior interventricular sulcus towards the apex
    const ladCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.05, 0.65, 0.85),
      new THREE.Vector3(0.12, 0.35, 0.95),
      new THREE.Vector3(0.08, -0.1, 0.88),
      new THREE.Vector3(0.02, -0.55, 0.68),
      new THREE.Vector3(-0.02, -0.85, 0.38)
    ]);

    // LCX: Branches leftward along the coronary sulcus to posterior LV
    const lcxCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.05, 0.65, 0.85),
      new THREE.Vector3(-0.35, 0.55, 0.75),
      new THREE.Vector3(-0.75, 0.35, 0.45),
      new THREE.Vector3(-0.85, 0.05, -0.1),
      new THREE.Vector3(-0.7, -0.35, -0.45)
    ]);

    // RCA: Originates from right coronary sinus, runs along right atrioventricular groove
    const rcaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.35, 0.65, 0.65),
      new THREE.Vector3(0.72, 0.45, 0.45),
      new THREE.Vector3(0.85, 0.1, 0.1),
      new THREE.Vector3(0.78, -0.35, -0.2),
      new THREE.Vector3(0.45, -0.7, -0.35)
    ]);

    return {
      lad: new THREE.TubeGeometry(ladCurve, 32, 0.055, 12, false),
      lcx: new THREE.TubeGeometry(lcxCurve, 32, 0.05, 12, false),
      rca: new THREE.TubeGeometry(rcaCurve, 32, 0.055, 12, false)
    };
  }, []);

  const vessels: VesselName[] = ['lad', 'lcx', 'rca'];

  return (
    <group rotation={[0.15, 0.35, 0]} scale={[1.4, 1.4, 1.4]} position={[0, -0.1, 0]}>
      {/* 1. Cardiac Muscle (Myocardium) */}
      <mesh geometry={heartBodyGeo}>
        <meshStandardMaterial
          color="#881337"
          roughness={0.6}
          metalness={0.15}
          transparent={true}
          opacity={isAnySelected ? 0.3 : 0.8}
        />
      </mesh>

      {/* 2. Aorta */}
      <mesh geometry={aortaGeo}>
        <meshStandardMaterial
          color="#dc2626"
          roughness={0.35}
          metalness={0.2}
          transparent={true}
          opacity={isAnySelected ? 0.35 : 0.9}
        />
      </mesh>

      {/* 3. Pulmonary Artery */}
      <mesh geometry={paGeo}>
        <meshStandardMaterial
          color="#2563eb"
          roughness={0.35}
          metalness={0.2}
          transparent={true}
          opacity={isAnySelected ? 0.35 : 0.9}
        />
      </mesh>

      {/* 4. Interactive Coronary Vessels (LAD, LCX, RCA) */}
      {vessels.map((vesselKey) => {
        const isSelected = selectedVessel === vesselKey;
        const prob = data.visualization[vesselKey]?.probability ?? 0;
        const color = getVesselColor(prob);
        const geo = vesselGeometries[vesselKey];

        return (
          <mesh
            key={vesselKey}
            geometry={geo}
            onClick={(e) => {
              e.stopPropagation();
              onSelectVessel(vesselKey);
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'pointer';
              onHoverVessel(vesselKey, { x: e.clientX, y: e.clientY });
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'default';
              onHoverVessel(null);
            }}
          >
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isSelected ? 0.9 : 0.3}
              roughness={0.2}
              metalness={0.4}
              transparent={true}
              opacity={isAnySelected && !isSelected ? 0.4 : 1.0}
            />
          </mesh>
        );
      })}
    </group>
  );
};
