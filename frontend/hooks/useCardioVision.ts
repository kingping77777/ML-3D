'use client';

import { useState, useEffect, useCallback } from 'react';
import { PatientInput, TargetName, AnalyzeResponse } from '../types/predictions';
import { CLINICAL_PRESETS, getMockAnalysisForPatient } from '../utils/casePresets';

export function useCardioVision(apiUrl = 'http://localhost:8000/api/v1/analyze') {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('case_multivessel');
  const [patient, setPatient] = useState<PatientInput>(CLINICAL_PRESETS[0].data);
  const [selectedTarget, setSelectedTarget] = useState<TargetName>('cad');
  
  const [analysis, setAnalysis] = useState<AnalyzeResponse>(() => getMockAnalysisForPatient(CLINICAL_PRESETS[0].data));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState<boolean>(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // Update a single patient field
  const updatePatientField = useCallback((field: keyof PatientInput, value: any) => {
    setSelectedPresetId('custom');
    setPatient((prev) => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Select a preset case
  const selectPreset = useCallback((presetId: string) => {
    const found = CLINICAL_PRESETS.find((p) => p.id === presetId);
    if (found) {
      setSelectedPresetId(presetId);
      setPatient(found.data);
    }
  }, []);

  // Randomize clinical patient case
  const randomizePatient = useCallback(() => {
    setSelectedPresetId('custom');
    const randomAge = Math.floor(40 + Math.random() * 38);
    const randomBP = Math.floor(105 + Math.random() * 65);
    const randomEF = Math.floor(30 + Math.random() * 40);
    const randomPain = Math.random() > 0.5 ? 1 : 0;
    const randomDM = Math.random() > 0.6 ? 1 : 0;
    const randomHTN = Math.random() > 0.4 ? 1 : 0;
    const randomSmoker = Math.random() > 0.6 ? 1 : 0;
    const randomStDep = Math.random() > 0.7 ? 1 : 0;
    const randomTinversion = Math.random() > 0.7 ? 1 : 0;

    const newPatient: PatientInput = {
      ...patient,
      Age: randomAge,
      BP: randomBP,
      EF_TTE: randomEF,
      Typical_Chest_Pain: randomPain,
      DM: randomDM,
      HTN: randomHTN,
      Current_Smoker: randomSmoker,
      St_Depression: randomStDep,
      Tinversion: randomTinversion,
      FBS: Math.floor(80 + Math.random() * 120),
      LDL: Math.floor(70 + Math.random() * 110),
      HDL: Math.floor(30 + Math.random() * 35),
      TG: Math.floor(90 + Math.random() * 180)
    };
    setPatient(newPatient);
  }, [patient]);

  // Execute full patient analysis (FastAPI -> CAD/LAD/LCX/RCA -> SHAP)
  const runAnalysis = useCallback(async (currentPatient: PatientInput = patient) => {
    setLoading(true);
    setError(null);

    if (isMock) {
      // Offline/Mock simulation
      setTimeout(() => {
        const mockResult = getMockAnalysisForPatient(currentPatient);
        setAnalysis(mockResult);
        setLoading(false);
      }, 350);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentPatient),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errPayload = await response.json().catch(() => null);
        throw new Error(errPayload?.detail || `API returned status HTTP ${response.status}`);
      }

      const data: AnalyzeResponse = await response.json();
      setAnalysis(data);
      setBackendOnline(true);
    } catch (err: any) {
      console.warn('FastAPI backend unavailable, falling back to client-side ML engine:', err.message);
      setBackendOnline(false);
      setError(`Backend offline (${err.message}). Showing high-fidelity client simulation.`);
      // Automatic fallback
      const mockResult = getMockAnalysisForPatient(currentPatient);
      setAnalysis(mockResult);
    } finally {
      setLoading(false);
    }
  }, [apiUrl, isMock, patient]);

  // Run initial analysis when preset changes
  useEffect(() => {
    runAnalysis(patient);
  }, [patient]);

  return {
    patient,
    selectedPresetId,
    selectedTarget,
    setSelectedTarget,
    analysis,
    loading,
    error,
    isMock,
    setIsMock,
    backendOnline,
    updatePatientField,
    selectPreset,
    randomizePatient,
    runAnalysis
  };
}
