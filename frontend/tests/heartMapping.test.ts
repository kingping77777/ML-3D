import assert from 'node:assert';
import { test, describe } from 'node:test';
import { VESSEL_MAPPINGS, validateVesselMappings } from '../components/heart/heartMapping';

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
