'use client';

import { useEffect, useState } from 'react';
import { generateAnatomicalHeartScene } from '../../utils/heartModelGenerator';

export default function HeartExporterComponent() {
  const [status, setStatus] = useState<string>('Initializing 3D GLB export...');
  const [exportedBytes, setExportedBytes] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function exportModel() {
      try {
        setStatus('Generating anatomical 3D heart scene geometry...');
        const scene = generateAnatomicalHeartScene();

        setStatus('Encoding scene to glTF 2.0 Binary (.glb)...');
        
        // Dynamically import GLTFExporter to prevent SSR issues
        const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');
        const exporter = new GLTFExporter();

        exporter.parse(
          scene,
          async (gltf) => {
            if (!active) return;
            try {
              const blob = new Blob([gltf as ArrayBuffer], { type: 'application/octet-stream' });
              const arrayBuffer = await blob.arrayBuffer();

              setStatus(`Uploading ${arrayBuffer.byteLength} bytes to /api/save-model...`);

              const response = await fetch('/api/save-model', {
                method: 'POST',
                headers: { 'Content-Type': 'application/octet-stream' },
                body: arrayBuffer
              });

              const resData = await response.json();
              if (response.ok && resData.success) {
                setStatus('✅ Successfully generated and saved heart.glb to public/models/heart.glb!');
                setExportedBytes(arrayBuffer.byteLength);
              } else {
                setStatus(`❌ Failed to save model: ${resData.error || 'Unknown error'}`);
              }
            } catch (err: any) {
              setStatus(`❌ Upload error: ${err.message}`);
            }
          },
          (error) => {
            console.error('GLTFExporter error:', error);
            setStatus(`❌ GLTFExporter error: ${String(error)}`);
          },
          { binary: true }
        );
      } catch (err: any) {
        setStatus(`❌ Export failed: ${err.message}`);
      }
    }

    exportModel();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: 16,
      right: 16,
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.92)',
      border: '1px solid rgba(59, 130, 246, 0.4)',
      borderRadius: 12,
      padding: '12px 18px',
      color: '#F8FAFC',
      fontFamily: 'sans-serif',
      fontSize: 13,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(8px)',
      maxWidth: 380
    }}>
      <div style={{ fontWeight: 600, color: '#60A5FA', marginBottom: 4 }}>
        CardioVision 3D Asset Auto-Exporter
      </div>
      <div>{status}</div>
      {exportedBytes && (
        <div style={{ marginTop: 6, fontSize: 11, color: '#34D399' }}>
          Asset size: {(exportedBytes / 1024).toFixed(1)} KB (glTF 2.0 Binary)
        </div>
      )}
    </div>
  );
}
