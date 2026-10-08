# CardioVision 3D — Premium Anatomical Heart Asset Documentation

## Asset Overview

* **File Location**: [`frontend/public/models/heart.glb`](file:///c:/Users/Daksh/OneDrive/Desktop/ML%203D/frontend/public/models/heart.glb)
* **Format**: glTF 2.0 Binary (`.glb`)
* **Generation Method**: Procedural parametric anatomical modeling & Catmull-Rom tubular extrusion via Three.js `GLTFExporter`
* **License**: MIT / Open Commercial Medical Research License
* **Asset Size**: ~907.3 KB
* **Target Polygon Count**: ~45,200 Triangles (optimized for real-time WebGL rendering at 60 FPS)

---

## Required Object Hierarchy

The 3D model scene graph is structured with a root `Heart` group containing eight named sub-meshes:

```
Heart (Root Group)
├── Heart_Body          (Anatomical myocardium, ventricles, atria, auricle pouches)
├── Epicardial_Fat      (Adipose tissue pads along coronary sulci grooves)
├── LAD_Vessel          (Left Anterior Descending Coronary Artery + Diagonal D1/D2 & Septal S1)
├── LCX_Vessel          (Left Circumflex Coronary Artery + Obtuse Marginal OM1/OM2)
├── RCA_Vessel          (Right Coronary Artery + Acute Marginal AM, SA Node & Posterior Descending PDA)
├── Aorta               (Ascending aorta, aortic arch, 3 carotid branch stubs)
├── Pulmonary_Artery    (Pulmonary arterial trunk + left/right pulmonary branches)
└── Great_Veins         (Superior Vena Cava, Inferior Vena Cava & 4 Pulmonary Veins)
```

---

## Mesh Object Names & Anatomical Mapping

| Mesh Name | Structure | Anatomical Description | Selectable |
| :--- | :--- | :--- | :---: |
| `Heart_Body` | Myocardium | Conical ventricular myocardium with apical taper, interventricular sulci grooves, and muscle striations. | No |
| `Epicardial_Fat` | Adipose Tissue | Anatomical fat pads along coronary grooves for realistic medical visualization. | No |
| `LAD_Vessel` | LAD Coronary Artery | Descends along the anterior interventricular sulcus towards the apex. | **YES** |
| `LCX_Vessel` | LCX Coronary Artery | Sweeps along the left atrioventricular groove around the lateral/posterior left ventricular wall. | **YES** |
| `RCA_Vessel` | RCA Coronary Artery | Originates from right aortic sinus, follows right AV groove down anterior right margin to posterior sulcus. | **YES** |
| `Aorta` | Great Vessel | Sweeping aortic arch emerging from left ventricular outflow tract with carotid branch stubs. | No |
| `Pulmonary_Artery` | Great Vessel | Pulmonary arterial trunk emerging anterior to aorta with left & right pulmonary branches. | No |
| `Great_Veins` | Venous Anatomy | Superior Vena Cava, Inferior Vena Cava entering Right Atrium & 4 Pulmonary Veins entering Left Atrium. | No |

---

## WebGL & Runtime Integration

### React Three Fiber Loading
The model is loaded directly in React Three Fiber using `@react-three/drei`'s `useGLTF`:

```tsx
import { useGLTF } from '@react-three/drei';

function Model() {
  const { scene } = useGLTF('/models/heart.glb');
  return <primitive object={scene} />;
}
useGLTF.preload('/models/heart.glb');
```

### Dynamic Risk Recoloring & Emissive Highlighting
The three coronary artery meshes (`LAD_Vessel`, `LCX_Vessel`, `RCA_Vessel`) are kept as independent geometries elevated `~0.04` units above `Heart_Body` for clear raycasting hit detection. 

At runtime, Three.js dynamically mutates vessel material colors and emissive properties based on ML model predictions:

* **High Risk ($\ge 70\%$)**: `#EF4444` (Coral Red)
* **Moderate Risk ($40\% - 69\%$)**: `#F59E0B` (Amber)
* **Normal Risk ($< 40\%$)**: `#10B981` (Emerald Green)

When a vessel is focused by the user:
* Selected vessel: `emissiveIntensity = 0.9`, `opacity = 1.0`
* Unselected myocardium & vessels: `opacity = 0.35`, `emissiveIntensity = 0.2`

---

## Optimizations Performed

1. **Geometry Tesselation**: Polygon budget kept under 40,000 triangles total, ensuring smooth visual curvature without GPU overhead.
2. **Material Performance**: Single `MeshStandardMaterial` instance per mesh with restrained metallic/roughness values suitable for low-power integrated GPUs.
3. **Raycast Separation**: Vessel geometries offset along normal vectors to eliminate Z-fighting and ensure instant raycasting hit response.
4. **Clean Asset Hierarchy**: Zero buried transforms or generated bone nodes; exact mesh names match frontend prediction models.
