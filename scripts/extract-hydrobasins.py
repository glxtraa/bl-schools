import json
import os

def main():
    print("Running HydroBASINS extraction (High-Fidelity Organic Python mock)...")
    
    geojson_path = 'public/data/hydrobasins_l6_schools.geojson'
    
    # helper to add jitter for more organic look (limited manual jitter here)
    # Basin 1: Guadalajara
    basin_gdl = [[-103.58, 20.58], [-103.52, 20.52], [-103.45, 20.48], [-103.35, 20.45], [-103.25, 20.42], [-103.18, 20.45], [-103.12, 20.52], [-103.08, 20.58], [-103.05, 20.68], [-103.08, 20.78], [-103.15, 20.88], [-103.25, 20.98], [-103.4, 21.05], [-103.55, 21.02], [-103.65, 20.95], [-103.72, 20.85], [-103.75, 20.75], [-103.72, 20.65], [-103.65, 20.58], [-103.58, 20.58]]
    
    # Basin 2: Queretaro
    basin_qro = [[-100.68, 20.58], [-100.6, 20.52], [-100.5, 20.48], [-100.4, 20.45], [-100.3, 20.42], [-100.2, 20.45], [-100.1, 20.52], [-100.05, 20.62], [-100.02, 20.72], [-100.05, 20.82], [-100.1, 20.92], [-100.2, 21.0], [-100.35, 21.05], [-100.5, 21.02], [-100.65, 20.95], [-100.75, 20.85], [-100.78, 20.75], [-100.75, 20.65], [-100.68, 20.58]]
    
    # Basin 3: Valley of Mexico - North (7060073920)
    # Precise high-fidelity coordinates following the reference image Notch/Ridge lines
    basin_vm_north = [
        [-99.20, 20.15], [-99.12, 20.18], [-99.00, 20.22], [-98.88, 20.20], [-98.78, 20.12],
        [-98.70, 20.08], [-98.62, 20.02], [-98.50, 19.95], [-98.42, 19.92], [-98.32, 19.85],
        [-98.28, 19.75], [-98.32, 19.65], [-98.42, 19.58], [-98.55, 19.52], [-98.70, 19.45],
        [-98.80, 19.48], [-98.92, 19.50], [-99.05, 19.52], [-99.15, 19.55], [-99.25, 19.60],
        [-99.35, 19.68], [-99.42, 19.78], [-99.45, 19.88], [-99.40, 20.00], [-99.32, 20.08], [-99.20, 20.15]
    ]

    # Basin 4: Valley of Mexico - Central-South (7060073910)
    # The Xico/Chalco Cluster
    basin_vm_central_south = [
        [-99.10, 19.50], [-98.95, 19.52], [-98.80, 19.50], [-98.65, 19.45], [-98.55, 19.42],
        [-98.52, 19.32], [-98.55, 19.25], [-98.65, 19.22], [-98.75, 19.22], [-98.85, 19.25],
        [-98.95, 19.28], [-99.05, 19.32], [-99.15, 19.42], [-99.10, 19.50]
    ]

    # Basin 5: Valley of Mexico - Far-South (7060854410)
    # Amecameca Cluster (Prepa 271)
    basin_vm_far_south = [
        [-99.05, 19.32], [-98.85, 19.25], [-98.65, 19.22], [-98.55, 19.25], [-98.48, 19.15],
        [-98.52, 19.05], [-98.58, 18.95], [-98.68, 18.90], [-98.80, 18.88], [-98.92, 18.90],
        [-99.02, 18.95], [-99.15, 19.05], [-99.25, 19.12], [-99.35, 19.22], [-99.25, 19.30], [-99.05, 19.32]
    ]
    
    mock_geojson = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": { "HYBAS_ID": 7060451, "PFAF_ID": 762410, "risk_class": 3, "school_count": 0, "schools": "" },
          "geometry": { "type": "Polygon", "coordinates": [basin_gdl] }
        },
        {
          "type": "Feature",
          "properties": { "HYBAS_ID": 7060482, "PFAF_ID": 762420, "risk_class": 4, "school_count": 0, "schools": "" },
          "geometry": { "type": "Polygon", "coordinates": [basin_qro] }
        },
        {
          "type": "Feature",
          "properties": { "HYBAS_ID": 7060073920, "PFAF_ID": 753250, "risk_class": 2, "school_count": 1, "schools": "BENITO JUAREZ" },
          "geometry": { "type": "Polygon", "coordinates": [basin_vm_north] }
        },
        {
          "type": "Feature",
          "properties": { "HYBAS_ID": 7060073910, "PFAF_ID": 753240, "risk_class": 4, "school_count": 4, "schools": "ZAPATA, VICENTE GUERRERO, IGNACIO ALLENDE, FLORES MAGON" },
          "geometry": { "type": "Polygon", "coordinates": [basin_vm_central_south] }
        },
        {
          "type": "Feature",
          "properties": { "HYBAS_ID": 7060854410, "PFAF_ID": 771260, "risk_class": 5, "school_count": 1, "schools": "PREPARATORIA OFICIAL NO 271" },
          "geometry": { "type": "Polygon", "coordinates": [basin_vm_far_south] }
        }
      ]
    }

    os.makedirs('public/data', exist_ok=True)
    with open(geojson_path, 'w') as f:
        json.dump(mock_geojson, f, indent=2)
    
    print(f"Created {geojson_path}")

if __name__ == "__main__":
    main()
