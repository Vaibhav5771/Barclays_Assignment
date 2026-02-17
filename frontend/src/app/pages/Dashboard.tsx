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

    // Remove duplicate useEffect
    useEffect(() => {
        console.log('📊 Dashboard: fetching metrics from backend...');

        fetchDashboardMetrics()
            .then((data) => {
                console.log('✅ Dashboard API response:', data);
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

    console.log('🧠 Render state:', {
        loading,
        portfolioMetrics,
        riskDistributionLength: riskDistribution.length,
        riskTrendDataLength: riskTrendData.length,
        interventionEffectivenessLength: interventionEffectiveness.length
    });

    // Loading state - responsive
    if (loading || !portfolioMetrics) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center p-4 sm:p-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm sm:text-base text-slate-600">
                        Loading dashboard insights…
                    </p>
                </div>
            </div>
        );
    }

    const COLORS = {
        Low: '#3B82F6',
        Medium: '#F59E0B',
        High: '#DC2626'
    };

    // Metric cards data
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
            title: 'Prevented Defaults',
            value: portfolioMetrics.preventedDefaults30d.toLocaleString(),
            subtitle: `Est. savings: $${(portfolioMetrics.estimatedSavings / 1000).toFixed(0)}K`,
            icon: Target,
            bgColor: 'bg-green-50',
            textColor: 'text-green-600'
        }
    ];

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                        Risk Monitoring Dashboard
                    </h2>
                    <p className="text-sm sm:text-base text-slate-600 mt-1">
                        Real-time portfolio health and intervention effectiveness
                    </p>
                </div>

                {/* Optional: Add date filter or refresh button here */}
                <div className="text-xs sm:text-sm text-slate-500">
                    Last updated: {new Date().toLocaleDateString()}
                </div>
            </div>

            {/* Metric Cards - Responsive grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {metricCards.map((metric) => {
                    const Icon = metric.icon;
                    return (
                        <Card key={metric.title} className="p-4 sm:p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="min-w-0 flex-1">
                                    <p className="text-xs sm:text-sm text-slate-600 mb-1 truncate">
                                        {metric.title}
                                    </p>
                                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 truncate">
                                        {metric.value}
                                    </p>
                                    {metric.subtitle && (
                                        <p className="text-xs text-slate-500 mt-1 truncate">
                                            {metric.subtitle}
                                        </p>
                                    )}
                                </div>
                                <div className={`${metric.bgColor} p-2 sm:p-3 rounded-lg ml-2 flex-shrink-0`}>
                                    <Icon className={metric.textColor} size={20} sm:size={24} />
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            {/* Main Charts Row - Stack on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Portfolio Risk Distribution */}
                <Card className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">
                        Portfolio Risk Distribution
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-6">
                        Current customer risk segmentation
                    </p>

                    {/* Chart - Responsive height */}
                    <div className="h-[250px] sm:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={riskDistribution}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ bucket, percentage }) =>
                                        window.innerWidth < 640 ? `${percentage}%` : `${bucket}: ${percentage}%`
                                    }
                                    outerRadius={window.innerWidth < 640 ? 70 : 100}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {riskDistribution.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[entry.bucket as keyof typeof COLORS]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend - Responsive grid */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
                        {riskDistribution.map((item) => (
                            <div key={item.bucket} className="text-center">
                                <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                                    <div
                                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[item.bucket as keyof typeof COLORS] }}
                                    />
                                    <span className="text-xs sm:text-sm font-semibold text-slate-900">
                                        {item.bucket}
                                    </span>
                                </div>
                                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">
                                    {item.count}
                                </p>
                                <p className="text-xs text-slate-600">
                                    {item.percentage}%
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Risk Trend Over Time */}
                <Card className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">
                        Portfolio Risk Trend
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mb-4 sm:mb-6">
                        6-month average risk score and high-risk account count
                    </p>

                    {/* Chart - Responsive height */}
                    <div className="h-[250px] sm:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={riskTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="month"
                                    stroke="#64748B"
                                    tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                                />
                                <YAxis
                                    yAxisId="left"
                                    stroke="#64748B"
                                    tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                                    width={window.innerWidth < 640 ? 30 : 40}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    stroke="#64748B"
                                    tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                                    width={window.innerWidth < 640 ? 30 : 40}
                                />
                                <Tooltip />
                                {window.innerWidth >= 640 && <Legend />}
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="avgRisk"
                                    stroke="#3B82F6"
                                    strokeWidth={window.innerWidth < 640 ? 2 : 3}
                                    name="Avg Risk Score"
                                    dot={{ fill: '#3B82F6', r: window.innerWidth < 640 ? 2 : 4 }}
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="highRisk"
                                    stroke="#DC2626"
                                    strokeWidth={window.innerWidth < 640 ? 2 : 3}
                                    name="High-Risk Accounts"
                                    dot={{ fill: '#DC2626', r: window.innerWidth < 640 ? 2 : 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Insight Banner - Responsive */}
                    <div className="flex items-center gap-2 sm:gap-4 mt-4 p-2 sm:p-3 bg-blue-50 rounded-lg">
                        <TrendingDown className="text-green-600 flex-shrink-0" size={16} sm:size={20} />
                        <p className="text-xs sm:text-sm text-slate-700">
                            <span className="font-semibold">Portfolio improving:</span>
                            <span className="hidden sm:inline"> Average risk decreased by 4.5% since December</span>
                            <span className="sm:hidden"> Risk down 4.5% since Dec</span>
                        </p>
                    </div>
                </Card>
            </div>

            {/* Intervention Effectiveness Section - Optional Add-on */}

        </div>
    );
}