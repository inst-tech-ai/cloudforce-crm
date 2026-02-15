import React from 'react';
import { Bell, Search, Menu, Settings } from 'lucide-react';

const Header = ({ title, onMenuClick, globalSearch, setGlobalSearch }) => (
  <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-10 shadow-sm">
    <div className="flex items-center"><button onClick={onMenuClick} className="p-2 mr-2 text-gray-500 hover:bg-gray-100 rounded-md md:hidden"><Menu size={24} /></button><h1 className="text-xl font-semibold text-gray-800 hidden sm:block">{title}</h1></div>
    <div className="flex-1 max-w-xl mx-4 hidden md:block"><div className="relative"><span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={16} className="text-gray-400" /></span><input type="text" placeholder="検索..." value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 focus:ring-2 focus:ring-[#0176d3] focus:outline-none" /></div></div>
    <div className="flex items-center space-x-2"><button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative"><Bell size={20} /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span></button><button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><Settings size={20} /></button></div>
  </header>
);

export default Header;
