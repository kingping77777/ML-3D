'use client';

import React from 'react';

interface DashboardHeaderProps {
  isMock: boolean;
  backendOnline: boolean | null;
  onToggleMock: () => void;
  onOpenReport: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isMock,
  backendOnline,
  onToggleMock,
  onOpenReport
}) => {
  return (
    <header style={{
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(51, 65, 85, 0.8)',
      borderRadius: '20px',
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      color: '#f8fafc'
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #ef4444 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.4rem',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
          }}>
            🫀
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#f8fafc' }}>
                CardioVision 3D
              </h1>
              <span style={{
                background: 'rgba(56, 189, 248, 0.15)',
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 800,
                textTransform: 'uppercase'
              }}>
                STEP 7 INTEGRATION
              </span>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
              Multi-Vessel Coronary Artery Disease Detection & 3D Explainability Platform
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Connection Status Pill */}
          <button
            onClick={onToggleMock}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: isMock
                ? 'rgba(234, 179, 8, 0.15)'
                : backendOnline === true
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(56, 189, 248, 0.15)',
              color: isMock
                ? '#fef08a'
                : backendOnline === true
                ? '#6ee7b7'
                : '#38bdf8',
              border: isMock
                ? '1px solid #eab308'
                : backendOnline === true
                ? '1px solid #10b981'
                : '1px solid #38bdf8',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isMock ? '#eab308' : backendOnline === true ? '#10b981' : '#38bdf8'
            }} />
            {isMock ? 'Mock Mode (Click for Live)' : backendOnline === true ? 'FastAPI Connected' : 'Auto-Bridge Active'}
          </button>

          {/* Export Report Button */}
          <button
            onClick={onOpenReport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              color: '#ffffff',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)'
            }}
          >
            📄 Summary Report
          </button>
        </div>
      </div>

      {/* Pipeline Navigation Flow Ribbon */}
      <div style={{
        background: '#1e293b',
        borderRadius: '10px',
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #334155',
        fontSize: '0.72rem',
        overflowX: 'auto',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: 700 }}>
          <span>1. Patient Input</span>
          <span style={{ color: '#64748b' }}>➔</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: 700 }}>
          <span>2. FastAPI</span>
          <span style={{ color: '#64748b' }}>➔</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontWeight: 700 }}>
          <span>3. CAD / LAD / LCX / RCA</span>
          <span style={{ color: '#64748b' }}>➔</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#a855f7', fontWeight: 700 }}>
          <span>4. SHAP Explanations</span>
          <span style={{ color: '#64748b' }}>➔</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ef4444', fontWeight: 700 }}>
          <span>5. 3D Heart</span>
          <span style={{ color: '#64748b' }}>➔</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontWeight: 800 }}>
          <span>6. Final Dashboard</span>
        </div>
      </div>
    </header>
  );
};
