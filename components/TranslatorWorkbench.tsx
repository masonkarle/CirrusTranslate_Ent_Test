
import React from 'react';
import { Job, JobStatus } from '../types';

interface TranslatorWorkbenchProps {
  job: Job;
  onUpdate: (updatedJob: Job) => void;
  onComplete: (job: Job) => void;
}

const TranslatorWorkbench: React.FC<TranslatorWorkbenchProps> = ({ job, onUpdate, onComplete }) => {
  const statusWorkflow = [
    JobStatus.NEW,
    JobStatus.STARTED,
    JobStatus.TRANSLATED,
    JobStatus.RECORDED,
    JobStatus.QA,
    JobStatus.UPLOADED
  ];

  const handleStatusUpdate = (newStatus: JobStatus) => {
    onUpdate({ ...job, status: newStatus });
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full max-h-[85vh] overflow-hidden">
      {/* Header */}
      <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📽️</span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{job.title}</h3>
          </div>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-[0.2em]">
            {job.sourceLang} <span className="text-slate-300 mx-2">→</span> {job.targetLang} Localization
          </p>
        </div>
        <div className="flex gap-4">
           {job.status === JobStatus.UPLOADED && (
             <button 
               onClick={() => onComplete(job)}
               className="px-8 py-4 bg-green-600 text-white font-black rounded-2xl shadow-xl shadow-green-100 hover:bg-green-700 transition-all active:scale-95"
             >
               Finalize Project
             </button>
           )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Controls */}
          <div className="lg:col-span-7 space-y-10">
            {/* Project Assets */}
            <section className="bg-blue-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
               <div className="relative z-10">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-2">Source Materials</h4>
                  <h5 className="text-2xl font-black mb-6">Google Drive Workspace</h5>
                  <p className="text-blue-100 mb-8 font-medium">Access scripts, source videos, and upload your final recorded ASL files here.</p>
                  <a 
                    href={job.driveLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-blue-50 transition-all active:scale-95"
                  >
                    <span className="text-xl">📁</span>
                    Open Drive Folder
                  </a>
               </div>
               {/* Decorative icon */}
               <div className="absolute right-[-20px] bottom-[-20px] text-[120px] opacity-10 select-none">📂</div>
            </section>

            {/* Project Info */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Due Date</p>
                <p className="text-lg font-black text-slate-900">{job.deadline}</p>
              </div>
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Project Volume</p>
                <p className="text-lg font-black text-slate-900">{job.minuteCount} Minutes</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
               <h4 className="text-lg font-black text-slate-900 mb-4">Project Description</h4>
               <p className="text-slate-500 leading-relaxed">
                 {job.description || "No detailed instructions provided for this ASL translation task."}
               </p>
            </div>
          </div>

          {/* Workflow Status Tracker */}
          <div className="lg:col-span-5">
             <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">
                <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-slate-400">Localization Workflow</h4>
                
                <div className="space-y-4">
                  {statusWorkflow.map((status) => {
                    const isActive = job.status === status;
                    const isPassed = statusWorkflow.indexOf(job.status) > statusWorkflow.indexOf(status);
                    
                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(status)}
                        className={`w-full group flex items-center justify-between p-5 rounded-2xl transition-all border-2 ${
                          isActive 
                            ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-900/40' 
                            : isPassed
                            ? 'bg-slate-800/50 border-slate-700/50 opacity-60'
                            : 'bg-transparent border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${
                            isActive ? 'bg-white text-blue-600' : isPassed ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-500'
                          }`}>
                            {isPassed ? '✓' : statusWorkflow.indexOf(status) + 1}
                          </div>
                          <span className={`font-black uppercase tracking-widest text-xs ${
                            isActive ? 'text-white' : 'text-slate-400'
                          }`}>
                            {status}
                          </span>
                        </div>
                        {isActive && <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-10 pt-8 border-t border-slate-800">
                   <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Instructions</p>
                   <p className="text-xs text-slate-400 italic">
                     Click a status block to update the project's current phase. Ensure all ASL recordings are uploaded to the Drive folder before marking as "Uploaded".
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslatorWorkbench;
