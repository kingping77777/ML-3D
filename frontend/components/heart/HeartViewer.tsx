'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PredictionResponse, VesselName } from '../../types/predictions';
import { HeartModel } from './HeartModel';
import { HeartControls } from './HeartControls';
import { PvcDetailsCard } from './PvcDetailsCard';
import { HeartAnatomyModal } from './HeartAnatomyModal';
import { pvcOrigins } from './pvcOrigins';
import { PatientInput, AnalyzeResponse } from '../../types/predictions';

interface HeartViewerProps {
  data: PredictionResponse | null;
  loading?: boolean;
  error?: string | null;
  selectedVessel?: VesselName | null;
  onSelectVessel?: (vessel: VesselName | null) => void;
  height?: string;
  patient?: PatientInput;
  analysis?: AnalyzeResponse;
}

export const HeartViewer: React.FC<HeartViewerProps> = ({
  data,
  loading = false,
  error = null,
  selectedVessel: externalSelectedVessel,
  onSelectVessel: externalOnSelectVessel,
  height = '500px',
  patient,
  analysis
}) => {
  const [mounted, setMounted] = useState<boolean>(false);
  const [internalSelectedVessel, setInternalSelectedVessel] = useState<VesselName | null>(null);
  const [selectedPvcOrigin, setSelectedPvcOrigin] = useState<string | null>(null);
  const [showPvcHotspots, setShowPvcHotspots] = useState<boolean>(false);
  const [enableHeartbeat, setEnableHeartbeat] = useState<boolean>(true);
  const [isAnatomyModalOpen, setIsAnatomyModalOpen] = useState<boolean>(false);

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
  
  // Auto-focus camera on the selected vessel's anatomical damage region
  useEffect(() => {
    if (activeSelectedVessel === 'lad') {
      handleSetCameraPreset('anterior');
    } else if (activeSelectedVessel === 'lcx') {
      handleSetCameraPreset('lcx');
    } else if (activeSelectedVessel === 'rca') {
      handleSetCameraPreset('rca');
    }
  }, [activeSelectedVessel]);

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
        background: '#09090b',
        borderRadius: '8px',
        border: '1px solid #27272a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
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
        background: '#000000',
        borderRadius: '8px',
        border: '1px solid #27272a',
        overflow: 'hidden'
      }}>
        {/* Prominent Floating Action to Open Full 3D Anatomy Explorer Modal */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10
        }}>
          <button
            onClick={() => setIsAnatomyModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
              transition: 'all 0.15s ease'
            }}
          >
            <span>🔍</span> Full 3D Anatomy & Disease Explorer
          </button>
        </div>

        {/* Quick helper badge on bottom left */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          zIndex: 10,
          background: 'rgba(9, 9, 11, 0.85)',
          border: '1px solid #27272a',
          padding: '4px 10px',
          borderRadius: '6px',
          fontSize: '0.72rem',
          color: '#cbd5e1',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span>💡</span> Click anywhere on heart or button above to inspect every part & cure
        </div>

        {loading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0, 0, 0, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10, color: '#f8fafc', fontSize: '13px', fontWeight: 500 }}>
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
                onSelectVessel={(v) => {
                  handleSelectVessel(v);
                  setIsAnatomyModalOpen(true);
                }}
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

      {/* Full 3D Heart Anatomy & Pathology Explorer Modal */}
      <HeartAnatomyModal
        isOpen={isAnatomyModalOpen}
        onClose={() => setIsAnatomyModalOpen(false)}
        patient={patient}
        analysis={analysis}
        initialPartId={activeSelectedVessel || 'lad'}
      />
    </div>
  );
};
