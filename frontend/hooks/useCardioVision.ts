'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { PatientInput, TargetName, AnalyzeResponse } from '../types/predictions';
import { CLINICAL_PRESETS, getMockAnalysisForPatient } from '../utils/casePresets';

function sanitizePatientInput(p: PatientInput): PatientInput {
  const clamp = (val: any, min: number, max: number, defaultVal: number) => {
    const num = Number(val);
    if (isNaN(num)) return defaultVal;
    return Math.max(min, Math.min(max, num));
  };

  const sanitizeBinary = (val: any, defaultVal: number = 0): number => {
    if (typeof val === 'string') {
      const v = val.trim().toUpperCase();
      if (['Y', 'YES', '1', 'TRUE'].includes(v)) return 1;
      if (['N', 'NO', '0', 'FALSE'].includes(v)) return 0;
    }
    if (typeof val === 'boolean') return val ? 1 : 0;
    if (typeof val === 'number') return val === 1 ? 1 : 0;
    return defaultVal;
  };

  const sanitizeSex = (val: any): string => {
    if (typeof val === 'string') {
      const v = val.trim().toLowerCase();
      if (v === 'female' || v === 'f') return 'Female';
      if (v === 'male' || v === 'm') return 'Male';
    }
    return 'Male';
  };

  const sanitizeBbb = (val: any): string => {
    if (typeof val === 'string') {
      const v = val.trim().toUpperCase();
      if (['LBBB', 'RBBB'].includes(v)) return v;
    }
    return 'N';
  };

  const sanitizeVhd = (val: any): string => {
    if (typeof val === 'string') {
      const v = val.trim().toLowerCase();
      if (v === 'mild') return 'mild';
      if (v === 'moderate') return 'Moderate';
      if (v === 'severe') return 'Severe';
    }
    return 'N';
  };

  return {
    ...p,
    Sex: sanitizeSex(p.Sex),
    Age: clamp(p.Age, 1, 120, 60),
    Weight: clamp(p.Weight, 20, 250, 75),
    Length: clamp(p.Length, 50, 250, 170),
    BMI: clamp(p.BMI, 10, 60, 26),
    BP: clamp(p.BP, 50, 250, 130),
    PR: clamp(p.PR, 30, 200, 75),
    FBS: clamp(p.FBS, 40, 600, 110),
    CR: clamp(p.CR, 0.1, 15.0, 1.0),
    TG: clamp(p.TG, 20, 1500, 150),
    LDL: clamp(p.LDL, 10, 600, 115),
    HDL: clamp(p.HDL, 5, 200, 42),
    BUN: clamp(p.BUN, 1, 150, 18),
    ESR: clamp(p.ESR, 1, 150, 15),
    HB: clamp(p.HB, 3.0, 25.0, 14.0),
    K: clamp(p.K, 1.0, 10.0, 4.3),
    Na: clamp(p.Na, 100, 170, 140),
    WBC: clamp(p.WBC, 1000, 50000, 7200),
    Lymph: clamp(p.Lymph, 1, 99, 32),
    Neut: clamp(p.Neut, 1, 99, 60),
    PLT: clamp(p.PLT, 10, 1000000, 240000),
    EF_TTE: clamp(p.EF_TTE, 5, 90, 55),
    BBB: sanitizeBbb(p.BBB),
    VHD: sanitizeVhd(p.VHD),
    DM: sanitizeBinary(p.DM),
    HTN: sanitizeBinary(p.HTN),
    Current_Smoker: sanitizeBinary(p.Current_Smoker),
    Typical_Chest_Pain: sanitizeBinary(p.Typical_Chest_Pain),
    Atypical: sanitizeBinary(p.Atypical),
    Nonanginal: sanitizeBinary(p.Nonanginal),
    Exertional_CP: sanitizeBinary(p.Exertional_CP),
    LowTH_Ang: sanitizeBinary(p.LowTH_Ang),
    Q_Wave: sanitizeBinary(p.Q_Wave),
    St_Elevation: sanitizeBinary(p.St_Elevation),
    St_Depression: sanitizeBinary(p.St_Depression),
    Tinversion: sanitizeBinary(p.Tinversion),
    LVH: sanitizeBinary(p.LVH),
    Poor_R_Progression: sanitizeBinary(p.Poor_R_Progression)
  };
}

export function useCardioVision(apiUrl = 'http://127.0.0.1:8000/api/v1/analyze') {
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

  const activeControllerRef = useRef<AbortController | null>(null);

  // Execute patient inference
  const runAnalysis = useCallback(async (currentPatient: PatientInput = patient) => {
    setLoading(true);
    setError(null);

    if (isMock) {
      setTimeout(() => {
        const mockResult = getMockAnalysisForPatient(currentPatient);
        setAnalysis(mockResult);
        setLoading(false);
      }, 250);
      return;
    }

    if (activeControllerRef.current) {
      activeControllerRef.current.abort('New analysis initiated');
    }

    const controller = new AbortController();
    activeControllerRef.current = controller;
    const timeoutId = setTimeout(() => {
      try {
        controller.abort('Analysis request timed out');
      } catch {}
    }, 30000);

    try {
      const sanitizedPatient = sanitizePatientInput(currentPatient);
      let targetUrl = apiUrl;
      let response: Response;

      try {
        response = await fetch(targetUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sanitizedPatient),
          signal: controller.signal
        });
      } catch (firstErr: any) {
        if (firstErr?.name === 'AbortError' || firstErr?.message?.toLowerCase().includes('abort')) {
          return;
        }

        // Fallback to localhost if 127.0.0.1 fails or vice-versa
        const altUrl = targetUrl.includes('127.0.0.1')
          ? targetUrl.replace('127.0.0.1', 'localhost')
          : targetUrl.replace('localhost', '127.0.0.1');

        response = await fetch(altUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sanitizedPatient),
          signal: controller.signal
        });
      }

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errPayload = await response.json().catch(() => null);
        const detailStr = typeof errPayload?.detail === 'string'
          ? errPayload.detail
          : (errPayload?.detail ? JSON.stringify(errPayload.detail) : `HTTP ${response.status}`);
        throw new Error(detailStr);
      }

      const data: AnalyzeResponse = await response.json();
      setAnalysis(data);
      setBackendOnline(true);
      setError(null);
    } catch (err: any) {
      if (err?.name === 'AbortError' || err?.message?.toLowerCase().includes('abort')) {
        return;
      }

      const mockResult = getMockAnalysisForPatient(currentPatient);
      setAnalysis(mockResult);
      setBackendOnline(false);
      
      if (err?.message && !err.message.includes('Failed to fetch')) {
        setError(err.message);
      } else {
        setError(null);
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  }, [apiUrl, isMock, patient]);

  // Initial health check
  useEffect(() => {
    let cancelled = false;
    async function init() {
      const healthUrl = apiUrl.replace(/\/analyze$/, '/health');
      try {
        const res = await fetch(healthUrl);
        if (!cancelled && res.ok) {
          setBackendOnline(true);
        }
      } catch {
        if (!cancelled) setBackendOnline(false);
      }
      if (!cancelled) {
        runAnalysis(patient);
      }
    }
    init();
    return () => {
      cancelled = true;
      if (activeControllerRef.current) {
        try {
          activeControllerRef.current.abort('Component unmounted');
        } catch {}
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    runAnalysis(patient);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
