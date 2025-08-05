import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertTriangle, Map, Globe, Shield, X, Minimize2, Maximize2 } from 'lucide-react';
import { mockAIService } from '../../services/mockAI';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'emergency' | 'safety' | 'itinerary' | 'cultural';
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  userContext?: {
    location?: { city: string; country: string };
    currentTrip?: any;
    preferences?: any;
  };
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, userContext }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your SafeSolo AI Assistant. I can help with travel planning, safety advice, emergency guidance, and cultural insights. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [assistantType, setAssistantType] = useState<'safety' | 'planner' | 'emergency' | 'cultural'>('safety');
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await mockAIService.processMessage(
        inputMessage,
        assistantType,
        userContext
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.response,
        timestamp: new Date(),
        type: aiResponse.type || (assistantType === 'planner' ? 'itinerary' : assistantType as any)
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergency = async () => {
    setAssistantType('emergency');
    const emergencyMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: 'EMERGENCY: I need immediate help!',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, emergencyMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await mockAIService.processEmergency({
        severity: 'high',
        type: 'safety',
        location: userContext?.location || { latitude: 0, longitude: 0 },
        description: 'User requested emergency assistance',
        immediateHelp: true
      });

      const emergencyResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.response,
        timestamp: new Date(),
        type: 'emergency'
      };

      setMessages(prev => [...prev, emergencyResponse]);
    } catch (error) {
      console.error('Emergency request failed:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'EMERGENCY: If you are in immediate danger, contact local emergency services: 911 (US), 112 (EU), or your local emergency number.',
        timestamp: new Date(),
        type: 'emergency'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed right-4 bottom-4 bg-white rounded-lg shadow-2xl border border-gray-200 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    } z-50`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold">SafeSolo AI</span>
          <div className="flex space-x-1">
            <button
              onClick={() => setAssistantType('safety')}
              className={`p-1 rounded ${assistantType === 'safety' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              title="Safety Assistant"
            >
              <Shield className="w-3 h-3" />
            </button>
            <button
              onClick={() => setAssistantType('planner')}
              className={`p-1 rounded ${assistantType === 'planner' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              title="Travel Planner"
            >
              <Map className="w-3 h-3" />
            </button>
            <button
              onClick={() => setAssistantType('cultural')}
              className={`p-1 rounded ${assistantType === 'cultural' ? 'bg-white/20' : 'hover:bg-white/10'}`}
              title="Cultural Guide"
            >
              <Globe className="w-3 h-3" />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleEmergency}
            className="p-1 hover:bg-red-500 rounded transition-colors"
            title="Emergency Help"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Assistant Type Indicator */}
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center space-x-2 text-sm">
              {assistantType === 'safety' && (
                <>
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-600 font-medium">Safety Assistant</span>
                </>
              )}
              {assistantType === 'planner' && (
                <>
                  <Map className="w-4 h-4 text-green-600" />
                  <span className="text-green-600 font-medium">Travel Planner</span>
                </>
              )}
              {assistantType === 'emergency' && (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="text-red-600 font-medium">Emergency Response</span>
                </>
              )}
              {assistantType === 'cultural' && (
                <>
                  <Globe className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-600 font-medium">Cultural Guide</span>
                </>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 h-96">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : message.type === 'emergency'
                      ? 'bg-red-50 text-red-900 border border-red-200'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === 'assistant' && (
                      <Bot className={`w-4 h-4 mt-0.5 ${
                        message.type === 'emergency' ? 'text-red-600' : 'text-blue-600'
                      }`} />
                    )}
                    {message.role === 'user' && <User className="w-4 h-4 mt-0.5" />}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Ask ${assistantType} AI anything...`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => setInputMessage('What are the safety tips for my destination?')}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Safety Tips
              </button>
              <button
                onClick={() => setInputMessage('Create a 3-day itinerary for my trip')}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Plan Trip
              </button>
              <button
                onClick={() => setInputMessage('What should I know about local culture?')}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Culture Guide
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAssistant;
