import React, { useState, useRef, useEffect } from 'react';
import type { WorkerProfile, EmployerProfile } from '../types';
import { GlobeIcon } from './icons/GlobeIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { UserIcon } from './icons/UserIcon';
import { Cog6ToothIcon } from './icons/Cog6ToothIcon';
import { ArrowRightOnRectangleIcon } from './icons/ArrowRightOnRectangleIcon';
import { useLocalization } from '../lib/localization';


interface HeaderProps {
  userProfile: WorkerProfile | EmployerProfile | null;
  onLogout: () => void;
  theme: string;
  toggleTheme: () => void;
  onNavigateToSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ userProfile, onLogout, theme, toggleTheme, onNavigateToSettings }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLocalization();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSettingsClick = () => {
    onNavigateToSettings();
    setDropdownOpen(false);
  }

  const getProfileName = () => {
    if (!userProfile) return '';
    return 'name' in userProfile ? userProfile.name : userProfile.companyName;
  }

  return (
    <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div 
            className="flex items-center gap-2 text-2xl font-bold text-slate-800 dark:text-white cursor-pointer"
        >
          <GlobeIcon className="w-8 h-8 text-teal-500" />
          <span>{t('appName')}</span>
        </div>
        
        <div className="flex items-center gap-4">
            <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                aria-label="Toggle theme"
            >
                {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>

            {userProfile && (
                <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-slate-600 dark:text-slate-300"/>
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20">
                            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{getProfileName()}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{userProfile.email}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{userProfile.location}</p>
                            </div>
                            <button
                                onClick={handleSettingsClick}
                                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                                <Cog6ToothIcon className="w-5 h-5"/> {t('header.settings')}
                            </button>
                            <button
                                onClick={onLogout}
                                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                            >
                                <ArrowRightOnRectangleIcon className="w-5 h-5"/> {t('header.logout')}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
