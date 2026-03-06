import json
import os

def main():
    print("Running HydroBASINS extraction (High-Fidelity Python mock)...")
    
    geojson_path = 'public/data/hydrobasins_l6_schools.geojson'
    
    # 1. Google/Guadalajara Basin (Provider Location context)
    basin_gdl = [[-103.55, 20.55], [-103.4, 20.45], [-103.25, 20.48], [-103.1, 20.42], [-103.05, 20.55], [-103.1, 20.7], [-103.15, 20.85], [-103.35, 21.05], [-103.55, 20.95], [-103.7, 20.85], [-103.75, 20.7], [-103.55, 20.55]]
    
    # 2. AWS/Microsoft Queretaro Basin
    basin_qro = [[-100.65, 20.55], [-100.45, 20.42], [-100.25, 20.45], [-100.1, 20.52], [-100.05, 20.65], [-100.1, 20.8], [-100.2, 20.95], [-100.4, 21.02], [-100.6, 20.95], [-100.75, 20.8], [-100.7, 20.65], [-100.65, 20.55]]
    
    # 3. Valley of Mexico - North (Ecatepec/Pachuca region)
    basin_vm_north = [
        [-99.20, 20.15], [-99.00, 20.20], [-98.80, 20.10], [-98.60, 20.00], 
        [-98.40, 19.90], [-98.30, 19.75], [-98.40, 19.55], [-98.70, 19.45], 
        [-99.00, 19.50], [-99.30, 19.60], [-99.40, 19.85], [-99.30, 20.00], [-99.20, 20.15]
    ]

    # 4. Valley of Mexico - South (Chalco/Amecameca/Xico region)
    basin_vm_south = [
        [-99.00, 19.50], [-98.70, 19.45], [-98.55, 19.45], [-98.50, 19.25], 
        [-98.60, 19.10], [-98.55, 18.95], [-98.80, 18.90], [-99.10, 19.00], 
        [-99.35, 19.10], [-99.45, 19.25], [-99.15, 19.45], [-99.00, 19.50]
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
          "properties": { "HYBAS_ID": 7060073910, "PFAF_ID": 753240, "risk_class": 3, "school_count": 1, "schools": "BENITO JUAREZ" },
          "geometry": { "type": "Polygon", "coordinates": [basin_vm_north] }
        },
        {
          "type": "Feature",
          "properties": { "HYBAS_ID": 7060073920, "PFAF_ID": 753250, "risk_class": 4, "school_count": 5, "schools": "ZAPATA, PREPA 271, VICENTE GUERRERO, IGNACIO ALLENDE, FLORES MAGON" },
          "geometry": { "type": "Polygon", "coordinates": [basin_vm_south] }
        }
      ]
    }

    os.makedirs('public/data', exist_ok=True)
    with open(geojson_path, 'w') as f:
        json.dump(mock_geojson, f, indent=2)
    
    print(f"Created {geojson_path}")

if __name__ == "__main__":
    main()
