import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultFileUrl = 'https://example.com/download.zip';

// Helper for generating Unsplash image URLs for categories
const categoryImages: Record<string, string> = {
  'AI Prompts': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
  'Canva Templates': 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
  'Notion Templates': 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?q=80&w=1000&auto=format&fit=crop',
  'n8n Automation Workflows': 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
  'Resume & CV Templates': 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=1000&auto=format&fit=crop',
  'Social Media Kits': 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=1000&auto=format&fit=crop',
  'Excel & Google Sheets': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
  'Website Templates': 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=1000&auto=format&fit=crop',
  'Lightroom Presets': 'https://images.unsplash.com/photo-1554046920-90dcac4b7861?q=80&w=1000&auto=format&fit=crop',
  'eBooks & Premium Guides': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop',
};

const products = [
  // 1. AI Prompts
  { title: "ChatGPT Master Prompt Pack", price: 19.99, category: "AI Prompts", desc: "Over 5,000 highly engineered ChatGPT prompts for marketing, coding, and sales. Unlock the full potential of GPT-4 today. Includes lifetime updates." },
  { title: "Midjourney Photorealism Prompts", price: 14.99, category: "AI Prompts", desc: "A curated collection of Midjourney v6 prompts specifically engineered to produce ultra-realistic portrait and landscape photography. Stop guessing your parameters." },
  { title: "Claude 3 Opus Prompt Library", price: 12.99, category: "AI Prompts", desc: "Advanced prompt engineering guide and copy-paste templates specifically optimized for Anthropic's Claude 3. Perfect for long-form writing and coding." },
  { title: "Gemini Advanced Workflows", price: 15.00, category: "AI Prompts", desc: "Integrate Gemini into your daily tasks with this extensive prompt library. Covers Google Workspace integration workflows and data analysis." },
  { title: "AI Business Strategy Prompts", price: 29.99, category: "AI Prompts", desc: "The ultimate cheat sheet for consultants and agency owners. Prompt your way to strategic plans, competitive analysis, and pitch decks." },

  // 2. Canva Templates
  { title: "Minimalist Instagram Post Pack", price: 9.99, category: "Canva Templates", desc: "100+ fully editable Instagram post templates designed for modern brands and influencers. Boost your engagement with aesthetic layouts." },
  { title: "Viral Reels Cover Templates", price: 7.99, category: "Canva Templates", desc: "Grab attention instantly with these high-converting Reels and TikTok cover templates. 100% editable in Canva Free or Pro." },
  { title: "Creator Media Kit Template", price: 19.99, category: "Canva Templates", desc: "Pitch to brands with confidence. A 5-page highly professional media kit template including rates, stats, and case studies." },
  { title: "Digital Planner 2026 (Canva)", price: 14.99, category: "Canva Templates", desc: "A beautiful, hyperlinked digital planner template you can rebrand and sell, or use for yourself. Fully editable in Canva." },
  { title: "Agency Business Proposal", price: 24.99, category: "Canva Templates", desc: "Close higher-paying clients with this sleek business proposal and invoice template set. Designed for creatives and agencies." },

  // 3. Notion Templates
  { title: "Ultimate Notion CRM", price: 39.99, category: "Notion Templates", desc: "Manage your sales pipeline, track interactions, and forecast revenue directly inside Notion. A complete Salesforce alternative for small teams." },
  { title: "Personal Finance Tracker", price: 14.99, category: "Notion Templates", desc: "Take control of your money. Automated budget tracking, subscription management, and net worth calculations in a beautifully designed dashboard." },
  { title: "Aesthetic Student Planner", price: 12.99, category: "Notion Templates", desc: "The perfect companion for students. Track assignments, calculate GPAs, and organize lecture notes with this intuitive Notion system." },
  { title: "Founder's Business Dashboard", price: 49.99, category: "Notion Templates", desc: "An all-in-one operating system for your startup. Manage OKRs, sprint planning, team wikis, and investor updates in one place." },
  { title: "Atomic Habit Tracker", price: 9.99, category: "Notion Templates", desc: "Build good habits and break bad ones. Features daily tracking, automated weekly summaries, and visual progress charts." },

  // 4. n8n Automation Workflows
  { title: "Automated Lead Generation Flow", price: 29.99, category: "n8n Automation Workflows", desc: "Plug-and-play n8n workflow to scrape leads, enrich data via Clearbit, and push directly to your CRM. Save hundreds of hours." },
  { title: "Multi-Agent AI Orchestrator", price: 49.99, category: "n8n Automation Workflows", desc: "Connect OpenAI, Anthropic, and local LLMs in a single n8n workflow to create a team of autonomous AI agents working on your tasks." },
  { title: "Gmail Inbox Zero Automation", price: 19.99, category: "n8n Automation Workflows", desc: "Automatically categorize, summarize, and draft replies to your emails using n8n and AI. Never miss an important email again." },
  { title: "WhatsApp Support Bot Flow", price: 39.99, category: "n8n Automation Workflows", desc: "Deploy a highly intelligent WhatsApp auto-responder. Connects to the WhatsApp Cloud API and uses RAG to answer customer questions." },
  { title: "Shopify Abandoned Cart Recovery", price: 24.99, category: "n8n Automation Workflows", desc: "An advanced multi-channel abandoned cart workflow using n8n. Triggers emails and SMS based on user behavior." },

  // 5. Resume & CV Templates
  { title: "ATS-Friendly Executive Resume", price: 14.99, category: "Resume & CV Templates", desc: "Beat the Applicant Tracking Systems. A clean, proven resume format favored by Fortune 500 recruiters." },
  { title: "Modern Creative CV", price: 12.99, category: "Resume & CV Templates", desc: "Stand out in design and creative industries. Features a modern layout that highlights your portfolio without overwhelming the reader." },
  { title: "Tech & Engineering Resume Bundle", price: 19.99, category: "Resume & CV Templates", desc: "Specifically designed for Software Engineers and Data Scientists. Includes sections for technical skills, GitHub links, and projects." },
  { title: "Minimalist Starter CV", price: 9.99, category: "Resume & CV Templates", desc: "Perfect for recent graduates and entry-level positions. Clean typography and easy to read." },

  // 6. Social Media Kits
  { title: "Cohesive Instagram Bundle", price: 24.99, category: "Social Media Kits", desc: "A massive bundle of 200+ posts, stories, and highlight covers. Keep your grid looking aesthetic and professional." },
  { title: "Educational Carousel Pack", price: 19.99, category: "Social Media Kits", desc: "High-engagement seamless carousel templates for Instagram and LinkedIn. Perfect for sharing tips, tutorials, and listicles." },
  { title: "Engaging Story Templates", price: 14.99, category: "Social Media Kits", desc: "Boost your story views and interactions with these interactive templates (polls, Q&As, this-or-that)." },
  { title: "Clickbait YouTube Thumbnails", price: 19.99, category: "Social Media Kits", desc: "Increase your CTR instantly. 50+ highly optimized YouTube thumbnail templates used by top creators." },
  { title: "Viral Pinterest Pins", price: 12.99, category: "Social Media Kits", desc: "Drive massive traffic to your blog or store with these optimized, vertical Pinterest pin templates." },

  // 7. Excel & Google Sheets
  { title: "Ultimate Budget & Net Worth Tracker", price: 19.99, category: "Excel & Google Sheets", desc: "The most comprehensive Google Sheets financial dashboard. Syncs beautifully and calculates your FIRE number." },
  { title: "E-Commerce Inventory Tracker", price: 24.99, category: "Excel & Google Sheets", desc: "Manage stock levels, calculate COGS, and get low-inventory alerts. A must-have for Shopify and Etsy sellers." },
  { title: "SaaS Financial Model Template", price: 49.99, category: "Excel & Google Sheets", desc: "Pitch investors with a robust 3-year financial model. Includes churn rates, MRR, CAC, and LTV calculations." },
  { title: "Freelancer Sales & Invoice Tracker", price: 14.99, category: "Excel & Google Sheets", desc: "Keep track of unpaid invoices, client communication, and monthly revenue in a simple, color-coded sheet." },
  { title: "Marketing Analytics Dashboard", price: 29.99, category: "Excel & Google Sheets", desc: "Consolidate your ad spend, ROAS, and conversion rates across Meta, Google, and TikTok in one unified view." },

  // 8. Website Templates
  { title: "SaaS Landing Page (Framer)", price: 49.99, category: "Website Templates", desc: "A high-converting, blazing fast Framer template for SaaS startups. Includes animations, pricing tables, and CMS integration." },
  { title: "Creator Portfolio (Webflow)", price: 39.99, category: "Website Templates", desc: "Showcase your work professionally. A fully responsive Webflow template designed for designers, photographers, and writers." },
  { title: "Premium E-commerce (Shopify)", price: 89.99, category: "Website Templates", desc: "A highly optimized Shopify 2.0 theme. Features mega-menus, quick view, and mobile-first design for maximum conversions." },
  { title: "Local Business Theme (WordPress)", price: 34.99, category: "Website Templates", desc: "An SEO-optimized Elementor WordPress theme perfect for plumbers, lawyers, and local agencies." },
  { title: "Waitlist & Coming Soon (React)", price: 19.99, category: "Website Templates", desc: "A clean Next.js/Tailwind landing page to collect emails before your big launch. Connects directly to Supabase." },

  // 9. Lightroom Presets
  { title: "Moody Wedding Presets", price: 29.99, category: "Lightroom Presets", desc: "15 professional Lightroom presets that give wedding photography a warm, moody, and romantic cinematic feel." },
  { title: "Bright & Airy Travel Presets", price: 19.99, category: "Lightroom Presets", desc: "Make your travel photos pop. Perfect for beaches, cities, and lifestyle photography. Includes both mobile and desktop versions." },
  { title: "Film Emulation Pack", price: 24.99, category: "Lightroom Presets", desc: "Recreate the look of classic 35mm film stocks like Portra 400 and Fuji Superia. Includes authentic grain and halation settings." },
  { title: "Mobile Influencer Presets", price: 14.99, category: "Lightroom Presets", desc: "One-click edits for your iPhone photos. Keep your Instagram feed perfectly cohesive without opening a computer." },

  // 10. eBooks & Premium Guides
  { title: "The 6-Figure Solopreneur Guide", price: 19.99, category: "eBooks & Premium Guides", desc: "A 150-page actionable guide on building, launching, and scaling a one-person business to $100k/year." },
  { title: "Mastering AI for Marketers", price: 24.99, category: "eBooks & Premium Guides", desc: "Learn how to use AI to generate copy, analyze data, and run campaigns 10x faster. Includes prompt libraries and case studies." },
  { title: "Zero to Mastery: SEO in 2026", price: 29.99, category: "eBooks & Premium Guides", desc: "The definitive guide to modern SEO. Learn how to rank organically in an era of AI search and zero-click results." },
  { title: "The Ultimate Guide to Angel Investing", price: 39.99, category: "eBooks & Premium Guides", desc: "Learn how to evaluate startups, read term sheets, and build a winning portfolio of early-stage investments." },
  { title: "Deep Work & Productivity Systems", price: 14.99, category: "eBooks & Premium Guides", desc: "Reclaim your focus. A practical handbook on overcoming procrastination, designing your environment, and getting more done in less time." },
];

async function main() {
  console.log('Starting seed...');
  await prisma.product.deleteMany(); // clear existing

  for (const prod of products) {
    const imageUrl = categoryImages[prod.category];
    await prisma.product.create({
      data: {
        title: prod.title,
        price: prod.price,
        description: prod.desc,
        category: prod.category,
        imageUrl: imageUrl,
        fileUrl: defaultFileUrl,
        isActive: true,
      }
    });
  }

  console.log('Seed completed perfectly! Created ' + products.length + ' products.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
