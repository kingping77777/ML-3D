'use client';

import React, { useState } from 'react';
import { useCardioVision } from '../hooks/useCardioVision';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { PatientInputForm } from '../components/dashboard/PatientInputForm';
import { VesselRiskCards } from '../components/dashboard/VesselRiskCards';
import { ShapAttributionView } from '../components/dashboard/ShapAttributionView';
import { ClinicalSummaryModal } from '../components/dashboard/ClinicalSummaryModal';
import { HeartViewer } from '../components/heart/HeartViewer';
import { VesselName, TargetName, PredictionResponse } from '../types/predictions';

export default function Step7DashboardPage() {
  const {
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
  } = useCardioVision();

  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Map selected target ('cad', 'lad', 'lcx', 'rca') to vessel name for 3D viewer
  const active3DVessel: VesselName | null =
    selectedTarget === 'cad' ? null : (selectedTarget as VesselName);

  const handleSelect3DVessel = (vessel: VesselName | null) => {
    if (vessel) {
      setSelectedTarget(vessel as TargetName);
    } else {
      setSelectedTarget('cad');
    }
  };

  // Convert AnalyzeResponse to PredictionResponse format required by 3D heart
  const heartPredictionData: PredictionResponse = {
    predictions: analysis.predictions,
    visualization: analysis.visualization,
    disclaimer: analysis.disclaimer
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: '#090d16',
      backgroundImage: 'radial-gradient(ellipse at 50% 0%, #1e293b 0%, #090d16 75%)',
      padding: '24px 20px',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* 1. Dashboard Header & Pipeline Status */}
        <DashboardHeader
          isMock={isMock}
          backendOnline={backendOnline}
          onToggleMock={() => setIsMock(!isMock)}
          onOpenReport={() => setIsReportOpen(true)}
        />

        {/* 2. Multi-Target Risk Stratification Cards (CAD, LAD, LCX, RCA) */}
        <VesselRiskCards
          analysis={analysis}
          selectedTarget={selectedTarget}
          onSelectTarget={setSelectedTarget}
        />

        {/* 3. Main Workspace Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 380px) minmax(0, 1fr)',
          gap: '20px',
          alignItems: 'start'
        }}>
          {/* Left Column: Patient Input Form & Clinical Presets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <PatientInputForm
              patient={patient}
              selectedPresetId={selectedPresetId}
              loading={loading}
              onSelectPreset={selectPreset}
              onUpdateField={updatePatientField}
              onRunAnalysis={() => runAnalysis(patient)}
              onRandomize={randomizePatient}
            />
          </div>

          {/* Right Column: 3D Anatomical Heart & SHAP Explanations */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 3D Anatomical Heart Layer */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(51, 65, 85, 0.8)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#ef4444' }}>🫀</span> Interactive 3D Coronary Anatomy
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    Anatomically mapped stenosis risk heatmap (Click vessel or card to focus)
                  </span>
                </div>
                {active3DVessel && (
                  <span style={{
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    Active Focus: {active3DVessel}
                  </span>
                )}
              </div>

              <HeartViewer
                data={heartPredictionData}
                loading={loading}
                error={error}
                isMock={isMock}
                selectedVessel={active3DVessel}
                onSelectVessel={handleSelect3DVessel}
                height="380px"
              />
            </div>

            {/* SHAP Feature Attribution Explorer */}
            <ShapAttributionView
              explanations={analysis.explanations}
              selectedTarget={selectedTarget}
              onSelectTarget={setSelectedTarget}
            />
          </div>
        </div>

        {/* 4. Footer & Research Disclaimer */}
        <footer style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          padding: '14px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          <div>
            <strong>CardioVision 3D Research Architecture</strong> — Built with FastAPI, CatBoost, ExtraTrees, TreeSHAP & React Three Fiber.
          </div>
          <div>
            ⚠️ Decision-support tool only. Not intended for direct clinical diagnostic without physician review.
          </div>
        </footer>
      </div>

      {/* 5. Clinical Summary Modal */}
      <ClinicalSummaryModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        patient={patient}
        analysis={analysis}
      />
    </main>
  );
}
