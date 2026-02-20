import { useState, useEffect } from "react";
import {
  TrophyIcon,
  MegaphoneIcon,
  UserGroupIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { api } from "../services/api";
import BlogCard from "../components/blogs/Blogcard";
import FloatingShapes from "../components/common/FloatingShapes";
import PageHeader from "../components/common/PageHeader";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import EmptyState from "../components/common/EmptyState";
import ErrorState from "../components/common/ErrorState";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [error, setError] = useState(null);

  const categories = [
    { name: "All", icon: SparklesIcon },
    { name: "Transfers", icon: UserGroupIcon },
    { name: "Achievements", icon: TrophyIcon },
    { name: "Announcements", icon: MegaphoneIcon },
  ];

  useEffect(() => {
    fetchBlogs();
  }, [activeFilter]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await api.getBlogs();

      let blogsList = response.data.blogs || response.data || [];

      // Filter by category if not "All"
      if (activeFilter !== "All") {
        blogsList = blogsList.filter((blog) => blog.category === activeFilter);
      }

      setBlogs(blogsList);
      setError(null);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError(err.message);
      // Set mock data for demonstration
      setMockData();
    } finally {
      setLoading(false);
    }
  };

  const setMockData = () => {
    const mockBlogs = [
      {
        _id: "1",
        title: "Marcus Silva Signs with Premier League Club",
        content:
          "Rising star Marcus Silva has accepted a high opportunity with a major Premier League club. His thrilling performances have attracted scouts...",
        category: "Transfers",
        author: { name: "Luke Davis" },
        createdAt: new Date("2025-01-10"),
        image:
          "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800",
        readTime: 5,
      },
      {
        _id: "2",
        title: "Five Players Called Up to National Youth Team",
        content:
          "We are proud to announce that five of our registered players have been called up to the U-21 National Youth Team...",
        category: "Achievements",
        author: { name: "Sarah Mitchell" },
        createdAt: new Date("2025-01-05"),
        image:
          "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800",
        readTime: 4,
      },
      {
        _id: "3",
        title: "New Advanced Search Features Now Live",
        content:
          "Discover talent easier with new scoping advanced search and filter capabilities, including talent identification system...",
        category: "Announcements",
        author: { name: "Tech Team" },
        createdAt: new Date("2024-12-28"),
        image:
          "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800",
        readTime: 3,
      },
      {
        _id: "4",
        title: "Top Performers of December 2025",
        content:
          "Celebrating outstanding student-players who showcased their talent through the final week of year...",
        category: "Achievements",
        author: { name: "Editorial Team" },
        createdAt: new Date("2025-01-03"),
        image:
          "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
        readTime: 6,
      },
      {
        _id: "5",
        title: "Winter Transfer Window: Key Moves to Watch",
        content:
          "An overview of the most anticipated player movements and key opportunities in the winter transfer...",
        category: "Transfers",
        author: { name: "Michael Roberts" },
        createdAt: new Date("2024-12-20"),
        image:
          "https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=800",
        readTime: 7,
      },
      {
        _id: "6",
        title: "Platform Reaches 1000 Player Milestone",
        content:
          "We are thrilled to announce that our database now includes over 1,000 professional football players",
        category: "Announcements",
        author: { name: "Admin Team" },
        createdAt: new Date("2024-12-22"),
        image:
          "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800",
        readTime: 4,
      },
    ];
    setBlogs(mockBlogs);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950">
      <FloatingShapes />

      <PageHeader
        badge="Latest Updates"
        title={
          <>
            Blog & <span className="text-red-500">News</span>
          </>
        }
        subtitle="Stay updated with the latest transfers, player achievements, and platform announcements"
      />

      {/* Filter Tabs */}
      <section className="relative pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = activeFilter === category.name;

              return (
                <button
                  key={category.name}
                  onClick={() => setActiveFilter(category.name)}
                  className={`
                    group relative px-6 py-3 rounded-xl font-semibold text-base
                    transition-all duration-300 transform hover:scale-105
                    ${
                      isActive
                        ? "bg-red-500 text-white shadow-lg shadow-red-500/50"
                        : "bg-white/10 backdrop-blur-sm text-gray-300 hover:bg-white/20 hover:text-white border border-white/10"
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span>{category.name}</span>
                  </span>

                  {/* Active underline */}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white rounded-full"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="relative py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <LoadingSkeleton count={6} type="card" />
          ) : error && blogs.length === 0 ? (
            <ErrorState
              icon={MegaphoneIcon}
              title="No Articles Found"
              message="We couldn't load the blog articles. Please try again later."
              onRetry={fetchBlogs}
            />
          ) : blogs.length === 0 ? (
            <EmptyState
              icon={SparklesIcon}
              title="No Articles Yet"
              message="Check back soon for exciting news and updates!"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
