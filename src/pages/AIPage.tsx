import React, { useState } from 'react';
import { Bot, Shield, Map, Globe, AlertTriangle, MessageSquare, TrendingUp, Zap } from 'lucide-react';
import AIAssistant from '../components/ai/AIAssistant';
import AIAnalyticsPanel from '../components/ai/AIAnalyticsPanel';

const AIPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'analytics'>('overview');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  const features = [
    {
      icon: Shield,
      title: 'Safety Assistant',
      description: 'Get real-time safety advice, risk assessments, and emergency guidance for any destination.',
      color: 'blue',
      stats: '180 assessments today'
    },
    {
      icon: Map,
      title: 'Smart Travel Planner',
      description: 'AI-powered itinerary generation with safety-first recommendations and cultural insights.',
      color: 'green',
      stats: '340 itineraries created'
    },
    {
      icon: AlertTriangle,
      title: 'Emergency Response',
      description: 'Immediate emergency assistance with step-by-step guidance and local emergency contacts.',
      color: 'red',
      stats: '25 emergency responses'
    },
    {
      icon: Globe,
      title: 'Cultural Guide',
      description: 'Navigate cultural differences safely with etiquette tips, customs, and local insights.',
      color: 'purple',
      stats: '95 cultural guides provided'
    }
  ];

  const capabilities = [
    'Multi-language support for global travelers',
    'Real-time location-based safety updates',
    'Personalized recommendations based on your profile',
    'Emergency contact integration and notifications',
    'Offline capability for critical safety information',
    'Cultural sensitivity and local law awareness',
    'Budget-conscious safety recommendations',
    'Gender-specific safety considerations'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Bot className="w-12 h-12" />
              <h1 className="text-4xl font-bold">SafeSolo AI Assistant</h1>
            </div>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Your intelligent travel companion powered by advanced AI. Get personalized safety advice, 
              emergency assistance, and cultural guidance for safe solo travel anywhere in the world.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => setIsAssistantOpen(true)}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Start Chatting</span>
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors flex items-center space-x-2"
              >
                <TrendingUp className="w-5 h-5" />
                <span>View Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'chat'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              AI Chat Interface
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Key Features */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">AI-Powered Travel Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg bg-${feature.color}-100`}>
                        <feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                        <p className="text-gray-600 mb-4">{feature.description}</p>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600 font-medium">{feature.stats}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* AI Capabilities */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Advanced AI Capabilities</h2>
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {capabilities.map((capability, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Zap className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How SafeSolo AI Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Ask Anything</h3>
                  <p className="text-gray-600">
                    Chat with our AI about travel plans, safety concerns, cultural questions, or emergencies.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">2. AI Analysis</h3>
                  <p className="text-gray-600">
                    Our AI analyzes your location, preferences, and context to provide personalized recommendations.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Safe Guidance</h3>
                  <p className="text-gray-600">
                    Receive safety-first recommendations, cultural insights, and actionable travel advice.
                  </p>
                </div>
              </div>
            </section>

            {/* Emergency Features */}
            <section>
              <div className="bg-red-50 border border-red-200 rounded-xl p-8">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="w-8 h-8 text-red-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-red-900 mb-2">Emergency Response System</h3>
                    <p className="text-red-700 mb-4">
                      In case of emergency, our AI provides immediate assistance with step-by-step guidance, 
                      local emergency contacts, and coordination with your emergency contacts.
                    </p>
                    <button
                      onClick={() => setIsAssistantOpen(true)}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Access Emergency AI
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">AI Chat Interface</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Interact with our AI assistant through the chat interface. Choose from different AI personalities 
                specialized in safety, travel planning, emergency response, and cultural guidance.
              </p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div className="text-center">
                <Bot className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Chatting with SafeSolo AI</h3>
                <p className="text-gray-600 mb-6">
                  Click the button below to open the AI chat interface and start getting personalized travel assistance.
                </p>
                <button
                  onClick={() => setIsAssistantOpen(true)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center space-x-2 mx-auto"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Open AI Chat</span>
                </button>
              </div>
            </div>

            {/* AI Types */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 text-center">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Safety AI</h4>
                <p className="text-sm text-gray-600">Risk assessment and safety guidance</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 text-center">
                <Map className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Planner AI</h4>
                <p className="text-sm text-gray-600">Itinerary and travel planning</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Emergency AI</h4>
                <p className="text-sm text-gray-600">Crisis response and emergency help</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 text-center">
                <Globe className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">Cultural AI</h4>
                <p className="text-sm text-gray-600">Cultural guidance and etiquette</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && <AIAnalyticsPanel />}
      </div>

      {/* AI Assistant */}
      <AIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        userContext={{
          location: { city: 'New York', country: 'USA' },
          preferences: { language: 'en', riskTolerance: 'medium' }
        }}
      />
    </div>
  );
};

export default AIPage;
