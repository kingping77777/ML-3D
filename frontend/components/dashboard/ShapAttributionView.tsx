'use client';

import React, { useState } from 'react';
import { TargetName, ExplanationResponse, FeatureContribution } from '../../types/predictions';

interface ShapAttributionViewProps {
  explanations: Record<TargetName, ExplanationResponse>;
  selectedTarget: TargetName;
  onSelectTarget: (target: TargetName) => void;
}

export const ShapAttributionView: React.FC<ShapAttributionViewProps> = ({
  explanations,
  selectedTarget,
  onSelectTarget
}) => {
  const [showAll, setShowAll] = useState<boolean>(false);
  const currentExp = explanations[selectedTarget] || explanations.cad;

  if (!currentExp) {
    return (
      <div style={{ padding: '20px', background: '#0f172a', borderRadius: '16px', color: '#94a3b8' }}>
        No explanation data available.
      </div>
    );
  }

  const features = showAll && currentExp.all_features?.length > 0
    ? currentExp.all_features
    : currentExp.top_features || [];

  // Find max absolute SHAP value for scaling bars
  const maxAbsShap = Math.max(0.01, ...features.map((f) => Math.abs(f.shap_value)));

  return (
    <div style={{
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(51, 65, 85, 0.8)',
      borderRadius: '16px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      color: '#f8fafc'
    }}>
      {/* 1. Header & Target Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#a855f7' }}>📊</span> Local SHAP Explainability Engine
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Additive feature attribution decomposing model probability
          </span>
        </div>

        {/* Target Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: '#1e293b', padding: '3px', borderRadius: '8px', border: '1px solid #334155' }}>
          {(['cad', 'lad', 'lcx', 'rca'] as const).map((target) => (
            <button
              key={target}
              onClick={() => onSelectTarget(target)}
              style={{
                padding: '4px 10px',
                background: selectedTarget === target ? '#0284c7' : 'transparent',
                color: selectedTarget === target ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {target}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Metadata Banner */}
      <div style={{
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '10px',
        padding: '10px 14px',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        fontSize: '0.72rem'
      }}>
        <div>
          <span style={{ color: '#94a3b8', display: 'block' }}>Target Model</span>
          <strong style={{ color: '#38bdf8' }}>{currentExp.model_type.split(' ')[0]}</strong>
        </div>
        <div>
          <span style={{ color: '#94a3b8', display: 'block' }}>Explainer Type</span>
          <strong style={{ color: '#a855f7' }}>{currentExp.explainer_type}</strong>
        </div>
        <div>
          <span style={{ color: '#94a3b8', display: 'block' }}>Base Value E[f(x)]</span>
          <strong style={{ color: '#f8fafc' }}>{(currentExp.shap_base_value * 100).toFixed(1)}%</strong>
        </div>
        <div>
          <span style={{ color: '#94a3b8', display: 'block' }}>Net SHAP Shift</span>
          <strong style={{ color: currentExp.shap_sum_contributions >= 0 ? '#ef4444' : '#10b981' }}>
            {currentExp.shap_sum_contributions >= 0 ? '+' : ''}{(currentExp.shap_sum_contributions * 100).toFixed(1)}%
          </strong>
        </div>
      </div>

      {/* 3. SHAP Waterfall / Feature Contribution Bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#cbd5e1' }}>
            Key Feature Contributions (Target: <span style={{ color: '#38bdf8', textTransform: 'uppercase' }}>{selectedTarget}</span>)
          </span>
          <div style={{ display: 'flex', gap: '12px', fontSize: '0.7rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fca5a5' }}>
              <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '2px' }} />
              Elevates Risk (+)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6ee7b7' }}>
              <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '2px' }} />
              Protective (-)
            </span>
          </div>
        </div>

        {/* Feature List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {features.map((feat: FeatureContribution, idx: number) => {
            const isPositive = feat.shap_value > 0;
            const barWidthPercent = (Math.abs(feat.shap_value) / maxAbsShap) * 100;

            return (
              <div
                key={idx}
                style={{
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
              >
                {/* Feature Name & Value */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      background: '#0f172a',
                      color: '#94a3b8',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      #{feat.rank}
                    </span>
                    <strong style={{ fontSize: '0.82rem', color: '#f8fafc' }}>
                      {feat.feature.replace(/_/g, ' ')}
                    </strong>
                    <span style={{
                      fontSize: '0.7rem',
                      background: 'rgba(56, 189, 248, 0.1)',
                      color: '#38bdf8',
                      padding: '1px 6px',
                      borderRadius: '4px'
                    }}>
                      Value: {String(feat.value)}
                    </span>
                  </div>

                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    color: isPositive ? '#ef4444' : '#10b981'
                  }}>
                    {isPositive ? '+' : ''}{feat.shap_value.toFixed(3)}
                  </span>
                </div>

                {/* Contribution Visual Bar */}
                <div style={{ background: '#0f172a', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${barWidthPercent}%`,
                      height: '100%',
                      background: isPositive
                        ? 'linear-gradient(90deg, #f87171 0%, #ef4444 100%)'
                        : 'linear-gradient(90deg, #34d399 0%, #10b981 100%)',
                      borderRadius: '3px',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>

                {/* Plain English explanation */}
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.3 }}>
                  {feat.explanation}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Disclaimer Note */}
      <div style={{ fontSize: '0.68rem', color: '#64748b', borderTop: '1px solid #334155', paddingTop: '8px' }}>
        ℹ️ {currentExp.disclaimer}
      </div>
    </div>
  );
};
