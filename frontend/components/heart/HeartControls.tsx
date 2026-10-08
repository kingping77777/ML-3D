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
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        width: '100%',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}
    >
      {/* PVC Origin Select */}
      {showPvcHotspots && onSelectPvcOrigin && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor="pvc-select" style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
            PVC Origin:
          </label>
          <select
            id="pvc-select"
            value={selectedPvcOrigin || ''}
            onChange={(e) => onSelectPvcOrigin(e.target.value || null)}
            style={{
              background: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              color: '#0f172a',
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
        <span style={{ fontSize: '12px', color: '#64748b' }}>View:</span>
        {onSetCameraPreset && (
          <div style={{ display: 'flex', gap: '2px' }}>
            <button
              onClick={() => onSetCameraPreset('anterior')}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#334155',
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
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#334155',
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
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#334155',
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
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                color: '#334155',
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
              border: '1px solid #cbd5e1',
              background: showPvcHotspots ? '#eff6ff' : '#f8fafc',
              color: showPvcHotspots ? '#1d4ed8' : '#64748b',
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
              border: '1px solid #cbd5e1',
              background: enableHeartbeat ? '#fef2f2' : '#f8fafc',
              color: enableHeartbeat ? '#b91c1c' : '#64748b',
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
            border: '1px solid #cbd5e1',
            background: '#f8fafc',
            color: '#334155',
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
