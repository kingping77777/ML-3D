'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useCardioVision } from '../hooks/useCardioVision';
import { PatientInputForm } from '../components/dashboard/PatientInputForm';
import { VesselName, TargetName, PredictionResponse } from '../types/predictions';

const HeartViewer = dynamic(
  () => import('../components/heart/HeartViewer').then((mod) => mod.HeartViewer),
  {
    ssr: false,
    loading: () => (
      <div style={{
        height: '500px',
        width: '100%',
        background: '#f8fafc',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748b',
        fontSize: '13px'
      }}>
        Loading 3D Anatomy Model...
      </div>
    )
  }
);

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
    updatePatientField,
    selectPreset,
    randomizePatient,
    runAnalysis
  } = useCardioVision();

  const active3DVessel: VesselName | null =
    selectedTarget === 'cad' ? null : (selectedTarget as VesselName);

  const handleSelect3DVessel = (vessel: VesselName | null) => {
    if (vessel) {
      setSelectedTarget(vessel as TargetName);
    } else {
      setSelectedTarget('cad');
    }
  };

  const heartPredictionData: PredictionResponse = {
    predictions: analysis.predictions,
    visualization: analysis.visualization,
    disclaimer: analysis.disclaimer
  };

  return (
    <main style={{
      minHeight: '100vh',
      background: '#f8fafc',
      color: '#0f172a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '24px 32px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Top Navbar */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '16px'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#0f172a' }}>
              PVC Localization & Coronary Anatomy Viewer
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
              Interactive 3D cardiac anatomy for mapping premature ventricular contraction (PVC) origins
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{
              fontSize: '12px',
              padding: '3px 8px',
              borderRadius: '4px',
              background: '#ecfdf5',
              color: '#059669',
              border: '1px solid #a7f3d0',
              fontWeight: 500
            }}>
              Active Model: Dundee Anatomy 3D
            </span>
            <button
              onClick={() => setIsMock(!isMock)}
              style={{
                fontSize: '12px',
                padding: '5px 12px',
                borderRadius: '6px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Mode: {isMock ? 'Demo Data' : 'Live Inference'}
            </button>
          </div>
        </header>

        {/* Main Grid: 3D Heart Viewer & Clinical Information */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(360px, 420px)',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* Left: 3D Heart Viewer */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                3D Cardiac Anatomy
              </span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Rotate: Left-click drag | Zoom: Scroll
              </span>
            </div>

            <HeartViewer
              data={heartPredictionData}
              loading={loading}
              error={error}
              selectedVessel={active3DVessel}
              onSelectVessel={handleSelect3DVessel}
              height="520px"
            />
          </div>

          {/* Right: Clinical Information & Patient Profile */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <h2 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
                Patient Clinical Profile
              </h2>
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
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <footer style={{
          borderTop: '1px solid #e2e8f0',
          paddingTop: '16px',
          fontSize: '12px',
          color: '#64748b',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <div>
            Electrophysiology anatomical reference tool.
          </div>
          <div>
            For educational and research reference only.
          </div>
        </footer>
      </div>
    </main>
  );
}
