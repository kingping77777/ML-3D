import { PatientInput } from '../types/predictions';

export interface ValidationError {
  field: keyof PatientInput;
  message: string;
  allowedRange: string;
}

export const CLINICAL_BOUNDS: Record<string, { min: number; max: number; label: string; unit: string }> = {
  Age: { min: 1, max: 120, label: 'Age', unit: 'years' },
  BP: { min: 50, max: 300, label: 'Systolic Blood Pressure', unit: 'mmHg' },
  PR: { min: 30, max: 250, label: 'Pulse Rate', unit: 'bpm' },
  FBS: { min: 30, max: 1000, label: 'Fasting Blood Sugar', unit: 'mg/dL' },
  LDL: { min: 10, max: 800, label: 'LDL Cholesterol', unit: 'mg/dL' },
  HDL: { min: 5, max: 250, label: 'HDL Cholesterol', unit: 'mg/dL' },
  TG: { min: 10, max: 3000, label: 'Triglycerides', unit: 'mg/dL' },
  EF_TTE: { min: 10, max: 90, label: 'Ejection Fraction', unit: '%' },
  Weight: { min: 10, max: 350, label: 'Weight', unit: 'kg' },
  Length: { min: 50, max: 250, label: 'Height/Length', unit: 'cm' },
  BMI: { min: 10, max: 90, label: 'BMI', unit: 'kg/m²' },
  CR: { min: 0.1, max: 25, label: 'Serum Creatinine', unit: 'mg/dL' },
  HB: { min: 2, max: 25, label: 'Hemoglobin', unit: 'g/dL' },
  K: { min: 1, max: 10, label: 'Potassium (K)', unit: 'mEq/L' },
  Na: { min: 90, max: 180, label: 'Sodium (Na)', unit: 'mEq/L' },
  WBC: { min: 500, max: 100000, label: 'White Blood Cell Count', unit: '/µL' },
  PLT: { min: 10000, max: 2000000, label: 'Platelet Count', unit: '/µL' }
};

export function validatePatientClinicalInputs(patient: PatientInput): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const [field, bound] of Object.entries(CLINICAL_BOUNDS)) {
    const val = Number((patient as any)[field]);
    if (isNaN(val) || val < bound.min || val > bound.max) {
      errors.push({
        field: field as keyof PatientInput,
        message: `This cannot be possible! ${bound.label} (${val}) is out of realistic human clinical bounds.`,
        allowedRange: `${bound.min} to ${bound.max} ${bound.unit}`
      });
    }
  }

  return errors;
}
