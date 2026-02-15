import React from 'react';
import { Building2 } from 'lucide-react';

const AccountDetail = ({ account, onBack, onEdit, onDelete, relatedLeads, onLeadClick }) => {
  if (!account) return null;
  return (
    <div className="flex flex-col h-full bg-[#f3f2f2]">
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <button onClick={onBack} className="text-xs text-[#0176d3] mb-2 hover:underline flex items-center">← 一覧に戻る</button>
        <div className="flex justify-between items-start">
          <div className="flex items-center"><div className="bg-[#0176d3] p-2 rounded-md mr-3"><Building2 className="text-white" size={24} /></div><div><p className="text-sm text-gray-500">取引先</p><h1 className="text-2xl font-bold text-gray-900">{account.name}</h1></div></div>
          <div className="flex space-x-2"><button onClick={onEdit} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50">編集</button><button onClick={onDelete} className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded text-sm font-medium hover:bg-red-50">削除</button></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><p className="text-xs text-gray-500 mb-1">取引先名</p><p className="text-sm text-gray-900">{account.name}</p></div>
          <div><p className="text-xs text-gray-500 mb-1">業種</p><p className="text-sm text-gray-900">{account.industry}</p></div>
          <div><p className="text-xs text-gray-500 mb-1">Webサイト</p><p className="text-sm text-[#0176d3]">{account.website}</p></div>
          <div><p className="text-xs text-gray-500 mb-1">電話番号</p><p className="text-sm text-gray-900">{account.phone}</p></div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 font-semibold text-gray-800 text-sm">所属担当者 ({relatedLeads.length})</div>
          <table className="min-w-full text-left text-sm">
            <tbody className="divide-y divide-gray-100">
              {relatedLeads.map(l => (
                <tr key={l.id} className="hover:bg-gray-50"><td className="px-6 py-3 text-[#0176d3] font-medium cursor-pointer hover:underline" onClick={() => onLeadClick(l)}>{l.name}</td><td className="px-6 py-3 text-gray-600">{l.title}</td><td className="px-6 py-3 text-gray-600">{l.email}</td></tr>
              ))}
              {relatedLeads.length === 0 && (<tr><td className="px-6 py-8 text-center text-gray-400 italic">この取引先に紐付いている担当者はまだいません。</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;
