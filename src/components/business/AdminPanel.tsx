import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Download,
  RefreshCw
} from 'lucide-react';

interface AdminMetrics {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  safetyEvents: number;
  criticalAlerts: number;
  systemStatus: 'healthy' | 'warning' | 'critical';
  responseTime: number;
}

interface RecentActivity {
  id: string;
  type: 'user_signup' | 'subscription' | 'safety_alert' | 'system_event';
  message: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error';
}

const AdminPanel: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAdminData();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchAdminData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAdminData = async () => {
    try {
      setRefreshing(true);
      
      // Mock data for demonstration
      // In production, these would be actual API calls
      setTimeout(() => {
        setMetrics({
          totalUsers: 15847,
          activeUsers: 3291,
          totalRevenue: 287450,
          monthlyRevenue: 45780,
          safetyEvents: 1247,
          criticalAlerts: 12,
          systemStatus: 'healthy',
          responseTime: 1.2
        });

        setRecentActivity([
          {
            id: '1',
            type: 'safety_alert',
            message: 'Critical SOS alert triggered by user in Tokyo',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            severity: 'error'
          },
          {
            id: '2',
            type: 'subscription',
            message: 'New premium subscription: SafeSolo Premium',
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            severity: 'info'
          },
          {
            id: '3',
            type: 'user_signup',
            message: '5 new users registered in the last hour',
            timestamp: new Date(Date.now() - 25 * 60 * 1000),
            severity: 'info'
          },
          {
            id: '4',
            type: 'system_event',
            message: 'Background sync completed successfully',
            timestamp: new Date(Date.now() - 35 * 60 * 1000),
            severity: 'info'
          },
          {
            id: '5',
            type: 'safety_alert',
            message: 'Check-in missed alert resolved automatically',
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            severity: 'warning'
          }
        ]);

        setLoading(false);
        setRefreshing(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      setLoading(false);
      setRefreshing(false);
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

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'user_signup':
        return <Users className="h-4 w-4" />;
      case 'subscription':
        return <DollarSign className="h-4 w-4" />;
      case 'safety_alert':
        return <Shield className="h-4 w-4" />;
      case 'system_event':
        return <Activity className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: RecentActivity['severity']) => {
    switch (severity) {
      case 'error':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'info':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSystemStatusColor = (status: AdminMetrics['systemStatus']) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleExportData = () => {
    // Mock export functionality
    console.log('Exporting admin data...');
    // In production, this would trigger a data export
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-2">SafeSolo system monitoring and administration</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchAdminData}
              disabled={refreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            
            <button
              onClick={handleExportData}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* System Status */}
        {metrics && (
          <div className="mb-8">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${getSystemStatusColor(metrics.systemStatus)}`}>
              <CheckCircle className="h-4 w-4" />
              <span>System Status: {metrics.systemStatus.charAt(0).toUpperCase() + metrics.systemStatus.slice(1)}</span>
              <span className="text-xs">({metrics.responseTime}s avg response)</span>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.totalUsers.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {metrics.activeUsers.toLocaleString()} active
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(metrics.totalRevenue)}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {formatCurrency(metrics.monthlyRevenue)} this month
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Safety Events</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {metrics.safetyEvents.toLocaleString()}
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    {metrics.criticalAlerts} critical alerts
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                  <p className="text-2xl font-bold text-gray-900">+23.5%</p>
                  <p className="text-sm text-green-600 mt-1">Month over month</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getSeverityColor(activity.severity)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <p className="text-xs text-gray-500">
                          {activity.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Critical Alerts</h2>
            </div>
            <div className="p-6">
              {metrics && metrics.criticalAlerts > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        {metrics.criticalAlerts} active critical alerts
                      </p>
                      <p className="text-xs text-red-600">
                        Immediate attention required
                      </p>
                    </div>
                  </div>
                  
                  <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">
                    View All Critical Alerts
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-gray-600">No critical alerts</p>
                  <p className="text-sm text-gray-500">All systems operational</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow mt-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Users className="h-5 w-5 text-gray-600" />
                <span>Manage Users</span>
              </button>
              
              <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Shield className="h-5 w-5 text-gray-600" />
                <span>Safety Dashboard</span>
              </button>
              
              <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Activity className="h-5 w-5 text-gray-600" />
                <span>System Logs</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
