import urllib.request
import json

BASE_URL = "http://localhost:8000"

def test_health():
    print("\n--- 1. Testing GET /api/v1/health ---")
    try:
        req = urllib.request.Request(f"{BASE_URL}/api/v1/health")
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print("Status Code: 200 OK")
            print("Response:", json.dumps(data, indent=2))
            return True
    except Exception as e:
        print("Health Check Failed:", e)
        return False

def test_case(name, patient_payload):
    print(f"\n--- Testing Case: {name} ---")
    url = f"{BASE_URL}/api/v1/analyze"
    req_data = json.dumps(patient_payload).encode('utf-8')
    req = urllib.request.Request(url, data=req_data, headers={'Content-Type': 'application/json'})
    
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print(f"Status Code: 200 OK")
            
            # Print Predictions Summary
            preds = data.get('predictions', {})
            print("Predictions Summary:")
            for target, p in preds.items():
                prob_pct = f"{p['probability']*100:.1f}%"
                status = "[ELEVATED RISK]" if p['predicted_class'] == 1 else "[NORMAL RISK]"
                print(f"  - {target.upper()}: {prob_pct} -> {status} (Threshold: {p['threshold']*100:.0f}%)")
            
            # Print Visualization Colors
            vis = data.get('visualization', {})
            print("3D Heart Visualization Colors:")
            for vessel, v in vis.items():
                print(f"  - {vessel.upper()}: Status={v['status']}, Color={v['color']}")
                
            # Print Top SHAP Attributions for CAD
            exp_cad = data.get('explanations', {}).get('cad', {})
            top_feats = exp_cad.get('top_features', [])[:3]
            print("Top SHAP Feature Attributions for CAD:")
            for feat in top_feats:
                print(f"  * #{feat['rank']} {feat['feature']}: SHAP={feat['shap_value']:+.4f} (Value: {feat['value']})")
                
            return data
    except Exception as e:
        print(f"Error testing case '{name}':", e)
        return None

if __name__ == '__main__':
    if test_health():
        # Case 1: Severe Triple-Vessel CAD
        severe_case = {
            "Age": 68, "Weight": 85, "Length": 170, "BMI": 29.41, "BP": 155, "PR": 82, "FBS": 165,
            "CR": 1.4, "TG": 240, "LDL": 160, "HDL": 32, "BUN": 22, "ESR": 35, "HB": 13.5, "K": 4.5,
            "Na": 138, "WBC": 9200, "Lymph": 25, "Neut": 68, "PLT": 280000, "EF-TTE": 42, "Sex": "Male",
            "Function Class": 2, "BBB": "N", "VHD": "N", "Obesity": 1, "CRF": 1, "CVA": 0,
            "Airway disease": 0, "Thyroid Disease": 0, "CHF": 0, "DLP": 1, "Weak Peripheral Pulse": 1,
            "Lung rales": 0, "Systolic Murmur": 1, "Diastolic Murmur": 0, "Dyspnea": 1, "Atypical": 0,
            "Nonanginal": 0, "LowTH Ang": 0, "LVH": 1, "Poor R Progression": 1, "DM": 1, "HTN": 1,
            "Current Smoker": 1, "EX-Smoker": 0, "FH": 1, "Edema": 0, "Typical Chest Pain": 1,
            "Q Wave": 1, "St Elevation": 0, "St Depression": 1, "Tinversion": 1, "Region RWMA": 1
        }
        test_case("Severe Triple-Vessel CAD", severe_case)
        
        # Case 2: Isolated Anterior LAD Stenosis
        lad_case = {
            "Age": 55, "Weight": 74, "Length": 172, "BMI": 25.01, "BP": 130, "PR": 72, "FBS": 110,
            "CR": 0.9, "TG": 150, "LDL": 120, "HDL": 42, "BUN": 15, "ESR": 14, "HB": 14.0, "K": 4.1,
            "Na": 140, "WBC": 6800, "Lymph": 30, "Neut": 60, "PLT": 220000, "EF-TTE": 50, "Sex": "Male",
            "Function Class": 1, "BBB": "N", "VHD": "N", "Obesity": 0, "CRF": 0, "CVA": 0,
            "Airway disease": 0, "Thyroid Disease": 0, "CHF": 0, "DLP": 0, "Weak Peripheral Pulse": 0,
            "Lung rales": 0, "Systolic Murmur": 0, "Diastolic Murmur": 0, "Dyspnea": 0, "Atypical": 0,
            "Nonanginal": 0, "LowTH Ang": 0, "LVH": 0, "Poor R Progression": 1, "DM": 0, "HTN": 1,
            "Current Smoker": 0, "EX-Smoker": 1, "FH": 1, "Edema": 0, "Typical Chest Pain": 1,
            "Q Wave": 0, "St Elevation": 0, "St Depression": 1, "Tinversion": 1, "Region RWMA": 0
        }
        test_case("Isolated Anterior LAD Stenosis", lad_case)
        
        # Case 3: Healthy / Low-Risk Case
        healthy_case = {
            "Age": 38, "Weight": 65, "Length": 175, "BMI": 21.22, "BP": 115, "PR": 65, "FBS": 85,
            "CR": 0.8, "TG": 90, "LDL": 85, "HDL": 60, "BUN": 12, "ESR": 8, "HB": 15.0, "K": 4.2,
            "Na": 142, "WBC": 5500, "Lymph": 35, "Neut": 55, "PLT": 210000, "EF-TTE": 65, "Sex": "Female",
            "Function Class": 0, "BBB": "N", "VHD": "N", "Obesity": 0, "CRF": 0, "CVA": 0,
            "Airway disease": 0, "Thyroid Disease": 0, "CHF": 0, "DLP": 0, "Weak Peripheral Pulse": 0,
            "Lung rales": 0, "Systolic Murmur": 0, "Diastolic Murmur": 0, "Dyspnea": 0, "Atypical": 0,
            "Nonanginal": 0, "LowTH Ang": 0, "LVH": 0, "Poor R Progression": 0, "DM": 0, "HTN": 0,
            "Current Smoker": 0, "EX-Smoker": 0, "FH": 0, "Edema": 0, "Typical Chest Pain": 0,
            "Q Wave": 0, "St Elevation": 0, "St Depression": 0, "Tinversion": 0, "Region RWMA": 0
        }
        test_case("Healthy / Low-Risk Case", healthy_case)
