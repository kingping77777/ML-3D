import { VesselName } from '../../types/predictions';

export interface VesselMappingConfig {
  vesselKey: VesselName;
  meshName: string;
  label: string;
  fullName: string;
  description: string;
  defaultColor: string;
  elevatedRiskColor: string;
  normalRiskColor: string;
}

export const VESSEL_MAPPINGS: Record<VesselName, VesselMappingConfig> = {
  lad: {
    vesselKey: 'lad',
    meshName: 'LAD_Vessel',
    label: 'LAD',
    fullName: 'Left Anterior Descending Coronary Artery',
    description: 'Supplies blood to the anterior wall of the left ventricle and anterior septum.',
    defaultColor: '#e11d48',
    elevatedRiskColor: '#f43f5e', // Vibrant red/crimson
    normalRiskColor: '#10b981'   // Emerald green
  },
  lcx: {
    vesselKey: 'lcx',
    meshName: 'LCX_Vessel',
    label: 'LCX',
    fullName: 'Left Circumflex Coronary Artery',
    description: 'Supplies blood to the lateral and posterior walls of the left ventricle.',
    defaultColor: '#e11d48',
    elevatedRiskColor: '#f43f5e',
    normalRiskColor: '#10b981'
  },
  rca: {
    vesselKey: 'rca',
    meshName: 'RCA_Vessel',
    label: 'RCA',
    fullName: 'Right Coronary Artery',
    description: 'Supplies blood to the right ventricle, inferior wall, and sinoatrial node.',
    defaultColor: '#e11d48',
    elevatedRiskColor: '#f43f5e',
    normalRiskColor: '#10b981'
  }
};

/**
 * Validates that all required coronary vessel mappings exist at runtime.
 * Throws an error in development if mapping is incomplete.
 */
export function validateVesselMappings(): boolean {
  const requiredVessels: VesselName[] = ['lad', 'lcx', 'rca'];
  for (const vessel of requiredVessels) {
    if (!VESSEL_MAPPINGS[vessel] || !VESSEL_MAPPINGS[vessel].meshName) {
      throw new Error(`CRITICAL VESSEL MAPPING ERROR: Missing 3D mesh mapping for '${vessel}'.`);
    }
  }
  return true;
}

// Execute runtime validation
if (process.env.NODE_ENV !== 'production') {
  validateVesselMappings();
}
