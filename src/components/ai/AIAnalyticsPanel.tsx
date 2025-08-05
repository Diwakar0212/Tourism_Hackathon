import React, { useState, useEffect } from 'react';
import { Bot, TrendingUp, AlertTriangle, Map, Globe, Shield, Clock, CheckCircle } from 'lucide-react';

interface AIAnalytics {
  totalRequests: number;
  emergencyResponses: number;
  itinerariesGenerated: number;
  safetyAssessments: number;
  culturalGuidance: number;
  averageResponseTime: string;
  successRate: string;
  mostRequestedFeatures: Array<{
    feature: string;
    count: number;
  }>;
}

export const AIAnalyticsPanel: React.FC = () => {
  const [analytics, setAnalytics] = useState<AIAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/ai/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch AI analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center text-gray-500">
          <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Unable to load AI analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex items-center space-x-3">
          <Bot className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">AI Assistant Analytics</h2>
            <p className="text-blue-100">Real-time AI performance metrics</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.totalRequests.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Emergency Responses</p>
              <p className="text-3xl font-bold text-red-600">{analytics.emergencyResponses}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-3xl font-bold text-green-600">{analytics.successRate}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-3xl font-bold text-purple-600">{analytics.averageResponseTime}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Service Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Usage</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Map className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">Itineraries Generated</span>
              </div>
              <span className="font-semibold text-gray-900">{analytics.itinerariesGenerated}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">Safety Assessments</span>
              </div>
              <span className="font-semibold text-gray-900">{analytics.safetyAssessments}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700">Cultural Guidance</span>
              </div>
              <span className="font-semibold text-gray-900">{analytics.culturalGuidance}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="text-gray-700">Emergency Responses</span>
              </div>
              <span className="font-semibold text-gray-900">{analytics.emergencyResponses}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Requested Features</h3>
          <div className="space-y-3">
            {analytics.mostRequestedFeatures.map((feature, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">{feature.feature}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${(feature.count / Math.max(...analytics.mostRequestedFeatures.map(f => f.count))) * 100}%`
                      }}
                    />
                  </div>
                  <span className="font-semibold text-gray-900 w-8 text-right">{feature.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Performance Status */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Service Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-green-700 font-medium">Chat Service</span>
            <span className="text-green-600 text-sm">Operational</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-green-700 font-medium">Emergency Response</span>
            <span className="text-green-600 text-sm">Operational</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-green-700 font-medium">Itinerary Generation</span>
            <span className="text-green-600 text-sm">Operational</span>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-green-700 font-medium">Cultural Guidance</span>
            <span className="text-green-600 text-sm">Operational</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Map className="w-4 h-4 text-green-600" />
              <span className="text-gray-700">Itinerary generated for Tokyo, Japan</span>
            </div>
            <span className="text-sm text-gray-500">2 min ago</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Shield className="w-4 h-4 text-blue-600" />
              <span className="text-gray-700">Safety assessment for Barcelona, Spain</span>
            </div>
            <span className="text-sm text-gray-500">5 min ago</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Globe className="w-4 h-4 text-purple-600" />
              <span className="text-gray-700">Cultural guidance for Seoul, South Korea</span>
            </div>
            <span className="text-sm text-gray-500">8 min ago</span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-gray-700">Emergency response - Location assistance</span>
            </div>
            <span className="text-sm text-gray-500">15 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalyticsPanel;
