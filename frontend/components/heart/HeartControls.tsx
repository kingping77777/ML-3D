import React from 'react';
import { VesselName } from '../../types/predictions';
import { pvcOrigins } from './pvcOrigins';

interface HeartControlsProps {
  selectedVessel: VesselName | null;
  onSelectVessel: (vessel: VesselName | null) => void;
  selectedPvcOrigin?: string | null;
  onSelectPvcOrigin?: (originId: string | null) => void;
  onResetView: () => void;
  onSetCameraPreset?: (preset: 'anterior' | 'lcx' | 'rca' | 'posterior') => void;
  enableHeartbeat?: boolean;
  onToggleHeartbeat?: () => void;
  showPvcHotspots?: boolean;
  onTogglePvcHotspots?: () => void;
}

export const HeartControls: React.FC<HeartControlsProps> = ({
  selectedPvcOrigin,
  onSelectPvcOrigin,
  onResetView,
  onSetCameraPreset,
  enableHeartbeat = true,
  onToggleHeartbeat,
  showPvcHotspots = true,
  onTogglePvcHotspots
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center',
        padding: '8px 12px',
        background: '#09090b',
        border: '1px solid #27272a',
        borderRadius: '8px',
        width: '100%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.5)'
      }}
    >
      {/* PVC Origin Select */}
      {showPvcHotspots && onSelectPvcOrigin && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="pvc-select" style={{ fontSize: '13px', fontWeight: 600, color: '#a1a1aa' }}>
            PVC Origin:
          </label>
          <select
            id="pvc-select"
            value={selectedPvcOrigin || ''}
            onChange={(e) => onSelectPvcOrigin(e.target.value || null)}
            style={{
              background: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '6px',
              color: '#f8fafc',
              padding: '4px 10px',
              fontSize: '13px',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="">Select origin point...</option>
            {pvcOrigins.map((orig) => (
              <option key={orig.id} value={orig.id}>
                {orig.name} ({orig.category})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
        <span style={{ fontSize: '12px', color: '#a1a1aa' }}>View:</span>
        {onSetCameraPreset && (
          <div style={{ display: 'flex', gap: '2px' }}>
            <button
              onClick={() => onSetCameraPreset('anterior')}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid #27272a',
                background: '#18181b',
                color: '#e4e4e7',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Anterior
            </button>
            <button
              onClick={() => onSetCameraPreset('lcx')}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid #27272a',
                background: '#18181b',
                color: '#e4e4e7',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Left
            </button>
            <button
              onClick={() => onSetCameraPreset('rca')}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid #27272a',
                background: '#18181b',
                color: '#e4e4e7',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Right
            </button>
            <button
              onClick={() => onSetCameraPreset('posterior')}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid #27272a',
                background: '#18181b',
                color: '#e4e4e7',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Posterior
            </button>
          </div>
        )}

        {/* Hotspots Toggle */}
        {onTogglePvcHotspots && (
          <button
            onClick={onTogglePvcHotspots}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              border: '1px solid #27272a',
              background: showPvcHotspots ? 'rgba(56, 189, 248, 0.15)' : '#18181b',
              color: showPvcHotspots ? '#38bdf8' : '#a1a1aa',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {showPvcHotspots ? 'Markers: ON' : 'Markers: OFF'}
          </button>
        )}

        {/* Heartbeat Toggle */}
        {onToggleHeartbeat && (
          <button
            onClick={onToggleHeartbeat}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              border: '1px solid #27272a',
              background: enableHeartbeat ? 'rgba(239, 68, 68, 0.15)' : '#18181b',
              color: enableHeartbeat ? '#f87171' : '#a1a1aa',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            {enableHeartbeat ? 'Beat: ON' : 'Beat: OFF'}
          </button>
        )}

        {/* Reset Camera */}
        <button
          onClick={onResetView}
          style={{
            padding: '4px 10px',
            borderRadius: '4px',
            border: '1px solid #27272a',
            background: '#18181b',
            color: '#e4e4e7',
            fontSize: '12px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Reset View
        </button>
      </div>
    </div>
  );
};
