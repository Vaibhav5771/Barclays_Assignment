import { Card } from '../components/ui/card';
import { Database, Brain, AlertCircle, Bell, BarChart3, FileSearch, Zap, Server } from 'lucide-react';

export function Architecture() {
  const components = [
    {
      category: 'Data Sources',
      color: 'blue',
      icon: Database,
      items: [
        { name: 'Transaction History', desc: 'Payment amounts, dates, channels' },
        { name: 'Account Balances', desc: 'Current balance, credit limit, utilization' },
        { name: 'Payment Behavior', desc: 'Delays, missed payments, patterns' },
        { name: 'Customer Demographics', desc: 'Account age, segment, tenure' }
      ]
    },
    {
      category: 'Feature Engineering',
      color: 'purple',
      icon: Zap,
      items: [
        { name: 'Payment Delay Trends', desc: 'Rolling average of payment delays' },
        { name: 'Payment Coverage Ratio', desc: 'Payment amount vs minimum due' },
        { name: 'Utilization Trajectory', desc: 'Credit utilization rate changes' },
        { name: 'Behavioral Flags', desc: 'Sudden pattern changes, anomalies' }
      ]
    },
    {
      category: 'ML Risk Scoring',
      color: 'indigo',
      icon: Brain,
      items: [
        { name: 'Gradient Boosting Model', desc: 'XGBoost for risk probability' },
        { name: 'Feature Importance', desc: 'SHAP values for explainability' },
        { name: 'Model Monitoring', desc: 'Drift detection, performance tracking' },
        { name: 'Risk Calibration', desc: 'Score-to-default probability mapping' }
      ]
    },
    {
      category: 'Explainability Layer',
      color: 'amber',
      icon: FileSearch,
      items: [
        { name: 'SHAP Explainer', desc: 'Individual prediction breakdowns' },
        { name: 'Feature Attribution', desc: 'Top contributing risk factors' },
        { name: 'Counterfactual Analysis', desc: 'What-if scenarios for customers' },
        { name: 'Compliance Reports', desc: 'Audit-ready decision logs' }
      ]
    },
    {
      category: 'Alert & Intervention',
      color: 'red',
      icon: Bell,
      items: [
        { name: 'Risk Threshold Engine', desc: 'Configurable alert triggers' },
        { name: 'Action Recommender', desc: 'ML-driven intervention suggestions' },
        { name: 'Approval Workflow', desc: 'Human-in-the-loop for high-impact actions' },
        { name: 'Execution Tracker', desc: 'Monitor intervention outcomes' }
      ]
    },
    {
      category: 'Monitoring Dashboard',
      color: 'green',
      icon: BarChart3,
      items: [
        { name: 'Portfolio View', desc: 'Risk distribution, trends, metrics' },
        { name: 'Customer Profiles', desc: 'Individual risk scores, timelines' },
        { name: 'Intervention Analytics', desc: 'Success rates, effectiveness' },
        { name: 'Real-Time Updates', desc: 'Live risk score recalculations' }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
      amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
      red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' }
    };
    return colors[color];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">System Architecture</h2>
        <p className="text-slate-600 mt-1">High-level overview of the Pre-Delinquency Intervention Engine</p>
      </div>

      {/* Architecture Diagram */}
      <Card className="p-8 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center gap-3 mb-8">
          <Server className="text-blue-600" size={24} />
          <h3 className="text-xl font-bold text-slate-900">Data Flow Architecture</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {components.map((component, index) => {
            const Icon = component.icon;
            const colors = getColorClasses(component.color);
            
            return (
              <div key={component.category} className="space-y-3">
                <Card className={`p-4 ${colors.bg} border-2 ${colors.border}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className={colors.text} size={20} />
                    <h4 className="font-bold text-slate-900">{component.category}</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {component.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-white p-3 rounded-lg border border-slate-200">
                        <p className="font-semibold text-sm text-slate-900 mb-0.5">{item.name}</p>
                        <p className="text-xs text-slate-600">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Arrow connector */}
                {index < components.length - 1 && (
                  <div className="hidden md:flex justify-center">
                    <div className="w-px h-8 bg-slate-300"></div>
                    <div className="absolute w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-300 translate-y-8"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Product Principles */}
      <Card className="p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <h3 className="text-xl font-bold mb-4">Product Principles</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={20} />
              <h4 className="font-semibold">Early Detection Over Reactive Collections</h4>
            </div>
            <p className="text-sm text-blue-100">
              Identify warning signals before missed payments occur. Proactive intervention is more effective and customer-friendly than collections.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <FileSearch size={20} />
              <h4 className="font-semibold">Explainable & Compliant AI</h4>
            </div>
            <p className="text-sm text-blue-100">
              Every risk score comes with clear explanations. SHAP-based feature attribution ensures regulatory compliance and builds trust.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Bell size={20} />
              <h4 className="font-semibold">Preventive, Customer-Friendly Interventions</h4>
            </div>
            <p className="text-sm text-blue-100">
              Focus on helping customers succeed. Offer payment holidays, reminders, and counseling rather than aggressive collections.
            </p>
          </div>
        </div>
      </Card>

      {/* Technical Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Machine Learning Stack</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium text-slate-900">Model Training</span>
              <span className="text-sm text-slate-600">XGBoost, LightGBM</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium text-slate-900">Explainability</span>
              <span className="text-sm text-slate-600">SHAP, LIME</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium text-slate-900">Feature Store</span>
              <span className="text-sm text-slate-600">Feast, Tecton</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium text-slate-900">Model Serving</span>
              <span className="text-sm text-slate-600">MLflow, Seldon</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Infrastructure & Data</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium text-slate-900">Data Warehouse</span>
              <span className="text-sm text-slate-600">Snowflake, BigQuery</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium text-slate-900">Real-Time Processing</span>
              <span className="text-sm text-slate-600">Apache Kafka, Flink</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium text-slate-900">Orchestration</span>
              <span className="text-sm text-slate-600">Airflow, Prefect</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="font-medium text-slate-900">Monitoring</span>
              <span className="text-sm text-slate-600">Grafana, Datadog</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
