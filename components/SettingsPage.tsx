import React, { useState } from 'react';
import { UserIcon } from './icons/UserIcon';
import { LockClosedIcon } from './icons/LockClosedIcon';
import { EyeIcon } from './icons/EyeIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { useLocalization } from '../lib/localization';

interface SettingsPageProps {
  onBack: () => void;
}

type Category = 'account' | 'security' | 'visibility' | 'privacy';

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const { t } = useLocalization();
  const [activeCategory, setActiveCategory] = useState<Category>('account');

  const categories = [
    { id: 'account', label: t('settings.catAccount'), icon: <UserIcon className="w-5 h-5" /> },
    { id: 'security', label: t('settings.catSecurity'), icon: <LockClosedIcon className="w-5 h-5" /> },
    { id: 'visibility', label: t('settings.catVisibility'), icon: <EyeIcon className="w-5 h-5" /> },
    { id: 'privacy', label: t('settings.catPrivacy'), icon: <ShieldCheckIcon className="w-5 h-5" /> },
  ];

  const renderContent = () => {
    switch (activeCategory) {
      case 'account': return <AccountPreferences />;
      case 'security': return <SignInAndSecurity />;
      case 'visibility': return <Visibility />;
      case 'privacy': return <DataPrivacy />;
      default: return <AccountPreferences />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors duration-300">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg -ml-2 transition-colors">
          <ChevronLeftIcon className="w-5 h-5" />
          <span className="font-semibold text-sm">{t('settings.backButton')}</span>
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/3 lg:w-1/4">
          <nav className="space-y-1">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as Category)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-md transition-colors text-sm font-medium ${
                  activeCategory === cat.id
                    ? 'bg-teal-50 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 md:border-l md:pl-8 md:border-slate-200 dark:md:border-slate-700">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const SettingItem: React.FC<{ title: string; description: string; action?: React.ReactNode }> = ({ title, description, action }) => (
  <div className="flex justify-between items-start sm:items-center py-5 border-b border-slate-200 dark:border-slate-700 last:border-b-0 flex-col sm:flex-row gap-2">
    <div className="flex-1">
      <h4 className="font-semibold text-slate-800 dark:text-slate-100">{title}</h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
    </div>
    {action && <div className="ml-0 sm:ml-4 mt-2 sm:mt-0 flex-shrink-0">{action}</div>}
  </div>
);

const ActionButton: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <button className="px-4 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-full hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
        {children}
    </button>
);

const AccountPreferences: React.FC = () => {
    const { t } = useLocalization();
    return (
        <section>
            <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">{t('settings.catAccount')}</h3>
            <SettingItem title={t('settings.account.profileInfo.title')} description={t('settings.account.profileInfo.desc')} action={<ActionButton>{t('settings.actions.edit')}</ActionButton>} />
            <SettingItem title={t('settings.account.language.title')} description={t('settings.account.language.desc')} action={<ActionButton>{t('settings.actions.change')}</ActionButton>} />
            <SettingItem title={t('settings.account.subscriptions.title')} description={t('settings.account.subscriptions.desc')} action={<ActionButton>{t('settings.actions.manage')}</ActionButton>} />
        </section>
    );
};

const SignInAndSecurity: React.FC = () => {
    const { t } = useLocalization();
    return (
        <section>
            <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">{t('settings.catSecurity')}</h3>
            <SettingItem title={t('settings.security.email.title')} description={t('settings.security.email.desc')} action={<ActionButton>{t('settings.actions.change')}</ActionButton>} />
            <SettingItem title={t('settings.security.password.title')} description={t('settings.security.password.desc')} action={<ActionButton>{t('settings.actions.change')}</ActionButton>} />
            <SettingItem title={t('settings.security.sessions.title')} description={t('settings.security.sessions.desc')} action={<ActionButton>{t('settings.actions.view')}</ActionButton>} />
        </section>
    );
};

const Visibility: React.FC = () => {
    const { t } = useLocalization();
    return (
        <section>
            <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">{t('settings.catVisibility')}</h3>
            <SettingItem title={t('settings.visibility.profileViewing.title')} description={t('settings.visibility.profileViewing.desc')} action={<ActionButton>{t('settings.actions.change')}</ActionButton>} />
            <SettingItem title={t('settings.visibility.connections.title')} description={t('settings.visibility.connections.desc')} action={<ActionButton>{t('settings.actions.change')}</ActionButton>} />
        </section>
    );
};

const DataPrivacy: React.FC = () => {
    const { t } = useLocalization();
    return (
        <section>
            <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">{t('settings.catPrivacy')}</h3>
            <SettingItem title={t('settings.privacy.jobSeeking.title')} description={t('settings.privacy.jobSeeking.desc')} action={<ActionButton>{t('settings.actions.manage')}</ActionButton>} />
            <SettingItem title={t('settings.privacy.manageData.title')} description={t('settings.privacy.manageData.desc')} action={<ActionButton>{t('settings.actions.manage')}</ActionButton>} />
        </section>
    );
};

export default SettingsPage;