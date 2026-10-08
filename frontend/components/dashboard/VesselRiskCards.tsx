'use client';

import React from 'react';
import { TargetName, AnalyzeResponse } from '../../types/predictions';

interface VesselRiskCardsProps {
  analysis: AnalyzeResponse;
  selectedTarget: TargetName;
  onSelectTarget: (target: TargetName) => void;
}

const VESSEL_INFO = {
  lad: {
    title: 'LAD (Left Anterior Descending)',
    anatomy: 'Supplies anterior myocardium, interventricular septum & apex.',
    color: '#ef4444'
  },
  lcx: {
    title: 'LCX (Left Circumflex)',
    anatomy: 'Supplies posterolateral left ventricle & lateral wall.',
    color: '#38bdf8'
  },
  rca: {
    title: 'RCA (Right Coronary Artery)',
    anatomy: 'Supplies right ventricle, inferior LV wall & conduction nodes.',
    color: '#f59e0b'
  }
};

export const VesselRiskCards: React.FC<VesselRiskCardsProps> = ({
  analysis,
  selectedTarget,
  onSelectTarget
}) => {
  const cadPred = analysis.predictions.cad;
  const isCadHigh = cadPred ? cadPred.predicted_class === 1 : false;
  const cadProbPercent = cadPred ? (cadPred.probability * 100).toFixed(1) : '0';
  const cadThresholdPercent = cadPred ? (cadPred.threshold * 100).toFixed(0) : '45';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* 1. Overall CAD Prediction Banner */}
      <div
        onClick={() => onSelectTarget('cad')}
        style={{
          background: selectedTarget === 'cad'
            ? '#18181b'
            : '#09090b',
          border: selectedTarget === 'cad' ? '2px solid #38bdf8' : '1px solid #27272a',
          borderRadius: '16px',
          padding: '16px 20px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: selectedTarget === 'cad' ? '0 0 20px rgba(56, 189, 248, 0.2)' : 'none'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.3rem' }}>🫀</span>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc' }}>
                Overall CAD Risk Profile
              </h3>
              <span
                style={{
                  background: isCadHigh ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                  color: isCadHigh ? '#fca5a5' : '#6ee7b7',
                  border: `1px solid ${isCadHigh ? '#ef4444' : '#10b981'}`,
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                {isCadHigh ? '⚠️ Elevated CAD Risk' : '✅ Low CAD Risk'}
              </span>
            </div>
            <p style={{ margin: '4px 0 0 34px', fontSize: '0.8rem', color: '#94a3b8' }}>
              Multi-vessel machine learning ensemble with calibrated probability estimation.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 900, color: isCadHigh ? '#ef4444' : '#10b981' }}>
              {cadProbPercent}%
            </span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              (Threshold: {cadThresholdPercent}%)
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '12px', background: '#000000', borderRadius: '8px', height: '8px', overflow: 'hidden', position: 'relative' }}>
          <div
            style={{
              width: `${Math.min(100, Math.max(0, cadPred ? cadPred.probability * 100 : 0))}%`,
              height: '100%',
              background: isCadHigh
                ? 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)'
                : 'linear-gradient(90deg, #38bdf8 0%, #10b981 100%)',
              transition: 'width 0.4s ease'
            }}
          />
          {/* Threshold marker */}
          <div
            style={{
              position: 'absolute',
              left: `${cadThresholdPercent}%`,
              top: 0,
              bottom: 0,
              width: '2px',
              background: '#ffffff',
              opacity: 0.8
            }}
            title={`Threshold: ${cadThresholdPercent}%`}
          />
        </div>
      </div>

      {/* 2. Vessel-Specific Risk Grid (LAD, LCX, RCA) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {(['lad', 'lcx', 'rca'] as const).map((vesselKey) => {
          const pred = analysis.predictions[vesselKey];
          const info = VESSEL_INFO[vesselKey];
          const isSelected = selectedTarget === vesselKey;
          const isElevated = pred ? pred.predicted_class === 1 : false;
          const prob = pred ? (pred.probability * 100).toFixed(1) : '0';
          const threshold = pred ? (pred.threshold * 100).toFixed(0) : '40';

          return (
            <div
              key={vesselKey}
              onClick={() => onSelectTarget(vesselKey)}
              style={{
                background: isSelected ? '#18181b' : '#09090b',
                border: isSelected ? `2px solid ${info.color}` : '1px solid #27272a',
                borderRadius: '14px',
                padding: '14px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: isSelected ? `0 0 16px ${info.color}33` : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase' }}>
                  {vesselKey.toUpperCase()}
                </span>
                <span
                  style={{
                    background: isElevated ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                    color: isElevated ? '#fca5a5' : '#6ee7b7',
                    border: `1px solid ${isElevated ? '#ef4444' : '#10b981'}`,
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.68rem',
                    fontWeight: 700
                  }}
                >
                  {isElevated ? 'Elevated' : 'Normal'}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: isElevated ? '#ef4444' : '#38bdf8' }}>
                  {prob}%
                </span>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  Threshold: {threshold}%
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ background: '#000000', borderRadius: '6px', height: '6px', overflow: 'hidden', position: 'relative' }}>
                <div
                  style={{
                    width: `${Math.min(100, Math.max(0, pred ? pred.probability * 100 : 0))}%`,
                    height: '100%',
                    background: isElevated ? '#ef4444' : '#38bdf8',
                    transition: 'width 0.4s ease'
                  }}
                />
              </div>

              <span style={{ fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.3, marginTop: '2px' }}>
                {info.anatomy}
              </span>

              <div style={{ marginTop: 'auto', paddingTop: '6px' }}>
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: isSelected ? info.color : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  {isSelected ? '● Target Inspected' : '○ Click to Inspect'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
