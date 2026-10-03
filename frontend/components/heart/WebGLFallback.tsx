import React from 'react';
import { PredictionResponse, VesselName } from '../../types/predictions';
import { TwoDCardFallback } from './TwoDCardFallback';

interface WebGLFallbackProps {
  data: PredictionResponse;
  selectedVessel: VesselName | null;
  onSelectVessel: (vessel: VesselName) => void;
  reason?: string;
}

export const WebGLFallback: React.FC<WebGLFallbackProps> = ({
  data,
  selectedVessel,
  onSelectVessel,
  reason = '3D visualization is unavailable on this device or context.'
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div
        style={{
          padding: '12px 16px',
          background: 'rgba(234, 179, 8, 0.15)',
          border: '1px solid rgba(234, 179, 8, 0.4)',
          borderRadius: '8px',
          color: '#fef08a',
          fontSize: '0.9rem'
        }}
      >
        ⚠️ <strong>WebGL Fallback Active:</strong> {reason} Falling back to 2D card representation.
      </div>
      <TwoDCardFallback
        data={data}
        selectedVessel={selectedVessel}
        onSelectVessel={onSelectVessel}
      />
    </div>
  );
};
