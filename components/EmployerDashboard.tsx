import React, { useState, useMemo } from 'react';
import { JOBS, APPLICATIONS } from '../constants';
import type { WorkerProfile, Job, Application, EmployerProfile } from '../types';
import WorkerProfileCard from './WorkerProfileCard';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { DocumentCheckIcon } from './icons/DocumentCheckIcon';
import { UserSearchIcon } from './icons/UserSearchIcon';
import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon';
import { Cog6ToothIcon } from './icons/Cog6ToothIcon';
import { useLocalization } from '../lib/localization';
import * as db from '../lib/database';

interface EmployerDashboardProps {
  username: string;
  onNavigateToSettings: () => void;
}

const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ username, onNavigateToSettings }) => {
  const [activeTab, setActiveTab] = useState('jobs');
  const { t } = useLocalization();
  
  const currentEmployer = useMemo(() => db.getUserProfile(username) as EmployerProfile | undefined, [username]);
  const allWorkers = useMemo(() => db.getWorkers(), []);

  const employerJobs = useMemo(() => {
    // For newly created employers, show some sample jobs
    if (currentEmployer && currentEmployer.id > 2) {
      return JOBS.slice(0, 2);
    }
    if (!currentEmployer) return [];
    return JOBS.filter(job => job.employerId === currentEmployer.id);
  }, [currentEmployer]);
  
  const employerJobIds = useMemo(() => employerJobs.map(j => j.id), [employerJobs]);
  const employerApplications = useMemo(() => APPLICATIONS.filter(app => employerJobIds.includes(app.jobId)), [employerJobIds]);

  const renderTabContent = () => {
     if (!currentEmployer) {
        return <div className="text-center p-8">Loading profile...</div>;
    }
    switch (activeTab) {
      case 'jobs':
        return <PostedJobsView jobs={employerJobs} />;
      case 'applications':
        return <ReviewApplicationsView applications={employerApplications} />;
      case 'search':
        return <CandidateSearchView candidates={allWorkers} />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-8 border-b border-gray-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <TabButton name={t('employerDashboard.tabs.postedJobs')} isActive={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} icon={<BriefcaseIcon className="w-5 h-5"/>} />
          <TabButton name={t('employerDashboard.tabs.applications')} isActive={activeTab === 'applications'} onClick={() => setActiveTab('applications')} icon={<DocumentCheckIcon className="w-5 h-5"/>} />
          <TabButton name={t('employerDashboard.tabs.searchCandidates')} isActive={activeTab === 'search'} onClick={() => setActiveTab('search')} icon={<UserSearchIcon className="w-5 h-5"/>} />
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
          ? 'border-indigo-500 text-indigo-600'
          : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-300 dark:hover:border-slate-600'
      }`}
    >
      {icon} {name}
    </button>
);


const PostedJobsView: React.FC<{ jobs: Job[] }> = ({ jobs }) => {
  const { t } = useLocalization();
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold dark:text-slate-100">{t('employerDashboard.postedJobs.title')}</h2>
        <button className="px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
          {t('employerDashboard.postedJobs.postJobButton')}
        </button>
      </div>
      <div className="space-y-4">
        {jobs.map(job => (
          <div key={job.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border dark:border-slate-700 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg text-gray-800 dark:text-slate-100">{job.title}</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400">{job.locationType} - {job.jobType}</p>
            </div>
            <div className="text-right">
               <p className="font-semibold text-indigo-600 dark:text-indigo-400">{t('employerDashboard.postedJobs.applicants', { count: APPLICATIONS.filter(a => a.jobId === job.id).length })}</p>
               <a href="#" className="text-sm text-indigo-500 hover:underline">{t('employerDashboard.postedJobs.viewApplicants')}</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};

const ReviewApplicationsView: React.FC<{ applications: Application[] }> = ({ applications }) => {
    const { t } = useLocalization();
    const jobsById = useMemo(() => JOBS.reduce((acc, job) => {
        acc[job.id] = job;
        return acc;
    }, {} as Record<number, Job>), []);

    const workersById = useMemo(() => db.getWorkers().reduce((acc, worker) => {
        acc[worker.id] = worker;
        return acc;
    }, {} as Record<number, WorkerProfile>), []);

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 dark:text-slate-100">{t('employerDashboard.applications.title')}</h2>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                    <thead className="bg-gray-50 dark:bg-slate-700">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">{t('employerDashboard.applications.candidate')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">{t('employerDashboard.applications.job')}</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-300 uppercase tracking-wider">{t('employerDashboard.applications.status')}</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">{t('employerDashboard.applications.actions')}</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
                        {applications.map(app => {
                            const worker = workersById[app.workerId];
                            const job = jobsById[app.jobId];
                            if(!worker || !job) return null;
                            return (
                                <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="h-10 w-10 rounded-full" src={worker.avatarUrl} alt="" />
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-slate-100">{worker.name}</div>
                                                <div className="text-sm text-gray-500 dark:text-slate-400">{worker.title}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-slate-300">{job.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300">{t('viewProfile')}</a>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const professions = [
    { key: 'software', labelKey: 'professions.software' },
    { key: 'design', labelKey: 'professions.design' },
    { key: 'marketing', labelKey: 'professions.marketing' },
    { key: 'sales', labelKey: 'professions.sales' },
    { key: 'healthcare', labelKey: 'professions.healthcare' },
    { key: 'construction', labelKey: 'professions.construction' },
];

const CandidateSearchView: React.FC<{ candidates: WorkerProfile[] }> = ({ candidates }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [professionFilter, setProfessionFilter] = useState('');
    const [requirementFilter, setRequirementFilter] = useState('');
    const { t } = useLocalization();

    const filteredCandidates = useMemo(() => {
        let filtered = candidates;

        // Main search bar filter
        if (searchTerm) {
            filtered = filtered.filter(candidate =>
                candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                candidate.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Job Profession filter
        if (professionFilter) {
            const keywords = {
                'software': ['developer', 'engineer', 'software', 'frontend', 'backend'],
                'design': ['designer', 'ui', 'ux'],
                'marketing': ['marketing', 'seo', 'content'],
                'sales': ['sales', 'business development'],
                'healthcare': ['medical', 'nurse', 'doctor'],
                'construction': ['construction', 'carpenter', 'plumber', 'electrician'],
            }[professionFilter];

            if (keywords) {
                filtered = filtered.filter(candidate =>
                    keywords.some(keyword => candidate.title.toLowerCase().includes(keyword))
                );
            }
        }

        // Job Requirement filter
        if (requirementFilter) {
            filtered = filtered.filter(candidate =>
                candidate.bio.toLowerCase().includes(requirementFilter.toLowerCase()) ||
                candidate.skills.some(skill => skill.toLowerCase().includes(requirementFilter.toLowerCase()))
            );
        }

        return filtered;

    }, [candidates, searchTerm, professionFilter, requirementFilter]);
    
    const clearFilters = () => {
        setProfessionFilter('');
        setRequirementFilter('');
    };

    return (
        <div>
            <h2 className="text-3xl font-bold mb-6 dark:text-slate-100">{t('employerDashboard.search.title')}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <aside className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md sticky top-24">
                        <h3 className="text-xl font-bold mb-4">{t('employerDashboard.search.filtersTitle')}</h3>
                        
                        {/* Job Profession Filter */}
                        <div className="mb-6">
                            <label htmlFor="profession-filter" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('employerDashboard.search.professionLabel')}</label>
                            <select
                                id="profession-filter"
                                value={professionFilter}
                                onChange={(e) => setProfessionFilter(e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="">{t('employerDashboard.search.selectProfessionPlaceholder')}</option>
                                {professions.map(p => <option key={p.key} value={p.key}>{t(p.labelKey as any)}</option>)}
                            </select>
                        </div>

                        {/* Job Requirement Filter */}
                        <div className="mb-6">
                             <label htmlFor="requirement-filter" className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('employerDashboard.search.requirementLabel')}</label>
                            <input
                                type="text"
                                id="requirement-filter"
                                placeholder={t('employerDashboard.search.requirementPlaceholder')}
                                value={requirementFilter}
                                onChange={(e) => setRequirementFilter(e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <button onClick={clearFilters} className="w-full py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-lg transition-colors">
                            {t('employerDashboard.search.clearFiltersButton')}
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="lg:col-span-3">
                    <div className="relative mb-8">
                        <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={t('employerDashboard.search.placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredCandidates.map(candidate => (
                            <WorkerProfileCard key={candidate.id} worker={candidate} />
                        ))}
                    </div>
                </main>
            </div>
      </div>
    );
};

export default EmployerDashboard;