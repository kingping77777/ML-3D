import React from 'react';
import { PredictionResponse, VesselName } from '../../types/predictions';
import { VESSEL_MAPPINGS } from './heartMapping';

interface VesselInteractionProps {
  selectedVessel: VesselName | null;
  data: PredictionResponse;
  onClose?: () => void;
}

export const VesselInteraction: React.FC<VesselInteractionProps> = ({
  selectedVessel,
  data
}) => {
  if (!selectedVessel) {
    return (
      <div
        style={{
          padding: '20px',
          background: '#09090b',
          borderRadius: '12px',
          border: '1px dashed #27272a',
          color: '#94a3b8',
          textAlign: 'center',
          fontSize: '0.9rem'
        }}
      >
        👈 <strong>Interactive Anatomical Viewer:</strong> Click any coronary vessel (LAD, LCX, RCA) in the 3D scene or selection bar to inspect model-estimated risk probabilities and vessel details.
      </div>
    );
  }

  const mapping = VESSEL_MAPPINGS[selectedVessel];
  const pred = data.predictions[selectedVessel];
  const vis = data.visualization[selectedVessel];

  const probPercent = (vis.probability * 100).toFixed(1);
  const isPositive = pred.predicted_class === 1;

  return (
    <div
      style={{
        padding: '20px',
        background: '#09090b',
        borderRadius: '12px',
        border: '1px solid #38bdf8',
        color: '#f8fafc',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#38bdf8', textTransform: 'uppercase' }}>
            Selected Vessel Structure
          </span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '2px 0 0 0', color: '#f8fafc' }}>
            {mapping.label} — {mapping.fullName}
          </h2>
        </div>
        <span
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 700,
            background: isPositive ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)',
            color: isPositive ? '#f43f5e' : '#10b981',
            border: `1px solid ${isPositive ? '#f43f5e' : '#10b981'}`
          }}
        >
          {isPositive ? 'Elevated Risk' : 'Normal Risk'}
        </span>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '16px', lineHeight: 1.4 }}>
        {mapping.description}
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          padding: '12px',
          background: '#000000',
          borderRadius: '8px',
          marginBottom: '16px'
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
            Model-Estimated Probability
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
            {probPercent}%
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>
            Operating Status
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: isPositive ? '#f43f5e' : '#10b981', marginTop: '6px' }}>
            {isPositive ? 'Positive at selected operating threshold' : 'Negative at selected operating threshold'}
          </div>
        </div>
      </div>

      <div style={{ fontSize: '0.75rem', color: '#64748b', borderTop: '1px solid #27272a', paddingTop: '10px' }}>
        ℹ️ <em>{data.disclaimer}</em>
      </div>
    </div>
  );
};
