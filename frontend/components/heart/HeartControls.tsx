import React from 'react';
import { VesselName } from '../../types/predictions';
import { VESSEL_MAPPINGS } from './heartMapping';

interface HeartControlsProps {
  selectedVessel: VesselName | null;
  onSelectVessel: (vessel: VesselName | null) => void;
  onResetView: () => void;
}

export const HeartControls: React.FC<HeartControlsProps> = ({
  selectedVessel,
  onSelectVessel,
  onResetView
}) => {
  const vessels: VesselName[] = ['lad', 'lcx', 'rca'];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center',
        padding: '8px 12px',
        background: '#1e293b',
        borderRadius: '8px',
        border: '1px solid #334155'
      }}
    >
      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' }}>
        Select Vessel:
      </span>

      {vessels.map((vesselKey) => {
        const isSelected = selectedVessel === vesselKey;
        const mapping = VESSEL_MAPPINGS[vesselKey];

        return (
          <button
            key={vesselKey}
            onClick={() => onSelectVessel(isSelected ? null : vesselKey)}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: isSelected ? '1px solid #38bdf8' : '1px solid #475569',
              background: isSelected ? '#0284c7' : '#334155',
              color: '#f8fafc',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {mapping.label}
          </button>
        );
      })}

      {selectedVessel && (
        <button
          onClick={() => onSelectVessel(null)}
          style={{
            padding: '6px 10px',
            borderRadius: '6px',
            border: '1px solid #475569',
            background: 'transparent',
            color: '#94a3b8',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          Clear Selection
        </button>
      )}

      <div style={{ marginLeft: 'auto' }}>
        <button
          onClick={onResetView}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #38bdf8',
            background: 'rgba(56, 189, 248, 0.1)',
            color: '#38bdf8',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          🔄 Reset View
        </button>
      </div>
    </div>
  );
};
