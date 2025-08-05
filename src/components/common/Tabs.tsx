import React, { useState } from 'react';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    if (tabs.find(tab => tab.id === tabId)?.disabled) return;
    
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const getTabClasses = (tab: TabItem, isActive: boolean) => {
    const baseClasses = `
      flex items-center px-4 py-2 text-sm font-medium transition-colors
      cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500
      ${tab.disabled ? 'opacity-50 cursor-not-allowed' : ''}
    `;

    switch (variant) {
      case 'pills':
        return `${baseClasses} rounded-lg ${
          isActive
            ? 'bg-blue-600 text-white'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`;
      
      case 'underline':
        return `${baseClasses} border-b-2 ${
          isActive
            ? 'border-blue-600 text-blue-600'
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
        }`;
      
      default:
        return `${baseClasses} border border-gray-300 ${
          isActive
            ? 'bg-white text-blue-600 border-blue-600'
            : 'bg-gray-50 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        } first:rounded-l-lg last:rounded-r-lg border-r-0 last:border-r`;
    }
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className={className}>
      {/* Tab Navigation */}
      <div className={`
        flex ${variant === 'underline' ? 'border-b border-gray-200' : ''}
        ${variant === 'pills' ? 'space-x-2' : ''}
      `}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={getTabClasses(tab, isActive)}
              disabled={tab.disabled}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
            >
              {tab.icon && (
                <span className="mr-2 w-4 h-4">{tab.icon}</span>
              )}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTabContent && (
          <div
            role="tabpanel"
            id={`tabpanel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
          >
            {activeTabContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tabs;
