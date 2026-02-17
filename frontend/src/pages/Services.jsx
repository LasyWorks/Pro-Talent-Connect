import { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  TrophyIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserPlusIcon,
  CheckBadgeIcon,
  RocketLaunchIcon,
  ArrowRightIcon,
  LifebuoyIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import FloatingShapes from '../components/common/FloatingShapes';
import PageHeader from '../components/common/PageHeader';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

const Services = () => {
  const [services, setServices] = useState([]);
  const [howItWorks, setHowItWorks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Icon mapping
  const iconMap = {
    MagnifyingGlassIcon,
    UserCircleIcon,
    TrophyIcon,
    ShieldCheckIcon,
    ChartBarIcon,
    LifebuoyIcon,
    UserPlusIcon,
    CheckBadgeIcon,
    RocketLaunchIcon,
  };

  // Color mapping
  const colorMap = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    orange: 'bg-orange-500',
  };

  useEffect(() => {
    fetchData();
    // Set up polling for real-time updates every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      
      const [servicesRes, stepsRes] = await Promise.all([
        axios.get(`${apiUrl}/api/services`),
        axios.get(`${apiUrl}/api/how-it-works`)
      ]);

      setServices(servicesRes.data.services || []);
      setHowItWorks(stepsRes.data.steps || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      // Set default data if API fails
      setDefaultData();
    } finally {
      setLoading(false);
    }
  };

  const setDefaultData = () => {
    setServices([
      {
        _id: '1',
        title: 'Player Discovery',
        description: 'Access our comprehensive database of professional football players with detailed profiles, statistics, and performance metrics to find the perfect talent.',
        icon: 'MagnifyingGlassIcon',
        color: 'red',
      },
      {
        _id: '2',
        title: 'Profile Management',
        description: 'Players can create and maintain a flexible platform showcasing their skills, achievements, career history, and highlight reels.',
        icon: 'UserCircleIcon',
        color: 'blue',
      },
      {
        _id: '3',
        title: 'Career Analytics',
        description: 'Track player statistics, performance metrics, and career progression with our advanced analytics and reporting tools.',
        icon: 'ChartBarIcon',
        color: 'green',
      },
      {
        _id: '4',
        title: 'Achievement Tracking',
        description: 'Document and showcase individual awards, team accomplishments, and career milestones in one centralized format.',
        icon: 'TrophyIcon',
        color: 'yellow',
      },
      {
        _id: '5',
        title: 'Verified Profiles',
        description: 'All player profiles are verified to ensure the accuracy and authenticity of information for peace of mind in scouting.',
        icon: 'ShieldCheckIcon',
        color: 'purple',
      },
      {
        _id: '6',
        title: 'Dedicated Support',
        description: 'Our team provides excellent support to players, scouts, and clubs to ensure the best experience on the platform.',
        icon: 'LifebuoyIcon',
        color: 'pink',
      },
    ]);

    setHowItWorks([
      {
        _id: '1',
        stepNumber: 1,
        title: 'Create Profile',
        description: 'Players submit their information, career history, and highlight reel through our user-friendly profile creation form.',
        icon: 'UserPlusIcon',
        color: 'red',
      },
      {
        _id: '2',
        stepNumber: 2,
        title: 'Verification',
        description: 'Our team reviews and verifies all submitted information to ensure accuracy and authenticity.',
        icon: 'CheckBadgeIcon',
        color: 'blue',
      },
      {
        _id: '3',
        stepNumber: 3,
        title: 'Get Discovered',
        description: 'Profiles are live in our database, making it easier for clubs and scouts to discover opportunities worldwide.',
        icon: 'MagnifyingGlassIcon',
        color: 'green',
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <FloatingShapes />

      {/* Hero Section */}
      <PageHeader
        badge="What We Offer"
        title={<>Our <span className="text-red-500">Services</span></>}
        subtitle="Comprehensive solutions for connecting football talent with opportunities worldwide"
      />

      {/* Services Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white/5 rounded-3xl p-8 animate-pulse">
                  <div className="w-16 h-16 bg-gray-700 rounded-2xl mb-6"></div>
                  <div className="h-6 bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const Icon = iconMap[service.icon] || iconMap[service.customIcon] || MagnifyingGlassIcon;
                const bgColor = colorMap[service.color] || colorMap.red;
                
                return (
                  <ServiceCard
                    key={service._id}
                    icon={Icon}
                    title={service.title}
                    description={service.description}
                    bgColor={bgColor}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="text-red-500">Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands of professional players showcasing their talent on our platform
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 rounded-3xl p-8 animate-pulse">
                  <div className="w-20 h-20 bg-gray-700 rounded-full mb-6 mx-auto"></div>
                  <div className="h-6 bg-gray-700 rounded mb-4"></div>
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting lines for desktop */}
              <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-red-500/20 via-red-500/50 to-red-500/20 -z-10"></div>
              
              {howItWorks.map((step) => {
                const Icon = iconMap[step.icon] || iconMap[step.customIcon] || UserPlusIcon;
                const bgColor = colorMap[step.color] || colorMap.red;
                
                return (
                  <HowItWorksCard
                    key={step._id}
                    stepNumber={step.stepNumber}
                    icon={Icon}
                    title={step.title}
                    description={step.description}
                    bgColor={bgColor}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// Service Card Component
const ServiceCard = ({ icon: Icon, title, description, bgColor }) => {
  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-2">
      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-16 h-16 ${bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        <Icon className="w-8 h-8 text-white" />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold mb-4 group-hover:text-red-500 transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>

      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  );
};

// How It Works Card Component
const HowItWorksCard = ({ stepNumber, icon: Icon, title, description, bgColor }) => {
  return (
    <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20 hover:-translate-y-2">
      {/* Step number badge */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2">
        <div className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-4 border-gray-900`}>
          {stepNumber}
        </div>
      </div>

      {/* Icon */}
      <div className={`inline-flex items-center justify-center w-20 h-20 ${bgColor}/20 border-2 border-current rounded-full mb-6 mt-4 group-hover:scale-110 transition-transform duration-300`}
        style={{ color: bgColor.replace('bg-', '') }}>
        <Icon className="w-10 h-10" style={{ color: bgColor.replace('bg-', 'rgb(var(--color-') + '))' }} />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold mb-4 group-hover:text-red-500 transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default Services;
