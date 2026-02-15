import React, { useState, useMemo, useEffect, useRef } from 'react';
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from '@react-oauth/google';
import { LayoutDashboard, Users, Building2, Briefcase, CheckSquare } from 'lucide-react';

// Utils & Constants
import { API_URL, GOOGLE_CLIENT_ID, LEAD_STATUSES, LEAD_STATUS_LABELS, STAGES, STAGE_LABELS } from './utils/constants';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Modal from './components/Modal';
import { FormField, Input, Select } from './components/ui/FormElements';

// Pages
import Dashboard from './pages/Dashboard';
import StandardListView from './pages/StandardListView';
import LeadDetail from './pages/LeadDetail';
import AccountDetail from './pages/AccountDetail';
import OpportunityDetail from './pages/OpportunityDetail';

const INITIAL_TASKS = [ { id: 1, subject: "見積書の作成と承認申請", priority: "High", status: "Not Started", dueDate: "2023-10-30", relatedTo: "基幹システム刷新プロジェクト" } ];

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('leads');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('id_token'));
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const formRef = useRef(null);

  useEffect(() => {
    if (!token) return;
    try { const payload = JSON.parse(atob(token.split('.')[1])); setUser({ name: payload.name, avatar: payload.picture, email: payload.email }); } catch (e) { console.error(e); }
    const fetchData = async () => {
      const headers = { 'Authorization': `Bearer ${token}` };
      try {
        const responses = await Promise.all([
          fetch(`${API_URL}/api/customers`, { headers }),
          fetch(`${API_URL}/api/accounts`, { headers }),
          fetch(`${API_URL}/api/opportunities`, { headers })
        ]);

        if (responses.some(r => r.status === 401)) {
           handleLogout();
           return;
        }

        const [resLeads, resAccs, resOpps] = responses;

        if (resLeads.ok) setLeads(await resLeads.json());
        if (resAccs.ok) setAccounts(await resAccs.json());
        if (resOpps.ok) setOpportunities(await resOpps.json());
      } catch (e) { console.error(e); }
    };
    fetchData();
  }, [token]);

  const handleLoginSuccess = (cred) => { setToken(cred.credential); localStorage.setItem('id_token', cred.credential); };
  const handleLogout = () => { googleLogout(); setToken(null); setUser(null); localStorage.removeItem('id_token'); };

  const handleSave = async (data) => {
    const endpoint = modalType === 'lead' ? 'customers' : modalType === 'account' ? 'accounts' : 'opportunities';
    const method = data.id ? 'PUT' : 'POST';
    const url = data.id ? `${API_URL}/api/${endpoint}/${data.id}` : `${API_URL}/api/${endpoint}`;
    try {
      const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(data) });
      if (response.ok) {
        const saved = await response.json();
        const accName = accounts.find(a => a.id === Number(saved.account_id))?.name || '-';
        const formatted = { ...saved, account_name: accName };
        if (modalType === 'lead') { setLeads(data.id ? leads.map(l => l.id === saved.id ? formatted : l) : [formatted, ...leads]); if (selectedLead?.id === saved.id) setSelectedLead(formatted); }
        else if (modalType === 'account') { setAccounts(data.id ? accounts.map(a => a.id === saved.id ? saved : a) : [saved, ...accounts]); if (selectedAccount?.id === saved.id) setSelectedAccount(saved); }
        else { setOpportunities(data.id ? opportunities.map(o => o.id === saved.id ? formatted : o) : [formatted, ...opportunities]); if (selectedOpportunity?.id === saved.id) setSelectedOpportunity(formatted); }
      }
    } catch (e) { console.error(e); }
    setIsModalOpen(false);
  };

  const handleDelete = async (id, type) => {
    if (!confirm('本当に削除しますか？')) return;
    const endpoint = type === 'lead' ? 'customers' : type === 'account' ? 'accounts' : 'opportunities';
    try {
      const response = await fetch(`${API_URL}/api/${endpoint}/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (response.ok) {
        if (type === 'lead') { setLeads(leads.filter(l => l.id !== id)); if (selectedLead?.id === id) setActiveTab('leads'); }
        else if (type === 'account') { setAccounts(accounts.filter(a => a.id !== id)); if (selectedAccount?.id === id) setActiveTab('accounts'); }
        else { setOpportunities(opportunities.filter(o => o.id !== id)); if (selectedOpportunity?.id === id) setActiveTab('opportunities'); }
      }
    } catch (e) { console.error(e); }
  };

  if (!token) return (<div className="h-screen flex items-center justify-center bg-[#f3f2f2]"><div className="bg-white p-12 rounded-xl shadow-2xl border text-center max-w-sm w-full"><div className="w-20 h-20 bg-[#0176d3] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg text-white text-4xl">☁️</div><h1 className="text-2xl font-bold text-gray-800 mb-8">CloudForce CRM</h1><div className="flex justify-center"><GoogleLogin onSuccess={(res) => { setToken(res.credential); localStorage.setItem('id_token', res.credential); }} useOneTap /></div></div></div>);

  return (
    <div className="flex h-screen bg-[#f3f2f2] font-sans text-gray-900 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} user={user} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        <Header title={activeTab.includes('lead') ? '担当者' : activeTab.includes('account') ? '取引先' : activeTab.includes('opportunity') ? '商談' : 'CloudForce'} onMenuClick={() => setIsMobileOpen(true)} globalSearch={globalSearch} setGlobalSearch={setGlobalSearch} />
        <main className="flex-1 overflow-hidden relative">
           {activeTab === 'dashboard' ? <Dashboard /> : 
            activeTab === 'leads' ? <StandardListView title="担当者" icon={Users} data={leads} columns={[{key:'name', label:'氏名'}, {key:'account_name', label:'取引先'}, {key:'status', label:'状況'}]} onItemClick={(l) => { setSelectedLead(l); setActiveTab('leadDetail'); }} onNewClick={() => { setModalType('lead'); setEditingItem(null); setIsModalOpen(true); }} onEditClick={(l) => { setModalType('lead'); setEditingItem(l); setIsModalOpen(true); }} onDeleteClick={(id) => handleDelete(id, 'lead')} filterText={globalSearch} /> :
            activeTab === 'accounts' ? <StandardListView title="取引先" icon={Building2} data={accounts} columns={[{key:'name', label:'取引先名'}, {key:'industry', label:'業種'}, {key:'website', label:'Webサイト'}]} onItemClick={(a) => { setSelectedAccount(a); setActiveTab('accountDetail'); }} onNewClick={() => { setModalType('account'); setEditingItem(null); setIsModalOpen(true); }} onEditClick={(a) => { setModalType('account'); setEditingItem(a); setIsModalOpen(true); }} onDeleteClick={(id) => handleDelete(id, 'account')} filterText={globalSearch} /> :
            activeTab === 'opportunities' ? <StandardListView title="商談" icon={Briefcase} data={opportunities} columns={[{key:'name', label:'商談名'}, {key:'account_name', label:'取引先'}, {key:'amount', label:'金額'}, {key:'stage', label:'フェーズ'}]} onItemClick={(o) => { setSelectedOpportunity(o); setActiveTab('opportunityDetail'); }} onNewClick={() => { setModalType('opportunity'); setEditingItem(null); setIsModalOpen(true); }} onEditClick={(o) => { setModalType('opportunity'); setEditingItem(o); setIsModalOpen(true); }} onDeleteClick={(id) => handleDelete(id, 'opportunity')} filterText={globalSearch} /> :
            activeTab === 'tasks' ? <StandardListView title="ToDo" icon={CheckSquare} data={tasks} columns={[{key:'subject', label:'件名'}, {key:'dueDate', label:'期限'}, {key:'priority', label:'優先度'}]} onItemClick={() => {}} onNewClick={() => {}} onEditClick={() => {}} onDeleteClick={() => {}} filterText={globalSearch} /> :
            activeTab === 'leadDetail' ? <LeadDetail lead={selectedLead} onBack={() => setActiveTab('leads')} onEdit={() => { setModalType('lead'); setEditingItem(selectedLead); setIsModalOpen(true); }} onDelete={() => handleDelete(selectedLead.id, 'lead')} /> :
            activeTab === 'opportunityDetail' ? <OpportunityDetail opportunity={selectedOpportunity} onBack={() => setActiveTab('opportunities')} onEdit={() => { setModalType('opportunity'); setEditingItem(selectedOpportunity); setIsModalOpen(true); }} onDelete={() => handleDelete(selectedOpportunity.id, 'opportunity')} /> :
            activeTab === 'accountDetail' ? <AccountDetail account={selectedAccount} onBack={() => setActiveTab('accounts')} onEdit={() => { setModalType('account'); setEditingItem(selectedAccount); setIsModalOpen(true); }} onDelete={() => handleDelete(selectedAccount.id, 'account')} relatedLeads={leads.filter(l => Number(l.account_id) === Number(selectedAccount.id))} onLeadClick={(l) => { setSelectedLead(l); setActiveTab('leadDetail'); }} /> : null}
        </main>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? '編集' : '新規作成'} onSave={() => { if (formRef.current?.reportValidity()) handleSave({ ...Object.fromEntries(new FormData(formRef.current).entries()), id: editingItem?.id }); }}>
        <form ref={formRef} className="space-y-4">
          {modalType === 'lead' ? (
            <><FormField label="氏名"><Input name="name" required defaultValue={editingItem?.name} /></FormField><FormField label="メール"><Input name="email" type="email" required defaultValue={editingItem?.email} /></FormField><FormField label="所属取引先"><Select name="account_id" defaultValue={editingItem?.account_id} options={[{value: '', label: '-- 選択してください --'}, ...accounts.map(a => ({ value: a.id, label: a.name }))]} /></FormField><FormField label="役職"><Input name="title" defaultValue={editingItem?.title} /></FormField><FormField label="ステータス"><Select name="status" options={LEAD_STATUSES.map(s => ({ value: s, label: LEAD_STATUS_LABELS[s] }))} defaultValue={editingItem?.status} /></FormField></>
          ) : modalType === 'account' ? (
            <><FormField label="取引先名"><Input name="name" required defaultValue={editingItem?.name} /></FormField><FormField label="業種"><Input name="industry" defaultValue={editingItem?.industry} /></FormField><FormField label="Webサイト"><Input name="website" defaultValue={editingItem?.website} /></FormField><FormField label="電話番号"><Input name="phone" defaultValue={editingItem?.phone} /></FormField></>
          ) : (
            <><FormField label="商談名"><Input name="name" required defaultValue={editingItem?.name} /></FormField><FormField label="金額"><Input name="amount" type="number" defaultValue={editingItem?.amount} /></FormField><FormField label="取引先"><Select name="account_id" defaultValue={editingItem?.account_id} options={[{value: '', label: '-- 選択してください --'}, ...accounts.map(a => ({ value: a.id, label: a.name }))]} /></FormField><FormField label="フェーズ"><Select name="stage" options={STAGES.map(s => ({ value: s, label: STAGE_LABELS[s] }))} defaultValue={editingItem?.stage} /></FormField><FormField label="完了予定日"><Input name="close_date" type="date" defaultValue={editingItem?.close_date ? editingItem.close_date.split('T')[0] : ''} /></FormField></>
          )}
        </form>
      </Modal>
    </div>
  );
};

const App = () => (<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}><AppContent /></GoogleOAuthProvider>);
export default App;
