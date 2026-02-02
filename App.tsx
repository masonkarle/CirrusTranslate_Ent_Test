
import React, { useState, useMemo, useEffect } from 'react';
import { User, UserRole, Project, JobStatus, PlatformClient, PlatformTranslator, ProjectType, Invite } from './types';
import Layout from './components/Layout';
import Logo from './components/Logo';
import JobCard from './components/JobCard';
import TranslatorWorkbench from './components/TranslatorWorkbench';

const App: React.FC = () => {
  // Persistence Keys
  const STORAGE_KEY_ADMIN = 'cirrus_admin_user';
  const STORAGE_KEY_CLIENTS = 'cirrus_clients_v3';
  const STORAGE_KEY_TRANSLATORS = 'cirrus_translators_v3';
  const STORAGE_KEY_PROJECTS = 'cirrus_projects_v3';
  const STORAGE_KEY_USERS = 'cirrus_registered_users_v3';
  const STORAGE_KEY_INVITES = 'cirrus_active_invites_v3';

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  
  // Platform State with LocalStorage initialization
  const [adminUser, setAdminUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ADMIN);
    return saved ? JSON.parse(saved) : null;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [clients, setClients] = useState<PlatformClient[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CLIENTS);
    return saved ? JSON.parse(saved) : [];
  });

  const [translators, setTranslators] = useState<PlatformTranslator[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_TRANSLATORS);
    return saved ? JSON.parse(saved) : [];
  });

  const [registeredUsers, setRegisteredUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_USERS);
    return saved ? JSON.parse(saved) : [];
  });

  const [invites, setInvites] = useState<Invite[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_INVITES);
    return saved ? JSON.parse(saved) : [];
  });

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ADMIN, JSON.stringify(adminUser));
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(clients));
    localStorage.setItem(STORAGE_KEY_TRANSLATORS, JSON.stringify(translators));
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(registeredUsers));
    localStorage.setItem(STORAGE_KEY_INVITES, JSON.stringify(invites));
  }, [adminUser, projects, clients, translators, registeredUsers, invites]);

  // Handle Invitation Link Routing
  const [activeInvite, setActiveInvite] = useState<Invite | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('invite');
    if (token) {
      const invite = invites.find(i => i.token === token);
      if (invite) {
        setActiveInvite(invite);
        setActiveView('register');
      }
    }
  }, [invites]);

  // Login form state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const [setupForm, setSetupForm] = useState({ name: '', email: '', username: '', password: '' });

  const handleAdminSetup = (e: React.FormEvent) => {
    e.preventDefault();
    const newAdmin: User = {
      id: 'admin_1',
      name: setupForm.name,
      email: setupForm.email,
      username: setupForm.username,
      password: setupForm.password,
      role: UserRole.MANAGER,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${setupForm.name}`,
      status: 'active'
    };
    setAdminUser(newAdmin);
    setRegisteredUsers([newAdmin]);
    setCurrentUser(newAdmin);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = registeredUsers.find(u => 
      (u.username?.toLowerCase() === loginForm.username.toLowerCase() || u.email.toLowerCase() === loginForm.username.toLowerCase()) && 
      u.password === loginForm.password
    );

    if (user) {
      setCurrentUser(user);
      setActiveView('dashboard');
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  const handleGoogleSSO = () => {
    // Simulated SSO: Checks if admin email exists or prompts setup
    if (!adminUser) {
      alert("Admin must setup the platform first.");
      return;
    }
    // In real app, this would be a Google Auth redirect/popup
    alert("Google SSO would normally redirect to accounts.google.com. For this demo, please use your created username/password.");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('dashboard');
    window.history.replaceState({}, '', window.location.pathname);
  };

  // Onboarding Logic
  const [generatedLink, setGeneratedLink] = useState('');
  const generateInvite = (email: string, role: UserRole, targetId: string) => {
    const token = Math.random().toString(36).substring(2, 15);
    const newInvite: Invite = { token, email, role, targetId };
    setInvites(prev => [...prev, newInvite]);
    return `${window.location.origin}${window.location.pathname}?invite=${token}`;
  };

  const [newClient, setNewClient] = useState<Partial<PlatformClient>>({});
  const [showAddClient, setShowAddClient] = useState(false);
  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const clientId = `c${Date.now()}`;
    const client: PlatformClient = {
      id: clientId,
      companyName: newClient.companyName || '',
      contactName: newClient.contactName || '',
      email: newClient.email || '',
      ratePerWord: 0,
      ratePerMinute: Number(newClient.ratePerMinute) || 0,
      status: 'pending'
    };
    setClients(prev => [...prev, client]);
    const link = generateInvite(client.email, UserRole.CLIENT, clientId);
    setGeneratedLink(link);
    setShowAddClient(false);
    setNewClient({});
  };

  const [newTranslator, setNewTranslator] = useState<Partial<PlatformTranslator>>({});
  const [showAddTranslator, setShowAddTranslator] = useState(false);
  const handleAddTranslator = (e: React.FormEvent) => {
    e.preventDefault();
    const translatorId = `t${Date.now()}`;
    const translator: PlatformTranslator = {
      id: translatorId,
      name: newTranslator.name || '',
      email: newTranslator.email || '',
      isDeaf: !!newTranslator.isDeaf,
      ratePerWord: 0.10,
      ratePerMinute: 8.00,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newTranslator.name}`,
      status: 'pending'
    };
    setTranslators(prev => [...prev, translator]);
    const link = generateInvite(translator.email, UserRole.TRANSLATOR, translatorId);
    setGeneratedLink(link);
    setShowAddTranslator(false);
    setNewTranslator({});
  };

  // Registration Logic
  const [regForm, setRegForm] = useState({ name: '', username: '', phone: '', password: '', terms: false });
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInvite || !regForm.terms) return;

    const newUser: User = {
      id: `u${Date.now()}`,
      name: regForm.name,
      username: regForm.username,
      password: regForm.password,
      email: activeInvite.email,
      phone: regForm.phone,
      role: activeInvite.role,
      status: 'active',
      clientRecordId: activeInvite.role === UserRole.CLIENT ? activeInvite.targetId : undefined,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${regForm.name}`
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    
    // Update target record status
    if (activeInvite.role === UserRole.CLIENT) {
      setClients(prev => prev.map(c => c.id === activeInvite.targetId ? { ...c, status: 'active', phone: regForm.phone, contactName: regForm.name } : c));
    } else {
      setTranslators(prev => prev.map(t => t.id === activeInvite.targetId ? { ...t, status: 'active', phone: regForm.phone, name: regForm.name } : t));
    }

    // Cleanup invite and log in
    setInvites(prev => prev.filter(i => i.token !== activeInvite.token));
    setActiveInvite(null);
    setCurrentUser(newUser);
    setActiveView('dashboard');
    window.history.replaceState({}, '', window.location.pathname);
  };

  const totals = useMemo(() => {
    return {
      revenue: projects.reduce((acc, p) => acc + p.clientQuote, 0),
      payouts: projects.reduce((acc: number, p: Project) => 
        acc + (Object.values(p.translatorQuotes) as number[]).reduce((a: number, b: number) => a + b, 0), 0),
      active: projects.filter(p => p.status !== JobStatus.UPLOADED).length
    };
  }, [projects]);

  const [showAddProject, setShowAddProject] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({ type: 'video', translatorIds: [] });
  
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.clientId || !newProject.name) return;
    const client = clients.find(c => c.id === newProject.clientId);
    if (!client) return;
    const count = newProject.minuteCount || 0;
    const clientRate = client.ratePerMinute;
    const clientQuote = count * clientRate;
    
    if (isEditing && newProject.id) {
      setProjects(prev => prev.map(p => (p.id === newProject.id ? { ...p, ...newProject, clientQuote, appliedRate: clientRate } as Project : p)));
    } else {
      const project: Project = {
        id: `p${Date.now()}`,
        name: newProject.name!,
        type: 'video',
        status: JobStatus.UNASSIGNED,
        clientId: newProject.clientId!,
        minuteCount: count,
        driveLink: newProject.driveLink || '',
        appliedRate: clientRate,
        translatorIds: [],
        clientQuote,
        translatorQuotes: {},
        createdAt: new Date().toISOString().split('T')[0],
        deadline: newProject.deadline || '',
        sourceLang: 'English',
        targetLang: 'ASL'
      };
      setProjects(prev => [project, ...prev]);
    }
    setShowAddProject(false);
    setIsEditing(false);
    setNewProject({ type: 'video', translatorIds: [] });
  };

  // Rendering logic based on state
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-10">
            <Logo className="h-14 justify-center mb-4" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Initialization</h1>
            <p className="text-slate-500 font-medium">Configure the platform master account</p>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
            <form onSubmit={handleAdminSetup} className="space-y-4">
              <input required placeholder="Full Name" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900" value={setupForm.name} onChange={e => setSetupForm({...setupForm, name: e.target.value})} />
              <input type="email" required placeholder="Admin Email" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900" value={setupForm.email} onChange={e => setSetupForm({...setupForm, email: e.target.value})} />
              <input required placeholder="Desired Username" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900" value={setupForm.username} onChange={e => setSetupForm({...setupForm, username: e.target.value})} />
              <input type="password" required placeholder="Admin Password" minLength={8} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900" value={setupForm.password} onChange={e => setSetupForm({...setupForm, password: e.target.value})} />
              <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg active:scale-95 transition-all mt-4">Initialize Platform</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'register' && activeInvite) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-xl w-full">
          <div className="text-center mb-12">
            <Logo className="h-12 justify-center mb-4" />
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Complete Registration</h2>
            <p className="text-slate-500 font-medium">Join as a {activeInvite.role.toLowerCase()}</p>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
             <form onSubmit={handleRegister} className="space-y-5">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Name</label>
                   <input required placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-900 border border-slate-100" value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})} />
                 </div>
                 <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                   <input required placeholder="Username" className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-900 border border-slate-100" value={regForm.username} onChange={e => setRegForm({...regForm, username: e.target.value})} />
                 </div>
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input type="email" disabled className="w-full p-4 bg-slate-100 rounded-xl font-bold text-slate-400 cursor-not-allowed border border-slate-100" value={activeInvite.email} />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input type="tel" placeholder="e.g. +1 555-0123" className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-900 border border-slate-100" value={regForm.phone} onChange={e => setRegForm({...regForm, phone: e.target.value})} />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Password</label>
                  <input type="password" required placeholder="Min. 8 characters" minLength={8} className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-900 border border-slate-100" value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})} />
               </div>
               
               <label className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors border border-slate-100">
                  <input type="checkbox" required className="mt-1 w-5 h-5 rounded text-blue-600 focus:ring-blue-500" checked={regForm.terms} onChange={e => setRegForm({...regForm, terms: e.target.checked})} />
                  <span className="text-xs font-bold text-slate-600 leading-relaxed">
                    I accept the CirrusTranslate service agreement and professional ethics standards for ASL interpretation.
                  </span>
               </label>
               
               <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-lg active:scale-95 shadow-xl shadow-blue-100 transition-all">Create Account</button>
             </form>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative">
        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-12">
            <Logo className="h-16 justify-center mb-4" />
            <p className="text-slate-400 font-medium tracking-tight uppercase text-[10px] font-black tracking-[0.2em]">Management Console</p>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
             <form onSubmit={handleLogin} className="space-y-6">
               <h2 className="text-2xl font-black text-slate-900 text-center">Login</h2>
               {loginError && <p className="text-xs font-bold text-red-500 text-center bg-red-50 p-4 rounded-2xl border border-red-100">{loginError}</p>}
               <div className="space-y-4">
                 <input required placeholder="Username or Email" className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-900 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500" value={loginForm.username} onChange={e => setLoginForm({...loginForm, username: e.target.value})} />
                 <input type="password" required placeholder="Password" className="w-full p-4 bg-slate-50 rounded-xl font-bold text-slate-900 border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500" value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} />
               </div>
               <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-slate-800 transition-all active:scale-95">Sign In</button>
               
               <div className="relative py-4">
                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                 <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-white px-3 text-slate-300">or</span></div>
               </div>

               <button type="button" onClick={handleGoogleSSO} className="w-full flex items-center justify-center gap-3 p-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-600 active:scale-95 shadow-sm">
                 <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                 Sign in with Google
               </button>
             </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout user={currentUser} onLogout={handleLogout} activeView={activeView} setActiveView={setActiveView}>
      {activeView === 'dashboard' && currentUser.role === UserRole.MANAGER && (
        <div className="space-y-10">
          <div className="flex justify-between items-end">
             <div>
               <h3 className="text-3xl font-black text-slate-900 tracking-tight">Manager Dashboard</h3>
               <p className="text-slate-500 font-medium">Global platform analytics and status</p>
             </div>
             <button onClick={() => { setNewProject({ type: 'video', translatorIds: [] }); setIsEditing(false); setShowAddProject(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-all">
               + Create ASL Project
             </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Total Revenue</p>
              <p className="text-4xl font-black text-slate-900">${totals.revenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Payouts Due</p>
              <p className="text-4xl font-black text-slate-900">${totals.payouts.toLocaleString()}</p>
            </div>
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Active Files</p>
              <p className="text-4xl font-black text-slate-900">{totals.active}</p>
            </div>
          </div>
        </div>
      )}

      {activeView === 'clients' && (
        <div className="space-y-8">
           <div className="flex justify-between items-center">
             <h3 className="text-3xl font-black text-slate-900 tracking-tight">Client Accounts</h3>
             <button onClick={() => setShowAddClient(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-all">+ Invite Client</button>
           </div>
           <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
             <table className="w-full text-left">
               <thead className="bg-slate-50 border-b border-slate-100"><tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest"><th className="px-10 py-6">Company</th><th className="px-10 py-6">Contact</th><th className="px-10 py-6">Status</th><th className="px-10 py-6 text-right">Rate</th></tr></thead>
               <tbody className="divide-y divide-slate-100">
                 {clients.map(c => (
                   <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                     <td className="px-10 py-8"><p className="font-extrabold text-slate-900">{c.companyName}</p><p className="text-xs text-slate-400">{c.email}</p></td>
                     <td className="px-10 py-8 text-sm font-bold text-slate-600">{c.contactName || 'Pending...'}</td>
                     <td className="px-10 py-8">
                       <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${c.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600 animate-pulse'}`}>
                         {c.status}
                       </span>
                     </td>
                     <td className="px-10 py-8 text-right font-black text-slate-900">${c.ratePerMinute}/min</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      )}

      {activeView === 'translators' && (
        <div className="space-y-8">
           <div className="flex justify-between items-center">
             <h3 className="text-3xl font-black text-slate-900 tracking-tight">Linguist Network</h3>
             <button onClick={() => setShowAddTranslator(true)} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-all">+ Invite Linguist</button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {translators.map(t => (
               <div key={t.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
                 <img src={t.avatar} className={`w-20 h-20 rounded-2xl border-4 shadow-sm transition-all ${t.status === 'pending' ? 'grayscale opacity-50' : 'border-slate-50 scale-105'}`} alt="" />
                 <div className="overflow-hidden">
                   <p className="text-xl font-black text-slate-900 leading-tight truncate">{t.name}</p>
                   <span className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 inline-block ${t.status === 'active' ? 'text-green-500' : 'text-amber-500'}`}>{t.status}</span>
                 </div>
               </div>
             ))}
           </div>
        </div>
      )}

      {/* Invitation Success Modal */}
      {generatedLink && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-lg flex items-center justify-center p-6">
           <div className="bg-white max-w-lg w-full rounded-[2.5rem] p-12 text-center shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl mx-auto mb-8 flex items-center justify-center text-5xl">✉️</div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Invite Created Successfully</h3>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed">The user must use this unique link to initialize their profile, username, and password.</p>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center gap-4 mb-10 group">
                 <input readOnly className="flex-1 bg-transparent text-xs font-bold text-slate-500 outline-none truncate" value={generatedLink} />
                 <button onClick={() => {navigator.clipboard.writeText(generatedLink); alert("Link copied to clipboard!");}} className="bg-slate-900 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all">Copy Link</button>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setGeneratedLink('')} className="flex-1 py-5 bg-slate-100 rounded-2xl font-bold text-slate-600 hover:bg-slate-200 transition-all">Back to Console</button>
                <a href={generatedLink} className="flex-1 py-5 bg-blue-600 rounded-2xl font-bold text-white text-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">Test Invite Link</a>
              </div>
           </div>
        </div>
      )}

      {/* Standard Management Modals */}
      {showAddProject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
           <div className="bg-white max-w-2xl w-full rounded-[2.5rem] shadow-2xl p-10 relative">
              <button onClick={() => setShowAddProject(false)} className="absolute top-8 right-8 text-slate-300 hover:text-slate-900 text-2xl transition-colors">✕</button>
              <h3 className="text-3xl font-black text-slate-900 mb-10 tracking-tight">Initialize Project</h3>
              <form onSubmit={handleSaveProject} className="space-y-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Identity</label>
                   <input required placeholder="Internal Reference Name" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" value={newProject.name || ''} onChange={e => setNewProject({...newProject, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Associated Client</label>
                      <select required className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold text-slate-900" value={newProject.clientId || ''} onChange={e => setNewProject({...newProject, clientId: e.target.value})}>
                        <option value="">Select Account...</option>
                        {clients.filter(c => c.status === 'active').map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Video Length (Mins)</label>
                      <input type="number" required placeholder="0" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 font-bold text-slate-900" value={newProject.minuteCount || 0} onChange={e => setNewProject({...newProject, minuteCount: Number(e.target.value)})} />
                   </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all">Authorize Assignment</button>
              </form>
           </div>
        </div>
      )}

      {showAddClient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
           <div className="bg-white max-w-md w-full rounded-[2.5rem] p-10 relative shadow-2xl">
              <button onClick={() => setShowAddClient(false)} className="absolute top-8 right-8 text-slate-300">✕</button>
              <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Invite New Client</h3>
              <form onSubmit={handleAddClient} className="space-y-5">
                 <input placeholder="Company Name" required className="w-full p-5 bg-slate-50 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none" onChange={e => setNewClient({...newClient, companyName: e.target.value})} />
                 <input placeholder="Administrator Email" required type="email" className="w-full p-5 bg-slate-50 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none" onChange={e => setNewClient({...newClient, email: e.target.value})} />
                 <input type="number" step="0.01" placeholder="Flat Rate Per Minute ($)" required className="w-full p-5 bg-slate-50 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none" onChange={e => setNewClient({...newClient, ratePerMinute: Number(e.target.value)})} />
                 <button type="submit" className="w-full bg-slate-900 text-white p-6 rounded-2xl font-black mt-4 shadow-xl active:scale-95 transition-all">Initialize Invitation</button>
              </form>
           </div>
        </div>
      )}

      {showAddTranslator && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
           <div className="bg-white max-w-md w-full rounded-[2.5rem] p-10 relative shadow-2xl">
              <button onClick={() => setShowAddTranslator(false)} className="absolute top-8 right-8 text-slate-300">✕</button>
              <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Invite Interpreter</h3>
              <form onSubmit={handleAddTranslator} className="space-y-6">
                 <input placeholder="Full Name" required className="w-full p-5 bg-slate-50 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none" onChange={e => setNewTranslator({...newTranslator, name: e.target.value})} />
                 <input type="email" placeholder="Professional Email" required className="w-full p-5 bg-slate-50 rounded-2xl font-bold text-slate-900 border border-slate-100 outline-none" onChange={e => setNewTranslator({...newTranslator, email: e.target.value})} />
                 <label className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100 transition-all border border-slate-100">
                    <input type="checkbox" className="w-6 h-6 rounded-lg text-blue-600 focus:ring-blue-500" onChange={e => setNewTranslator({...newTranslator, isDeaf: e.target.checked})} />
                    <span className="font-black text-slate-700 uppercase tracking-tight text-xs">Certified Deaf Interpreter</span>
                 </label>
                 <button type="submit" className="w-full bg-slate-900 text-white p-6 rounded-2xl font-black shadow-xl active:scale-95 transition-all">Initialize Invitation</button>
              </form>
           </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
