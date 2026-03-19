/**
 * VWB Configuration
 * 
 * Constants and multipliers for Volumetric Water Benefit accounting.
 */

export const VWB_CONFIG = {
    // Multipliers based on Aqueduct risk levels
    // Low risk gets 1.0, Extreme risk gets up to 2.5 (High corporate value)
    BASIN_RISK_MULTIPLIERS: {
        'low': 1.0,
        'medium': 1.5,
        'high': 2.0,
        'extreme': 2.5
    },

    // Default physical constants for restoration calculations if specific data missing
    DEFAULT_CATCHMENT_AREA_M2: 240, // Average school roof size
    RUNOFF_COEFFICIENT: 0.85,       // High quality roof runoff

    // Theoretical valuation for CSR reporting ($ per cubic meter of verified benefit)
    VOLUMETRIC_UNIT_PRICE: 12.50,

    // Confidence scores based on data quality
    CONFIDENCE_SCORES: {
        VERIFIED_BLOCKCHAIN: 1.0,
        UNVERIFIED: 0.5,
        MANUAL_ENTRY: 0.7
    }
};
