import React from 'react';
import { LayoutDashboard, Users, Building2, Briefcase, CheckSquare, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen, user, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
    { id: 'leads', label: '担当者', icon: Users },
    { id: 'accounts', label: '取引先', icon: Building2 },
    { id: 'opportunities', label: '商談 (案件)', icon: Briefcase },
    { id: 'tasks', label: 'ToDo', icon: CheckSquare },
  ];
  return (
    <>
      {isMobileOpen && (<div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setIsMobileOpen(false)} />)}
      <div className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-[#011e41] text-white transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col`}>
        <div className="h-16 flex items-center px-6 bg-[#011633] font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center mr-3"><span className="text-[#0176d3] text-xl">☁️</span></div>CloudForce
        </div>
        <nav className="flex-1 py-4">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileOpen(false); }} className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors duration-150 ${activeTab === item.id || (activeTab.includes('Detail') && item.id === (activeTab === 'leadDetail' ? 'leads' : activeTab === 'accountDetail' ? 'accounts' : 'opportunities')) ? 'bg-[#0176d3] text-white border-l-4 border-white' : 'text-gray-300 hover:bg-[#014486] hover:text-white border-l-4 border-transparent'}`}>
              <item.icon size={18} className="mr-3" />{item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 bg-[#011633] border-t border-[#012a5a] flex items-center justify-between">
          <div className="flex items-center">
            <img src={user?.avatar || "https://i.pravatar.cc/150"} alt="User" className="w-8 h-8 rounded-full border-2 border-gray-400" />
            <div className="ml-3">
              <p className="text-xs font-semibold text-white truncate w-24">{user?.name || "User"}</p>
              <p className="text-[10px] text-gray-400">ログイン中</p>
            </div>
          </div>
          <button onClick={onLogout} title="ログアウト" className="p-1 text-gray-400 hover:text-white transition-colors"><LogOut size={16} /></button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
