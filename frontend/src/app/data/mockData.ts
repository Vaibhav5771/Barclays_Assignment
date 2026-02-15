// Mock data for the Pre-Delinquency Intervention Engine

export interface Customer {
  id: string;
  name: string;
  accountNumber: string;
  riskScore: number;
  riskBucket: 'Low' | 'Medium' | 'High';
  trend: 'improving' | 'stable' | 'worsening';
  creditLimit: number;
  currentBalance: number;
  utilizationRate: number;
  lastPaymentDate: string;
  daysSinceLastPayment: number;
  averagePaymentDelay: number;
  paymentCoverageRatio: number;
  behaviorFlags: string[];
}

export interface RiskDistribution {
  bucket: string;
  count: number;
  percentage: number;
}

export interface TimelineEvent {
  date: string;
  event: string;
  type: 'payment' | 'delay' | 'balance' | 'alert';
  value?: string;
}

export interface InterventionRecommendation {
  type: 'reminder' | 'payment_holiday' | 'proactive_outreach' | 'credit_counseling' | 'restructure';
  priority: 'low' | 'medium' | 'high';
  description: string;
  expectedImpact: string;
  requiresApproval: boolean;
}

export const customers: Customer[] = [
  {
    id: 'C001',
    name: 'Sarah Mitchell',
    accountNumber: '4532-****-****-8912',
    riskScore: 0.78,
    riskBucket: 'High',
    trend: 'worsening',
    creditLimit: 15000,
    currentBalance: 13500,
    utilizationRate: 0.90,
    lastPaymentDate: '2026-02-05',
    daysSinceLastPayment: 9,
    averagePaymentDelay: 12,
    paymentCoverageRatio: 0.35,
    behaviorFlags: ['Rising balance', 'Payment delays increasing', 'Near credit limit', 'Reduced repayment amounts']
  },
  {
    id: 'C002',
    name: 'James Rodriguez',
    accountNumber: '4532-****-****-2341',
    riskScore: 0.62,
    riskBucket: 'Medium',
    trend: 'stable',
    creditLimit: 10000,
    currentBalance: 5800,
    utilizationRate: 0.58,
    lastPaymentDate: '2026-02-10',
    daysSinceLastPayment: 4,
    averagePaymentDelay: 7,
    paymentCoverageRatio: 0.55,
    behaviorFlags: ['Consistent late payments', 'Moderate utilization']
  },
  {
    id: 'C003',
    name: 'Emily Chen',
    accountNumber: '4532-****-****-7823',
    riskScore: 0.23,
    riskBucket: 'Low',
    trend: 'improving',
    creditLimit: 20000,
    currentBalance: 3200,
    utilizationRate: 0.16,
    lastPaymentDate: '2026-02-12',
    daysSinceLastPayment: 2,
    averagePaymentDelay: 1,
    paymentCoverageRatio: 0.95,
    behaviorFlags: ['On-time payments', 'Low utilization']
  },
  {
    id: 'C004',
    name: 'Marcus Thompson',
    accountNumber: '4532-****-****-4521',
    riskScore: 0.71,
    riskBucket: 'High',
    trend: 'worsening',
    creditLimit: 8000,
    currentBalance: 7200,
    utilizationRate: 0.90,
    lastPaymentDate: '2026-01-28',
    daysSinceLastPayment: 17,
    averagePaymentDelay: 15,
    paymentCoverageRatio: 0.28,
    behaviorFlags: ['Maximum utilization', 'Payment missed last month', 'Balance growing']
  },
  {
    id: 'C005',
    name: 'Priya Sharma',
    accountNumber: '4532-****-****-9012',
    riskScore: 0.41,
    riskBucket: 'Medium',
    trend: 'improving',
    creditLimit: 12000,
    currentBalance: 4800,
    utilizationRate: 0.40,
    lastPaymentDate: '2026-02-11',
    daysSinceLastPayment: 3,
    averagePaymentDelay: 4,
    paymentCoverageRatio: 0.72,
    behaviorFlags: ['Decreasing balance', 'Improving payment timing']
  },
  {
    id: 'C006',
    name: 'David Kim',
    accountNumber: '4532-****-****-3456',
    riskScore: 0.18,
    riskBucket: 'Low',
    trend: 'stable',
    creditLimit: 25000,
    currentBalance: 2100,
    utilizationRate: 0.08,
    lastPaymentDate: '2026-02-13',
    daysSinceLastPayment: 1,
    averagePaymentDelay: 0,
    paymentCoverageRatio: 1.0,
    behaviorFlags: ['Excellent payment history', 'Low utilization']
  },
  {
    id: 'C007',
    name: 'Angela Martinez',
    accountNumber: '4532-****-****-7890',
    riskScore: 0.55,
    riskBucket: 'Medium',
    trend: 'worsening',
    creditLimit: 9000,
    currentBalance: 6300,
    utilizationRate: 0.70,
    lastPaymentDate: '2026-02-07',
    daysSinceLastPayment: 7,
    averagePaymentDelay: 9,
    paymentCoverageRatio: 0.48,
    behaviorFlags: ['Increasing utilization', 'Payment delays starting']
  },
  {
    id: 'C008',
    name: 'Robert Johnson',
    accountNumber: '4532-****-****-1234',
    riskScore: 0.85,
    riskBucket: 'High',
    trend: 'worsening',
    creditLimit: 5000,
    currentBalance: 4900,
    utilizationRate: 0.98,
    lastPaymentDate: '2026-01-20',
    daysSinceLastPayment: 25,
    averagePaymentDelay: 22,
    paymentCoverageRatio: 0.15,
    behaviorFlags: ['Critical: Near default', 'Multiple missed payments', 'Maximum credit used']
  }
];

export const riskDistribution: RiskDistribution[] = [
  { bucket: 'Low', count: 1250, percentage: 62.5 },
  { bucket: 'Medium', count: 520, percentage: 26.0 },
  { bucket: 'High', count: 230, percentage: 11.5 }
];

export const getCustomerTimeline = (customerId: string): TimelineEvent[] => {
  const timelines: Record<string, TimelineEvent[]> = {
    C001: [
      { date: '2025-09-01', event: 'Payment received - $450', type: 'payment', value: '$450' },
      { date: '2025-10-08', event: 'Payment delayed by 7 days', type: 'delay', value: '7 days' },
      { date: '2025-10-15', event: 'Payment received - $350', type: 'payment', value: '$350' },
      { date: '2025-11-12', event: 'Payment delayed by 11 days', type: 'delay', value: '11 days' },
      { date: '2025-11-20', event: 'Payment received - $300', type: 'payment', value: '$300' },
      { date: '2025-12-18', event: 'Balance increased by $2,000', type: 'balance', value: '+$2,000' },
      { date: '2026-01-14', event: 'Payment delayed by 13 days', type: 'delay', value: '13 days' },
      { date: '2026-01-22', event: 'Payment received - $250', type: 'payment', value: '$250' },
      { date: '2026-02-05', event: 'Reduced payment received - $200', type: 'payment', value: '$200' },
      { date: '2026-02-10', event: 'Risk score elevated to 0.78', type: 'alert', value: '0.78' }
    ],
    C002: [
      { date: '2025-08-15', event: 'Payment received - $300', type: 'payment' },
      { date: '2025-09-18', event: 'Payment delayed by 5 days', type: 'delay' },
      { date: '2025-10-20', event: 'Payment received - $300', type: 'payment' },
      { date: '2025-11-22', event: 'Payment delayed by 7 days', type: 'delay' },
      { date: '2025-12-19', event: 'Payment received - $300', type: 'payment' },
      { date: '2026-01-23', event: 'Payment delayed by 8 days', type: 'delay' },
      { date: '2026-02-10', event: 'Payment received - $300', type: 'payment' }
    ]
  };
  
  return timelines[customerId] || [];
};

export const getInterventionRecommendations = (customer: Customer): InterventionRecommendation[] => {
  if (customer.riskScore >= 0.7) {
    return [
      {
        type: 'proactive_outreach',
        priority: 'high',
        description: 'Immediate phone call from customer success team to understand financial situation and offer assistance.',
        expectedImpact: '45% reduction in default probability within 30 days',
        requiresApproval: false
      },
      {
        type: 'payment_holiday',
        priority: 'high',
        description: 'Offer 30-day payment holiday with interest freeze to provide immediate relief.',
        expectedImpact: '60% reduction in near-term delinquency risk',
        requiresApproval: true
      },
      {
        type: 'restructure',
        priority: 'medium',
        description: 'Propose debt restructuring with extended payment terms and reduced monthly obligations.',
        expectedImpact: '70% improvement in long-term payment sustainability',
        requiresApproval: true
      }
    ];
  } else if (customer.riskScore >= 0.4) {
    return [
      {
        type: 'reminder',
        priority: 'medium',
        description: 'Send personalized SMS/email reminder 3 days before payment due date with balance summary.',
        expectedImpact: '25% reduction in payment delays',
        requiresApproval: false
      },
      {
        type: 'credit_counseling',
        priority: 'low',
        description: 'Offer free financial counseling session to help with budgeting and payment planning.',
        expectedImpact: '35% improvement in payment consistency',
        requiresApproval: false
      }
    ];
  } else {
    return [
      {
        type: 'reminder',
        priority: 'low',
        description: 'Standard automated payment reminder via preferred channel.',
        expectedImpact: '15% reduction in accidental late payments',
        requiresApproval: false
      }
    ];
  }
};

export const portfolioMetrics = {
  totalAccounts: 2000,
  atRiskAccounts: 750,
  interventionsActive: 145,
  avgRiskScore: 0.42,
  portfolioUtilization: 0.58,
  preventedDefaults30d: 23,
  estimatedSavings: 340000
};

export const riskTrendData = [
  { month: 'Aug', avgRisk: 0.38, highRisk: 180 },
  { month: 'Sep', avgRisk: 0.40, highRisk: 195 },
  { month: 'Oct', avgRisk: 0.41, highRisk: 205 },
  { month: 'Nov', avgRisk: 0.43, highRisk: 220 },
  { month: 'Dec', avgRisk: 0.44, highRisk: 235 },
  { month: 'Jan', avgRisk: 0.42, highRisk: 230 },
  { month: 'Feb', avgRisk: 0.42, highRisk: 230 }
];

export const interventionEffectiveness = [
  { type: 'Proactive Outreach', success: 78, total: 120 },
  { type: 'Payment Holiday', success: 65, total: 85 },
  { type: 'Reminders', success: 142, total: 180 },
  { type: 'Credit Counseling', success: 45, total: 60 },
  { type: 'Restructuring', success: 28, total: 35 }
];
