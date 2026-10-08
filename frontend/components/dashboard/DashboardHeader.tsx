'use client';

import React from 'react';
import { TargetName, AnalyzeResponse } from '../../types/predictions';

interface DashboardHeaderProps {
  isMock: boolean;
  backendOnline: boolean | null;
  onToggleMock: () => void;
  onOpenReport: () => void;
  selectedTarget?: TargetName;
  onSelectTarget?: (target: TargetName) => void;
  analysis?: AnalyzeResponse;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isMock,
  backendOnline,
  onToggleMock,
  onOpenReport,
  selectedTarget = 'cad',
  onSelectTarget,
  analysis
}) => {
  const ladProb = analysis?.predictions?.lad ? (analysis.predictions.lad.probability * 100).toFixed(1) : '83.6';
  const lcxProb = analysis?.predictions?.lcx ? (analysis.predictions.lcx.probability * 100).toFixed(1) : '38.5';
  const rcaProb = analysis?.predictions?.rca ? (analysis.predictions.rca.probability * 100).toFixed(1) : '0.0';

  return (
    <header style={{
      background: '#09090b',
      backdropFilter: 'blur(16px)',
      border: '1px solid #27272a',
      borderRadius: '16px',
      padding: '16px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      color: '#dfe2ef'
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        {/* Brand Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #00e5ff 0%, #0284c7 50%, #f43f5e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            boxShadow: '0 4px 14px rgba(0, 229, 255, 0.3)'
          }}>
            🫀
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>
                CardioVision 3D
              </h1>
              <span style={{
                background: 'rgba(0, 229, 255, 0.12)',
                color: '#00e5ff',
                border: '1px solid rgba(0, 229, 255, 0.3)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.68rem',
                fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace',
                letterSpacing: '0.05em'
              }}>
                CLINICAL AI v4.2
              </span>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'Geist, sans-serif' }}>
              Multi-Vessel Coronary Artery Disease Detection & 3D Explainability
            </p>
          </div>
        </div>

        {/* Center Vessel Quick Nav (Matches Stitch UI Preview 4ab0bbba) */}
        {onSelectTarget && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#000000',
            padding: '4px',
            borderRadius: '8px',
            border: '1px solid #27272a',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.75rem'
          }}>
            <button
              onClick={() => onSelectTarget('lad')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: selectedTarget === 'lad' ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid transparent',
                background: selectedTarget === 'lad' ? '#18181b' : 'transparent',
                color: selectedTarget === 'lad' ? '#00e5ff' : '#94a3b8',
                fontWeight: selectedTarget === 'lad' ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              LAD ({ladProb}%)
            </button>
            <button
              onClick={() => onSelectTarget('lcx')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: selectedTarget === 'lcx' ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid transparent',
                background: selectedTarget === 'lcx' ? '#18181b' : 'transparent',
                color: selectedTarget === 'lcx' ? '#00e5ff' : '#94a3b8',
                fontWeight: selectedTarget === 'lcx' ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              LCx ({lcxProb}%)
            </button>
            <button
              onClick={() => onSelectTarget('rca')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: selectedTarget === 'rca' ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid transparent',
                background: selectedTarget === 'rca' ? '#18181b' : 'transparent',
                color: selectedTarget === 'rca' ? '#00e5ff' : '#94a3b8',
                fontWeight: selectedTarget === 'rca' ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              RCA ({rcaProb}%)
            </button>
            <button
              onClick={() => onSelectTarget('cad')}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: selectedTarget === 'cad' ? '1px solid rgba(0, 229, 255, 0.4)' : '1px solid transparent',
                background: selectedTarget === 'cad' ? '#18181b' : 'transparent',
                color: selectedTarget === 'cad' ? '#00e5ff' : '#788796',
                fontWeight: selectedTarget === 'cad' ? 700 : 500,
                cursor: 'pointer'
              }}
            >
              Full Tree
            </button>
          </div>
        )}

        {/* Right Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Server Connection State Pill */}
          <button
            onClick={onToggleMock}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '20px',
              padding: '5px 12px',
              fontSize: '0.75rem',
              fontWeight: 600,
              fontFamily: 'JetBrains Mono, monospace',
              color: isMock ? '#fef08a' : backendOnline === true ? '#4edea3' : '#00e5ff',
              cursor: 'pointer'
            }}
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isMock ? '#eab308' : backendOnline === true ? '#10b981' : '#00e5ff',
              boxShadow: isMock ? '0 0 8px #eab308' : '0 0 8px #10b981'
            }} />
            {isMock ? 'Mock Simulation' : backendOnline === true ? 'CatBoost Live' : 'Auto Bridge'}
          </button>

          {/* Diagnostic Report Button */}
          <button
            onClick={onOpenReport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#00e5ff',
              border: 'none',
              borderRadius: '8px',
              padding: '7px 14px',
              color: '#08090c',
              fontSize: '0.8rem',
              fontWeight: 700,
              fontFamily: 'Space Grotesk, sans-serif',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 229, 255, 0.35)'
            }}
          >
            📄 Diagnostic Report
          </button>

          {/* Physician Avatar Badge */}
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#18181b',
            border: '1px solid #27272a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: '#00e5ff',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            MV
          </div>
        </div>
      </div>

      {/* Pipeline Navigation Ribbon */}
      <div style={{
        background: '#000000',
        borderRadius: '8px',
        padding: '6px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #27272a',
        fontSize: '0.72rem',
        fontFamily: 'JetBrains Mono, monospace',
        overflowX: 'auto',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00e5ff', fontWeight: 600 }}>
          <span>1. Clinical Inputs</span>
          <span style={{ color: '#788796' }}>➔</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00e5ff', fontWeight: 600 }}>
          <span>2. FastAPI Bridge</span>
          <span style={{ color: '#788796' }}>➔</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00e5ff', fontWeight: 600 }}>
          <span>3. Multi-Vessel ML</span>
          <span style={{ color: '#788796' }}>➔</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a855f7', fontWeight: 600 }}>
          <span>4. TreeSHAP Attribution</span>
          <span style={{ color: '#788796' }}>➔</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f43f5e', fontWeight: 600 }}>
          <span>5. 3D Coronary Anatomy</span>
          <span style={{ color: '#788796' }}>➔</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4edea3', fontWeight: 700 }}>
          <span>6. Diagnostic Report</span>
        </div>
      </div>
    </header>
  );
};
