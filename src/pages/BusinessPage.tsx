import React, { useState } from 'react';
import { BarChart3, CreditCard, Settings, Users, Shield } from 'lucide-react';
import BusinessDashboard from '../components/business/BusinessDashboard';
import SubscriptionManager from '../components/business/SubscriptionManager';
import AdminPanel from '../components/business/AdminPanel';

const BusinessPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'subscriptions' | 'admin' | 'settings'>('dashboard');

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'subscriptions', name: 'Subscriptions', icon: CreditCard },
    { id: 'admin', name: 'Admin', icon: Shield },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <BusinessDashboard />;
      case 'subscriptions':
        return <SubscriptionManager />;
      case 'admin':
        return <AdminPanel />;
      case 'settings':
        return (
          <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <Settings className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Settings</h3>
                <p className="text-gray-600">
                  Configure your business preferences, notifications, and integrations.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return <BusinessDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-teal-600" />
                <h1 className="text-xl font-bold text-gray-900">SafeSolo Business</h1>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'text-teal-600 bg-teal-50'
                        : 'text-gray-600 hover:text-teal-600 hover:bg-teal-50'
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
      </div>

      {/* Tab Content */}
      {renderActiveTab()}
    </div>
  );
};

export default BusinessPage;
