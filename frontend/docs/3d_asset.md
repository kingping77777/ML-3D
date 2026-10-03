# 3D Anatomical Asset Documentation & Provenance

## Asset Overview

- **Asset Name**: `heart.glb` (CardioVision 3D Coronary & Cardiac Anatomical Asset)
- **Asset Location**: `frontend/public/models/heart.glb`
- **Source**: Procedural Anatomical Lofting & glTF Exporter Pipeline (`scratch/build_heart_glb.js`)
- **License**: Creative Commons 1.0 Universal / Public Domain (CC0 1.0 Universal)
- **Format**: Binary glTF 2.0 (`.glb`)
- **File Size**: 28.92 KB
- **Mesh / Geometry Complexity**:
  - Total Sub-Meshes: 6 distinct named objects
  - Total Vertex Count: ~1,480 vertices
  - Total Triangle Count: ~2,880 triangles
  - Textures: Procedural PBR materials (zero external texture maps required, optimizing integrated GPU memory bandwidth)

---

## Anatomical Sub-Mesh Mapping

| Anatomical Vessel / Structure | GLB Sub-Mesh Name | Visual Representation | Clinical Description |
| :--- | :--- | :--- | :--- |
| **LAD** | `LAD_Vessel` | Tubular artery geometry along anterior interventricular sulcus | Left Anterior Descending Coronary Artery |
| **LCX** | `LCX_Vessel` | Tubular artery geometry along left atrioventricular sulcus | Left Circumflex Coronary Artery |
| **RCA** | `RCA_Vessel` | Tubular artery geometry along right atrioventricular sulcus | Right Coronary Artery |
| **Myocardium** | `Heart_Body` | Tapered cardiac chamber geometry (Ventricles + Atria) | Cardiac Myocardium Wall |
| **Aorta** | `Aorta` | Arch tube exiting superior left ventricle | Aortic Arch |
| **Pulmonary Artery** | `Pulmonary_Artery` | Crossing anterior tubular structure | Pulmonary Arterial Trunk |

---

## Design & Performance Decisions

1. **Integrated GPU Optimization**:
   - Designed specifically to run smoothly on laptops with integrated GPU graphics.
   - Low polygon budget (< 3,000 triangles) to maintain 60 FPS without CUDA or dedicated hardware.
   - Minimal ambient & directional lighting (no shadow maps, post-processing, or expensive shaders).

2. **Explicit Anatomical Mapping**:
   - Each vessel is represented as a distinct named mesh (`LAD_Vessel`, `LCX_Vessel`, `RCA_Vessel`) so pointer hover and click interaction can directly inspect and highlight specific coronary territories.

3. **Medical Disclaimer & Scope**:
   - The 3D model visualizes ML model outputs (estimated probabilities for vessel stenosis) for research and clinical decision support.
   - It is **not** a patient-specific anatomical reconstruction, CT angiogram, or diagnostic imaging modality.
