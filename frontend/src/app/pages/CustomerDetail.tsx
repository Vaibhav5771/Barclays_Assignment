import { useParams, Link } from 'react-router';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { RiskScore } from '../components/RiskScore';
import { RiskBadge } from '../components/RiskBadge';
import { TrendIndicator } from '../components/TrendIndicator';
import { InterventionPanel } from '../components/InterventionPanel';
import { ArrowLeft, CreditCard, Calendar, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { customers, getCustomerTimeline, getInterventionRecommendations } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

export function CustomerDetail() {
  const { customerId } = useParams();
  const customer = customers.find(c => c.id === customerId);

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Customer not found</p>
        <Link to="/customers">
          <Button className="mt-4">Back to Customers</Button>
        </Link>
      </div>
    );
  }

  const timeline = getCustomerTimeline(customerId!);
  const recommendations = getInterventionRecommendations(customer);

  // Prepare data for risk factor chart
  const riskFactors = [
    { factor: 'Payment Delays', impact: customer.averagePaymentDelay / 30, value: customer.averagePaymentDelay },
    { factor: 'Utilization Rate', impact: customer.utilizationRate, value: (customer.utilizationRate * 100).toFixed(0) },
    { factor: 'Payment Coverage', impact: 1 - customer.paymentCoverageRatio, value: (customer.paymentCoverageRatio * 100).toFixed(0) },
    { factor: 'Days Since Payment', impact: customer.daysSinceLastPayment / 30, value: customer.daysSinceLastPayment }
  ];

  const handleIntervention = (intervention: any) => {
    toast.success(`Intervention "${intervention.type}" has been executed successfully`, {
      description: `Action taken for ${customer.name}`
    });
  };

  const handleApproval = (intervention: any) => {
    toast.info(`Intervention "${intervention.type}" submitted for approval`, {
      description: 'Manager will review within 24 hours'
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link to="/customers">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft size={16} />
          Back to Customers
        </Button>
      </Link>

      {/* Customer Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{customer.name}</h2>
              <p className="text-slate-600 mb-3">{customer.accountNumber}</p>
              <div className="flex items-center gap-3">
                <RiskBadge bucket={customer.riskBucket} />
                <TrendIndicator trend={customer.trend} showLabel />
              </div>
            </div>
          </div>

          <RiskScore score={customer.riskScore} size="lg" />
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-slate-600">Credit Utilization</p>
            <CreditCard className="text-blue-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{(customer.utilizationRate * 100).toFixed(0)}%</p>
          <p className="text-xs text-slate-500 mt-1">
            ${customer.currentBalance.toLocaleString()} / ${customer.creditLimit.toLocaleString()}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-slate-600">Avg Payment Delay</p>
            <Clock className="text-amber-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{customer.averagePaymentDelay} days</p>
          <p className="text-xs text-slate-500 mt-1">Last 6 months average</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-slate-600">Payment Coverage</p>
            <TrendingUp className="text-green-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{(customer.paymentCoverageRatio * 100).toFixed(0)}%</p>
          <p className="text-xs text-slate-500 mt-1">Payment vs minimum due</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between mb-2">
            <p className="text-sm text-slate-600">Days Since Payment</p>
            <Calendar className="text-slate-600" size={20} />
          </div>
          <p className="text-2xl font-bold text-slate-900">{customer.daysSinceLastPayment}</p>
          <p className="text-xs text-slate-500 mt-1">Last payment: {customer.lastPaymentDate}</p>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Drivers & Explainability */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Key Risk Drivers</h3>
            <p className="text-sm text-slate-600 mb-6">Feature contributions to risk score (SHAP values)</p>
            
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={riskFactors} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis type="number" domain={[0, 1]} stroke="#64748B" />
                <YAxis dataKey="factor" type="category" width={120} stroke="#64748B" />
                <Tooltip />
                <Bar dataKey="impact" fill="#DC2626" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-6 space-y-3">
              {riskFactors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-medium text-slate-900">{factor.factor}</span>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-slate-900">
                      Impact: {(factor.impact * 100).toFixed(0)}%
                    </span>
                    <p className="text-xs text-slate-600">
                      {factor.factor.includes('Coverage') ? `${factor.value}%` :
                       factor.factor.includes('Utilization') ? `${factor.value}%` :
                       `${factor.value} days`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Behavioral Flags */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-amber-600" size={20} />
              <h3 className="text-lg font-semibold text-slate-900">Behavioral Alerts</h3>
            </div>
            
            <div className="space-y-2">
              {customer.behaviorFlags.map((flag, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5"></div>
                  <p className="text-sm text-slate-900">{flag}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Timeline & Intervention */}
        <div className="space-y-6">
          {/* 6-Month Timeline */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">6-Month Payment Timeline</h3>
            <p className="text-sm text-slate-600 mb-6">Historical payment behavior and events</p>
            
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {timeline.map((event, index) => {
                const icons = {
                  payment: CheckCircle,
                  delay: Clock,
                  balance: TrendingUp,
                  alert: AlertTriangle
                };
                const colors = {
                  payment: 'text-green-600 bg-green-50',
                  delay: 'text-amber-600 bg-amber-50',
                  balance: 'text-blue-600 bg-blue-50',
                  alert: 'text-red-600 bg-red-50'
                };
                const Icon = icons[event.type];
                
                return (
                  <div key={index} className="flex gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${colors[event.type]}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 pb-4 border-l-2 border-slate-200 pl-4 -ml-4">
                      <p className="text-xs text-slate-500 mb-1">{event.date}</p>
                      <p className="text-sm font-medium text-slate-900">{event.event}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Interventions */}
          <InterventionPanel 
            recommendations={recommendations}
            onExecute={handleIntervention}
            onApprove={handleApproval}
          />
        </div>
      </div>

      {/* Explainability Section */}
      <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Why is this customer flagged?</h3>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <p className="font-medium text-slate-900 mb-2">Model Explanation</p>
            <p className="text-sm text-slate-700">
              The risk score of <strong>{customer.riskScore.toFixed(2)}</strong> is primarily driven by:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              <li>• High credit utilization ({(customer.utilizationRate * 100).toFixed(0)}%) increases default probability</li>
              <li>• Increasing payment delays (avg {customer.averagePaymentDelay} days) signal financial stress</li>
              <li>• Low payment coverage ratio ({(customer.paymentCoverageRatio * 100).toFixed(0)}%) indicates difficulty meeting obligations</li>
              <li>• {customer.daysSinceLastPayment} days since last payment shows irregular payment pattern</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <p className="font-medium text-slate-900 mb-2">Counterfactual Analysis</p>
            <p className="text-sm text-slate-700">
              If the customer reduced utilization to 60% and made on-time payments for 2 months, 
              the risk score would likely decrease to <strong>0.42</strong> (Medium risk category).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
