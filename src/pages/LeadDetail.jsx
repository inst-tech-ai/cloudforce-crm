import React from 'react';
import { Users } from 'lucide-react';
import { LEAD_STATUS_LABELS } from '../utils/constants';

const LeadDetail = ({ lead, onBack, onEdit, onDelete }) => {
  if (!lead) return null;
  return (
    <div className="flex flex-col h-full bg-[#f3f2f2]">
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <button onClick={onBack} className="text-xs text-[#0176d3] mb-2 hover:underline">← 一覧に戻る</button>
        <div className="flex justify-between items-start">
          <div className="flex items-center"><div className="bg-[#f26f21] p-2 rounded-md mr-3"><Users className="text-white" size={24} /></div><div><p className="text-sm text-gray-500">担当者</p><h1 className="text-2xl font-bold text-gray-900">{lead?.name}</h1></div></div>
          <div className="flex space-x-2"><button onClick={onEdit} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50">編集</button><button onClick={onDelete} className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded text-sm font-medium hover:bg-red-50">削除</button></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4"><div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><p className="text-xs text-gray-500 mb-1">氏名</p><p className="text-sm text-gray-900">{lead?.name}</p></div>
        <div><p className="text-xs text-gray-500 mb-1">所属取引先</p><p className="text-sm text-[#0176d3]">{lead?.account_name || '-'}</p></div>
        <div><p className="text-xs text-gray-500 mb-1">役職</p><p className="text-sm text-gray-900">{lead?.title || '-'}</p></div>
        <div><p className="text-xs text-gray-500 mb-1">メール</p><p className="text-sm text-[#0176d3]">{lead?.email}</p></div>
        <div><p className="text-xs text-gray-500 mb-1">電話</p><p className="text-sm text-gray-900">{lead?.phone || '-'}</p></div>
        <div><p className="text-xs text-gray-500 mb-1">ステータス</p><p className="text-sm text-gray-900">{LEAD_STATUS_LABELS[lead?.status] || lead?.status}</p></div>
      </div></div>
    </div>
  );
};

export default LeadDetail;
