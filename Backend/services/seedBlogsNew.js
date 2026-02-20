// Seed blog posts
// Run: node services/seedBlogsNew.js

require("dotenv").config();
const mongoose = require("mongoose");
const Blog = require("../Models/Blog");
const Admin = require("../Models/Admin");
const connectDB = require("../config/DB");

const sampleBlogs = [
  {
    title: "Marcus Silva Signs with Premier League Club",
    content: "In a groundbreaking transfer, talented midfielder Marcus Silva has secured a move to Premier League giants. The 19-year-old impressed scouts during his standout performances in the youth leagues.\n\nSilva's journey from grassroots football to the Premier League is a testament to dedication and talent. Over the past year, he's shown remarkable growth, particularly in his playmaking abilities and tactical awareness.\n\nThis transfer marks a significant milestone not just for Silva, but for our scouting network. It validates our commitment to identifying and nurturing raw talent, providing them with the platform to reach the highest levels of professional football.",
    category: "Transfers",
    imageUrl: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800",
    tags: ["Premier League", "Transfer", "Youth Development"],
    readTime: 5,
    featured: true,
  },
  {
    title: "Five Players Called Up to National Youth Team",
    content: "We're thrilled to announce that five players from our network have received call-ups to their respective national youth teams. This achievement highlights the quality of talent in our database.\n\nThe selected players have demonstrated exceptional skill, discipline, and dedication to their craft. Their call-ups come after impressive performances in domestic competitions.\n\nThese selections underscore our mission to bridge the gap between talented players and professional opportunities. We're proud to play a part in their development journey.",
    category: "Achievements",
    imageUrl: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800",
    tags: ["National Team", "Youth Development", "Achievements"],
    readTime: 4,
    featured: true,
  },
  {
    title: "New Advanced Search Features Now Live",
    content: "We're excited to introduce enhanced search capabilities on our platform. Scouts and clubs can now filter players using advanced criteria including position, age group, competition history, and performance metrics.\n\nThe new features include:\n- Multi-filter search options\n- Competition-based filtering\n- Enhanced player statistics\n- Saved search preferences\n\nThese improvements make it easier than ever to discover players who match specific requirements. Our goal is to streamline the scouting process and help clubs find the perfect fit for their teams.",
    category: "Announcements",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    tags: ["Platform Update", "Features", "Technology"],
    readTime: 3,
    featured: false,
  },
  {
    title: "Top Performers of January 2026",
    content: "As we wrap up January 2026, we're highlighting the standout performers who've caught the attention of scouts across the country.\n\nThis month's top performers include forwards who've shown clinical finishing, midfielders with exceptional vision, and defenders demonstrating leadership beyond their years.\n\nEach player profiled has registered impressive statistics and received positive feedback from coaches and scouts. Their performances make them ones to watch as the season progresses.",
    category: "Achievements",
    imageUrl: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800",
    tags: ["Performance", "Statistics", "Featured Players"],
    readTime: 6,
    featured: false,
  },
  {
    title: "Winter Transfer Window: Key Moves to Watch",
    content: "The winter transfer window is heating up with several exciting developments. Multiple players from our database are in advanced talks with professional clubs.\n\nKey trends we're observing:\n- Increased interest in defensive midfielders\n- Growing demand for versatile attackers\n- Clubs seeking young talent with international experience\n\nWe'll be tracking these developments closely and sharing updates as transfers are finalized. This window could prove pivotal for many promising careers.",
    category: "Transfers",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800",
    tags: ["Transfer Window", "Market Trends", "Analysis"],
    readTime: 7,
    featured: true,
  },
  {
    title: "Platform Reaches 1000 Player Milestone",
    content: "We're proud to announce that our platform now hosts profiles of over 1000 talented players from across the country. This milestone represents years of dedication to identifying and showcasing football talent.\n\nOur database spans multiple age groups, positions, and competition levels. From grassroots leagues to national championships, we're committed to providing visibility to players at every stage of their journey.\n\nThank you to all the players, coaches, scouts, and clubs who've made this achievement possible. Together, we're building the future of football talent discovery.",
    category: "Announcements",
    imageUrl: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800",
    tags: ["Milestone", "Community", "Growth"],
    readTime: 4,
    featured: false,
  },
  {
    title: "Behind the Scenes: How We Scout Talent",
    content: "Ever wondered how we identify promising football talent? In this deep dive, we're pulling back the curtain on our scouting methodology.\n\nOur process combines:\n- On-ground scouting at competitions\n- Video analysis and performance reviews\n- Coach and referee recommendations\n- Statistical analysis and metrics\n- Player interviews and assessments\n\nWe look beyond just technical skills. Character, work ethic, coachability, and mental resilience are equally important factors in our evaluation process.\n\nEach player profile is carefully curated to provide clubs with comprehensive insights, helping them make informed decisions about potential signings.",
    category: "Announcements",
    imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800",
    tags: ["Scouting", "Methodology", "Education"],
    readTime: 8,
    featured: false,
  },
  {
    title: "Record-Breaking Transfer Fee Secured",
    content: "A player from our network has just completed a transfer with a record fee for an under-21 player from our region. While we can't disclose specific details yet, this landmark deal showcases the caliber of talent in our database.\n\nThe player's journey exemplifies what's possible when raw talent meets opportunity. From local leagues to professional contracts, this success story motivates us to continue our mission.\n\nThis transfer also sets a new benchmark for player valuations in the region, potentially opening doors for other talented individuals in our network.",
    category: "Transfers",
    imageUrl: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800",
    tags: ["Transfer Record", "Success Story", "Contract"],
    readTime: 5,
    featured: false,
  },
];

const seedBlogs = async () => {
  try {
    await connectDB();

    // Find admin to use as author
    const admin = await Admin.findOne();
    if (!admin) {
      console.error("❌ No admin found. Please run seedSuperAdmin.js first.");
      process.exit(1);
    }

    // Clear existing blogs
    await Blog.deleteMany({});
    console.log("🗑️  Existing blogs cleared.");

    // Helper function to generate slug from title
    const generateSlug = (title) => {
      return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    };

    // Add admin reference to each blog
    const blogsWithAuthor = sampleBlogs.map(blog => ({
      ...blog,
      slug: generateSlug(blog.title),
      author_id: admin._id,
      author: admin.name,
      status: "PUBLISHED",
      published_at: new Date(),
      image: blog.imageUrl,
      cover_image: blog.imageUrl,
    }));

    // Insert blogs
    const blogs = await Blog.insertMany(blogsWithAuthor);

    console.log(`\n✅ ${blogs.length} blogs seeded successfully!\n`);
    console.log("Blogs created:");
    blogs.forEach((blog, index) => {
      console.log(`  ${index + 1}. ${blog.title} (${blog.category}) - ${blog.readTime} min read`);
    });

    console.log(`\n📊 Summary:`);
    console.log(`   - Featured: ${blogs.filter(b => b.featured).length}`);
    console.log(`   - Transfers: ${blogs.filter(b => b.category === "Transfers").length}`);
    console.log(`   - Achievements: ${blogs.filter(b => b.category === "Achievements").length}`);
    console.log(`   - Announcements: ${blogs.filter(b => b.category === "Announcements").length}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedBlogs();
