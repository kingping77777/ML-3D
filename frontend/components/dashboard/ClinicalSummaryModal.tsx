'use client';

import React from 'react';
import { PatientInput, AnalyzeResponse } from '../../types/predictions';

interface ClinicalSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientInput;
  analysis: AnalyzeResponse;
}

export const ClinicalSummaryModal: React.FC<ClinicalSummaryModalProps> = ({
  isOpen,
  onClose,
  patient,
  analysis
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        background: '#0f172a',
        border: '1px solid #334155',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '750px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        color: '#f8fafc',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #334155', paddingBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>📄</span>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>
                CardioVision 3D Clinical Decision Support Summary
              </h2>
            </div>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Automated AI Multi-Vessel Risk Stratification & SHAP Attribution Report
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#94a3b8',
              borderRadius: '8px',
              padding: '6px 12px',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Patient Profile Box */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#38bdf8', fontWeight: 700 }}>
            👤 Patient Baseline Profile
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', fontSize: '0.8rem' }}>
            <div><span style={{ color: '#94a3b8' }}>Age/Sex:</span> <strong>{patient.Age}yo {patient.Sex}</strong></div>
            <div><span style={{ color: '#94a3b8' }}>BP:</span> <strong>{patient.BP} mmHg</strong></div>
            <div><span style={{ color: '#94a3b8' }}>EF (Echo):</span> <strong>{patient.EF_TTE}%</strong></div>
            <div><span style={{ color: '#94a3b8' }}>Pulse Rate:</span> <strong>{patient.PR} bpm</strong></div>
            <div><span style={{ color: '#94a3b8' }}>Typical Angina:</span> <strong>{patient.Typical_Chest_Pain ? 'Yes' : 'No'}</strong></div>
            <div><span style={{ color: '#94a3b8' }}>Diabetes:</span> <strong>{patient.DM ? 'Yes' : 'No'}</strong></div>
            <div><span style={{ color: '#94a3b8' }}>Smoking:</span> <strong>{patient.Current_Smoker ? 'Active' : 'No'}</strong></div>
            <div><span style={{ color: '#94a3b8' }}>LDL/HDL:</span> <strong>{patient.LDL}/{patient.HDL}</strong></div>
          </div>
        </div>

        {/* Vessel Prediction Table */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', color: '#38bdf8', fontWeight: 700 }}>
            🫀 Multi-Vessel Risk Stratification
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', textAlign: 'left', color: '#94a3b8' }}>
                <th style={{ padding: '6px' }}>Target Artery</th>
                <th style={{ padding: '6px' }}>Calibrated Prob</th>
                <th style={{ padding: '6px' }}>Opt. Threshold</th>
                <th style={{ padding: '6px' }}>Model Classification</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Overall CAD', data: analysis.predictions.cad },
                { name: 'LAD (Anterior)', data: analysis.predictions.lad },
                { name: 'LCX (Circumflex)', data: analysis.predictions.lcx },
                { name: 'RCA (Right Coronary)', data: analysis.predictions.rca }
              ].map((row, idx) => {
                const isElevated = row.data?.predicted_class === 1;
                return (
                  <tr key={idx} style={{ borderBottom: '1px solid #1e293b' }}>
                    <td style={{ padding: '8px 6px', fontWeight: 700 }}>{row.name}</td>
                    <td style={{ padding: '8px 6px', color: isElevated ? '#ef4444' : '#10b981', fontWeight: 800 }}>
                      {((row.data?.probability || 0) * 100).toFixed(1)}%
                    </td>
                    <td style={{ padding: '8px 6px', color: '#94a3b8' }}>
                      {((row.data?.threshold || 0) * 100).toFixed(0)}%
                    </td>
                    <td style={{ padding: '8px 6px' }}>
                      <span style={{
                        background: isElevated ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: isElevated ? '#fca5a5' : '#6ee7b7',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        {isElevated ? '⚠️ Elevated Risk' : '✅ Normal Risk'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Top SHAP Drivers Summary */}
        <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', padding: '16px' }}>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#38bdf8', fontWeight: 700 }}>
            🔍 Primary AI Explainability Factors (CAD)
          </h4>
          <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {analysis.explanations.cad?.top_features?.slice(0, 4).map((f, i) => (
              <li key={i}>
                <strong style={{ color: f.shap_value > 0 ? '#ef4444' : '#10b981' }}>
                  {f.feature.replace(/_/g, ' ')} ({f.shap_value > 0 ? '+' : ''}{f.shap_value.toFixed(3)})
                </strong>: {f.explanation}
              </li>
            ))}
          </ul>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #334155', paddingTop: '16px' }}>
          <button
            onClick={handlePrint}
            style={{
              padding: '10px 20px',
              background: '#0284c7',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            🖨️ Print / Save Report
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: '#334155',
              border: 'none',
              borderRadius: '8px',
              color: '#f8fafc',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
