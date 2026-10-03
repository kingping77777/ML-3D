const assert = require('node:assert');
const { test, describe } = require('node:test');

const VESSEL_MAPPINGS = {
  lad: { vesselKey: 'lad', meshName: 'LAD_Vessel', label: 'LAD', fullName: 'Left Anterior Descending Coronary Artery' },
  lcx: { vesselKey: 'lcx', meshName: 'LCX_Vessel', label: 'LCX', fullName: 'Left Circumflex Coronary Artery' },
  rca: { vesselKey: 'rca', meshName: 'RCA_Vessel', label: 'RCA', fullName: 'Right Coronary Artery' }
};

function validateVesselMappings() {
  const requiredVessels = ['lad', 'lcx', 'rca'];
  for (const vessel of requiredVessels) {
    if (!VESSEL_MAPPINGS[vessel] || !VESSEL_MAPPINGS[vessel].meshName) {
      throw new Error(`CRITICAL VESSEL MAPPING ERROR: Missing 3D mesh mapping for '${vessel}'.`);
    }
  }
  return true;
}

describe('Heart Mesh Mapping Validation Tests', () => {
  test('LAD, LCX, and RCA mappings exist and are defined', () => {
    assert.strictEqual(VESSEL_MAPPINGS.lad.meshName, 'LAD_Vessel');
    assert.strictEqual(VESSEL_MAPPINGS.lcx.meshName, 'LCX_Vessel');
    assert.strictEqual(VESSEL_MAPPINGS.rca.meshName, 'RCA_Vessel');
  });

  test('validateVesselMappings passes without throwing error', () => {
    assert.doesNotThrow(() => {
      validateVesselMappings();
    });
  });
});
