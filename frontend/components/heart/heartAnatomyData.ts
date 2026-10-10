export interface HeartAnatomicalPart {
  id: string;
  name: string;
  category: 'Coronary Arteries' | 'Cardiac Chambers' | 'Great Vessels' | 'Apex & Conduction';
  tag: string;
  icon: string;
  color: string;
  position3D: [number, number, number];
  cameraPosition: [number, number, number];
  azimuthalAngle: number;
  polarAngle: number;
  anatomicalLocation: string;
  physiologicalFunction: string;
  associatedPathology: {
    diseaseName: string;
    description: string;
    clinicalExample: string;
  };
  howToCure: {
    medicalManagement: string[];
    surgicalInterventions: string[];
    lifestyleAndPrevention: string[];
    emergencyProtocol: string;
  };
}

export const HEART_ANATOMICAL_PARTS: HeartAnatomicalPart[] = [
  {
    id: 'aorta',
    name: 'Aorta (Ascending Aorta & Arch)',
    category: 'Great Vessels',
    tag: 'Primary Systemic Trunk',
    icon: '🩸',
    color: '#ef4444',
    position3D: [0.08, 0.95, -0.05],
    cameraPosition: [0, 1.2, 3.2],
    azimuthalAngle: 0,
    polarAngle: Math.PI / 2.2,
    anatomicalLocation: 'Originates directly from the left ventricle, curving superiorly into the aortic arch and descending through the thorax.',
    physiologicalFunction: 'The body\'s primary systemic conduit, distributing high-pressure oxygen-rich blood under 120 mmHg systolic pressure to the brain, coronary tree, and peripheral organs.',
    associatedPathology: {
      diseaseName: 'Aortic Stenosis, Aortic Dissection & Atherosclerosis Plaque',
      description: 'Calcification and stiffening of aortic root restricts stroke volume. Plaque build-up can cause aneurysms or catastrophic intimal tearing (aortic dissection).',
      clinicalExample: 'Example: Severe aortic valve stenosis causing exertional syncope (fainting), angina during walking, and a harsh crescendo-decrescendo systolic murmur heard over the right second intercostal space.'
    },
    howToCure: {
      medicalManagement: [
        'Strict Blood Pressure Reduction: Beta-blockers (Esmolol, Labetalol) to lower dP/dt shear stress on aortic wall.',
        'Lipid Lowering: High-intensity statins (Atorvastatin 80mg) to prevent further atheroma calcification.',
        'Antihypertensive ARBs: Losartan/Valsartan to reduce aortic wall dilation.'
      ],
      surgicalInterventions: [
        'Transcatheter Aortic Valve Replacement (TAVR): Minimally invasive catheter deployment of artificial valve.',
        'Surgical Aortic Root / Arch Replacement (Bentall Procedure): Synthetic Dacron graft replacement of damaged ascending aorta.',
        'Endovascular Aneurysm Repair (EVAR/TEVAR): Stent-graft placement to exclude thoracic aortic aneurysms.'
      ],
      lifestyleAndPrevention: [
        'Strict sodium restriction (<1,500 mg/day) to maintain systolic BP < 125 mmHg.',
        'Avoid heavy isometric straining (e.g. heavy powerlifting) to avoid acute intra-aortic pressure spikes.',
        'Annual Echocardiogram and CT Angiography to monitor aortic root diameter.'
      ],
      emergencyProtocol: 'Sudden tearing chest/back pain radiating between shoulder blades requires immediate emergency CTA and cardiothoracic surgical transfer for dissection.'
    }
  },
  {
    id: 'pulmonary_trunk',
    name: 'Pulmonary Artery & Trunk',
    category: 'Great Vessels',
    tag: 'Pulmonary Conduit',
    icon: '🫁',
    color: '#38bdf8',
    position3D: [-0.25, 0.75, 0.35],
    cameraPosition: [-0.8, 0.8, 3.2],
    azimuthalAngle: -Math.PI * 0.25,
    polarAngle: Math.PI / 2.2,
    anatomicalLocation: 'Arises from the right ventricular outflow tract (RVOT) anterior to the ascending aorta, branching into the right and left pulmonary arteries.',
    physiologicalFunction: 'Transports deoxygenated venous blood from the right ventricle into the pulmonary alveolar capillary bed for carbon dioxide release and oxygen uptake.',
    associatedPathology: {
      diseaseName: 'Pulmonary Arterial Hypertension (PAH) & Pulmonary Embolism (PE)',
      description: 'Elevated pulmonary vascular resistance strains right ventricle. Deep vein thrombosis (DVT) clots can dislodge and occlude the pulmonary trunk (saddle embolism).',
      clinicalExample: 'Example: Acute saddle pulmonary embolism causing sudden-onset dyspnea, pleuritic chest pain, sinus tachycardia (S1Q3T3 on ECG), and acute right ventricular strain.'
    },
    howToCure: {
      medicalManagement: [
        'Anticoagulation: Direct Oral Anticoagulants (Apixaban, Rivaroxaban) or IV Heparin to dissolve clot progression.',
        'PAH Vasodilators: Phosphodiesterase-5 inhibitors (Sildenafil, Tadalafil) and Endothelin receptor antagonists (Bosentan).',
        'Inhaled Nitric Oxide / Prostacyclins: Lowers acute pulmonary artery pressures.'
      ],
      surgicalInterventions: [
        'Catheter-Directed Thrombolysis (CDT): Ultrasound-assisted targeted fibrinolysis directly inside pulmonary arteries.',
        'Surgical Pulmonary Embolectomy: Emergent open-chest clot extraction in hemodynamically unstable massive PE.',
        'Balloon Pulmonary Angioplasty (BPA): For chronic thromboembolic pulmonary hypertension (CTEPH).'
      ],
      lifestyleAndPrevention: [
        'Frequent leg mobility and compression stockings during prolonged immobility or long flights.',
        'Supervised pulmonary rehabilitation exercise with continuous pulse oximetry.',
        'Strict fluid and salt control to reduce right ventricular preload.'
      ],
      emergencyProtocol: 'Sudden acute dyspnea, hemoptysis (coughing blood), or fainting requires urgent CTA Pulmonary Angiogram and ICU thrombolysis.'
    }
  },
  {
    id: 'lad',
    name: 'Left Anterior Descending Artery (LAD)',
    category: 'Coronary Arteries',
    tag: '"The Widow Maker"',
    icon: '⚡',
    color: '#ef4444',
    position3D: [0.05, 0.05, 0.7],
    cameraPosition: [0, 0, 3.0],
    azimuthalAngle: 0,
    polarAngle: Math.PI / 2,
    anatomicalLocation: 'Travels down the anterior interventricular groove from the left main coronary artery toward the cardiac apex.',
    physiologicalFunction: 'Supplies 45%–55% of total left ventricular myocardium, including the critical anterior wall, anterior 2/3 of interventricular septum, and apex.',
    associatedPathology: {
      diseaseName: 'LAD Stenosis & Anterior Wall STEMI / Ischemia',
      description: 'Atheroma rupture causes acute anterior wall necrosis. Severely impairs left ventricular stroke volume and causes acute cardiogenic shock.',
      clinicalExample: 'Example: 90% proximal LAD stenosis causing exertional retrosternal crushing pressure, diaphoresis, and ST-segment elevations across precordial leads V1-V4.'
    },
    howToCure: {
      medicalManagement: [
        'Dual Antiplatelet Therapy (DAPT): Aspirin 81mg + Ticagrelor/Clopidogrel to prevent in-stent thrombosis.',
        'High-Intensity Statin: Rosuvastatin 40mg or Atorvastatin 80mg to stabilize plaque cap.',
        'Cardioselective Beta-Blockers: Metoprolol Succinate to decrease myocardial oxygen demand.',
        'ACE Inhibitors / ARBs: Ramipril/Valsartan to suppress post-infarction LV remodeling.'
      ],
      surgicalInterventions: [
        'Percutaneous Coronary Intervention (PCI): Balloon angioplasty with second-generation drug-eluting stent (DES) placement in the LAD.',
        'Coronary Artery Bypass Grafting (CABG): Left Internal Mammary Artery (LIMA) to LAD bypass (the gold-standard durable revascularization).'
      ],
      lifestyleAndPrevention: [
        'Total elimination of all tobacco/vaping products to restore endothelial nitric oxide synthesis.',
        'Mediterranean diet with <7% saturated fat intake and high omega-3 fatty acids.',
        'Target LDL cholesterol < 55 mg/dL for secondary prevention.'
      ],
      emergencyProtocol: 'Crushing anterior chest tightness radiating to left shoulder/jaw requires calling 911 immediately for emergency catheterization lab activation.'
    }
  },
  {
    id: 'lcx',
    name: 'Left Circumflex Artery (LCX)',
    category: 'Coronary Arteries',
    tag: 'Lateral Wall Supply',
    icon: '🌊',
    color: '#38bdf8',
    position3D: [-0.7, 0.2, 0.2],
    cameraPosition: [-2.5, 0.4, 2.0],
    azimuthalAngle: -Math.PI * 0.4,
    polarAngle: Math.PI / 2,
    anatomicalLocation: 'Branches from the Left Main coronary artery at a 90° angle, running along the left atrioventricular groove around to the posterior heart surface.',
    physiologicalFunction: 'Supplies blood to the posterolateral left ventricle, left atrium, and in 10%–15% of individuals (left-dominant circulation), the posterior descending artery (PDA).',
    associatedPathology: {
      diseaseName: 'LCX Occlusion, Lateral Ischemia & Papillary Muscle Dysfunction',
      description: 'Obstruction leads to lateral left ventricular ischemia, which can cause acute mitral valve regurgitation if the anterolateral papillary muscle is compromised.',
      clinicalExample: 'Example: Subtotal LCX occlusion presenting as left flank/shoulder pain with ST-depression in lateral ECG leads I, aVL, V5, and V6.'
    },
    howToCure: {
      medicalManagement: [
        'Antianginal Nitrates: Sublingual Nitroglycerin or Isosorbide Mononitrate to reduce left ventricular preload and induce coronary vasodilation.',
        'Calcium Channel Blockers: Diltiazem or Amlodipine for coronary antispasmodic effect.',
        'Targeted Statin & Antiplatelet Therapy.'
      ],
      surgicalInterventions: [
        'PCI Stenting of LCX and Obtuse Marginal (OM1/OM2) branches.',
        'CABG Grafting utilizing the Radial Artery or Saphenous Vein graft to the circumflex marginal branches.'
      ],
      lifestyleAndPrevention: [
        '150 minutes/week moderate-intensity aerobic training to promote collateral vessel formation.',
        'Glycemic control targeting HbA1c < 6.5% to halt microvascular coronary disease.',
        'Stress reduction and cortisol management via mindfulness and sleep optimization.'
      ],
      emergencyProtocol: 'Back or lateral chest tightness with unexplained nausea and diaphoresis warrants emergency ECG and serial cardiac troponin testing.'
    }
  },
  {
    id: 'rca',
    name: 'Right Coronary Artery (RCA)',
    category: 'Coronary Arteries',
    tag: 'Inferior & Pacemaker Supply',
    icon: '🔋',
    color: '#f59e0b',
    position3D: [0.65, 0.1, 0.35],
    cameraPosition: [2.5, 0.3, 2.0],
    azimuthalAngle: Math.PI * 0.4,
    polarAngle: Math.PI / 2,
    anatomicalLocation: 'Originates from the right aortic sinus of Valsalva, coursing down the right coronary sulcus to the crux of the heart.',
    physiologicalFunction: 'Supplies the right ventricle, inferior wall of left ventricle, posterior third of septum, Sinoatrial (SA) node in 60% of people, and AV node in 90% of people.',
    associatedPathology: {
      diseaseName: 'Inferior STEMI, Sinus Bradycardia & AV Conduction Blocks',
      description: 'Acute RCA occlusion causes inferior wall infarction and frequently triggers severe electrical conduction disturbances like complete 3rd-degree heart block or sinus arrest.',
      clinicalExample: 'Example: Proximal RCA occlusion causing severe epigastric burning, nausea, profound bradycardia (HR: 36 bpm), and ST-elevation in inferior leads II, III, and aVF.'
    },
    howToCure: {
      medicalManagement: [
        'IV Atropine (0.5–1.0mg) to reverse acute vagal tone and nodal bradycardia during inferior ischemia.',
        'Judicious IV Normal Saline volume resuscitation (avoid nitrates in isolated RV infarction).',
        'Standard post-revascularization DAPT and high-potency statin regimen.'
      ],
      surgicalInterventions: [
        'Primary Angioplasty & Drug-Eluting Stent (DES) to the proximal/mid RCA and Posterior Descending Artery (PDA).',
        'Temporary Transvenous Pacemaker insertion in cases of high-grade refractory AV block.',
        'Right Internal Mammary Artery (RIMA) or Saphenous Vein CABG bypass.'
      ],
      lifestyleAndPrevention: [
        'Management of metabolic syndrome and triglyceride reduction (<150 mg/dL).',
        'Weight loss of 5%–10% of total body weight to lower systemic vascular inflammation.',
        'Regular blood pressure monitoring targeting <130/80 mmHg.'
      ],
      emergencyProtocol: 'Inferior chest pain accompanied by profound dizziness or heart rate dropping below 45 bpm warrants urgent 12-lead ECG including right-sided leads (V4R).'
    }
  },
  {
    id: 'left_ventricle',
    name: 'Left Ventricle (LV)',
    category: 'Cardiac Chambers',
    tag: 'Primary Systemic Pump',
    icon: '🫀',
    color: '#ec4899',
    position3D: [-0.4, -0.4, 0.5],
    cameraPosition: [-1.8, -0.4, 2.6],
    azimuthalAngle: -Math.PI * 0.25,
    polarAngle: Math.PI / 1.8,
    anatomicalLocation: 'Forms the apex, diaphragmatic surface, and major part of the sternocostal surface of the heart with thick 8–12mm myocardium.',
    physiologicalFunction: 'Generates powerful systolic pressure (100–140 mmHg) to pump 60–100 mL of oxygenated blood per beat (stroke volume) through the aortic valve into the systemic body.',
    associatedPathology: {
      diseaseName: 'Left Ventricular Hypertrophy (LVH) & Systolic Heart Failure (HFrEF)',
      description: 'Chronic high BP causes concentric thickening and fibrosis. Ischemia or infarction causes dead scar tissue, dropping Ejection Fraction (EF_TTE < 40%).',
      clinicalExample: 'Example: Hypertensive heart disease leading to LV dilatation, reduced EF_TTE of 32%, paroxysmal nocturnal dyspnea, and bilateral lung base crackles.'
    },
    howToCure: {
      medicalManagement: [
        'Quadruple Guideline-Directed Medical Therapy (GDMT):',
        '1. ARNI (Sacubitril/Valsartan) — reduces cardiac strain and hospitalizations by 20%.',
        '2. Beta-Blockers (Carvedilol or Metoprolol Succinate) — reverses myocardial remodeling.',
        '3. Mineralocorticoid Antagonists (Spironolactone/Eplerenone) — prevents myocardial fibrosis.',
        '4. SGLT2 Inhibitors (Dapagliflozin / Empagliflozin) — improves myocardial cellular energetics.'
      ],
      surgicalInterventions: [
        'Implantable Cardioverter Defibrillator (ICD) / Cardiac Resynchronization Therapy (CRT-D) for EF < 35%.',
        'Left Ventricular Assist Device (LVAD): Mechanical circulatory pump for end-stage refractory heart failure.',
        'Orthotopic Heart Transplantation.'
      ],
      lifestyleAndPrevention: [
        'Daily morning weights with strict fluid intake limits (1.5–2.0 L/day in heart failure).',
        'Sodium restriction < 2,000 mg/day to eliminate fluid retention.',
        'Supervised cardiac rehabilitation exercise 3–5 times weekly.'
      ],
      emergencyProtocol: 'Acute pulmonary edema (worsening breathlessness when lying flat, frothy pink sputum) requires immediate IV Furosemide and emergency room care.'
    }
  },
  {
    id: 'right_ventricle',
    name: 'Right Ventricle (RV)',
    category: 'Cardiac Chambers',
    tag: 'Pulmonary Pumping Chamber',
    icon: '🛡️',
    color: '#06b6d4',
    position3D: [0.45, -0.3, 0.5],
    cameraPosition: [1.8, -0.3, 2.6],
    azimuthalAngle: Math.PI * 0.25,
    polarAngle: Math.PI / 1.8,
    anatomicalLocation: 'Triangular crescent-shaped chamber anterior to the left ventricle, wrapping around the interventricular septum.',
    physiologicalFunction: 'Pumps low-pressure (15–25 mmHg systolic) venous blood through the pulmonary semilunar valve into the low-resistance pulmonary vascular network.',
    associatedPathology: {
      diseaseName: 'Right Ventricular Failure, Cor Pulmonale & RV Infarction',
      description: 'Volume or pressure overload from pulmonary disease causes chamber dilatation, tricuspid regurgitation, and systemic venous backup.',
      clinicalExample: 'Example: Severe chronic obstructive pulmonary disease (COPD) causing Cor Pulmonale with prominent jugular venous distension (JVD) and 3+ bilateral pitting pedal edema.'
    },
    howToCure: {
      medicalManagement: [
        'Loop Diuretics (Furosemide, Bumetanide) with Metolazone for gentle preload optimization.',
        'Specific pulmonary vasodilators to lower right ventricular afterload.',
        'Inotropic support (Milrinone / Dobutamine) in acute right ventricular cardiogenic shock.'
      ],
      surgicalInterventions: [
        'Tricuspid Valve Repair / Replacement (Annuloplasty ring) for severe secondary functional regurgitation.',
        'Right Ventricular Mechanical Support (RVAD / Impella RP) in refractory shock.',
        'Pulmonary endarterectomy for chronic thromboembolic disease.'
      ],
      lifestyleAndPrevention: [
        'Supplemental nocturnal oxygen therapy to prevent hypoxemic pulmonary vasoconstriction.',
        'Low-sodium nutrition and daily ankle edema tracking.',
        'Smoking cessation to halt COPD/emphysema progression.'
      ],
      emergencyProtocol: 'Rapid abdominal swelling, dizziness, and low systolic BP with elevated neck veins requires immediate clinical fluid balancing and RV ultrasound.'
    }
  },
  {
    id: 'left_atrium',
    name: 'Left Atrium (LA)',
    category: 'Cardiac Chambers',
    tag: 'Pulmonary Venous Collector',
    icon: '✨',
    color: '#a855f7',
    position3D: [-0.5, 0.45, -0.4],
    cameraPosition: [-2.0, 1.0, -2.0],
    azimuthalAngle: -Math.PI * 0.75,
    polarAngle: Math.PI / 2.2,
    anatomicalLocation: 'Forms the posterior base of the heart, receiving the four pulmonary veins (two left, two right) on its posterolateral wall.',
    physiologicalFunction: 'Acts as an elastic reservoir and booster pump ("atrial kick" contributing 20%–30% of LV filling) delivering oxygenated blood across the mitral valve into the left ventricle.',
    associatedPathology: {
      diseaseName: 'Atrial Fibrillation (AFib), LA Dilation & Thromboembolism',
      description: 'Elevated LV filling pressure enlarges the LA, triggering chaotic electrical micro-reentry circuits (AFib). Stagnant blood inside the Left Atrial Appendage (LAA) forms stroke-causing clots.',
      clinicalExample: 'Example: Paroxysmal Atrial Fibrillation with rapid ventricular response (HR 145 bpm) causing fluttering palpitations, fatigue, and high risk of cardioembolic ischemic stroke.'
    },
    howToCure: {
      medicalManagement: [
        'Oral Anticoagulation (DOACs: Apixaban 5mg BID or Rivaroxaban 20mg daily) based on CHA2DS2-VASc score.',
        'Rate Control: Beta-blockers (Bisoprolol) or Non-dihydropyridine CCBs (Diltiazem).',
        'Rhythm Control Antiarrhythmics: Flecainide, Propafenone, or Amiodarone.'
      ],
      surgicalInterventions: [
        'Radiofrequency / Cryoballoon Pulmonary Vein Isolation (PVI Catheter Ablation) to electrically isolate ectopic triggers.',
        'Left Atrial Appendage Closure (Watchman Device / Amulet) for patients with high bleeding risks contraindicating long-term blood thinners.',
        'Surgical Maze Procedure during concomitant cardiac surgery.'
      ],
      lifestyleAndPrevention: [
        'Elimination of alcohol and high caffeine intake (common AFib triggers).',
        'Diagnosis and CPAP treatment of Obstructive Sleep Apnea (OSA).',
        'Weight loss and aerobic exercise to reduce left atrial wall stretch.'
      ],
      emergencyProtocol: 'Sudden rapid chaotic heartbeat (>150 bpm) with chest tightness or signs of stroke (facial droop, arm weakness, slurred speech) requires immediate 911 dispatch.'
    }
  },
  {
    id: 'right_atrium',
    name: 'Right Atrium (RA) & Vena Cava',
    category: 'Cardiac Chambers',
    tag: 'Venous Return & SA Pacemaker',
    icon: '🪫',
    color: '#eab308',
    position3D: [0.75, 0.45, -0.1],
    cameraPosition: [2.2, 0.8, -1.5],
    azimuthalAngle: Math.PI * 0.75,
    polarAngle: Math.PI / 2.2,
    anatomicalLocation: 'Forms the right border of the heart, receiving the Superior Vena Cava (SVC) superiorly and Inferior Vena Cava (IVC) and coronary sinus inferiorly.',
    physiologicalFunction: 'Collects systemic deoxygenated blood and houses the Sinoatrial (SA) Node — the heart\'s primary natural electrical pacemaker generating spontaneous action potentials at 60–100 bpm.',
    associatedPathology: {
      diseaseName: 'Sick Sinus Syndrome (SSS), Atrial Flutter & Atrial Septal Defect',
      description: 'Fibrosis of the SA node leads to alternating bradycardia and tachycardia (tachy-brady syndrome). Congenital ASD allows oxygenated blood to shunt from left to right.',
      clinicalExample: 'Example: Sick Sinus Syndrome in an elderly patient experiencing sudden 4-second sinus pauses, dizzy spells, and intermittent episodes of atrial flutter.'
    },
    howToCure: {
      medicalManagement: [
        'Discontinuation of nodal-blocking drugs (excessive beta-blockers, digoxin).',
        'Anticoagulation for atrial flutter according to clinical thromboembolic risk.'
      ],
      surgicalInterventions: [
        'Permanent Dual-Chamber Pacemaker (PPM) implantation (DDDR mode) to maintain minimum physiological heart rate.',
        'Cavotricuspid Isthmus (CTI) Catheter Ablation for typical right atrial flutter (cure rate > 95%).',
        'Percutaneous ASD Closure using an Amplatzer septal occluder umbrella.'
      ],
      lifestyleAndPrevention: [
        'Electrolyte balance monitoring (maintaining serum Potassium 4.0–4.5 mEq/L and Magnesium > 2.0 mg/dL).',
        'Hydration maintenance to ensure adequate right atrial venous return.',
        'Regular annual pacemaker interrogation and battery life checks.'
      ],
      emergencyProtocol: 'Recurrent syncope (blacking out without warning) or prolonged pulse pauses require immediate cardiac telemetry monitoring.'
    }
  },
  {
    id: 'cardiac_apex',
    name: 'Cardiac Apex',
    category: 'Apex & Conduction',
    tag: 'Tip of the Heart',
    icon: '🎯',
    color: '#10b981',
    position3D: [-0.2, -0.85, 0.5],
    cameraPosition: [-0.5, -1.5, 2.5],
    azimuthalAngle: -Math.PI * 0.1,
    polarAngle: Math.PI / 1.5,
    anatomicalLocation: 'The inferolateral tip of the heart, located in the fifth left intercostal space along the midclavicular line (point of maximal impulse, PMI).',
    physiologicalFunction: 'Coordinates the torsional "wringing" contraction motion of the left ventricle during systole, maximizing ejection efficiency like wringing water out of a towel.',
    associatedPathology: {
      diseaseName: 'Apical Aneurysm, Takotsubo Cardiomyopathy & Apical HCM',
      description: 'Transmural infarction weakens apex leading to thin-walled bulging aneurysms and stagnant apical thrombi. Intense emotional stress causes acute apical ballooning (Takotsubo / "Broken Heart Syndrome").',
      clinicalExample: 'Example: Post-anterior MI apical aneurysm with persistent ST elevation in precordial leads and an echocardiogram showing an echo-dense apical mural thrombus.'
    },
    howToCure: {
      medicalManagement: [
        'Therapeutic Anticoagulation (Warfarin / DOACs for minimum 3–6 months) to completely dissolve and prevent apical mural thrombi.',
        'Beta-Blockers and ACE Inhibitors to reduce apical wall tensile stress and reverse Takotsubo ballooning.',
        'Verapamil or Diltiazem for apical hypertrophic cardiomyopathy (Yamaguchi syndrome).'
      ],
      surgicalInterventions: [
        'Surgical Left Ventricular Reconstruction / Aneurysmectomy (Dor Procedure) to resect akinetic scar and restore elliptical LV geometry.',
        'Transapical TAVR or apical cannulation for mechanical circulatory support.'
      ],
      lifestyleAndPrevention: [
        'Avoidance of acute severe emotional and physiological stressors.',
        'Serial echocardiographic monitoring of apical wall motion and resolution of thrombi.',
        'Cardiac MRI (CMR) with late gadolinium enhancement to assess apical myocardial viability.'
      ],
      emergencyProtocol: 'Sudden chest pain following acute emotional shock with ECG changes mimicking anterior STEMI requires emergent catheterization to rule out acute plaque rupture.'
    }
  }
];
