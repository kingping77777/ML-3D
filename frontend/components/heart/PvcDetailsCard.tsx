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
      background: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      color: '#0f172a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {origin.category}
          </span>
          <h3 style={{ margin: '2px 0 0 0', fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>
            {origin.fullName}
          </h3>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '2px 6px'
          }}
        >
          ×
        </button>
      </div>

      {/* Clinical Description */}
      <p style={{ margin: 0, color: '#334155', fontSize: '13px', lineHeight: 1.5 }}>
        {origin.description}
      </p>

      {/* 12-Lead ECG Features */}
      <div style={{
        background: '#f8fafc',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        fontSize: '12.5px'
      }}>
        <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '2px' }}>
          12-Lead ECG Morphology Characteristics
        </div>
        <div><span style={{ color: '#64748b' }}>Electrical Axis:</span> <strong>{origin.ecgFeatures.axis}</strong></div>
        <div><span style={{ color: '#64748b' }}>V1 Lead Morphology:</span> <strong>{origin.ecgFeatures.morphology}</strong></div>
        <div><span style={{ color: '#64748b' }}>Precordial Transition:</span> <strong>{origin.ecgFeatures.transition}</strong></div>

        {origin.ecgFeatures.otherFeatures.length > 0 && (
          <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', color: '#475569' }}>
            {origin.ecgFeatures.otherFeatures.map((feat, idx) => (
              <li key={idx} style={{ marginTop: '2px' }}>{feat}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Ablation Approach */}
      <div style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.45 }}>
        <strong style={{ color: '#0f172a' }}>Catheter Ablation Approach: </strong>
        {origin.ablationApproach}
      </div>

      {/* Meta Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
        <div>Prevalence: <strong style={{ color: '#334155' }}>{origin.prevalence}</strong></div>
        <div>Differentials: <strong style={{ color: '#334155' }}>{origin.differentialLocations.join(', ')}</strong></div>
      </div>
    </div>
  );
};
