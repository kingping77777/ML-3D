'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PredictionResponse, VesselName } from '../../types/predictions';
import { HeartModel } from './HeartModel';
import { HeartControls } from './HeartControls';
import { PvcDetailsCard } from './PvcDetailsCard';
import { pvcOrigins } from './pvcOrigins';

interface HeartViewerProps {
  data: PredictionResponse | null;
  loading?: boolean;
  error?: string | null;
  selectedVessel?: VesselName | null;
  onSelectVessel?: (vessel: VesselName | null) => void;
  height?: string;
}

export const HeartViewer: React.FC<HeartViewerProps> = ({
  data,
  loading = false,
  error = null,
  selectedVessel: externalSelectedVessel,
  onSelectVessel: externalOnSelectVessel,
  height = '500px'
}) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [internalSelectedVessel, setInternalSelectedVessel] = useState<VesselName | null>(null);
  const [selectedPvcOrigin, setSelectedPvcOrigin] = useState<string | null>(null);
  const [showPvcHotspots, setShowPvcHotspots] = useState<boolean>(true);
  const [enableHeartbeat, setEnableHeartbeat] = useState<boolean>(true);

  const controlsRef = useRef<any>(null);

  const handleSetCameraPreset = (preset: 'anterior' | 'lcx' | 'rca' | 'posterior') => {
    if (controlsRef.current) {
      if (preset === 'anterior') {
        controlsRef.current.setAzimuthalAngle(0);
        controlsRef.current.setPolarAngle(Math.PI / 2);
      } else if (preset === 'lcx') {
        controlsRef.current.setAzimuthalAngle(-Math.PI * 0.4);
        controlsRef.current.setPolarAngle(Math.PI / 2);
      } else if (preset === 'rca') {
        controlsRef.current.setAzimuthalAngle(Math.PI * 0.4);
        controlsRef.current.setPolarAngle(Math.PI / 2);
      } else if (preset === 'posterior') {
        controlsRef.current.setAzimuthalAngle(Math.PI);
        controlsRef.current.setPolarAngle(Math.PI / 2);
      }
    }
  };

  const activeSelectedVessel = externalSelectedVessel !== undefined ? externalSelectedVessel : internalSelectedVessel;
  const handleSelectVessel = (vessel: VesselName | null) => {
    if (externalOnSelectVessel) {
      externalOnSelectVessel(vessel);
    } else {
      setInternalSelectedVessel(vessel);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{
        height,
        width: '100%',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748b',
        fontSize: '13px'
      }}>
        Loading 3D Anatomy Model...
      </div>
    );
  }

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const activePvcObject = pvcOrigins.find((p) => p.id === selectedPvcOrigin);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {/* Real, Clean Clinical Toolbar */}
      <HeartControls
        selectedVessel={activeSelectedVessel}
        onSelectVessel={handleSelectVessel}
        selectedPvcOrigin={selectedPvcOrigin}
        onSelectPvcOrigin={(id) => setSelectedPvcOrigin(id)}
        onResetView={handleResetView}
        onSetCameraPreset={handleSetCameraPreset}
        enableHeartbeat={enableHeartbeat}
        onToggleHeartbeat={() => setEnableHeartbeat(!enableHeartbeat)}
        showPvcHotspots={showPvcHotspots}
        onTogglePvcHotspots={() => setShowPvcHotspots(!showPvcHotspots)}
      />

      {/* 3D Canvas Area with Real Clean Neutral Background */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: height,
        background: '#f1f5f9',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        overflow: 'hidden'
      }}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(255, 255, 255, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, color: '#0f172a', fontSize: '13px', fontWeight: 500 }}>
            Loading model...
          </div>
        )}

        {error && !loading && (
          <div style={{ position: 'absolute', inset: 0, background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, padding: '16px', color: '#b91c1c', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {data && (
          <Canvas
            camera={{ position: [0, 0, 4.0], fov: 45 }}
            gl={{ antialias: true }}
            onPointerMissed={() => handleSelectVessel(null)}
          >
            {/* Natural White Studio Illumination */}
            <ambientLight intensity={1.1} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} />
            <directionalLight position={[-5, 3, -5]} intensity={0.6} />

            <Suspense fallback={null}>
              <HeartModel
                data={data}
                selectedVessel={activeSelectedVessel}
                selectedPvcOrigin={selectedPvcOrigin}
                onSelectVessel={handleSelectVessel}
                onSelectPvcOrigin={(id) => setSelectedPvcOrigin(id)}
                onHoverVessel={() => {}}
                enableHeartbeat={enableHeartbeat}
                showPvcHotspots={showPvcHotspots}
              />
            </Suspense>

            <OrbitControls
              ref={controlsRef}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2.0}
              maxDistance={8.0}
            />
          </Canvas>
        )}
      </div>

      {/* Clinical EP Details Card on Selection */}
      {activePvcObject && (
        <PvcDetailsCard
          origin={activePvcObject}
          onClose={() => setSelectedPvcOrigin(null)}
        />
      )}
    </div>
  );
};
