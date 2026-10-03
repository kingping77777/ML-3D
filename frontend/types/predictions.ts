export type VesselName = 'lad' | 'lcx' | 'rca';
export type TargetName = 'cad' | 'lad' | 'lcx' | 'rca';

export interface PatientInput {
  // Numerical features (21)
  Age: number;
  Weight: number;
  Length: number;
  BMI: number;
  BP: number;
  PR: number;
  FBS: number;
  CR: number;
  TG: number;
  LDL: number;
  HDL: number;
  BUN: number;
  ESR: number;
  HB: number;
  K: number;
  Na: number;
  WBC: number;
  Lymph: number;
  Neut: number;
  PLT: number;
  EF_TTE: number;

  // Categorical features (3)
  Sex: 'Male' | 'Fmale' | 'Female';
  Function_Class: 0 | 1 | 2 | 3;
  BBB: 'N' | 'LBBB' | 'RBBB';

  // Binary features (30)
  VHD: 'N' | 'mild' | 'Moderate' | 'Severe' | number;
  Obesity: 0 | 1;
  CRF: 0 | 1;
  CVA: 0 | 1;
  Airway_disease: 0 | 1;
  Thyroid_Disease: 0 | 1;
  CHF: 0 | 1;
  DLP: 0 | 1;
  Weak_Peripheral_Pulse: 0 | 1;
  Lung_rales: 0 | 1;
  Systolic_Murmur: 0 | 1;
  Diastolic_Murmur: 0 | 1;
  Dyspnea: 0 | 1;
  Atypical: 0 | 1;
  Nonanginal: 0 | 1;
  LowTH_Ang: 0 | 1;
  LVH: 0 | 1;
  Poor_R_Progression: 0 | 1;
  DM: 0 | 1;
  HTN: 0 | 1;
  Current_Smoker: 0 | 1;
  EX_Smoker: 0 | 1;
  FH: 0 | 1;
  Edema: 0 | 1;
  Typical_Chest_Pain: 0 | 1;
  Q_Wave: 0 | 1;
  St_Elevation: 0 | 1;
  St_Depression: 0 | 1;
  Tinversion: 0 | 1;
  Region_RWMA: number;
}

export interface TargetPrediction {
  probability: number;
  predicted_class: number;
  threshold: number;
}

export interface VesselVisualization {
  probability: number;
  status: 'elevated_risk' | 'normal_risk' | string;
}

export interface FeatureContribution {
  feature: string;
  value: any;
  shap_value: number;
  direction: 'increases_risk' | 'decreases_risk' | 'neutral' | string;
  rank: number;
  explanation: string;
}

export interface ExplanationResponse {
  target: TargetName;
  model_type: string;
  explainer_type: string;
  probability: number;
  threshold: number;
  predicted_class: number;
  shap_base_value: number;
  shap_sum_contributions: number;
  top_features: FeatureContribution[];
  all_features: FeatureContribution[];
  disclaimer: string;
}

export interface PredictionResponse {
  predictions: Record<TargetName, TargetPrediction>;
  visualization: Record<VesselName, VesselVisualization>;
  disclaimer: string;
}

export interface AnalyzeResponse {
  predictions: Record<TargetName, TargetPrediction>;
  visualization: Record<VesselName, VesselVisualization>;
  explanations: Record<TargetName, ExplanationResponse>;
  disclaimer: string;
}

export interface CasePreset {
  id: string;
  title: string;
  subtitle: string;
  category: 'High Risk' | 'Moderate Risk' | 'Low Risk' | 'Isolated Stenosis';
  description: string;
  data: PatientInput;
}
