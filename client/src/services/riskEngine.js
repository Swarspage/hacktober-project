/**
 * LegalTech Contract Risk Scoring & Negotiation Engine
 * Dynamically computes mathematical risk indices (0-100), categorical exposures,
 * and real-time projected risk reductions from contract negotiations.
 */

export const DEFAULT_PRESETS = {
  balanced: {
    id: 'balanced',
    nameEn: 'Standard Tenant (Balanced)',
    nameHi: 'मानक किरायेदार (संतुलित)',
    descriptionEn: 'Equitably balances financial clauses, premature exit lock-in, and landlord privacy restrictions according to standard Maharashtra tenancy norms.',
    descriptionHi: 'मानक महाराष्ट्र किरायेदारी नियमों के अनुसार वित्तीय शर्तों, लॉक-इन और गोपनीयता का संतुलित मूल्यांकन करता है।',
    severityWeights: {
      critical: 28,
      high: 18,
      medium: 9,
      low: 4,
    },
    categoryMultipliers: {
      financial: 1.25,
      lockin: 1.30,
      repairs: 1.15,
      privacy: 1.10,
      rules: 0.85,
      legal: 0.90,
      other: 1.00,
    },
    missingWeights: {
      critical: 10,
      high: 6,
      medium: 3,
    },
    thresholds: {
      low: 28,
      medium: 58,
      high: 80,
    },
    compoundBonus: 1.15,
  },
  strict: {
    id: 'strict',
    nameEn: 'Zero-Tolerance (Strict / Risk-Averse)',
    nameHi: 'सख्त व सतर्क (शून्य जोखिम सहनशीलता)',
    descriptionEn: 'Heavily penalizes lock-ins, discretionary deposit deductions, and unnotified landlord entries. Recommended for short-term stays and cautious tenants.',
    descriptionHi: 'लॉक-इन, जमा राशि कटौती और बिना पूर्व सूचना प्रवेश पर कड़े अंक काटता है। सतर्क किरायेदारों के लिए सर्वोत्तम।',
    severityWeights: {
      critical: 35,
      high: 24,
      medium: 12,
      low: 5,
    },
    categoryMultipliers: {
      financial: 1.40,
      lockin: 1.50,
      repairs: 1.30,
      privacy: 1.35,
      rules: 1.00,
      legal: 1.10,
      other: 1.00,
    },
    missingWeights: {
      critical: 14,
      high: 9,
      medium: 4,
    },
    thresholds: {
      low: 20,
      medium: 48,
      high: 75,
    },
    compoundBonus: 1.25,
  },
  flexible: {
    id: 'flexible',
    nameEn: 'Pragmatic / Investor (Commercial)',
    nameHi: 'व्यावहारिक / व्यावसायिक (लचीला)',
    descriptionEn: 'Focuses primarily on core financial outlays (rent escalation & deposit). More lenient towards house rules and standard operational terms.',
    descriptionHi: 'मुख्य रूप से प्रत्यक्ष वित्तीय खर्चों पर केंद्रित। सामान्य नियमों और परिचालन शर्तों के प्रति अधिक लचीला।',
    severityWeights: {
      critical: 22,
      high: 14,
      medium: 7,
      low: 3,
    },
    categoryMultipliers: {
      financial: 1.35,
      lockin: 1.05,
      repairs: 0.95,
      privacy: 0.85,
      rules: 0.70,
      legal: 0.80,
      other: 1.00,
    },
    missingWeights: {
      critical: 8,
      high: 4,
      medium: 2,
    },
    thresholds: {
      low: 35,
      medium: 65,
      high: 85,
    },
    compoundBonus: 1.05,
  },
};

export const CATEGORY_DEFINITIONS = [
  {
    id: 'financial',
    labelEn: 'Financial & Security Deposit',
    labelHi: 'वित्तीय व सुरक्षा जमा राशि',
    icon: '💰',
    keywords: ['deposit', 'money', 'escalation', 'hike', 'rent', 'deduction', 'financial', 'penalty', 'forfeit', 'cost', 'charge'],
  },
  {
    id: 'lockin',
    labelEn: 'Lock-in & Premature Exit',
    labelHi: 'लॉक-इन व समय पूर्व निकास',
    icon: '🔒',
    keywords: ['lock-in', 'lockin', 'exit', 'terminate', 'termination', 'notice', 'duration', 'period', 'vacating'],
  },
  {
    id: 'repairs',
    labelEn: 'Repairs & Structural Liabilities',
    labelHi: 'मरम्मत व संरचनात्मक दायित्व',
    icon: '🛠️',
    keywords: ['repair', 'maintenance', 'structural', 'seepage', 'leakage', 'plumbing', 'electrical', 'paint', 'wear'],
  },
  {
    id: 'privacy',
    labelEn: 'Privacy & Landlord Entry',
    labelHi: 'गोपनीयता व मालिक का प्रवेश',
    icon: '👁️',
    keywords: ['entry', 'inspection', 'enter', 'visit', 'privacy', 'unannounced', 'keys', 'access', 'broker'],
  },
  {
    id: 'rules',
    labelEn: 'Rules, Guests & Subletting',
    labelHi: 'नियम, अतिथि व सबलेटिंग',
    icon: '👥',
    keywords: ['sublet', 'guest', 'visitor', 'pet', 'bachelor', 'friend', 'occupant', 'assign', 'transfer'],
  },
  {
    id: 'legal',
    labelEn: 'Registration, Stamp & Legal',
    labelHi: 'पंजीकरण, स्टाम्प व कानूनी अनुपालन',
    icon: '⚖️',
    keywords: ['registration', 'stamp', 'police', 'verification', 'indemnity', 'dispute', 'jurisdiction', 'court'],
  },
];

/**
 * Classifies a flag or text into one of the canonical categories.
 */
export function classifyCategory(categoryText = '', quote = '', whyRisky = '') {
  const combined = `${categoryText} ${quote} ${whyRisky}`.toLowerCase();
  for (const cat of CATEGORY_DEFINITIONS) {
    if (cat.keywords.some((kw) => combined.includes(kw))) {
      return cat.id;
    }
  }
  return 'other';
}

/**
 * Computes dynamic risk metrics based on contract analysis flags, missing items,
 * and user-configured risk weights and negotiation state.
 */
export function calculateRiskMetrics(result, config = DEFAULT_PRESETS.balanced, negotiationStates = {}) {
  const flags = Array.isArray(result?.flags) ? result.flags : [];
  const missing = Array.isArray(result?.missing) ? result.missing : [];

  const sevWeights = config?.severityWeights || DEFAULT_PRESETS.balanced.severityWeights;
  const catMults = config?.categoryMultipliers || DEFAULT_PRESETS.balanced.categoryMultipliers;
  const missingWeights = config?.missingWeights || DEFAULT_PRESETS.balanced.missingWeights;
  const thresholds = config?.thresholds || DEFAULT_PRESETS.balanced.thresholds;
  const compoundBonus = config?.compoundBonus || 1.15;

  let totalRawPoints = 0;
  let activeNegotiationPoints = 0;
  let highSeverityCount = 0;

  const categoryBuckets = {
    financial: { raw: 0, active: 0, flagCount: 0, activeCount: 0 },
    lockin: { raw: 0, active: 0, flagCount: 0, activeCount: 0 },
    repairs: { raw: 0, active: 0, flagCount: 0, activeCount: 0 },
    privacy: { raw: 0, active: 0, flagCount: 0, activeCount: 0 },
    rules: { raw: 0, active: 0, flagCount: 0, activeCount: 0 },
    legal: { raw: 0, active: 0, flagCount: 0, activeCount: 0 },
    other: { raw: 0, active: 0, flagCount: 0, activeCount: 0 },
  };

  // 1. Process Detected Clauses
  flags.forEach((flag, idx) => {
    const sev = (flag.severity || 'medium').toLowerCase();
    const basePts = sevWeights[sev] || sevWeights.medium || 10;
    const catId = classifyCategory(flag.category, flag.quote, flag.why_risky);
    const mult = catMults[catId] || 1.0;
    const weightedPts = basePts * mult;

    totalRawPoints += weightedPts;
    if (sev === 'critical' || sev === 'high') {
      highSeverityCount++;
    }

    if (categoryBuckets[catId]) {
      categoryBuckets[catId].raw += weightedPts;
      categoryBuckets[catId].flagCount += 1;
    }

    const state = negotiationStates[idx] || 'pending';
    if (state !== 'negotiated' && state !== 'waived') {
      activeNegotiationPoints += weightedPts;
      if (categoryBuckets[catId]) {
        categoryBuckets[catId].active += weightedPts;
        categoryBuckets[catId].activeCount += 1;
      }
    }
  });

  // 2. Process Missing Tenant Safeguards
  let missingRawPoints = 0;
  missing.forEach((item) => {
    const imp = (typeof item === 'object' ? item.importance : 'high') || 'high';
    const pts = missingWeights[imp.toLowerCase()] || missingWeights.high || 5;
    totalRawPoints += pts;
    missingRawPoints += pts;
    activeNegotiationPoints += pts;
  });

  // 3. Apply Multi-Issue Compound Factor (if multiple severe clauses exist)
  if (highSeverityCount >= 3) {
    totalRawPoints *= compoundBonus;
    activeNegotiationPoints *= compoundBonus;
  }

  // 4. Mathematical Normalization (Asymptotic log-scaled curve towards 100 max)
  function normalizeToScale(points) {
    if (points <= 0) return 0;
    const normalized = Math.min(100, Math.round(100 * (1 - Math.exp(-points / 55))));
    return Math.max(5, normalized);
  }

  const baseScore = flags.length === 0 && missing.length === 0 ? 8 : normalizeToScale(totalRawPoints);
  const currentScore = flags.length === 0 && missing.length === 0 ? 8 : normalizeToScale(activeNegotiationPoints);
  const projectedScore = Math.max(6, Math.round(currentScore * 0.28));

  function determineLevel(s) {
    if (s <= thresholds.low) return 'low';
    if (s <= thresholds.medium) return 'medium';
    if (s <= thresholds.high) return 'high';
    return 'critical';
  }

  const riskLevel = determineLevel(currentScore);
  const baseRiskLevel = determineLevel(baseScore);

  function determineGrade(s) {
    if (s <= 18) return 'A+';
    if (s <= 28) return 'A';
    if (s <= 45) return 'B+';
    if (s <= 58) return 'B';
    if (s <= 72) return 'C';
    if (s <= 85) return 'D';
    return 'F';
  }

  const categoryBreakdown = CATEGORY_DEFINITIONS.map((def) => {
    const bucket = categoryBuckets[def.id] || { raw: 0, active: 0, flagCount: 0, activeCount: 0 };
    const catScore = Math.min(100, Math.round((bucket.raw / 35) * 100));
    return {
      id: def.id,
      labelEn: def.labelEn,
      labelHi: def.labelHi,
      icon: def.icon,
      score: catScore,
      flagCount: bucket.flagCount,
      activeCount: bucket.activeCount,
      points: Math.round(bucket.raw),
      status: catScore > 65 ? 'critical' : catScore > 35 ? 'moderate' : 'safe',
    };
  });

  const pointsReduced = Math.max(0, baseScore - currentScore);
  const percentReduced = baseScore > 0 ? Math.round((pointsReduced / baseScore) * 100) : 0;

  return {
    baseScore,
    currentScore,
    projectedScore,
    pointsReduced,
    percentReduced,
    riskLevel,
    baseRiskLevel,
    grade: determineGrade(currentScore),
    baseGrade: determineGrade(baseScore),
    categoryBreakdown,
    highSeverityCount,
    totalFlags: flags.length,
    missingCount: missing.length,
    missingRawPoints: Math.round(missingRawPoints),
    thresholds,
  };
}

const STORAGE_KEY = 'redflag_risk_config_v1';

export function loadUserRiskConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.severityWeights && parsed.thresholds) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load risk config from storage:', err);
  }
  return DEFAULT_PRESETS.balanced;
}

export function saveUserRiskConfig(config) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save risk config to storage:', err);
  }
}
