export const mockUser = {
  id: 'user-1',
  name: 'Ava Reed',
  email: 'ava@truthlens.app',
}

export const exampleClaims = [
  '"India\'s GDP grew by 8% in 2026."',
  '"Climate change is not real."',
  '"This image is from a recent event."',
  '"Public transit ridership fell after the policy change."',
]

export const featureCards = [
  {
    title: 'Multiple Sources',
    description: 'Find information from news, government research, and public records.',
    icon: 'search',
    accent: 'blue',
  },
  {
    title: 'Balanced Analysis',
    description: 'Shows supporting, contradicting, and unclear evidence with context.',
    icon: 'scale',
    accent: 'purple',
  },
  {
    title: 'Transparent Results',
    description: 'Clear assessment with confidence and source links for review.',
    icon: 'check',
    accent: 'green',
  },
  {
    title: 'Save Investigations',
    description: 'Keep track of the claims you have fact-checked and revisit them later.',
    icon: 'folder',
    accent: 'pink',
  },
  {
    title: 'Built for Everyone',
    description: 'Useful for journalists, researchers, students, and engaged citizens.',
    icon: 'users',
    accent: 'rose',
  },
]

export const recentInvestigations = [
  {
    id: 'check-1',
    claim: "India's GDP grew by 8% in 2026",
    risk: 'supported',
    confidence: 0.86,
    evidenceCount: 6,
    sources: 3,
    updatedAt: '2 hours ago',
  },
  {
    id: 'check-2',
    claim: 'Electric vehicle subsidies will end in 2025',
    risk: 'mixed',
    confidence: 0.64,
    evidenceCount: 8,
    sources: 4,
    updatedAt: '5 hours ago',
  },
  {
    id: 'check-3',
    claim: 'This image is from the 2024 floods',
    risk: 'contradicted',
    confidence: 0.91,
    evidenceCount: 5,
    sources: 4,
    updatedAt: '1 day ago',
  },
]

export const dashboardStats = [
  { label: 'Total checks', value: '128', delta: '+18%' },
  { label: 'Evidence reviewed', value: '1.2k', delta: '+24%' },
  { label: 'Average confidence', value: '0.82', delta: '+0.08' },
]

export const mockHistory = [
  {
    id: 'check-1',
    claim: "India's GDP grew by 8% in 2026",
    risk: 'supported',
    confidence: 0.86,
    evidenceCount: 6,
    date: '2026-09-20T09:30:00Z',
  },
  {
    id: 'check-2',
    claim: 'Electric vehicle subsidies will end in 2025',
    risk: 'mixed',
    confidence: 0.64,
    evidenceCount: 8,
    date: '2026-09-17T13:15:00Z',
  },
  {
    id: 'check-3',
    claim: 'This image is from the 2024 floods',
    risk: 'contradicted',
    confidence: 0.91,
    evidenceCount: 5,
    date: '2026-09-11T18:45:00Z',
  },
]

export const mockResult = {
  checkId: 'check-1',
  claim: {
    original: "India's GDP grew by 8% in 2026.",
    normalized: "India's GDP growth rate in 2026 was 8%.",
    subClaims: ['GDP growth rate in 2026', 'Comparison with prior year growth'],
  },
  assessment: {
    riskLevel: 'low',
    confidence: 0.82,
    summary:
      'Available evidence indicates that India recorded strong GDP growth in 2026, though some reporting suggests the pace varied by sector and methodology. Evidence is mixed across official and independent coverage, but the overall pattern remains consistent.',
  },
  evidence: {
    supporting: [
      {
        id: 'ev-1',
        subClaim: 'GDP growth rate in 2026',
        relationship: 'supporting',
        statement: 'Official estimates reported annual GDP growth above 8% for the fiscal year.',
        reason: 'Multiple government releases and economic reports aligned on the same direction and scale.',
        sourceId: 'src-1',
        sourceTitle: 'Ministry of Finance Annual Economic Outlook',
        sourceUrl: 'https://example.com/finance-outlook',
        confidence: 0.88,
      },
      {
        id: 'ev-2',
        subClaim: 'GDP growth rate in 2026',
        relationship: 'supporting',
        statement: 'Private sector analysts cited strong growth driven by manufacturing and services output.',
        reason: 'Independent reporting corroborates the broad trend described in official releases.',
        sourceId: 'src-2',
        sourceTitle: 'Economic Policy Review',
        sourceUrl: 'https://example.com/economic-policy-review',
        confidence: 0.74,
      },
    ],
    contradicting: [
      {
        id: 'ev-3',
        subClaim: 'Comparison with prior year growth',
        relationship: 'contradicting',
        statement: 'Some analysis argued that the headline growth rate overstates underlying momentum in consumer activity.',
        reason: 'Disagreement centers on whether gains were broad-based or concentrated in a few sectors.',
        sourceId: 'src-3',
        sourceTitle: 'Independent Macro Commentary',
        sourceUrl: 'https://example.com/macro-commentary',
        confidence: 0.66,
      },
    ],
    unclear: [
      {
        id: 'ev-4',
        subClaim: 'GDP growth rate in 2026',
        relationship: 'unclear',
        statement: 'Methodology differences across agencies make exact comparisons less certain.',
        reason: 'The available evidence does not fully resolve how different baselines and revisions should be interpreted.',
        sourceId: 'src-4',
        sourceTitle: 'National Statistical Office Briefing',
        sourceUrl: 'https://example.com/statistics-briefing',
        confidence: 0.58,
      },
    ],
  },
  sources: [
    {
      sourceId: 'src-1',
      type: 'government',
      title: 'Ministry of Finance Annual Economic Outlook',
      publisher: 'Government of India',
      url: 'https://example.com/finance-outlook',
      publishedAt: '2026-08-12',
      content: 'Economic summary covering annual output, investment and domestic demand trends.',
    },
    {
      sourceId: 'src-2',
      type: 'news',
      title: 'Economic Policy Review',
      publisher: 'National Dispatch',
      url: 'https://example.com/economic-policy-review',
      publishedAt: '2026-07-09',
      content: 'Independent reporting on industrial output and aggregate growth performance.',
    },
    {
      sourceId: 'src-3',
      type: 'analysis',
      title: 'Independent Macro Commentary',
      publisher: 'Civic Analytics Lab',
      url: 'https://example.com/macro-commentary',
      publishedAt: '2026-08-04',
      content: 'Analysis highlighting concerns about concentration of growth gains and consumer slack.',
    },
    {
      sourceId: 'src-4',
      type: 'government',
      title: 'National Statistical Office Briefing',
      publisher: 'National Statistical Office',
      url: 'https://example.com/statistics-briefing',
      publishedAt: '2026-08-22',
      content: 'Methodological update on revisions, seasonal adjustment and statistical comparability.',
    },
  ],
  suggestedVerification: [
    'Check the original government document and any revised estimates.',
    'Compare publication dates across reporting and revisions.',
    'Review the primary source for methodology and assumptions.',
    'Look for additional independent reporting from separate outlets.',
  ],
}
