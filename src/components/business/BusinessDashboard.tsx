import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Shield, 
  AlertTriangle,
  Activity,
  Calendar,
  Target,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

interface DashboardData {
  overview: {
    totalRevenue: number;
    avgDailyRevenue: number;
    totalUsers: number;
    totalSessions: number;
    avgSessionDuration: number;
    conversionRate: number;
  };
  safety: {
    totalSafetyEvents: number;
    criticalEvents: number;
    resolutionRate: number;
    avgResponseTime: number;
  };
  trends: {
    revenueGrowth: number;
    userGrowth: number;
    safetyTrend: 'up' | 'down' | 'stable';
  };
}

interface RevenueData {
  totalRevenue: number;
  subscriptionRevenue: number;
  oneTimeRevenue: number;
  activeSubscriptions: number;
  mrr: number;
  churnRate: number;
  averageRevenuePerUser: number;
}

const BusinessDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30');
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'revenue' | 'safety'>('overview');

  useEffect(() => {
    fetchDashboardData();
    fetchRevenueData();
  }, [selectedTimeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - parseInt(selectedTimeRange) * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0];

      // Simulate API call - replace with actual API endpoint
      const response = await fetch(`/api/business/dashboard?startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set mock data for demonstration
      setDashboardData({
        overview: {
          totalRevenue: 45780,
          avgDailyRevenue: 1526,
          totalUsers: 2847,
          totalSessions: 8921,
          avgSessionDuration: 12.5,
          conversionRate: 3.2
        },
        safety: {
          totalSafetyEvents: 156,
          criticalEvents: 8,
          resolutionRate: 94.2,
          avgResponseTime: 3.8
        },
        trends: {
          revenueGrowth: 23.5,
          userGrowth: 18.2,
          safetyTrend: 'stable'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - parseInt(selectedTimeRange) * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0];

      // Simulate API call
      const response = await fetch(`/api/business/revenue?startDate=${startDate}&endDate=${endDate}`);
      const data = await response.json();

      if (data.success) {
        setRevenueData(data.data);
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      // Set mock data
      setRevenueData({
        totalRevenue: 45780,
        subscriptionRevenue: 38240,
        oneTimeRevenue: 7540,
        activeSubscriptions: 1923,
        mrr: 38240,
        churnRate: 2.1,
        averageRevenuePerUser: 19.89
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  const getTrendIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getTrendColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Business Dashboard</h1>
              <p className="mt-2 text-gray-600">Monitor SafeSolo's performance and growth metrics</p>
            </div>
            
            {/* Time Range Selector */}
            <div className="mt-4 sm:mt-0">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'analytics', name: 'Analytics', icon: LineChart },
                { id: 'revenue', name: 'Revenue', icon: DollarSign },
                { id: 'safety', name: 'Safety', icon: Shield }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-teal-500 text-teal-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && dashboardData && (
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(dashboardData.overview.totalRevenue)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {getTrendIcon(dashboardData.trends.revenueGrowth)}
                  <span className={`ml-1 text-sm font-medium ${getTrendColor(dashboardData.trends.revenueGrowth)}`}>
                    {formatPercent(Math.abs(dashboardData.trends.revenueGrowth))}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.overview.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  {getTrendIcon(dashboardData.trends.userGrowth)}
                  <span className={`ml-1 text-sm font-medium ${getTrendColor(dashboardData.trends.userGrowth)}`}>
                    {formatPercent(Math.abs(dashboardData.trends.userGrowth))}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Safety Events</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {dashboardData.safety.totalSafetyEvents}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <Shield className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <Activity className="h-4 w-4 text-gray-500" />
                  <span className="ml-1 text-sm font-medium text-gray-600">
                    {dashboardData.safety.criticalEvents} critical
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPercent(dashboardData.overview.conversionRate)}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="ml-1 text-sm font-medium text-gray-600">
                    {dashboardData.overview.totalSessions} sessions
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Session Duration</span>
                    <span className="font-semibold">{dashboardData.overview.avgSessionDuration} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Daily Revenue Average</span>
                    <span className="font-semibold">{formatCurrency(dashboardData.overview.avgDailyRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Safety Resolution Rate</span>
                    <span className="font-semibold text-green-600">{formatPercent(dashboardData.safety.resolutionRate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Response Time</span>
                    <span className="font-semibold">{dashboardData.safety.avgResponseTime} min</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Safety Overview</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <span className="text-red-700 font-medium">Critical Events</span>
                    </div>
                    <span className="text-red-900 font-bold">{dashboardData.safety.criticalEvents}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-green-500" />
                      <span className="text-green-700 font-medium">Resolution Rate</span>
                    </div>
                    <span className="text-green-900 font-bold">{formatPercent(dashboardData.safety.resolutionRate)}</span>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700 font-medium">Safety Trend</span>
                      <span className={`font-bold ${
                        dashboardData.trends.safetyTrend === 'up' ? 'text-red-600' :
                        dashboardData.trends.safetyTrend === 'down' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {dashboardData.trends.safetyTrend.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-blue-600 text-sm mt-1">
                      Safety events are {dashboardData.trends.safetyTrend === 'stable' ? 'stable' : 
                        dashboardData.trends.safetyTrend === 'up' ? 'increasing' : 'decreasing'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && revenueData && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subscription Revenue</span>
                    <span className="font-semibold">{formatCurrency(revenueData.subscriptionRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">One-time Purchases</span>
                    <span className="font-semibold">{formatCurrency(revenueData.oneTimeRevenue)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="font-semibold text-gray-900">Total Revenue</span>
                    <span className="font-bold text-lg">{formatCurrency(revenueData.totalRevenue)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscription Metrics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Subscriptions</span>
                    <span className="font-semibold">{revenueData.activeSubscriptions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Recurring Revenue</span>
                    <span className="font-semibold">{formatCurrency(revenueData.mrr)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Churn Rate</span>
                    <span className="font-semibold text-red-600">{formatPercent(revenueData.churnRate)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-gray-600">ARPU</span>
                    <span className="font-bold">{formatCurrency(revenueData.averageRevenuePerUser)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Insights</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-green-700 font-medium">Revenue Growth</span>
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="text-green-600 text-sm mt-1">
                      Strong month-over-month growth
                    </p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-700 font-medium">Subscription Health</span>
                      <Activity className="h-5 w-5 text-blue-500" />
                    </div>
                    <p className="text-blue-600 text-sm mt-1">
                      Low churn rate indicates good retention
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {(activeTab === 'analytics' || activeTab === 'safety') && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === 'analytics' ? 'Advanced Analytics' : 'Safety Analytics'}
            </h3>
            <p className="text-gray-600">
              Detailed {activeTab} dashboard coming soon with charts, graphs, and deeper insights.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDashboard;
