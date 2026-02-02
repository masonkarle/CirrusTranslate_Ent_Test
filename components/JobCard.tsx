
import React from 'react';
import { Job, JobStatus } from '../types';

interface JobCardProps {
  job: Job;
  onClick?: (job: Job) => void;
  onAction?: (job: Job) => void;
  actionLabel?: string;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick, onAction, actionLabel }) => {
  const getStatusStyles = (status: JobStatus) => {
    switch (status) {
      case JobStatus.UNASSIGNED: return 'bg-slate-100 text-slate-500 border-slate-200';
      case JobStatus.NEW: return 'bg-blue-50 text-blue-600 border-blue-100';
      case JobStatus.STARTED: return 'bg-yellow-50 text-yellow-600 border-yellow-100';
      case JobStatus.TRANSLATED: return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case JobStatus.RECORDED: return 'bg-purple-50 text-purple-600 border-purple-100';
      case JobStatus.QA: return 'bg-amber-50 text-amber-600 border-amber-100';
      case JobStatus.UPLOADED: return 'bg-green-50 text-green-600 border-green-100';
      default: return 'bg-gray-50 text-gray-400';
    }
  };

  return (
    <div 
      className="bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl transition-all cursor-pointer group"
      onClick={() => onClick?.(job)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border uppercase tracking-[0.15em] ${getStatusStyles(job.status)}`}>
            {job.status.replace('_', ' ')}
          </span>
          <h3 className="text-xl font-black text-slate-900 mt-4 group-hover:text-blue-600 transition-colors leading-tight">
            {job.title || job.name}
          </h3>
        </div>
        <div className="text-right ml-4">
          <p className="text-xl font-black text-slate-900 leading-none">
            ${(job.type === 'video' 
              ? (job.minuteCount || 0) * (job.appliedRate || 0) 
              : (job.wordCount || 0) * (job.appliedRate || 0)
            ).toFixed(2)}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            ${job.appliedRate}/{job.type === 'video' ? 'min' : 'word'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 mb-8 pt-4 border-t border-slate-50">
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl">
           <span className="text-slate-900">{job.sourceLang || 'EN'}</span>
           <span className="text-slate-300">→</span>
           <span className="text-slate-900">{job.targetLang || 'ASL'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="opacity-50">⏱️</span>
          <span>{job.minuteCount || job.wordCount || 0} {job.type === 'video' ? 'mins' : 'words'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="opacity-50">📅</span>
          <span>Due {job.deadline}</span>
        </div>
      </div>

      {onAction && actionLabel && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAction(job);
          }}
          className="w-full py-4 bg-slate-900 hover:bg-blue-600 text-white font-black rounded-2xl transition-all active:scale-95 shadow-lg shadow-slate-100"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default JobCard;
