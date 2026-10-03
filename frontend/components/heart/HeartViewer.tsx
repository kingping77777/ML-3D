'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { PredictionResponse, VesselName } from '../../types/predictions';
import { HeartModel } from './HeartModel';
import { HeartControls } from './HeartControls';
import { VesselInteraction } from './VesselInteraction';
import { WebGLFallback } from './WebGLFallback';

interface HeartViewerProps {
  data: PredictionResponse | null;
  loading?: boolean;
  error?: string | null;
  isMock?: boolean;
  onToggleMock?: () => void;
  selectedVessel?: VesselName | null;
  onSelectVessel?: (vessel: VesselName | null) => void;
  height?: string;
  hideDetails?: boolean;
}

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

export const HeartViewer: React.FC<HeartViewerProps> = ({
  data,
  loading = false,
  error = null,
  isMock = false,
  onToggleMock,
  selectedVessel: externalSelectedVessel,
  onSelectVessel: externalOnSelectVessel,
  height = '420px',
  hideDetails = false
}) => {
  const [internalSelectedVessel, setInternalSelectedVessel] = useState<VesselName | null>(null);
  const [hoveredVessel, setHoveredVessel] = useState<{ key: VesselName; pos: { x: number; y: number } } | null>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [force2DView, setForce2DView] = useState<boolean>(false);

  const controlsRef = useRef<OrbitControlsImpl>(null);

  const activeSelectedVessel = externalSelectedVessel !== undefined ? externalSelectedVessel : internalSelectedVessel;
  const handleSelectVessel = (vessel: VesselName | null) => {
    if (externalOnSelectVessel) {
      externalOnSelectVessel(vessel);
    } else {
      setInternalSelectedVessel(vessel);
    }
  };

  useEffect(() => {
    setWebglSupported(checkWebGLSupport());
  }, []);

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // If WebGL is unsupported or user forced 2D view, render 2D fallback
  if (!webglSupported || force2DView) {
    return (
      <div style={{ padding: '16px', background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(51, 65, 85, 0.8)', borderRadius: '16px', color: '#f8fafc' }}>
        <WebGLFallback
          data={data!}
          selectedVessel={activeSelectedVessel}
          onSelectVessel={handleSelectVessel}
          reason={!webglSupported ? 'WebGL is not supported by your browser/device.' : 'User toggled 2D mode.'}
        />
        <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
          {webglSupported && (
            <button
              onClick={() => setForce2DView(false)}
              style={{ padding: '6px 14px', background: '#38bdf8', border: 'none', borderRadius: '6px', color: '#0f172a', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Switch to 3D View
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Controls Bar & View Modes */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
        <HeartControls
          selectedVessel={activeSelectedVessel}
          onSelectVessel={handleSelectVessel}
          onResetView={handleResetView}
        />
        <button
          onClick={() => setForce2DView(true)}
          style={{
            padding: '6px 12px',
            background: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#94a3b8',
            fontSize: '0.75rem',
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          2D Cards
        </button>
      </div>

      {/* 3D Canvas Area */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: height,
        background: 'radial-gradient(circle, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid rgba(51, 65, 85, 0.8)',
        boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Loading Overlay */}
        {loading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20, color: '#38bdf8' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>Computing multi-vessel 3D heatmap...</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Dynamic coronary artery risk synthesis</div>
          </div>
        )}

        {/* Error Overlay */}
        {error && !loading && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 20, padding: '24px', color: '#f43f5e' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>⚠️ FastAPI Connection Error</div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', textAlign: 'center', maxWidth: '420px', marginBottom: '14px' }}>{error}</div>
            {onToggleMock && (
              <button onClick={onToggleMock} style={{ padding: '6px 14px', background: '#eab308', border: 'none', borderRadius: '6px', color: '#0f172a', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}>
                Switch to Offline Simulation
              </button>
            )}
          </div>
        )}

        {/* Hover Tooltip */}
        {hoveredVessel && data && (
          <div
            style={{
              position: 'fixed',
              left: `${hoveredVessel.pos.x + 12}px`,
              top: `${hoveredVessel.pos.y - 32}px`,
              background: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid #38bdf8',
              padding: '6px 12px',
              borderRadius: '6px',
              color: '#f8fafc',
              fontSize: '0.8rem',
              fontWeight: 600,
              pointerEvents: 'none',
              zIndex: 30,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
            }}
          >
            {hoveredVessel.key.toUpperCase()} Model-Estimated Probability: {((data.visualization[hoveredVessel.key]?.probability ?? 0) * 100).toFixed(1)}%
          </div>
        )}

        {/* Three.js R3F Canvas */}
        {data && (
          <Canvas
            camera={{ position: [0, 0, 4.5], fov: 45 }}
            gl={{ antialias: true, powerPreference: 'low-power' }}
            onPointerMissed={() => handleSelectVessel(null)}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[5, 8, 5]} intensity={1.2} />
            <directionalLight position={[-5, -5, -5]} intensity={0.4} />

            <Suspense fallback={null}>
              <HeartModel
                data={data}
                selectedVessel={activeSelectedVessel}
                onSelectVessel={handleSelectVessel}
                onHoverVessel={(key, ev) => setHoveredVessel(key && ev ? { key, pos: ev } : null)}
              />
            </Suspense>

            <OrbitControls
              ref={controlsRef}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={2.5}
              maxDistance={8.0}
            />
          </Canvas>
        )}
      </div>

      {/* Selected Vessel Interaction Card */}
      {!hideDetails && data && activeSelectedVessel && (
        <VesselInteraction
          selectedVessel={activeSelectedVessel}
          data={data}
        />
      )}
    </div>
  );
};
