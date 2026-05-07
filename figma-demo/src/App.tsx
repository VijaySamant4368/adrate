import { useEffect, useMemo, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CircleUserRound,
  Download,
  Eye,
  Filter,
  FileUp,
  Gauge,
  House,
  ImageUp,
  LayoutDashboard,
  Layers3,
  LogOut,
  MessageSquare,
  ChevronRight,
  PauseCircle,
  PencilLine,
  Play,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Upload,
  X,
  SlidersHorizontal,
  Send,
  CheckCircle2,
  HeartHandshake,
} from 'lucide-react';
import {
  navigation,
  pageTitles,
  ratingBreakdown,
  roleHints,
  rolePills,
  feedCampaigns,
  businessCampaigns,
  dashboardMetrics,
  feedbackItems,
  pointsByRole,
  brandOwners,
  type CreativeTone,
  type Campaign,
  type Role,
  type SectionKey,
  type Feedback,
  type Metric,
  type BrandOwner,
} from './data';

type SessionState = {
  loggedIn: boolean;
  name: string;
  email: string;
  role: Role;
  section: SectionKey;
};

type LoginFormState = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

type CampaignDraftState = {
  title: string;
  brand: string;
  category: string;
  description: string;
  launchNow: boolean;
  creativeUrl?: string;
};

type ReviewSubmitState = {
  rating: number;
  comment: string;
};

const sessionKey = 'adrate.session';
const campaignFeedKey = 'adrate.campaignFeed';
const businessFeedKey = 'adrate.businessFeed';
const feedbackFeedKey = 'adrate.feedbackFeed';
const metricsKey = 'adrate.metrics';
const pointsKey = 'adrate.points';

const roleNavKeys: Record<Role, SectionKey[]> = {
  reviewer: ['home'],
  brand: ['brand', 'campaigns', 'upload', 'analytics'],
};

const demoAccounts: LoginFormState[] = [
  { name: 'Vijay Sawant', email: 'vijay@reviewer.com', password: 'review123', role: 'reviewer' },
  { name: 'Aarav Mehta', email: 'aarav@nykaa.com', password: 'nykaa123', role: 'brand' },
  { name: 'Ritika Singh', email: 'ritika@zomato.com', password: 'zomato123', role: 'brand' },
];

const categoryTones: Record<string, CreativeTone> = {
  Fashion: { from: 'from-[#e9ddd0]', via: 'via-[#dbc5ad]', to: 'to-[#b38a61]', accent: 'bg-white/12' },
  Tech: { from: 'from-[#d2f3ff]', via: 'via-[#7fd0ff]', to: 'to-[#2b6ddf]', accent: 'bg-white/14' },
  Food: { from: 'from-[#f2d25c]', via: 'via-[#ffcc3d]', to: 'to-[#d19007]', accent: 'bg-black/12' },
  Beauty: { from: 'from-[#efe8d8]', via: 'via-[#f5d6cf]', to: 'to-[#c9b38d]', accent: 'bg-white/10' },
  Jewelry: { from: 'from-[#d9d3cd]', via: 'via-[#9c8573]', to: 'to-[#5c4c44]', accent: 'bg-white/10' },
  Accessories: { from: 'from-[#e2c69a]', via: 'via-[#a36e3e]', to: 'to-[#1f1813]', accent: 'bg-white/10' },
  Lifestyle: { from: 'from-[#f0f9ff]', via: 'via-[#bae6fd]', to: 'to-[#0369a1]', accent: 'bg-white/12' },
  Luxury: { from: 'from-[#fef3c7]', via: 'via-[#fde68a]', to: 'to-[#92400e]', accent: 'bg-black/12' },
  Wellness: { from: 'from-[#ecfdf5]', via: 'via-[#a7f3d0]', to: 'to-[#065f46]', accent: 'bg-white/10' },
};

function toneForCategory(category: string): CreativeTone {
  return categoryTones[category] || categoryTones.Fashion;
}

function shortLabelFor(value: string) {
  return (value.trim().charAt(0) || 'A').toUpperCase();
}

function buildCampaign(draft: CampaignDraftState, status: 'Active' | 'Paused', ownerEmail: string): Campaign {
  const category = draft.category.trim() || 'Fashion';
  return {
    id: `${draft.brand || draft.title}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
    title: draft.title.trim() || 'New Campaign',
    brand: draft.brand.trim() || 'Brand Account',
    category,
    status,
    views: '0',
    feedbacks: '0',
    rating: '0.0',
    description: draft.description.trim() || 'A newly published campaign.',
    tone: toneForCategory(category),
    label: category,
    shortLabel: shortLabelFor(draft.brand || draft.title),
    ownerEmail,
    creativeUrl: draft.creativeUrl,
  };
}

function labelForRating(rating: number) {
  if (rating >= 5) return 'Loved it';
  if (rating >= 4) return 'Would buy';
  if (rating >= 3) return 'Mixed';
  if (rating >= 2) return 'Boring';
  return 'Needs work';
}

function pointsForRating(rating: number) {
  return `+${Math.max(10, rating * 10)}`;
}

function exportFeedbackCsv(feedback: Feedback[], filename = 'feedback.csv') {
  const headers = ['Name', 'Rating', 'Label', 'Points', 'Comment', 'Time', 'Campaign ID'];
  const rows = feedback.map((f) => [
    f.name,
    String(f.rating),
    f.label || '',
    f.points || '',
    f.comment,
    f.time,
    f.campaignId || '',
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((v) => `"${v.replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function loadSession(): SessionState {
  if (typeof window === 'undefined') {
    return { loggedIn: false, name: '', email: '', role: 'business', section: 'dashboard' };
  }
  try {
    const raw = window.localStorage.getItem(sessionKey);
    if (!raw) return { loggedIn: false, name: '', email: '', role: 'business', section: 'dashboard' };
    const parsed = JSON.parse(raw) as SessionState;
    return {
      loggedIn: Boolean(parsed.loggedIn),
      name: parsed.name || '',
      email: parsed.email || '',
      role: (parsed.role as Role) || 'business',
      section: parsed.section || 'dashboard',
    };
  } catch {
    return { loggedIn: false, name: '', email: '', role: 'business', section: 'dashboard' };
  }
}

function saveSession(next: SessionState) {
  window.localStorage.setItem(sessionKey, JSON.stringify(next));
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveJson(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

async function persistToDb(payload: Record<string, unknown>) {
  try {
    const res = await fetch('/api/db', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    console.log('[App] persistToDb result:', result);
  } catch (err) {
    console.error('[App] persistToDb error:', err);
  }
}

function App() {
  const [session, setSession] = useState<SessionState>(() => loadSession());
  const [search, setSearch] = useState('');
  const [campaignFeed, setCampaignFeed] = useState<Campaign[]>(() => loadFromStorage(campaignFeedKey, feedCampaigns));
  const [businessFeed, setBusinessFeed] = useState<Campaign[]>(() => loadFromStorage(businessFeedKey, businessCampaigns));
  const [feedbackFeed, setFeedbackFeed] = useState<Feedback[]>(() => loadFromStorage(feedbackFeedKey, feedbackItems));
  const [metrics, setMetrics] = useState<Metric[]>(() => loadFromStorage(metricsKey, dashboardMetrics));
  const [points, setPoints] = useState<Record<Role, string>>(() => loadFromStorage(pointsKey, pointsByRole));
  const [pageTitlesState, setPageTitles] = useState<typeof pageTitles>(() => loadFromStorage('adrate.pageTitles', pageTitles));
  const [rolePillsState, setRolePills] = useState<typeof rolePills>(() => loadFromStorage('adrate.rolePills', rolePills));
  const [roleHintsState, setRoleHints] = useState<typeof roleHints>(() => loadFromStorage('adrate.roleHints', roleHints));
  const [navigationState, setNavigation] = useState<typeof navigation>(() => loadFromStorage('adrate.navigation', navigation));
  const [ratingBreakdownState, setRatingBreakdown] = useState<typeof ratingBreakdown>(() => loadFromStorage('adrate.ratingBreakdown', ratingBreakdown));
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/db.json');
        const data = await res.json();
        
        setCampaignFeed(data.feedCampaigns);
        setBusinessFeed(data.businessCampaigns);
        setFeedbackFeed(data.feedbackItems);
        setMetrics(data.dashboardMetrics);
        setPoints(data.pointsByRole);
        setPageTitles(data.pageTitles);
        setRolePills(data.rolePills);
        setRoleHints(data.roleHints);
        setNavigation(data.navigation);
        setRatingBreakdown(data.ratingBreakdown);
        
        console.log('[App] Data synced from db.json');
        setIsReady(true);
      } catch (err) {
        console.error('Failed to fetch db.json:', err);
        setIsReady(true); // Proceed even on error to allow app use
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') saveSession(session);
  }, [session]);

  useEffect(() => {
    if (!isReady) return; // Wait for initial sync

    if (typeof window !== 'undefined') {
      saveJson(campaignFeedKey, campaignFeed);
      saveJson(businessFeedKey, businessFeed);
      saveJson(feedbackFeedKey, feedbackFeed);
      saveJson(metricsKey, metrics);
      saveJson(pointsKey, points);
      saveJson('adrate.pageTitles', pageTitlesState);
      saveJson('adrate.rolePills', rolePillsState);
      saveJson('adrate.roleHints', roleHintsState);
      saveJson('adrate.navigation', navigationState);
      saveJson('adrate.ratingBreakdown', ratingBreakdownState);

      persistToDb({
        dashboardMetrics: metrics,
        feedCampaigns: campaignFeed,
        businessCampaigns: businessFeed,
        feedbackItems: feedbackFeed,
        pointsByRole: points,
        pageTitles: pageTitlesState,
        rolePills: rolePillsState,
        roleHints: roleHintsState,
        navigation: navigationState,
        ratingBreakdown: ratingBreakdownState,
      });
    }
  }, [isReady, campaignFeed, businessFeed, feedbackFeed, metrics, points, pageTitlesState, rolePillsState, roleHintsState, navigationState, ratingBreakdownState]);

  const handleLogin = (payload: LoginFormState) => {
    const defaultSection: SectionKey = payload.role === 'reviewer' ? 'home' : 'brand';
    setSession({
      loggedIn: true,
      name: payload.name.trim() || 'AdRate Member',
      email: payload.email.trim() || 'member@adrate.ai',
      role: payload.role,
      section: defaultSection,
    });
  };

  const handleLogout = () => {
    setSearch('');
    setSelectedCampaignId(null);
    setSession({ loggedIn: false, name: '', email: '', role: 'business', section: 'dashboard' });
  };

  const handlePublishCampaign = (draft: CampaignDraftState) => {
    const publishedCampaign = buildCampaign(draft, draft.launchNow ? 'Active' : 'Paused', session.email);
    setCampaignFeed((curr) => [publishedCampaign, ...curr]);
    setBusinessFeed((curr) => [publishedCampaign, ...curr]);
    setSession((curr) => ({ ...curr, section: 'brand' }));
  };

  const handleSubmitFeedback = (campaign: Campaign, review: ReviewSubmitState) => {
    const trimmedComment = review.comment.trim();
    if (!trimmedComment) return;
    const entry: Feedback = {
      name: session.name || 'AdRate Reviewer',
      userEmail: session.email,
      campaignId: campaign.id,
      time: 'Just now',
      rating: review.rating,
      label: labelForRating(review.rating),
      points: pointsForRating(review.rating),
      comment: trimmedComment,
    };
    setFeedbackFeed((curr) => [entry, ...curr]);

    // Update Points
    setPoints((curr) => ({
      ...curr,
      [session.role]: `${(parseInt(curr[session.role].replace(/[^0-9]/g, '')) || 0) + (review.rating * 10)} pts`,
    }));

    const updateCampaign = (item: Campaign): Campaign => {
      if (item.id !== campaign.id) return item;
      const prevRating = Number.parseFloat(item.rating) || 0;
      const prevViews = Number.parseInt(item.views.replace(/,/g, ''), 10) || 0;
      const prevFeedbacks = Number.parseInt(item.feedbacks.replace(/,/g, ''), 10) || 0;
      const newFeedbacks = prevFeedbacks + 1;
      const newRating = ((prevRating * prevFeedbacks + review.rating) / newFeedbacks).toFixed(1);
      
      return {
        ...item,
        views: String(prevViews + 1),
        feedbacks: String(newFeedbacks),
        rating: newRating,
      };
    };

    setCampaignFeed((curr) => curr.map(updateCampaign));
    setBusinessFeed((curr) => curr.map(updateCampaign));

    // Update Dashboard Metrics
    setMetrics((curr) =>
      curr.map((m) => {
        if (m.label === 'Total Feedbacks') {
          const val = parseInt(m.value.replace(/,/g, '')) || 0;
          return { ...m, value: (val + 1).toLocaleString() };
        }
        if (m.label === 'Average Rating') {
          const val = parseFloat(m.value) || 0;
          // Rough average for global metrics
          return { ...m, value: ((val + review.rating) / 2).toFixed(1) };
        }
        return m;
      })
    );
  };

  const handleToggleCampaignStatus = (campaignId: string) => {
    const toggle = (c: Campaign): Campaign =>
      c.id === campaignId ? { ...c, status: c.status === 'Active' ? 'Paused' : 'Active' } : c;
    setCampaignFeed((curr) => curr.map(toggle));
    setBusinessFeed((curr) => curr.map(toggle));
  };

  const handleViewCampaignFeedback = (campaignId: string) => {
    setSelectedCampaignId(campaignId);
    setSession((curr) => ({ ...curr, section: 'analytics' }));
  };

  const handleDeleteCampaign = (campaignId: string) => {
    setCampaignFeed((curr) => curr.filter((c) => c.id !== campaignId));
    setBusinessFeed((curr) => curr.filter((c) => c.id !== campaignId));
  };

  // All hooks must be called before any early return
  const allowedSections = roleNavKeys[session.role] || ['home'];
  const filteredNavigation = navigationState.filter((item) => allowedSections.includes(item.key as SectionKey));

  const filteredFeedCampaigns = useMemo(() => filterCampaigns(campaignFeed, search), [campaignFeed, search]);
  const filteredBusinessCampaigns = useMemo(() => filterCampaigns(businessFeed, search), [businessFeed, search]);
  const filteredFeedbackItems = useMemo(() => filterFeedback(feedbackFeed, search), [feedbackFeed, search]);

  const allCampaigns = useMemo(() => {
    const ids = new Set(businessFeed.map((c) => c.id));
    return [...businessFeed, ...campaignFeed.filter((c) => !ids.has(c.id))];
  }, [businessFeed, campaignFeed]);

  if (!session.loggedIn) {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onDemoLogin={handleLogin}
        rolePills={rolePillsState}
        roleHints={roleHintsState}
      />
    );
  }

  return (
    <Shell
      session={session}
      search={search}
      setSearch={setSearch}
      feedCampaigns={filteredFeedCampaigns}
      businessCampaigns={filteredBusinessCampaigns}
      allCampaigns={allCampaigns}
      feedback={filteredFeedbackItems}
      metrics={metrics}
      points={points}
      pageTitles={pageTitlesState}
      navigation={filteredNavigation}
      rolePills={rolePillsState}
      roleHints={roleHintsState}
      ratingBreakdown={ratingBreakdownState}
      selectedCampaignId={selectedCampaignId}
      brandOwners={brandOwners}
      onSectionChange={(section) => setSession((curr) => ({ ...curr, section }))}
      onRoleChange={(role) =>
        setSession((curr) => ({
          ...curr,
          role,
          section: role === 'reviewer' ? 'home' : 'brand',
        }))
      }
      onPublishCampaign={handlePublishCampaign}
      onSubmitFeedback={handleSubmitFeedback}
      onToggleCampaignStatus={handleToggleCampaignStatus}
      onViewCampaignFeedback={handleViewCampaignFeedback}
      onDeleteCampaign={handleDeleteCampaign}
      onExportCsv={exportFeedbackCsv}
      onLogout={handleLogout}
    />
  );
}

// ─── Login ───────────────────────────────────────────────────────────────────

function LoginScreen({
  onLogin,
  onDemoLogin,
  rolePills,
  roleHints,
}: {
  onLogin: (payload: LoginFormState) => void;
  onDemoLogin: (payload: LoginFormState) => void;
  rolePills: Record<Role, string>;
  roleHints: Record<Role, string>;
}) {
  const [form, setForm] = useState<LoginFormState>({
    name: 'Vijay Sawant',
    email: 'vijay@reviewer.com',
    password: '',
    role: 'reviewer',
  });

  return (
    <div className="min-h-screen bg-canvas text-white">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-4 lg:px-6 lg:py-6 xl:flex-row">
        <section className="relative flex min-h-[320px] flex-1 overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,_rgba(140,75,255,0.34),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.24),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.06),_rgba(255,255,255,0.02))] p-6 shadow-panel">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.14),transparent_18%),radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.08),transparent_20%)] opacity-70" />
          <div className="relative z-10 flex flex-1 flex-col justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-blue-500 text-2xl font-semibold shadow-glow">
                A
              </div>
              <div>
                <p className="text-2xl font-semibold tracking-tight">AdRate</p>
                <p className="text-sm text-white/60">Advertising review and campaign ops</p>
              </div>
            </div>
            <div className="max-w-2xl space-y-5">
              <p className="text-sm uppercase tracking-[0.35em] text-white/50">Concept workspace</p>
              <h1 className="max-w-xl text-5xl font-semibold tracking-tight sm:text-6xl">
                Review ads, launch campaigns, and track every signal in one place.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-white/70">
                A single workflow for ad reviewers, business users, and brand managers. Switch roles, inspect campaign
                performance, and move from feedback to launch without leaving the app.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ['Live review flow', 'Rate campaigns and earn points.'],
                ['Campaign control', 'Launch, pause, and analyze with clarity.'],
                ['Brand showcase', 'Present identity and active campaigns.'],
              ].map(([title, body]) => (
                <div key={title} className="rounded-3xl border border-white/10 bg-black/20 p-4 backdrop-blur">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-accent-100">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-1 text-sm leading-6 text-white/65">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex w-full max-w-[520px] items-center">
          <div className="w-full rounded-[32px] border border-white/10 bg-white/5 p-5 shadow-panel backdrop-blur-xl">
            <div className="mb-6 rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,rgba(140,75,255,0.2),rgba(59,130,246,0.12))] p-5">
              <p className="text-sm uppercase tracking-[0.32em] text-white/50">Welcome back</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">Sign in to AdRate</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/65">
                Choose a workspace role and jump straight into the feed, dashboard, or brand pages.
              </p>
            </div>

            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                onLogin(form);
              }}
            >
              <Field
                label="Name"
                value={form.name}
                onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                placeholder="Your name"
              />
              <Field
                label="Email"
                value={form.email}
                onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                placeholder="you@example.com"
                type="email"
              />
              <Field
                label="Password"
                value={form.password}
                onChange={(v) => setForm((f) => ({ ...f, password: v }))}
                placeholder="Enter password"
                type="password"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">Workspace</label>
                <div className="grid grid-cols-2 gap-2 rounded-3xl border border-white/10 bg-black/20 p-2">
                  {(['reviewer', 'brand'] as Role[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, role }))}
                      className={`rounded-2xl px-3 py-3 text-left text-sm transition ${
                        form.role === role
                          ? 'bg-gradient-to-r from-accent-500 to-blue-500 text-white shadow-glow'
                          : 'text-white/70 hover:bg-white/5'
                      }`}
                    >
                      <span className="block font-semibold">{rolePills[role]}</span>
                      <span className="mt-1 block text-xs text-white/65">{roleHints[role]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-500 via-accent-400 to-blue-500 px-4 py-4 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01]"
              >
                Enter AdRate
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-5 grid gap-2 rounded-[28px] border border-white/10 bg-black/20 p-3 sm:grid-cols-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => {
                    setForm(account);
                    onDemoLogin(account);
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left transition hover:bg-white/10"
                >
                  <p className="text-sm font-semibold">{account.name}</p>
                  <p className="mt-1 text-xs text-white/55">{rolePills[account.role]}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── Shell ────────────────────────────────────────────────────────────────────

function Shell({
  session,
  search,
  setSearch,
  feedCampaigns,
  businessCampaigns,
  allCampaigns,
  feedback,
  metrics,
  points,
  pageTitles,
  navigation,
  rolePills,
  roleHints,
  ratingBreakdown,
  selectedCampaignId,
  brandOwners,
  onSectionChange,
  onRoleChange,
  onPublishCampaign,
  onSubmitFeedback,
  onToggleCampaignStatus,
  onViewCampaignFeedback,
  onDeleteCampaign,
  onExportCsv,
  onLogout,
}: {
  session: SessionState;
  search: string;
  setSearch: (v: string) => void;
  feedCampaigns: Campaign[];
  businessCampaigns: Campaign[];
  allCampaigns: Campaign[];
  feedback: Feedback[];
  metrics: Metric[];
  points: Record<Role, string>;
  pageTitles: Record<SectionKey, { title: string; subtitle: string }>;
  navigation: Array<{ key: string; label: string }>;
  rolePills: Record<Role, string>;
  roleHints: Record<Role, string>;
  ratingBreakdown: Array<{ stars: number; value: number; count: number; color?: string }>;
  selectedCampaignId: string | null;
  brandOwners: BrandOwner[];
  onSectionChange: (section: SectionKey) => void;
  onRoleChange: (role: Role) => void;
  onPublishCampaign: (draft: CampaignDraftState) => void;
  onSubmitFeedback: (campaign: Campaign, review: ReviewSubmitState) => void;
  onToggleCampaignStatus: (campaignId: string) => void;
  onViewCampaignFeedback: (campaignId: string) => void;
  onDeleteCampaign: (campaignId: string) => void;
  onExportCsv: (feedback: Feedback[], filename?: string) => void;
  onLogout: () => void;
}) {
  const currentPage = pageTitles[session.section] || { title: session.section, subtitle: '' };

  return (
    <div className="min-h-screen bg-canvas text-white">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[rgba(9,9,15,0.88)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 lg:px-6">
          <button
            className="flex shrink-0 items-center gap-3 rounded-2xl px-2 py-1 lg:px-0"
            type="button"
            onClick={() => onSectionChange(roleNavKeys[session.role][0])}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-blue-500 font-semibold shadow-glow">
              A
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-lg font-semibold leading-none">AdRate</p>
              <p className="text-xs text-white/45">{rolePills[session.role]}</p>
            </div>
          </button>

          <div className="relative flex min-w-[220px] flex-1 items-center md:min-w-[320px]">
            <Search className="pointer-events-none absolute left-4 h-4 w-4 text-white/35" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/6 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-accent-400/70 focus:ring-2 focus:ring-accent-500/20"
              placeholder="Search campaigns, brands, categories…"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-3 rounded-full p-1 text-white/40 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="hidden shrink-0 items-center gap-3 xl:flex">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(140,75,255,0.18),rgba(59,130,246,0.14))] px-4 py-2 text-sm font-semibold text-white">
              <BadgeCheck className="h-4 w-4 text-accent-200" />
              {points[session.role] || '0 pts'}
            </div>
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/8"
            >
              <CircleUserRound className="h-6 w-6 text-white/85" />
            </button>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/75 transition hover:bg-white/10 xl:flex"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1600px] gap-6 px-4 py-5 lg:px-6">
        <aside className="hidden w-[280px] shrink-0 xl:block">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-[30px] border border-white/10 bg-white/5 p-4 shadow-panel backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.36em] text-white/40">Workspace</p>
              <div className="mt-4 space-y-3">
                <RoleSwitch role={session.role} onChange={onRoleChange} stacked rolePills={rolePills} roleHints={roleHints} />
                <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-white/45">Signed in as</p>
                  <p className="mt-1 text-lg font-semibold">{session.name}</p>
                  <p className="text-sm text-white/55">{session.email}</p>
                </div>
              </div>
            </div>
            <SidebarNav active={session.section} onChange={onSectionChange} navigation={navigation} />
          </div>
        </aside>

        <main className="min-w-0 flex-1 pb-10">
          <div className="xl:hidden">
            <div className="mb-4 flex items-center justify-between rounded-[26px] border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl">
              <div>
                <p className="text-sm text-white/45">{rolePills[session.role]}</p>
                <p className="text-lg font-semibold">{currentPage.title}</p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70"
              >
                Sign out
              </button>
            </div>
            <div className="mb-4">
              <RoleSwitch role={session.role} onChange={onRoleChange} rolePills={rolePills} roleHints={roleHints} />
            </div>
            <MobileTabs active={session.section} onChange={onSectionChange} navigation={navigation} />
          </div>

          <div className="mt-2 space-y-6">

            {session.section === 'home' && (
              <HomePage
                campaigns={feedCampaigns}
                feedback={feedback} // Add this
                userEmail={session.email} // Add this
                onSubmitFeedback={onSubmitFeedback}
                reviewerName={session.name}
                points={points[session.role]}
              />
            )}

            {session.section === 'dashboard' && (
              <DashboardPage
                campaigns={businessCampaigns}
                feedback={feedback}
                metrics={metrics}
                onNavigateUpload={() => onSectionChange('upload')}
                onNavigateCampaigns={() => onSectionChange('campaigns')}
                onNavigateAnalytics={() => onSectionChange('analytics')}
                onViewCampaignFeedback={onViewCampaignFeedback}
                onToggleCampaignStatus={onToggleCampaignStatus}
              />
            )}
            {session.section === 'campaigns' && (
              <CampaignsPage
                campaigns={session.role === 'brand'
                  ? businessCampaigns.filter((c) => c.ownerEmail === session.email)
                  : businessCampaigns}
                feedback={feedback}
                onNavigateUpload={() => onSectionChange('upload')}
                onViewCampaignFeedback={onViewCampaignFeedback}
                onToggleCampaignStatus={onToggleCampaignStatus}
                onDeleteCampaign={onDeleteCampaign}
              />
            )}
            {session.section === 'upload' && (
              <UploadPage
                campaigns={businessCampaigns.slice(0, 4)}
                onPublishCampaign={onPublishCampaign}
                onNavigateCampaigns={() => onSectionChange('campaigns')}
              />
            )}
            {session.section === 'analytics' && (
              <AnalyticsPage
                campaigns={session.role === 'brand'
                  ? allCampaigns.filter((c) => c.ownerEmail === session.email)
                  : allCampaigns}
                feedback={feedback}
                ratingBreakdown={ratingBreakdown}
                selectedCampaignId={selectedCampaignId}
                onToggleStatus={onToggleCampaignStatus}
                onExportCsv={onExportCsv}
              />
            )}
            {session.section === 'brand' && (
              <BrandPage
                allCampaigns={allCampaigns}
                brandOwnerEmail={session.email}
                brandOwners={brandOwners}
                onViewCampaignFeedback={onViewCampaignFeedback}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Nav components ───────────────────────────────────────────────────────────

function SidebarNav({
  active,
  onChange,
  navigation,
}: {
  active: SectionKey;
  onChange: (section: SectionKey) => void;
  navigation: Array<{ key: string; label: string }>;
}) {
  return (
    <nav className="rounded-[30px] border border-white/10 bg-white/5 p-3 shadow-panel backdrop-blur-xl">
      <p className="px-3 pb-3 text-xs uppercase tracking-[0.36em] text-white/40">Navigate</p>
      <div className="space-y-1">
        {navigation.map((item) => {
          const Icon = navIcon(item.key as SectionKey);
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key as SectionKey)}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${
                isActive
                  ? 'border border-accent-400/30 bg-[linear-gradient(135deg,rgba(140,75,255,0.2),rgba(59,130,246,0.14))] text-white shadow-glow'
                  : 'text-white/60 hover:bg-white/6 hover:text-white'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-accent-100' : 'text-white/45'}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function MobileTabs({
  active,
  onChange,
  navigation,
}: {
  active: SectionKey;
  onChange: (section: SectionKey) => void;
  navigation: Array<{ key: string; label: string }>;
}) {
  return (
    <div className="mb-4 overflow-x-auto rounded-[26px] border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
      <div className="flex min-w-max gap-2">
        {navigation.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key as SectionKey)}
              className={`whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-gradient-to-r from-accent-500 to-blue-500 text-white shadow-glow'
                  : 'bg-white/4 text-white/65 hover:bg-white/8'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RoleSwitch({
  role,
  onChange,
  stacked = false,
  rolePills,
  roleHints,
}: {
  role: Role;
  onChange: (role: Role) => void;
  stacked?: boolean;
  rolePills: Record<Role, string>;
  roleHints: Record<Role, string>;
}) {
  return (
    <div className={`grid ${stacked ? 'grid-cols-1' : 'grid-cols-2'} gap-2 rounded-[22px] border border-white/10 bg-black/25 p-2`}>
      {(['reviewer', 'brand'] as Role[]).map((nextRole) => {
        const isActive = role === nextRole;
        return (
          <button
            key={nextRole}
            type="button"
            onClick={() => onChange(nextRole)}
            className={`rounded-2xl px-3 py-3 text-left text-sm transition ${
              isActive
                ? 'bg-gradient-to-r from-accent-500 to-blue-500 text-white shadow-glow'
                : 'text-white/70 hover:bg-white/6'
            }`}
          >
            <span className="block font-semibold">{rolePills[nextRole]}</span>
            <span className="mt-1 block text-xs text-white/60">{roleHints[nextRole]}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────
function HomePage({
  campaigns,
  feedback,
  userEmail,
  onSubmitFeedback,
  reviewerName,
  points,
}: {
  campaigns: Campaign[];
  feedback: Feedback[];
  userEmail: string;
  onSubmitFeedback: (campaign: Campaign, review: ReviewSubmitState) => void;
  reviewerName: string;
  points: string;
}) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel className="flex flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.04))] p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.36em] text-white/40">Reviewer workspace</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Earn points by reviewing live ads.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
              Each card on the feed mirrors the production flow: review, rate, and keep moving.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <ActionChip icon={BadgeCheck} label={points || '0 pts'} tone="accent" />
            <ActionChip icon={TrendingUp} label="Top 15% reviewer" tone="soft" />
            <ActionChip icon={ShoppingBag} label="Rewards unlocked" tone="soft" />
          </div>
        </Panel>

        <Panel className="grid gap-3 p-6 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-white/45">Today</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight">23</p>
            <p className="mt-1 text-sm text-white/60">ads reviewed this session</p>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-white/45">Next reward</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight">550 pts</p>
            <div className="mt-4 h-2 rounded-full bg-white/10">
              <div className="h-2 w-[68%] rounded-full bg-gradient-to-r from-accent-500 to-blue-500" />
            </div>
          </div>
        </Panel>
      </section>

      {campaigns.length === 0 ? (
        <Panel className="p-8 text-center">
          <p className="text-xl font-semibold">No campaigns match your search.</p>
          <p className="mt-2 text-sm text-white/55">Try a different keyword.</p>
        </Panel>
      ) : (
        <div className="space-y-5">
          {campaigns.map((campaign) => (
            <FeedCard
              key={campaign.id}
              campaign={campaign}
              feedback={feedback}
              userEmail={userEmail}
              onSubmitFeedback={onSubmitFeedback}
              reviewerName={reviewerName}
            />
          ))}
        </div>
      )}
    </div>
  );
}



function DashboardPage({
  campaigns,
  feedback,
  metrics,
  onNavigateUpload,
  onNavigateCampaigns,
  onNavigateAnalytics,
  onViewCampaignFeedback,
  onToggleCampaignStatus,
}: {
  campaigns: Campaign[];
  feedback: Feedback[];
  metrics: Metric[];
  onNavigateUpload: () => void;
  onNavigateCampaigns: () => void;
  onNavigateAnalytics: () => void;
  onViewCampaignFeedback: (id: string) => void;
  onToggleCampaignStatus: (id: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-white/45">Business dashboard</p>
          <h2 className="text-4xl font-semibold tracking-tight">Dashboard</h2>
          <p className="mt-2 text-white/60">Track campaign performance and keep live feedback in view.</p>
        </div>
        <PrimaryButton icon={Plus} label="Upload New Campaign" onClick={onNavigateUpload} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metricIcon(metric.icon);
          return (
            <Panel key={metric.label} className="p-5">
              <div className="mb-6 flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/6">
                  <Icon className="h-5 w-5 text-accent-200" />
                </div>
                <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  {metric.delta}
                </span>
              </div>
              <p className="text-4xl font-semibold tracking-tight">{metric.value}</p>
              <p className="mt-2 text-sm text-white/60">{metric.label}</p>
            </Panel>
          );
        })}
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-semibold tracking-tight">Active Campaigns</h3>
          <button
            className="text-sm font-medium text-white/55 transition hover:text-white"
            type="button"
            onClick={onNavigateCampaigns}
          >
            View all
          </button>
        </div>
        {campaigns.length === 0 ? (
          <Panel className="p-6 text-center">
            <p className="text-lg font-semibold">No campaigns found.</p>
          </Panel>
        ) : (
          <div className="space-y-4">
            {campaigns.slice(0, 4).map((campaign) => (
              <CampaignRow
                key={campaign.id}
                campaign={campaign}
                onViewFeedback={onViewCampaignFeedback}
                onToggleStatus={onToggleCampaignStatus}
              />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold tracking-tight">Recent Feedback</h3>
            <button
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/8"
              type="button"
              onClick={onNavigateAnalytics}
            >
              View All Feedback
            </button>
          </div>
          {feedback.length === 0 ? (
            <p className="mt-4 text-sm text-white/55">No feedback matches your search.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {feedback.slice(0, 4).map((item) => (
                <FeedbackCard key={`${item.name}-${item.time}-${item.campaignId}`} feedback={item} />
              ))}
            </div>
          )}
        </Panel>

        <Panel className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-1">
          <StatTile title="Average rating" value="4.4" description="Across all active campaigns" icon={Star} />
          <StatTile title="Feedback velocity" value="1,177" description="Total comments this month" icon={MessageSquare} />
          <StatTile title="CTR lift" value="+18%" description="Compared with previous quarter" icon={TrendingUp} />
          <StatTile title="Launch readiness" value="92%" description="Drafts ready to publish" icon={Gauge} />
        </Panel>
      </section>
    </div>
  );
}

function CampaignsPage({
  campaigns,
  onNavigateUpload,
  onViewCampaignFeedback,
  onToggleCampaignStatus,
  onDeleteCampaign,
}: {
  campaigns: Campaign[];
  onNavigateUpload: () => void;
  onViewCampaignFeedback: (id: string) => void;
  onToggleCampaignStatus: (id: string) => void;
  onDeleteCampaign: (id: string) => void;
}) {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Paused'>('All');
  const visible = campaigns.filter((c) => filter === 'All' || c.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-white/45">Campaign management</p>
          <h2 className="text-4xl font-semibold tracking-tight">All Campaigns</h2>
          <p className="mt-2 text-white/60">
            {campaigns.filter((c) => c.status === 'Active').length} Active •{' '}
            {campaigns.filter((c) => c.status === 'Paused').length} Paused
          </p>
        </div>
        <PrimaryButton icon={Plus} label="Upload New Campaign" onClick={onNavigateUpload} />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-white/60">
        <Filter className="h-4 w-4" />
        <span>Filter:</span>
        {(['All', 'Active', 'Paused'] as const).map((option) => (
          <FilterPill key={option} label={option} active={filter === option} onClick={() => setFilter(option)} />
        ))}
      </div>

      {visible.length === 0 ? (
        <Panel className="p-8 text-center">
          <p className="text-xl font-semibold">No campaigns found.</p>
          <p className="mt-2 text-sm text-white/55">Try adjusting your filter or search.</p>
        </Panel>
      ) : (
        <div className="space-y-4">
          {visible.map((campaign) => (
            <CampaignRow
              key={campaign.id}
              campaign={campaign}
              compact
              onViewFeedback={onViewCampaignFeedback}
              onToggleStatus={onToggleCampaignStatus}
              onDelete={onDeleteCampaign}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function UploadPage({
  campaigns,
  onPublishCampaign,
  onNavigateCampaigns,
}: {
  campaigns: Campaign[];
  onPublishCampaign: (draft: CampaignDraftState) => void;
  onNavigateCampaigns: () => void;
}) {
  const [enabled, setEnabled] = useState(true);
  const [selectedFileName, setSelectedFileName] = useState('No file selected');
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [draft, setDraft] = useState<CampaignDraftState>({
    title: '',
    brand: '',
    category: '',
    description: '',
    launchNow: true,
  });
  const [draftSaved, setDraftSaved] = useState(false);

  const handlePublish = () => {
    if (!draft.title.trim()) return;
    onPublishCampaign({ ...draft, launchNow: enabled });
    setDraft({ title: '', brand: '', category: '', description: '', launchNow: true });
    setEnabled(true);
    setSelectedFileName('No file selected');
    setSelectedFileUrl(null);
    setDraftSaved(false);
  };

  const handleSaveDraft = () => {
    if (!draft.title.trim()) return;
    saveJson('adrate.draft', draft);
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2000);
  };

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setSelectedFileName('No file selected');
      setSelectedFileUrl(null);
      setDraft((d) => ({ ...d, creativeUrl: undefined }));
      return;
    }
    setSelectedFileName(file.name);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setSelectedFileUrl(base64String);
      setDraft((d) => ({ ...d, creativeUrl: base64String }));
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    const savedDraft = loadFromStorage<CampaignDraftState | null>('adrate.draft', null);
    if (savedDraft) setDraft(savedDraft);
  }, []);

  useEffect(() => {
    return () => {
      if (selectedFileUrl) URL.revokeObjectURL(selectedFileUrl);
    };
  }, [selectedFileUrl]);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-6">
        <div>
          <p className="text-sm text-white/45">Business workspace</p>
          <h2 className="text-4xl font-semibold tracking-tight">Upload New Campaign</h2>
          <p className="mt-2 text-white/60">Create and launch your ad for feedback.</p>
        </div>

        <Panel className="p-5">
          <h3 className="text-2xl font-semibold tracking-tight">1. Upload Your Ad</h3>
          <label
            htmlFor="campaign-upload-input"
            className="mt-5 flex h-[300px] w-full cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-white/18 bg-black/15 text-center transition hover:border-accent-300/60 hover:bg-white/4"
          >
            <input
              id="campaign-upload-input"
              type="file"
              accept="image/*,video/*"
              className="sr-only"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            />
            {selectedFileUrl ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-4">
                <div className="overflow-hidden rounded-[22px] border border-white/10 bg-black/30 shadow-panel">
                  {selectedFileName.toLowerCase().match(/\.(mp4|webm|mov|m4v)$/) ? (
                    <video src={selectedFileUrl} className="h-48 w-72 object-cover" controls />
                  ) : (
                    <img src={selectedFileUrl} alt={selectedFileName} className="h-48 w-72 object-cover" />
                  )}
                </div>
                <p className="text-lg font-semibold">{selectedFileName}</p>
                <p className="text-sm text-white/55">Click to replace</p>
              </div>
            ) : (
              <>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(140,75,255,0.32),rgba(59,130,246,0.16))]">
                  <Upload className="h-9 w-9 text-accent-100" />
                </div>
                <p className="mt-6 text-2xl font-semibold">Upload your ad</p>
                <p className="mt-2 text-sm text-white/55">Click to browse image or video files</p>
                <div className="mt-8 flex items-center gap-6 text-xs text-white/45">
                  <span className="inline-flex items-center gap-2"><ImageUp className="h-4 w-4" />Image</span>
                  <span className="inline-flex items-center gap-2"><FileUp className="h-4 w-4" />Video</span>
                </div>
              </>
            )}
          </label>
        </Panel>

        <Panel className="p-5">
          <h3 className="text-2xl font-semibold tracking-tight">2. Basic Details</h3>
          <div className="mt-5 space-y-4">
            <TextField
              label="Campaign Name"
              placeholder="e.g., Diwali Special Sale 2026"
              value={draft.title}
              onChange={(v) => setDraft((d) => ({ ...d, title: v }))}
            />
            <TextField
              label="Brand Name"
              placeholder="e.g., Haldirams"
              value={draft.brand}
              onChange={(v) => setDraft((d) => ({ ...d, brand: v }))}
            />
            <TextField
              label="Category"
              placeholder="Food, Tech, Fashion, Beauty…"
              value={draft.category}
              onChange={(v) => setDraft((d) => ({ ...d, category: v }))}
            />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-white/70">Campaign Description</span>
              <textarea
                value={draft.description}
                onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                rows={5}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-accent-400/70 focus:ring-2 focus:ring-accent-500/20"
                placeholder="Write the campaign concept, tone, and goal…"
              />
            </label>
          </div>
        </Panel>

        <Panel className="p-5">
          <h3 className="text-2xl font-semibold tracking-tight">3. Campaign Settings</h3>
          <div className="mt-5">
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">Enable campaign after upload</p>
                  <p className="mt-1 text-sm text-white/50">Start collecting feedback immediately</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnabled((v) => !v)}
                  className={`flex h-8 w-14 items-center rounded-full px-1 transition ${enabled ? 'bg-gradient-to-r from-accent-500 to-blue-500' : 'bg-white/15'}`}
                >
                  <span className={`h-6 w-6 rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </Panel>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={!draft.title.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {draftSaved ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <PencilLine className="h-4 w-4" />}
            {draftSaved ? 'Draft Saved!' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={!draft.title.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-500 to-blue-500 px-6 py-4 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Launch Campaign
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Panel className="space-y-4 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/45">Sidebar</p>
            <h3 className="text-2xl font-semibold tracking-tight">Your Active Campaigns</h3>
          </div>
        </div>
        <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
          <p className="text-sm text-white/45">Preview</p>
          <p className="mt-1 text-lg font-semibold">{draft.title || 'Campaign preview'}</p>
          <p className="mt-1 text-sm text-white/60">{draft.brand || 'Brand'}</p>
          <p className="mt-2 text-sm leading-6 text-white/55">{draft.description || 'Your live campaign description will appear here.'}</p>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/65">
            File: <span className="font-semibold text-white">{selectedFileName}</span>
          </div>
        </div>
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <MiniCampaignRow key={campaign.id} campaign={campaign} />
          ))}
        </div>
        <button
          type="button"
          onClick={onNavigateCampaigns}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10"
        >
          View All Campaigns
        </button>
      </Panel>
    </div>
  );
}

function AnalyticsPage({
  campaigns,
  feedback,
  ratingBreakdown,
  selectedCampaignId,
  onToggleStatus,
  onExportCsv,
}: {
  campaigns: Campaign[];
  feedback: Feedback[];
  ratingBreakdown: Array<{ stars: number; value: number; count: number; color?: string }>;
  selectedCampaignId: string | null;
  onToggleStatus: (id: string) => void;
  onExportCsv: (feedback: Feedback[], filename?: string) => void;
}) {
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const selectedCampaign =
    (selectedCampaignId ? campaigns.find((c) => c.id === selectedCampaignId) : null) ?? campaigns[0] ?? null;

  const campaignFeedback = feedback.filter(
    (f) => !selectedCampaign || f.campaignId === selectedCampaign.id
  );

  const visibleFeedback =
    ratingFilter === null ? campaignFeedback : campaignFeedback.filter((f) => f.rating === ratingFilter);

  const avgRating =
    campaignFeedback.length > 0
      ? (campaignFeedback.reduce((s, f) => s + f.rating, 0) / campaignFeedback.length).toFixed(1)
      : selectedCampaign?.rating ?? '—';

  // Compute breakdown live from actual feedback so it always matches avgRating
  const computedBreakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = campaignFeedback.filter((f) => f.rating === stars).length;
    const value =
      campaignFeedback.length > 0 ? Math.round((count / campaignFeedback.length) * 100) : 0;
    return { stars, count, value };
  });

  const wouldBuyPct =
    campaignFeedback.length > 0
      ? Math.round((campaignFeedback.filter((f) => f.rating >= 4).length / campaignFeedback.length) * 100)
      : null;

  const mostCommon =
    campaignFeedback.length > 0
      ? Object.entries(
          campaignFeedback.reduce<Record<string, number>>((acc, f) => {
            if (f.label) acc[f.label] = (acc[f.label] || 0) + 1;
            return acc;
          }, {})
        ).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—'
      : '—';

  if (!selectedCampaign) {
    return (
      <Panel className="p-8 text-center">
        <p className="text-xl font-semibold">No campaigns to analyse.</p>
        <p className="mt-2 text-sm text-white/55">Upload a campaign first.</p>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <Panel className="grid gap-6 p-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="flex gap-5">
          <div
            className={`h-56 w-48 shrink-0 rounded-[28px] bg-gradient-to-br ${selectedCampaign.tone.from} ${selectedCampaign.tone.via ?? ''} ${selectedCampaign.tone.to} p-4 shadow-panel`}
          >
            <div className="flex h-full items-end rounded-[20px] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_28%)]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-4xl font-semibold tracking-tight">{selectedCampaign.title}</h2>
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-white/60">
                  <Pill label={selectedCampaign.category} />
                  <Pill label={selectedCampaign.status} tone={selectedCampaign.status === 'Active' ? 'green' : 'muted'} />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10"
                  type="button"
                  onClick={() => onToggleStatus(selectedCampaign.id)}
                >
                  {selectedCampaign.status === 'Active' ? (
                    <><PauseCircle className="mr-2 inline h-4 w-4" />Pause Campaign</>
                  ) : (
                    <><Play className="mr-2 inline h-4 w-4" />Resume Campaign</>
                  )}
                </button>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <MetricCard icon={Eye} label="Total Views" value={selectedCampaign.views} />
              <MetricCard icon={MessageSquare} label="Total Feedbacks" value={selectedCampaign.feedbacks} />
              <MetricCard icon={Star} label="Average Rating" value={avgRating} />
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Panel className="p-5">
          <h3 className="text-2xl font-semibold tracking-tight">Rating Breakdown</h3>
          <div className="mt-6 space-y-4">
            {computedBreakdown.map((row) => (
              <div key={row.stars} className="grid grid-cols-[40px_1fr_72px] items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-white/75">
                  {row.stars}
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </div>
                <div className="h-3 rounded-full bg-white/8">
                  <div
                    className={`h-3 rounded-full ${
                      row.stars >= 4 ? 'bg-emerald-400' : row.stars === 3 ? 'bg-amber-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${row.value}%` }}
                  />
                </div>
                <div className="text-right text-sm text-white/65">
                  <span className="font-semibold text-white">{row.count}</span>
                  <span className="text-white/35"> ({row.value}%)</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <h3 className="text-2xl font-semibold tracking-tight">Quick Insights</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InsightCard title="Most common feedback" value={mostCommon} tone="text-emerald-300" />
            <InsightCard
              title="Would buy"
              value={wouldBuyPct !== null ? `${wouldBuyPct}%` : '—'}
              tone="text-accent-200"
            />
            <InsightCard title="Total reviews" value={String(campaignFeedback.length)} tone="text-white" />
            <InsightCard title="Avg. score" value={`${avgRating}/5`} tone="text-amber-300" />
          </div>
        </Panel>
      </div>

      <Panel className="p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h3 className="text-2xl font-semibold tracking-tight">
            Feedback ({visibleFeedback.length}
            {ratingFilter !== null ? ` • ${ratingFilter}★ filter` : ''})
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onExportCsv(visibleFeedback, `feedback-${selectedCampaign.id}.csv`)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10"
            >
              <Download className="mr-2 inline h-4 w-4" />Export CSV
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/60">
          <Filter className="h-4 w-4" />
          <span>Filter by rating:</span>
          <FilterPill
            label="All"
            active={ratingFilter === null}
            onClick={() => setRatingFilter(null)}
          />
          {[5, 4, 3, 2, 1].map((star) => (
            <FilterPill
              key={star}
              label={`${star}★`}
              active={ratingFilter === star}
              onClick={() => setRatingFilter(ratingFilter === star ? null : star)}
            />
          ))}
        </div>

        <div className="mt-4 space-y-3">
          {visibleFeedback.length === 0 ? (
            <p className="text-sm text-white/55">No feedback matches this filter.</p>
          ) : (
            visibleFeedback.map((item, i) => (
              <FeedbackCard key={`${item.name}-${item.time}-${i}`} feedback={item} large />
            ))
          )}
        </div>
      </Panel>
    </div>
  );
}

function BrandPage({
  allCampaigns,
  brandOwnerEmail,
  brandOwners,
  onViewCampaignFeedback,
}: {
  allCampaigns: Campaign[];
  brandOwnerEmail: string;
  brandOwners: BrandOwner[];
  onViewCampaignFeedback: (id: string) => void;
}) {
  const [followed, setFollowed] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');

  const brandOwner = brandOwners.find((b) => b.email === brandOwnerEmail) ?? brandOwners[0];
  const ownedCampaigns = allCampaigns.filter((c) => c.ownerEmail === brandOwnerEmail);
  const categories = ['All', ...Array.from(new Set(ownedCampaigns.map((c) => c.category)))];
  const visibleCampaigns =
    categoryFilter === 'All' ? ownedCampaigns : ownedCampaigns.filter((c) => c.category === categoryFilter);

  const avgRating =
    ownedCampaigns.length > 0
      ? (ownedCampaigns.reduce((s, c) => s + parseFloat(c.rating), 0) / ownedCampaigns.length).toFixed(1)
      : '—';

  return (
    <div className="space-y-6">
      <Panel className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-white text-4xl font-semibold text-black shadow-glow">
              {brandOwner.brand.charAt(0)}
            </div>
            <div>
              <h2 className="text-4xl font-semibold tracking-tight">{brandOwner.brand}</h2>
              <p className="mt-1 text-lg text-white/55">{brandOwner.name}</p>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-white/65">{brandOwner.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/60">
                {brandOwner.categories.map((cat) => (
                  <Pill key={cat} label={cat} />
                ))}
              </div>
            </div>
          </div>

          <button
            className={`rounded-2xl border px-5 py-3 text-sm font-medium transition ${
              followed
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-white/10 bg-white/5 text-white/75 hover:bg-white/10'
            }`}
            type="button"
            onClick={() => setFollowed((v) => !v)}
          >
            {followed ? (
              <><CheckCircle2 className="mr-2 inline h-4 w-4" />Following</>
            ) : (
              <><HeartHandshake className="mr-2 inline h-4 w-4" />Follow Brand</>
            )}
          </button>
        </div>

        <div className="mt-6 border-t border-white/8 pt-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:max-w-xl xl:grid-cols-2">
            <MetricTile icon={BadgeCheck} label="Total Campaigns" value={String(ownedCampaigns.length)} />
            <MetricTile icon={Star} label="Average Rating" value={avgRating} />
          </div>
        </div>
      </Panel>

      <div className="flex flex-wrap items-center gap-2 text-sm text-white/60">
        <Layers3 className="h-4 w-4" />
        <span>Category:</span>
        {categories.map((cat) => (
          <FilterPill
            key={cat}
            label={cat}
            active={categoryFilter === cat}
            onClick={() => setCategoryFilter(cat)}
          />
        ))}
      </div>

      {visibleCampaigns.length === 0 ? (
        <Panel className="p-8 text-center">
          <p className="text-xl font-semibold">No campaigns yet.</p>
          <p className="mt-2 text-sm text-white/55">Upload your first campaign to get started.</p>
        </Panel>
      ) : (
        <div className="space-y-5">
          {visibleCampaigns.map((campaign) => (
            <FeedCard
              key={campaign.id}
              campaign={campaign}
              brandMode
              onViewCampaign={onViewCampaignFeedback}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Shared components ────────────────────────────────────────────────────────


function FeedCard({
  campaign,
  brandMode = false,
  feedback = [],
  userEmail,
  onSubmitFeedback,
  reviewerName,
  onViewCampaign,
}: {
  campaign: Campaign;
  brandMode?: boolean;
  feedback?: Feedback[];
  userEmail?: string;
  onSubmitFeedback?: (campaign: Campaign, review: ReviewSubmitState) => void;
  reviewerName?: string;
  onViewCampaign?: (id: string) => void;
}) {
  const [selectedRating, setSelectedRating] = useState(0);
  const [confirmedRating, setConfirmedRating] = useState(0);
  const [comment, setComment] = useState('');
  const canSubmit = Boolean(onSubmitFeedback && confirmedRating > 0 && comment.trim());

  const existingReview = feedback.find(
    (f) => f.campaignId === campaign.id && f.userEmail === userEmail
  );

  const campaignFeedback = feedback.filter((f) => f.campaignId === campaign.id);
  const liveAvgRating = campaignFeedback.length > 0
    ? (campaignFeedback.reduce((sum, f) => sum + f.rating, 0) / campaignFeedback.length).toFixed(1)
    : campaign.rating;

  return (
    <article className="overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] p-4 shadow-panel lg:p-5">
      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
        <CreativeFrame campaign={campaign} compact={brandMode} />
        <div className="flex min-w-0 flex-col justify-between gap-5 py-1">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <AvatarBadge label={campaign.shortLabel} />
              <div>
                <h3 className="text-2xl font-semibold tracking-tight">{campaign.title}</h3>
                <p className="text-sm text-white/45">{campaign.brand}</p>
              </div>
            </div>
            <p className="mt-4 max-w-3xl text-[15px] leading-8 text-white/68">{campaign.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70">
              Average score: <span className="font-semibold text-white">{liveAvgRating}/5</span>
            </span>
            <Pill label={campaign.status} tone={campaign.status === 'Active' ? 'green' : 'muted'} />
            {brandMode && onViewCampaign ? (
              <button
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01]"
                type="button"
                onClick={() => onViewCampaign(campaign.id)}
              >
                View Analytics
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          {!brandMode && (
            existingReview ? (
              <div className="rounded-[28px] border border-white/10 bg-black/20 p-4">
                <p className="mb-3 text-sm font-semibold text-white/80">Your Review</p>
                <FeedbackCard feedback={existingReview} />
              </div>
            ) : (
              <div className="rounded-[28px] border border-white/10 bg-black/20 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white/80">Leave a review</p>
                    <p className="text-xs text-white/45">Rate the ad and add a short comment</p>
                    {reviewerName ? <p className="mt-1 text-xs text-white/40">Posting as {reviewerName}</p> : null}
                  </div>
                  <div className="w-full max-w-lg space-y-3">
                    <div className="h-3 rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400" />
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { value: 1, label: 'Poor' },
                        { value: 2, label: 'Fair' },
                        { value: 3, label: 'Okay' },
                        { value: 4, label: 'Good' },
                        { value: 5, label: 'Excellent' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setSelectedRating(option.value)}
                          className={`rounded-xl border px-2 py-2 text-center text-xs transition ${
                            selectedRating === option.value
                              ? 'border-accent-300/60 bg-accent-500/20 text-white'
                              : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10'
                          }`}
                        >
                          <span className="block text-sm font-semibold">{option.value}</span>
                          <span className="block text-[10px]">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-sm text-white/65">
                    Selected: <span className="font-semibold text-white">{selectedRating > 0 ? `${selectedRating}/5` : 'Not set'}</span>
                    {' '}• Confirmed:{' '}
                    <span className="font-semibold text-white">{confirmedRating > 0 ? `${confirmedRating}/5` : 'Not confirmed'}</span>
                  </p>
                  <button
                    type="button"
                    disabled={selectedRating === 0}
                    onClick={() => setConfirmedRating(selectedRating)}
                    className="rounded-xl bg-gradient-to-r from-accent-500 to-blue-500 px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Confirm Rating
                  </button>
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  placeholder={`Comment on ${campaign.title}…`}
                  className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-accent-400/70 focus:ring-2 focus:ring-accent-500/20"
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-white/55">
                    Confirmed: <span className="font-semibold text-white">{confirmedRating > 0 ? `${confirmedRating}/5` : 'Not confirmed'}</span>
                  </div>
                  <button
                    type="button"
                    disabled={!canSubmit}
                    onClick={() => {
                      if (!canSubmit) return;
                      onSubmitFeedback?.(campaign, { rating: confirmedRating, comment });
                      setComment('');
                      setSelectedRating(0);
                      setConfirmedRating(0);
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-500 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    Submit Review
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </article>
  );
}

function CampaignRow({
  campaign,
  feedback = [],
  compact = false,
  onViewFeedback,
  onToggleStatus,
  onDelete,
}: {
  campaign: Campaign;
  feedback?: Feedback[];
  compact?: boolean;
  onViewFeedback?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const campaignFeedback = feedback.filter((f) => f.campaignId === campaign.id);
  const liveAvgRating = campaignFeedback.length > 0
    ? (campaignFeedback.reduce((sum, f) => sum + f.rating, 0) / campaignFeedback.length).toFixed(1)
    : campaign.rating;

  return (
    <article className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.03))] p-4 shadow-panel">
      <div className={`flex flex-col gap-4 ${compact ? '' : 'lg:flex-row lg:items-center'}`}>
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <CreativeFrame campaign={campaign} small />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-xl font-semibold tracking-tight">{campaign.title}</h4>
              <Pill label={campaign.category} />
              <Pill label={campaign.status} tone={campaign.status === 'Active' ? 'green' : 'muted'} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/72">
              <StatChip icon={Eye} value={campaign.views} />
              <StatChip icon={MessageSquare} value={String(campaignFeedback.length || campaign.feedbacks)} />
              <StatChip icon={Star} value={liveAvgRating} tone="amber" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:justify-end">
          {onViewFeedback && (
            <button
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent-500 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01]"
              type="button"
              onClick={() => onViewFeedback(campaign.id)}
            >
              <BarChart3 className="h-4 w-4" />
              View Feedback
            </button>
          )}
          {onToggleStatus && (
            <button
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10"
              type="button"
              onClick={() => onToggleStatus(campaign.id)}
            >
              {campaign.status === 'Active' ? (
                <><PauseCircle className="h-4 w-4" />Pause</>
              ) : (
                <><Play className="h-4 w-4" />Resume</>
              )}
            </button>
          )}
          {onDelete && (
            <button
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/50 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-300"
              type="button"
              onClick={() => onDelete(campaign.id)}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function MiniCampaignRow({ campaign }: { campaign: Campaign }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/5 p-3 transition hover:bg-white/8">
      <div className="flex items-center gap-3">
        <CreativeFrame campaign={campaign} tiny />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold">{campaign.title}</p>
            <Pill label={campaign.status} tone={campaign.status === 'Active' ? 'green' : 'muted'} />
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-white/55">
            <StatChip icon={Eye} value={campaign.views} />
            <StatChip icon={MessageSquare} value={campaign.feedbacks} />
            <StatChip icon={Star} value={campaign.rating} tone="amber" />
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-white/35" />
      </div>
    </div>
  );
}

function FeedbackCard({ feedback, large = false }: { feedback: Feedback; large?: boolean }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < feedback.rating);
  return (
    <div className={`rounded-[24px] border border-white/10 bg-white/5 ${large ? 'p-5' : 'p-4'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <AvatarBadge label={feedback.name.charAt(0)} small />
          <div className="min-w-0">
            <p className="truncate font-semibold">{feedback.name}</p>
            <p className="text-sm text-white/45">{feedback.time}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {stars.map((active, i) => (
            <Star key={i} className={`h-4 w-4 ${active ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} />
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/60">
        {feedback.label ? <Pill label={feedback.label} tone="soft" /> : null}
        {feedback.points ? <Pill label={feedback.points} tone="muted" /> : null}
      </div>
      <p className={`mt-3 text-sm leading-7 text-white/70 ${large ? 'max-w-5xl' : ''}`}>{feedback.comment}</p>
    </div>
  );
}

function CreativeFrame({
  campaign,
  small = false,
  tiny = false,
  compact = false,
}: {
  campaign: Campaign;
  small?: boolean;
  tiny?: boolean;
  compact?: boolean;
}) {
  const height = tiny ? 'h-16 w-16' : small ? 'h-28 w-28' : compact ? 'h-[250px]' : 'h-[320px]';
  return (
    <div
      className={`${height} relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br ${campaign.tone.from} ${campaign.tone.via ?? ''} ${campaign.tone.to} p-4 shadow-panel`}
    >
      {campaign.creativeUrl && (
        <div className="absolute inset-0 z-0">
          {campaign.creativeUrl.startsWith('data:video') ? (
            <video
              src={campaign.creativeUrl}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover opacity-60"
            />
          ) : (
            <img
              src={campaign.creativeUrl}
              alt={campaign.title}
              className="h-full w-full object-cover opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.26),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_25%)] opacity-60" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <span className={`rounded-full border border-white/20 ${campaign.tone.accent} px-3 py-1 text-xs font-medium text-white/85 backdrop-blur`}>
            {campaign.label}
          </span>
          <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-medium text-white/75 backdrop-blur">
            {campaign.status}
          </span>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/20 bg-white text-2xl font-semibold text-black shadow-lg">
              {campaign.shortLabel}
            </div>
            <div className="h-10 w-20 rounded-[18px] bg-black/20 backdrop-blur" />
          </div>
          <div className="h-20 w-20 rounded-full border border-white/16 bg-white/10 blur-[0.3px]" />
        </div>
      </div>
    </div>
  );
}

// ─── UI atoms ─────────────────────────────────────────────────────────────────

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[32px] border border-white/10 bg-white/5 shadow-panel backdrop-blur-xl ${className}`}>
      {children}
    </section>
  );
}

function PrimaryButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent-500 to-blue-500 px-5 py-4 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01]"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function ActionChip({
  icon: Icon,
  label,
  tone,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  tone: 'accent' | 'soft';
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
        tone === 'accent'
          ? 'border-accent-400/25 bg-[linear-gradient(135deg,rgba(140,75,255,0.18),rgba(59,130,246,0.14))] text-white'
          : 'border-white/10 bg-white/5 text-white/70'
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </span>
  );
}

function StatTile({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-2 text-white/60">
        <Icon className="h-4 w-4 text-accent-200" />
        <p className="text-sm">{title}</p>
      </div>
      <p className="mt-3 text-4xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-white/55">{description}</p>
    </div>
  );
}

function StatChip({
  icon: Icon,
  value,
  tone = 'default',
}: {
  icon: ComponentType<{ className?: string }>;
  value: string;
  tone?: 'default' | 'amber';
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${tone === 'amber' ? 'text-amber-300' : 'text-white/72'}`}>
      <Icon className={`h-4 w-4 ${tone === 'amber' ? 'fill-amber-400 text-amber-400' : 'text-accent-200'}`} />
      {value}
    </span>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-2 text-white/55">
        <Icon className="h-4 w-4 text-accent-200" />
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-2 text-white/55">
        <Icon className="h-4 w-4 text-accent-200" />
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

function InsightCard({ title, value, tone }: { title: string; value: string; tone: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
      <p className="text-sm text-white/45">{title}</p>
      <p className={`mt-3 text-3xl font-semibold tracking-tight ${tone}`}>{value}</p>
    </div>
  );
}

function TextField({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white/70">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none placeholder:text-white/30 focus:border-accent-400/70 focus:ring-2 focus:ring-accent-500/20"
      />
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white/70">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-14 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-white outline-none placeholder:text-white/30 focus:border-accent-400/70 focus:ring-2 focus:ring-accent-500/20"
      />
    </label>
  );
}

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition ${
        active
          ? 'bg-gradient-to-r from-accent-500 to-blue-500 text-white shadow-glow'
          : 'border border-white/10 bg-white/5 text-white/60 hover:bg-white/8'
      }`}
    >
      {label}
    </button>
  );
}

function Pill({ label, tone = 'soft' }: { label: string; tone?: 'soft' | 'green' | 'muted' }) {
  const styles: Record<'soft' | 'green' | 'muted', string> = {
    soft: 'border-white/10 bg-white/5 text-white/65',
    green: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
    muted: 'border-white/10 bg-white/5 text-white/50',
  };
  return <span className={`inline-flex rounded-full border px-3 py-1 text-sm ${styles[tone]}`}>{label}</span>;
}

function AvatarBadge({ label, small = false }: { label: string; small?: boolean }) {
  return (
    <div
      className={`${small ? 'h-10 w-10 text-sm' : 'h-11 w-11 text-base'} flex items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-blue-500 font-semibold text-white shadow-glow`}
    >
      {label}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function filterCampaigns(campaigns: Campaign[], search: string) {
  const q = search.trim().toLowerCase();
  if (!q) return campaigns;
  return campaigns.filter((c) =>
    [c.title, c.brand, c.category, c.description, c.status, c.views, c.feedbacks, c.rating]
      .join(' ')
      .toLowerCase()
      .includes(q)
  );
}

function filterFeedback(items: Feedback[], search: string) {
  const q = search.trim().toLowerCase();
  if (!q) return items;
  return items.filter((f) =>
    [f.name, f.time, f.comment, f.label || ''].join(' ').toLowerCase().includes(q)
  );
}

function navIcon(section: SectionKey) {
  const icons: Record<SectionKey, ComponentType<{ className?: string }>> = {
    home: House,
    dashboard: LayoutDashboard,
    campaigns: Layers3,
    upload: Upload,
    analytics: BarChart3,
    brand: Building2,
  };
  return icons[section];
}

function metricIcon(kind: string) {
  const icons: Record<string, ComponentType<{ className?: string }>> = {
    eye: Eye,
    messages: MessageSquare,
    star: Star,
    trend: TrendingUp,
  };
  return icons[kind] || Eye;
}

export default App;
