import { PatientInput, CasePreset, AnalyzeResponse } from '../types/predictions';

export const CLINICAL_PRESETS: CasePreset[] = [
  {
    id: 'case_multivessel',
    title: 'Severe Triple-Vessel CAD',
    subtitle: '64yo Male with Typical Angina & Multi-Vessel Involvement',
    category: 'High Risk',
    description: 'Elevated fasting blood sugar, hypertension, smoking history, ST depression, low EF (40%), and regional wall motion abnormalities.',
    data: {
      Age: 64, Weight: 82, Length: 170, BMI: 28.37, BP: 155, PR: 88,
      FBS: 175, CR: 1.2, TG: 240, LDL: 165, HDL: 36, BUN: 24, ESR: 28,
      HB: 13.8, K: 4.4, Na: 138, WBC: 8900, Lymph: 24, Neut: 72, PLT: 260000,
      EF_TTE: 40, Sex: 'Male', Function_Class: 2, BBB: 'N', VHD: 'N',
      Obesity: 1, CRF: 0, CVA: 0, Airway_disease: 0, Thyroid_Disease: 0,
      CHF: 1, DLP: 1, Weak_Peripheral_Pulse: 1, Lung_rales: 0,
      Systolic_Murmur: 0, Diastolic_Murmur: 0, Dyspnea: 1, Atypical: 0,
      Nonanginal: 0, LowTH_Ang: 0, LVH: 1, Poor_R_Progression: 1,
      DM: 1, HTN: 1, Current_Smoker: 1, EX_Smoker: 0, FH: 1, Edema: 1,
      Typical_Chest_Pain: 1, Q_Wave: 1, St_Elevation: 0, St_Depression: 1,
      Tinversion: 1, Region_RWMA: 2
    }
  },
  {
    id: 'case_lad',
    title: 'Isolated Anterior LAD Stenosis',
    subtitle: '58yo Female with Exertional Angina & Anterior Ischemia',
    category: 'Isolated Stenosis',
    description: 'High LDL, typical exertional chest discomfort, localized anterior T-wave inversions, and normal EF (52%).',
    data: {
      Age: 58, Weight: 68, Length: 162, BMI: 25.91, BP: 140, PR: 76,
      FBS: 112, CR: 0.85, TG: 170, LDL: 155, HDL: 44, BUN: 16, ESR: 18,
      HB: 13.1, K: 4.1, Na: 141, WBC: 7100, Lymph: 31, Neut: 63, PLT: 230000,
      EF_TTE: 52, Sex: 'Female', Function_Class: 1, BBB: 'N', VHD: 'N',
      Obesity: 0, CRF: 0, CVA: 0, Airway_disease: 0, Thyroid_Disease: 0,
      CHF: 0, DLP: 1, Weak_Peripheral_Pulse: 0, Lung_rales: 0,
      Systolic_Murmur: 0, Diastolic_Murmur: 0, Dyspnea: 1, Atypical: 0,
      Nonanginal: 0, LowTH_Ang: 0, LVH: 0, Poor_R_Progression: 1,
      DM: 0, HTN: 1, Current_Smoker: 0, EX_Smoker: 1, FH: 1, Edema: 0,
      Typical_Chest_Pain: 1, Q_Wave: 0, St_Elevation: 0, St_Depression: 0,
      Tinversion: 1, Region_RWMA: 1
    }
  },
  {
    id: 'case_rca',
    title: 'Isolated RCA / Inferior Ischemia',
    subtitle: '61yo Male with Atypical Pain & Inferior Q-Waves',
    category: 'Isolated Stenosis',
    description: 'Significant dyslipidemia, inferior wall Q-waves, mild bradycardia, isolated right coronary artery obstruction pattern.',
    data: {
      Age: 61, Weight: 79, Length: 175, BMI: 25.80, BP: 132, PR: 62,
      FBS: 125, CR: 1.0, TG: 210, LDL: 148, HDL: 40, BUN: 19, ESR: 14,
      HB: 14.5, K: 4.3, Na: 139, WBC: 7800, Lymph: 28, Neut: 66, PLT: 215000,
      EF_TTE: 50, Sex: 'Male', Function_Class: 1, BBB: 'N', VHD: 'N',
      Obesity: 0, CRF: 0, CVA: 0, Airway_disease: 0, Thyroid_Disease: 0,
      CHF: 0, DLP: 1, Weak_Peripheral_Pulse: 0, Lung_rales: 0,
      Systolic_Murmur: 0, Diastolic_Murmur: 0, Dyspnea: 0, Atypical: 1,
      Nonanginal: 0, LowTH_Ang: 0, LVH: 0, Poor_R_Progression: 0,
      DM: 1, HTN: 0, Current_Smoker: 1, EX_Smoker: 0, FH: 0, Edema: 0,
      Typical_Chest_Pain: 0, Q_Wave: 1, St_Elevation: 0, St_Depression: 1,
      Tinversion: 0, Region_RWMA: 1
    }
  },
  {
    id: 'case_lowrisk',
    title: 'Low-Risk / Healthy Perfusion',
    subtitle: '45yo Female with Non-Anginal Atypical Symptoms',
    category: 'Low Risk',
    description: 'Optimal lipid panel, normal blood pressure, preserved EF (65%), normal ECG/Echo with zero wall motion abnormalities.',
    data: {
      Age: 45, Weight: 59, Length: 165, BMI: 21.67, BP: 118, PR: 68,
      FBS: 88, CR: 0.7, TG: 95, LDL: 82, HDL: 62, BUN: 12, ESR: 6,
      HB: 13.6, K: 4.0, Na: 142, WBC: 5800, Lymph: 36, Neut: 56, PLT: 255000,
      EF_TTE: 65, Sex: 'Female', Function_Class: 0, BBB: 'N', VHD: 'N',
      Obesity: 0, CRF: 0, CVA: 0, Airway_disease: 0, Thyroid_Disease: 0,
      CHF: 0, DLP: 0, Weak_Peripheral_Pulse: 0, Lung_rales: 0,
      Systolic_Murmur: 0, Diastolic_Murmur: 0, Dyspnea: 0, Atypical: 0,
      Nonanginal: 1, LowTH_Ang: 0, LVH: 0, Poor_R_Progression: 0,
      DM: 0, HTN: 0, Current_Smoker: 0, EX_Smoker: 0, FH: 0, Edema: 0,
      Typical_Chest_Pain: 0, Q_Wave: 0, St_Elevation: 0, St_Depression: 0,
      Tinversion: 0, Region_RWMA: 0
    }
  }
];

export function getMockAnalysisForPatient(patient: PatientInput): AnalyzeResponse {
  // Compute deterministic simulated probabilities based on key clinical drivers
  const isHighRisk = (patient.Typical_Chest_Pain === 1 ? 0.35 : 0.05) +
                     (patient.Age > 60 ? 0.15 : 0.05) +
                     (patient.St_Depression === 1 || patient.Tinversion === 1 ? 0.20 : 0.0) +
                     (patient.DM === 1 ? 0.10 : 0.0) +
                     (patient.EF_TTE < 50 ? 0.15 : 0.02) +
                     (patient.DLP === 1 ? 0.08 : 0.0);

  const cadProb = Math.min(0.96, Math.max(0.08, parseFloat(isHighRisk.toFixed(2))));
  const ladProb = Math.min(0.94, Math.max(0.06, parseFloat((cadProb * 0.95 + (patient.Typical_Chest_Pain ? 0.12 : -0.1)).toFixed(2))));
  const lcxProb = Math.min(0.90, Math.max(0.05, parseFloat((cadProb * 0.55 + (patient.HTN ? 0.08 : -0.05)).toFixed(2))));
  const rcaProb = Math.min(0.92, Math.max(0.07, parseFloat((cadProb * 0.72 + (patient.Q_Wave ? 0.14 : -0.08)).toFixed(2))));

  const cadThreshold = 0.45;
  const ladThreshold = 0.40;
  const lcxThreshold = 0.35;
  const rcaThreshold = 0.38;

  return {
    predictions: {
      cad: { probability: cadProb, predicted_class: cadProb >= cadThreshold ? 1 : 0, threshold: cadThreshold },
      lad: { probability: ladProb, predicted_class: ladProb >= ladThreshold ? 1 : 0, threshold: ladThreshold },
      lcx: { probability: lcxProb, predicted_class: lcxProb >= lcxThreshold ? 1 : 0, threshold: lcxThreshold },
      rca: { probability: rcaProb, predicted_class: rcaProb >= rcaThreshold ? 1 : 0, threshold: rcaThreshold }
    },
    visualization: {
      lad: { probability: ladProb, status: ladProb >= ladThreshold ? 'elevated_risk' : 'normal_risk' },
      lcx: { probability: lcxProb, status: lcxProb >= lcxThreshold ? 'elevated_risk' : 'normal_risk' },
      rca: { probability: rcaProb, status: rcaProb >= rcaThreshold ? 'elevated_risk' : 'normal_risk' }
    },
    explanations: {
      cad: {
        target: 'cad',
        model_type: 'ExtraTreesClassifier (Calibrated)',
        explainer_type: 'TreeSHAP',
        probability: cadProb,
        threshold: cadThreshold,
        predicted_class: cadProb >= cadThreshold ? 1 : 0,
        shap_base_value: 0.48,
        shap_sum_contributions: parseFloat((cadProb - 0.48).toFixed(3)),
        top_features: [
          { feature: 'Typical_Chest_Pain', value: patient.Typical_Chest_Pain, shap_value: patient.Typical_Chest_Pain ? +0.18 : -0.12, direction: patient.Typical_Chest_Pain ? 'increases_risk' : 'decreases_risk', rank: 1, explanation: patient.Typical_Chest_Pain ? 'Presence of typical angina increases CAD risk' : 'Absence of typical chest pain reduces CAD risk' },
          { feature: 'Age', value: patient.Age, shap_value: patient.Age > 60 ? +0.11 : -0.07, direction: patient.Age > 60 ? 'increases_risk' : 'decreases_risk', rank: 2, explanation: `Age (${patient.Age}) ${patient.Age > 60 ? 'elevates' : 'decreases'} cardiovascular baseline risk` },
          { feature: 'EF_TTE', value: patient.EF_TTE, shap_value: patient.EF_TTE < 50 ? +0.10 : -0.09, direction: patient.EF_TTE < 50 ? 'increases_risk' : 'decreases_risk', rank: 3, explanation: `Ejection fraction (${patient.EF_TTE}%) ${patient.EF_TTE < 50 ? 'indicates systolic dysfunction' : 'is preserved'}` },
          { feature: 'St_Depression', value: patient.St_Depression, shap_value: patient.St_Depression ? +0.09 : -0.04, direction: patient.St_Depression ? 'increases_risk' : 'decreases_risk', rank: 4, explanation: patient.St_Depression ? 'ST-segment depression indicates subendocardial ischemia' : 'Normal ST-segment baseline' },
          { feature: 'DM', value: patient.DM, shap_value: patient.DM ? +0.08 : -0.05, direction: patient.DM ? 'increases_risk' : 'decreases_risk', rank: 5, explanation: patient.DM ? 'Diabetes mellitus elevates micro- & macrovascular risk' : 'Absence of diabetes' },
          { feature: 'FBS', value: patient.FBS, shap_value: patient.FBS > 125 ? +0.07 : -0.04, direction: patient.FBS > 125 ? 'increases_risk' : 'decreases_risk', rank: 6, explanation: `Fasting blood sugar (${patient.FBS} mg/dL)` },
          { feature: 'LDL', value: patient.LDL, shap_value: patient.LDL > 130 ? +0.06 : -0.05, direction: patient.LDL > 130 ? 'increases_risk' : 'decreases_risk', rank: 7, explanation: `LDL cholesterol (${patient.LDL} mg/dL)` },
          { feature: 'Region_RWMA', value: patient.Region_RWMA, shap_value: patient.Region_RWMA > 0 ? +0.05 : -0.06, direction: patient.Region_RWMA > 0 ? 'increases_risk' : 'decreases_risk', rank: 8, explanation: `Regional wall motion abnormality score: ${patient.Region_RWMA}` }
        ],
        all_features: [],
        disclaimer: 'SHAP local attributions reflect machine learning feature impact on model output.'
      },
      lad: {
        target: 'lad',
        model_type: 'CatBoostClassifier (Calibrated)',
        explainer_type: 'TreeSHAP',
        probability: ladProb,
        threshold: ladThreshold,
        predicted_class: ladProb >= ladThreshold ? 1 : 0,
        shap_base_value: 0.42,
        shap_sum_contributions: parseFloat((ladProb - 0.42).toFixed(3)),
        top_features: [
          { feature: 'Typical_Chest_Pain', value: patient.Typical_Chest_Pain, shap_value: patient.Typical_Chest_Pain ? +0.22 : -0.14, direction: patient.Typical_Chest_Pain ? 'increases_risk' : 'decreases_risk', rank: 1, explanation: 'Classical exertional angina is highly correlated with LAD stenosis' },
          { feature: 'Tinversion', value: patient.Tinversion, shap_value: patient.Tinversion ? +0.14 : -0.05, direction: patient.Tinversion ? 'increases_risk' : 'decreases_risk', rank: 2, explanation: 'Anterior T-wave inversion (Wellens pattern risk)' },
          { feature: 'Age', value: patient.Age, shap_value: patient.Age > 55 ? +0.10 : -0.06, direction: patient.Age > 55 ? 'increases_risk' : 'decreases_risk', rank: 3, explanation: `Patient age: ${patient.Age} years` },
          { feature: 'Poor_R_Progression', value: patient.Poor_R_Progression, shap_value: patient.Poor_R_Progression ? +0.09 : -0.03, direction: patient.Poor_R_Progression ? 'increases_risk' : 'decreases_risk', rank: 4, explanation: 'Loss of anterior R-wave progression in precordial leads' },
          { feature: 'LDL', value: patient.LDL, shap_value: patient.LDL > 140 ? +0.08 : -0.04, direction: patient.LDL > 140 ? 'increases_risk' : 'decreases_risk', rank: 5, explanation: `Elevated atherogenic LDL: ${patient.LDL} mg/dL` }
        ],
        all_features: [],
        disclaimer: 'SHAP local attributions reflect machine learning feature impact on LAD model output.'
      },
      lcx: {
        target: 'lcx',
        model_type: 'RandomForestClassifier (Calibrated)',
        explainer_type: 'TreeSHAP',
        probability: lcxProb,
        threshold: lcxThreshold,
        predicted_class: lcxProb >= lcxThreshold ? 1 : 0,
        shap_base_value: 0.32,
        shap_sum_contributions: parseFloat((lcxProb - 0.32).toFixed(3)),
        top_features: [
          { feature: 'HTN', value: patient.HTN, shap_value: patient.HTN ? +0.12 : -0.06, direction: patient.HTN ? 'increases_risk' : 'decreases_risk', rank: 1, explanation: 'Hypertension elevates lateral wall shear stress' },
          { feature: 'Age', value: patient.Age, shap_value: patient.Age > 60 ? +0.09 : -0.05, direction: patient.Age > 60 ? 'increases_risk' : 'decreases_risk', rank: 2, explanation: `Patient age: ${patient.Age} years` },
          { feature: 'DLP', value: patient.DLP, shap_value: patient.DLP ? +0.08 : -0.04, direction: patient.DLP ? 'increases_risk' : 'decreases_risk', rank: 3, explanation: 'Dyslipidemia lipid accumulation in circumflex branch' },
          { feature: 'Dyspnea', value: patient.Dyspnea, shap_value: patient.Dyspnea ? +0.07 : -0.03, direction: patient.Dyspnea ? 'increases_risk' : 'decreases_risk', rank: 4, explanation: 'Exertional dyspnea presentation' }
        ],
        all_features: [],
        disclaimer: 'SHAP local attributions reflect machine learning feature impact on LCX model output.'
      },
      rca: {
        target: 'rca',
        model_type: 'ExtraTreesClassifier (Calibrated)',
        explainer_type: 'TreeSHAP',
        probability: rcaProb,
        threshold: rcaThreshold,
        predicted_class: rcaProb >= rcaThreshold ? 1 : 0,
        shap_base_value: 0.36,
        shap_sum_contributions: parseFloat((rcaProb - 0.36).toFixed(3)),
        top_features: [
          { feature: 'Q_Wave', value: patient.Q_Wave, shap_value: patient.Q_Wave ? +0.19 : -0.06, direction: patient.Q_Wave ? 'increases_risk' : 'decreases_risk', rank: 1, explanation: 'Inferior leads Q-wave pattern strongly associated with RCA territory' },
          { feature: 'Current_Smoker', value: patient.Current_Smoker, shap_value: patient.Current_Smoker ? +0.11 : -0.05, direction: patient.Current_Smoker ? 'increases_risk' : 'decreases_risk', rank: 2, explanation: 'Active smoking promotes endothelial dysfunction in RCA' },
          { feature: 'St_Depression', value: patient.St_Depression, shap_value: patient.St_Depression ? +0.10 : -0.04, direction: patient.St_Depression ? 'increases_risk' : 'decreases_risk', rank: 3, explanation: 'Reciprocal ST changes indicative of right coronary ischemia' },
          { feature: 'PR', value: patient.PR, shap_value: patient.PR < 65 ? +0.07 : -0.03, direction: patient.PR < 65 ? 'increases_risk' : 'decreases_risk', rank: 4, explanation: `Pulse rate (${patient.PR} bpm) sinus bradycardia node perfusion` }
        ],
        all_features: [],
        disclaimer: 'SHAP local attributions reflect machine learning feature impact on RCA model output.'
      }
    },
    disclaimer: 'CardioVision 3D outputs model-estimated probabilities for research/decision-support only. Not a medical diagnosis.'
  };
}
