import React, { useState } from 'react';
import type { User, UserType, WorkerProfile, EmployerProfile } from '../types';
import { useLocalization } from '../lib/localization';

interface OnboardingProps {
  currentUser: User;
  onOnboardingComplete: (profileData: Partial<WorkerProfile & EmployerProfile>, userType: UserType) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ currentUser, onOnboardingComplete }) => {
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

  // professions lists (keys map to localization keys)
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
    // include already existing keys that are non-IT
    'professions.healthcare',
    'professions.construction',
  ];

  const inputClass = (field?: string) => `w-full p-2 border rounded-md bg-white dark:bg-slate-800`;
  const primaryButtonClass = 'px-4 py-2 bg-indigo-600 text-white rounded';
  const backButtonClass = 'px-4 py-2 border rounded';

  const renderError = (field: string) => {
    if (errors[field]) {
      return <p className="text-red-500 text-sm mt-1">{errors[field]}</p>;
    }
    return null;
  };

  const handleNextStep = (nextStep: number) => {
    // validation for step 1 (language)
    if (step === 1) {
      if (!locale) {
        setErrors({ language: t('onboarding.step1.error') });
        return;
      }
      setErrors({});
    }

    // validation for step 2 (category)
    if (step === 2) {
      if (!category) {
        setErrors({ category: t('onboarding.step2.error') || t('onboarding.errors.required') });
        return;
      }
      setErrors({});
    }

    // validation for step 3 (role & profession for giver)
    if (step === 3) {
      if (!role) {
        setErrors({ role: t('onboarding.step3.error') || t('onboarding.errors.required') });
        return;
      }
      if (role === 'giver' && !selectedProfession) {
        setErrors({ profession: t('onboarding.step3.professionRequired') || t('onboarding.errors.required') });
        return;
      }
      setErrors({});
    }

    setStep(nextStep);
  };

  const handleBackStep = (prevStep: number) => {
    setStep(prevStep);
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // simple validation
    const newErrors: Record<string, string> = {};
    if (!profile.name) newErrors.name = t('onboarding.errors.required');
    if (!profile.email) newErrors.email = t('onboarding.errors.email') || t('onboarding.errors.required');
    if (!profile.contact) newErrors.contact = t('onboarding.errors.contact') || t('onboarding.errors.required');
    if (!profile.location) newErrors.location = t('onboarding.errors.required');

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    // pass onboarding data up
    onOnboardingComplete({
      locale,
      category,
      role,
      profession: selectedProfession,
      profile,
    });
    setStep(5); // final step
  };

  // helper to render profession buttons
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
            className={`px-3 py-2 rounded-lg border-2 text-left transition-colors ${isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 dark:border-slate-600 text-gray-800 dark:text-slate-100 hover:border-indigo-400 dark:hover:border-indigo-500'}`}
          >
            {value}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="max-w-xl mx-auto p-4">
      {step === 1 && (
        <div className="animate-fadeIn">
          <h2 className="text-2xl text-gray-800 dark:text-slate-100 font-semibold mb-4">{t('onboarding.step1.title')}</h2>
          <label htmlFor="language-select" className="block text-left font-medium text-gray-700 dark:text-slate-300 mt-2.5">{t('onboarding.step1.label')} <span className="text-red-500">*</span></label>
          <select id="language-select" value={locale} onChange={(e) => setLocale(e.target.value)} className={inputClass('language')}>
            <option value="">{t('onboarding.step1.selectPlaceholder')}</option>
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
          </select>
          {renderError('language')}
          <div className="flex gap-4 mt-6">
            <button onClick={() => handleNextStep(2)} className={primaryButtonClass}>{t('onboarding.nextButton')}</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fadeIn">
          <h2 className="text-2xl text-gray-800 dark:text-slate-100 font-semibold mb-4">{t('onboarding.step2.title')}</h2>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              onClick={() => setCategory('it')}
              className={`w-full p-4 rounded-lg font-bold border-2 transition-colors ${category === 'it' ? 'bg-indigo-500 text-white border-indigo-500' : 'border-gray-300 dark:border-slate-600 text-gray-800 dark:text-slate-100 hover:border-indigo-400 dark:hover:border-indigo-500'}`}
            >
              {t('onboarding.step2.itButton')}
            </button>
            <button
              onClick={() => setCategory('non-it')}
              className={`w-full p-4 rounded-lg font-bold border-2 transition-colors ${category === 'non-it' ? 'bg-teal-500 text-white border-teal-500' : 'border-gray-300 dark:border-slate-600 text-gray-800 dark:text-slate-100 hover:border-teal-400 dark:hover:border-teal-500'}`}
            >
              {t('onboarding.step2.nonItButton')}
            </button>
          </div>

          {renderError('category')}
          <div className="flex gap-4 mt-6">
            <button onClick={() => handleBackStep(1)} className={backButtonClass}>{t('onboarding.backButton')}</button>
            <button onClick={() => handleNextStep(3)} className={primaryButtonClass}>{t('onboarding.nextButton')}</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fadeIn">
          <h2 className="text-2xl text-gray-800 dark:text-slate-100 font-semibold mb-4">{t('onboarding.step3.title')}</h2>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              onClick={() => { setRole('giver'); setSelectedProfession(''); }}
              className={`w-full p-4 rounded-lg font-bold border-2 transition-colors ${role === 'giver' ? 'bg-indigo-500 text-white border-indigo-500' : 'border-gray-300 dark:border-slate-600 text-gray-800 dark:text-slate-100 hover:border-indigo-400 dark:hover:border-indigo-500'}`}
            >
              {t('onboarding.step3.hireButton')}
            </button>
            <button
              onClick={() => { setRole('seeker'); setSelectedProfession(''); }}
              className={`w-full p-4 rounded-lg font-bold border-2 transition-colors ${role === 'seeker' ? 'bg-teal-500 text-white border-teal-500' : 'border-gray-300 dark:border-slate-600 text-gray-800 dark:text-slate-100 hover:border-teal-400 dark:hover:border-teal-500'}`}
            >
              {t('onboarding.step3.findJobButton')}
            </button>
          </div>

          {/* If user chose to hire (giver), show professions depending on category */}
          {role === 'giver' && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 dark:text-slate-100 mb-2">{t('onboarding.step3.chooseProfessionLabel')}</h3>
              {category === 'it' ? renderProfessions(IT_PROFESSIONS) : renderProfessions(NON_IT_PROFESSIONS)}
              {renderError('profession')}
            </div>
          )}

          <div className="flex gap-4 mt-6">
            <button onClick={() => handleBackStep(2)} className={backButtonClass}>{t('onboarding.backButton')}</button>
            <button onClick={() => handleNextStep(4)} className={primaryButtonClass} disabled={!role || (role === 'giver' && !selectedProfession)}>{t('onboarding.nextButton')}</button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="animate-fadeIn">
          <h2 className="text-2xl text-gray-800 dark:text-slate-100 font-semibold mb-4">{t('onboarding.step4.title')}</h2>
          <form onSubmit={handleSubmit} noValidate>
            {role === 'seeker' ? (
              <>
                <label htmlFor="fullName" className="block text-left font-medium mt-2.5 text-gray-700 dark:text-slate-300">{t('onboarding.step4.fullNameLabel')} <span className="text-red-500">*</span></label>
                <input type="text" id="fullName" name="name" value={profile.name} onChange={handleProfileChange} className={inputClass('name')} />
                {renderError('name')}
                <label htmlFor="email" className="block text-left font-medium mt-2.5 text-gray-700 dark:text-slate-300">{t('onboarding.step4.emailLabel')} <span className="text-red-500">*</span></label>
                <input type="email" id="email" name="email" value={profile.email} onChange={handleProfileChange} className={inputClass('email')} />
                {renderError('email')}
              </>
            ) : (
              <>
                <label htmlFor="companyName" className="block text-left font-medium mt-2.5 text-gray-700 dark:text-slate-300">{t('onboarding.step4.companyNameLabel')} <span className="text-red-500">*</span></label>
                <input type="text" id="companyName" name="companyName" value={profile.companyName} onChange={handleProfileChange} className={inputClass('companyName')} />
                {renderError('companyName')}
                <label htmlFor="email" className="block text-left font-medium mt-2.5 text-gray-700 dark:text-slate-300">{t('onboarding.step4.emailLabel')} <span className="text-red-500">*</span></label>
                <input type="email" id="email" name="email" value={profile.email} onChange={handleProfileChange} className={inputClass('email')} />
                {renderError('email')}
              </>
            )}

            <label htmlFor="contact" className="block text-left font-medium mt-2.5 text-gray-700 dark:text-slate-300">{t('onboarding.step4.contactLabel')} <span className="text-red-500">*</span></label>
            <input type="text" id="contact" name="contact" value={profile.contact} onChange={handleProfileChange} className={inputClass('contact')} />
            {renderError('contact')}

            <label htmlFor="location" className="block text-left font-medium mt-2.5 text-gray-700 dark:text-slate-300">{t('onboarding.step4.locationLabel')} <span className="text-red-500">*</span></label>
            <input type="text" id="location" name="location" value={profile.location} onChange={handleProfileChange} className={inputClass('location')} />
            {renderError('location')}

            <div className="flex gap-4 mt-6">
              <button type="button" onClick={() => handleBackStep(3)} className={backButtonClass}>{t('onboarding.backButton')}</button>
              <button type="submit" className={primaryButtonClass}>{t('onboarding.finishButton')}</button>
            </div>
          </form>
        </div>
      )}

      {step === 5 && (
        <div className="animate-fadeIn">
          <h2 className="text-2xl text-gray-800 dark:text-slate-100 font-semibold mb-4">{t('onboarding.step5.title')}</h2>
          <p className="text-gray-700 dark:text-slate-300">{t('onboarding.step5.subtitle')}</p>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
