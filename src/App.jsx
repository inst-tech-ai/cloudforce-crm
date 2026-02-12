import React, { useState, useMemo, useEffect } from 'react';
import { LayoutDashboard, Users, Building2, Briefcase, FileText, CheckSquare, Bell, Search, Menu, X, ChevronRight, MoreHorizontal, Phone, Mail, Calendar, Plus, Filter, ArrowRight, Star, Settings, LogOut, User, CheckCircle, PieChart as PieChartIcon, BarChart as BarChartIcon, Save, Trash2, Edit2, Package, Tag, Columns, List, Paperclip, Download, AlertCircle, MessageSquare, Clock, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from 'recharts';

// --- API Constants ---
const API_URL = import.meta.env.VITE_API_URL || 'https://cloudforce-api-987189753237.asia-northeast1.run.app';

// --- Initial Data ---
const MOCK_USER = { name: "山田 太郎", role: "営業マネージャー", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" };
// INITIAL_LEADS はAPIから取得するため空にするか、フェールバックとして残す
const INITIAL_LEADS_FALLBACK = [ { id: 1, name: "佐藤 健太", title: "IT担当", company: "株式会社テックフロンティア", status: "New", source: "Web", email: "sato@tech.com", phone: "03-1234-5678", lastActivity: "2023-10-25", city: "東京都港区" }, { id: 2, name: "鈴木 一郎", title: "代表取締役", company: "グローバルソリューションズ", status: "Working", source: "Referral", email: "suzuki@global.com", phone: "03-8765-4321", lastActivity: "2023-10-24", city: "大阪府大阪市" }, { id: 3, name: "田中 美咲", title: "マーケティング部長", company: "イノベーションデザイン", status: "Nurturing", source: "Seminar", email: "tanaka@inno.com", phone: "06-1234-5678", lastActivity: "2023-10-20", city: "福岡県福岡市" }, { id: 4, name: "高橋 誠", title: "システム部", company: "未来商事", status: "Converted", source: "Web", email: "takahashi@mirai.com", phone: "090-1111-2222", lastActivity: "2023-10-15", city: "神奈川県横浜市" }, ];
const INITIAL_ACCOUNTS = [ { id: 1, name: "株式会社テックフロンティア", industry: "IT/通信", type: "Customer", owner: "山田 太郎", website: "www.tech.com", phone: "03-1234-5678", employees: 500, billingCity: "東京都港区" }, { id: 2, name: "大和重工株式会社", industry: "製造", type: "Prospect", owner: "山田 太郎", website: "www.yamato-ind.com", phone: "052-123-4567", employees: 1200, billingCity: "愛知県名古屋市" }, { id: 3, name: "スカイライン物流", industry: "物流", type: "Partner", owner: "鈴木 花子", website: "www.skyline.com", phone: "045-123-4567", employees: 300, billingCity: "神奈川県横浜市" }, ];
const INITIAL_CONTACTS = [ { id: 1, name: "佐藤 健太", title: "IT戦略部長", email: "sato@tech.com", phone: "03-1234-5678", accountId: 1 }, { id: 2, name: "伊藤 博文", title: "購買課長", email: "ito@yamato-ind.com", phone: "052-123-9999", accountId: 2 }, { id: 3, name: "渡辺 直美", title: "営業本部長", email: "watanabe@skyline.com", phone: "045-123-8888", accountId: 3 }, { id: 4, name: "加藤 浩二", title: "CTO", email: "kato@tech.com", phone: "03-1234-5679", accountId: 1 }, ];
const INITIAL_OPPORTUNITIES = [ { id: 1, name: "基幹システム刷新プロジェクト", accountId: 2, amount: 15000000, stage: "Proposal", probability: 60, closeDate: "2023-12-20", owner: "山田 太郎", type: "New Business", leadSource: "Web", nextStep: "役員プレゼン", description: "老朽化した現行システムの全面刷新。競合A社とコンペ。", competitor: "Competitor A", daysInStage: 12 }, { id: 2, name: "クラウド移行支援", accountId: 1, amount: 5000000, stage: "Negotiation", probability: 80, closeDate: "2023-11-30", owner: "山田 太郎", type: "Existing Business", leadSource: "Referral", nextStep: "契約書レビュー", description: "オンプレミスからのAWS移行支援。", competitor: "None", daysInStage: 5 }, { id: 3, name: "セキュリティ監査", accountId: 3, amount: 3000000, stage: "Closed Won", probability: 100, closeDate: "2023-10-15", owner: "鈴木 花子", type: "Existing Business", leadSource: "Partner", nextStep: "-", description: "年次セキュリティ監査。", competitor: "None", daysInStage: 0 }, { id: 4, name: "AIチャットボット導入", accountId: 1, amount: 8000000, stage: "Discovery", probability: 20, closeDate: "2024-01-15", owner: "山田 太郎", type: "New Business", leadSource: "Seminar", nextStep: "要件定義ヒアリング", description: "カスタマーサポート効率化のためのAI導入。", competitor: "Competitor B, Competitor C", daysInStage: 45 }, { id: 5, name: "次年度ライセンス更新", accountId: 2, amount: 2000000, stage: "Closed Lost", probability: 0, closeDate: "2023-09-30", owner: "佐藤 次郎", type: "Existing Business", leadSource: "Other", nextStep: "-", description: "予算縮小により失注。", competitor: "-", daysInStage: 0 }, ];
const PRODUCTS = [ { id: 1, name: "Enterprise License", code: "SW-001", price: 100000 }, { id: 2, name: "Standard License", code: "SW-002", price: 50000 }, { id: 3, name: "Consulting Service (Hour)", code: "SVC-001", price: 25000 }, { id: 4, name: "Implementation Pack", code: "SVC-002", price: 1000000 }, { id: 5, name: "Maintenance Support", code: "SUP-001", price: 200000 }, ];
const INITIAL_LINE_ITEMS = [ { id: 1, opportunityId: 1, productId: 4, quantity: 1, salesPrice: 1000000, totalPrice: 1000000 }, { id: 2, opportunityId: 1, productId: 1, quantity: 140, salesPrice: 100000, totalPrice: 14000000 }, { id: 3, opportunityId: 2, productId: 3, quantity: 200, salesPrice: 25000, totalPrice: 5000000 }, { id: 4, opportunityId: 3, productId: 3, quantity: 120, salesPrice: 25000, totalPrice: 3000000 }, ];
const INITIAL_FILES = [ { id: 1, parentId: 1, name: "提案書_v1.0.pdf", size: "2.4 MB", date: "2023-10-20", type: "pdf" }, { id: 2, parentId: 1, name: "見積書_社印あり.pdf", size: "0.5 MB", date: "2023-10-22", type: "pdf" }, { id: 3, parentId: 2, name: "要件定義書.docx", size: "1.1 MB", date: "2023-10-15", type: "doc" }, ];
const INITIAL_ACTIVITIES = [ { id: 1, type: "call", subject: "初回ヒアリング", relatedTo: "基幹システム刷新プロジェクト", date: "2023-10-26 10:00", description: "予算感とスケジュールの確認" }, { id: 2, type: "email", subject: "提案書の送付", relatedTo: "クラウド移行支援", date: "2023-10-25 15:30", description: "修正した提案書を送付しました。" }, { id: 3, type: "meeting", subject: "契約内容の確認", relatedTo: "セキュリティ監査", date: "2023-10-14 14:00", description: "法務担当を交えての打ち合わせ" }, ];
const INITIAL_TASKS = [ { id: 1, subject: "見積書の作成と承認申請", priority: "High", status: "Not Started", dueDate: "2023-10-30", relatedTo: "基幹システム刷新プロジェクト" }, { id: 2, subject: "セキュリティチェックシートの回答", priority: "Normal", status: "In Progress", dueDate: "2023-11-02", relatedTo: "株式会社テックフロンティア" }, { id: 3, subject: "契約更新の案内メール送付", priority: "Low", status: "Not Started", dueDate: "2023-11-10", relatedTo: "スカイライン物流" }, { id: 4, subject: "週次営業定例", priority: "Normal", status: "Completed", dueDate: "2023-10-27", relatedTo: "社内" }, ];

// --- Constants & Utilities ---
const STAGES = ["Prospecting", "Discovery", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];
const STAGE_LABELS = { "Prospecting": "見込み", "Discovery": "ニーズ把握", "Proposal": "提案", "Negotiation": "交渉", "Closed Won": "受注", "Closed Lost": "失注" };
const LEAD_STATUSES = ["New", "Working", "Nurturing", "Converted"];
const LEAD_STATUS_LABELS = { "New": "新規", "Working": "対応中", "Nurturing": "育成中", "Converted": "取引開始済み", "Unqualified": "不適格" };
const formatCurrency = (amount) => { return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount); };
const getAccountName = (accountId, accounts) => { const account = accounts.find(a => a.id === Number(accountId)); return account ? account.name : '不明な取引先'; };
const getProductName = (productId) => { const prod = PRODUCTS.find(p => p.id === productId); return prod ? prod.name : 'Unknown Product'; };

// --- Gemini API Helper ---
const callGeminiAnalysis = async (opportunity, activities, tasks) => {
  const apiKey = ""; // Environment provided
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const activitySummary = activities.map(a => `- ${a.date} [${a.type}]: ${a.subject} (${a.description})`).join(' ');
  const taskSummary = tasks.map(t => `- ${t.dueDate} [${t.priority}]: ${t.subject} (${t.status})`).join(' ');
  
  const prompt = `
    あなたは優秀な営業マネージャーのアシスタントAIです。
    以下の商談情報を分析し、日本語で以下の項目を含むレポートを作成してください。
    マークダウン記法を使って構造化してください。特にリストや太字を効果的に使ってください。
    
    商談情報:
    - 商談名: ${opportunity.name}
    - フェーズ: ${opportunity.stage} (滞留: ${opportunity.daysInStage}日)
    - 金額: ${formatCurrency(opportunity.amount)}
    - 確度: ${opportunity.probability}%
    - 完了予定日: ${opportunity.closeDate}
    - 次のステップ: ${opportunity.nextStep}
    - 競合: ${opportunity.competitor}
    - 説明: ${opportunity.description}
    
    直近の活動: ${activitySummary}
    関連ToDo: ${taskSummary}
    
    出力フォーマット:
    ## 状況分析
    (ポジティブな点とネガティブな点)
    
    ## 受注確度評価
    (High/Medium/Lowとその理由)
    
    ## リスク要因
    - リスク1
    - リスク2
    
    ## 推奨アクション
    1. アクション1
    2. アクション2
    3. アクション3
  `;
  
  const payload = { contents: [{ parts: [{ text: prompt }] }] };
  
  let retryCount = 0;
  const maxRetries = 3;
  while (retryCount < maxRetries) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "分析結果を取得できませんでした。";
    } catch (error) {
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
    }
  }
  return "AI分析サービスに接続できませんでした。後ほど再試行してください。";
};

// --- Simple Markdown Renderer Component ---
const MarkdownRenderer = ({ content }) => {
  if (!content) return null;
  const parseBold = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };
  
  return (
    <div className="markdown-content space-y-1">
      {content.split('\n').map((line, index) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('### ')) { return <h4 key={index} className="text-md font-bold text-purple-900 mt-4 mb-2">{parseBold(trimmedLine.replace('### ', ''))}</h4>; }
        if (trimmedLine.startsWith('## ')) { return <h3 key={index} className="text-lg font-bold text-purple-800 mt-5 mb-2 border-b border-purple-100 pb-1">{parseBold(trimmedLine.replace('## ', ''))}</h3>; }
        if (trimmedLine.startsWith('# ')) { return <h2 key={index} className="text-xl font-bold text-purple-900 mt-6 mb-3">{parseBold(trimmedLine.replace('# ', ''))}</h2>; }
        if (trimmedLine.startsWith('- ')) { return <div key={index} className="flex items-start ml-2 mb-1"><span className="mr-2 text-purple-400 flex-shrink-0">•</span><span className="text-gray-700">{parseBold(trimmedLine.replace('- ', ''))}</span></div>; }
        if (/^\d+\.\s/.test(trimmedLine)) { return <div key={index} className="flex items-start ml-2 mb-1"><span className="mr-2 text-purple-600 font-bold flex-shrink-0">{trimmedLine.match(/^\d+\./)[0]}</span><span className="text-gray-700">{parseBold(trimmedLine.replace(/^\d+\.\s/, ''))}</span></div>; }
        if (trimmedLine === '') { return <div key={index} className="h-1"></div>; }
        return <p key={index} className="text-gray-700 leading-relaxed">{parseBold(line)}</p>;
      })}
    </div>
  );
};

// --- Components ---
const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'ダッシュボード', icon: LayoutDashboard },
    { id: 'leads', label: 'リード (見込み客)', icon: Users },
    { id: 'accounts', label: '取引先', icon: Building2 },
    { id: 'opportunities', label: '商談 (案件)', icon: Briefcase },
    { id: 'reports', label: 'レポート', icon: FileText },
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
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsMobileOpen(false); }} className={`w-full flex items-center px-6 py-3 text-sm font-medium transition-colors duration-150 ${activeTab === item.id || (activeTab === 'accountDetail' && item.id === 'accounts') || (activeTab === 'opportunityDetail' && item.id === 'opportunities') || (activeTab === 'leadDetail' && item.id === 'leads') ? 'bg-[#0176d3] text-white border-l-4 border-white' : 'text-gray-300 hover:bg-[#014486] hover:text-white border-l-4 border-transparent'}`}>
              <item.icon size={18} className="mr-3" />{item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 bg-[#011633]">
          <div className="flex items-center"><img src={MOCK_USER.avatar} alt="User" className="w-8 h-8 rounded-full border-2 border-gray-400" /><div className="ml-3"><p className="text-sm font-semibold text-white">{MOCK_USER.name}</p><p className="text-xs text-gray-400">{MOCK_USER.role}</p></div></div>
        </div>
      </div>
    </>
  );
};

const Header = ({ title, onMenuClick, globalSearch, setGlobalSearch }) => (
  <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-10 shadow-sm">
    <div className="flex items-center"><button onClick={onMenuClick} className="p-2 mr-2 text-gray-500 hover:bg-gray-100 rounded-md md:hidden"><Menu size={24} /></button><h1 className="text-xl font-semibold text-gray-800 hidden sm:block">{title}</h1></div>
    <div className="flex-1 max-w-xl mx-4 hidden md:block"><div className="relative"><span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search size={16} className="text-gray-400" /></span><input type="text" placeholder="すべてのアプリと項目を検索..." value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0176d3] focus:border-transparent transition-all" /></div></div>
    <div className="flex items-center space-x-2"><button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative"><Bell size={20} /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span></button><button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><Settings size={20} /></button><button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><LogOut size={20} /></button></div>
  </header>
);

const Modal = ({ isOpen, onClose, title, children, onSave }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md md:max-w-lg flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-200"><h3 className="text-lg font-semibold text-gray-800">{title}</h3><button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button></div>
        <div className="p-4 overflow-y-auto flex-1">{children}</div>
        <div className="flex justify-end space-x-2 p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg"><button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">キャンセル</button><button onClick={onSave} className="px-4 py-2 text-sm font-medium text-white bg-[#0176d3] rounded hover:bg-[#005fb2] shadow-sm flex items-center"><Save size={16} className="mr-1" /> 保存</button></div>
      </div>
    </div>
  );
};

const FormField = ({ label, children }) => (<div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>);
const Input = ({ type = "text", value, onChange, placeholder, ...props }) => (<input type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#0176d3] focus:border-[#0176d3]" {...props} />);
const TextArea = ({ value, onChange, placeholder, ...props }) => (<textarea value={value} onChange={onChange} placeholder={placeholder} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#0176d3] focus:border-[#0176d3]" {...props} />);
const Select = ({ value, onChange, options, ...props }) => (<select value={value} onChange={onChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#0176d3] focus:border-[#0176d3]" {...props}>{options.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}</select>);

const StatCard = ({ title, value, subtext, trend, type = "neutral" }) => (
  <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div><p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p><h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3></div>
      <div className={`p-2 rounded-full ${type === 'success' ? 'bg-green-100 text-green-600' : type === 'warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>{type === 'success' ? <ArrowRight className="transform -rotate-45" size={16} /> : <ArrowRight size={16} />}</div>
    </div>
    <p className="text-xs text-gray-500 mt-2 flex items-center"><span className={trend > 0 ? "text-green-600 font-bold mr-1" : "text-red-600 font-bold mr-1"}>{trend > 0 ? "+" : ""}{trend}%</span>{subtext}</p>
  </div>
);

const Dashboard = () => {
  const pipelineData = [{ name: '見込み', value: 4 }, { name: 'ニーズ把握', value: 3 }, { name: '提案', value: 6 }, { name: '交渉', value: 2 }, { name: '受注', value: 5 }];
  const sourceData = [{ name: 'Webサイト', value: 400 }, { name: '紹介', value: 300 }, { name: '展示会', value: 300 }, { name: 'その他', value: 200 }];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#0176d3'];
  return (
    <div className="p-6 bg-[#f3f2f2] min-h-full">
      <div className="mb-6 flex justify-between items-center"><h2 className="text-xl font-bold text-gray-800">営業ホーム</h2><span className="text-sm text-gray-500">最終更新: 2023/10/27 10:00</span></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"><StatCard title="今四半期の売上 (達成/目標)" value="¥23,000,000" subtext="目標 ¥30,000,000 に対する進捗" trend={12} type="success" /><StatCard title="オープンな商談金額" value="¥38,500,000" subtext="前月比" trend={5} type="neutral" /><StatCard title="コンバージョン率" value="24.8%" subtext="前月比" trend={-2.5} type="warning" /></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"><h3 className="text-lg font-semibold text-gray-800 mb-4">商談パイプライン</h3><div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={pipelineData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" /><YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} /><Tooltip /><Bar dataKey="value" fill="#0176d3" radius={[0, 4, 4, 0]} barSize={20} /></BarChart></ResponsiveContainer></div></div>
        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"><h3 className="text-lg font-semibold text-gray-800 mb-4">リードソース分析</h3><div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value" label>{sourceData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip /><Legend verticalAlign="bottom" height={36}/></PieChart></ResponsiveContainer></div></div>
      </div>
    </div>
  );
};

const KanbanBoard = ({ data, accounts, onItemClick }) => {
  return (
    <div className="flex h-full overflow-x-auto p-4 space-x-4 bg-[#f3f2f2]">
      {STAGES.map(stage => {
        const stageOpps = data.filter(d => d.stage === stage);
        const totalAmount = stageOpps.reduce((sum, opp) => sum + opp.amount, 0);
        return (
          <div key={stage} className="flex-shrink-0 w-72 flex flex-col bg-gray-100 rounded-md border border-gray-200 max-h-full">
            <div className="p-3 border-b border-gray-200 bg-white rounded-t-md sticky top-0">
              <div className="flex justify-between items-center mb-1"><h3 className="font-bold text-sm text-gray-700">{STAGE_LABELS[stage]}</h3><span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{stageOpps.length}</span></div>
              <p className="text-xs text-gray-500 font-medium">{formatCurrency(totalAmount)}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {stageOpps.map(opp => (
                <div key={opp.id} onClick={() => onItemClick(opp)} className="bg-white p-3 rounded border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow group relative">
                  <div className="flex justify-between items-start"><h4 className="text-sm font-medium text-[#0176d3] hover:underline truncate w-4/5">{opp.name}</h4>{opp.daysInStage > 30 && (<Tooltip content="滞留注意"><AlertCircle size={14} className="text-red-500" /></Tooltip>)}</div>
                  <p className="text-xs text-gray-600 mt-1 truncate">{getAccountName(opp.accountId, accounts)}</p>
                  <div className="flex justify-between items-end mt-3"><p className="text-sm font-bold text-gray-800">{formatCurrency(opp.amount)}</p><img src={MOCK_USER.avatar} alt="Owner" className="w-5 h-5 rounded-full" /></div>
                  {opp.daysInStage > 0 && (<div className="mt-2 pt-2 border-t border-gray-100 flex items-center text-[10px] text-gray-400"><Calendar size={10} className="mr-1" /> このフェーズに {opp.daysInStage} 日</div>)}
                </div>
              ))}
              {stageOpps.length === 0 && (<div className="text-center py-8 text-gray-400 text-xs italic">案件なし</div>)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const LeadDetail = ({ lead, onBack, onEdit, onDelete, onStatusChange }) => {
  if (!lead) return null;
  const StatusPath = ({ currentStatus }) => {
    const currentIdx = LEAD_STATUSES.indexOf(currentStatus) !== -1 ? LEAD_STATUSES.indexOf(currentStatus) : 0;
    return (
      <div className="flex items-center w-full overflow-x-auto py-4 mb-4 no-scrollbar">
        {LEAD_STATUSES.map((status, idx) => {
          let statusClass = "bg-gray-200 text-gray-500 hover:bg-gray-300";
          if (idx < currentIdx) statusClass = "bg-green-500 text-white hover:bg-green-600";
          if (idx === currentIdx) statusClass = "bg-[#0176d3] text-white font-bold hover:bg-[#005fb2]";
          if (currentStatus === "Unqualified") statusClass = "bg-gray-300 text-gray-500";
          return (
            <div key={status} onClick={() => onStatusChange(status)} className="flex items-center flex-shrink-0 group cursor-pointer relative h-10 mr-1">
              <div className={`${statusClass} pl-6 pr-2 h-full flex items-center justify-center relative z-10 clip-path-arrow transition-colors`} style={{ clipPath: "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)" }}><span className="text-sm whitespace-nowrap ml-2">{LEAD_STATUS_LABELS[status] || status}</span></div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div className="flex flex-col h-full bg-[#f3f2f2]">
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <button onClick={onBack} className="text-xs text-[#0176d3] mb-2 hover:underline flex items-center">← リード一覧に戻る</button>
        <div className="flex justify-between items-start">
          <div className="flex items-center"><div className="bg-[#f26f21] p-2 rounded-md mr-3"><Users className="text-white" size={24} /></div><div><p className="text-sm text-gray-500">リード</p><h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1></div></div>
          <div className="flex space-x-2"><button onClick={onEdit} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50">編集</button><button onClick={onDelete} className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded text-sm font-medium hover:bg-red-50">削除</button><button className="bg-[#0176d3] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#005fb2] shadow-sm">取引開始</button></div>
        </div>
      </div>
      <div className="bg-white border-b border-gray-200 px-6 shadow-sm mb-4"><StatusPath currentStatus={lead.status} /></div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg"><h3 className="font-semibold text-gray-800">詳細情報</h3></div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">氏名</p><p className="text-sm text-gray-900">{lead.name}</p></div>
            <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">会社名</p><p className="text-sm text-gray-900">{lead.company}</p></div>
            <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">メール</p><p className="text-sm text-[#0176d3]">{lead.email}</p></div>
            <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">電話</p><p className="text-sm text-gray-900">{lead.phone}</p></div>
            <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">住所</p><p className="text-sm text-gray-900">{lead.city || '-'}</p></div>
            <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">ソース</p><p className="text-sm text-gray-900">{lead.source}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountDetail = ({ account, onBack, onEdit, onDelete, onOppClick, opportunities, contacts }) => {
  if (!account) return null;
  const relatedOpps = opportunities.filter(opp => opp.accountId === account.id);
  const relatedContacts = contacts.filter(contact => contact.accountId === account.id);
  return (
    <div className="flex flex-col h-full bg-[#f3f2f2]">
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <button onClick={onBack} className="text-xs text-[#0176d3] mb-2 hover:underline flex items-center">← 取引先一覧に戻る</button>
        <div className="flex justify-between items-start">
          <div className="flex items-center"><div className="bg-[#7f8c8d] p-2 rounded-md mr-3"><Building2 className="text-white" size={24} /></div><div><p className="text-sm text-gray-500">取引先</p><h1 className="text-2xl font-bold text-gray-900">{account.name}</h1></div></div>
          <div className="flex space-x-2"><button onClick={onEdit} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50">編集</button><button onClick={onDelete} className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded text-sm font-medium hover:bg-red-50">削除</button><button className="bg-[#0176d3] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#005fb2] shadow-sm">新規商談</button></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg"><h3 className="font-semibold text-gray-800">詳細情報</h3></div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">取引先名</p><p className="text-sm text-gray-900">{account.name}</p></div>
                <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">業種</p><p className="text-sm text-gray-900">{account.industry}</p></div>
                <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">電話</p><p className="text-sm text-gray-900">{account.phone}</p></div>
                <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">Webサイト</p><p className="text-sm text-[#0176d3] hover:underline cursor-pointer">{account.website}</p></div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg flex justify-between items-center"><h3 className="font-semibold text-gray-800">商談 ({relatedOpps.length})</h3></div>
              <div className="p-0 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-gray-500 border-b border-gray-100"><tr><th className="px-6 py-2 font-medium">商談名</th><th className="px-6 py-2 font-medium text-right">金額</th></tr></thead>
                  <tbody>{relatedOpps.map(opp => (<tr key={opp.id} className="hover:bg-gray-50"><td className="px-6 py-3 text-[#0176d3] cursor-pointer" onClick={() => onOppClick(opp)}>{opp.name}</td><td className="px-6 py-3 text-right">{formatCurrency(opp.amount)}</td></tr>))}</tbody>
                </table>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg flex justify-between items-center"><h3 className="font-semibold text-gray-800">担当者 ({relatedContacts.length})</h3></div>
              <div className="p-0 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="text-gray-500 border-b border-gray-100"><tr><th className="px-6 py-2 font-medium">氏名</th><th className="px-6 py-2 font-medium">役職</th></tr></thead>
                  <tbody>{relatedContacts.map(c => (<tr key={c.id} className="hover:bg-gray-50"><td className="px-6 py-3 text-[#0176d3] cursor-pointer">{c.name}</td><td className="px-6 py-3">{c.title}</td></tr>))}</tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full">
              <div className="px-4 py-3 border-b border-gray-200 rounded-t-lg"><h3 className="font-semibold text-gray-800">活動</h3></div>
              <div className="p-4 text-center text-gray-500 text-sm"><p>活動履歴</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OpportunityDetail = ({ opportunity, accounts, onBack, onEdit, onDelete, onStageChange, lineItems, files, activities, tasks, onNewTask, onNewActivity }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  if (!opportunity) return null;
  const accountName = getAccountName(opportunity.accountId, accounts);
  const relatedFiles = files.filter(f => f.parentId === opportunity.id);
  const relatedLineItems = lineItems.filter(item => item.opportunityId === opportunity.id);
  const relatedActivities = activities.filter(act => act.relatedTo === opportunity.name);
  const relatedTasks = tasks.filter(task => task.relatedTo === opportunity.name);
  const upcomingTasks = relatedTasks.filter(task => task.status !== "Completed");
  const pastActivities = [ ...relatedActivities.map(a => ({ ...a, kind: 'activity' })), ...relatedTasks.filter(t => t.status === "Completed").map(t => ({ ...t, kind: 'task' })) ].sort((a, b) => { const dateA = a.kind === 'activity' ? a.date : a.dueDate; const dateB = b.kind === 'activity' ? b.date : b.dueDate; return new Date(dateB) - new Date(dateA); });
  const handleAnalyze = async () => { setIsAnalyzing(true); const result = await callGeminiAnalysis(opportunity, relatedActivities, relatedTasks); setAnalysisResult(result); setIsAnalyzing(false); };
  const SalesPath = ({ currentStage }) => {
    const currentIdx = STAGES.indexOf(currentStage) !== -1 ? STAGES.indexOf(currentStage) : 0;
    return (
      <div className="flex items-center w-full overflow-x-auto py-4 mb-4 no-scrollbar">
        {STAGES.map((stage, idx) => {
          let statusClass = "bg-gray-200 text-gray-500 hover:bg-gray-300";
          if (idx < currentIdx) statusClass = "bg-green-500 text-white hover:bg-green-600";
          if (idx === currentIdx) statusClass = "bg-[#0176d3] text-white font-bold hover:bg-[#005fb2]";
          if (currentStage === "Closed Lost") statusClass = "bg-gray-300 text-gray-500";
          return (
            <div key={stage} onClick={() => onStageChange(stage)} className="flex items-center flex-shrink-0 group cursor-pointer relative h-10 mr-1">
              <div className={`${statusClass} pl-6 pr-2 h-full flex items-center justify-center relative z-10 clip-path-arrow transition-colors`} style={{ clipPath: "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)" }}> <span className="text-sm whitespace-nowrap ml-2">{STAGE_LABELS[stage]}</span> </div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <div className="flex flex-col h-full bg-[#f3f2f2]">
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <button onClick={onBack} className="text-xs text-[#0176d3] mb-2 hover:underline flex items-center">← 商談一覧に戻る</button>
        <div className="flex justify-between items-start">
          <div className="flex items-center"> <div className="bg-[#f59e0b] p-2 rounded-md mr-3"><Briefcase className="text-white" size={24} /></div> <div><p className="text-sm text-gray-500">商談</p><h1 className="text-2xl font-bold text-gray-900">{opportunity.name}</h1></div> </div>
          <div className="flex space-x-2"> <button onClick={onEdit} className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-50">編集</button> <button onClick={onDelete} className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded text-sm font-medium hover:bg-red-50">削除</button> <button className="bg-[#0176d3] text-white px-4 py-2 rounded text-sm font-medium hover:bg-[#005fb2] shadow-sm">フェーズ変更</button> </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 mb-2"> <div><p className="text-xs text-gray-500">取引先名</p><p className="text-sm font-medium text-[#0176d3] hover:underline cursor-pointer">{accountName}</p></div> <div><p className="text-xs text-gray-500">金額</p><p className="text-sm font-medium">{formatCurrency(opportunity.amount)}</p></div> <div><p className="text-xs text-gray-500">完了予定日</p><p className="text-sm font-medium">{opportunity.closeDate}</p></div> <div><p className="text-xs text-gray-500">商談所有者</p><p className="text-sm font-medium text-[#0176d3]">{opportunity.owner}</p></div> </div>
      </div>
      <div className="bg-white border-b border-gray-200 px-6 shadow-sm mb-4"><SalesPath currentStage={opportunity.stage} /></div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* AI Analysis Section */}
            <div className="bg-white rounded-lg border border-purple-200 shadow-sm overflow-hidden">
              <div className="px-6 py-3 bg-purple-50 border-b border-purple-100 flex justify-between items-center"> <h3 className="font-semibold text-purple-800 flex items-center"><Sparkles size={16} className="mr-2" /> Gemini 商談分析</h3> <button onClick={handleAnalyze} disabled={isAnalyzing} className="text-xs bg-white border border-purple-200 text-purple-700 px-3 py-1.5 rounded hover:bg-purple-100 flex items-center transition-colors"> {isAnalyzing ? <Loader2 size={12} className="animate-spin mr-1" /> : <RefreshCw size={12} className="mr-1" />} {isAnalyzing ? '分析中...' : 'AI分析を実行'} </button> </div>
              {analysisResult ? ( <div className="p-6 text-sm text-gray-700 leading-relaxed bg-gradient-to-b from-white to-purple-50/30"> <MarkdownRenderer content={analysisResult} /> </div> ) : ( <div className="p-8 text-center text-gray-400 text-sm"> <Sparkles size={24} className="mx-auto mb-2 opacity-30" /> ボタンを押すと、AIが商談状況を分析しアドバイスを表示します。 </div> )}
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg"><h3 className="font-semibold text-gray-800">詳細情報</h3></div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">商談名</p><p className="text-sm text-gray-900">{opportunity.name}</p></div>
                <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">取引先名</p><p className="text-sm text-[#0176d3]">{accountName}</p></div>
                <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">フェーズ</p><p className="text-sm text-gray-900">{STAGE_LABELS[opportunity.stage]}</p></div>
                <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">確度 (%)</p><p className="text-sm text-gray-900">{opportunity.probability}%</p></div>
                <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">金額</p><p className="text-sm text-gray-900">{formatCurrency(opportunity.amount)}</p></div>
                <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">完了予定日</p><p className="text-sm text-gray-900">{opportunity.closeDate}</p></div>
                <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">商談種別</p><p className="text-sm text-gray-900">{opportunity.type || '-'}</p></div>
                <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">リードソース</p><p className="text-sm text-gray-900">{opportunity.leadSource || '-'}</p></div>
                <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">次のステップ</p><p className="text-sm text-gray-900">{opportunity.nextStep || '-'}</p></div>
                <div className="border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">競合</p><p className="text-sm text-gray-900">{opportunity.competitor || '-'}</p></div>
                <div className="col-span-2 border-b border-gray-100 pb-2"><p className="text-xs text-gray-500 mb-1">説明</p><p className="text-sm text-gray-900">{opportunity.description || '-'}</p></div>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg flex justify-between items-center"> <h3 className="font-semibold text-gray-800">商品 ({relatedLineItems.length})</h3> <button className="text-xs bg-white border border-gray-300 px-2 py-1 rounded text-gray-600">商品を追加</button> </div>
              <div className="p-0 overflow-x-auto">
                {relatedLineItems.length > 0 ? (
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-gray-500 border-b border-gray-100"> <tr><th className="px-6 py-2 font-medium">商品名</th><th className="px-6 py-2 font-medium text-right">数量</th><th className="px-6 py-2 font-medium text-right">販売価格</th><th className="px-6 py-2 font-medium text-right">合計金額</th></tr> </thead>
                    <tbody> {relatedLineItems.map(item => ( <tr key={item.id} className="hover:bg-gray-50"> <td className="px-6 py-3 text-[#0176d3]">{getProductName(item.productId)}</td> <td className="px-6 py-3 text-right">{item.quantity}</td> <td className="px-6 py-3 text-right">{formatCurrency(item.salesPrice)}</td> <td className="px-6 py-3 text-right">{formatCurrency(item.totalPrice)}</td> </tr> ))} </tbody>
                  </table>
                ) : (<div className="p-6 text-center text-gray-500 text-sm">商品が追加されていません。</div>)}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 rounded-t-lg flex justify-between items-center"> <h3 className="font-semibold text-gray-800">ファイル ({relatedFiles.length})</h3> <button className="text-xs bg-white border border-gray-300 px-2 py-1 rounded text-gray-600 flex items-center"><Paperclip size={12} className="mr-1" /> ファイルをアップロード</button> </div>
              <div className="p-0 overflow-x-auto">
                {relatedFiles.length > 0 ? (
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-gray-500 border-b border-gray-100"> <tr><th className="px-6 py-2 font-medium">ファイル名</th><th className="px-6 py-2 font-medium">サイズ</th><th className="px-6 py-2 font-medium">更新日</th><th className="px-6 py-2 font-medium"></th></tr> </thead>
                    <tbody> {relatedFiles.map(file => ( <tr key={file.id} className="hover:bg-gray-50"> <td className="px-6 py-3 text-[#0176d3] font-medium flex items-center"><FileText size={16} className="mr-2 text-gray-400" /> {file.name}</td> <td className="px-6 py-3 text-gray-600">{file.size}</td> <td className="px-6 py-3 text-gray-600">{file.date}</td> <td className="px-6 py-3 text-right"><button className="text-gray-400 hover:text-[#0176d3]"><Download size={16} /></button></td> </tr> ))} </tbody>
                  </table>
                ) : (<div className="p-6 text-center text-gray-500 text-sm">ファイルがありません。</div>)}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-full">
              <div className="px-4 py-3 border-b border-gray-200 rounded-t-lg flex space-x-4"> <button className="text-sm font-semibold text-[#0176d3] border-b-2 border-[#0176d3] pb-2">活動</button> <button className="text-sm font-medium text-gray-500 pb-2 hover:text-gray-700">Chatter</button> </div>
              <div className="p-4 flex space-x-2 border-b border-gray-100 bg-gray-50"> <button onClick={onNewTask} className="flex-1 bg-white border border-gray-300 text-gray-600 py-1 text-xs rounded shadow-sm hover:bg-gray-100">ToDo作成</button> <button onClick={onNewActivity} className="flex-1 bg-white border border-gray-300 text-gray-600 py-1 text-xs rounded shadow-sm hover:bg-gray-100">活動の記録</button> <button className="flex-1 bg-white border border-gray-300 text-gray-600 py-1 text-xs rounded shadow-sm hover:bg-gray-100">メール</button> </div>
              <div className="p-4 space-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-3">今後</p>
                  {upcomingTasks.length > 0 ? upcomingTasks.map(task => (
                    <div key={task.id} className="bg-white border border-gray-200 p-3 rounded shadow-sm text-sm mb-3 flex items-start">
                      <CheckSquare size={16} className="text-[#0176d3] mt-0.5 mr-2 flex-shrink-0" />
                      <div> <p className="font-semibold text-[#0176d3] cursor-pointer hover:underline">{task.subject}</p> <p className="text-xs text-gray-500 mt-1">期限: {task.dueDate} • 優先度: {task.priority}</p> </div>
                    </div>
                  )) : ( <div className="flex items-start opacity-60"><div className="flex-shrink-0 mt-1"><div className="w-3 h-3 rounded-full bg-gray-300"></div></div><div className="ml-3"><p className="text-sm text-gray-500 italic">予定されている活動はありません</p></div></div> )}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase mb-3">過去</p>
                  {pastActivities.length > 0 ? pastActivities.map((item, idx) => (
                    <div key={`${item.kind}-${item.id}`} className="relative pl-4 border-l border-gray-200 pb-4 last:border-0 last:pb-0">
                      <div className={`absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full border-2 border-white ${item.kind === 'task' ? 'bg-green-500' : item.type === 'call' ? 'bg-purple-500' : item.type === 'email' ? 'bg-blue-500' : 'bg-orange-500'}`}></div>
                      <div className="bg-white border border-gray-200 p-3 rounded shadow-sm text-sm">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span className="capitalize flex items-center"> {item.kind === 'task' ? <CheckSquare size={12} className="mr-1"/> : item.type === 'call' ? <Phone size={12} className="mr-1"/> : item.type === 'email' ? <Mail size={12} className="mr-1"/> : <Users size={12} className="mr-1"/>} {item.kind === 'task' ? 'ToDo完了' : item.type} </span>
                          <span>{item.kind === 'activity' ? item.date : item.dueDate}</span>
                        </div>
                        <p className="font-semibold text-[#0176d3] cursor-pointer">{item.subject}</p>
                        {item.description && <p className="text-gray-700 mt-1 text-xs">{item.description}</p>}
                      </div>
                    </div>
                  )) : (<p className="text-sm text-gray-500 italic">過去の活動履歴はありません</p>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StandardListView = ({ title, icon: Icon, data, columns, onItemClick, onNewClick, onEditClick, onDeleteClick, filterText, accounts, viewMode, setViewMode, onKanbanClick }) => {
  const filteredData = data.filter(row => {
    if (!filterText) return true;
    const searchText = filterText.toLowerCase();
    return Object.values(row).some(val => String(val).toLowerCase().includes(searchText));
  });
  const renderCell = (row, col) => {
    if (col.key === 'accountId') { const accountName = getAccountName(row.accountId, accounts); return <span className="text-[#0176d3] hover:underline cursor-pointer">{accountName}</span>; }
    return row[col.key];
  };
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b border-gray-200 px-4 py-3 flex justify-between items-center sticky top-0 bg-white z-10">
        <div className="flex items-center">
          <div className={`p-1.5 rounded mr-3 ${title === 'リード' ? 'bg-[#f26f21]' : title === '商談' ? 'bg-[#f59e0b]' : 'bg-[#0176d3]'}`}><Icon className="text-white" size={20} /></div>
          <div> <p className="text-xs text-gray-500">{title}</p> <div className="flex items-center cursor-pointer hover:bg-gray-100 rounded pr-2"><h2 className="text-lg font-bold text-gray-800 mr-1">最近参照したデータ</h2><ChevronRight size={16} className="text-gray-400 rotate-90" /></div> </div>
        </div>
        <div className="flex space-x-2">
          {setViewMode && (
            <div className="flex bg-gray-100 rounded p-1 mr-2">
              <button onClick={() => setViewMode('table')} className={`p-1 rounded ${viewMode === 'table' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`} title="テーブル表示"><List size={16} /></button>
              <button onClick={() => setViewMode('kanban')} className={`p-1 rounded ${viewMode === 'kanban' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`} title="カンバン表示"><Columns size={16} /></button>
            </div>
          )}
          <button onClick={onNewClick} className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-50 flex items-center">新規</button>
          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded border border-gray-300"><RefreshCw size={16} /></button>
          <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded border border-gray-300"><Settings size={16} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-white">
        {viewMode === 'kanban' ? (
          <KanbanBoard data={filteredData} accounts={accounts} onItemClick={onKanbanClick} />
        ) : (
          <table className="min-w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 sticky top-0 z-0">
              <tr>
                <th className="px-4 py-2 w-10 text-center"><input type="checkbox" /></th>
                {columns.map(col => (<th key={col.key} className="px-4 py-2 font-medium text-gray-500 border-b border-gray-200">{col.label}</th>))}
                <th className="px-4 py-2 w-10 border-b border-gray-200"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 group">
                  <td className="px-4 py-2 text-center"><input type="checkbox" /></td>
                  {columns.map((col, idx) => (
                    <td key={col.key} className={`px-4 py-3 ${idx === 0 ? 'font-medium text-[#0176d3] cursor-pointer hover:underline' : 'text-gray-700'}`} onClick={idx === 0 ? () => onItemClick(row) : undefined}>
                      {renderCell(row, col)}
                    </td>
                  ))}
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => onEditClick(row)} className="p-1 text-gray-400 hover:text-[#0176d3]"><Edit2 size={14} /></button>
                      <button onClick={() => onDeleteClick(row.id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (<tr><td colSpan={columns.length + 2} className="px-4 py-8 text-center text-gray-500 italic">データがありません</td></tr>)}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// --- App Container ---
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [opportunities, setOpportunities] = useState(INITIAL_OPPORTUNITIES);
  const [lineItems, setLineItems] = useState(INITIAL_LINE_ITEMS);
  const [files, setFiles] = useState(INITIAL_FILES);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'lead', 'account', 'opportunity', 'task', 'activity'
  const [editingItem, setEditingItem] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'kanban'
  const formRef = React.useRef(null);

  // Fetch data from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/customers`);
        if (response.ok) {
          const data = await response.json();
          const formattedLeads = data.map(c => ({
            id: c.id,
            name: c.name,
            title: '-',
            company: c.company || '-',
            status: c.status || 'New',
            source: 'Web',
            email: c.email,
            phone: '-',
            lastActivity: c.created_at ? c.created_at.split('T')[0] : '-',
            city: '-'
          }));
          setLeads(formattedLeads);
        }
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  const handleSave = async (data) => {
    if (modalType === 'lead') {
      try {
        // API POST
        const response = await fetch(`${API_URL}/api/customers`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            company: data.company,
            status: data.status
          }),
        });
        
        if (response.ok) {
          const newCustomer = await response.json();
          const newLead = {
            id: newCustomer.id,
            name: newCustomer.name,
            title: data.title || '-',
            company: newCustomer.company,
            status: newCustomer.status,
            source: data.source || 'Web',
            email: newCustomer.email,
            phone: data.phone || '-',
            lastActivity: new Date().toISOString().split('T')[0],
            city: data.city || '-'
          };
          setLeads([newLead, ...leads]);
        }
      } catch (error) {
        console.error("Failed to save lead:", error);
        // Fallback for UI
        const newItem = { ...data, id: Date.now(), lastActivity: new Date().toISOString().split('T')[0] };
        setLeads([newItem, ...leads]);
      }
    } else if (modalType === 'account') {
      if (editingItem) { setAccounts(accounts.map(item => item.id === editingItem.id ? { ...item, ...data } : item)); if (selectedAccount && selectedAccount.id === editingItem.id) setSelectedAccount({ ...selectedAccount, ...data }); }
      else { const newItem = { ...data, id: accounts.length + 1 }; setAccounts([newItem, ...accounts]); }
    } else if (modalType === 'opportunity') {
      if (editingItem) { setOpportunities(opportunities.map(item => item.id === editingItem.id ? { ...item, ...data } : item)); if (selectedOpportunity && selectedOpportunity.id === editingItem.id) setSelectedOpportunity({ ...selectedOpportunity, ...data }); }
      else { const newItem = { ...data, id: opportunities.length + 1, daysInStage: 0 }; setOpportunities([newItem, ...opportunities]); }
    } else if (modalType === 'task') {
      const newItem = { ...data, id: tasks.length + 1, status: 'Not Started', relatedTo: selectedOpportunity ? selectedOpportunity.name : '' }; setTasks([newItem, ...tasks]);
    } else if (modalType === 'activity') {
      const newItem = { ...data, id: activities.length + 1, relatedTo: selectedOpportunity ? selectedOpportunity.name : '' }; setActivities([newItem, ...activities]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, type) => {
    if (confirm('本当に削除しますか？')) {
      if (type === 'lead') { setLeads(leads.filter(item => item.id !== id)); if (selectedLead && selectedLead.id === id) setActiveTab('leads'); }
      else if (type === 'account') { setAccounts(accounts.filter(item => item.id !== id)); if (selectedAccount && selectedAccount.id === id) setActiveTab('accounts'); }
      else if (type === 'opportunity') { setOpportunities(opportunities.filter(item => item.id !== id)); if (selectedOpportunity && selectedOpportunity.id === id) setActiveTab('opportunities'); }
    }
  };

  const openNewModal = (type) => { setModalType(type); setEditingItem(null); setIsModalOpen(true); };
  const openEditModal = (item, type) => { setModalType(type); setEditingItem(item); setIsModalOpen(true); };

  const renderContent = () => {
    if (activeTab === 'dashboard') return <Dashboard />;
    if (activeTab === 'leads') return <StandardListView title="リード" icon={Users} data={leads} columns={[ { key: 'name', label: '氏名' }, { key: 'title', label: '役職' }, { key: 'company', label: '会社名' }, { key: 'status', label: '状況' }, { key: 'email', label: 'メール' }, { key: 'lastActivity', label: '最終活動日' } ]} onItemClick={(lead) => { setSelectedLead(lead); setActiveTab('leadDetail'); }} onNewClick={() => openNewModal('lead')} onEditClick={(lead) => openEditModal(lead, 'lead')} onDeleteClick={(id) => handleDelete(id, 'lead')} filterText={globalSearch} accounts={accounts} />;
    if (activeTab === 'leadDetail') return <LeadDetail lead={selectedLead} onBack={() => setActiveTab('leads')} onEdit={() => openEditModal(selectedLead, 'lead')} onDelete={() => handleDelete(selectedLead.id, 'lead')} onStatusChange={(newStatus) => { const updated = { ...selectedLead, status: newStatus }; setLeads(leads.map(l => l.id === updated.id ? updated : l)); setSelectedLead(updated); }} />;
    if (activeTab === 'accounts') return <StandardListView title="取引先" icon={Building2} data={accounts} columns={[ { key: 'name', label: '取引先名' }, { key: 'industry', label: '業種' }, { key: 'phone', label: '電話' }, { key: 'website', label: 'Webサイト' }, { key: 'owner', label: '所有者' } ]} onItemClick={(acc) => { setSelectedAccount(acc); setActiveTab('accountDetail'); }} onNewClick={() => openNewModal('account')} onEditClick={(acc) => openEditModal(acc, 'account')} onDeleteClick={(id) => handleDelete(id, 'account')} filterText={globalSearch} accounts={accounts} />;
    if (activeTab === 'accountDetail') return <AccountDetail account={selectedAccount} opportunities={opportunities} contacts={contacts} onBack={() => setActiveTab('accounts')} onEdit={() => openEditModal(selectedAccount, 'account')} onDelete={() => handleDelete(selectedAccount.id, 'account')} onOppClick={(opp) => { setSelectedOpportunity(opp); setActiveTab('opportunityDetail'); }} />;
    if (activeTab === 'opportunities') return <StandardListView title="商談" icon={Briefcase} data={opportunities} columns={[ { key: 'name', label: '商談名' }, { key: 'accountId', label: '取引先名' }, { key: 'amount', label: '金額' }, { key: 'stage', label: 'フェーズ' }, { key: 'closeDate', label: '完了予定日' }, { key: 'owner', label: '所有者' } ]} onItemClick={(opp) => { setSelectedOpportunity(opp); setActiveTab('opportunityDetail'); }} onNewClick={() => openNewModal('opportunity')} onEditClick={(opp) => openEditModal(opp, 'opportunity')} onDeleteClick={(id) => handleDelete(id, 'opportunity')} filterText={globalSearch} accounts={accounts} viewMode={viewMode} setViewMode={setViewMode} onKanbanClick={(opp) => { setSelectedOpportunity(opp); setActiveTab('opportunityDetail'); }} />;
    if (activeTab === 'opportunityDetail') return <OpportunityDetail opportunity={selectedOpportunity} accounts={accounts} lineItems={lineItems} files={files} activities={activities} tasks={tasks} onBack={() => setActiveTab('opportunities')} onEdit={() => openEditModal(selectedOpportunity, 'opportunity')} onDelete={() => handleDelete(selectedOpportunity.id, 'opportunity')} onStageChange={(newStage) => { const updated = { ...selectedOpportunity, stage: newStage }; setOpportunities(opportunities.map(o => o.id === updated.id ? updated : o)); setSelectedOpportunity(updated); }} onNewTask={() => openNewModal('task')} onNewActivity={() => openNewModal('activity')} />;
    return <div className="p-8 text-center text-gray-500">準備中です...</div>;
  };

  return (
    <div className="flex h-screen bg-[#f3f2f2] font-sans text-gray-900 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        <Header title={activeTab === 'dashboard' ? 'ダッシュボード' : activeTab === 'leads' ? 'リード' : activeTab === 'accounts' ? '取引先' : 'CloudForce'} onMenuClick={() => setIsMobileOpen(true)} globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} />
        <main className="flex-1 overflow-hidden relative">{renderContent()}</main>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? '編集' : '新規作成'} onSave={() => {
          if (formRef.current) {
            if (!formRef.current.reportValidity()) return;
            const formData = new FormData(formRef.current);
            const data = Object.fromEntries(formData.entries());
            handleSave(data);
          }
        }}>
        <form ref={formRef}>
          {modalType === 'lead' && (
            <>
              <FormField label="氏名"><Input name="name" required placeholder="例: 山田 太郎" defaultValue={editingItem?.name} /></FormField>
              <FormField label="会社名"><Input name="company" placeholder="例: 株式会社ABC" defaultValue={editingItem?.company} /></FormField>
              <FormField label="役職"><Input name="title" placeholder="例: 部長" defaultValue={editingItem?.title} /></FormField>
              <FormField label="メール"><Input type="email" name="email" required placeholder="email@example.com" defaultValue={editingItem?.email} /></FormField>
              <FormField label="電話番号"><Input type="tel" name="phone" placeholder="03-1234-5678" defaultValue={editingItem?.phone} /></FormField>
              <FormField label="ステータス"><Select name="status" options={LEAD_STATUSES.map(s => ({ value: s, label: LEAD_STATUS_LABELS[s] }))} defaultValue={editingItem?.status} /></FormField>
            </>
          )}
          {modalType === 'account' && (
            <>
              <FormField label="取引先名"><Input name="name" defaultValue={editingItem?.name} /></FormField>
              <FormField label="業種"><Input name="industry" defaultValue={editingItem?.industry} /></FormField>
              <FormField label="電話番号"><Input name="phone" defaultValue={editingItem?.phone} /></FormField>
              <FormField label="Webサイト"><Input name="website" defaultValue={editingItem?.website} /></FormField>
            </>
          )}
          {modalType === 'opportunity' && (
            <>
              <FormField label="商談名"><Input name="name" defaultValue={editingItem?.name} /></FormField>
              <FormField label="金額"><Input type="number" name="amount" defaultValue={editingItem?.amount} /></FormField>
              <FormField label="完了予定日"><Input type="date" name="closeDate" defaultValue={editingItem?.closeDate} /></FormField>
              <FormField label="フェーズ"><Select name="stage" options={STAGES.map(s => ({ value: s, label: STAGE_LABELS[s] }))} defaultValue={editingItem?.stage} /></FormField>
            </>
          )}
          {modalType === 'task' && (
             <>
               <FormField label="件名"><Input name="subject" /></FormField>
               <FormField label="期限"><Input type="date" name="dueDate" /></FormField>
               <FormField label="優先度"><Select name="priority" options={[{value:'High', label:'高'}, {value:'Normal', label:'中'}, {value:'Low', label:'低'}]} /></FormField>
             </>
          )}
          {modalType === 'activity' && (
             <>
               <FormField label="件名"><Input name="subject" /></FormField>
               <FormField label="日付"><Input type="datetime-local" name="date" /></FormField>
               <FormField label="タイプ"><Select name="type" options={[{value:'call', label:'電話'}, {value:'email', label:'メール'}, {value:'meeting', label:'会議'}]} /></FormField>
               <FormField label="説明"><TextArea name="description" /></FormField>
             </>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default App;
