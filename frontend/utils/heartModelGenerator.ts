import * as THREE from 'three';

/**
 * CardioVision 3D - Ultra-High Precision Anatomical Heart Model Generator
 * Generates a highly detailed, medically authentic 3D human heart scene with separate, selectable coronary artery meshes:
 * - Heart_Body (Ventricular Myocardium, Left/Right Atria & Appendages)
 * - Epicardial_Fat (Epicardial adipose pads along coronary sulci)
 * - LAD_Vessel (Left Anterior Descending Coronary Artery + Diagonal D1/D2 & Septal S1 branches)
 * - LCX_Vessel (Left Circumflex Coronary Artery + Obtuse Marginal OM1/OM2 branches)
 * - RCA_Vessel (Right Coronary Artery + Acute Marginal AM, Sinoatrial SA & Posterior Descending PDA)
 * - Aorta (Aortic Arch + Brachiocephalic, Left Common Carotid & Left Subclavian stubs)
 * - Pulmonary_Artery (Pulmonary Trunk + Left/Right Pulmonary Arteries)
 * - Great_Veins (Superior Vena Cava, Inferior Vena Cava & 4 Pulmonary Veins)
 */

export function generateAnatomicalHeartScene(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'Heart';

  // --- 1. HEART BODY (MYOCARDIUM & ATRIA) ---
  const heartBodyGeo = createMyocardiumGeometry();
  const heartBodyMat = new THREE.MeshStandardMaterial({
    name: 'Myocardium_Mat',
    color: new THREE.Color(0x8B263E),
    roughness: 0.42,
    metalness: 0.05
  });
  const heartBodyMesh = new THREE.Mesh(heartBodyGeo, heartBodyMat);
  heartBodyMesh.name = 'Heart_Body';
  root.add(heartBodyMesh);

  // --- 2. EPICARDIAL FAT PADS (EPICARDIAL ADIPOSE TISSUE) ---
  const fatGeo = createEpicardialFatGeometry();
  const fatMat = new THREE.MeshStandardMaterial({
    name: 'EpicardialFat_Mat',
    color: new THREE.Color(0xD4C28D),
    roughness: 0.65,
    metalness: 0.02
  });
  const fatMesh = new THREE.Mesh(fatGeo, fatMat);
  fatMesh.name = 'Epicardial_Fat';
  root.add(fatMesh);

  // --- 3. AORTA & AORTIC ARCH ---
  const aortaGeo = createAortaGeometry();
  const aortaMat = new THREE.MeshStandardMaterial({
    name: 'Aorta_Mat',
    color: new THREE.Color(0xA63A48),
    roughness: 0.32,
    metalness: 0.08
  });
  const aortaMesh = new THREE.Mesh(aortaGeo, aortaMat);
  aortaMesh.name = 'Aorta';
  root.add(aortaMesh);

  // --- 4. PULMONARY ARTERY ---
  const paGeo = createPulmonaryArteryGeometry();
  const paMat = new THREE.MeshStandardMaterial({
    name: 'PulmonaryArtery_Mat',
    color: new THREE.Color(0x7A3B53),
    roughness: 0.38,
    metalness: 0.05
  });
  const paMesh = new THREE.Mesh(paGeo, paMat);
  paMesh.name = 'Pulmonary_Artery';
  root.add(paMesh);

  // --- 5. GREAT VEINS (SVC, IVC, PULMONARY VEINS) ---
  const veinsGeo = createGreatVeinsGeometry();
  const veinsMat = new THREE.MeshStandardMaterial({
    name: 'GreatVeins_Mat',
    color: new THREE.Color(0x2C5282),
    roughness: 0.38,
    metalness: 0.06
  });
  const veinsMesh = new THREE.Mesh(veinsGeo, veinsMat);
  veinsMesh.name = 'Great_Veins';
  root.add(veinsMesh);

  // --- 6. CORONARY ARTERIES (SEPARATE SELECTABLE MESHES) ---
  const createVesselMaterial = (name: string, colorHex: number) => {
    return new THREE.MeshStandardMaterial({
      name,
      color: new THREE.Color(colorHex),
      roughness: 0.28,
      metalness: 0.12,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0.0,
      transparent: false,
      opacity: 1.0
    });
  };

  // 6a. LAD_Vessel (Left Anterior Descending)
  const ladGeo = createLADGeometry();
  const ladMat = createVesselMaterial('LAD_Material', 0xE64A19);
  const ladMesh = new THREE.Mesh(ladGeo, ladMat);
  ladMesh.name = 'LAD_Vessel';
  root.add(ladMesh);

  // 6b. LCX_Vessel (Left Circumflex)
  const lcxGeo = createLCXGeometry();
  const lcxMat = createVesselMaterial('LCX_Material', 0xE64A19);
  const lcxMesh = new THREE.Mesh(lcxGeo, lcxMat);
  lcxMesh.name = 'LCX_Vessel';
  root.add(lcxMesh);

  // 6c. RCA_Vessel (Right Coronary Artery)
  const rcaGeo = createRCAGeometry();
  const rcaMat = createVesselMaterial('RCA_Material', 0xE64A19);
  const rcaMesh = new THREE.Mesh(rcaGeo, rcaMat);
  rcaMesh.name = 'RCA_Vessel';
  root.add(rcaMesh);

  return root;
}

/**
 * Creates myocardium geometry with dual-ventricular conoid shape, apex left shift,
 * interventricular sulci, and atrial auricle pouches.
 */
function createMyocardiumGeometry(): THREE.BufferGeometry {
  const widthSegments = 80;
  const heightSegments = 80;
  const sphereGeo = new THREE.SphereGeometry(1.2, widthSegments, heightSegments);
  const posAttr = sphereGeo.attributes.position;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < posAttr.count; i++) {
    vertex.fromBufferAttribute(posAttr, i);

    let x = vertex.x;
    let y = vertex.y;
    let z = vertex.z;
    const normY = y / 1.2;

    // 1. Apical Tapering & Left-Anterior Apex Shift
    if (normY < 0) {
      const taper = 1.0 + normY * 0.58;
      x *= taper;
      z *= taper;
      x -= Math.pow(-normY, 1.35) * 0.38; // Apex left shift
      z += Math.pow(-normY, 1.35) * 0.28; // Apex anterior tilt
      y *= 1.38; // Extended apex
    } else {
      // 2. Base & Atrial Expansion
      const expansion = 1.0 + Math.sin(normY * Math.PI) * 0.18;
      x *= expansion;
      z *= expansion;
    }

    const angle = Math.atan2(z, x);

    // 3. Left Ventricle Thick Posterolateral Bulge
    if (x < 0 && normY < 0.2) {
      const lvFactor = Math.cos(angle - Math.PI * 0.8) * 0.28;
      x += Math.max(0, lvFactor) * (1.0 - Math.abs(normY));
    }

    // 4. Right Ventricle Anterior Conus Bulge
    if (z > 0 && x > 0 && normY < 0.2) {
      z += Math.sin(angle) * 0.18 * (1.0 - Math.abs(normY));
    }

    // 5. Anterior Interventricular Sulcus Groove
    const antSulcusDist = Math.abs(angle - (Math.PI * 0.35));
    if (antSulcusDist < 0.38 && normY < 0.3 && normY > -0.85) {
      const grooveDepth = Math.cos((antSulcusDist / 0.38) * (Math.PI / 2)) * 0.09;
      x -= (x / Math.hypot(x, z)) * grooveDepth;
      z -= (z / Math.hypot(x, z)) * grooveDepth;
    }

    // 6. Posterior Interventricular Sulcus Groove
    const postSulcusDist = Math.abs(angle - (-Math.PI * 0.65));
    if (postSulcusDist < 0.38 && normY < 0.3 && normY > -0.85) {
      const grooveDepth = Math.cos((postSulcusDist / 0.38) * (Math.PI / 2)) * 0.07;
      x -= (x / Math.hypot(x, z)) * grooveDepth;
      z -= (z / Math.hypot(x, z)) * grooveDepth;
    }

    // 7. Right & Left Atrial Appendage (Auricle) Pouches
    if (normY > 0.4) {
      // Right Atrium Auricle
      if (x > 0.3 && z > 0.2) {
        z += 0.15 * Math.sin((normY - 0.4) * Math.PI * 2);
      }
      // Left Atrium Auricle
      if (x < -0.3 && z > 0.1) {
        x -= 0.12 * Math.sin((normY - 0.4) * Math.PI * 2);
      }
    }

    // 8. Natural Myocardium Surface Muscle Striation Texture
    const muscleNoise = (Math.sin(x * 10.0) * Math.cos(y * 10.0) * Math.sin(z * 10.0)) * 0.016;
    x += muscleNoise;
    y += muscleNoise;
    z += muscleNoise;

    posAttr.setXYZ(i, x, y, z);
  }

  sphereGeo.computeVertexNormals();
  return sphereGeo;
}

/**
 * Creates Epicardial Fat geometry along the coronary sulci grooves (AV groove & IV sulci)
 * for realistic medical visualization.
 */
function createEpicardialFatGeometry(): THREE.BufferGeometry {
  const fatPads: THREE.BufferGeometry[] = [];

  // Anterior IV Sulcus Fat Pad
  const antFatCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.18, 0.45, 0.38),
    new THREE.Vector3(-0.22, 0.10, 0.62),
    new THREE.Vector3(-0.25, -0.30, 0.68),
    new THREE.Vector3(-0.30, -0.75, 0.62),
    new THREE.Vector3(-0.35, -1.25, 0.48),
    new THREE.Vector3(-0.37, -1.60, 0.28)
  ]);
  const antFatTube = new THREE.TubeGeometry(antFatCurve, 40, 0.09, 12, false);
  fatPads.push(antFatTube);

  // Right AV Groove Fat Pad
  const rcaFatCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.22, 0.45, 0.32),
    new THREE.Vector3(0.55, 0.38, 0.35),
    new THREE.Vector3(0.85, 0.25, 0.28),
    new THREE.Vector3(1.08, 0.02, 0.15),
    new THREE.Vector3(1.10, -0.30, -0.08),
    new THREE.Vector3(0.92, -0.58, -0.40)
  ]);
  const rcaFatTube = new THREE.TubeGeometry(rcaFatCurve, 40, 0.085, 12, false);
  fatPads.push(rcaFatTube);

  // Left AV Groove Fat Pad
  const lcxFatCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.18, 0.48, 0.38),
    new THREE.Vector3(-0.45, 0.42, 0.28),
    new THREE.Vector3(-0.75, 0.35, 0.10),
    new THREE.Vector3(-1.05, 0.18, -0.18),
    new THREE.Vector3(-1.10, -0.08, -0.45)
  ]);
  const lcxFatTube = new THREE.TubeGeometry(lcxFatCurve, 32, 0.08, 12, false);
  fatPads.push(lcxFatTube);

  return mergeGeometries(fatPads);
}

/**
 * Creates Aorta & Aortic Arch geometry with 3 carotid/subclavian branch stubs.
 */
function createAortaGeometry(): THREE.BufferGeometry {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.05, 0.40, 0.10),
    new THREE.Vector3(0.10, 0.90, 0.15),
    new THREE.Vector3(0.15, 1.48, 0.05),
    new THREE.Vector3(0.00, 1.78, -0.25),
    new THREE.Vector3(-0.35, 1.62, -0.50),
    new THREE.Vector3(-0.48, 0.70, -0.65)
  ]);

  const mainTube = new THREE.TubeGeometry(curve, 64, 0.22, 24, false);

  const branchStubs: THREE.BufferGeometry[] = [mainTube];
  const branchConfigs = [
    { pos: new THREE.Vector3(0.12, 1.64, 0.0), dir: new THREE.Vector3(0.05, 0.36, 0.02) },
    { pos: new THREE.Vector3(0.02, 1.74, -0.12), dir: new THREE.Vector3(0.0, 0.36, 0.0) },
    { pos: new THREE.Vector3(-0.12, 1.72, -0.25), dir: new THREE.Vector3(-0.05, 0.36, -0.02) }
  ];

  branchConfigs.forEach(cfg => {
    const branchCurve = new THREE.CatmullRomCurve3([
      cfg.pos,
      cfg.pos.clone().add(cfg.dir)
    ]);
    const branchTube = new THREE.TubeGeometry(branchCurve, 12, 0.07, 16, false);
    branchStubs.push(branchTube);
  });

  return mergeGeometries(branchStubs);
}

/**
 * Creates Pulmonary Artery geometry with left/right branches.
 */
function createPulmonaryArteryGeometry(): THREE.BufferGeometry {
  const trunkCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.15, 0.35, 0.45),
    new THREE.Vector3(-0.10, 0.85, 0.40),
    new THREE.Vector3(-0.05, 1.25, 0.20)
  ]);
  const mainTrunk = new THREE.TubeGeometry(trunkCurve, 32, 0.20, 24, false);

  const rightBranchCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.05, 1.25, 0.20),
    new THREE.Vector3(0.35, 1.20, -0.10),
    new THREE.Vector3(0.72, 1.10, -0.35)
  ]);
  const rightBranch = new THREE.TubeGeometry(rightBranchCurve, 20, 0.13, 16, false);

  const leftBranchCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.05, 1.25, 0.20),
    new THREE.Vector3(-0.45, 1.28, 0.00),
    new THREE.Vector3(-0.78, 1.20, -0.20)
  ]);
  const leftBranch = new THREE.TubeGeometry(leftBranchCurve, 20, 0.13, 16, false);

  return mergeGeometries([mainTrunk, rightBranch, leftBranch]);
}

/**
 * Creates Great Veins geometry (SVC, IVC, and 4 Pulmonary Vein stubs).
 */
function createGreatVeinsGeometry(): THREE.BufferGeometry {
  const veinGeos: THREE.BufferGeometry[] = [];

  // Superior Vena Cava (SVC) entering Right Atrium from top
  const svcCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.48, 0.65, -0.15),
    new THREE.Vector3(0.52, 1.35, -0.20)
  ]);
  veinGeos.push(new THREE.TubeGeometry(svcCurve, 16, 0.16, 16, false));

  // Inferior Vena Cava (IVC) entering Right Atrium from bottom
  const ivcCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.45, -0.35, -0.45),
    new THREE.Vector3(0.50, -0.95, -0.55)
  ]);
  veinGeos.push(new THREE.TubeGeometry(ivcCurve, 16, 0.16, 16, false));

  // 4 Left & Right Pulmonary Veins entering posterior Left Atrium
  const pvPoints = [
    { pos: new THREE.Vector3(-0.45, 0.75, -0.65), dir: new THREE.Vector3(-0.3, 0.1, -0.2) },
    { pos: new THREE.Vector3(-0.45, 0.52, -0.68), dir: new THREE.Vector3(-0.3, -0.05, -0.2) },
    { pos: new THREE.Vector3(0.15, 0.75, -0.65), dir: new THREE.Vector3(0.3, 0.1, -0.2) },
    { pos: new THREE.Vector3(0.15, 0.52, -0.68), dir: new THREE.Vector3(0.3, -0.05, -0.2) }
  ];

  pvPoints.forEach(pv => {
    const pvCurve = new THREE.CatmullRomCurve3([pv.pos, pv.pos.clone().add(pv.dir)]);
    veinGeos.push(new THREE.TubeGeometry(pvCurve, 10, 0.09, 12, false));
  });

  return mergeGeometries(veinGeos);
}

/**
 * Creates LAD_Vessel (Left Anterior Descending Coronary Artery)
 */
function createLADGeometry(): THREE.BufferGeometry {
  const ladPoints = [
    new THREE.Vector3(-0.18, 0.48, 0.38),
    new THREE.Vector3(-0.25, 0.35, 0.48),
    new THREE.Vector3(-0.22, 0.10, 0.65),
    new THREE.Vector3(-0.24, -0.25, 0.72),
    new THREE.Vector3(-0.28, -0.65, 0.70),
    new THREE.Vector3(-0.32, -1.05, 0.60),
    new THREE.Vector3(-0.36, -1.45, 0.42),
    new THREE.Vector3(-0.38, -1.68, 0.28)
  ];
  const mainLAD = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ladPoints), 64, 0.058, 16, false);

  const d1Points = [
    new THREE.Vector3(-0.24, -0.25, 0.72),
    new THREE.Vector3(-0.55, -0.40, 0.68),
    new THREE.Vector3(-0.85, -0.60, 0.52)
  ];
  const d1Tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(d1Points), 24, 0.038, 12, false);

  const d2Points = [
    new THREE.Vector3(-0.28, -0.65, 0.70),
    new THREE.Vector3(-0.60, -0.85, 0.58),
    new THREE.Vector3(-0.80, -1.10, 0.38)
  ];
  const d2Tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(d2Points), 20, 0.034, 12, false);

  const s1Points = [
    new THREE.Vector3(-0.22, 0.10, 0.65),
    new THREE.Vector3(-0.15, -0.05, 0.50)
  ];
  const s1Tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(s1Points), 12, 0.030, 10, false);

  return mergeGeometries([mainLAD, d1Tube, d2Tube, s1Tube]);
}

/**
 * Creates LCX_Vessel (Left Circumflex Coronary Artery)
 */
function createLCXGeometry(): THREE.BufferGeometry {
  const lcxPoints = [
    new THREE.Vector3(-0.18, 0.48, 0.38),
    new THREE.Vector3(-0.45, 0.42, 0.30),
    new THREE.Vector3(-0.75, 0.35, 0.12),
    new THREE.Vector3(-1.05, 0.20, -0.15),
    new THREE.Vector3(-1.12, -0.05, -0.42),
    new THREE.Vector3(-0.95, -0.25, -0.68),
    new THREE.Vector3(-0.65, -0.38, -0.82)
  ];
  const mainLCX = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(lcxPoints), 64, 0.054, 16, false);

  const om1Points = [
    new THREE.Vector3(-1.05, 0.20, -0.15),
    new THREE.Vector3(-1.10, -0.20, 0.05),
    new THREE.Vector3(-1.05, -0.65, 0.20)
  ];
  const om1Tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(om1Points), 24, 0.038, 12, false);

  const om2Points = [
    new THREE.Vector3(-1.12, -0.05, -0.42),
    new THREE.Vector3(-1.08, -0.45, -0.35),
    new THREE.Vector3(-0.95, -0.85, -0.20)
  ];
  const om2Tube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(om2Points), 20, 0.034, 12, false);

  return mergeGeometries([mainLCX, om1Tube, om2Tube]);
}

/**
 * Creates RCA_Vessel (Right Coronary Artery)
 */
function createRCAGeometry(): THREE.BufferGeometry {
  const rcaPoints = [
    new THREE.Vector3(0.22, 0.45, 0.32),
    new THREE.Vector3(0.55, 0.38, 0.35),
    new THREE.Vector3(0.85, 0.25, 0.30),
    new THREE.Vector3(1.08, 0.02, 0.18),
    new THREE.Vector3(1.12, -0.28, -0.05),
    new THREE.Vector3(0.95, -0.55, -0.38),
    new THREE.Vector3(0.55, -0.72, -0.68),
    new THREE.Vector3(0.15, -0.95, -0.78),
    new THREE.Vector3(-0.15, -1.25, -0.65)
  ];
  const mainRCA = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rcaPoints), 72, 0.056, 16, false);

  const amPoints = [
    new THREE.Vector3(1.08, 0.02, 0.18),
    new THREE.Vector3(0.95, -0.30, 0.35),
    new THREE.Vector3(0.70, -0.65, 0.48)
  ];
  const amTube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(amPoints), 24, 0.036, 12, false);

  const saPoints = [
    new THREE.Vector3(0.35, 0.42, 0.34),
    new THREE.Vector3(0.40, 0.75, 0.15),
    new THREE.Vector3(0.35, 0.95, -0.10)
  ];
  const saTube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(saPoints), 16, 0.030, 10, false);

  return mergeGeometries([mainRCA, amTube, saTube]);
}

/**
 * Utility to merge multiple BufferGeometries into a single BufferGeometry
 */
function mergeGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  let totalVertices = 0;
  let totalIndices = 0;

  geometries.forEach(geo => {
    totalVertices += geo.attributes.position.count;
    if (geo.index) {
      totalIndices += geo.index.count;
    }
  });

  const mergedPos = new Float32Array(totalVertices * 3);
  const mergedNorm = new Float32Array(totalVertices * 3);
  const mergedUv = new Float32Array(totalVertices * 2);
  const mergedIndices = totalIndices > 0 ? new Uint32Array(totalIndices) : null;

  let vertOffset = 0;
  let indexOffset = 0;

  geometries.forEach(geo => {
    const pos = geo.attributes.position;
    const norm = geo.attributes.normal;
    const uv = geo.attributes.uv;
    const count = pos.count;

    mergedPos.set(pos.array, vertOffset * 3);
    if (norm) mergedNorm.set(norm.array, vertOffset * 3);
    if (uv) mergedUv.set(uv.array, vertOffset * 2);

    if (geo.index && mergedIndices) {
      for (let i = 0; i < geo.index.count; i++) {
        mergedIndices[indexOffset + i] = geo.index.getX(i) + vertOffset;
      }
      indexOffset += geo.index.count;
    }

    vertOffset += count;
  });

  const mergedGeo = new THREE.BufferGeometry();
  mergedGeo.setAttribute('position', new THREE.BufferAttribute(mergedPos, 3));
  mergedGeo.setAttribute('normal', new THREE.BufferAttribute(mergedNorm, 3));
  mergedGeo.setAttribute('uv', new THREE.BufferAttribute(mergedUv, 2));
  if (mergedIndices) {
    mergedGeo.setIndex(new THREE.BufferAttribute(mergedIndices, 1));
  }

  mergedGeo.computeVertexNormals();
  return mergedGeo;
}
