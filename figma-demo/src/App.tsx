import { useEffect, useMemo, useState } from 'react';
import type { ComponentType, ReactNode } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bell,
  Building2,
  CircleUserRound,
  Download,
  Eye,
  Filter,
  FileUp,
  Gauge,
  HeartHandshake,
  House,
  ImageUp,
  LayoutDashboard,
  LayoutGrid,
  Layers3,
  LogOut,
  Menu,
  MessageSquare,
  ChevronRight,
  PauseCircle,
  PencilLine,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Upload,
  UserRound,
  X,
  Tag,
  SlidersHorizontal,
  Play,
  Send,
} from 'lucide-react';
import {
  businessCampaigns,
  dashboardMetrics,
  feedbackItems,
  feedCampaigns,
  navigation,
  pageTitles,
  pointsByRole,
  ratingBreakdown,
  roleHints,
  rolePills,
  type Campaign,
  type Role,
  type SectionKey,
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

const sessionKey = 'adrate.session';

const demoAccounts: Array<Pick<LoginFormState, 'name' | 'email' | 'password' | 'role'>> = [
  { name: 'Vijay Sawant', email: 'vijay@adrate.ai', password: 'review123', role: 'reviewer' },
  { name: 'Aarav Mehta', email: 'aarav@brandstudio.ai', password: 'business123', role: 'business' },
  { name: 'Nisha Kapoor', email: 'nisha@fabindia.co', password: 'brand123', role: 'brand' },
];

function loadSession(): SessionState {
  if (typeof window === 'undefined') {
    return {
      loggedIn: false,
      name: '',
      email: '',
      role: 'business',
      section: 'dashboard',
    };
  }

  try {
    const raw = window.localStorage.getItem(sessionKey);
    if (!raw) {
      return {
        loggedIn: false,
        name: '',
        email: '',
        role: 'business',
        section: 'dashboard',
      };
    }

    const parsed = JSON.parse(raw) as SessionState;
    return {
      loggedIn: Boolean(parsed.loggedIn),
      name: parsed.name || '',
      email: parsed.email || '',
      role: parsed.role || 'business',
      section: parsed.section || 'dashboard',
    };
  } catch {
    return {
      loggedIn: false,
      name: '',
      email: '',
      role: 'business',
      section: 'dashboard',
    };
  }
}

function saveSession(next: SessionState) {
  window.localStorage.setItem(sessionKey, JSON.stringify(next));
}

function App() {
  const [session, setSession] = useState<SessionState>(() => loadSession());
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      saveSession(session);
    }
  }, [session]);

  const handleLogin = (payload: LoginFormState) => {
    const defaultSection: SectionKey =
      payload.role === 'reviewer' ? 'home' : payload.role === 'brand' ? 'brand' : 'dashboard';

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
    setSession({
      loggedIn: false,
      name: '',
      email: '',
      role: 'business',
      section: 'dashboard',
    });
  };

  if (!session.loggedIn) {
    return <LoginScreen onLogin={handleLogin} onDemoLogin={handleLogin} />;
  }

  return (
    <Shell
      session={session}
      search={search}
      setSearch={setSearch}
      onSectionChange={(section) => setSession((current) => ({ ...current, section }))}
      onRoleChange={(role) =>
        setSession((current) => ({
          ...current,
          role,
          section: role === 'reviewer' ? 'home' : role === 'brand' ? 'brand' : 'dashboard',
        }))
      }
      onLogout={handleLogout}
    />
  );
}

function LoginScreen({
  onLogin,
  onDemoLogin,
}: {
  onLogin: (payload: LoginFormState) => void;
  onDemoLogin: (payload: LoginFormState) => void;
}) {
  const [form, setForm] = useState<LoginFormState>({
    name: 'Vijay Sawant',
    email: 'vijay@adrate.ai',
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
                A single workflow for ad reviewers, business users, and brand managers. Switch roles,
                inspect campaign performance, and move from feedback to launch without leaving the app.
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
                Use a workspace role, then jump straight into the feed, dashboard, or campaign pages.
              </p>
            </div>

            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                onLogin(form);
              }}
            >
              <Field label="Name" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} placeholder="Vijay Sawant" />
              <Field label="Email" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} placeholder="vijay@adrate.ai" type="email" />
              <Field
                label="Password"
                value={form.password}
                onChange={(value) => setForm((current) => ({ ...current, password: value }))}
                placeholder="Enter your password"
                type="password"
              />

              <div>
                <label className="mb-2 block text-sm font-medium text-white/70">Workspace</label>
                <div className="grid grid-cols-3 gap-2 rounded-3xl border border-white/10 bg-black/20 p-2">
                  {(['reviewer', 'business', 'brand'] as Role[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setForm((current) => ({ ...current, role }))}
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

function Shell({
  session,
  search,
  setSearch,
  onSectionChange,
  onRoleChange,
  onLogout,
}: {
  session: SessionState;
  search: string;
  setSearch: (value: string) => void;
  onSectionChange: (section: SectionKey) => void;
  onRoleChange: (role: Role) => void;
  onLogout: () => void;
}) {
  const filteredFeedCampaigns = useMemo(() => FilterCampaigns(feedCampaigns, search), [search]);
  const filteredBusinessCampaigns = useMemo(() => filterBusinessCampaigns(businessCampaigns, search), [search]);
  const filteredFeedbackItems = useMemo(() => filterFeedback(feedbackItems, search), [search]);

  const currentPage = pageTitles[session.section];

  return (
    <div className="min-h-screen bg-canvas text-white">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[rgba(9,9,15,0.88)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 lg:px-6">
          <button className="flex shrink-0 items-center gap-3 rounded-2xl px-2 py-1 lg:px-0" type="button">
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
              onChange={(event) => setSearch(event.target.value)}
              className="h-12 w-full rounded-2xl border border-white/10 bg-white/6 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/35 focus:border-accent-400/70 focus:ring-2 focus:ring-accent-500/20"
              placeholder="Search campaigns, brands, categories, or feedback..."
            />
          </div>

          <div className="hidden shrink-0 items-center gap-3 xl:flex">
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(140,75,255,0.18),rgba(59,130,246,0.14))] px-4 py-2 text-sm font-semibold text-white">
              <BadgeCheck className="h-4 w-4 text-accent-200" />
              {pointsByRole[session.role]}
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
                <RoleSwitch role={session.role} onChange={onRoleChange} stacked />
                <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-white/45">Signed in as</p>
                  <p className="mt-1 text-lg font-semibold">{session.name}</p>
                  <p className="text-sm text-white/55">{session.email}</p>
                </div>
              </div>
            </div>

            <SidebarNav active={session.section} onChange={onSectionChange} />
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
              <RoleSwitch role={session.role} onChange={onRoleChange} />
            </div>

            <MobileTabs active={session.section} onChange={onSectionChange} />
          </div>

          <div className="mt-2 space-y-6">
            {session.section === 'home' && <HomePage campaigns={filteredFeedCampaigns} />}
            {session.section === 'dashboard' && <DashboardPage campaigns={filteredBusinessCampaigns} feedback={filteredFeedbackItems} />}
            {session.section === 'campaigns' && <CampaignsPage campaigns={filteredBusinessCampaigns} />}
            {session.section === 'upload' && <UploadPage campaigns={filteredBusinessCampaigns.slice(0, 4)} />}
            {session.section === 'analytics' && <AnalyticsPage feedback={filteredFeedbackItems} />}
            {session.section === 'brand' && <BrandPage campaigns={filteredFeedCampaigns} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarNav({ active, onChange }: { active: SectionKey; onChange: (section: SectionKey) => void }) {
  return (
    <nav className="rounded-[30px] border border-white/10 bg-white/5 p-3 shadow-panel backdrop-blur-xl">
      <p className="px-3 pb-3 text-xs uppercase tracking-[0.36em] text-white/40">Navigate</p>
      <div className="space-y-1">
        {navigation.map((item) => {
          const Icon = navIcon(item.key);
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
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

function MobileTabs({ active, onChange }: { active: SectionKey; onChange: (section: SectionKey) => void }) {
  return (
    <div className="mb-4 overflow-x-auto rounded-[26px] border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
      <div className="flex min-w-max gap-2">
        {navigation.map((item) => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onChange(item.key)}
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

function RoleSwitch({ role, onChange, stacked = false }: { role: Role; onChange: (role: Role) => void; stacked?: boolean }) {
  return (
    <div className={`grid ${stacked ? 'grid-cols-1' : 'grid-cols-3'} gap-2 rounded-[22px] border border-white/10 bg-black/25 p-2`}>
      {(['reviewer', 'business', 'brand'] as Role[]).map((nextRole) => {
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

function HomePage({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel className="flex flex-col justify-between overflow-hidden bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(255,255,255,0.04))] p-6">
          <div>
            <p className="text-xs uppercase tracking-[0.36em] text-white/40">Reviewer workspace</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">Earn points by reviewing live ads.</h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
              Each card on the feed mirrors the production flow: review, rate, skip, and keep moving. The
              layout stays compact on mobile and opens up into a two-column feed on larger screens.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <ActionChip icon={BadgeCheck} label="2,450 pts" tone="accent" />
            <ActionChip icon={TrendingUp} label="Top 15% reviewer" tone="soft" />
            <ActionChip icon={ShoppingBag} label="Rewards unlocked" tone="soft" />
          </div>
        </Panel>

        <Panel className="grid gap-3 p-6 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-white/45">Today</p>
            <p className="mt-2 text-4xl font-semibold tracking-tight">23</p>
            <p className="mt-1 text-sm text-white/60">ads reviewed in the last session</p>
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

      <div className="space-y-5">
        {campaigns.map((campaign) => (
          <FeedCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
}

function DashboardPage({ campaigns, feedback }: { campaigns: Campaign[]; feedback: typeof feedbackItems }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm text-white/45">Business dashboard</p>
          <h2 className="text-4xl font-semibold tracking-tight">Dashboard</h2>
          <p className="mt-2 text-white/60">Track your campaign performance and keep live feedback in view.</p>
        </div>
        <PrimaryButton icon={Plus} label="Upload New Campaign" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardMetrics.map((metric) => {
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
          <button className="text-sm font-medium text-white/55 transition hover:text-white" type="button">
            View all
          </button>
        </div>

        <div className="space-y-4">
          {campaigns.slice(0, 4).map((campaign) => (
            <CampaignRow key={campaign.title} campaign={campaign} />
          ))}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel className="p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold tracking-tight">Recent Feedback</h3>
            <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/8" type="button">
              View All Feedback
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {feedback.slice(0, 4).map((item) => (
              <FeedbackCard key={`${item.name}-${item.time}`} feedback={item} />
            ))}
          </div>
        </Panel>

        <Panel className="grid gap-4 p-5 sm:grid-cols-2 xl:grid-cols-1">
          <StatTile title="Average rating" value="4.4" description="Across all active campaigns" icon={Star} />
          <StatTile title="Feedback velocity" value="1,177" description="Total comments this month" icon={MessageSquare} />
          <StatTile title="CTR lift" value="+18%" description="Compared with the previous quarter" icon={TrendingUp} />
          <StatTile title="Launch readiness" value="92%" description="Drafts are ready to publish" icon={Gauge} />
        </Panel>
      </section>
    </div>
  );
}

function CampaignsPage({ campaigns }: { campaigns: Campaign[] }) {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Paused'>('All');
  const visible = campaigns.filter((campaign) => filter === 'All' || campaign.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-white/45">Business workspace</p>
          <h2 className="text-4xl font-semibold tracking-tight">All Campaigns</h2>
          <p className="mt-2 text-white/60">{campaigns.filter((item) => item.status === 'Active').length} Active • {campaigns.filter((item) => item.status === 'Paused').length} Paused</p>
        </div>
        <PrimaryButton icon={Plus} label="Upload New Campaign" />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-white/60">
        <Filter className="h-4 w-4" />
        <span>Filter:</span>
        {(['All', 'Active', 'Paused'] as const).map((option) => (
          <FilterPill key={option} label={option} active={filter === option} onClick={() => setFilter(option)} />
        ))}
      </div>

      <div className="space-y-4">
        {visible.map((campaign) => (
          <CampaignRow key={campaign.title} campaign={campaign} compact />
        ))}
      </div>
    </div>
  );
}

function UploadPage({ campaigns }: { campaigns: Campaign[] }) {
  const [enabled, setEnabled] = useState(true);

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
          <button
            type="button"
            className="mt-5 flex h-[300px] w-full flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-white/18 bg-black/15 text-center transition hover:border-accent-300/60 hover:bg-white/4"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(140,75,255,0.32),rgba(59,130,246,0.16))]">
              <Upload className="h-9 w-9 text-accent-100" />
            </div>
            <p className="mt-6 text-2xl font-semibold">Upload your ad</p>
            <p className="mt-2 text-sm text-white/55">Drag and drop or click to browse</p>
            <div className="mt-8 flex items-center gap-6 text-xs text-white/45">
              <span className="inline-flex items-center gap-2"><ImageUp className="h-4 w-4" />Image</span>
              <span className="inline-flex items-center gap-2"><FileUp className="h-4 w-4" />Video (9:16 preferred)</span>
            </div>
          </button>
          <p className="mt-4 text-sm text-white/45">Best performance for vertical videos and tall creatives.</p>
        </Panel>

        <Panel className="p-5">
          <h3 className="text-2xl font-semibold tracking-tight">2. Basic Details</h3>
          <div className="mt-5 space-y-4">
            <TextField label="Campaign Name" placeholder="e.g., Diwali Special Sale 2026" />
            <TextField label="Brand Name" placeholder="e.g., Haldirams" />
            <TextField label="Category" placeholder="Food, Tech, Fashion, Beauty..." />
          </div>
        </Panel>

        <Panel className="p-5">
          <h3 className="text-2xl font-semibold tracking-tight">3. Campaign Settings</h3>
          <div className="mt-5 space-y-4">
            <TextField label="Max Feedbacks" placeholder="500" type="number" />
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold">Enable campaign after upload</p>
                  <p className="mt-1 text-sm text-white/50">Start collecting feedback immediately</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnabled((current) => !current)}
                  className={`flex h-8 w-14 items-center rounded-full px-1 transition ${enabled ? 'bg-gradient-to-r from-accent-500 to-blue-500' : 'bg-white/15'}`}
                >
                  <span className={`h-6 w-6 rounded-full bg-white transition ${enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>
        </Panel>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white/80 transition hover:bg-white/10">
            <PencilLine className="h-4 w-4" />
            Save Draft
          </button>
          <button type="button" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-500 to-blue-500 px-6 py-4 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01]">
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
        <div className="space-y-3">
          {campaigns.map((campaign) => (
            <MiniCampaignRow key={campaign.title} campaign={campaign} />
          ))}
        </div>
        <button type="button" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10">
          View All Campaigns
        </button>
      </Panel>
    </div>
  );
}

function AnalyticsPage({ feedback }: { feedback: typeof feedbackItems }) {
  return (
    <div className="space-y-6">
      <Panel className="grid gap-6 p-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="flex gap-5">
          <div className="h-56 w-48 shrink-0 rounded-[28px] bg-gradient-to-br from-[#e9c54e] via-[#ffde6b] to-[#d19108] p-4 shadow-panel">
            <div className="flex h-full items-end rounded-[20px] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_28%)]" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-4xl font-semibold tracking-tight">Haldirams Bhujia Launch</h2>
                <div className="mt-3 flex flex-wrap gap-2 text-sm text-white/60">
                  <Pill label="Food" />
                  <Pill label="Active" tone="green" />
                </div>
              </div>
              <div className="flex gap-2">
                <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10" type="button">
                  <PauseCircle className="mr-2 inline h-4 w-4" />Pause Campaign
                </button>
                <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10" type="button">
                  <PencilLine className="mr-2 inline h-4 w-4" />Edit
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <MetricCard icon={Eye} label="Total Views" value="12,547" />
              <MetricCard icon={MessageSquare} label="Total Feedbacks" value="342" />
              <MetricCard icon={Star} label="Average Rating" value="4.5" />
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Panel className="p-5">
          <h3 className="text-2xl font-semibold tracking-tight">Rating Breakdown</h3>
          <div className="mt-6 space-y-4">
            {ratingBreakdown.map((row) => (
              <div key={row.stars} className="grid grid-cols-[40px_1fr_72px] items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-white/75">
                  {row.stars}
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                </div>
                <div className="h-3 rounded-full bg-white/8">
                  <div className={`h-3 rounded-full ${row.color || 'bg-emerald-400'}`} style={{ width: `${row.value}%` }} />
                </div>
                <div className="text-right text-sm text-white/65">
                  <span className="font-semibold text-white">{row.count}</span>
                  <span className="text-white/35">({row.value}%)</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-5">
          <h3 className="text-2xl font-semibold tracking-tight">Quick Insights</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <InsightCard title="Most common feedback" value="Loved it" tone="text-emerald-300" />
            <InsightCard title="Would buy" value="62%" tone="text-accent-200" />
          </div>
        </Panel>
      </div>

      <Panel className="p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h3 className="text-2xl font-semibold tracking-tight">All Feedback ({feedback.length})</h3>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/10">
              <Download className="mr-2 inline h-4 w-4" />Export CSV
            </button>
            <button type="button" className="rounded-2xl bg-gradient-to-r from-accent-500 to-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01]">
              <BarChart3 className="mr-2 inline h-4 w-4" />Full Analytics
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/60">
          <Filter className="h-4 w-4" />
          <span>Filter by:</span>
          {['All', '5★', '4★', '3★', '2★', '1★'].map((label, index) => (
            <FilterPill key={label} label={label} active={index === 0} onClick={() => undefined} />
          ))}
          <span className="ml-2 inline-flex items-center gap-1">
            <SlidersHorizontal className="h-4 w-4" />
            Sort:
          </span>
          <div className="min-w-[160px] flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/45" />
        </div>

        <div className="mt-4 space-y-3">
          {feedback.map((item) => (
            <FeedbackCard key={`${item.name}-${item.time}`} feedback={item} large />
          ))}
        </div>
      </Panel>
    </div>
  );
}

function BrandPage({ campaigns }: { campaigns: Campaign[] }) {
  return (
    <div className="space-y-6">
      <Panel className="p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-white text-4xl font-semibold text-black shadow-glow">
              F
            </div>
            <div>
              <h2 className="text-4xl font-semibold tracking-tight">Fabindia</h2>
              <p className="mt-3 max-w-2xl text-lg leading-8 text-white/65">
                Celebrating India&apos;s rich craft heritage with contemporary designs.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-white/60">
                <Pill label="Fashion" />
                <Pill label="Home Decor" />
              </div>
            </div>
          </div>

          <button className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/75 transition hover:bg-white/10" type="button">
            Follow Brand
          </button>
        </div>

        <div className="mt-6 border-t border-white/8 pt-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:max-w-xl xl:grid-cols-2">
            <MetricTile icon={BadgeCheck} label="Total Campaigns" value="3" />
            <MetricTile icon={Star} label="Average Rating" value="4.4" />
          </div>
        </div>
      </Panel>

      <div className="flex flex-wrap items-center gap-2 text-sm text-white/60">
        <Layers3 className="h-4 w-4" />
        <span>Category:</span>
        {['All', 'Fashion', 'Home Decor'].map((label, index) => (
          <FilterPill key={label} label={label} active={index === 0} onClick={() => undefined} />
        ))}
        <span className="ml-2 inline-flex items-center gap-1">
          <SlidersHorizontal className="h-4 w-4" />
          Sort:
        </span>
        <div className="min-w-[160px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/45" />
      </div>

      <div className="space-y-5">
        {campaigns.slice(0, 3).map((campaign) => (
          <FeedCard key={campaign.id} campaign={campaign} brandMode />
        ))}
      </div>
    </div>
  );
}

function FeedCard({ campaign, brandMode = false }: { campaign: Campaign; brandMode?: boolean }) {
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

          <div className="flex flex-wrap items-end gap-3">
            <Stars rating={Number(campaign.rating)} />
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent-500 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01]" type="button">
              {brandMode ? 'View Campaign' : 'Rate this Ad'}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10" type="button">
              Skip
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function CampaignRow({ campaign, compact = false }: { campaign: Campaign; compact?: boolean }) {
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
              <StatChip icon={MessageSquare} value={campaign.feedbacks} />
              <StatChip icon={Star} value={campaign.rating} tone="amber" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 lg:justify-end">
          <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent-500 to-blue-500 px-4 py-3 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01]" type="button">
            <BarChart3 className="h-4 w-4" />
            View Feedback
          </button>
          <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10" type="button">
            <PauseCircle className="h-4 w-4" />
            Pause
          </button>
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

function FeedbackCard({ feedback, large = false }: { feedback: (typeof feedbackItems)[number]; large?: boolean }) {
  const stars = Array.from({ length: 5 }, (_, index) => index < feedback.rating);

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
        <div className="flex items-center gap-1 text-amber-400">
          {stars.map((active, index) => (
            <Star key={index} className={`h-4 w-4 ${active ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} />
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

function CreativeFrame({ campaign, small = false, tiny = false, compact = false }: { campaign: Campaign; small?: boolean; tiny?: boolean; compact?: boolean }) {
  const height = tiny ? 'h-16 w-16' : small ? 'h-28 w-28' : compact ? 'h-[250px]' : 'h-[320px]';

  return (
    <div className={`${height} relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br ${campaign.tone.from} ${campaign.tone.via || ''} ${campaign.tone.to} p-4 shadow-panel`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.26),transparent_22%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_25%)] opacity-60" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <span className={`rounded-full border border-white/20 ${campaign.tone.accent} px-3 py-1 text-xs font-medium text-white/85 backdrop-blur`}>{campaign.label}</span>
          <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-xs font-medium text-white/75 backdrop-blur">
            {campaign.status}
          </span>
        </div>
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-2">
            <div className="h-14 w-14 rounded-[18px] border border-white/20 bg-white text-2xl font-semibold text-black shadow-lg flex items-center justify-center">
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

function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-[32px] border border-white/10 bg-white/5 shadow-panel backdrop-blur-xl ${className}`}>{children}</section>;
}

function PrimaryButton({ icon: Icon, label }: { icon: ComponentType<{ className?: string }>; label: string }) {
  return (
    <button type="button" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-accent-500 to-blue-500 px-5 py-4 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01]">
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function ActionChip({ icon: Icon, label, tone }: { icon: ComponentType<{ className?: string }>; label: string; tone: 'accent' | 'soft' }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${tone === 'accent' ? 'border-accent-400/25 bg-[linear-gradient(135deg,rgba(140,75,255,0.18),rgba(59,130,246,0.14))] text-white' : 'border-white/10 bg-white/5 text-white/70'}`}>
      <Icon className="h-4 w-4" />
      {label}
    </span>
  );
}

function StatTile({ title, value, description, icon: Icon }: { title: string; value: string; description: string; icon: ComponentType<{ className?: string }> }) {
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

function StatChip({ icon: Icon, value, tone = 'default' }: { icon: ComponentType<{ className?: string }>; value: string; tone?: 'default' | 'amber' }) {
  return (
    <span className={`inline-flex items-center gap-2 ${tone === 'amber' ? 'text-amber-300' : 'text-white/72'}`}>
      <Icon className={`h-4 w-4 ${tone === 'amber' ? 'fill-amber-400 text-amber-400' : 'text-accent-200'}`} />
      {value}
    </span>
  );
}

function MetricCard({ icon: Icon, label, value }: { icon: ComponentType<{ className?: string }>; label: string; value: string }) {
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

function MetricTile({ icon: Icon, label, value }: { icon: ComponentType<{ className?: string }>; label: string; value: string }) {
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
  type = 'text',
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white/70">{label}</span>
      <input
        type={type}
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
        onChange={(event) => onChange(event.target.value)}
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

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 text-white/30">
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className={`h-5 w-5 ${index < rating ? 'fill-amber-400 text-amber-400' : ''}`} />
      ))}
    </div>
  );
}

function AvatarBadge({ label, small = false }: { label: string; small?: boolean }) {
  return (
    <div className={`${small ? 'h-10 w-10 text-sm' : 'h-11 w-11 text-base'} flex items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-blue-500 font-semibold text-white shadow-glow`}>
      {label}
    </div>
  );
}

function FilterCampaigns(campaigns: Campaign[], search: string) {
  const query = search.trim().toLowerCase();
  if (!query) {
    return campaigns;
  }

  return campaigns.filter((campaign) => {
    return [campaign.title, campaign.brand, campaign.category, campaign.description, campaign.status]
      .join(' ')
      .toLowerCase()
      .includes(query);
  });
}

function filterBusinessCampaigns(campaigns: Campaign[], search: string) {
  return FilterCampaigns(campaigns, search);
}

function filterFeedback(items: typeof feedbackItems, search: string) {
  const query = search.trim().toLowerCase();
  if (!query) {
    return items;
  }

  return items.filter((item) => [item.name, item.time, item.comment, item.label || ''].join(' ').toLowerCase().includes(query));
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
