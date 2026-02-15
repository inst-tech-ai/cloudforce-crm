import React from 'react';
import { X, Save } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, onSave }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-200"><h3 className="text-lg font-semibold text-gray-800">{title}</h3><button onClick={onClose}><X size={20} /></button></div>
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
        <div className="flex justify-end space-x-2 p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg"><button onClick={onClose} className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded">キャンセル</button><button onClick={onSave} className="px-4 py-2 text-sm text-white bg-[#0176d3] rounded flex items-center"><Save size={16} className="mr-1" /> 保存</button></div>
      </div>
    </div>
  );
};

export default Modal;
