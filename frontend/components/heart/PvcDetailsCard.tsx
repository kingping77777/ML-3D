'use client';

import React from 'react';
import { PVCOrigin } from './pvcOrigins';

interface PvcDetailsCardProps {
  origin: PVCOrigin;
  onClose: () => void;
}

export const PvcDetailsCard: React.FC<PvcDetailsCardProps> = ({ origin, onClose }) => {
  return (
    <div style={{
      background: '#09090b',
      border: '1px solid #27272a',
      borderRadius: '8px',
      padding: '16px',
      color: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #27272a', paddingBottom: '10px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {origin.category}
          </span>
          <h3 style={{ margin: '2px 0 0 0', fontSize: '16px', fontWeight: 600, color: '#f8fafc' }}>
            {origin.fullName}
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#a1a1aa',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '2px 6px'
          }}
        >
          ×
        </button>
      </div>

      {/* Clinical Description */}
      <p style={{ margin: 0, color: '#d4d4d8', fontSize: '13px', lineHeight: 1.5 }}>
        {origin.description}
      </p>

      {/* 12-Lead ECG Features */}
      <div style={{
        background: '#18181b',
        borderRadius: '6px',
        border: '1px solid #27272a',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontSize: '12.5px'
      }}>
        <div style={{ fontWeight: 600, color: '#f8fafc', marginBottom: '2px' }}>
          12-Lead ECG Morphology Characteristics
        </div>
        <div><span style={{ color: '#a1a1aa' }}>Electrical Axis:</span> <strong>{origin.ecgFeatures.axis}</strong></div>
        <div><span style={{ color: '#a1a1aa' }}>V1 Lead Morphology:</span> <strong>{origin.ecgFeatures.morphology}</strong></div>
        <div><span style={{ color: '#a1a1aa' }}>Precordial Transition:</span> <strong>{origin.ecgFeatures.transition}</strong></div>

        {origin.ecgFeatures.otherFeatures.length > 0 && (
          <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', color: '#d4d4d8' }}>
            {origin.ecgFeatures.otherFeatures.map((feat, idx) => (
              <li key={idx} style={{ marginTop: '2px' }}>{feat}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Ablation Approach */}
      <div style={{ fontSize: '12.5px', color: '#d4d4d8', lineHeight: 1.45 }}>
        <strong style={{ color: '#f8fafc' }}>Catheter Ablation Approach: </strong>
        {origin.ablationApproach}
      </div>

      {/* Meta Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#a1a1aa', borderTop: '1px solid #27272a', paddingTop: '8px' }}>
        <div>Prevalence: <strong style={{ color: '#f8fafc' }}>{origin.prevalence}</strong></div>
        <div>Differentials: <strong style={{ color: '#f8fafc' }}>{origin.differentialLocations.join(', ')}</strong></div>
      </div>
    </div>
  );
};
