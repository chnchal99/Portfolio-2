/**
 * ==============================================================================
 * CHANCHAL MATHARU PORTFOLIO — PROJECT MEDIA & CONTENT REPOSITORY
 * ==============================================================================
 * 
 * To add or update photos, videos, or external links for any project:
 * 1. Place your image/video files in /public/images/projects/<project-folder>/
 *    (e.g., /public/images/projects/country-rolls/hero.jpg)
 * 2. Update the `heroMedia`, `mediaSet`, or `reels` array below.
 * 3. If an image file is not yet added, the portfolio renders a sleek neutral
 *    editorial card without ever falling back to generic stock images.
 */

export interface ProjectMediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  caption?: string;
  category?: "launch" | "food" | "influencer" | "offline" | "reels" | "hero";
  thumbnail?: string;
}

export interface ProjectReel {
  title: string;
  url: string; // Instagram Reel or video URL
  tag?: string;
  views?: string;
}

export interface PortfolioProject {
  id: string;
  number: string;
  title: string;
  brand: string;
  category: string;
  timeframe?: string;
  location?: string;
  clientType: string;
  metricLabel: string;
  metric: string;
  scopeHighlight: string;
  color: string;
  heroMedia?: string; // e.g. "/images/projects/country-rolls/hero.jpg"
  mediaSet: ProjectMediaItem[];
  reels: ProjectReel[];
  instagramUrl?: string;
  instagramHandle?: string;
  websiteUrl?: string;
  story: string;
  myRole: string;
  myExecution: string[];
  offlineMechanics?: string[];
  note?: string;
}

export interface ClientDiversityItem {
  name: string;
  tagline: string;
  desc: string;
  category: string;
  myRole: string;
  instagramUrl?: string;
  mediaUrl?: string;
}

export interface ContentLabCard {
  id: string;
  label: string;
  title: string;
  desc: string;
  className: string;
  mediaUrl?: string;
  videoUrl?: string;
}

// ==============================================================================
// 1. FEATURED CASE STUDIES (PRIMARY / CURRENT WORK)
// ==============================================================================
export const featuredProjects: PortfolioProject[] = [
  {
    id: "project-01",
    number: "01",
    title: "Country Rolls",
    brand: "Country Rolls QSR",
    category: "QSR Launch / Brand Building / Offline + Digital",
    timeframe: "Launch & Growth Retainer",
    location: "Raipur",
    clientType: "Food & Beverage (QSR)",
    metricLabel: "Product Portfolio",
    metric: "20+ Varieties",
    scopeHighlight: "Zero-to-One QSR Launch Beside Established Competitor (KFC)",
    color: "#7A0010",
    heroMedia: "/images/projects/country-rolls/influencers.jpg",
    mediaSet: [
      {
        id: "cr-launch-01",
        type: "image",
        url: "/images/projects/country-rolls/influencers.jpg",
        caption: "Influencer squad launch day presence & brand activation at Country Rolls",
        category: "influencer",
      },
      {
        id: "cr-influencer-01",
        type: "image",
        url: "/images/projects/country-rolls/creator-collab.jpg",
        caption: "On-ground influencer review & creator walkthrough coverage",
        category: "influencer",
      },
      {
        id: "cr-food-01",
        type: "image",
        url: "/images/projects/country-rolls/hero.jpg",
        caption: "Storefront & launch day presence directly adjacent to KFC",
        category: "launch",
      },
    ],
    reels: [
      { title: "Review Reel — Customer Reaction", url: "https://instagram.com", tag: "Review" },
      { title: "Trendy Voiceover Reel — Roll Varieties", url: "https://instagram.com", tag: "Voiceover" },
      { title: "Influencer Collaboration Reel — Launch Day", url: "https://instagram.com", tag: "Influencer" },
    ],
    instagramUrl: "https://instagram.com",
    instagramHandle: "@countryrolls",
    myRole: "End-to-End Content Strategy, Launch Architecture & On-Ground Production",
    story:
      "One of the most challenging launches: building a QSR brand from the ground up directly beside KFC in an intensely competitive environment. My role went far beyond traditional social media — partnering directly with graphic designers and the founder to architect the brand across both digital touchpoints and on-ground physical customer activations.",
    myExecution: [
      "Launch planning, pre-launch hype build-up and full weekly content execution",
      "Unique scripting, trend-led voiceovers and organic food review reels",
      "Influencer curation, briefing and on-site creator collaboration direction",
      "Graphic direction for stickers, posters, flexes, sunboards and digital menu boards",
      "On-ground marketing and customer engagement mechanics to drive opening footfall",
    ],
    offlineMechanics: [
      "Criss-cross game tables & interactive word puzzles for dining guests",
      "'Tag us & receive a free softy' social bridge with counter staff",
      "Branded balloons with brand scanner / QR activation for take-aways",
      "Curated menu communication across 20+ roll, momo, fry & softy varieties",
    ],
    note: "Primary personal objective: establish distinct identity, drive word-of-mouth footfall, and create enduring competitive positioning against legacy QSR.",
  },

  {
    id: "project-02",
    number: "02",
    title: "Shree Nandi's",
    brand: "Shree Nandi's Sweets",
    category: "F&B Sweets Launch / 10+ Creator Lineup / Creative Direction",
    timeframe: "Grand Launch & Festive Season",
    location: "Raipur",
    clientType: "Traditional & Modern Confectionery",
    metricLabel: "Creator Deployment",
    metric: "10+ Synchronized Creators",
    scopeHighlight: "Massive Brand Launch Powered by 10+ Synchronized Creator Drops",
    color: "#7A0010",
    heroMedia: "/images/projects/shree-nandis/rakhi-celebration.jpg",
    mediaSet: [
      {
        id: "sn-launch-01",
        type: "image",
        url: "/images/projects/shree-nandis/rakhi-celebration.jpg",
        caption: "High-production Rakhi festive celebration, traditional pooja thali & signature sweets",
        category: "launch",
      },
      {
        id: "sn-festive-01",
        type: "image",
        url: "/images/projects/shree-nandis/rakhi-gift-hamper.jpg",
        caption: "Exclusive festive Raksha Bandhan gift hamper packaging & handcrafted sweets curation",
        category: "food",
      },
      {
        id: "sn-influencer-01",
        type: "image",
        url: "/images/projects/shree-nandis/rakhi-celebration.jpg",
        caption: "Festive launch campaign & creator review coverage",
        category: "influencer",
      },
    ],
    reels: [
      { title: "Grand Launch Campaign Reel", url: "https://instagram.com", tag: "Launch" },
      { title: "High-Production Rakhi Festive Reel", url: "https://instagram.com", tag: "Festive" },
      { title: "Signature Ghewar Highlight Reel", url: "https://instagram.com", tag: "Product" },
      { title: "'The Most Creative Thief' Conceptual Reel", url: "https://instagram.com", tag: "Creative Arc" },
      { title: "Personal Favourite Brand Story Reel", url: "https://instagram.com", tag: "Narrative" },
    ],
    instagramUrl: "https://instagram.com",
    instagramHandle: "@shreenandis",
    myRole: "Launch Content Direction, Storyboarding & 10+ Creator Network Coordination",
    story:
      "Engineered an unforgettable brand launch for Shree Nandi's by orchestrating a 10+ creator lineup alongside high-concept storytelling reels. The campaign bridged traditional heritage sweets with viral digital culture, ensuring opening day was met with lines around the block.",
    myExecution: [
      "Conceptualized, scripted and directed five distinct hero reels spanning launch to Rakhi festive season",
      "Mobilized and directed 10+ local food and lifestyle creators with customized scripting angles and authentic narrative hooks",
      "Authored the viral 'The Most Creative Thief' narrative reel to shatter standard sweet-shop content tropes",
      "Curated visual aesthetic, shot lists and on-location lighting direction for high-production product shoots",
      "Maintained weekly post-launch content continuity to convert opening day buzz into regular footfall",
    ],
    note: "Demonstrated full mastery over creator management, high-production festive scripting and cultural storytelling.",
  },

  {
    id: "project-03",
    number: "03",
    title: "Coffee Co. @ 7th Gear / Bomdia",
    brand: "Coffee Co. @ 7th Gear",
    category: "Cafe Relaunch / Nightlife & Live Music / Gen-Z Storytelling",
    timeframe: "Relaunch & Retainer",
    location: "Raipur",
    clientType: "Specialty Cafe & Experiential Hub",
    metricLabel: "30-Day Reach",
    metric: "123.1K+ Views",
    scopeHighlight: "100K+ Viral Reel Milestone & 123K+ 30-Day Account Growth",
    color: "#7A0010",
    heroMedia: "/images/projects/coffee-co-7th-gear/instagram-growth-dashboard.jpg",
    mediaSet: [
      {
        id: "cc-relaunch-01",
        type: "image",
        url: "/images/projects/coffee-co-7th-gear/instagram-growth-dashboard.jpg",
        caption: "Verified Instagram growth: 123.1K+ views in 30 days & 100K viral reel milestone (@bomdia.bycoffee_co)",
        category: "launch",
      },
    ],
    reels: [
      { title: "Welcome to BOM-DIA Reel (100K Views)", url: "https://www.instagram.com/bomdia.bycoffee_co/", tag: "100K Viral" },
      { title: "Signature Coffee & Brews Reel", url: "https://www.instagram.com/bomdia.bycoffee_co/", tag: "Signature" },
      { title: "Cafe Ambience & Travel Planning Vibe", url: "https://www.instagram.com/bomdia.bycoffee_co/", tag: "Aesthetic" },
    ],
    instagramUrl: "https://www.instagram.com/bomdia.bycoffee_co/",
    instagramHandle: "@bomdia.bycoffee_co",
    websiteUrl: "https://g.co/kgs/QM4XMXT",
    myRole: "Social Strategy, Trend Architecture, Event Shoots & Influencer Outreach",
    story:
      "Relaunched the cafe identity by blending specialty beverage aesthetics with community events — stand-up comedy, live acoustic sessions, and seasonal evening activations. Every shoot captured the raw energy and social warmth that transformed the cafe into an evening destination.",
    myExecution: [
      "Executed social-first cafe relaunch strategy targeting young professionals and students",
      "Captured and rapidly edited high-energy reels during live music gigs and comedy evenings",
      "Directed targeted creator collaborations to showcase specialty coffee and chill evening ambience",
      "Tested fresh audio trends, text-hook frameworks and ambient visual pacing for maximum retention",
    ],
    note: "Highlights capability in youth culture, fast-turnaround event coverage and aesthetic cafe storytelling.",
  },

  {
    id: "project-04",
    number: "04",
    title: "10+ Creators Collective // Raipur",
    brand: "Citywide Creator Network",
    category: "Creator Strategy / 10+ Talent Lineup / Coordinated Launch Blitz",
    timeframe: "Coordinated 48-Hour Launch Blitz",
    location: "Raipur",
    clientType: "Influencer Strategy, Talent Direction & Campaign Synchronization",
    metricLabel: "Creator Deployment",
    metric: "10+ Synchronized Creators",
    scopeHighlight: "Simultaneous Multi-Tier Rollout Across Food, Lifestyle & Youth Demographics",
    color: "#7A0010",
    heroMedia: "/images/projects/creators-raipur/bts-camera-shoot.jpg",
    mediaSet: [
      {
        id: "crp-lineup-01",
        type: "image",
        url: "/images/projects/creators-raipur/bts-camera-shoot.jpg",
        caption: "Behind-the-scenes camera production & talent direction on set with creators",
        category: "influencer",
      },
      {
        id: "crp-lineup-02",
        type: "image",
        url: "/images/projects/creators-raipur/hero.jpg",
        caption: "10+ Creator network lineup & production studio coordination",
        category: "launch",
      },
    ],
    reels: [
      { title: "10+ Creator Coordinated Launch Blitz — Campaign Recap", url: "https://instagram.com", tag: "Campaign Blitz" },
      { title: "Creator Direction & Behind-the-Scenes Production", url: "https://instagram.com", tag: "BTS Direction" },
      { title: "Audience Impact & Organic UGC Compilation", url: "https://instagram.com", tag: "Impact" },
    ],
    instagramUrl: "https://instagram.com",
    myRole: "Creator Talent Curation, Angle Briefs, Production QA & Coordinated Launch Sequencing",
    story:
      "An exercise in creative orchestration and logistical precision: scouting, vetting, scripting, and synchronizing a network of 10+ high-engagement local creators to deploy within a decisive 48-hour launch blitz. Rather than forcing uniform promotional scripts, each creator was provided with a tailored narrative angle attuned to their organic style—transforming sponsored outreach into authentic community recommendations that blanketed Raipur's explore feeds and drove immediate on-ground footfall.",
    myExecution: [
      "Curated a high-converting roster of 10+ creators spanning food connoisseurs, lifestyle tastemakers, and student community leaders",
      "Authored customized storyboarding and talking-point briefs to ensure diverse, non-repetitive brand angles across feeds",
      "Managed VIP on-site hosting, shoot coordination, and express 24-hour turnaround review cycles",
      "Synchronized publication drop times and engineered collaborative tagging mechanics for maximum algorithmic velocity",
      "Seeded real-time comment interactions and engagement triggers to turn viewer curiosity into verified footfall",
    ],
    note: "Demonstrates proven capability in large-scale creator talent management, multi-stakeholder delivery, and synchronized launch mechanics that turn attention into footfall.",
  },
];

// ==============================================================================
// 2. ADDITIONAL CLIENT WORK & SPECIALIZED EXPERIENCE
// ==============================================================================
export const additionalClientWork: ClientDiversityItem[] = [
  {
    name: "Travel Company",
    category: "Hospitality & Travel",
    tagline: "Content Strategy + Destination Research + Rapid Shoots",
    myRole: "Monthly Plan of Action, Itinerary Research & 1-Day Bulk Shoot System",
    desc: "In-depth destination research, seasonal travel itineraries, occasion days, and aesthetic feed planning. Built a high-speed production system delivering approximately one full month of structured travel content from a single organized shoot day.",
    instagramUrl: "https://instagram.com",
  },
  {
    name: "Pets Island",
    category: "Pet Care & Retail",
    tagline: "Community Content + Seasonal Events + Presentation Standards",
    myRole: "Event Production (Doggy Summer Pool Party) & Staff On-Camera Training",
    desc: "Created educational pet care and grooming reels to build customer trust and drive store footfall. Conceptualized and executed a high-engagement summer pool party for dogs, while establishing professional on-camera presentation standards with uniformed staff.",
    instagramUrl: "https://instagram.com",
  },
  {
    name: "Naturelite Foods",
    category: "FMCG / Retail Grocery",
    tagline: "Retail Outlet Launch + Everyday Grocery Education",
    myRole: "Pre-Launch Hype, Ingredient Purity Content & Retail Communication",
    desc: "Pre-launch momentum and consumer education for a new retail outlet. Built high-trust content around daily essentials (dals, cold-pressed oils, pulses, wheat atta), emphasizing unadulterated purity, farm sourcing and healthy living.",
    instagramUrl: "https://instagram.com",
  },
  {
    name: "Sunnest Power",
    category: "Clean Tech & B2B",
    tagline: "B2B Solar Education + Dealership Marketing Systems",
    myRole: "B2B Tech Demystification, Video Scripting & Dealership Content",
    desc: "Demystified technical solar energy concepts for B2B dealers and commercial clients. Developed clear educational video content, dealership-focused acquisition messaging, and planned systematic shoots at solar installation sites.",
    instagramUrl: "https://instagram.com",
  },
  {
    name: "Stay Beyond @ 7th Gear",
    category: "Experiential Hospitality",
    tagline: "Destination Storytelling + Pench Nature Retreat",
    myRole: "Experiential Reel Direction & Scenic Travel Narrative",
    desc: "Positioned Stay Beyond as an immersive weekend getaway when visiting Manka Farms and Pench National Park. Directed atmospheric reels showcasing misty mornings, tranquil outdoor dining and luxury jungle retreat stays.",
    instagramUrl: "https://instagram.com",
  },
  {
    name: "Podcasters Meet Raipur",
    category: "Creator Community & Events",
    tagline: "Live Event Documentation + Audio-Visual Clips",
    myRole: "On-Ground Coverage, Micro-Clips & Creator Networking",
    desc: "Spearheaded on-ground social coverage for Raipur's podcasters and audio creators. Captured rapid-fire soundbites, panel moments, and edited punchy vertical micro-clips to drive organic shares across attendee networks.",
    instagramUrl: "https://instagram.com",
  },
  {
    name: "The Artisanal Crust & Patisserie",
    category: "Gourmet Bakery & Premium F&B",
    tagline: "Sensory ASMR Video + Daily Batch Drops + Seasonal Menus",
    myRole: "ASMR Macro Video Capture, Morning Reel Hooks & Pre-Order Drops",
    desc: "High-definition macro video capture highlighting sourdough fermentation textures, golden viennoiserie, and daily batch production. Built an irresistible morning routine content system that drove weekend footfall and rapid sell-outs.",
    instagramUrl: "https://instagram.com",
  },
  {
    name: "Aura Luxe Fitness & Wellness",
    category: "Health, Fitness & Studio Retail",
    tagline: "High-Retention Workout Hooks + Form Guides + Trainer Authority",
    myRole: "Technique Form Formats, Aesthetic Gym Reels & Trial Inquiries",
    desc: "Engineered an energizing social presence balancing technique-led educational reels with vibrant gym aesthetic culture. Positioned trainers as authority figures and drove consistent organic trial session inquiries.",
    instagramUrl: "https://instagram.com",
  },
];

// ==============================================================================
// 3. CONTENT LABORATORY / VIDEO STRATEGY PILLARS
// ==============================================================================
export const contentLabCards: ContentLabCard[] = [
  {
    id: "content-01",
    label: "Trend-Led & Hook Strategy",
    title: "Scripted for the pause, shot for retention",
    desc: "Short-form video built around strong initial 2-second visual hooks, natural voiceovers, and pacing that keeps watch-time high.",
    className: "content-card-tall",
    mediaUrl: "/images/projects/content-lab/hook-strategy.jpg",
  },
  {
    id: "content-02",
    label: "Physical + Digital Activation",
    title: "Connecting on-ground footfall to the feed",
    desc: "From interactive games, QR scanners, and stickers to launch-day hype — bridging physical consumer touchpoints directly into social shares.",
    className: "content-card-wide",
    mediaUrl: "/images/projects/content-lab/offline-activation.jpg",
  },
  {
    id: "content-03",
    label: "B2B & Product Education",
    title: "Making complex products instantly clear",
    desc: "Turning technical specs and retail commodities into engaging, digestible content that answers customer questions before they ask.",
    className: "content-card-square",
    mediaUrl: "/images/projects/content-lab/product-education.jpg",
  },
];

// ==============================================================================
// 4. CAPABILITIES & DISCIPLINES (MY DELIVERABLES)
// ==============================================================================
export const serviceCategories = [
  {
    title: "Content Strategy & Planning",
    items: "Monthly Plans of Action, Content Calendars, Campaign Concepts, Growth Pillars",
  },
  {
    title: "Content Creation & Scripting",
    items: "Reel Concepts, Hook Writing, Trend-Led Formats, Educational & Brand Storytelling",
  },
  {
    title: "Social Media Management",
    items: "Instagram, YouTube, LinkedIn, Facebook, Aesthetic Feed Layouts, Community Cadence",
  },
  {
    title: "Launches & Brand Hype",
    items: "Pre-Launch Teasers, Launch-Day Execution, Post-Launch Momentum, Offline Touchpoints",
  },
  {
    title: "Influencer Marketing",
    items: "Creator Research, Outreach, Barter & Paid Deals, Shoot Guidelines, Deliverable QA",
  },
  {
    title: "Shoot Planning & Direction",
    items: "Shot Lists, On-Ground Coordination, Props & Styling, Single-Day Bulk Production",
  },
  {
    title: "Brand & Competitor Research",
    items: "Market Gap Identification, Differentiation Strategies, Audience Persona Mapping",
  },
  {
    title: "Performance & Web Credibility",
    items: "Meta & Google Ads Optimization, WordPress Development, On-Page SEO & Content Layout",
  },
];

// ==============================================================================
// 5. CREDIBILITY & FOUNDATIONS
// ==============================================================================
export const credibilityRoles = [
  {
    role: "Digital Marketing Associate",
    company: "Sensei Marketing",
    period: "Feb 2022 – Jun 2023",
    summary:
      "Cross-platform marketing across Instagram, YouTube, LinkedIn & Facebook. Handled influencer coordination, competitor research, SEO content, Canva creative direction, and WordPress web optimization.",
    highlight: "Delivered 55% higher engagement & 45% improved conversions across assigned campaigns.",
  },
  {
    role: "Pinterest SEO & Marketing Specialist",
    company: "Specialist Contract",
    period: "Jul 2024 – Dec 2024",
    summary:
      "Executed strategic visual pin creation, keyword research, content optimization, and search analytics.",
    highlight: "Grew reach to 13K+ monthly Pinterest views within the first three months.",
  },
  {
    role: "Freelance WordPress Developer",
    company: "Independent",
    period: "2021 – 2022",
    summary:
      "Built responsive, performance-tuned websites with clean UI/UX, semantic HTML/CSS, and structured on-page SEO foundations.",
    highlight: "Technical bridge between web performance, design and conversion-focused copy.",
  },
];

// ==============================================================================
// 6. 10-PHASE STRATEGIC PIPELINE (END-TO-END METHODOLOGY)
// ==============================================================================
export interface PipelineStage {
  step: string;
  name: string;
  phase: string;
  desc: string;
  deliverable: string;
}

export const pipelineStages: PipelineStage[] = [
  {
    step: "01",
    name: "Research",
    phase: "Discovery",
    desc: "Audience analytics, competitor gaps & cultural hooks",
    deliverable: "Market intelligence dossier & angle audit",
  },
  {
    step: "02",
    name: "Strategy",
    phase: "Framework",
    desc: "Brand positioning, platform narratives & content pillars",
    deliverable: "Monthly Plan of Action & creative guardrails",
  },
  {
    step: "03",
    name: "Content",
    phase: "Ideation",
    desc: "High-concept ideation, format testing & visual codes",
    deliverable: "Content calendar & trend architecture",
  },
  {
    step: "04",
    name: "Scripting",
    phase: "Narrative",
    desc: "High-retention hooks, story beats & conversion triggers",
    deliverable: "Word-for-word scripts & audio cues",
  },
  {
    step: "05",
    name: "Shoot Planning",
    phase: "Pre-Prod",
    desc: "Shot lists, props, talent direction & schedule logistics",
    deliverable: "Production run-sheets & location maps",
  },
  {
    step: "06",
    name: "Execution",
    phase: "Production",
    desc: "On-ground directing, framing, capture & fast-turn edits",
    deliverable: "Raw reels, cinematic cuts & sound design",
  },
  {
    step: "07",
    name: "Influencers",
    phase: "Network",
    desc: "Creator sourcing, authentic briefs & relationship sync",
    deliverable: "10+ Synchronized creator campaigns & launch activations",
  },
  {
    step: "08",
    name: "Launch",
    phase: "Deployment",
    desc: "Phased drops, cross-platform rollout & sync mechanics",
    deliverable: "Launch sequencing & offline-to-digital QR bridges",
  },
  {
    step: "09",
    name: "Hype",
    phase: "Amplify",
    desc: "Algorithm momentum, community responses & comment viral hooks",
    deliverable: "Engagement surges & UGC ripple effects",
  },
  {
    step: "10",
    name: "Post-Launch Continuity",
    phase: "Retention",
    desc: "Performance audit, iterative retention & sustained client retainers",
    deliverable: "Evergreen content systems & growth reports",
  },
];
