'use client';

import React, { useMemo } from 'react';
import { TargetName, AnalyzeResponse, PatientInput } from '../../types/predictions';
import { getPatientSymptomMedicineConnections } from '../heart/patientSymptomMedicine';

interface AnatomicalExplanationCardProps {
  analysis: AnalyzeResponse;
  selectedTarget: TargetName;
  onSelectTarget: (target: TargetName) => void;
  patient?: PatientInput;
}

const HEART_PARTS_INFO = {
  cad: {
    name: 'Overall Heart Perfusion & CAD Profile',
    diseaseName: 'Coronary Artery Disease (CAD) & Diffuse Atherosclerosis',
    location: 'Entire Coronary Artery System (LAD, LCX, RCA)',
    simpleLocation: 'All major blood vessels supplying oxygen to your entire heart muscle',
    icon: '🫀',
    color: '#00e5ff',
    damageDescription: 'Widespread fatty plaque build-up (atherosclerosis) narrows arterial lumens across multiple coronary branches, restricting oxygenated blood supply to the heart tissue.',
    clinicalExample: 'Example: A patient experiencing exertion-induced chest tightness (angina) and shortness of breath due to multi-vessel arterial narrowing, with ST-segment depression during physical activity.'
  },
  lad: {
    name: 'LAD (Left Anterior Descending Artery)',
    diseaseName: 'LAD Stenosis / Anterior Wall Ischemia ("Widow Maker" Region)',
    location: 'Anterior Wall of Left Ventricle, Apex & Interventricular Septum',
    simpleLocation: 'Front wall and primary pumping tip (apex) of the heart',
    icon: '🫁',
    color: '#ef4444',
    damageDescription: 'Blockage or constriction in the LAD deprives the front wall and apex of vital blood flow, compromising over 50% of the heart\'s primary pumping capacity.',
    clinicalExample: 'Example: Severe narrowing in the LAD causes anterior wall tissue ischemia, resulting in exertion-induced angina radiating to the left shoulder and ST-depression in anterior ECG leads (V1-V4).'
  },
  lcx: {
    name: 'LCX (Left Circumflex Artery)',
    diseaseName: 'LCX Occlusion / Posterolateral Ischemia',
    location: 'Posterolateral Wall of Left Ventricle & Left Atrium',
    simpleLocation: 'Back and side wall of the left ventricle',
    icon: '⚡',
    color: '#38bdf8',
    damageDescription: 'Restricted blood flow through the LCX damages the side and back walls of the heart. Symptoms may be subtle, presenting as left-side chest aching or back pressure.',
    clinicalExample: 'Example: Posterolateral myocardial ischemia manifesting as lateral ST-segment depression in ECG leads I, aVL, V5, and V6 during cardiac stress testing.'
  },
  rca: {
    name: 'RCA (Right Coronary Artery)',
    diseaseName: 'RCA Stenosis / Inferior Wall & Electrical Node Ischemia',
    location: 'Inferior Left Ventricular Wall, Right Ventricle & SA/AV Nodes',
    simpleLocation: 'Bottom floor of the heart, right ventricle & natural pacemaker nodes',
    icon: '🔋',
    color: '#f59e0b',
    damageDescription: 'Narrowing of the RCA impairs oxygenation to the bottom wall of the heart and electrical nodes (SA/AV nodes), which can trigger rhythm disturbances (bradycardia).',
    clinicalExample: 'Example: Inferior wall ischemia causing nausea, dizziness, and low heart rate (sinus bradycardia) along with ST-changes in inferior ECG leads II, III, and aVF.'
  }
};

export const AnatomicalExplanationCard: React.FC<AnatomicalExplanationCardProps> = ({
  analysis,
  selectedTarget,
  onSelectTarget,
  patient
}) => {
  const currentPart = HEART_PARTS_INFO[selectedTarget] || HEART_PARTS_INFO.cad;
  const pred = analysis.predictions[selectedTarget] || analysis.predictions.cad;
  const exp = analysis.explanations?.[selectedTarget];

  const probPercent = (pred.probability * 100).toFixed(1);
  const isHighRisk = pred.predicted_class === 1;

  // Extract top 3 positive risk factors
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
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      color: '#f8fafc',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            💬 Clinical Disease Diagnosis & Anatomical Breakdown
          </span>
          <h3 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>{currentPart.icon}</span> {currentPart.name}
          </h3>
        </div>

        {/* Target Selector Pills */}
        <div style={{ display: 'flex', gap: '4px', background: '#18181b', padding: '4px', borderRadius: '10px', border: '1px solid #27272a' }}>
          {(['cad', 'lad', 'lcx', 'rca'] as const).map((t) => (
            <button
              key={t}
              onClick={() => onSelectTarget(t)}
              style={{
                padding: '6px 14px',
                background: selectedTarget === t ? '#0284c7' : 'transparent',
                color: selectedTarget === t ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: 3 Analytical Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: WHERE & WHAT Damage Occurs */}
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '14px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>📍</span> DAMAGE LOCATION & DISEASE IDENTIFICATION
          </div>
          
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.3 }}>
            {currentPart.diseaseName}
          </div>

          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', background: '#000000', padding: '8px 12px', borderRadius: '8px', border: '1px solid #27272a' }}>
            <strong>Target Area:</strong> {currentPart.simpleLocation}
            <br />
            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Anatomical Zone: {currentPart.location}</span>
          </div>

          <p style={{ margin: 0, fontSize: '0.78rem', color: '#a1a1aa', lineHeight: 1.5 }}>
            {currentPart.damageDescription}
          </p>

          <div style={{ fontSize: '0.75rem', color: '#e0f2fe', background: 'rgba(2, 132, 199, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '8px 10px', borderRadius: '8px', lineHeight: 1.4 }}>
            💡 <strong>Clinical Example:</strong> {currentPart.clinicalExample}
          </div>
        </div>

        {/* Card 2: WHAT is the AI Risk Level */}
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '14px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isHighRisk ? '#f87171' : '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⚠️</span> AI RISK PROBABILITY & SEVERITY
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 900, color: isHighRisk ? '#ef4444' : '#10b981' }}>
              {probPercent}%
            </span>
            <span style={{
              background: isHighRisk ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: isHighRisk ? '#fca5a5' : '#6ee7b7',
              border: `1px solid ${isHighRisk ? '#ef4444' : '#10b981'}`,
              padding: '4px 10px',
              borderRadius: '16px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              {isHighRisk ? '⚠️ High Risk of Blockage' : '✅ Low Risk / Normal Flow'}
            </span>
          </div>

          <p style={{ margin: 0, fontSize: '0.78rem', color: '#a1a1aa', lineHeight: 1.5 }}>
            {isHighRisk
              ? `Multi-vessel ML ensemble models detected significant signs of arterial narrowing and impaired blood perfusion in the ${selectedTarget.toUpperCase()} section.`
              : `The ML model estimates normal arterial perfusion without significant blood flow restriction in the ${selectedTarget.toUpperCase()} area.`}
          </p>

          <div style={{ marginTop: 'auto', background: '#000000', padding: '10px', borderRadius: '8px', border: '1px solid #27272a' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Calibrated Decision Threshold</span>
              <strong>{(pred.threshold * 100).toFixed(0)}%</strong>
            </div>
            <div style={{ height: '6px', background: '#27272a', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
              <div style={{
                width: `${Math.min(100, Math.max(0, pred.probability * 100))}%`,
                height: '100%',
                background: isHighRisk ? '#ef4444' : '#10b981',
                borderRadius: '3px'
              }} />
            </div>
          </div>
        </div>

        {/* Card 3: WHY - Key Patient Risk Drivers */}
        <div style={{
          background: '#18181b',
          border: '1px solid #27272a',
          borderRadius: '14px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a855f7', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🔍</span> WHY DID AI PREDICT THIS? (Key Contributing Drivers)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
            {topRiskFactors.length > 0 ? (
              topRiskFactors.map((rf, idx) => (
                <div key={idx} style={{
                  background: '#000000',
                  border: '1px solid #27272a',
                  borderRadius: '8px',
                  padding: '8px 10px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.78rem', color: '#f8fafc' }}>
                      {rf.name}
                    </strong>
                    <span style={{ fontSize: '0.68rem', background: 'rgba(239, 68, 68, 0.18)', color: '#f87171', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                      Val: {String(rf.value)}
                    </span>
                  </div>
                  <p style={{ margin: '3px 0 0 0', fontSize: '0.72rem', color: '#a1a1aa', lineHeight: 1.35 }}>
                    {rf.explanation}
                  </p>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '0.78rem', color: '#a1a1aa' }}>
                No significant risk-elevating clinical features identified.
              </div>
            )}

            {topProtective && (
              <div style={{
                background: '#000000',
                border: '1px solid #27272a',
                borderRadius: '8px',
                padding: '8px 10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.78rem', color: '#34d399' }}>
                    🛡️ Protective: {topProtective.feature.replace(/_/g, ' ')}
                  </strong>
                  <span style={{ fontSize: '0.68rem', background: 'rgba(16, 185, 129, 0.18)', color: '#34d399', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                    Val: {String(topProtective.value)}
                  </span>
                </div>
                <p style={{ margin: '3px 0 0 0', fontSize: '0.72rem', color: '#a1a1aa', lineHeight: 1.35 }}>
                  {topProtective.explanation}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* DYNAMIC PATIENT SYMPTOMS TO MEDICINES CONNECTION MATRIX */}
      {patient && (
        <div style={{
          background: '#18181b',
          border: '1px solid #0284c7',
          borderRadius: '14px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🔗</span> DYNAMIC PATIENT SYMPTOMS ➔ PRESCRIBED MEDICINES CONNECTION
            </div>
            <span style={{ fontSize: '0.72rem', color: '#34d399', background: 'rgba(52, 211, 153, 0.15)', padding: '3px 10px', borderRadius: '6px', border: '1px solid rgba(52, 211, 153, 0.3)', fontWeight: 700 }}>
              Live Clinical Input Link Active
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
            {getPatientSymptomMedicineConnections(patient).map((pair) => (
              <div key={pair.id} style={{
                background: '#000000',
                border: '1px solid #27272a',
                borderRadius: '10px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #27272a', paddingBottom: '6px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: pair.severity === 'high' ? '#f87171' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{pair.icon}</span> {pair.symptomName}
                  </span>
                  <span style={{ fontSize: '0.68rem', background: '#18181b', color: '#cbd5e1', padding: '2px 8px', borderRadius: '4px', border: '1px solid #27272a', fontWeight: 700 }}>
                    {pair.symptomValue}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#f8fafc', lineHeight: 1.45 }}>
                  <strong style={{ color: '#34d399' }}>💊 Prescribed Medicine:</strong> {pair.prescribedMedicine}
                </div>

                <div style={{ fontSize: '0.73rem', color: '#94a3b8', background: '#09090b', padding: '8px', borderRadius: '6px', lineHeight: 1.4 }}>
                  💡 <strong>Mechanism:</strong> {pair.clinicalMechanism}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: HOW TO CURE / MEDICAL & LIFESTYLE TREATMENT GUIDELINES */}
      <div style={{
        background: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '14px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🩺</span> HOW TO CURE & TREAT THE DISEASE (Evidence-Based Medical Protocol)
          </div>
          <span style={{ fontSize: '0.72rem', color: '#94a3b8', background: '#000000', padding: '3px 8px', borderRadius: '6px', border: '1px solid #27272a' }}>
            Clinical & Surgical Interventions
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          
          {/* Option 1: Pharmacotherapy */}
          <div style={{ background: '#000000', border: '1px solid #27272a', borderRadius: '10px', padding: '14px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              💊 1. Medical Management (Pharmacotherapy)
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <li><strong>Antiplatelet Agents (Aspirin / Clopidogrel):</strong> Prevents blood clot formation over vulnerable arterial plaque.</li>
              <li><strong>Statins (Atorvastatin / Rosuvastatin):</strong> Lowers LDL cholesterol, reduces arterial inflammation, and stabilizes vessel walls.</li>
              <li><strong>Beta-Blockers (Metoprolol / Bisoprolol):</strong> Decreases heart rate and blood pressure, reducing myocardial oxygen demand.</li>
              <li><strong>ACE Inhibitors / ARBs:</strong> Relaxes vascular smooth muscle and protects against left ventricular remodeling.</li>
            </ul>
          </div>

          {/* Option 2: Surgical / Interventional Revascularization */}
          <div style={{ background: '#000000', border: '1px solid #27272a', borderRadius: '10px', padding: '14px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🩺 2. Interventional & Surgical Repairs (Revascularization)
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <li><strong>Angioplasty & Stenting (PCI):</strong> Inserting a tiny balloon and drug-eluting stent into the blocked vessel ({selectedTarget.toUpperCase()}) to restore full arterial lumen size.</li>
              <li><strong>Coronary Bypass Surgery (CABG):</strong> Surgical grafting using internal mammary or saphenous vessel grafts to bypass severe multi-vessel blockages.</li>
              <li><strong>Electrophysiology Ablation:</strong> For PVCs, targeted catheter ablation neutralizes abnormal ectopic focus regions.</li>
            </ul>
          </div>

          {/* Option 3: Lifestyle & Reversal Protocols */}
          <div style={{ background: '#000000', border: '1px solid #27272a', borderRadius: '10px', padding: '14px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🥗 3. Lifestyle & Disease Reversal Protocols
            </div>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <li><strong>Cardioprotective Nutrition:</strong> Mediterranean/low-sodium diet (rich in omega-3, vegetables, whole grains) to lower arterial plaque buildup.</li>
              <li><strong>Supervised Aerobic Exercise:</strong> 150 minutes/week moderate activity to stimulate collateral blood vessel development (angiogenesis).</li>
              <li><strong>Smoking Cessation & Glycemic Control:</strong> Eliminate smoking to restore endothelial function and maintain HbA1c &lt; 6.5%.</li>
            </ul>
          </div>

          {/* Option 4: Emergency Red Flags */}
          <div style={{ background: '#000000', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', padding: '14px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ef4444', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🚨 4. Emergency Red-Flag Warning Signs
            </div>
            <p style={{ margin: '0 0 6px 0', fontSize: '0.75rem', color: '#fca5a5', lineHeight: 1.45 }}>
              Seek immediate emergency medical care (Call 911 / 112) if experiencing:
            </p>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              <li>Sudden severe, crushing chest pain radiating to jaw, neck, or left arm.</li>
              <li>Shortness of breath (dyspnea) accompanied by cold sweats or nausea.</li>
              <li>Unexplained fainting (syncope) or rapid irregular heartbeat.</li>
            </ul>
          </div>

        </div>
      </div>

    </div>
  );
};

