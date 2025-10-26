import React, { useState } from 'react';
import type { User, UserType, WorkerProfile, EmployerProfile } from '../types';
import { useLocalization } from '../lib/localization';

interface OnboardingProps {
  currentUser: User;
  onOnboardingComplete: (
    profileData: Partial<WorkerProfile & EmployerProfile>,
    userType: UserType
  ) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({
  currentUser,
  onOnboardingComplete,
}) => {
  const [step, setStep] = useState(1);
  const { locale, setLocale, t } = useLocalization();
  const [category, setCategory] = useState<'it' | 'non-it' | ''>('');
  const [role, setRole] = useState<'giver' | 'seeker' | ''>('');
  const [selectedProfession, setSelectedProfession] = useState<string>('');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    contact: '',
    location: '',
    companyName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const IT_PROFESSIONS = [
    'professions.software',
    'professions.design',
    'professions.marketing',
    'professions.sales',
  ];

  const NON_IT_PROFESSIONS = [
    'professions.carpenter',
    'professions.electrician',
    'professions.plumber',
    'professions.painter',
    'professions.mason',
    'professions.cleaning',
    'professions.driver',
    'professions.agriculture',
    'professions.handyman',
    'professions.hairdresser',
    'professions.healthcare',
    'professions.construction',
  ];

  const inputClass = `w-full p-2 border rounded-md bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100`;
  const primaryButtonClass = `px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition`;
  const backButtonClass = `px-4 py-2 border border-gray-400 dark:border-slate-600 rounded text-gray-800 dark:text-slate-100`;

  const renderError = (field: string) =>
    errors[field] ? (
      <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
    ) : null;

  const handleNextStep = (nextStep: number) => {
    if (step === 1 && !locale) {
      setErrors({ language: t('onboarding.step1.error') });
      return;
    }
    if (step === 2 && !category) {
      setErrors({ category: t('onboarding.step2.error') });
      return;
    }
    if (step === 3) {
      if (!role) {
        setErrors({ role: t('onboarding.step3.error') });
        return;
      }
      if (role === 'giver' && !selectedProfession) {
        setErrors({ profession: t('onboarding.step3.professionRequired') });
        return;
      }
    }
    setErrors({});
    setStep(nextStep);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!profile.name) newErrors.name = t('onboarding.errors.required');
    if (!profile.email) newErrors.email = t('onboarding.errors.email');
    if (!profile.contact) newErrors.contact = t('onboarding.errors.contact');
    if (!profile.location) newErrors.location = t('onboarding.errors.required');

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    onOnboardingComplete(
      { locale, category, role, profession: selectedProfession, profile },
      role as UserType
    );
    setStep(5);
  };

  const renderProfessions = (list: string[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
      {list.map((key) => {
        const value = t(key);
        const isSelected = selectedProfession === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedProfession(key)}
            className={`px-3 py-2 rounded-lg border-2 font-medium transition ${
              isSelected
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-gray-300 dark:border-slate-600 text-gray-800 dark:text-slate-100 hover:border-indigo-400 dark:hover:border-indigo-500'
            }`}
          >
            {value}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-xl mx-auto p-4 text-gray-900 dark:text-slate-100">
      {/* Step 1 - Language */}
      {step === 1 && (
        <div className="animate-fadeIn">
          <h2 className="text-2xl font-semibold mb-4">
            {t('onboarding.step1.title')}
          </h2>
          <label
            htmlFor="la
