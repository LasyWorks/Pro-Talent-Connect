import { CalendarIcon, UserIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const BlogCard = ({ blog }) => {
  const getCategoryColor = (category) => {
    const colors = {
      Transfers: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      Achievements: 'bg-green-500/20 text-green-400 border-green-500/40',
      Announcements: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/40';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <article className="group bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10 hover:border-red-500/50 shadow-lg hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-500 transform hover:-translate-y-2">
      {/* Image with gradient overlay */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={blog.image || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800'}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Floating category badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-md border ${getCategoryColor(blog.category)}`}>
            {blog.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Meta info */}
        <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            {formatDate(blog.createdAt)}
          </span>
          {blog.readTime && (
            <span className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              {blog.readTime} min
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-red-500 transition-colors duration-300">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed">
          {blog.content || blog.excerpt}
        </p>

        {/* Author info */}
        {blog.author && (
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <UserIcon className="w-4 h-4" />
            <span>{typeof blog.author === 'string' ? blog.author : (blog.author.name || 'Admin')}</span>
          </div>
        )}

        {/* Read more link */}
        <a
          href={`#blog/${blog._id}`}
          className="inline-flex items-center gap-2 text-red-500 font-semibold group/link hover:text-red-400"
        >
          Read More
          <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
        </a>
      </div>
    </article>
  );
};

export default BlogCard;
