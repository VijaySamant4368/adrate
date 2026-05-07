export type Role = 'reviewer' | 'brand';

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
  ownerEmail: string;
  creativeUrl?: string;
};

export type Feedback = {
  name: string;
  userEmail: string;
  campaignId: string;
  time: string;
  rating: number;
  comment: string;
  label?: string;
  points?: string;
};

export type User = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

export type BrandOwner = {
  name: string;
  email: string;
  password: string;
  brand: string;
  description: string;
  categories: string[];
};

export type Metric = {
  label: string;
  value: string;
  delta: string;
  icon: string;
};

export const pageTitles: Record<SectionKey, { title: string; subtitle: string }> = {
  home: { title: 'Home Feed', subtitle: 'Review active brand campaigns and keep your ratings private.' },
  dashboard: { title: 'Brand Dashboard', subtitle: 'Manage campaigns and performance for your brand.' },
  campaigns: { title: 'My Campaigns', subtitle: 'Manage your campaigns — filter, pause, and track performance.' },
  upload: { title: 'Upload New Campaign', subtitle: 'Create a new campaign and launch it for your brand.' },
  analytics: { title: 'Campaign Analytics', subtitle: 'Inspect rating trends, feedback, and campaign performance.' },
  brand: { title: 'Brand Page', subtitle: 'Showcase your brand, campaign health, and identity.' },
};

export const rolePills: Record<Role, string> = {
  reviewer: 'Reviewer',
  brand: 'Brand Owner',
};

export const pointsByRole: Record<Role, string> = {
  reviewer: '2,450 pts',
  brand: '8,920 pts',
};

export const roleHints: Record<Role, string> = {
  reviewer: 'Review campaigns and earn points.',
  brand: 'Manage your brand, campaigns, and storefront.',
};

export const navigation: Array<{ key: SectionKey; label: string }> = [
  { key: 'home', label: 'Home Feed' },
  { key: 'brand', label: 'Brand Page' },
  { key: 'campaigns', label: 'Campaigns' },
  { key: 'upload', label: 'Upload Ad' },
  { key: 'analytics', label: 'Analytics' },
];

export const ratingBreakdown = [
  { stars: 5, value: 50, count: 7 },
  { stars: 4, value: 43, count: 6 },
  { stars: 3, value: 7, count: 1 },
  { stars: 2, value: 0, count: 0, color: 'bg-orange-500' },
  { stars: 1, value: 0, count: 0, color: 'bg-red-500' },
];

export const brandOwners: BrandOwner[] = [
  {
    name: 'Aarav Mehta',
    email: 'aarav@nykaa.com',
    password: 'nykaa123',
    brand: 'Nykaa',
    description: "India's leading beauty destination — curating 3000+ brands, trend-forward launches, and campaigns built for the modern Indian consumer.",
    categories: ['Beauty', 'Fashion'],
  },
  {
    name: 'Nisha Kapoor',
    email: 'nisha@boat.com',
    password: 'boat123',
    brand: 'boAt',
    description: 'Audio lifestyle brand powering India\'s youth culture — from wired earphones to true wireless, built for energy, bass, and movement.',
    categories: ['Tech', 'Accessories'],
  },
  {
    name: 'Pooja Sharma',
    email: 'pooja@mamaearth.com',
    password: 'mama123',
    brand: 'Mamaearth',
    description: "India's first toxin-free beauty brand — plant-based formulations with no harsh chemicals, built for conscious skin and hair care.",
    categories: ['Beauty', 'Wellness'],
  },
  {
    name: 'Karan Mehra',
    email: 'karan@titan.co',
    password: 'titan123',
    brand: 'Titan',
    description: "Tata's iconic timepiece brand — over 60 years of craftsmanship, spanning everyday elegance to luxury collector editions.",
    categories: ['Accessories', 'Luxury'],
  },
  {
    name: 'Ritika Singh',
    email: 'ritika@zomato.com',
    password: 'zomato123',
    brand: 'Zomato',
    description: "India's go-to food delivery platform — connecting 300,000+ restaurants with millions of hungry customers across 1,000+ cities.",
    categories: ['Food', 'Lifestyle'],
  },
];

export const reviewers: User[] = [
  { name: 'Vijay Sawant', email: 'vijay@reviewer.com', password: 'review123', role: 'reviewer' },
  { name: 'Priya Sharma', email: 'priya@reviewer.com', password: 'review123', role: 'reviewer' },
  { name: 'Rahul Patel', email: 'rahul@reviewer.com', password: 'review123', role: 'reviewer' },
  { name: 'Anjali Verma', email: 'anjali@reviewer.com', password: 'review123', role: 'reviewer' },
  { name: 'Amit Kumar', email: 'amit@reviewer.com', password: 'review123', role: 'reviewer' },
];

// All active campaigns shown on the reviewer home feed
export const feedCampaigns: Campaign[] = [
  {
    id: 'nykaa-beauty-fest-2026',
    title: 'Nykaa Beauty Fest 2026',
    brand: 'Nykaa',
    category: 'Beauty',
    status: 'Active',
    views: '28,432',
    feedbacks: '847',
    rating: '4.6',
    description: "India's biggest beauty sale — 1,000+ brands, up to 50% off, and exclusive new launches curated for every skin type and budget.",
    label: 'Beauty',
    shortLabel: 'N',
    tone: { from: 'from-[#fce4ec]', via: 'via-[#f48fb1]', to: 'to-[#c2185b]', accent: 'bg-black/10' },
    ownerEmail: 'aarav@nykaa.com',
  },
  {
    id: 'nykaa-fashion-week-campaign',
    title: 'Nykaa Fashion Week',
    brand: 'Nykaa Fashion',
    category: 'Fashion',
    status: 'Active',
    views: '14,891',
    feedbacks: '423',
    rating: '4.3',
    description: 'Nykaa Fashion Week spotlights independent Indian designers with bold collections built for the modern Indian wardrobe.',
    label: 'Fashion',
    shortLabel: 'N',
    tone: { from: 'from-[#e9ddd0]', via: 'via-[#dbc5ad]', to: 'to-[#b38a61]', accent: 'bg-white/12' },
    ownerEmail: 'aarav@nykaa.com',
  },
  {
    id: 'boat-rockerz-550-launch',
    title: 'boAt Rockerz 550',
    brand: 'boAt',
    category: 'Tech',
    status: 'Active',
    views: '31,204',
    feedbacks: '1,024',
    rating: '4.5',
    description: 'Rockerz 550 — 20-hour playback, deep ASAP™ Charge, and foldable design. Built for the generation that never stops moving.',
    label: 'Tech',
    shortLabel: 'b',
    tone: { from: 'from-[#d2f3ff]', via: 'via-[#7fd0ff]', to: 'to-[#2b6ddf]', accent: 'bg-white/14' },
    ownerEmail: 'nisha@boat.com',
  },
  {
    id: 'mamaearth-vitamin-c-serum',
    title: 'Vitamin C Face Serum',
    brand: 'Mamaearth',
    category: 'Beauty',
    status: 'Active',
    views: '22,109',
    feedbacks: '734',
    rating: '4.7',
    description: 'Powered by Vitamin C and Turmeric, this serum brightens skin, fades dark spots, and delivers visible radiance in 4 weeks.',
    label: 'Beauty',
    shortLabel: 'M',
    tone: { from: 'from-[#fffde7]', via: 'via-[#fff176]', to: 'to-[#f9a825]', accent: 'bg-black/12' },
    ownerEmail: 'pooja@mamaearth.com',
  },
  {
    id: 'mamaearth-onion-hair-oil',
    title: 'Onion Hair Oil',
    brand: 'Mamaearth',
    category: 'Wellness',
    status: 'Active',
    views: '17,832',
    feedbacks: '589',
    rating: '4.5',
    description: 'Enriched with real onion extract and Redensyl, this hair oil fights hair fall and promotes thicker, stronger hair growth.',
    label: 'Wellness',
    shortLabel: 'M',
    tone: { from: 'from-[#ecfdf5]', via: 'via-[#a7f3d0]', to: 'to-[#065f46]', accent: 'bg-white/10' },
    ownerEmail: 'pooja@mamaearth.com',
  },
  {
    id: 'titan-edge-collection',
    title: 'Titan Edge Collection',
    brand: 'Titan',
    category: 'Accessories',
    status: 'Active',
    views: '11,453',
    feedbacks: '298',
    rating: '4.4',
    description: "The Titan Edge — world's slimmest watch at 3.5mm, with a refined minimalist dial crafted for those who speak through elegance.",
    label: 'Accessories',
    shortLabel: 'T',
    tone: { from: 'from-[#eceff1]', via: 'via-[#b0bec5]', to: 'to-[#37474f]', accent: 'bg-white/10' },
    ownerEmail: 'karan@titan.co',
  },
  {
    id: 'titan-raga-festive-edit',
    title: 'Titan Raga Festive',
    brand: 'Titan',
    category: 'Luxury',
    status: 'Active',
    views: '8,764',
    feedbacks: '187',
    rating: '4.6',
    description: "Raga's festive edit blends traditional meenakari motifs with contemporary gold-tone finishes — crafted for the woman who celebrates every moment.",
    label: 'Luxury',
    shortLabel: 'T',
    tone: { from: 'from-[#fef3c7]', via: 'via-[#fde68a]', to: 'to-[#92400e]', accent: 'bg-black/12' },
    ownerEmail: 'karan@titan.co',
  },
  {
    id: 'zomato-10min-delivery',
    title: 'Zomato 10-Min Delivery',
    brand: 'Zomato',
    category: 'Food',
    status: 'Active',
    views: '45,321',
    feedbacks: '1,892',
    rating: '4.1',
    description: 'Food in 10 minutes. Zomato Instant brings your favourite meals from nearby restaurants at record speed — no compromise on quality.',
    label: 'Food',
    shortLabel: 'Z',
    tone: { from: 'from-[#ffebee]', via: 'via-[#ef9a9a]', to: 'to-[#c62828]', accent: 'bg-black/15' },
    ownerEmail: 'ritika@zomato.com',
  },
  {
    id: 'zomato-gold-membership',
    title: 'Zomato Gold',
    brand: 'Zomato',
    category: 'Lifestyle',
    status: 'Active',
    views: '27,654',
    feedbacks: '934',
    rating: '4.3',
    description: 'Unlimited free deliveries, member-exclusive discounts, and priority access to top restaurants across 700+ cities — for ₹149/month.',
    label: 'Lifestyle',
    shortLabel: 'Z',
    tone: { from: 'from-[#fff3e0]', via: 'via-[#ffcc80]', to: 'to-[#e65100]', accent: 'bg-black/12' },
    ownerEmail: 'ritika@zomato.com',
  },
];

// All campaigns including paused — used for brand owner management views
export const businessCampaigns: Campaign[] = [
  ...feedCampaigns,
  {
    id: 'boat-airdopes-141-campaign',
    title: 'boAt Airdopes 141',
    brand: 'boAt',
    category: 'Accessories',
    status: 'Paused',
    views: '19,567',
    feedbacks: '612',
    rating: '4.2',
    description: 'Airdopes 141 delivers 42 hours of total playback with Environmental Noise Cancellation — built for Indian commuters and long work days.',
    label: 'Accessories',
    shortLabel: 'b',
    tone: { from: 'from-[#e2c69a]', via: 'via-[#a36e3e]', to: 'to-[#1f1813]', accent: 'bg-white/10' },
    ownerEmail: 'nisha@boat.com',
  },
];

export const dashboardMetrics: Metric[] = [
  { label: 'Total Views', value: '207.7K', delta: '+18.3%', icon: 'eye' },
  { label: 'Total Feedbacks', value: '7,510', delta: '+11.6%', icon: 'messages' },
  { label: 'Average Rating', value: '4.4', delta: '+0.2', icon: 'star' },
  { label: 'Engagement Rate', value: '3.6%', delta: '+0.9%', icon: 'trend' },
];

export const feedbackItems: Feedback[] = [
  // Vijay Sawant — 2 reviews
  {
    name: 'Vijay Sawant',
    userEmail: 'vijay@reviewer.com',
    campaignId: 'boat-rockerz-550-launch',
    time: '3 hours ago',
    rating: 4,
    label: 'Would buy',
    points: '+40',
    comment: 'The bass response is strong and the ANC works surprisingly well for the price. Build quality feels premium for a boAt product.',
  },
  {
    name: 'Vijay Sawant',
    userEmail: 'vijay@reviewer.com',
    campaignId: 'zomato-10min-delivery',
    time: 'Yesterday',
    rating: 5,
    label: 'Loved it',
    points: '+50',
    comment: 'Ordered biryani, it arrived in 9 minutes hot and fresh. The 10-minute promise actually holds up — game changer for lunch breaks.',
  },

  // Priya Sharma — 3 reviews
  {
    name: 'Priya Sharma',
    userEmail: 'priya@reviewer.com',
    campaignId: 'nykaa-beauty-fest-2026',
    time: '5 hours ago',
    rating: 5,
    label: 'Loved it',
    points: '+50',
    comment: 'Found three products I had been looking for months, all at 40% off. The curated bundles make gifting so much easier. Killer campaign.',
  },
  {
    name: 'Priya Sharma',
    userEmail: 'priya@reviewer.com',
    campaignId: 'mamaearth-vitamin-c-serum',
    time: '2 days ago',
    rating: 4,
    label: 'Would buy',
    points: '+40',
    comment: 'Noticeable glow after two weeks of consistent use. The turmeric scent is mild. Packaging could be more premium at this price point.',
  },
  {
    name: 'Priya Sharma',
    userEmail: 'priya@reviewer.com',
    campaignId: 'titan-edge-collection',
    time: '3 days ago',
    rating: 3,
    label: 'Mixed',
    points: '+30',
    comment: 'The watch itself is gorgeous — 3.5mm is genuinely impressive. But the strap quality feels mismatched with the rest of the design.',
  },

  // Rahul Patel — 4 reviews
  {
    name: 'Rahul Patel',
    userEmail: 'rahul@reviewer.com',
    campaignId: 'boat-airdopes-141-campaign',
    time: '1 hour ago',
    rating: 5,
    label: 'Loved it',
    points: '+50',
    comment: '42 hours of total battery is real — I tested it over 5 days of heavy commuting. The fit is secure and call quality is clear outdoors.',
  },
  {
    name: 'Rahul Patel',
    userEmail: 'rahul@reviewer.com',
    campaignId: 'nykaa-fashion-week-campaign',
    time: 'Yesterday',
    rating: 4,
    label: 'Would buy',
    points: '+40',
    comment: 'Sharp curation this season. The campaign does a good job positioning Nykaa as more than just a beauty brand — the fashion pivot feels genuine.',
  },
  {
    name: 'Rahul Patel',
    userEmail: 'rahul@reviewer.com',
    campaignId: 'zomato-gold-membership',
    time: '2 days ago',
    rating: 4,
    label: 'Would buy',
    points: '+40',
    comment: 'Already saving ₹800/month on delivery fees alone. The restaurant selection for Gold members has improved significantly since launch.',
  },
  {
    name: 'Rahul Patel',
    userEmail: 'rahul@reviewer.com',
    campaignId: 'mamaearth-onion-hair-oil',
    time: '4 days ago',
    rating: 5,
    label: 'Loved it',
    points: '+50',
    comment: 'Six weeks in — my hair fall has reduced noticeably. The formula is lightweight and leaves no residue. Genuinely works as advertised.',
  },

  // Anjali Verma — 3 reviews
  {
    name: 'Anjali Verma',
    userEmail: 'anjali@reviewer.com',
    campaignId: 'titan-raga-festive-edit',
    time: '2 hours ago',
    rating: 5,
    label: 'Loved it',
    points: '+50',
    comment: "Gifted this to my mother for Diwali. The meenakari dial is stunning in person — photos don't do it justice. Impeccable packaging too.",
  },
  {
    name: 'Anjali Verma',
    userEmail: 'anjali@reviewer.com',
    campaignId: 'nykaa-beauty-fest-2026',
    time: 'Yesterday',
    rating: 3,
    label: 'Mixed',
    points: '+30',
    comment: 'Great discounts but the site kept lagging during checkout. Lost two cart items twice. The products are excellent, execution needs work.',
  },
  {
    name: 'Anjali Verma',
    userEmail: 'anjali@reviewer.com',
    campaignId: 'boat-rockerz-550-launch',
    time: '3 days ago',
    rating: 4,
    label: 'Would buy',
    points: '+40',
    comment: 'Solid for gym use. The foldable design is genuinely useful and the 20-hour battery claim holds up at 75% volume in real-world testing.',
  },

  // Amit Kumar — 2 reviews
  {
    name: 'Amit Kumar',
    userEmail: 'amit@reviewer.com',
    campaignId: 'zomato-10min-delivery',
    time: '6 hours ago',
    rating: 4,
    label: 'Would buy',
    points: '+40',
    comment: 'Works well in Bengaluru. Selection is limited to nearby dark kitchens but the speed is real. Worth trying if you are in a supported zone.',
  },
  {
    name: 'Amit Kumar',
    userEmail: 'amit@reviewer.com',
    campaignId: 'mamaearth-vitamin-c-serum',
    time: '2 days ago',
    rating: 5,
    label: 'Loved it',
    points: '+50',
    comment: 'Clean ingredient list, no parabens or sulphates, and the brightening effect is visible within the first month. Very strong value at this price.',
  },
];
