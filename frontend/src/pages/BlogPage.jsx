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
      setBlogs([]);
    } finally {
      setLoading(false);
    }
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
