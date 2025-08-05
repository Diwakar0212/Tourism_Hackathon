import React, { useState } from 'react';
import { Bot, MessageSquare, AlertTriangle, Zap } from 'lucide-react';
import AIAssistant from './AIAssistant';

export const AIDemo: React.FC = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Bot className="w-16 h-16 text-blue-600" />
            <h1 className="text-5xl font-bold text-gray-900">SafeSolo AI</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the next generation of AI-powered travel assistance. Our enhanced AI provides 
            safety guidance, emergency response, cultural insights, and personalized travel planning.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Chat</h3>
            <p className="text-sm text-gray-600">Contextual conversations with memory</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Emergency AI</h3>
            <p className="text-sm text-gray-600">Immediate crisis response system</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Multi-Agent</h3>
            <p className="text-sm text-gray-600">Specialized AI for different needs</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Real-time</h3>
            <p className="text-sm text-gray-600">Instant responses and updates</p>
          </div>
        </div>

        {/* Demo CTA */}
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Try the Enhanced AI Assistant</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Chat with our advanced AI system that understands context, provides emergency assistance, 
            creates personalized itineraries, and offers cultural guidance for safe solo travel.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => setIsAssistantOpen(true)}
              className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-lg"
            >
              <MessageSquare className="w-6 h-6" />
              <span>Start AI Chat</span>
            </button>
            
            <button
              onClick={() => {
                setIsAssistantOpen(true);
                // Simulate emergency
                setTimeout(() => {
                  // This would trigger emergency mode
                }, 1000);
              }}
              className="bg-red-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 text-lg"
            >
              <AlertTriangle className="w-6 h-6" />
              <span>Test Emergency AI</span>
            </button>
          </div>

          {/* Example Queries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Try asking:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• "What are the safety tips for Tokyo?"</li>
                <li>• "Create a 3-day itinerary for Barcelona"</li>
                <li>• "Emergency: I'm lost in Rome"</li>
                <li>• "Cultural etiquette for visiting temples"</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">AI Features:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Context-aware conversations</li>
                <li>• Emergency response protocols</li>
                <li>• Multi-language support</li>
                <li>• Real-time safety updates</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">AI System Online</span>
          </div>
        </div>
      </div>

      {/* AI Assistant */}
      <AIAssistant
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        userContext={{
          location: { city: 'New York', country: 'USA' },
          preferences: { 
            language: 'en', 
            riskTolerance: 'medium',
            travelStyle: 'explorer',
            interests: ['culture', 'food', 'adventure']
          }
        }}
      />
    </div>
  );
};

export default AIDemo;
