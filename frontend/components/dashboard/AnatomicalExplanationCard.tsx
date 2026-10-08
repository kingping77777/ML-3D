'use client';

import React from 'react';
import { TargetName, AnalyzeResponse } from '../../types/predictions';

interface AnatomicalExplanationCardProps {
  analysis: AnalyzeResponse;
  selectedTarget: TargetName;
  onSelectTarget: (target: TargetName) => void;
}

const HEART_PARTS_INFO = {
  cad: {
    name: 'Overall Heart Perfusion & CAD Profile',
    location: 'Entire Coronary Artery System',
    simpleLocation: 'All blood vessels supplying your entire heart muscle',
    icon: '🫀',
    color: '#00e5ff'
  },
  lad: {
    name: 'LAD (Left Anterior Descending Artery)',
    location: 'Anterior Wall, Apex & Interventricular Septum',
    simpleLocation: 'Front wall and main tip of the heart',
    icon: '🫁',
    color: '#ef4444'
  },
  lcx: {
    name: 'LCX (Left Circumflex Artery)',
    location: 'Posterolateral Left Ventricle',
    simpleLocation: 'Back and side wall of the heart',
    icon: '⚡',
    color: '#38bdf8'
  },
  rca: {
    name: 'RCA (Right Coronary Artery)',
    location: 'Inferior LV Wall, RV & Pacemaker Nodes',
    simpleLocation: 'Bottom floor of the heart & right ventricle',
    icon: '🔋',
    color: '#f59e0b'
  }
};

export const AnatomicalExplanationCard: React.FC<AnatomicalExplanationCardProps> = ({
  analysis,
  selectedTarget,
  onSelectTarget
}) => {
  const currentPart = HEART_PARTS_INFO[selectedTarget] || HEART_PARTS_INFO.cad;
  const pred = analysis.predictions[selectedTarget] || analysis.predictions.cad;
  const exp = analysis.explanations?.[selectedTarget];

  const probPercent = (pred.probability * 100).toFixed(1);
  const isHighRisk = pred.predicted_class === 1;

  // Extract top 3 positive risk factors in simple language
  const topRiskFactors = exp?.top_features
    ? exp.top_features
        .filter((f) => f.shap_value > 0)
        .slice(0, 3)
        .map((f) => ({
          name: f.feature.replace(/_/g, ' '),
          value: f.value,
          explanation: f.explanation
        }))
    : [];

  // Extract top protective factor
  const topProtective = exp?.top_features
    ? exp.top_features.find((f) => f.shap_value < 0)
    : null;

  return (
    <div style={{
      background: '#09090b',
      border: '1px solid #27272a',
      borderRadius: '16px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      color: '#f8fafc',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            💬 Plain-English Clinical Breakdown
          </span>
          <h3 style={{ margin: '2px 0 0 0', fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{currentPart.icon}</span> {currentPart.name}
          </h3>
        </div>

        {/* Vessel Selector Pills */}
        <div style={{ display: 'flex', gap: '4px', background: '#18181b', padding: '3px', borderRadius: '8px', border: '1px solid #27272a' }}>
          {(['cad', 'lad', 'lcx', 'rca'] as const).map((t) => (
            <button
              key={t}
              onClick={() => onSelectTarget(t)}
              style={{
                padding: '4px 10px',
                background: selectedTarget === t ? '#0284c7' : 'transparent',
                color: selectedTarget === t ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                cursor: 'pointer'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main 3-Section Simple Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        
        {/* Section 1: WHERE is the problem? */}
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>📍</span> WHERE IS THE PROBLEM?
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
            {currentPart.simpleLocation}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#a1a1aa', lineHeight: 1.45 }}>
            Medical region: <strong>{currentPart.location}</strong>. This section receives oxygenated blood from the {selectedTarget.toUpperCase()} artery to pump blood to the body.
          </div>
        </div>

        {/* Section 2: WHAT is the problem? */}
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isHighRisk ? '#f87171' : '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⚠️</span> WHAT IS THE PROBLEM?
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem', fontWeight: 900, color: isHighRisk ? '#ef4444' : '#10b981' }}>
              {probPercent}%
            </span>
            <span style={{
              background: isHighRisk ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: isHighRisk ? '#fca5a5' : '#6ee7b7',
              border: `1px solid ${isHighRisk ? '#ef4444' : '#10b981'}`,
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '0.7rem',
              fontWeight: 700
            }}>
              {isHighRisk ? 'Elevated Risk' : 'Normal / Healthy'}
            </span>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#a1a1aa', lineHeight: 1.45 }}>
            {isHighRisk
              ? `The machine learning model detected significant signs of restricted blood flow (ischemia/stenosis) in this section of the heart.`
              : `The model estimates low probability of blood flow restriction in this area of the heart.`}
          </div>
        </div>

        {/* Section 3: WHY is this happening? (Simple Cause Analysis) */}
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '12px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          gridColumn: '1 / -1'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a855f7', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🔍</span> WHY DID THE AI ARRIVE AT THIS CONCLUSION? (Key Patient Drivers)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', marginTop: '4px' }}>
            {topRiskFactors.length > 0 ? (
              topRiskFactors.map((rf, idx) => (
                <div key={idx} style={{
                  background: '#000000',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  padding: '10px 12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.82rem', color: '#f8fafc' }}>
                      {rf.name}
                    </strong>
                    <span style={{ fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      Value: {String(rf.value)}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.73rem', color: '#a1a1aa', lineHeight: 1.4 }}>
                    {rf.explanation}
                  </p>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>
                No significant risk-elevating factors detected for this heart section.
              </div>
            )}

            {topProtective && (
              <div style={{
                background: '#000000',
                border: '1px solid #27272a',
                borderRadius: '8px',
                padding: '10px 12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.82rem', color: '#34d399' }}>
                    🛡️ Protective Factor: {topProtective.feature.replace(/_/g, ' ')}
                  </strong>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                    Value: {String(topProtective.value)}
                  </span>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.73rem', color: '#a1a1aa', lineHeight: 1.4 }}>
                  {topProtective.explanation}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
