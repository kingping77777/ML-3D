'use client';

import React, { useState } from 'react';
import { PatientInput } from '../../types/predictions';
import { CLINICAL_PRESETS } from '../../utils/casePresets';

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
                  background: isSelected ? '#0284c7' : 'rgba(30, 41, 59, 0.8)',
                  color: isSelected ? '#ffffff' : '#94a3b8',
                  border: isSelected ? '1px solid #38bdf8' : '1px solid #334155',
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

      {/* 2. Category Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #334155', gap: '4px' }}>
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
            <div style={{ background: '#1e293b', padding: '10px 12px', borderRadius: '8px', border: '1px solid #334155' }}>
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
            <div style={{ background: '#1e293b', padding: '10px 12px', borderRadius: '8px', border: '1px solid #334155' }}>
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
            <div style={{ background: '#1e293b', padding: '10px 12px', borderRadius: '8px', border: '1px solid #334155' }}>
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
            <div style={{ background: '#1e293b', padding: '10px 12px', borderRadius: '8px', border: '1px solid #334155' }}>
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
            <div style={{ background: '#1e293b', padding: '10px 12px', borderRadius: '8px', border: '1px solid #334155' }}>
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
            <div style={{ background: '#1e293b', padding: '10px 12px', borderRadius: '8px', border: '1px solid #334155' }}>
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
            <div style={{ background: '#1e293b', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Ejection Fraction (EF_TTE)</span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: patient.EF_TTE < 50 ? '#ef4444' : '#10b981' }}>
                  {patient.EF_TTE}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="75"
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
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e293b', padding: '8px 10px', borderRadius: '6px', border: '1px solid #334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={patient.St_Depression === 1}
                  onChange={(e) => onUpdateField('St_Depression', e.target.checked ? 1 : 0)}
                  style={{ accentColor: '#ef4444' }}
                />
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>ST Depression</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e293b', padding: '8px 10px', borderRadius: '6px', border: '1px solid #334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={patient.Tinversion === 1}
                  onChange={(e) => onUpdateField('Tinversion', e.target.checked ? 1 : 0)}
                  style={{ accentColor: '#ef4444' }}
                />
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>T-Inversion</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e293b', padding: '8px 10px', borderRadius: '6px', border: '1px solid #334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={patient.Q_Wave === 1}
                  onChange={(e) => onUpdateField('Q_Wave', e.target.checked ? 1 : 0)}
                  style={{ accentColor: '#f59e0b' }}
                />
                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>Pathological Q-Wave</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e293b', padding: '8px 10px', borderRadius: '6px', border: '1px solid #334155', cursor: 'pointer' }}>
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
            <div style={{ background: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid #334155' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                Fasting Blood Sugar (FBS)
              </label>
              <input
                type="number"
                value={patient.FBS}
                onChange={(e) => onUpdateField('FBS', Number(e.target.value))}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '6px 8px', borderRadius: '6px', fontSize: '0.85rem' }}
              />
              <span style={{ fontSize: '0.65rem', color: '#64748b' }}>mg/dL (Normal &lt;100)</span>
            </div>

            <div style={{ background: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid #334155' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                LDL Cholesterol
              </label>
              <input
                type="number"
                value={patient.LDL}
                onChange={(e) => onUpdateField('LDL', Number(e.target.value))}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '6px 8px', borderRadius: '6px', fontSize: '0.85rem' }}
              />
              <span style={{ fontSize: '0.65rem', color: '#64748b' }}>mg/dL (Target &lt;100)</span>
            </div>

            <div style={{ background: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid #334155' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                HDL Cholesterol
              </label>
              <input
                type="number"
                value={patient.HDL}
                onChange={(e) => onUpdateField('HDL', Number(e.target.value))}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '6px 8px', borderRadius: '6px', fontSize: '0.85rem' }}
              />
              <span style={{ fontSize: '0.65rem', color: '#64748b' }}>mg/dL (Target &gt;40/50)</span>
            </div>

            <div style={{ background: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid #334155' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>
                Triglycerides (TG)
              </label>
              <input
                type="number"
                value={patient.TG}
                onChange={(e) => onUpdateField('TG', Number(e.target.value))}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '6px 8px', borderRadius: '6px', fontSize: '0.85rem' }}
              />
              <span style={{ fontSize: '0.65rem', color: '#64748b' }}>mg/dL (Normal &lt;150)</span>
            </div>
          </div>
        )}

        {/* TAB: Demographics & Vitals */}
        {activeTab === 'demographics' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div style={{ background: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid #334155' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Age (Years)</label>
              <input
                type="number"
                value={patient.Age}
                min="20"
                max="95"
                onChange={(e) => onUpdateField('Age', Number(e.target.value))}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '6px 8px', borderRadius: '6px', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ background: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid #334155' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Biological Sex</label>
              <select
                value={patient.Sex}
                onChange={(e) => onUpdateField('Sex', e.target.value)}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '6px 8px', borderRadius: '6px', fontSize: '0.85rem' }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div style={{ background: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid #334155' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Systolic Blood Pressure</label>
              <input
                type="number"
                value={patient.BP}
                onChange={(e) => onUpdateField('BP', Number(e.target.value))}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '6px 8px', borderRadius: '6px', fontSize: '0.85rem' }}
              />
              <span style={{ fontSize: '0.65rem', color: '#64748b' }}>mmHg</span>
            </div>

            <div style={{ background: '#1e293b', padding: '10px', borderRadius: '8px', border: '1px solid #334155' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Pulse Rate (PR)</label>
              <input
                type="number"
                value={patient.PR}
                onChange={(e) => onUpdateField('PR', Number(e.target.value))}
                style={{ width: '100%', background: '#0f172a', border: '1px solid #334155', color: '#f8fafc', padding: '6px 8px', borderRadius: '6px', fontSize: '0.85rem' }}
              />
              <span style={{ fontSize: '0.65rem', color: '#64748b' }}>bpm</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Action Button */}
      <button
        onClick={onRunAnalysis}
        disabled={loading}
        style={{
          marginTop: '4px',
          padding: '12px',
          background: loading ? '#475569' : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          border: 'none',
          borderRadius: '10px',
          color: '#f8fafc',
          fontWeight: 700,
          fontSize: '0.9rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
        }}
      >
        {loading ? '⏳ Computing ML & SHAP Analysis...' : '⚡ Re-compute CAD & Vessel Risk'}
      </button>
    </div>
  );
};
