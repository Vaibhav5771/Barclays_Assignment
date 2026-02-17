import { Card } from '../components/ui/card';
import {
    BarChart, Bar, LineChart, Line,
    PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    TrendingDown, Users, AlertTriangle,
    Activity, Target
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchDashboardMetrics } from '../../../api/dashboardApi';

export function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [portfolioMetrics, setPortfolioMetrics] = useState<any>(null);
    const [riskDistribution, setRiskDistribution] = useState<any[]>([]);
    const [riskTrendData, setRiskTrendData] = useState<any[]>([]);
    const [interventionEffectiveness, setInterventionEffectiveness] = useState<any[]>([]);

    useEffect(() => {
        console.log('📊 Dashboard: fetching metrics from backend...');

        fetchDashboardMetrics()
            .then((data) => {
                console.log('✅ Dashboard API response:', data);

                console.log('➡ portfolioMetrics:', data.portfolioMetrics);
                console.log('➡ riskDistribution:', data.riskDistribution);
                console.log('➡ riskTrendData:', data.riskTrendData);
                console.log('➡ interventionEffectiveness:', data.interventionEffectiveness);

                setPortfolioMetrics(data.portfolioMetrics);
                setRiskDistribution(data.riskDistribution);
                setRiskTrendData(data.riskTrendData);
                setInterventionEffectiveness(data.interventionEffectiveness);
            })
            .catch((err) => {
                console.error('❌ Dashboard fetch failed:', err);
            })
            .finally(() => {
                console.log('⏹ Dashboard loading finished');
                setLoading(false);
            });
    }, []);


    useEffect(() => {
        fetchDashboardMetrics()
            .then((data) => {
                setPortfolioMetrics(data.portfolioMetrics);
                setRiskDistribution(data.riskDistribution);
                setRiskTrendData(data.riskTrendData);
                setInterventionEffectiveness(data.interventionEffectiveness);
            })
            .catch((err) => {
                console.error('Dashboard fetch failed', err);
            })
            .finally(() => setLoading(false));
    }, []);

    console.log('🧠 Render state:', {
        loading,
        portfolioMetrics,
        riskDistributionLength: riskDistribution.length,
        riskTrendDataLength: riskTrendData.length,
        interventionEffectivenessLength: interventionEffectiveness.length
    });

    // ✅ HARD GUARD — nothing below runs until data exists
    if (loading || !portfolioMetrics) {
        return (
            <div className="p-12 text-center text-slate-600">
                Loading dashboard insights…
            </div>
        );
    }

    const COLORS = {
        Low: '#3B82F6',
        Medium: '#F59E0B',
        High: '#DC2626'
    };

    // ✅ SAFE: portfolioMetrics is guaranteed here
    const metricCards = [
        {
            title: 'Total Accounts',
            value: portfolioMetrics.totalAccounts.toLocaleString(),
            icon: Users,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600'
        },
        {
            title: 'At-Risk Accounts',
            value: portfolioMetrics.atRiskAccounts.toLocaleString(),
            subtitle: `${(
                (portfolioMetrics.atRiskAccounts / portfolioMetrics.totalAccounts) * 100
            ).toFixed(1)}% of portfolio`,
            icon: AlertTriangle,
            bgColor: 'bg-amber-50',
            textColor: 'text-amber-600'
        },
        {
            title: 'Active Interventions',
            value: portfolioMetrics.interventionsActive.toLocaleString(),
            icon: Activity,
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600'
        },
        {
            title: 'Prevented Defaults (30d)',
            value: portfolioMetrics.preventedDefaults30d.toLocaleString(),
            subtitle: `Est. savings: $${(portfolioMetrics.estimatedSavings / 1000).toFixed(0)}K`,
            icon: Target,
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-slate-900">
                    Risk Monitoring Dashboard
                </h2>
                <p className="text-slate-600 mt-1">
                    Real-time portfolio health and intervention effectiveness
                </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metricCards.map((metric) => {
                    const Icon = metric.icon;
                    return (
                        <Card key={metric.title} className="p-5">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm text-slate-600 mb-1">
                                        {metric.title}
                                    </p>
                                    <p className="text-3xl font-bold text-slate-900">
                                        {metric.value}
                                    </p>
                                    {metric.subtitle && (
                                        <p className="text-xs text-slate-500">
                                            {metric.subtitle}
                                        </p>
                                    )}
                                </div>
                                <div className={`${metric.bgColor} p-3 rounded-lg`}>
                                    <Icon className={metric.textColor} size={24} />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Portfolio Risk Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Portfolio Risk Distribution</h3>
          <p className="text-sm text-slate-600 mb-6">Current customer risk segmentation</p>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ bucket, percentage }) => `${bucket}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.bucket as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-3 gap-4 mt-4">
            {riskDistribution.map((item) => (
              <div key={item.bucket} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[item.bucket as keyof typeof COLORS] }}
                  />
                  <span className="text-sm font-semibold text-slate-900">{item.bucket}</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{item.count}</p>
                <p className="text-xs text-slate-600">{item.percentage}%</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Risk Trend Over Time */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Portfolio Risk Trend</h3>
          <p className="text-sm text-slate-600 mb-6">6-month average risk score and high-risk account count</p>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={riskTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="month" stroke="#64748B" />
              <YAxis yAxisId="left" stroke="#64748B" />
              <YAxis yAxisId="right" orientation="right" stroke="#64748B" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="avgRisk"
                stroke="#3B82F6"
                strokeWidth={3}
                name="Avg Risk Score"
                dot={{ fill: '#3B82F6', r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="highRisk"
                stroke="#DC2626"
                strokeWidth={3}
                name="High-Risk Accounts"
                dot={{ fill: '#DC2626', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex items-center gap-4 mt-4 p-3 bg-blue-50 rounded-lg">
            <TrendingDown className="text-green-600" size={20} />
            <p className="text-sm text-slate-700">
              <span className="font-semibold">Portfolio improving:</span> Average risk decreased by 4.5% since December
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
