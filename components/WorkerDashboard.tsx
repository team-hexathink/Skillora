import React, { useState, useMemo } from 'react';
import { JOBS, APPLICATIONS } from '../constants';
import type { WorkerProfile, Job, Application } from '../types';
import JobCard from './JobCard';
import { UserIcon } from './icons/UserIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { findJobMatches } from '../services/geminiService';
import ApplicationStatusChart from './ApplicationStatusChart';
import { BanknotesIcon } from './icons/BanknotesIcon';
import { Cog6ToothIcon } from './icons/Cog6ToothIcon';
import { StarIcon } from './icons/StarIcon';
import { useLocalization } from '../lib/localization';
import * as db from '../lib/database';

interface WorkerDashboardProps {
  username: string;
  onNavigateToSettings: () => void;
}

const WorkerDashboard: React.FC<WorkerDashboardProps> = ({ username, onNavigateToSettings }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isMatching, setIsMatching] = useState(false);
  const [matchedJobs, setMatchedJobs] = useState<Job[]>([]);
  const { t } = useLocalization();

  const currentUser = useMemo(() => db.getUserProfile(username) as WorkerProfile | undefined, [username]);

  const userApplications = useMemo(() => {
    if (!currentUser) return [];
    return APPLICATIONS.filter(app => app.workerId === currentUser.id);
  }, [currentUser]);

  const handleFindMatches = async () => {
    if (!currentUser) return;
    setIsMatching(true);
    setMatchedJobs([]);
    try {
      const matchedIds = await findJobMatches(currentUser, JOBS);
      const jobs = JOBS.filter(job => matchedIds.includes(job.id));
      setMatchedJobs(jobs);
    } catch (error) {
      console.error("Failed to find job matches:", error);
    } finally {
      setIsMatching(false);
      setActiveTab('matches');
    }
  };

  const renderTabContent = () => {
    if (!currentUser) {
        return <div className="text-center p-8">Loading profile...</div>;
    }
    switch (activeTab) {
      case 'profile':
        return <WorkerProfileView profile={currentUser} onFindMatches={handleFindMatches} />;
      case 'search':
        return <JobSearchView jobs={JOBS} />;
      case 'applications':
        return <ApplicationsView applications={userApplications} workerId={currentUser.id} />;
      case 'matches':
        return <AIJobMatchesView jobs={matchedJobs} isLoading={isMatching} />;
      case 'earnings':
        return <EarningsView />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-8 border-b border-gray-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
          <TabButton name={t('workerDashboard.tabs.myProfile')} isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<UserIcon className="w-5 h-5"/>} />
          <TabButton name={t('workerDashboard.tabs.jobSearch')} isActive={activeTab === 'search'} onClick={() => setActiveTab('search')} icon={<MagnifyingGlassIcon className="w-5 h-5"/>} />
          <TabButton name={t('workerDashboard.tabs.myApplications')} isActive={activeTab === 'applications'} onClick={() => setActiveTab('applications')} icon={<DocumentTextIcon className="w-5 h-5"/>} />
          <TabButton name={t('workerDashboard.tabs.aiMatches')} isActive={activeTab === 'matches'} onClick={() => setActiveTab('matches')} icon={<SparklesIcon className="w-5 h-5"/>} />
          <TabButton name={t('workerDashboard.tabs.earnings')} isActive={activeTab === 'earnings'} onClick={() => setActiveTab('earnings')} icon={<BanknotesIcon className="w-5 h-5"/>} />
          <TabButton name={t('header.settings')} isActive={false} onClick={onNavigateToSettings} icon={<Cog6ToothIcon className="w-5 h-5"/>} />
        </nav>
      </div>
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

interface TabButtonProps {
    name: string;
    isActive: boolean;
    onClick: () => void;
    icon: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ name, isActive, onClick, icon }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
        isActive
          ? 'border-teal-500 text-teal-600'
          : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-300 dark:hover:border-slate-600'
      }`}
    >
      {icon} {name}
    </button>
);


const WorkerProfileView: React.FC<{ profile: WorkerProfile; onFindMatches: () => void; }> = ({ profile, onFindMatches }) => {
  const { t } = useLocalization();
  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row items-start gap-8">
        <img src={profile.avatarUrl} alt={profile.name} className="w-32 h-32 rounded-full object-cover border-4 border-teal-100 dark:border-teal-800" />
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-slate-100">{profile.name}</h2>
          <p className="text-xl text-teal-600 dark:text-teal-400 font-medium">{profile.title}</p>
          <p className="text-gray-500 dark:text-slate-400 mt-1">{profile.location}</p>
          <p className="mt-4 text-gray-600 dark:text-slate-300">{profile.bio}</p>
          <button
            onClick={onFindMatches}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            <SparklesIcon className="w-5 h-5" />
            {t('workerDashboard.profile.findMatchesButton')}
          </button>
        </div>
      </div>
      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-slate-100">{t('workerDashboard.profile.skills')}</h3>
        <div className="flex flex-wrap gap-2">
          {profile.skills.map(skill => (
            <span key={skill} className="bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-200 text-sm font-medium px-3 py-1 rounded-full">{skill}</span>
          ))}
        </div>
      </div>
       <div className="mt-10 border-t border-gray-200 dark:border-slate-700 pt-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-slate-100">{t('workerDashboard.profile.ratings')}</h3>
          <div className="text-center text-gray-500 dark:text-slate-400 p-8 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <StarIcon className="w-8 h-8 mx-auto text-gray-400 dark:text-slate-500 mb-2"/>
              <p>{t('workerDashboard.profile.ratingsPlaceholder')}</p>
          </div>
      </div>
      <div className="mt-10 border-t border-gray-200 dark:border-slate-700 pt-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-slate-100">{t('workerDashboard.profile.feedback')}</h3>
          <div className="text-center text-gray-500 dark:text-slate-400 p-8 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <p>{t('workerDashboard.profile.feedbackPlaceholder')}</p>
               <button className="mt-4 px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-800 dark:text-slate-200 font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors">
                  {t('workerDashboard.profile.submitFeedbackButton')}
              </button>
          </div>
      </div>
    </div>
  )
};

const JobSearchView: React.FC<{ jobs: Job[] }> = ({ jobs }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { t } = useLocalization();

    const filteredJobs = useMemo(() => {
        if (!searchTerm) return jobs;
        return jobs.filter(job =>
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [jobs, searchTerm]);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 dark:text-slate-100">{t('workerDashboard.search.title')}</h2>
            <div className="relative mb-8">
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder={t('workerDashboard.search.placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => (
                <JobCard key={job.id} job={job} />
            ))}
            </div>
        </div>
    );
};


const ApplicationsView: React.FC<{ applications: Application[], workerId: number }> = ({ applications, workerId }) => {
    const jobsById = useMemo(() => JOBS.reduce((acc, job) => {
        acc[job.id] = job;
        return acc;
    }, {} as Record<number, Job>), []);
    const employers = db.getEmployers();
    const { t } = useLocalization();
    
    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 dark:text-slate-100">{t('workerDashboard.applications.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-4 dark:text-slate-100">{t('workerDashboard.applications.statusOverview')}</h3>
                    <div className="h-64">
                       <ApplicationStatusChart applications={applications} />
                    </div>
                </div>
                <div className="space-y-4">
                    {applications.map(app => {
                        const job = jobsById[app.jobId];
                        const employer = employers.find(e => e.id === job.employerId);
                        return (
                            <div key={app.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border dark:border-slate-700 flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-lg text-gray-800 dark:text-slate-100">{job.title}</p>
                                    <p className="text-gray-600 dark:text-slate-400">{employer?.companyName || 'Unknown Company'}</p>
                                    <p className="text-sm text-gray-500 dark:text-slate-500">{t('workerDashboard.applications.appliedOn')}: {app.dateApplied}</p>
                                </div>
                                <span className="text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 px-3 py-1 rounded-full">{app.status}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

const AIJobMatchesView: React.FC<{ jobs: Job[]; isLoading: boolean }> = ({ jobs, isLoading }) => {
  const { t } = useLocalization();
  if (isLoading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-slate-400">{t('workerDashboard.matches.loading')}</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <SparklesIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-slate-500" />
        <h3 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">{t('workerDashboard.matches.noMatchesTitle')}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{t('workerDashboard.matches.noMatchesSubtitle')}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 dark:text-slate-100">{t('workerDashboard.matches.title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  );
};

const EarningsView: React.FC = () => {
    const { t } = useLocalization();
    return (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md text-center">
            <BanknotesIcon className="w-12 h-12 mx-auto text-gray-400 dark:text-slate-500" />
            <h3 className="mt-2 text-xl font-medium text-gray-900 dark:text-white">{t('workerDashboard.earnings.title')}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{t('workerDashboard.earnings.placeholder')}</p>
        </div>
    );
};

export default WorkerDashboard;
