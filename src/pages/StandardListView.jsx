import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/constants';

const StandardListView = ({ title, icon: Icon, data, columns, onItemClick, onNewClick, onEditClick, onDeleteClick, filterText }) => {
  const filteredData = data.filter(row => !filterText || Object.values(row).some(val => String(val).toLowerCase().includes(filterText.toLowerCase())));
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center sticky top-0 bg-white z-10">
        <div className="flex items-center"><div className={`p-1.5 rounded mr-3 ${title === '担当者' ? 'bg-[#f26f21]' : title === '取引先' ? 'bg-[#0176d3]' : 'bg-[#f59e0b]'}`}><Icon className="text-white" size={20} /></div><h2 className="text-lg font-bold text-gray-800">{title}</h2></div>
        <button onClick={onNewClick} className="bg-[#0176d3] text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-[#005fb2]">新規</button>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 sticky top-0"><tr>{columns.map(col => (<th key={col.key} className="px-4 py-2 font-medium text-gray-500 border-b border-gray-200">{col.label}</th>))}<th className="px-4 py-2 border-b border-gray-200"></th></tr></thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.map(row => (
              <tr key={row.id} className="hover:bg-gray-50 group">
                {columns.map((col, idx) => (<td key={col.key} className={`px-4 py-3 ${idx === 0 ? 'font-medium text-[#0176d3] cursor-pointer hover:underline' : 'text-gray-700'}`} onClick={idx === 0 ? () => onItemClick(row) : undefined}>{col.key === 'amount' ? formatCurrency(row[col.key]) : row[col.key]}</td>))}
                <td className="px-4 py-3 text-right"><div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => onEditClick(row)} className="text-gray-400 hover:text-[#0176d3]"><Edit2 size={14} /></button><button onClick={() => onDeleteClick(row.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StandardListView;
