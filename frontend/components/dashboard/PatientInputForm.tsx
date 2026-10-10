'use client';

import React, { useState } from 'react';
import { PatientInput } from '../../types/predictions';
import { CLINICAL_PRESETS } from '../../utils/casePresets';
import { validatePatientClinicalInputs, CLINICAL_BOUNDS } from '../../utils/clinicalValidation';

interface PatientInputFormProps {
  patient: PatientInput;
  selectedPresetId: string;
  loading: boolean;
  onSelectPreset: (presetId: string) => void;
  onUpdateField: (field: keyof PatientInput, value: any) => void;
  onRunAnalysis: () => void;
  onRandomize: () => void;
}

type TabType = 'demographics' | 'symptoms' | 'labs' | 'ecg_echo';

export const PatientInputForm: React.FC<PatientInputFormProps> = ({
  patient,
  selectedPresetId,
  loading,
  onSelectPreset,
  onUpdateField,
  onRunAnalysis,
  onRandomize
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('symptoms');

  const validationErrors = validatePatientClinicalInputs(patient);
  const hasErrors = validationErrors.length > 0;

  const renderInputField = (
    field: keyof PatientInput,
    label: string,
    unit: string
  ) => {
    const bound = CLINICAL_BOUNDS[field];
    const err = validationErrors.find((e) => e.field === field);
    const isInvalid = Boolean(err);

    return (
      <div style={{
        background: isInvalid ? 'rgba(239, 68, 68, 0.12)' : '#18181b',
        padding: '10px',
        borderRadius: '8px',
        border: isInvalid ? '1px solid #ef4444' : '1px solid #27272a',
        transition: 'all 0.15s ease'
      }}>
        <label style={{ display: 'block', fontSize: '0.75rem', color: isInvalid ? '#fca5a5' : '#94a3b8', marginBottom: '4px', fontWeight: isInvalid ? 700 : 500 }}>
          {label}
        </label>
        <input
          type="number"
          value={(patient as any)[field]}
          onChange={(e) => onUpdateField(field, Number(e.target.value))}
          style={{
            width: '100%',
            background: '#000000',
            border: isInvalid ? '2px solid #ef4444' : '1px solid #27272a',
            color: isInvalid ? '#f87171' : '#f8fafc',
            padding: '6px 8px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: isInvalid ? 700 : 400
          }}
        />
        {isInvalid ? (
          <span style={{ fontSize: '0.68rem', color: '#ef4444', fontWeight: 700, display: 'block', marginTop: '4px' }}>
            ⚠️ This cannot be possible! ({err?.allowedRange})
          </span>
        ) : (
          <span style={{ fontSize: '0.65rem', color: '#71717a' }}>{unit}</span>
        )}
      </div>
    );
  };

  return (
    <div style={{
      background: '#09090b',
      border: '1px solid #27272a',
      borderRadius: '16px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      color: '#f8fafc'
    }}>
      {/* 1. Header & Presets */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#38bdf8' }}>👤</span> Patient Clinical Profile
          </h3>
          <button
            onClick={onRandomize}
            disabled={loading}
            style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              borderRadius: '6px',
              padding: '4px 10px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            🎲 Randomize Case
          </button>
        </div>

        {/* Case Presets Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
          {CLINICAL_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset.id)}
                style={{
                  background: isSelected ? '#0284c7' : '#18181b',
                  color: isSelected ? '#ffffff' : '#a1a1aa',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid #27272a',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {preset.title}
              </button>
            );
          })}
          {selectedPresetId === 'custom' && (
            <span style={{
              background: 'rgba(234, 179, 8, 0.15)',
              border: '1px solid #eab308',
              color: '#fef08a',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              fontWeight: 600
            }}>
              ✏️ Custom Profile
            </span>
          )}
        </div>
      </div>

      {/* Validation Alert Banner */}
      {hasErrors && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid #ef4444',
          borderRadius: '10px',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          color: '#fca5a5'
        }}>
          <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ⛔ THIS CANNOT BE POSSIBLE — INVALID CLINICAL INPUT
          </div>
          {validationErrors.map((err, idx) => (
            <div key={idx} style={{ fontSize: '0.75rem', lineHeight: 1.4 }}>
              ❌ <strong>{err.message}</strong>
            </div>
          ))}
        </div>
      )}

      {/* 2. Category Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #27272a', gap: '4px' }}>
        {[
          { id: 'symptoms', label: 'Symptoms & History' },
          { id: 'ecg_echo', label: 'ECG & Echo' },
          { id: 'labs', label: 'Biomarkers & Labs' },
          { id: 'demographics', label: 'Vitals & Demo' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            style={{
              padding: '8px 12px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #38bdf8' : '2px solid transparent',
              color: activeTab === tab.id ? '#38bdf8' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.75rem',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Tab Form Fields */}
      <div style={{ minHeight: '260px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* TAB: Symptoms & History */}
        {activeTab === 'symptoms' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {/* Typical Chest Pain */}
            <div style={{ background: '#18181b', padding: '10px 12px', borderRadius: '8px', border: '1px solid #27272a' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Typical Angina</span>
                <input
                  type="checkbox"
                  checked={patient.Typical_Chest_Pain === 1}
                  onChange={(e) => onUpdateField('Typical_Chest_Pain', e.target.checked ? 1 : 0)}
                  style={{ accentColor: '#ef4444', width: '16px', height: '16px' }}
                />
              </label>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Exertional chest discomfort</span>
            </div>

            {/* Dyspnea */}
            <div style={{ background: '#18181b', padding: '10px 12px', borderRadius: '8px', border: '1px solid #27272a' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Dyspnea</span>
                <input
                  type="checkbox"
                  checked={patient.Dyspnea === 1}
                  onChange={(e) => onUpdateField('Dyspnea', e.target.checked ? 1 : 0)}
                  style={{ accentColor: '#38bdf8', width: '16px', height: '16px' }}
                />
              </label>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Shortness of breath</span>
            </div>

            {/* Diabetes Mellitus */}
            <div style={{ background: '#18181b', padding: '10px 12px', borderRadius: '8px', border: '1px solid #27272a' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Diabetes (DM)</span>
                <input
                  type="checkbox"
                  checked={patient.DM === 1}
                  onChange={(e) => onUpdateField('DM', e.target.checked ? 1 : 0)}
                  style={{ accentColor: '#f59e0b', width: '16px', height: '16px' }}
                />
              </label>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Diagnosed Type 1/2</span>
            </div>

            {/* Hypertension */}
            <div style={{ background: '#18181b', padding: '10px 12px', borderRadius: '8px', border: '1px solid #27272a' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Hypertension (HTN)</span>
                <input
                  type="checkbox"
                  checked={patient.HTN === 1}
                  onChange={(e) => onUpdateField('HTN', e.target.checked ? 1 : 0)}
                  style={{ accentColor: '#f59e0b', width: '16px', height: '16px' }}
                />
              </label>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Chronic high BP</span>
            </div>

            {/* Current Smoker */}
            <div style={{ background: '#18181b', padding: '10px 12px', borderRadius: '8px', border: '1px solid #27272a' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Current Smoker</span>
                <input
                  type="checkbox"
                  checked={patient.Current_Smoker === 1}
                  onChange={(e) => onUpdateField('Current_Smoker', e.target.checked ? 1 : 0)}
                  style={{ accentColor: '#ef4444', width: '16px', height: '16px' }}
                />
              </label>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Active tobacco use</span>
            </div>

            {/* Family History */}
            <div style={{ background: '#18181b', padding: '10px 12px', borderRadius: '8px', border: '1px solid #27272a' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Family History (FH)</span>
                <input
                  type="checkbox"
                  checked={patient.FH === 1}
                  onChange={(e) => onUpdateField('FH', e.target.checked ? 1 : 0)}
                  style={{ accentColor: '#a855f7', width: '16px', height: '16px' }}
                />
              </label>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Premature CAD history</span>
            </div>
          </div>
        )}

        {/* TAB: ECG & Echo */}
        {activeTab === 'ecg_echo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* EF_TTE Slider */}
            <div style={{ background: '#18181b', padding: '12px', borderRadius: '8px', border: '1px solid #27272a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Ejection Fraction (EF_TTE)</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: patient.EF_TTE < 50 ? '#ef4444' : '#10b981' }}>
                  {patient.EF_TTE}%
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                value={patient.EF_TTE}
                onChange={(e) => onUpdateField('EF_TTE', Number(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: '#94a3b8', marginTop: '2px' }}>
                <span>Severe (&lt;35%)</span>
                <span>Normal (55-70%)</span>
              </div>
            </div>

            {/* ECG Checks Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#18181b', padding: '8px 10px', borderRadius: '6px', border: '1px solid #27272a', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={patient.St_Depression === 1}
                  onChange={(e) => onUpdateField('St_Depression', e.target.checked ? 1 : 0)}
                  style={{ accentColor: '#ef4444' }}
                />
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>ST Depression</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#18181b', padding: '8px 10px', borderRadius: '6px', border: '1px solid #27272a', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={patient.Tinversion === 1}
                  onChange={(e) => onUpdateField('Tinversion', e.target.checked ? 1 : 0)}
                  style={{ accentColor: '#ef4444' }}
                />
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>T-Inversion</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#18181b', padding: '8px 10px', borderRadius: '6px', border: '1px solid #27272a', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={patient.Q_Wave === 1}
                  onChange={(e) => onUpdateField('Q_Wave', e.target.checked ? 1 : 0)}
                  style={{ accentColor: '#f59e0b' }}
                />
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Pathological Q-Wave</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#18181b', padding: '8px 10px', borderRadius: '6px', border: '1px solid #27272a', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={patient.Poor_R_Progression === 1}
                  onChange={(e) => onUpdateField('Poor_R_Progression', e.target.checked ? 1 : 0)}
                  style={{ accentColor: '#f59e0b' }}
                />
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Poor R Progression</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB: Labs & Biomarkers */}
        {activeTab === 'labs' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {renderInputField('FBS', 'Fasting Blood Sugar (FBS)', 'mg/dL (Normal <100)')}
            {renderInputField('LDL', 'LDL Cholesterol', 'mg/dL (Target <100)')}
            {renderInputField('HDL', 'HDL Cholesterol', 'mg/dL (Target >40)')}
            {renderInputField('TG', 'Triglycerides (TG)', 'mg/dL (Normal <150)')}
          </div>
        )}

        {/* TAB: Demographics & Vitals */}
        {activeTab === 'demographics' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            {renderInputField('Age', 'Age (Years)', 'Years (1 to 120)')}

            <div style={{ background: '#18181b', padding: '10px', borderRadius: '8px', border: '1px solid #27272a' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Biological Sex</label>
              <select
                value={patient.Sex}
                onChange={(e) => onUpdateField('Sex', e.target.value)}
                style={{ width: '100%', background: '#000000', border: '1px solid #27272a', color: '#f8fafc', padding: '6px 8px', borderRadius: '6px', fontSize: '0.85rem' }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {renderInputField('BP', 'Systolic Blood Pressure', 'mmHg (50 to 300)')}
            {renderInputField('PR', 'Pulse Rate (PR)', 'bpm (30 to 250)')}
          </div>
        )}
      </div>

      {/* 4. Action Button */}
      <button
        onClick={onRunAnalysis}
        disabled={loading || hasErrors}
        style={{
          marginTop: '4px',
          padding: '12px',
          background: hasErrors
            ? '#3f3f46'
            : loading
            ? '#27272a'
            : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          border: 'none',
          borderRadius: '10px',
          color: hasErrors ? '#a1a1aa' : '#f8fafc',
          fontWeight: 700,
          fontSize: '0.9rem',
          cursor: (loading || hasErrors) ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          boxShadow: hasErrors ? 'none' : '0 4px 12px rgba(2, 132, 199, 0.3)'
        }}
      >
        {hasErrors
          ? '⛔ Cannot Compute — Fix Invalid Input Values Above'
          : loading
          ? '⏳ Computing ML & SHAP Analysis...'
          : '⚡ Re-compute CAD & Vessel Risk'}
      </button>
    </div>
  );
};

