import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as THREE from '../frontend/node_modules/three/build/three.module.js';
import { GLTFExporter } from '../frontend/node_modules/three/examples/jsm/exporters/GLTFExporter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Scene
const scene = new THREE.Scene();

// 1. Heart Body (Myocardium - Ventricles + Atria)
const heartGeo = new THREE.SphereGeometry(1.2, 32, 32);
const pos = heartGeo.attributes.position;
for (let i = 0; i < pos.count; i++) {
    let x = pos.getX(i);
    let y = pos.getY(i);
    let z = pos.getZ(i);

    if (y < 0) {
        let factor = 1 + (y * 0.3);
        x *= Math.max(0.2, factor);
        z *= Math.max(0.2, factor);
    }
    if (x < 0) {
        x *= 1.15;
    }
    pos.setXYZ(i, x, y, z);
}
heartGeo.computeVertexNormals();

const heartMat = new THREE.MeshStandardMaterial({
    color: 0x8b2222,
    roughness: 0.5,
    metalness: 0.1,
    name: "Heart_Material"
});
const heartMesh = new THREE.Mesh(heartGeo, heartMat);
heartMesh.name = "Heart_Body";
scene.add(heartMesh);

// 2. Aorta (Arch)
const aortaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.2, 0.9, 0.1),
    new THREE.Vector3(-0.2, 1.7, 0.0),
    new THREE.Vector3(0.1, 2.0, -0.2),
    new THREE.Vector3(0.5, 1.8, -0.4),
    new THREE.Vector3(0.5, 1.0, -0.5)
]);
const aortaGeo = new THREE.TubeGeometry(aortaCurve, 32, 0.28, 16, false);
const aortaMat = new THREE.MeshStandardMaterial({
    color: 0xd9534f,
    roughness: 0.4,
    name: "Aorta_Material"
});
const aortaMesh = new THREE.Mesh(aortaGeo, aortaMat);
aortaMesh.name = "Aorta";
scene.add(aortaMesh);

// 3. Pulmonary Artery
const paCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.2, 0.8, 0.3),
    new THREE.Vector3(0.0, 1.4, 0.4),
    new THREE.Vector3(-0.3, 1.6, 0.1)
]);
const paGeo = new THREE.TubeGeometry(paCurve, 24, 0.22, 16, false);
const paMat = new THREE.MeshStandardMaterial({
    color: 0x428bca,
    roughness: 0.4,
    name: "PA_Material"
});
const paMesh = new THREE.Mesh(paGeo, paMat);
paMesh.name = "Pulmonary_Artery";
scene.add(paMesh);

// 4. LAD (Left Anterior Descending Coronary Artery)
const ladCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.35, 0.95, 0.85),
    new THREE.Vector3(-0.25, 0.4, 1.05),
    new THREE.Vector3(-0.15, -0.2, 0.95),
    new THREE.Vector3(-0.05, -0.8, 0.55),
    new THREE.Vector3(0.0, -1.15, 0.15)
]);
const ladGeo = new THREE.TubeGeometry(ladCurve, 40, 0.09, 12, false);
const ladMat = new THREE.MeshStandardMaterial({
    color: 0xff3333,
    roughness: 0.3,
    emissive: 0x330000,
    name: "LAD_Material"
});
const ladMesh = new THREE.Mesh(ladGeo, ladMat);
ladMesh.name = "LAD_Vessel";
scene.add(ladMesh);

// 5. LCX (Left Circumflex Coronary Artery)
const lcxCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.35, 0.95, 0.85),
    new THREE.Vector3(-0.75, 0.85, 0.65),
    new THREE.Vector3(-1.05, 0.6, 0.25),
    new THREE.Vector3(-1.15, 0.3, -0.25),
    new THREE.Vector3(-0.95, 0.0, -0.65)
]);
const lcxGeo = new THREE.TubeGeometry(lcxCurve, 40, 0.085, 12, false);
const lcxMat = new THREE.MeshStandardMaterial({
    color: 0xff3333,
    roughness: 0.3,
    emissive: 0x330000,
    name: "LCX_Material"
});
const lcxMesh = new THREE.Mesh(lcxGeo, lcxMat);
lcxMesh.name = "LCX_Vessel";
scene.add(lcxMesh);

// 6. RCA (Right Coronary Artery)
const rcaCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.35, 0.9, 0.85),
    new THREE.Vector3(0.75, 0.75, 0.75),
    new THREE.Vector3(1.05, 0.35, 0.45),
    new THREE.Vector3(1.0, -0.25, 0.15),
    new THREE.Vector3(0.6, -0.75, -0.25),
    new THREE.Vector3(0.1, -1.0, -0.45)
]);
const rcaGeo = new THREE.TubeGeometry(rcaCurve, 40, 0.09, 12, false);
const rcaMat = new THREE.MeshStandardMaterial({
    color: 0xff3333,
    roughness: 0.3,
    emissive: 0x330000,
    name: "RCA_Material"
});
const rcaMesh = new THREE.Mesh(rcaGeo, rcaMat);
rcaMesh.name = "RCA_Vessel";
scene.add(rcaMesh);

// Export to GLB
const exporter = new GLTFExporter();
exporter.parse(
    scene,
    function (gltf) {
        const outputDir = path.join(__dirname, '..', 'frontend', 'public', 'models');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        const outputPath = path.join(outputDir, 'heart.glb');
        fs.writeFileSync(outputPath, Buffer.from(gltf));
        console.log(`GLB anatomical model created successfully at ${outputPath}`);
        console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
    },
    function (error) {
        console.error('An error occurred during GLTF export:', error);
    },
    { binary: true }
);
