import React from 'react';
import { PredictionResponse, VesselName } from '../../types/predictions';
import { VESSEL_MAPPINGS } from './heartMapping';

interface TwoDCardFallbackProps {
  data: PredictionResponse;
  selectedVessel: VesselName | null;
  onSelectVessel: (vessel: VesselName) => void;
}

export const TwoDCardFallback: React.FC<TwoDCardFallbackProps> = ({
  data,
  selectedVessel,
  onSelectVessel
}) => {
  const vessels: VesselName[] = ['lad', 'lcx', 'rca'];

  return (
    <div style={{ padding: '16px', background: '#000000', borderRadius: '12px', color: '#f8fafc' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', color: '#94a3b8' }}>
        Coronary Vessel Risk Summary (2D View)
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        {vessels.map((vesselKey) => {
          const mapping = VESSEL_MAPPINGS[vesselKey];
          const pred = data.predictions[vesselKey];
          const vis = data.visualization[vesselKey];
          const isSelected = selectedVessel === vesselKey;
          const isElevated = vis?.status === 'elevated_risk' || (pred && pred.probability >= pred.threshold);

          return (
            <div
              key={vesselKey}
              onClick={() => onSelectVessel(vesselKey)}
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: isSelected ? '2px solid #38bdf8' : '1px solid #27272a',
                background: isSelected ? '#18181b' : '#09090b',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: isSelected ? '#38bdf8' : '#f8fafc' }}>
                  {mapping.label}
                </span>
                <span
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    background: isElevated ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: isElevated ? '#f43f5e' : '#10b981',
                    border: `1px solid ${isElevated ? '#f43f5e' : '#10b981'}`
                  }}
                >
                  {isElevated ? 'Elevated Risk' : 'Normal Risk'}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '12px' }}>
                {mapping.fullName}
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc' }}>
                {(vis?.probability * 100).toFixed(1)}%
                <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#94a3b8', marginLeft: '6px' }}>
                  Model-estimated probability
                </span>
              </div>
              {pred && (
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                  Threshold: {(pred.threshold * 100).toFixed(1)}% ({pred.predicted_class === 1 ? 'Positive' : 'Negative'} at operating point)
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
