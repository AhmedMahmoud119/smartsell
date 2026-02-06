'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import CurrenciesTab from './tabs/CurrenciesTab';

type TabType = 'currencies' | 'general' | 'billing';

export default function SettingsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('currencies');

  const tabs = [
    { id: 'currencies' as TabType, label: t('settings.currencies') || 'Currencies', icon: '💱' },
    { id: 'general' as TabType, label: t('settings.general') || 'General', icon: '⚙️' },
    { id: 'billing' as TabType, label: t('settings.billing') || 'Billing', icon: '💳' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('settings.title') || 'Settings'}
        </h1>
        <p className="text-gray-600 mt-2">
          {t('settings.description') || 'Manage your workspace settings and preferences'}
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="me-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'currencies' && <CurrenciesTab />}
          {activeTab === 'general' && (
            <div className="text-center py-12 text-gray-500">
              {t('settings.comingSoon') || 'Coming soon...'}
            </div>
          )}
          {activeTab === 'billing' && (
            <div className="text-center py-12 text-gray-500">
              {t('settings.comingSoon') || 'Coming soon...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
