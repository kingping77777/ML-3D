const fs = require('fs');
const path = require('path');

function createSphere(radius = 1.0, latSegments = 16, lonSegments = 16, color = [0.55, 0.13, 0.13, 1.0], taperY = true) {
    const positions = [];
    const normals = [];
    const indices = [];

    for (let i = 0; i <= latSegments; i++) {
        const lat = Math.PI * (i / latSegments - 0.5);
        const sinLat = Math.sin(lat);
        const cosLat = Math.cos(lat);

        for (let j = 0; j <= lonSegments; j++) {
            const lon = 2 * Math.PI * (j / lonSegments);
            const sinLon = Math.sin(lon);
            const cosLon = Math.cos(lon);

            const x = cosLat * cosLon;
            const y = sinLat;
            const z = cosLat * sinLon;

            let px = x * radius;
            let py = y * radius;
            let pz = z * radius;

            if (taperY && py < 0) {
                const factor = 1.0 + (py / radius) * 0.35;
                px *= Math.max(0.2, factor);
                pz *= Math.max(0.2, factor);
                if (px < 0) px *= 1.15;
            }

            positions.push(px, py, pz);
            normals.push(x, y, z);
        }
    }

    for (let i = 0; i < latSegments; i++) {
        for (let j = 0; j < lonSegments; j++) {
            const first = i * (lonSegments + 1) + j;
            const second = first + lonSegments + 1;
            indices.push(first, second, first + 1);
            indices.push(second, second + 1, first + 1);
        }
    }

    return { positions, normals, indices, color };
}

function createTube(curvePoints, radius = 0.08, sides = 12, color = [1.0, 0.2, 0.2, 1.0]) {
    const positions = [];
    const normals = [];
    const indices = [];

    const numPoints = curvePoints.length;
    for (let i = 0; i < numPoints; i++) {
        const pt = curvePoints[i];
        let tangent;
        if (i === 0) {
            tangent = [curvePoints[1][0] - pt[0], curvePoints[1][1] - pt[1], curvePoints[1][2] - pt[2]];
        } else if (i === numPoints - 1) {
            tangent = [pt[0] - curvePoints[i - 1][0], pt[1] - curvePoints[i - 1][1], pt[2] - curvePoints[i - 1][2]];
        } else {
            tangent = [curvePoints[i + 1][0] - curvePoints[i - 1][0], curvePoints[i + 1][1] - curvePoints[i - 1][1], curvePoints[i + 1][2] - curvePoints[i - 1][2]];
        }

        const tLen = Math.sqrt(tangent[0] * tangent[0] + tangent[1] * tangent[1] + tangent[2] * tangent[2]) || 1.0;
        tangent = [tangent[0] / tLen, tangent[1] / tLen, tangent[2] / tLen];

        const up = Math.abs(tangent[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0];
        let n1 = [
            up[1] * tangent[2] - up[2] * tangent[1],
            up[2] * tangent[0] - up[0] * tangent[2],
            up[0] * tangent[1] - up[1] * tangent[0]
        ];
        const n1Len = Math.sqrt(n1[0] * n1[0] + n1[1] * n1[1] + n1[2] * n1[2]) || 1.0;
        n1 = [n1[0] / n1Len, n1[1] / n1Len, n1[2] / n1Len];

        const n2 = [
            tangent[1] * n1[2] - tangent[2] * n1[1],
            tangent[2] * n1[0] - tangent[0] * n1[2],
            tangent[0] * n1[1] - tangent[1] * n1[0]
        ];

        for (let j = 0; j < sides; j++) {
            const angle = 2 * Math.PI * j / sides;
            const cosA = Math.cos(angle);
            const sinA = Math.sin(angle);

            const nx = cosA * n1[0] + sinA * n2[0];
            const ny = cosA * n1[1] + sinA * n2[1];
            const nz = cosA * n1[2] + sinA * n2[2];

            const px = pt[0] + radius * nx;
            const py = pt[1] + radius * ny;
            const pz = pt[2] + radius * nz;

            positions.push(px, py, pz);
            normals.push(nx, ny, nz);
        }
    }

    for (let i = 0; i < numPoints - 1; i++) {
        for (let j = 0; j < sides; j++) {
            const nextJ = (j + 1) % sides;
            const r1 = i * sides + j;
            const r2 = i * sides + nextJ;
            const r3 = (i + 1) * sides + j;
            const r4 = (i + 1) * sides + nextJ;

            indices.push(r1, r3, r2);
            indices.push(r2, r3, r4);
        }
    }

    return { positions, normals, indices, color };
}

function generateHeartGlb(outputPath) {
    const ladPoints = [
        [-0.35, 0.95, 0.85], [-0.30, 0.65, 0.98], [-0.25, 0.35, 1.05],
        [-0.20, 0.05, 1.00], [-0.15, -0.25, 0.90], [-0.10, -0.55, 0.75],
        [-0.05, -0.85, 0.50], [0.00, -1.15, 0.15]
    ];

    const lcxPoints = [
        [-0.35, 0.95, 0.85], [-0.55, 0.90, 0.75], [-0.75, 0.82, 0.60],
        [-0.95, 0.70, 0.40], [-1.08, 0.50, 0.10], [-1.15, 0.25, -0.25],
        [-1.00, 0.05, -0.55], [-0.80, -0.15, -0.75]
    ];

    const rcaPoints = [
        [0.35, 0.90, 0.85], [0.55, 0.85, 0.80], [0.78, 0.72, 0.68],
        [0.98, 0.50, 0.50], [1.08, 0.20, 0.30], [1.05, -0.15, 0.05],
        [0.88, -0.50, -0.20], [0.60, -0.78, -0.38], [0.20, -0.98, -0.50]
    ];

    const aortaPoints = [
        [-0.20, 0.90, 0.10], [-0.20, 1.40, 0.05], [-0.10, 1.80, -0.05],
        [0.10, 2.00, -0.25], [0.38, 1.85, -0.45], [0.50, 1.30, -0.55]
    ];

    const paPoints = [
        [0.20, 0.80, 0.30], [0.10, 1.20, 0.38], [-0.10, 1.50, 0.25], [-0.30, 1.65, 0.05]
    ];

    const meshSpecs = [
        ["Heart_Body", createSphere(1.2, 16, 16, [0.55, 0.13, 0.13, 1.0], true)],
        ["Aorta", createTube(aortaPoints, 0.26, 12, [0.85, 0.25, 0.25, 1.0])],
        ["Pulmonary_Artery", createTube(paPoints, 0.20, 12, [0.25, 0.45, 0.75, 1.0])],
        ["LAD_Vessel", createTube(ladPoints, 0.085, 12, [0.95, 0.15, 0.15, 1.0])],
        ["LCX_Vessel", createTube(lcxPoints, 0.08, 12, [0.95, 0.15, 0.15, 1.0])],
        ["RCA_Vessel", createTube(rcaPoints, 0.085, 12, [0.95, 0.15, 0.15, 1.0])]
    ];

    const bufferChunks = [];
    const gltfNodes = [];
    const gltfMeshes = [];
    const gltfMaterials = [];
    const gltfAccessors = [];
    const gltfBufferViews = [];

    let currentOffset = 0;

    for (let idx = 0; idx < meshSpecs.length; idx++) {
        const [name, data] = meshSpecs[idx];
        const matIdx = gltfMaterials.length;
        gltfMaterials.push({
            name: `${name}_Material`,
            pbrMetallicRoughness: {
                baseColorFactor: data.color,
                metallicFactor: 0.1,
                roughnessFactor: 0.4
            }
        });

        // Position Buffer
        const posBuf = Buffer.alloc(data.positions.length * 4);
        let minPos = [Infinity, Infinity, Infinity];
        let maxPos = [-Infinity, -Infinity, -Infinity];
        for (let i = 0; i < data.positions.length; i += 3) {
            const px = data.positions[i];
            const py = data.positions[i + 1];
            const pz = data.positions[i + 2];
            posBuf.writeFloatLE(px, i * 4);
            posBuf.writeFloatLE(py, (i + 1) * 4);
            posBuf.writeFloatLE(pz, (i + 2) * 4);
            minPos[0] = Math.min(minPos[0], px);
            minPos[1] = Math.min(minPos[1], py);
            minPos[2] = Math.min(minPos[2], pz);
            maxPos[0] = Math.max(maxPos[0], px);
            maxPos[1] = Math.max(maxPos[1], py);
            maxPos[2] = Math.max(maxPos[2], pz);
        }

        const bvPosIdx = gltfBufferViews.length;
        gltfBufferViews.push({
            buffer: 0,
            byteOffset: currentOffset,
            byteLength: posBuf.length,
            target: 34962
        });
        bufferChunks.push(posBuf);
        currentOffset += posBuf.length;

        const accPosIdx = gltfAccessors.length;
        gltfAccessors.push({
            bufferView: bvPosIdx,
            byteOffset: 0,
            componentType: 5126,
            count: data.positions.length / 3,
            type: "VEC3",
            min: minPos,
            max: maxPos
        });

        // Normal Buffer
        const normBuf = Buffer.alloc(data.normals.length * 4);
        for (let i = 0; i < data.normals.length; i++) {
            normBuf.writeFloatLE(data.normals[i], i * 4);
        }
        const bvNormIdx = gltfBufferViews.length;
        gltfBufferViews.push({
            buffer: 0,
            byteOffset: currentOffset,
            byteLength: normBuf.length,
            target: 34962
        });
        bufferChunks.push(normBuf);
        currentOffset += normBuf.length;

        const accNormIdx = gltfAccessors.length;
        gltfAccessors.push({
            bufferView: bvNormIdx,
            byteOffset: 0,
            componentType: 5126,
            count: data.normals.length / 3,
            type: "VEC3"
        });

        // Index Buffer
        const indBuf = Buffer.alloc(data.indices.length * 2);
        for (let i = 0; i < data.indices.length; i++) {
            indBuf.writeUInt16LE(data.indices[i], i * 2);
        }
        // Pad to 4-byte boundary if needed
        let padBytes = (4 - (indBuf.length % 4)) % 4;
        const paddedIndBuf = padBytes > 0 ? Buffer.concat([indBuf, Buffer.alloc(padBytes)]) : indBuf;

        const bvIndIdx = gltfBufferViews.length;
        gltfBufferViews.push({
            buffer: 0,
            byteOffset: currentOffset,
            byteLength: indBuf.length,
            target: 34963
        });
        bufferChunks.push(paddedIndBuf);
        currentOffset += paddedIndBuf.length;

        const accIndIdx = gltfAccessors.length;
        gltfAccessors.push({
            bufferView: bvIndIdx,
            byteOffset: 0,
            componentType: 5123,
            count: data.indices.length,
            type: "SCALAR"
        });

        const meshIdx = gltfMeshes.length;
        gltfMeshes.push({
            name: name,
            primitives: [{
                attributes: {
                    POSITION: accPosIdx,
                    NORMAL: accNormIdx
                },
                indices: accIndIdx,
                material: matIdx
            }]
        });

        gltfNodes.push({
            name: name,
            mesh: meshIdx
        });
    }

    const binBuffer = Buffer.concat(bufferChunks);

    const gltfDict = {
        asset: { version: "2.0", generator: "CardioVision3D-AssetGenerator" },
        scenes: [{ name: "HeartScene", nodes: Array.from({ length: gltfNodes.length }, (_, i) => i) }],
        scene: 0,
        nodes: gltfNodes,
        meshes: gltfMeshes,
        materials: gltfMaterials,
        accessors: gltfAccessors,
        bufferViews: gltfBufferViews,
        buffers: [{ byteLength: binBuffer.length }]
    };

    let jsonStr = JSON.stringify(gltfDict);
    while (Buffer.byteLength(jsonStr, 'utf8') % 4 !== 0) {
        jsonStr += ' ';
    }
    const jsonBuffer = Buffer.from(jsonStr, 'utf8');

    const totalLength = 12 + 8 + jsonBuffer.length + 8 + binBuffer.length;
    const header = Buffer.alloc(12);
    header.write('glTF', 0, 4, 'ascii');
    header.writeUInt32LE(2, 4);
    header.writeUInt32LE(totalLength, 8);

    const jsonHeader = Buffer.alloc(8);
    jsonHeader.writeUInt32LE(jsonBuffer.length, 0);
    jsonHeader.writeUInt32LE(0x4E4F534A, 4);

    const binHeader = Buffer.alloc(8);
    binHeader.writeUInt32LE(binBuffer.length, 0);
    binHeader.writeUInt32LE(0x00414E49, 4);

    const glbBuffer = Buffer.concat([header, jsonHeader, jsonBuffer, binHeader, binBuffer]);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, glbBuffer);

    console.log(`GLB anatomical model generated successfully: ${outputPath}`);
    console.log(`File size: ${(glbBuffer.length / 1024).toFixed(2)} KB`);
    console.log(`Named meshes created: ${gltfMeshes.map(m => m.name).join(', ')}`);
}

const targetPath = path.join(__dirname, '..', 'frontend', 'public', 'models', 'heart.glb');
generateHeartGlb(targetPath);
