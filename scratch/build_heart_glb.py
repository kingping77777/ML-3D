import json
import math
import struct
import os

def create_sphere(radius=1.0, lat_segments=16, lon_segments=16, color=(0.55, 0.13, 0.13, 1.0), taper_y=True):
    positions = []
    normals = []
    indices = []

    for i in range(lat_segments + 1):
        lat = math.pi * (i / lat_segments - 0.5)
        sin_lat = math.sin(lat)
        cos_lat = math.cos(lat)

        for j in range(lon_segments + 1):
            lon = 2 * math.pi * (j / lon_segments)
            sin_lon = math.sin(lon)
            cos_lon = math.cos(lon)

            x = cos_lat * cos_lon
            y = sin_lat
            z = cos_lat * sin_lon

            # Apply heart tapering
            px = x * radius
            py = y * radius
            pz = z * radius

            if taper_y and py < 0:
                factor = 1.0 + (py / radius) * 0.35
                px *= max(0.2, factor)
                pz *= max(0.2, factor)
                if px < 0:
                    px *= 1.15

            positions.extend([px, py, pz])
            normals.extend([x, y, z])

    for i in range(lat_segments):
        for j in range(lon_segments):
            first = i * (lon_segments + 1) + j
            second = first + lon_segments + 1
            indices.extend([first, second, first + 1])
            indices.extend([second, second + 1, first + 1])

    return positions, normals, indices, color

def create_tube(curve_points, radius=0.08, sides=12, color=(1.0, 0.2, 0.2, 1.0)):
    positions = []
    normals = []
    indices = []

    num_points = len(curve_points)
    for i, pt in enumerate(curve_points):
        # Tangent
        if i == 0:
            tangent = [curve_points[1][k] - pt[k] for k in range(3)]
        elif i == num_points - 1:
            tangent = [pt[k] - curve_points[i-1][k] for k in range(3)]
        else:
            tangent = [curve_points[i+1][k] - curve_points[i-1][k] for k in range(3)]
        
        t_len = math.sqrt(sum(t*t for t in tangent)) or 1.0
        tangent = [t / t_len for t in tangent]

        # Normal and Binormal
        up = [0, 1, 0] if abs(tangent[1]) < 0.9 else [1, 0, 0]
        n1 = [up[1]*tangent[2] - up[2]*tangent[1], up[2]*tangent[0] - up[0]*tangent[2], up[0]*tangent[1] - up[1]*tangent[0]]
        n1_len = math.sqrt(sum(x*x for x in n1)) or 1.0
        n1 = [x / n1_len for x in n1]

        n2 = [tangent[1]*n1[2] - tangent[2]*n1[1], tangent[2]*n1[0] - tangent[0]*n1[2], tangent[0]*n1[1] - tangent[1]*n1[0]]

        for j in range(sides):
            angle = 2 * math.pi * j / sides
            cos_a = math.cos(angle)
            sin_a = math.sin(angle)

            nx = cos_a * n1[0] + sin_a * n2[0]
            ny = cos_a * n1[1] + sin_a * n2[1]
            nz = cos_a * n1[2] + sin_a * n2[2]

            px = pt[0] + radius * nx
            py = pt[1] + radius * ny
            pz = pt[2] + radius * nz

            positions.extend([px, py, pz])
            normals.extend([nx, ny, nz])

    for i in range(num_points - 1):
        for j in range(sides):
            next_j = (j + 1) % sides
            r1 = i * sides + j
            r2 = i * sides + next_j
            r3 = (i + 1) sides + j
            r4 = (i + 1) * sides + next_j

            indices.extend([r1, r3, r2])
            indices.extend([r2, r3, r4])

    return positions, normals, indices, color

def generate_heart_glb(output_filepath):
    # Curve points for vessels
    lad_points = [
        [-0.35, 0.95, 0.85], [-0.30, 0.65, 0.98], [-0.25, 0.35, 1.05],
        [-0.20, 0.05, 1.00], [-0.15, -0.25, 0.90], [-0.10, -0.55, 0.75],
        [-0.05, -0.85, 0.50], [0.00, -1.15, 0.15]
    ]

    lcx_points = [
        [-0.35, 0.95, 0.85], [-0.55, 0.90, 0.75], [-0.75, 0.82, 0.60],
        [-0.95, 0.70, 0.40], [-1.08, 0.50, 0.10], [-1.15, 0.25, -0.25],
        [-1.00, 0.05, -0.55], [-0.80, -0.15, -0.75]
    ]

    rca_points = [
        [0.35, 0.90, 0.85], [0.55, 0.85, 0.80], [0.78, 0.72, 0.68],
        [0.98, 0.50, 0.50], [1.08, 0.20, 0.30], [1.05, -0.15, 0.05],
        [0.88, -0.50, -0.20], [0.60, -0.78, -0.38], [0.20, -0.98, -0.50]
    ]

    aorta_points = [
        [-0.20, 0.90, 0.10], [-0.20, 1.40, 0.05], [-0.10, 1.80, -0.05],
        [0.10, 2.00, -0.25], [0.38, 1.85, -0.45], [0.50, 1.30, -0.55]
    ]

    pa_points = [
        [0.20, 0.80, 0.30], [0.10, 1.20, 0.38], [-0.10, 1.50, 0.25], [-0.30, 1.65, 0.05]
    ]

    mesh_specs = [
        ("Heart_Body", create_sphere(radius=1.2, color=(0.55, 0.13, 0.13, 1.0))),
        ("Aorta", create_tube(aorta_points, radius=0.26, color=(0.85, 0.25, 0.25, 1.0))),
        ("Pulmonary_Artery", create_tube(pa_points, radius=0.20, color=(0.25, 0.45, 0.75, 1.0))),
        ("LAD_Vessel", create_tube(lad_points, radius=0.085, color=(0.95, 0.15, 0.15, 1.0))),
        ("LCX_Vessel", create_tube(lcx_points, radius=0.08, color=(0.95, 0.15, 0.15, 1.0))),
        ("RCA_Vessel", create_tube(rca_points, radius=0.085, color=(0.95, 0.15, 0.15, 1.0)))
    ]

    bin_data = bytearray()
    gltf_nodes = []
    gltf_meshes = []
    gltf_materials = []
    gltf_accessors = []
    gltf_buffer_views = []

    buffer_offset = 0

    for idx, (name, (pos, norm, ind, col)) in enumerate(mesh_specs):
        mat_idx = len(gltf_materials)
        gltf_materials.append({
            "name": f"{name}_Material",
            "pbrMetallicRoughness": {
                "baseColorFactor": col,
                "metallicFactor": 0.1,
                "roughnessFactor": 0.4
            }
        })

        # 1. Position BufferView & Accessor
        pos_bytes = struct.pack(f'<{len(pos)}f', *pos)
        pos_offset = len(bin_data)
        bin_data.extend(pos_bytes)
        # Pad to 4-byte
        while len(bin_data) % 4 != 0:
            bin_data.append(0)

        min_pos = [min(pos[i::3]) for i in range(3)]
        max_pos = [max(pos[i::3]) for i in range(3)]

        bv_pos_idx = len(gltf_buffer_views)
        gltf_buffer_views.append({
            "buffer": 0,
            "byteOffset": pos_offset,
            "byteLength": len(pos_bytes),
            "target": 34962 # ARRAY_BUFFER
        })

        acc_pos_idx = len(gltf_accessors)
        gltf_accessors.append({
            "bufferView": bv_pos_idx,
            "byteOffset": 0,
            "componentType": 5126, # FLOAT
            "count": len(pos) // 3,
            "type": "VEC3",
            "min": min_pos,
            "max": max_pos
        })

        # 2. Normal BufferView & Accessor
        norm_bytes = struct.pack(f'<{len(norm)}f', *norm)
        norm_offset = len(bin_data)
        bin_data.extend(norm_bytes)
        while len(bin_data) % 4 != 0:
            bin_data.append(0)

        bv_norm_idx = len(gltf_buffer_views)
        gltf_buffer_views.append({
            "buffer": 0,
            "byteOffset": norm_offset,
            "byteLength": len(norm_bytes),
            "target": 34962 # ARRAY_BUFFER
        })

        acc_norm_idx = len(gltf_accessors)
        gltf_accessors.append({
            "bufferView": bv_norm_idx,
            "byteOffset": 0,
            "componentType": 5126, # FLOAT
            "count": len(norm) // 3,
            "type": "VEC3"
        })

        # 3. Index BufferView & Accessor
        ind_bytes = struct.pack(f'<{len(ind)}H', *ind)
        ind_offset = len(bin_data)
        bin_data.extend(ind_bytes)
        while len(bin_data) % 4 != 0:
            bin_data.append(0)

        bv_ind_idx = len(gltf_buffer_views)
        gltf_buffer_views.append({
            "buffer": 0,
            "byteOffset": ind_offset,
            "byteLength": len(ind_bytes),
            "target": 34963 # ELEMENT_ARRAY_BUFFER
        })

        acc_ind_idx = len(gltf_accessors)
        gltf_accessors.append({
            "bufferView": bv_ind_idx,
            "byteOffset": 0,
            "componentType": 5123, # UNSIGNED_SHORT
            "count": len(ind),
            "type": "SCALAR"
        })

        # Create Mesh & Node
        mesh_idx = len(gltf_meshes)
        gltf_meshes.append({
            "name": name,
            "primitives": [{
                "attributes": {
                    "POSITION": acc_pos_idx,
                    "NORMAL": acc_norm_idx
                },
                "indices": acc_ind_idx,
                "material": mat_idx
            }]
        })

        gltf_nodes.append({
            "name": name,
            "mesh": mesh_idx
        })

    gltf_dict = {
        "asset": {"version": "2.0", "generator": "CardioVision3D-AssetGenerator"},
        "scenes": [{"name": "HeartScene", "nodes": list(range(len(gltf_nodes)))}],
        "scene": 0,
        "nodes": gltf_nodes,
        "meshes": gltf_meshes,
        "materials": gltf_materials,
        "accessors": gltf_accessors,
        "bufferViews": gltf_buffer_views,
        "buffers": [{"byteLength": len(bin_data)}]
    }

    json_str = json.dumps(gltf_dict, separators=(',', ':')).encode('utf-8')
    while len(json_str) % 4 != 0:
        json_str += b' '

    # GLB Header
    magic = b'glTF'
    version = 2
    json_chunk_type = 0x4E4F534A
    bin_chunk_type = 0x00414E49

    total_length = 12 + 8 + len(json_str) + 8 + len(bin_data)

    header = struct.pack('<4sII', magic, version, total_length)
    json_header = struct.pack('<II', len(json_str), json_chunk_type)
    bin_header = struct.pack('<II', len(bin_data), bin_chunk_type)

    os.makedirs(os.path.dirname(output_filepath), exist_ok=True)
    with open(output_filepath, 'wb') as f:
        f.write(header)
        f.write(json_header)
        f.write(json_str)
        f.write(bin_header)
        f.write(bin_data)

    file_size = os.path.getsize(output_filepath)
    print(f"GLB asset generated successfully: {output_filepath}")
    print(f"File size: {file_size / 1024:.2f} KB")
    print(f"Meshes count: {len(gltf_meshes)}")

if __name__ == "__main__":
    out_path = os.path.join("frontend", "public", "models", "heart.glb")
    generate_heart_glb(out_path)
