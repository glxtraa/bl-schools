import json
import argparse
import random

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--basins', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()

    print(f"Reading basins from {args.basins}...")
    
    with open(args.basins, 'r') as f:
        data = json.load(f)
    
    comparison = {}
    for feature in data.get('features', []):
        hybas_id = str(feature['properties'].get('HYBAS_ID'))
        # Generate a semi-stable risk for demo based on ID
        random.seed(hybas_id)
        risk_val = random.uniform(0, 5)
        
        comparison[hybas_id] = {
            "overall_risk": risk_val,
            "physical_quantity": random.uniform(0, 5),
            "physical_quality": random.uniform(0, 5),
            "regulatory_repute": random.uniform(0, 5)
        }

    with open(args.output, 'w') as f:
        json.dump(comparison, f, indent=2)
    
    print(f"Comparison saved for {len(comparison)} basins to {args.output}")

if __name__ == "__main__":
    main()
