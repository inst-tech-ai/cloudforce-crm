import React from 'react';
import { Briefcase } from 'lucide-react';
import { formatCurrency, STAGE_LABELS, STAGES } from '../utils/constants';

const OpportunityDetail = ({ opportunity, onBack, onEdit, onDelete }) => {
  if (!opportunity) return null;

  // --- ビジュアル復活: フェーズ進捗バー ---
  const SalesPath = ({ currentStage }) => {
    const currentIdx = STAGES.indexOf(currentStage) !== -1 ? STAGES.indexOf(currentStage) : 0;
    return (
      <div className="flex items-center w-full overflow-x-auto py-4 mb-4 no-scrollbar">
        {STAGES.map((stage, idx) => {
          let statusClass = "bg-gray-200 text-gray-500 hover:bg-gray-300";
          if (idx < currentIdx) statusClass = "bg-green-500 text-white";
          if (idx === currentIdx) statusClass = "bg-[#0176d3] text-white font-bold";
          if (currentStage === "Closed Lost" && stage === "Closed Lost") statusClass = "bg-red-500 text-white font-bold";
          
          return (
            <div key={stage} className="flex items-center flex-shrink-0 group cursor-default relative h-10 mr-1">
              <div className={`${statusClass} pl-6 pr-2 h-full flex items-center justify-center relative z-10 clip-path-arrow`} style={{ clipPath: "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)" }}>
                <span className="text-sm whitespace-nowrap ml-2">{STAGE_LABELS[stage]}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#f3f2f2]">
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <button onClick={onBack} className="text-xs text-[#0176d3] mb-2 hover:underline">← 一覧に戻る</button>
        <div className="flex justify-between items-start">
          <div className="flex items-center"><div className="bg-[#f59e0b] p-2 rounded-md mr-3"><Briefcase className="text-white" size={24} /></div><div><p className="text-sm text-gray-500">商談</p><h1 className="text-2xl font-bold text-gray-900">{opportunity?.name}</h1></div></div>
          <div className="flex space-x-2"><button onClick={onEdit} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50">編集</button><button onClick={onDelete} className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded text-sm font-medium hover:bg-red-50">削除</button></div>
        </div>
      </div>
      
      {/* 復活したフェーズ進捗バー */}
      <div className="bg-white border-b border-gray-200 px-6 shadow-sm mb-4">
        <SalesPath currentStage={opportunity?.stage} />
      </div>

      <div className="flex-1 overflow-y-auto p-4"><div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><p className="text-xs text-gray-500 mb-1">商談名</p><p className="text-sm text-gray-900">{opportunity?.name}</p></div>
        <div><p className="text-xs text-gray-500 mb-1">取引先</p><p className="text-sm text-[#0176d3]">{opportunity?.account_name || '-'}</p></div>
        <div><p className="text-xs text-gray-500 mb-1">金額</p><p className="text-sm text-gray-900">{formatCurrency(opportunity?.amount || 0)}</p></div>
        <div><p className="text-xs text-gray-500 mb-1">フェーズ</p><p className="text-sm text-gray-900">{STAGE_LABELS[opportunity?.stage] || opportunity?.stage}</p></div>
        <div><p className="text-xs text-gray-500 mb-1">完了予定日</p><p className="text-sm text-gray-900">{opportunity?.close_date ? opportunity.close_date.split('T')[0] : '-'}</p></div>
        <div><p className="text-xs text-gray-500 mb-1">商談所有者</p><p className="text-sm text-gray-900">{opportunity?.owner || '-'}</p></div>
      </div></div>
    </div>
  );
};

export default OpportunityDetail;
