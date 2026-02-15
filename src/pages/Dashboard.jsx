import React from 'react';

const Dashboard = () => (
  <div className="p-6 bg-[#f3f2f2] min-h-full">
    <div className="mb-6 flex justify-between items-center"><h2 className="text-xl font-bold text-gray-800">営業ホーム</h2></div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md"><p className="text-sm font-medium text-gray-500 uppercase tracking-wide">今四半期の売上</p><h3 className="text-2xl font-bold text-gray-800 mt-1">¥23,000,000</h3></div>
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md"><p className="text-sm font-medium text-gray-500 uppercase tracking-wide">オープンな商談金額</p><h3 className="text-2xl font-bold text-gray-800 mt-1">¥38,500,000</h3></div>
      <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm transition-shadow hover:shadow-md"><p className="text-sm font-medium text-gray-500 uppercase tracking-wide">コンバージョン率</p><h3 className="text-2xl font-bold text-gray-800 mt-1">24.8%</h3></div>
    </div>
  </div>
);

export default Dashboard;
