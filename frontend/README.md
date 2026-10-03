# CardioVision 3D — Step 6 Frontend (Interactive 3D Heart Viewer)

Production-grade Next.js + React Three Fiber interactive 3D cardiovascular visualization layer for CardioVision 3D.

---

## 🚀 Quick Start & Setup

### 1. Installation
```bash
cd frontend
pnpm install # or npm install
```

### 2. Run Development Server
```bash
pnpm dev
# App will start on http://localhost:3000
```

### 3. Run Backend API (FastAPI)
Ensure the FastAPI backend is running on `http://localhost:8000`:
```bash
# In project root
python -m uvicorn app.main:app --reload --port 8000
```

---

## 🏗️ Architecture & Component Hierarchy

```
frontend/
├── app/
│   ├── layout.tsx         # Root HTML/CSS metadata layout
│   ├── page.tsx           # Step 6 main page
│   └── globals.css        # Minimal global styling reset
├── components/
│   └── heart/
│       ├── HeartViewer.tsx        # Main 3D Canvas, WebGL check & dev panel
│       ├── HeartModel.tsx         # R3F GLB loader & myocardium rendering
│       ├── Vessel.tsx             # Interactive 3D coronary mesh with pulse/color
│       ├── VesselInteraction.tsx  # Selected vessel clinical information panel
│       ├── HeartControls.tsx      # Camera reset & vessel selection toolbar
│       ├── WebGLFallback.tsx      # WebGL detection fallback container
│       ├── TwoDCardFallback.tsx   # 2D card representation for low-spec devices
│       └── heartMapping.ts        # Mesh name mapping & runtime validation
├── docs/
│   └── 3d_asset.md                # Asset provenance, license & geometry spec
├── hooks/
│   └── usePredictions.ts          # Live FastAPI fetching, validation & mock state
├── public/
│   └── models/
│       └── heart.glb              # Anatomical 3D GLB model asset (28.9 KB)
├── types/
│   └── predictions.ts             # TypeScript definitions for predictions & visualization
└── tests/
    └── heartMapping.test.ts       # Runtime mesh mapping tests
```

---

## 🩺 Anatomical 3D Asset & Mesh Mapping

- **Asset**: `frontend/public/models/heart.glb` (28.92 KB, ~2,880 triangles)
- **License**: Creative Commons 1.0 Universal / Public Domain (CC0 1.0)
- **Vessel Mappings**:
  - `LAD` → `LAD_Vessel` (Left Anterior Descending Coronary Artery)
  - `LCX` → `LCX_Vessel` (Left Circumflex Coronary Artery)
  - `RCA` → `RCA_Vessel` (Right Coronary Artery)
  - `Myocardium` → `Heart_Body`
  - `Aorta` → `Aorta`
  - `Pulmonary Artery` → `Pulmonary_Artery`

---

## ⚡ Key Features

1. **FastAPI Live Integration**: Consumes live output from `/api/v1/predict` or `/api/v1/analyze`.
2. **Probability Validation**: Validates `0.0 <= probability <= 1.0` before passing to 3D renderer.
3. **GPU Performance Optimization**: Designed for laptops with integrated graphics (low triangle count, ambient/directional lights, zero shadow maps).
4. **WebGL & 2D Fallbacks**: Detects WebGL capabilities and smoothly falls back to `TwoDCardFallback.tsx`.
5. **Development Diagnostic Panel**: Displays API status, WebGL status, vessel selection, and target probabilities during development.
6. **Mock Mode**: Togglable development-only mode with pre-configured prediction payloads.
