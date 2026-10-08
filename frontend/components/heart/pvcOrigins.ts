/**
 * Complete PVC Origin Clinical Data Store (23 Origins)
 * Sourced and aligned with pvc-heart-tool (https://github.com/karansuraj/pvc-heart-tool)
 */

export interface Reference {
  id: string;
  authors: string;
  title: string;
  journal: string;
  year: number;
  doi?: string;
  chapter?: string;
  relevance: string;
}

export interface PVCOrigin {
  id: string;
  name: string;
  fullName: string;
  category: 'RVOT' | 'Aortic Cusps' | 'Mitral Annulus' | 'Tricuspid Annulus' | 'LV Summit' | 'Papillary Muscles' | 'Conduction / Other';
  hotspotPosition: [number, number, number];
  hotspotColor: string;
  ecgFeatures: {
    axis: string;
    morphology: string;
    transition: string;
    otherFeatures: string[];
  };
  description: string;
  ablationApproach: string;
  differentialLocations: string[];
  prevalence: string;
  references: Reference[];
}

export const pvcOrigins: PVCOrigin[] = [
  // ─── 1. RVOT ───
  {
    id: "rvot-septal",
    name: "RVOT Septal",
    fullName: "Right Ventricular Outflow Tract — Septal",
    category: "RVOT",
    hotspotPosition: [0.2, 1.35, 0.55],
    hotspotColor: "#ff4444",
    ecgFeatures: {
      axis: "Inferior axis (tall R in II, III, aVF)",
      morphology: "LBBB pattern (QS or rS in V1)",
      transition: "Precordial transition at V3–V4",
      otherFeatures: [
        "R wave in V1 typically < 50% of QRS amplitude",
        "No Q waves in lead I",
        "QRS duration often < 140 ms",
        "R/S amplitude index in V1+V2 / V5+V6 < 0.3 favors RVOT over LVOT"
      ]
    },
    description: "The RVOT septum is the most common origin of idiopathic ventricular arrhythmias (~70% of outflow tract PVCs). Arises near the pulmonic valve along the interventricular septum.",
    ablationApproach: "Transvenous via right femoral vein into RVOT. Activation and pace mapping to earliest site. High success rate (>90%).",
    differentialLocations: ["rvot-freewall", "lvot-lcc", "lvot-rcc"],
    prevalence: "Most common (~70% of outflow tract PVCs)",
    references: []
  },
  {
    id: "rvot-freewall",
    name: "RVOT Free Wall",
    fullName: "Right Ventricular Outflow Tract — Free Wall",
    category: "RVOT",
    hotspotPosition: [0.55, 1.2, 0.7],
    hotspotColor: "#ff6644",
    ecgFeatures: {
      axis: "Inferior axis (tall R in II, III, aVF)",
      morphology: "LBBB pattern (QS or rS in V1)",
      transition: "Precordial transition at V4 or later",
      otherFeatures: [
        "Broader QRS duration compared to septal origin (>140 ms)",
        "Notching in downstroke of QRS in inferior leads"
      ]
    },
    description: "Originate from the anterior or lateral free wall of the RVOT. Broad QRS and late transition due to delayed activation reaching the septum.",
    ablationApproach: "Catheter deflected laterally/anteriorly in RVOT. Success rates ~80-85% with ICE guidance.",
    differentialLocations: ["rvot-septal", "tricuspid-anterior"],
    prevalence: "~20-30% of RVOT PVCs",
    references: []
  },
  {
    id: "rvot-anterior",
    name: "RVOT Anterior",
    fullName: "Right Ventricular Outflow Tract — Anterior Wall",
    category: "RVOT",
    hotspotPosition: [0.35, 1.4, 0.75],
    hotspotColor: "#fb7185",
    ecgFeatures: {
      axis: "Inferior axis (lead II > lead III)",
      morphology: "LBBB pattern (QS in V1)",
      transition: "V3–V4 transition",
      otherFeatures: ["Negative/isoelectric in aVL", "Broad initial r wave in V2"]
    },
    description: "Arises from the anterior aspect of the pulmonary infundibulum just below the pulmonic valve.",
    ablationApproach: "Approached directly in the high anterior infundibulum via right femoral vein.",
    differentialLocations: ["rvot-septal", "rvot-freewall"],
    prevalence: "~10% of RVOT PVCs",
    references: []
  },
  {
    id: "rvot-posterior",
    name: "RVOT Posterior",
    fullName: "Right Ventricular Outflow Tract — Posterior Wall",
    category: "RVOT",
    hotspotPosition: [0.15, 1.25, 0.35],
    hotspotColor: "#f43f5e",
    ecgFeatures: {
      axis: "Inferior axis (lead III > lead II)",
      morphology: "LBBB pattern with deep S in V1",
      transition: "V3 transition",
      otherFeatures: ["Positive T waves in inferior leads", "Lead I isoelectric or slightly negative"]
    },
    description: "Located posteriorly along the septal-aortic boundary.",
    ablationApproach: "Mapping along the posterior septum near the His recording site.",
    differentialLocations: ["rvot-septal", "lvot-rcc"],
    prevalence: "~15% of RVOT PVCs",
    references: []
  },

  // ─── 2. LVOT & AORTIC CUSPS ───
  {
    id: "lvot-lcc",
    name: "Left Coronary Cusp (LCC)",
    fullName: "Left Ventricular Outflow Tract — Left Coronary Cusp",
    category: "Aortic Cusps",
    hotspotPosition: [-0.15, 1.55, 0.25],
    hotspotColor: "#38bdf8",
    ecgFeatures: {
      axis: "Inferior axis (tall R in II, III, aVF)",
      morphology: "RBBB or multiphasic pattern in V1",
      transition: "Early precordial transition (V1–V2)",
      otherFeatures: ["Taller R wave in V1/V2 than RVOT origins", "R/S ratio > 1 in V1 or V2"]
    },
    description: "PVCs originating from myocardial extensions into the left coronary cusp of the aortic root.",
    ablationApproach: "Retrograde aortic approach. Coronary angiography mandatory to ensure >10mm clearance from left main ostium.",
    differentialLocations: ["lvot-rcc", "rvot-septal", "lv-summit-gcv"],
    prevalence: "~15-20% of outflow tract PVCs",
    references: []
  },
  {
    id: "lvot-rcc",
    name: "Right Coronary Cusp (RCC)",
    fullName: "Left Ventricular Outflow Tract — Right Coronary Cusp",
    category: "Aortic Cusps",
    hotspotPosition: [0.15, 1.55, 0.4],
    hotspotColor: "#60a5fa",
    ecgFeatures: {
      axis: "Inferior axis (tall R in II, III, aVF)",
      morphology: "LBBB or transitional pattern in V1",
      transition: "Early precordial transition (V1–V3)",
      otherFeatures: ["qR pattern in V1", "R wave in V1 smaller than LCC"]
    },
    description: "Most anterior aortic cusp, adjacent to RVOT septum. Mimics RVOT septal PVCs with earlier transition.",
    ablationApproach: "Retrograde aortic access with ICE monitoring and RCA ostium mapping.",
    differentialLocations: ["rvot-septal", "lvot-lcc", "his-bundle"],
    prevalence: "~10% of outflow tract PVCs",
    references: []
  },
  {
    id: "lvot-lcc-rcc",
    name: "LCC-RCC Junction / Commissure",
    fullName: "Aortic Cusp Commissure (LCC-RCC)",
    category: "Aortic Cusps",
    hotspotPosition: [0.0, 1.6, 0.35],
    hotspotColor: "#818cf8",
    ecgFeatures: {
      axis: "Inferior axis",
      morphology: "Intermediate LBBB/RBBB pattern",
      transition: "Precordial transition at V2–V3",
      otherFeatures: ["Characteristic pattern with combined lead I and aVL positivity"]
    },
    description: "Arises from the commissural ridge between the left and right coronary cusps.",
    ablationApproach: "Direct commissural mapping inside the aortic root.",
    differentialLocations: ["lvot-lcc", "lvot-rcc"],
    prevalence: "~5% of cusp arrhythmias",
    references: []
  },

  // ─── 3. MITRAL ANNULUS ───
  {
    id: "mitral-anterior",
    name: "Mitral Annulus (Anterior)",
    fullName: "Mitral Valve Annulus — Anterior",
    category: "Mitral Annulus",
    hotspotPosition: [-0.5, 0.85, 0.35],
    hotspotColor: "#34d399",
    ecgFeatures: {
      axis: "Superior axis (negative in II, III, aVF)",
      morphology: "RBBB pattern (R or Rs in V1)",
      transition: "Early precordial transition (V1–V2)",
      otherFeatures: ["Prominent R wave in V1", "Q waves in inferior leads"]
    },
    description: "Arises from the mitral-aortic continuity region along the fibrous anterior annulus.",
    ablationApproach: "Retrograde aortic or transseptal approach. Mapping along fibrous annulus.",
    differentialLocations: ["lvot-lcc", "lv-summit-gcv"],
    prevalence: "~5-8% of LV PVCs",
    references: []
  },
  {
    id: "mitral-posterior",
    name: "Mitral Annulus (Posterior)",
    fullName: "Mitral Valve Annulus — Posterior",
    category: "Mitral Annulus",
    hotspotPosition: [-0.45, 0.65, -0.2],
    hotspotColor: "#10b981",
    ecgFeatures: {
      axis: "Superior or horizontal axis",
      morphology: "RBBB pattern with positive concordant precordial leads",
      transition: "V1 transition",
      otherFeatures: ["Deep S in lead I", "Dominant R across all chest leads"]
    },
    description: "Originates from the posterior rim of the mitral valve ring.",
    ablationApproach: "Transseptal access or retrograde LV mapping along posterior annular shelf.",
    differentialLocations: ["mitral-lateral", "papillary-posteromedial"],
    prevalence: "~4% of LV PVCs",
    references: []
  },
  {
    id: "mitral-lateral",
    name: "Mitral Annulus (Lateral)",
    fullName: "Mitral Valve Annulus — Lateral / Free Wall",
    category: "Mitral Annulus",
    hotspotPosition: [-0.75, 0.75, 0.05],
    hotspotColor: "#059669",
    ecgFeatures: {
      axis: "Rightward or inferior axis",
      morphology: "RBBB pattern with tall R in V1",
      transition: "V1–V2 transition",
      otherFeatures: ["QS or rS in lead I and aVL", "Positive concordant precordial leads"]
    },
    description: "Located on the lateral free-wall aspect of the mitral annulus.",
    ablationApproach: "Transseptal approach with deflectable sheath stability against the lateral wall.",
    differentialLocations: ["mitral-posterior", "papillary-anterolateral"],
    prevalence: "~3% of LV PVCs",
    references: []
  },

  // ─── 4. TRICUSPID ANNULUS ───
  {
    id: "tricuspid-septal",
    name: "Tricuspid Annulus (Septal)",
    fullName: "Tricuspid Valve Annulus — Septal",
    category: "Tricuspid Annulus",
    hotspotPosition: [0.35, 0.75, 0.45],
    hotspotColor: "#fbbf24",
    ecgFeatures: {
      axis: "Superior or normal axis",
      morphology: "LBBB pattern in V1",
      transition: "Transition V3–V5",
      otherFeatures: ["QS pattern in V1", "Careful mapping needed near His bundle"]
    },
    description: "Arises from the septal aspect of the tricuspid valve ring in close proximity to the AV node.",
    ablationApproach: "Right atrial transvenous catheter mapping along septal ring with cryoablation or low-power RF.",
    differentialLocations: ["rvot-septal", "his-bundle"],
    prevalence: "~5% of RV PVCs",
    references: []
  },
  {
    id: "tricuspid-anterior",
    name: "Tricuspid Annulus (Anterior)",
    fullName: "Tricuspid Valve Annulus — Anterior Free Wall",
    category: "Tricuspid Annulus",
    hotspotPosition: [0.65, 0.75, 0.4],
    hotspotColor: "#f59e0b",
    ecgFeatures: {
      axis: "Inferior or leftward axis",
      morphology: "LBBB pattern (QS in V1)",
      transition: "Late transition (V4–V5)",
      otherFeatures: ["Broad QRS duration", "Positive in leads I and aVL"]
    },
    description: "Arises from the anterior free-wall portion of the tricuspid valve ring.",
    ablationApproach: "Right atrial approach using steerable sheath for free wall contact.",
    differentialLocations: ["rvot-freewall", "tricuspid-posterior"],
    prevalence: "~3% of RV PVCs",
    references: []
  },
  {
    id: "tricuspid-posterior",
    name: "Tricuspid Annulus (Posterior)",
    fullName: "Tricuspid Valve Annulus — Posterior / Inferior",
    category: "Tricuspid Annulus",
    hotspotPosition: [0.55, 0.55, -0.1],
    hotspotColor: "#d97706",
    ecgFeatures: {
      axis: "Superior axis (negative in II, III, aVF)",
      morphology: "LBBB pattern in V1",
      transition: "V3–V4 transition",
      otherFeatures: ["Deep QS in inferior leads", "Lead I positive"]
    },
    description: "Located on the inferior-posterior aspect of the tricuspid valve annulus.",
    ablationApproach: "Right atrial approach below the coronary sinus ostium.",
    differentialLocations: ["tricuspid-septal", "mitral-posterior"],
    prevalence: "~2% of RV PVCs",
    references: []
  },

  // ─── 5. LV SUMMIT & EPICARDIUM ───
  {
    id: "lv-summit-gcv",
    name: "LV Summit (GCV)",
    fullName: "Left Ventricular Summit — Great Cardiac Vein Junction",
    category: "LV Summit",
    hotspotPosition: [-0.35, 1.45, 0.15],
    hotspotColor: "#a855f7",
    ecgFeatures: {
      axis: "Inferior axis",
      morphology: "RBBB with pseudodelta wave",
      transition: "V1–V2 transition",
      otherFeatures: ["Broad QRS (>160ms)", "M-shaped R wave in V1", "High epicardial origin"]
    },
    description: "The most superior epicardial region of the LV, bounded by the LAD and circumflex arteries.",
    ablationApproach: "Coronary sinus / GCV venous mapping or epicardial pericardial access.",
    differentialLocations: ["lvot-lcc", "mitral-anterior", "lv-summit-aiv"],
    prevalence: "Uncommon (~3-5%), highly symptomatic",
    references: []
  },
  {
    id: "lv-summit-aiv",
    name: "LV Summit (AIV)",
    fullName: "Left Ventricular Summit — Anterior Interventricular Vein",
    category: "LV Summit",
    hotspotPosition: [-0.2, 1.4, 0.45],
    hotspotColor: "#c084fc",
    ecgFeatures: {
      axis: "Inferior axis with lead III > lead II",
      morphology: "LBBB with early transition or RBBB",
      transition: "V2–V3 transition",
      otherFeatures: ["Pseudodelta wave duration >34ms", "Intrinsicoid deflection >85ms"]
    },
    description: "Epicardial origin along the proximal anterior interventricular groove near the bifurcation.",
    ablationApproach: "Distal coronary venous system mapping within the AIV.",
    differentialLocations: ["lv-summit-gcv", "rvot-septal"],
    prevalence: "~2% of ventricular arrhythmias",
    references: []
  },

  // ─── 6. PAPILLARY MUSCLES ───
  {
    id: "papillary-anterolateral",
    name: "LV Papillary (Anterolateral)",
    fullName: "Left Ventricular Anterolateral Papillary Muscle",
    category: "Papillary Muscles",
    hotspotPosition: [-0.65, 0.15, 0.35],
    hotspotColor: "#ec4899",
    ecgFeatures: {
      axis: "Inferior or rightward axis",
      morphology: "RBBB pattern (qR or R in V1)",
      transition: "V1 transition",
      otherFeatures: ["Broad QRS with slurred onset", "Discordance between leads I and aVL"]
    },
    description: "Originates from the anterolateral papillary muscle body or base within the LV cavity.",
    ablationApproach: "Intracardiac echocardiography (ICE) guided retrograde or transseptal RF ablation with contact force sensing.",
    differentialLocations: ["papillary-posteromedial", "mitral-lateral"],
    prevalence: "~5% of non-outflow tract PVCs",
    references: []
  },
  {
    id: "papillary-posteromedial",
    name: "LV Papillary (Posteromedial)",
    fullName: "Left Ventricular Posteromedial Papillary Muscle",
    category: "Papillary Muscles",
    hotspotPosition: [-0.35, 0.05, -0.3],
    hotspotColor: "#db2777",
    ecgFeatures: {
      axis: "Superior axis (negative in II, III, aVF)",
      morphology: "RBBB pattern (tall R in V1)",
      transition: "V1 transition",
      otherFeatures: ["Deep S waves in II, III, aVF", "Lead I positive"]
    },
    description: "Originates from the posteromedial papillary muscle within the LV inferoseptal wall.",
    ablationApproach: "ICE-guided transseptal catheter manipulation with circular mapping around muscle base.",
    differentialLocations: ["papillary-anterolateral", "mitral-posterior"],
    prevalence: "~7% of non-outflow tract PVCs",
    references: []
  },
  {
    id: "papillary-rv-anterior",
    name: "RV Papillary (Anterior)",
    fullName: "Right Ventricular Anterior Papillary Muscle",
    category: "Papillary Muscles",
    hotspotPosition: [0.55, 0.2, 0.5],
    hotspotColor: "#f472b6",
    ecgFeatures: {
      axis: "Superior/leftward axis",
      morphology: "LBBB pattern in V1",
      transition: "Late precordial transition (V4–V5)",
      otherFeatures: ["Moderator band involvement common"]
    },
    description: "Arises from the large anterior papillary muscle of the RV and moderator band junction.",
    ablationApproach: "Right ventricular cavity mapping under ICE guidance.",
    differentialLocations: ["papillary-rv-septal", "rvot-freewall"],
    prevalence: "~3% of RV non-outflow PVCs",
    references: []
  },
  {
    id: "papillary-rv-posterior",
    name: "RV Papillary (Posterior)",
    fullName: "Right Ventricular Posterior Papillary Muscle",
    category: "Papillary Muscles",
    hotspotPosition: [0.45, 0.1, -0.15],
    hotspotColor: "#f43f5e",
    ecgFeatures: {
      axis: "Superior axis",
      morphology: "LBBB pattern",
      transition: "V4 transition",
      otherFeatures: ["QS in II, III, aVF"]
    },
    description: "Arises from the posterior papillary muscle attached to the RV inferior wall.",
    ablationApproach: "Right ventricular mapping targeting the posterior papillary insertion.",
    differentialLocations: ["papillary-rv-anterior", "tricuspid-posterior"],
    prevalence: "~2% of RV arrhythmias",
    references: []
  },
  {
    id: "papillary-rv-septal",
    name: "RV Papillary (Septal)",
    fullName: "Right Ventricular Septal Papillary Muscle / Lancisi",
    category: "Papillary Muscles",
    hotspotPosition: [0.25, 0.35, 0.2],
    hotspotColor: "#fb7185",
    ecgFeatures: {
      axis: "Inferior/normal axis",
      morphology: "LBBB pattern (narrower than free wall)",
      transition: "V3 transition",
      otherFeatures: ["Small r in V1"]
    },
    description: "Arises from the small medial/septal papillary muscle of the RV (muscle of Lancisi).",
    ablationApproach: "Careful RF mapping along mid-septum avoiding proximal conduction fibers.",
    differentialLocations: ["rvot-septal", "his-bundle"],
    prevalence: "~2% of RV arrhythmias",
    references: []
  },

  // ─── 7. CONDUCTION SYSTEM & OTHER ───
  {
    id: "his-bundle",
    name: "Para-Hisian / His Bundle",
    fullName: "Para-Hisian Region & Central Fibrous Body",
    category: "Conduction / Other",
    hotspotPosition: [0.1, 0.95, 0.2],
    hotspotColor: "#38bdf8",
    ecgFeatures: {
      axis: "Normal or inferior axis",
      morphology: "Narrow QRS LBBB or pseudo-normal QRS",
      transition: "V3 transition",
      otherFeatures: ["Narrowest QRS duration among all PVC origins (<120-130ms)"]
    },
    description: "Originates immediately adjacent to the His bundle at the central fibrous body.",
    ablationApproach: "Requires micro-mapping with high risk of complete heart block. Cryoablation strongly preferred over RF.",
    differentialLocations: ["rvot-septal", "lvot-rcc", "tricuspid-septal"],
    prevalence: "~2% of outflow tract arrhythmias",
    references: []
  },
  {
    id: "moderator-band",
    name: "RV Moderator Band",
    fullName: "Right Ventricular Moderator Band (Septomarginal Trabecula)",
    category: "Conduction / Other",
    hotspotPosition: [0.4, 0.15, 0.35],
    hotspotColor: "#e879f9",
    ecgFeatures: {
      axis: "Superior axis with leftward deviation",
      morphology: "LBBB pattern with delayed intrinsicoid deflection",
      transition: "Transition at V4",
      otherFeatures: ["Associated with adrenergic triggers and polymorphic VT/VF triggers"]
    },
    description: "Muscular band crossing from the interventricular septum to the anterior papillary muscle base.",
    ablationApproach: "ICE-guided ablation along the free-floating moderator band structure.",
    differentialLocations: ["papillary-rv-anterior", "rvot-freewall"],
    prevalence: "~2-3% of ventricular arrhythmias",
    references: []
  },
  {
    id: "crux-cordis",
    name: "Crux Cordis",
    fullName: "Crux Cordis / Basal Inferior Septum",
    category: "Conduction / Other",
    hotspotPosition: [0.0, 0.15, -0.45],
    hotspotColor: "#14b8a6",
    ecgFeatures: {
      axis: "Markedly superior axis",
      morphology: "LBBB or transitional morphology with QS in II, III, aVF",
      transition: "V3–V4 transition",
      otherFeatures: ["Deep S in inferior leads", "Positive in lead I"]
    },
    description: "The anatomical crux cordis where the coronary sulcus meets the posterior interventricular sulcus.",
    ablationApproach: "Coronary sinus / middle cardiac vein access or transvenous right/left basal septum.",
    differentialLocations: ["tricuspid-posterior", "mitral-posterior"],
    prevalence: "~1-2% of arrhythmias",
    references: []
  }
];
