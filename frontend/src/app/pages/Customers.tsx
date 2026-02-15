import { useState } from 'react';
import { Link } from 'react-router';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { RiskBadge } from '../components/RiskBadge';
import { TrendIndicator } from '../components/TrendIndicator';
import { Search, Filter, ArrowUpDown, ChevronRight } from 'lucide-react';
import { customers } from '../data/mockData';

export function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [sortBy, setSortBy] = useState<'risk' | 'name' | 'utilization'>('risk');

  const filteredCustomers = customers
    .filter(customer => {
      const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           customer.accountNumber.includes(searchTerm);
      const matchesFilter = filterRisk === 'All' || customer.riskBucket === filterRisk;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'risk') return b.riskScore - a.riskScore;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'utilization') return b.utilizationRate - a.utilizationRate;
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Customer Risk Profiles</h2>
          <p className="text-slate-600 mt-1">Monitor and manage individual customer risk scores</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Export Report
        </Button>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <Input
              placeholder="Search by name or account number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filterRisk === 'All' ? 'default' : 'outline'}
              onClick={() => setFilterRisk('All')}
              size="sm"
            >
              All
            </Button>
            <Button
              variant={filterRisk === 'High' ? 'default' : 'outline'}
              onClick={() => setFilterRisk('High')}
              size="sm"
              className={filterRisk === 'High' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              High Risk
            </Button>
            <Button
              variant={filterRisk === 'Medium' ? 'default' : 'outline'}
              onClick={() => setFilterRisk('Medium')}
              size="sm"
              className={filterRisk === 'Medium' ? 'bg-amber-600 hover:bg-amber-700' : ''}
            >
              Medium Risk
            </Button>
            <Button
              variant={filterRisk === 'Low' ? 'default' : 'outline'}
              onClick={() => setFilterRisk('Low')}
              size="sm"
              className={filterRisk === 'Low' ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              Low Risk
            </Button>
          </div>

          <div className="flex gap-2 items-center">
            <ArrowUpDown size={16} className="text-slate-600" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="risk">Sort by Risk Score</option>
              <option value="name">Sort by Name</option>
              <option value="utilization">Sort by Utilization</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Customer List */}
      <div className="space-y-3">
        {filteredCustomers.map((customer) => (
          <Link key={customer.id} to={`/customers/${customer.id}`}>
            <Card className="p-5 hover:shadow-lg transition-shadow cursor-pointer border-l-4" style={{
              borderLeftColor: customer.riskBucket === 'High' ? '#DC2626' : 
                               customer.riskBucket === 'Medium' ? '#F59E0B' : '#3B82F6'
            }}>
              <div className="flex items-center gap-6">
                {/* Risk Score */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{
                    backgroundColor: customer.riskBucket === 'High' ? '#FEE2E2' :
                                    customer.riskBucket === 'Medium' ? '#FEF3C7' : '#DBEAFE',
                    color: customer.riskBucket === 'High' ? '#DC2626' :
                          customer.riskBucket === 'Medium' ? '#F59E0B' : '#3B82F6'
                  }}>
                    {customer.riskScore.toFixed(2)}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{customer.name}</h3>
                    <RiskBadge bucket={customer.riskBucket} size="sm" />
                    <TrendIndicator trend={customer.trend} size="sm" />
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{customer.accountNumber}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span>Last payment: {customer.daysSinceLastPayment} days ago</span>
                    <span>•</span>
                    <span>Avg delay: {customer.averagePaymentDelay} days</span>
                    <span>•</span>
                    <span>Payment coverage: {(customer.paymentCoverageRatio * 100).toFixed(0)}%</span>
                  </div>
                </div>

                {/* Balance & Utilization */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm text-slate-600 mb-1">Balance / Limit</p>
                  <p className="font-semibold text-slate-900">
                    ${customer.currentBalance.toLocaleString()} / ${customer.creditLimit.toLocaleString()}
                  </p>
                  <div className="mt-2">
                    <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all rounded-full"
                        style={{ 
                          width: `${customer.utilizationRate * 100}%`,
                          backgroundColor: customer.utilizationRate >= 0.8 ? '#DC2626' :
                                         customer.utilizationRate >= 0.5 ? '#F59E0B' : '#3B82F6'
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{(customer.utilizationRate * 100).toFixed(0)}% utilized</p>
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className="text-slate-400" size={20} />
              </div>

              {/* Behavior Flags */}
              {customer.behaviorFlags.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex flex-wrap gap-2">
                    {customer.behaviorFlags.map((flag, index) => (
                      <span 
                        key={index}
                        className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded"
                      >
                        {flag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </Link>
        ))}
      </div>

      {/* Results summary */}
      <div className="text-center text-sm text-slate-600">
        Showing {filteredCustomers.length} of {customers.length} customers
      </div>
    </div>
  );
}
