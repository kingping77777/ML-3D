import { PatientInput, AnalyzeResponse } from '../../types/predictions';

export interface SymptomMedicinePair {
  id: string;
  symptomName: string;
  symptomValue: string;
  severity: 'high' | 'moderate' | 'normal';
  icon: string;
  affectedPartId: string;
  affectedPartName: string;
  prescribedMedicine: string;
  medicineCategory: string;
  dosage: string;
  clinicalMechanism: string;
}

export interface DynamicPartStatus {
  riskText: string;
  color: string;
  badge: string;
  isHighRisk: boolean;
  activeSymptoms: string[];
}

/**
 * Returns dynamic risk status & color for any of the 10 anatomical heart parts
 * based on live patient input and ML predictions.
 */
export function getDynamicPartStatus(
  partId: string,
  patient?: PatientInput,
  analysis?: AnalyzeResponse
): DynamicPartStatus {
  if (!patient && !analysis) {
    return {
      riskText: 'Normal Baseline',
      color: '#34d399',
      badge: 'Normal',
      isHighRisk: false,
      activeSymptoms: ['Baseline Perfusion']
    };
  }

  // 1. Coronary Arteries (LAD, LCX, RCA)
  if (partId === 'lad') {
    const pred = analysis?.predictions?.lad;
    const isStenosis = pred ? pred.predicted_class === 1 : (patient?.St_Depression === 1 || patient?.Typical_Chest_Pain === 1);
    const prob = pred ? (pred.probability * 100).toFixed(1) : (isStenosis ? '78.5' : '15.0');
    const symptoms: string[] = [];
    if (patient?.St_Depression) symptoms.push('ST Segment Shift');
    if (patient?.Typical_Chest_Pain) symptoms.push('Typical Angina');
    if (patient?.Current_Smoker) symptoms.push('Tobacco Endothelial Strain');
    if (symptoms.length === 0) symptoms.push('Normal Perfusion');

    return {
      riskText: `${prob}% Risk (${isStenosis ? 'Anterior Wall Ischemia' : 'Normal Flow'})`,
      color: isStenosis ? '#ef4444' : '#34d399',
      badge: isStenosis ? 'High Ischemia Risk' : 'Low Risk',
      isHighRisk: isStenosis,
      activeSymptoms: symptoms
    };
  }

  if (partId === 'lcx') {
    const pred = analysis?.predictions?.lcx;
    const isStenosis = pred ? pred.predicted_class === 1 : (patient?.Atypical === 1 || (patient?.LDL ?? 0) > 130);
    const prob = pred ? (pred.probability * 100).toFixed(1) : (isStenosis ? '68.0' : '12.0');
    const symptoms: string[] = [];
    if (patient?.Atypical) symptoms.push('Atypical Flank Pressure');
    if ((patient?.LDL ?? 0) > 130) symptoms.push(`Elevated LDL (${patient?.LDL} mg/dL)`);
    if (symptoms.length === 0) symptoms.push('Normal Perfusion');

    return {
      riskText: `${prob}% Risk (${isStenosis ? 'Posterolateral Stenosis' : 'Normal Flow'})`,
      color: isStenosis ? '#ef4444' : '#38bdf8',
      badge: isStenosis ? 'Elevated Risk' : 'Low Risk',
      isHighRisk: isStenosis,
      activeSymptoms: symptoms
    };
  }

  if (partId === 'rca') {
    const pred = analysis?.predictions?.rca;
    const isStenosis = pred ? pred.predicted_class === 1 : ((patient?.BP ?? 0) >= 140 || patient?.HTN === 1);
    const prob = pred ? (pred.probability * 100).toFixed(1) : (isStenosis ? '72.4' : '18.0');
    const symptoms: string[] = [];
    if ((patient?.BP ?? 0) >= 140) symptoms.push(`Hypertension (${patient?.BP} mmHg)`);
    if ((patient?.PR ?? 70) < 55) symptoms.push(`Sinus Bradycardia (${patient?.PR} bpm)`);
    if (symptoms.length === 0) symptoms.push('Normal Perfusion');

    return {
      riskText: `${prob}% Risk (${isStenosis ? 'Inferior Wall & Nodal Ischemia' : 'Normal Flow'})`,
      color: isStenosis ? '#f59e0b' : '#34d399',
      badge: isStenosis ? 'Inferior Risk' : 'Low Risk',
      isHighRisk: isStenosis,
      activeSymptoms: symptoms
    };
  }

  // 2. Great Vessels (Aorta, Pulmonary Trunk)
  if (partId === 'aorta') {
    const bp = patient?.BP ?? 120;
    const ldl = patient?.LDL ?? 100;
    const isSevere = bp >= 140 || ldl >= 160;
    const isMod = bp >= 130 || ldl >= 130;

    const symptoms: string[] = [];
    if (bp >= 130) symptoms.push(`Elevated BP (${bp} mmHg)`);
    if (ldl >= 130) symptoms.push(`High LDL (${ldl} mg/dL)`);
    if (symptoms.length === 0) symptoms.push('Normal Aortic Pressure');

    return {
      riskText: isSevere ? `BP: ${bp} mmHg (Hypertensive Load)` : isMod ? `BP: ${bp} mmHg (Stage 1 HTN)` : `BP: ${bp} mmHg (Normal Wall Stress)`,
      color: isSevere ? '#ef4444' : isMod ? '#f59e0b' : '#34d399',
      badge: isSevere ? 'Hypertensive Load' : isMod ? 'Borderline' : 'Normal',
      isHighRisk: isSevere,
      activeSymptoms: symptoms
    };
  }

  if (partId === 'pulmonary_trunk') {
    const dyspnea = patient?.Dyspnea === 1;
    const airway = patient?.Airway_disease === 1;

    const symptoms: string[] = [];
    if (dyspnea) symptoms.push('Exertional Dyspnea');
    if (airway) symptoms.push('Airway Resistance / COPD');
    if (symptoms.length === 0) symptoms.push('Normal Pulmonary Vascular Bed');

    return {
      riskText: (dyspnea || airway) ? 'Elevated Pulmonary Vascular Strain' : 'Normal Pulmonary Resistance',
      color: (dyspnea || airway) ? '#ef4444' : '#38bdf8',
      badge: (dyspnea || airway) ? 'High Resistance' : 'Normal',
      isHighRisk: dyspnea || airway,
      activeSymptoms: symptoms
    };
  }

  // 3. Chambers & Apex
  if (partId === 'left_ventricle') {
    const ef = patient?.EF_TTE ?? 55;
    const lvh = patient?.LVH === 1;
    const chf = patient?.CHF === 1;
    const isImpaired = ef < 50 || lvh || chf;

    const symptoms: string[] = [];
    if (ef < 50) symptoms.push(`Reduced EF (${ef}%)`);
    if (lvh) symptoms.push('Concentric LV Hypertrophy');
    if (chf) symptoms.push('Congestive Heart Failure');
    if (symptoms.length === 0) symptoms.push(`Preserved EF (${ef}%)`);

    return {
      riskText: isImpaired ? `EF: ${ef}% (${ef < 40 ? 'HFrEF Systolic Failure' : 'Mildly Reduced EF'})` : `EF: ${ef}% (Preserved Systolic Pump)`,
      color: isImpaired ? '#ef4444' : '#ec4899',
      badge: isImpaired ? 'Systolic Strain' : 'Preserved Pump',
      isHighRisk: isImpaired,
      activeSymptoms: symptoms
    };
  }

  if (partId === 'right_ventricle') {
    const edema = patient?.Edema === 1;
    const rales = patient?.Lung_rales === 1;

    const symptoms: string[] = [];
    if (edema) symptoms.push('Peripheral Pedal Edema');
    if (rales) symptoms.push('Pulmonary Venous Congestion');
    if (symptoms.length === 0) symptoms.push('Normal RV Filling');

    return {
      riskText: (edema || rales) ? 'Right Ventricular Preload Overload' : 'Normal Right Ventricular Pressure',
      color: (edema || rales) ? '#f59e0b' : '#06b6d4',
      badge: (edema || rales) ? 'Preload Strain' : 'Normal',
      isHighRisk: edema || rales,
      activeSymptoms: symptoms
    };
  }

  if (partId === 'left_atrium') {
    const pr = patient?.PR ?? 75;
    const isArrhythmia = pr > 100 || pr < 50;

    const symptoms: string[] = [];
    if (pr > 100) symptoms.push(`Sinus Tachycardia / Palpitations (${pr} bpm)`);
    if (pr < 50) symptoms.push(`Sinus Bradycardia (${pr} bpm)`);
    if (symptoms.length === 0) symptoms.push(`Normal Rhythm (${pr} bpm)`);

    return {
      riskText: isArrhythmia ? `Rhythm Strain (${pr} bpm)` : `Normal Sinus filling (${pr} bpm)`,
      color: isArrhythmia ? '#a855f7' : '#34d399',
      badge: isArrhythmia ? 'Atrial Stagnation' : 'Normal',
      isHighRisk: isArrhythmia,
      activeSymptoms: symptoms
    };
  }

  if (partId === 'right_atrium') {
    const pulse = patient?.Weak_Peripheral_Pulse === 1;
    return {
      riskText: pulse ? 'Reduced Venous Inflow / Low Pulse' : 'Normal Right Atrial SA Pacemaker Node',
      color: pulse ? '#f59e0b' : '#eab308',
      badge: pulse ? 'Weak Pulse' : 'Normal',
      isHighRisk: pulse,
      activeSymptoms: pulse ? ['Weak Peripheral Pulse'] : ['Normal SA Node']
    };
  }

  if (partId === 'cardiac_apex') {
    const poorR = patient?.Poor_R_Progression === 1;
    const ef = patient?.EF_TTE ?? 55;
    const isApicalStrain = poorR || ef < 45;

    return {
      riskText: isApicalStrain ? 'Apical Hypokinesis / Wall Motion Deficit' : 'Normal Apical Torsional Wringing',
      color: isApicalStrain ? '#ef4444' : '#10b981',
      badge: isApicalStrain ? 'Apical Deficit' : 'Normal',
      isHighRisk: isApicalStrain,
      activeSymptoms: isApicalStrain ? ['Poor R-Wave Progression', `Low EF (${ef}%)`] : ['Normal Apical Impulse']
    };
  }

  return {
    riskText: 'Normal Perfusion',
    color: '#34d399',
    badge: 'Normal',
    isHighRisk: false,
    activeSymptoms: ['Normal']
  };
}

/**
 * Returns explicit Symptom ➔ Medicine pairs connected to patient inputs
 */
export function getPatientSymptomMedicineConnections(patient: PatientInput): SymptomMedicinePair[] {
  const pairs: SymptomMedicinePair[] = [];

  // 1. ST Segment Shift / Elevation / Depression -> LAD/LCX/RCA Antiplatelet & Nitrates
  if (patient.St_Depression === 1 || patient.St_Elevation === 1 || patient.Typical_Chest_Pain === 1) {
    pairs.push({
      id: 'ischemia_angina',
      symptomName: patient.St_Depression === 1 ? 'ST-Segment Depression (Myocardial Ischemia)' : 'Typical Rest/Exertional Angina',
      symptomValue: patient.St_Depression === 1 ? 'Positive ST-Shift' : 'Crushing Retrosternal Pressure',
      severity: 'high',
      icon: '⚡',
      affectedPartId: 'lad',
      affectedPartName: 'Left Anterior Descending & Coronary Tree',
      prescribedMedicine: 'Aspirin 81mg + Ticagrelor 90mg (DAPT) & Sublingual Nitroglycerin 0.4mg',
      medicineCategory: 'Dual Antiplatelet & Antianginal Coronary Vasodilator',
      dosage: 'Aspirin 81mg daily + Ticagrelor 90mg BID + Nitroglycerin SL PRN',
      clinicalMechanism: 'Inhibits thromboxane A2 & P2Y12 platelet activation over ruptured atheroma cap while dilating epicardial coronary arteries.'
    });
  }

  // 2. High Blood Pressure -> Aorta & RCA Antihypertensives
  if (patient.BP >= 130 || patient.HTN === 1) {
    const isStage2 = patient.BP >= 140;
    pairs.push({
      id: 'hypertension',
      symptomName: `Systolic Hypertension (BP: ${patient.BP} mmHg)`,
      symptomValue: `${patient.BP} mmHg`,
      severity: isStage2 ? 'high' : 'moderate',
      icon: '🩸',
      affectedPartId: 'aorta',
      affectedPartName: 'Ascending Aorta & Left Ventricular Wall',
      prescribedMedicine: 'Ramipril 5mg (ACEi) / Losartan 50mg (ARB) + Metoprolol Succinate 50mg',
      medicineCategory: 'RAAS Antagonist & Cardioselective Beta-Blocker',
      dosage: 'Ramipril 5mg daily + Metoprolol 50mg daily',
      clinicalMechanism: 'Suppresses Angiotensin-II vasoconstriction, decreases cardiac dP/dt shear stress on aortic root, and prevents concentric LV hypertrophy.'
    });
  }

  // 3. High Fasting Blood Sugar / Diabetes -> Microvascular SGLT2i
  if (patient.FBS >= 100 || patient.DM === 1) {
    const isDiabetic = patient.FBS >= 126 || patient.DM === 1;
    pairs.push({
      id: 'diabetes_fbs',
      symptomName: isDiabetic ? `Diabetic Hyperglycemia (FBS: ${patient.FBS} mg/dL)` : `Impaired Fasting Glucose (FBS: ${patient.FBS} mg/dL)`,
      symptomValue: `${patient.FBS} mg/dL`,
      severity: isDiabetic ? 'high' : 'moderate',
      icon: '🩺',
      affectedPartId: 'lcx',
      affectedPartName: 'Coronary Microvascular Bed & Endothelium',
      prescribedMedicine: 'Empagliflozin 10mg (SGLT2 Inhibitor) + Metformin 500mg',
      medicineCategory: 'Cardioprotective Antidiabetic & SGLT2i',
      dosage: 'Empagliflozin 10mg once daily',
      clinicalMechanism: 'Promotes urinary glucose excretion, improves myocardial energetics, reduces cardiovascular mortality by 38%, and halts coronary microvascular disease.'
    });
  }

  // 4. Reduced Ejection Fraction / CHF -> LV GDMT Quadruple Regimen
  if (patient.EF_TTE < 50 || patient.CHF === 1) {
    const isSevere = patient.EF_TTE < 40;
    pairs.push({
      id: 'reduced_ef',
      symptomName: `Impaired Systolic Pump (EF: ${patient.EF_TTE}%)`,
      symptomValue: `${patient.EF_TTE}% Ejection Fraction`,
      severity: isSevere ? 'high' : 'moderate',
      icon: '🫀',
      affectedPartId: 'left_ventricle',
      affectedPartName: 'Left Ventricle Myocardium',
      prescribedMedicine: 'Sacubitril/Valsartan 49/51mg (ARNI) + Carvedilol 12.5mg + Spironolactone 25mg',
      medicineCategory: 'Guideline-Directed Medical Therapy (GDMT) Quadruple Regimen',
      dosage: 'Sacubitril/Valsartan 49/51mg BID + Carvedilol 12.5mg BID',
      clinicalMechanism: 'Inhibits neprilysin and blocks AT1 receptors, stopping post-infarction ventricular dilation and lowering 30-day heart failure hospitalization by 20%.'
    });
  }

  // 5. High Cholesterol / Dyslipidemia -> Statins & Ezetimibe
  if (patient.LDL >= 130 || patient.DLP === 1) {
    const isHigh = patient.LDL >= 160;
    pairs.push({
      id: 'high_ldl',
      symptomName: `Elevated Atherogenic Lipids (LDL: ${patient.LDL} mg/dL)`,
      symptomValue: `${patient.LDL} mg/dL`,
      severity: isHigh ? 'high' : 'moderate',
      icon: '🧪',
      affectedPartId: 'lad',
      affectedPartName: 'LAD, LCX & RCA Vessel Lumens',
      prescribedMedicine: 'Atorvastatin 80mg (High-Intensity Statin) + Ezetimibe 10mg',
      medicineCategory: 'HMG-CoA Reductase Inhibitor & Cholesterol Absorption Blocker',
      dosage: 'Atorvastatin 80mg nightly at bedtime',
      clinicalMechanism: 'Reduces hepatic cholesterol synthesis, upregulates LDL receptors, stabilizes fibrous caps over lipid cores, and halts atheroma growth.'
    });
  }

  // 6. Dyspnea / Pulmonary Congestion -> Loop Diuretics
  if (patient.Dyspnea === 1 || patient.Lung_rales === 1 || patient.Edema === 1) {
    pairs.push({
      id: 'dyspnea_congestion',
      symptomName: 'Exertional Shortness of Breath & Fluid Retention',
      symptomValue: 'Dyspnea Grade II-III',
      severity: 'high',
      icon: '🫁',
      affectedPartId: 'pulmonary_trunk',
      affectedPartName: 'Pulmonary Trunk & Right Ventricle',
      prescribedMedicine: 'Furosemide 40mg (Loop Diuretic)',
      medicineCategory: 'Loop Diuretic',
      dosage: 'Furosemide 40mg PO every morning',
      clinicalMechanism: 'Inhibits Na+/K+/2Cl- cotransporter in the thick ascending limb of Henle, reducing pulmonary arterial wedge pressure and peripheral edema.'
    });
  }

  // 7. Active Smoking -> Endothelial Protection & Cessation
  if (patient.Current_Smoker === 1) {
    pairs.push({
      id: 'smoking_vascular',
      symptomName: 'Active Tobacco Smoking (Endothelial Nitric Oxide Depletion)',
      symptomValue: 'Active Smoker',
      severity: 'high',
      icon: '🚬',
      affectedPartId: 'aorta',
      affectedPartName: 'Systemic Endothelium & Coronary Arteries',
      prescribedMedicine: 'Varenicline 1mg (Chantix) + Nicotine Replacement & Endothelial Antioxidation',
      medicineCategory: 'Nicotine Receptor Partial Agonist & Vascular Protection',
      dosage: 'Varenicline 1mg BID for 12 weeks',
      clinicalMechanism: 'Binds alpha4beta2 nicotinic acetylcholine receptors to eliminate tobacco cravings and restore endothelial nitric oxide-mediated vasodilation.'
    });
  }

  // Fallback if low risk / baseline
  if (pairs.length === 0) {
    pairs.push({
      id: 'baseline_health',
      symptomName: 'Preserved Cardioprotective Baseline',
      symptomValue: 'Normal Biomarkers',
      severity: 'normal',
      icon: '💚',
      affectedPartId: 'lad',
      affectedPartName: 'Coronary Tree',
      prescribedMedicine: 'Cardioprotective Primary Prevention: Omega-3 Fatty Acids 1,000mg + Daily Multivitamin',
      medicineCategory: 'Primary Preventive Cardioprotection',
      dosage: '1,000mg Daily',
      clinicalMechanism: 'Maintains physiological vascular elasticity and low baseline inflammatory cytokine levels.'
    });
  }

  return pairs;
}
