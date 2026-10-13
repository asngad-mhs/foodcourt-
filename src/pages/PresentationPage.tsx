import React, { useState } from 'react';
import { PresentationDeckFeature } from '../features/report/PresentationDeckFeature';
import { RcaReportSection } from '../features/report/RcaReportSection';
import { TestCaseFeature } from '../features/testing/TestCaseFeature';
import { Presentation, ShieldAlert, FileCheck2 } from 'lucide-react';

export const PresentationPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'SLIDES' | 'TEST_CASE' | 'RCA'>('SLIDES');

  return (
    <div className="flex flex-col gap-5">
      {/* Subtab Segmented Switcher */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-2 rounded-xl no-print">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveSubTab('SLIDES')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeSubTab === 'SLIDES'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-emerald-700" />
            <span>Slide Presentasi PPT (15 Slide)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('TEST_CASE')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeSubTab === 'TEST_CASE'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5 text-purple-700" />
            <span>Test Case Design &amp; Unit Test (Slide 14)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('RCA')}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              activeSubTab === 'RCA'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
            <span>Laporan Defect &amp; Analisis RCA</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-mono-tabular pr-3 hidden lg:inline">
          Universitas Nahdlatul Ulama Al Ghazali Cilacap
        </span>
      </div>

      {activeSubTab === 'SLIDES' && <PresentationDeckFeature />}
      {activeSubTab === 'TEST_CASE' && (
        <TestCaseFeature
          onNavigateToSlide={() => {
            setActiveSubTab('SLIDES');
          }}
        />
      )}
      {activeSubTab === 'RCA' && <RcaReportSection />}
    </div>
  );
};
