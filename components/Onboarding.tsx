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
  const [role, setRole] = useState<'giver' | 'seeker' | ''>('');
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    contact: '',
    location: '',
    companyName: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleNextStep = (nextStep: number) => {
    if (step === 1) {
      if (!locale) {
        setErrors({ language: t('onboarding.step1.error') });
        return;
      }
      setErrors({});
    }
    setStep(nextStep);
  };

  const handleBackStep = (prevStep: number) => {
    setStep(prevStep);
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    let updatedProfile = { ...profile, [name]: value };

    if (name === 'contact') {
      updatedProfile[name] = value.replace(/\D/g, '');
    }

    setProfile(updatedProfile);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    const userType = role === 'seeker' ? 'worker' : 'employer';

    if (userType === 'worker') {
        if (!profile.name.trim()) newErrors.name = t('onboarding.errors.required');
    } else {
        if (!profile.companyName.trim()) newErrors.companyName = t('onboarding.errors.required');
    }
    
    if (!profile.email.trim().endsWith('@gmail.com')) newErrors.email = t('onboarding.errors.email');
    if (!/^[0-9]{10}$/.test(profile.contact.trim())) newErrors.contact = t('onboarding.errors.contact');
    if (!profile.location.trim()) newErrors.location = t('onboarding.errors.required');


    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Onboarding data:", { role, profile });
      setStep(4); // Use step 4 as the final "loading" step
      
      const finalProfile: Partial<WorkerProfile & EmployerProfile> = {
          username: currentUser.username,
          email: profile.email,
          contact: profile.contact,
          location: profile.location,
          // Placeholder data for fields no longer in form
          avatarUrl: 'https://picsum.photos/seed/newuser/200',
          logoUrl: 'https://picsum.photos/seed/newcompany/100',
          bio: 'A new member of the GlobalFair Work community!',
          about: 'A new company on the GlobalFair Work platform.',
          skills: [],
          experience: [],
          education: [],
          portfolio: [],
      };

      if (userType === 'worker') {
          finalProfile.name = profile.name;
          finalProfile.title = "New Professional";
      } else {
          finalProfile.companyName = profile.companyName;
          finalProfile.industry = "General";
      }
      
      setTimeout(() => {
        onOnboardingComplete(finalProfile, userType);
      }, 2000);
    }
  };

  const renderError = (fieldName: string) => {
    return errors[fieldName] ? <div className="text-red-500 text-sm text-left mt-1">{errors[fieldName]}</div> : null;
  }
  
  const inputClass = (fieldName: string) => `w-full p-3 mt-1.5 rounded-lg border bg-slate-50 dark:bg-slate-700 text-base focus:outline-none focus:ring-2 transition ${errors[fieldName] ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 dark:border-slate-600 focus:border-teal-500 focus:ring-teal-200'}`;

  const backButtonClass = "border border-gray-300 dark:border-slate-600 text-gray-800 dark:text-slate-100 font-bold w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors";
  const primaryButtonClass = "bg-teal-500 text-white font-bold w-full p-3 rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen flex items-center justify-center p-4 font-sans transition-colors duration-300">
      <div className="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-2xl shadow-xl w-full max-w-lg text-center transition-all duration-500">
        <h1 className="text-teal-500 text-4xl font-extrabold mb-8 tracking-wide">{t('appName')}</h1>

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
            <button onClick={() => handleNextStep(2)} className={`${primaryButtonClass} mt-6`}>{t('onboarding.nextButton')}</button>
          </div>
        )}
        
        {step === 2 && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl text-gray-800 dark:text-slate-100 font-semibold mb-4">{t('onboarding.step2.title')}</h2>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                onClick={() => setRole('giver')}
                className={`w-full p-4 rounded-lg font-bold border-2 transition-colors ${
                  role === 'giver'
                    ? 'bg-indigo-500 text-white border-indigo-500'
                    : 'border-gray-300 dark:border-slate-600 text-gray-800 dark:text-slate-100 hover:border-indigo-400 dark:hover:border-indigo-500'
                }`}
              >
                {t('onboarding.step2.hireButton')}
              </button>
              <button
                onClick={() => setRole('seeker')}
                className={`w-full p-4 rounded-lg font-bold border-2 transition-colors ${
                  role === 'seeker'
                    ? 'bg-teal-500 text-white border-teal-500'
                    : 'border-gray-300 dark:border-slate-600 text-gray-800 dark:text-slate-100 hover:border-teal-400 dark:hover:border-teal-500'
                }`}
              >
                {t('onboarding.step2.findJobButton')}
              </button>
            </div>
            <div className="flex gap-4 mt-6">
              <button onClick={() => handleBackStep(1)} className={backButtonClass}>{t('onboarding.backButton')}</button>
              <button onClick={() => handleNextStep(3)} className={primaryButtonClass} disabled={!role}>{t('onboarding.nextButton')}</button>
            </div>
          </div>
        )}

        {step === 3 && (
            <div className="animate-fadeIn">
                <h2 className="text-2xl text-gray-800 dark:text-slate-100 font-semibold mb-4">{t('onboarding.step4.title')}</h2>
                <form onSubmit={handleSubmit} noValidate>
                    {role === 'seeker' ? (
                      <>
                        <label htmlFor="name" className="block text-left font-medium text-gray-700 dark:text-slate-300">{t('onboarding.step4.fullNameLabel')} <span className="text-red-500">*</span></label>
                        <input type="text" id="name" name="name" value={profile.name} onChange={handleProfileChange} className={inputClass('name')} />
                        {renderError('name')}
                      </>
                    ) : (
                       <>
                        <label htmlFor="companyName" className="block text-left font-medium text-gray-700 dark:text-slate-300">{t('onboarding.step4.companyNameLabel')} <span className="text-red-500">*</span></label>
                        <input type="text" id="companyName" name="companyName" value={profile.companyName} onChange={handleProfileChange} className={inputClass('companyName')} />
                        {renderError('companyName')}
                      </>
                    )}

                    <label htmlFor="email" className="block text-left font-medium mt-2.5 text-gray-700 dark:text-slate-300">{t('onboarding.step4.emailLabel')} <span className="text-red-500">*</span></label>
                    <input type="email" id="email" name="email" value={profile.email} onChange={handleProfileChange} placeholder="example@gmail.com" className={inputClass('email')} />
                    {renderError('email')}
                    
                    <label htmlFor="contact" className="block text-left font-medium mt-2.5 text-gray-700 dark:text-slate-300">{t('onboarding.step4.contactLabel')} <span className="text-red-500">*</span></label>
                    <input type="tel" id="contact" name="contact" value={profile.contact} onChange={handleProfileChange} maxLength={10} placeholder={t('onboarding.step4.contactPlaceholder')} className={inputClass('contact')} />
                    {renderError('contact')}

                    <label htmlFor="location" className="block text-left font-medium mt-2.5 text-gray-700 dark:text-slate-300">{t('onboarding.step4.locationLabel')} <span className="text-red-500">*</span></label>
                    <input type="text" id="location" name="location" value={profile.location} onChange={handleProfileChange} className={inputClass('location')} />
                    {renderError('location')}

                    <div className="flex gap-4 mt-6">
                        <button type="button" onClick={() => handleBackStep(2)} className={backButtonClass}>{t('onboarding.backButton')}</button>
                        <button type="submit" className={primaryButtonClass}>{t('onboarding.finishButton')}</button>
                    </div>
                </form>
            </div>
        )}

        {step === 4 && (
            <div className="animate-fadeIn">
                <h2 className="text-2xl text-gray-800 dark:text-slate-100 font-semibold mb-4">{t('onboarding.step5.title')}</h2>
                <p className="text-gray-600 dark:text-slate-400">{t('onboarding.step5.subtitle')}</p>
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mt-6"></div>
            </div>
        )}
      </div>
       <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-in-out;
          }
       `}</style>
    </div>
  );
};

export default Onboarding;