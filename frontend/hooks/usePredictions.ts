import { useState, useEffect, useCallback } from 'react';
import { PatientInput, PredictionResponse } from '../types/predictions';

const MOCK_PREDICTION_DATA: PredictionResponse = {
  predictions: {
    cad: { probability: 0.78, predicted_class: 1, threshold: 0.45 },
    lad: { probability: 0.82, predicted_class: 1, threshold: 0.40 },
    lcx: { probability: 0.31, predicted_class: 0, threshold: 0.35 },
    rca: { probability: 0.64, predicted_class: 1, threshold: 0.38 }
  },
  visualization: {
    lad: { probability: 0.82, status: 'elevated_risk' },
    lcx: { probability: 0.31, status: 'normal_risk' },
    rca: { probability: 0.64, status: 'elevated_risk' }
  },
  disclaimer: 'Mock Mode Active: CardioVision 3D outputs model-estimated probabilities for decision-support only.'
};

const DEFAULT_PATIENT_PAYLOAD: PatientInput = {
  Age: 62, Weight: 75, Length: 172, BMI: 25.35, BP: 135, PR: 78,
  FBS: 110, CR: 0.9, TG: 180, LDL: 130, HDL: 42, BUN: 18, ESR: 15,
  HB: 14.2, K: 4.2, Na: 140, WBC: 7500, Lymph: 30, Neut: 62, PLT: 240000,
  EF_TTE: 55, Sex: 'Male', Function_Class: 1, BBB: 'N', VHD: 'N',
  Obesity: 0, CRF: 0, CVA: 0, Airway_disease: 0, Thyroid_Disease: 0,
  CHF: 0, DLP: 1, Weak_Peripheral_Pulse: 0, Lung_rales: 0,
  Systolic_Murmur: 0, Diastolic_Murmur: 0, Dyspnea: 1, Atypical: 0,
  Nonanginal: 0, LowTH_Ang: 0, LVH: 0, Poor_R_Progression: 0,
  DM: 1, HTN: 1, Current_Smoker: 1, EX_Smoker: 0, FH: 1, Edema: 0,
  Typical_Chest_Pain: 1, Q_Wave: 0, St_Elevation: 0, St_Depression: 1,
  Tinversion: 0, Region_RWMA: 0
};

export function usePredictions(apiUrl = 'http://localhost:8000/api/v1/predict') {
  const [data, setData] = useState<PredictionResponse | null>(MOCK_PREDICTION_DATA);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState<boolean>(true);

  const validateProbabilities = (res: PredictionResponse): boolean => {
    for (const [key, pred] of Object.entries(res.predictions)) {
      if (typeof pred.probability !== 'number' || pred.probability < 0 || pred.probability > 1) {
        throw new Error(`Invalid model probability for target '${key}': ${pred.probability}. Must be 0.0 <= p <= 1.0.`);
      }
    }
    return true;
  };

  const fetchPredictions = useCallback(async (patientPayload: PatientInput = DEFAULT_PATIENT_PAYLOAD) => {
    if (isMock) {
      setData(MOCK_PREDICTION_DATA);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientPayload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `API Request failed with status HTTP ${response.status}`);
      }

      const json: PredictionResponse = await response.json();
      validateProbabilities(json);
      setData(json);
    } catch (err: any) {
      console.error('FastAPI Prediction Error:', err);
      setError(err.message || 'Failed to connect to CardioVision 3D FastAPI backend.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, isMock]);

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  return {
    data,
    loading,
    error,
    isMock,
    setIsMock,
    refetch: fetchPredictions
  };
}
