'use client';

import React, { useState, useRef, Suspense, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { HEART_ANATOMICAL_PARTS, HeartAnatomicalPart } from './heartAnatomyData';
import { PatientInput, AnalyzeResponse } from '../../types/predictions';
import { getDynamicPartStatus, getPatientSymptomMedicineConnections, SymptomMedicinePair } from './patientSymptomMedicine';

interface HeartAnatomyModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient?: PatientInput;
  analysis?: AnalyzeResponse;
  initialPartId?: string;
}

// Sleek single focused luminous anatomical beacon on the selected part
function FocusedAnatomyBeacon({ part, customColor }: { part: HeartAnatomicalPart; customColor?: string }) {
  const beaconRef = useRef<THREE.Group>(null);
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);
  const activeColor = customColor || part.color;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ringRef1.current) {
      const s1 = (Math.sin(t * 3) + 1) * 0.4 + 0.8;
      ringRef1.current.scale.set(s1, s1, s1);
    }
    if (ringRef2.current) {
      const s2 = (Math.cos(t * 3) + 1) * 0.4 + 0.8;
      ringRef2.current.scale.set(s2, s2, s2);
    }
  });

  return (
    <group ref={beaconRef} position={part.position3D}>
      {/* Central luminous core */}
      <mesh>
        <sphereGeometry args={[0.04, 32, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={activeColor}
          emissiveIntensity={1.5}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Primary pulsing ripple ring */}
      <mesh ref={ringRef1} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 0.07, 32]} />
        <meshBasicMaterial
          color={activeColor}
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Secondary outer ripple ring */}
      <mesh ref={ringRef2} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.1, 32]} />
        <meshBasicMaterial
          color={activeColor}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating minimalistic clinical callout */}
      <Html
        position={[0, 0.1, 0]}
        center
        distanceFactor={5.0}
        style={{ pointerEvents: 'none', whiteSpace: 'nowrap' }}
      >
        <div style={{
          background: 'rgba(9, 9, 11, 0.92)',
          border: `1.5px solid ${activeColor}`,
          borderRadius: '8px',
          padding: '5px 10px',
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 800,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          boxShadow: `0 0 16px ${activeColor}66`,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backdropFilter: 'blur(8px)'
        }}>
          <span style={{ fontSize: '13px' }}>{part.icon}</span>
          <span style={{ letterSpacing: '0.02em' }}>{part.name.split('(')[0].trim()}</span>
        </div>
      </Html>
    </group>
  );
}

// 3D Scene Inside Modal
function Minimalist3DHeart({
  selectedPart,
  customColor,
  enableHeartbeat
}: {
  selectedPart: HeartAnatomicalPart;
  customColor?: string;
  enableHeartbeat: boolean;
}) {
  const { scene } = useGLTF('/models/cardiac_anatomy_external_view_of_human_heart.glb');
  const groupRef = useRef<THREE.Group>(null);

  const { clonedScene, computedScale } = useMemo(() => {
    const cloned = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    cloned.position.set(-center.x, -center.y, -center.z);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? 2.8 / maxDim : 1.0;
    return { clonedScene: cloned, computedScale: scale };
  }, [scene]);

  useFrame((state) => {
    if (groupRef.current && enableHeartbeat) {
      const time = state.clock.getElapsedTime();
      const beatCycle = (time * 1.17 * Math.PI * 2) % (Math.PI * 2);
      const pulse = Math.sin(beatCycle) * 0.5 + Math.sin(beatCycle * 2) * 0.25;
      const beatScale = computedScale * (1.0 + Math.max(0, pulse) * 0.015);
      groupRef.current.scale.set(beatScale, beatScale, beatScale);
    }
  });

  return (
    <group ref={groupRef} scale={[computedScale, computedScale, computedScale]}>
      <primitive object={clonedScene} />
      {/* Display only the focused glowing beacon for the selected part */}
      {selectedPart && <FocusedAnatomyBeacon part={selectedPart} customColor={customColor} />}
    </group>
  );
}

export const HeartAnatomyModal: React.FC<HeartAnatomyModalProps> = ({
  isOpen,
  onClose,
  patient,
  analysis,
  initialPartId = 'lad'
}) => {
  const [selectedPartId, setSelectedPartId] = useState<string>(initialPartId);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [enableHeartbeat, setEnableHeartbeat] = useState<boolean>(true);

  const controlsRef = useRef<any>(null);

  const selectedPart = useMemo(() => {
    return HEART_ANATOMICAL_PARTS.find((p) => p.id === selectedPartId) || HEART_ANATOMICAL_PARTS[0];
  }, [selectedPartId]);

  const dynamicStatus = useMemo(() => {
    return getDynamicPartStatus(selectedPart.id, patient, analysis);
  }, [selectedPart.id, patient, analysis]);

  const symptomMedicinePairs = useMemo(() => {
    if (!patient) return [];
    return getPatientSymptomMedicineConnections(patient);
  }, [patient]);

  const relevantPairs = useMemo(() => {
    if (symptomMedicinePairs.length === 0) return [];
    // Show pairs affecting this part or overall
    const specific = symptomMedicinePairs.filter((p) => p.affectedPartId === selectedPart.id);
    if (specific.length > 0) return specific;
    return symptomMedicinePairs;
  }, [symptomMedicinePairs, selectedPart.id]);

  const categories = ['All', 'Coronary Arteries', 'Cardiac Chambers', 'Great Vessels', 'Apex & Conduction'];

  const filteredParts = useMemo(() => {
    if (activeCategory === 'All') return HEART_ANATOMICAL_PARTS;
    return HEART_ANATOMICAL_PARTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const handleSelectPart = (part: HeartAnatomicalPart) => {
    setSelectedPartId(part.id);
    if (controlsRef.current) {
      controlsRef.current.setAzimuthalAngle(part.azimuthalAngle);
      controlsRef.current.setPolarAngle(part.polarAngle);
    }
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.92)',
      backdropFilter: 'blur(16px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#09090b',
        border: '1px solid #27272a',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '1380px',
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9)',
        overflow: 'hidden'
      }}>
        {/* Top Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '14px 24px',
          borderBottom: '1px solid #27272a',
          background: '#09090b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.5rem' }}>🫀</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                3D Cardiac Anatomy & Pathology Explorer
              </h2>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                Select any heart part below to focus the 3D model, inspect damage mechanisms, and view clinical cures.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#18181b',
              border: '1px solid #27272a',
              color: '#e4e4e7',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Modal Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.15fr) minmax(420px, 1fr)',
          flex: 1,
          overflow: 'hidden'
        }}>
          {/* LEFT: Clean 3D Studio Heart Canvas */}
          <div style={{
            position: 'relative',
            background: '#000000',
            borderRight: '1px solid #27272a',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Top Toolbar */}
            <div style={{
              position: 'absolute',
              top: '14px',
              left: '14px',
              right: '14px',
              zIndex: 10,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setEnableHeartbeat(!enableHeartbeat)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: '1px solid #27272a',
                    background: enableHeartbeat ? 'rgba(239, 68, 68, 0.15)' : '#18181b',
                    color: enableHeartbeat ? '#f87171' : '#a1a1aa',
                    fontSize: '0.73rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  💓 Heartbeat: {enableHeartbeat ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={handleResetCamera}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: '1px solid #27272a',
                    background: '#18181b',
                    color: '#e4e4e7',
                    fontSize: '0.73rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  🔄 Reset View
                </button>
              </div>

              <div style={{
                background: 'rgba(9, 9, 11, 0.8)',
                border: '1px solid #27272a',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                color: selectedPart.color,
                fontWeight: 700
              }}>
                Target: {selectedPart.name.split('(')[0].trim()}
              </div>
            </div>

            {/* 3D Canvas */}
            <div style={{ flex: 1, width: '100%', height: '100%' }}>
              <Canvas
                camera={{ position: [0, 0, 3.8], fov: 45 }}
                gl={{ antialias: true }}
              >
                <ambientLight intensity={1.2} />
                <directionalLight position={[5, 8, 5]} intensity={1.4} />
                <directionalLight position={[-5, 3, -5]} intensity={0.8} />

                <Suspense fallback={null}>
                  <Minimalist3DHeart
                    selectedPart={selectedPart}
                    customColor={dynamicStatus.color}
                    enableHeartbeat={enableHeartbeat}
                  />
                </Suspense>

                <OrbitControls
                  ref={controlsRef}
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  minDistance={1.8}
                  maxDistance={6.0}
                />
              </Canvas>
            </div>

            {/* Bottom Helper Bar */}
            <div style={{
              padding: '8px 16px',
              borderTop: '1px solid #27272a',
              background: '#09090b',
              fontSize: '0.72rem',
              color: '#94a3b8',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>🖱️ Drag to orbit 3D heart | Scroll to zoom in/out</span>
              <span>Anatomical Zone: <strong style={{ color: '#f8fafc' }}>{selectedPart.tag}</strong></span>
            </div>
          </div>

          {/* RIGHT: Anatomical Part Selector & Medical Cure Breakdown */}
          <div style={{
            background: '#09090b',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: '20px 24px',
            gap: '16px'
          }}>
            {/* Category Segmented Tabs */}
            <div style={{ display: 'flex', gap: '4px', background: '#18181b', padding: '3px', borderRadius: '10px', border: '1px solid #27272a' }}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    flex: 1,
                    padding: '5px 8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeCategory === cat ? '#0284c7' : 'transparent',
                    color: activeCategory === cat ? '#ffffff' : '#94a3b8',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'center'
                  }}
                >
                  {cat.replace('& Conduction', '').trim()}
                </button>
              ))}
            </div>

            {/* Compact Horizontal Part Pills */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {filteredParts.map((p) => {
                const isCur = p.id === selectedPart.id;
                const status = getDynamicPartStatus(p.id, patient, analysis);
                return (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPart(p)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '8px',
                      border: isCur ? `1.5px solid ${status.color}` : '1px solid #27272a',
                      background: isCur ? '#18181b' : '#0c0d12',
                      color: isCur ? '#ffffff' : '#a1a1aa',
                      fontSize: '0.73rem',
                      fontWeight: isCur ? 800 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: isCur ? `0 0 12px ${status.color}44` : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{p.icon}</span>
                    <span>{p.name.split('(')[0].trim()}</span>
                    <span style={{
                      fontSize: '0.62rem',
                      padding: '1px 5px',
                      borderRadius: '4px',
                      background: `${status.color}22`,
                      color: status.color,
                      border: `1px solid ${status.color}44`,
                      fontWeight: 700
                    }}>
                      {status.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Hero Card of Inspected Part */}
            <div style={{
              background: '#18181b',
              border: `1.5px solid ${dynamicStatus.color}`,
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              boxShadow: `0 0 16px ${dynamicStatus.color}22`
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.68rem', fontWeight: 700, color: dynamicStatus.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {selectedPart.category} • {selectedPart.tag}
                  </span>
                  <h3 style={{ margin: '2px 0 0 0', fontSize: '1.15rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{selectedPart.icon}</span> {selectedPart.name}
                  </h3>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', display: 'block' }}>Patient Live Correlation</span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: dynamicStatus.color }}>
                    {dynamicStatus.riskText}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.45, background: '#09090b', padding: '8px 10px', borderRadius: '8px', border: '1px solid #27272a' }}>
                <strong>📍 Anatomy:</strong> {selectedPart.anatomicalLocation}
              </div>

              <div style={{ fontSize: '0.76rem', color: '#94a3b8', lineHeight: 1.4 }}>
                <strong>⚡ Function:</strong> {selectedPart.physiologicalFunction}
              </div>
            </div>

            {/* NEW: Explicit Patient Symptoms ➔ Medicine Connection Matrix */}
            <div style={{
              background: '#18181b',
              border: '1px solid #0284c7',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🔗</span> CONNECTED PATIENT SYMPTOMS & PRESCRIBED MEDICINES
                </div>
                <span style={{ fontSize: '0.68rem', color: '#34d399', background: 'rgba(52, 211, 153, 0.15)', padding: '2px 8px', borderRadius: '4px', border: '1px solid rgba(52, 211, 153, 0.3)', fontWeight: 700 }}>
                  Active Form Input Connected
                </span>
              </div>

              {relevantPairs.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {relevantPairs.map((pair) => (
                    <div key={pair.id} style={{
                      background: '#000000',
                      border: '1px solid #27272a',
                      borderRadius: '10px',
                      padding: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}>
                      {/* Step 1: Patient Symptom */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #27272a', paddingBottom: '6px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: pair.severity === 'high' ? '#f87171' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <span>{pair.icon}</span> <strong>Patient Symptom:</strong> {pair.symptomName}
                        </span>
                        <span style={{ fontSize: '0.68rem', background: '#18181b', color: '#cbd5e1', padding: '2px 6px', borderRadius: '4px', border: '1px solid #27272a' }}>
                          {pair.symptomValue}
                        </span>
                      </div>

                      {/* Step 2: Prescribed Medicine Connection */}
                      <div style={{ fontSize: '0.76rem', color: '#f8fafc', lineHeight: 1.4 }}>
                        <strong style={{ color: '#34d399' }}>💊 Prescribed Medicine & Protocol:</strong> {pair.prescribedMedicine}
                      </div>

                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', background: '#09090b', padding: '6px 8px', borderRadius: '6px', lineHeight: 1.35 }}>
                        💡 <strong>Pharmacological Mechanism:</strong> {pair.clinicalMechanism}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.76rem', color: '#a1a1aa', textAlign: 'center', padding: '10px' }}>
                  No high-risk symptom connections active for baseline values.
                </div>
              )}
            </div>

            {/* Disease & Pathology Card */}
            <div style={{
              background: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '12px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>⚠️</span> DISEASE & DAMAGE MECHANISM
              </div>

              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#f8fafc' }}>
                {selectedPart.associatedPathology.diseaseName}
              </div>

              <p style={{ margin: 0, fontSize: '0.76rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                {selectedPart.associatedPathology.description}
              </p>

              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '8px 10px', borderRadius: '6px', fontSize: '0.73rem', color: '#fca5a5', lineHeight: 1.4 }}>
                💡 <strong>Clinical Example:</strong> {selectedPart.associatedPathology.clinicalExample}
              </div>
            </div>

            {/* Evidence-Based Cure & Treatment Card */}
            <div style={{
              background: '#18181b',
              border: '1px solid #27272a',
              borderRadius: '12px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🩺</span> HOW TO CURE & TREAT THIS AREA
              </div>

              {/* 1. Medications */}
              <div style={{ background: '#000000', padding: '10px', borderRadius: '8px', border: '1px solid #27272a' }}>
                <strong style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'block', marginBottom: '4px' }}>
                  💊 1. Medications (Pharmacotherapy)
                </strong>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.73rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                  {selectedPart.howToCure.medicalManagement.map((med, idx) => (
                    <li key={idx} style={{ marginBottom: '3px' }}>{med}</li>
                  ))}
                </ul>
              </div>

              {/* 2. Surgical Interventions */}
              <div style={{ background: '#000000', padding: '10px', borderRadius: '8px', border: '1px solid #27272a' }}>
                <strong style={{ fontSize: '0.75rem', color: '#f59e0b', display: 'block', marginBottom: '4px' }}>
                  🩺 2. Procedures & Surgeries (Revascularization)
                </strong>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.73rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                  {selectedPart.howToCure.surgicalInterventions.map((surg, idx) => (
                    <li key={idx} style={{ marginBottom: '3px' }}>{surg}</li>
                  ))}
                </ul>
              </div>

              {/* 3. Lifestyle & Prevention */}
              <div style={{ background: '#000000', padding: '10px', borderRadius: '8px', border: '1px solid #27272a' }}>
                <strong style={{ fontSize: '0.75rem', color: '#34d399', display: 'block', marginBottom: '4px' }}>
                  🥗 3. Lifestyle & Long-Term Reversal
                </strong>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '0.73rem', color: '#cbd5e1', lineHeight: 1.45 }}>
                  {selectedPart.howToCure.lifestyleAndPrevention.map((life, idx) => (
                    <li key={idx} style={{ marginBottom: '3px' }}>{life}</li>
                  ))}
                </ul>
              </div>

              {/* 4. Emergency Action */}
              <div style={{ background: 'rgba(239, 68, 68, 0.12)', padding: '8px 10px', borderRadius: '8px', border: '1px solid #ef4444', fontSize: '0.73rem', color: '#fca5a5', lineHeight: 1.4 }}>
                <strong style={{ color: '#f87171', display: 'block', marginBottom: '3px' }}>
                  🚨 4. Emergency Red-Flag Warning
                </strong>
                {selectedPart.howToCure.emergencyProtocol}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
