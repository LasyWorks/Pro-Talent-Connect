import { useState } from 'react';
import { UserGroupIcon, GlobeAltIcon, BuildingOffice2Icon } from '@heroicons/react/24/outline';

const HeroSection = () => {
  const [searchEmail, setSearchEmail] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const positions = ['All', 'Forward', 'Midfielder', 'Defender', 'Goalkeeper'];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchEmail);
    // TODO: Implement search functionality
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Discover. Analyze. Connect<br />
          with Professional <span className="text-red-500">Football</span><br />
          Talent.
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Your comprehensive database of professional football players worldwide
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-6">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="flex-1 px-6 py-4 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/50"
            >
              Search
            </button>
          </div>
        </form>

        {/* Position Filters */}
        <div className="flex flex-wrap justify-center gap-3">
          {positions.map((position) => (
            <button
              key={position}
              onClick={() => setActiveFilter(position)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === position
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                  : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              {position}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  const stats = [
    {
      icon: UserGroupIcon,
      value: '1,000+',
      label: 'Registered Players',
      color: 'text-red-500',
    },
    {
      icon: GlobeAltIcon,
      value: '50+',
      label: 'Countries Covered',
      color: 'text-red-500',
    },
    {
      icon: BuildingOffice2Icon,
      value: '200+',
      label: 'Clubs Worldwide',
      color: 'text-red-500',
    },
  ];

  return (
    <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-4 group-hover:bg-red-500/20 transition-all duration-300">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}
              </h3>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-20 px-4 bg-black/40 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          Ready to Discover Top Talent?
        </h2>
        <p className="text-gray-300 text-lg mb-8">
          Browse our comprehensive database of professional football players
        </p>
        <a
          href="#players"
          className="inline-block px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/50"
        >
          Explore Player Database
        </a>
      </div>
    </section>
  );
};

export { HeroSection, StatsSection, CTASection };
