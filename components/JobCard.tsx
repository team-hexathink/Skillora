import React from 'react';
import type { Job } from '../types';
import { EMPLOYERS } from '../constants';
import { LocationMarkerIcon } from './icons/LocationMarkerIcon';
import { CurrencyDollarIcon } from './icons/CurrencyDollarIcon';
import { ShieldCheckIcon } from './icons/ShieldCheckIcon';
import { useLocalization } from '../lib/localization';


interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const employer = EMPLOYERS.find(e => e.id === job.employerId);
  const { t } = useLocalization();

  const formatCompensation = (comp: Job['compensation']) => {
      const min = Math.round(comp.min / 1000);
      const max = Math.round(comp.max / 1000);
      return `$${min}k - $${max}k ${comp.currency}/${comp.period}`;
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:border-teal-400 dark:hover:border-teal-500 transition-all duration-300 flex flex-col h-full">
      <div className="flex items-start gap-4 mb-4">
        <img src={employer?.logoUrl} alt={employer?.companyName} className="w-14 h-14 rounded-lg object-cover" />
        <div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100">{job.title}</h3>
            <p className="text-gray-600 dark:text-slate-400">{employer?.companyName}</p>
        </div>
      </div>
      
      <p className="text-gray-700 dark:text-slate-300 text-sm mb-4 flex-grow">{job.description.substring(0, 100)}...</p>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
            {job.skills.slice(0, 4).map(skill => (
                <span key={skill} className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
            ))}
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 dark:text-slate-400 border-t border-gray-200 dark:border-slate-700 pt-4">
        <div className="flex items-center gap-2">
            <LocationMarkerIcon className="w-5 h-5 text-gray-400 dark:text-slate-500" />
            <span>{job.locationType}</span>
        </div>
        <div className="flex items-center gap-2">
            <CurrencyDollarIcon className="w-5 h-5 text-gray-400 dark:text-slate-500" />
            <span>{formatCompensation(job.compensation)}</span>
        </div>
         <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-green-500" />
            <span className="font-semibold text-green-600 dark:text-green-400">{t('jobCard.fairWageVerified')}</span>
        </div>
      </div>

      <button className="mt-6 w-full py-2.5 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-colors">
        {t('jobCard.viewDetails')}
      </button>
    </div>
  );
};

export default JobCard;