export type Role = 'reviewer' | 'business' | 'brand';

export type SectionKey =
  | 'home'
  | 'dashboard'
  | 'campaigns'
  | 'upload'
  | 'analytics'
  | 'brand';

export type CreativeTone = {
  from: string;
  via?: string;
  to: string;
  accent: string;
};

export type Campaign = {
  id: string;
  title: string;
  brand: string;
  category: string;
  status: 'Active' | 'Paused';
  views: string;
  feedbacks: string;
  rating: string;
  description: string;
  tone: CreativeTone;
  label: string;
  shortLabel: string;
};

export type Feedback = {
  name: string;
  time: string;
  rating: number;
  comment: string;
  label?: string;
  points?: string;
};

export type Metric = {
  label: string;
  value: string;
  delta: string;
  icon: string;
};

export const pageTitles: Record<SectionKey, { title: string; subtitle: string }> = {
  home: { title: 'Home Feed', subtitle: 'Review live campaigns and send feedback in seconds.' },
  dashboard: { title: 'Business Dashboard', subtitle: 'Track the performance of every live campaign.' },
  campaigns: { title: 'All Campaigns', subtitle: 'Browse all campaigns and filter by status or category.' },
  upload: { title: 'Upload New Campaign', subtitle: 'Create a fresh campaign, define settings, and launch.' },
  analytics: { title: 'Campaign Analytics', subtitle: 'Inspect feedback patterns and rating breakdowns.' },
  brand: { title: 'Brand Page', subtitle: 'Showcase the brand, live campaigns, and its identity.' },
};

export const rolePills: Record<Role, string> = {
  reviewer: 'Ad Reviewer',
  business: 'Business User',
  brand: 'Brand Manager',
};

export const pointsByRole: Record<Role, string> = {
  reviewer: '2,450 pts',
  business: '12,840 pts',
  brand: '8,920 pts',
};

export const roleHints: Record<Role, string> = {
  reviewer: 'Rate ads, earn points, and unlock rewards.',
  business: 'Launch campaigns, review feedback, and track impact.',
  brand: 'Manage your storefront, campaigns, and reputation.',
};

export const navigation: Array<{ key: SectionKey; label: string }> = [
  { key: 'home', label: 'Home Feed' },
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'campaigns', label: 'Campaigns' },
  { key: 'upload', label: 'Upload Ad' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'brand', label: 'Brand Page' },
];

export const dashboardMetrics: Metric[] = [
  { label: 'Total Views', value: '43.1K', delta: '+12.5%', icon: 'eye' },
  { label: 'Total Feedbacks', value: '1,177', delta: '+8.2%', icon: 'messages' },
  { label: 'Average Rating', value: '4.4', delta: '+0.3', icon: 'star' },
  { label: 'Engagement Rate', value: '2.7%', delta: '+1.1%', icon: 'trend' },
];

export const feedCampaigns: Campaign[] = [
  {
    id: 'fabindia-1',
    title: 'Fabindia',
    brand: 'Fashion',
    category: 'Fashion',
    status: 'Active',
    views: '12,547',
    feedbacks: '342',
    rating: '4.5',
    description:
      'Discover a fresh, handcrafted collection rooted in Indian textiles, designed to feel contemporary and easy to wear.',
    label: 'Fashion',
    shortLabel: 'F',
    tone: { from: 'from-[#e9ddd0]', via: 'via-[#dbc5ad]', to: 'to-[#b38a61]', accent: 'bg-white/12' },
  },
  {
    id: 'realme-1',
    title: 'Realme',
    brand: 'Tech',
    category: 'Tech',
    status: 'Active',
    views: '8,932',
    feedbacks: '267',
    rating: '4.2',
    description:
      'Experience a fast, lightweight phone with a bright display and all-day battery life tuned for daily use.',
    label: 'Tech',
    shortLabel: 'R',
    tone: { from: 'from-[#d2f3ff]', via: 'via-[#7fd0ff]', to: 'to-[#2b6ddf]', accent: 'bg-white/14' },
  },
  {
    id: 'haldirams-1',
    title: 'Haldirams',
    brand: 'Food',
    category: 'Food',
    status: 'Active',
    views: '15,234',
    feedbacks: '412',
    rating: '4.7',
    description:
      'Introducing a snack campaign designed to feel energetic, familiar, and perfect for everyday cravings.',
    label: 'Food',
    shortLabel: 'H',
    tone: { from: 'from-[#f2d25c]', via: 'via-[#ffcc3d]', to: 'to-[#d19007]', accent: 'bg-black/12' },
  },
  {
    id: 'mamaearth-1',
    title: 'Mamaearth',
    brand: 'Beauty',
    category: 'Beauty',
    status: 'Active',
    views: '9,876',
    feedbacks: '298',
    rating: '4.6',
    description:
      'A clean beauty launch focused on natural ingredients, clarity, and a softer premium brand feel.',
    label: 'Beauty',
    shortLabel: 'M',
    tone: { from: 'from-[#efe8d8]', via: 'via-[#f5d6cf]', to: 'to-[#c9b38d]', accent: 'bg-white/10' },
  },
];

export const businessCampaigns = [
  { title: 'Haldirams Bhujia Launch', category: 'Food', status: 'Active', views: '12,547', feedbacks: '342', rating: '4.5', tone: feedCampaigns[2].tone },
  { title: 'Realme 12 Pro Launch', category: 'Tech', status: 'Active', views: '8,932', feedbacks: '267', rating: '4.2', tone: feedCampaigns[1].tone },
  { title: 'Mamaearth Face Wash', category: 'Beauty', status: 'Active', views: '15,234', feedbacks: '412', rating: '4.7', tone: feedCampaigns[3].tone },
  { title: 'Tanishq Diwali Collection', category: 'Jewelry', status: 'Paused', views: '6,421', feedbacks: '156', rating: '4.3', tone: { from: 'from-[#d9d3cd]', via: 'via-[#9c8573]', to: 'to-[#5c4c44]', accent: 'bg-white/10' } },
  { title: 'Patanjali Atta Campaign', category: 'Food', status: 'Active', views: '9,876', feedbacks: '234', rating: '4.6', tone: { from: 'from-[#e0e8ff]', via: 'via-[#b4c9ff]', to: 'to-[#5672ff]', accent: 'bg-white/10' } },
  { title: 'Biba Ethnic Wear', category: 'Fashion', status: 'Paused', views: '5,432', feedbacks: '145', rating: '4.1', tone: { from: 'from-[#d8f1ea]', via: 'via-[#9ed9cc]', to: 'to-[#6f9f8a]', accent: 'bg-white/10' } },
  { title: 'Xiaomi Smart TV', category: 'Tech', status: 'Active', views: '11,234', feedbacks: '298', rating: '4.4', tone: { from: 'from-[#f2f2f2]', via: 'via-[#9ca3af]', to: 'to-[#3b3f4a]', accent: 'bg-black/20' } },
  { title: 'Titan Watch Collection', category: 'Accessories', status: 'Active', views: '7,654', feedbacks: '187', rating: '4.5', tone: { from: 'from-[#e2c69a]', via: 'via-[#a36e3e]', to: 'to-[#1f1813]', accent: 'bg-white/10' } },
];

export const feedbackItems: Feedback[] = [
  {
    name: 'Vijay Sawant',
    time: '2 hours ago',
    rating: 5,
    label: 'Loved it',
    points: '+50',
    comment: 'Love the crispy texture. The packaging is appealing and the ad feels confident without being overdone.',
  },
  {
    name: 'Priya Sharma',
    time: '5 hours ago',
    rating: 4,
    label: 'Would buy',
    points: '+40',
    comment: 'Great product, but the copy could be shorter. The visuals are clean and trustworthy.',
  },
  {
    name: 'Rahul Patel',
    time: 'Yesterday',
    rating: 5,
    label: 'Loved it',
    points: '+50',
    comment: 'Natural ingredients and a strong premium feel. This one lands well with the audience.',
  },
  {
    name: 'Anjali Verma',
    time: '2 days ago',
    rating: 4,
    label: 'Confusing',
    points: '+30',
    comment: 'The message is good, but the CTA needs more contrast so it stands out faster.',
  },
  {
    name: 'Amit Kumar',
    time: 'Yesterday',
    rating: 5,
    label: 'Would buy',
    points: '+50',
    comment: 'Strong ad, clear value, and the pacing feels natural. I would likely click through.',
  },
  {
    name: 'Sneha Reddy',
    time: '2 days ago',
    rating: 4,
    label: 'Loved it',
    points: '+40',
    comment: 'Very polished overall, though I would like to see a little more variety in the framing.',
  },
  {
    name: 'Rohan Singh',
    time: '2 days ago',
    rating: 2,
    label: 'Boring',
    points: '+10',
    comment: 'The concept is clear, but it needs a stronger hook to keep attention during the first few seconds.',
  },
  {
    name: 'Kavita Joshi',
    time: '3 days ago',
    rating: 5,
    label: 'Would buy',
    points: '+50',
    comment: 'Feels premium and easy to trust. I can imagine this converting well across channels.',
  },
];

export const ratingBreakdown = [
  { stars: 5, value: 55, count: 189 },
  { stars: 4, value: 29, count: 98 },
  { stars: 3, value: 9, count: 32, color: 'bg-amber-500' },
  { stars: 2, value: 4, count: 15, color: 'bg-orange-500' },
  { stars: 1, value: 2, count: 8, color: 'bg-red-500' },
];
