import React from 'react';
import type { WorkerProfile } from '../types';
import { useLocalization } from '../lib/localization';

interface WorkerProfileCardProps {
  worker: WorkerProfile;
}

const WorkerProfileCard: React.FC<WorkerProfileCardProps> = ({ worker }) => {
  const { t } = useLocalization();
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-slate-700 hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 flex flex-col text-center items-center">
      <img src={worker.avatarUrl} alt={worker.name} className="w-24 h-24 rounded-full mb-4 border-4 border-indigo-200 dark:border-indigo-800" />
      <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100">{worker.name}</h3>
      <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">{worker.title}</p>
      <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">{worker.location}</p>

      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {worker.skills.slice(0, 5).map(skill => (
          <span key={skill} className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-200 text-xs font-medium px-2.5 py-1 rounded-full">{skill}</span>
        ))}
      </div>

      <button className="mt-auto w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
        {t('viewProfile')}
      </button>
    </div>
  );
};

export default WorkerProfileCard;