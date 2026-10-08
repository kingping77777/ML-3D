'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useCardioVision } from '../hooks/useCardioVision';
import { PatientInputForm } from '../components/dashboard/PatientInputForm';
import { VesselRiskCards } from '../components/dashboard/VesselRiskCards';
import { AnatomicalExplanationCard } from '../components/dashboard/AnatomicalExplanationCard';
import { VesselName, TargetName, PredictionResponse } from '../types/predictions';

const HeartViewer = dynamic(
  () => import('../components/heart/HeartViewer').then((mod) => mod.HeartViewer),
  {
    ssr: false,
    loading: () => (
      <div style={{
        height: '500px',
        width: '100%',
        background: '#09090b',
        borderRadius: '8px',
        border: '1px solid #27272a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
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
      background: '#000000',
      color: '#f8fafc',
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
          borderBottom: '1px solid #27272a',
          paddingBottom: '16px'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#f8fafc' }}>
              CardioVision 3D — AI Cardiac Anatomy & CAD Explainability
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#a1a1aa' }}>
              Real-time multi-vessel CAD predictions with 3D heart mapping and plain-English clinical explanations
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{
              fontSize: '12px',
              padding: '3px 8px',
              borderRadius: '4px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.3)',
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
                background: '#18181b',
                border: '1px solid #27272a',
                color: '#e4e4e7',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Mode: {isMock ? 'Demo Data' : 'Live Inference'}
            </button>
          </div>
        </header>

        {/* Vessel Risk Cards Overview */}
        <VesselRiskCards
          analysis={analysis}
          selectedTarget={selectedTarget}
          onSelectTarget={setSelectedTarget}
        />

        {/* Main Grid: 3D Heart Viewer & Clinical Information */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.4fr) minmax(360px, 420px)',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* Left: 3D Heart Viewer */}
          <div style={{
            background: '#09090b',
            border: '1px solid #27272a',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>
                3D Cardiac Anatomy
              </span>
              <span style={{ fontSize: '12px', color: '#a1a1aa' }}>
                Rotate: Left-click drag | Zoom: Scroll | Click vessel to inspect
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

          {/* Right: Clinical Information & Patient Profile Form */}
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
        </div>

        {/* Plain-English Anatomical Explanation Breakdown Card */}
        <AnatomicalExplanationCard
          analysis={analysis}
          selectedTarget={selectedTarget}
          onSelectTarget={setSelectedTarget}
        />

        {/* Clinical Disclaimer */}
        <footer style={{
          borderTop: '1px solid #27272a',
          paddingTop: '16px',
          fontSize: '12px',
          color: '#a1a1aa',
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
