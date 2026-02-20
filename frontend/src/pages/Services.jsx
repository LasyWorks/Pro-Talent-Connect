import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  UserCircleIcon,
  TrophyIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserPlusIcon,
  CheckBadgeIcon,
  RocketLaunchIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/outline";
import { api } from "../services/api";
import FloatingShapes from "../components/common/FloatingShapes";
import PageHeader from "../components/common/PageHeader";
import ServiceCard from "../components/services/ServiceCard";
import HowItWorksCard from "../components/services/HowItWorksCard";
import CardSkeleton from "../components/skeletons/CardSkeleton";

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
    red: "bg-red-500",
    blue: "bg-blue-500",
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    purple: "bg-purple-500",
    pink: "bg-pink-500",
    orange: "bg-orange-500",
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, stepsRes] = await Promise.all([
        api.getServices(),
        api.getHowItWorks(),
      ]);

      setServices(servicesRes.data.services || []);
      setHowItWorks(stepsRes.data.steps || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      // Set default data if API fails
      setDefaultData();
    } finally {
 setLoading(false);
    }
  };

  const setDefaultData = () => {
    setServices([
      {
        _id: "1",
        title: "Player Discovery",
        description:
          "Access our comprehensive database of professional football players with detailed profiles, statistics, and performance metrics to find the perfect talent.",
        icon: "MagnifyingGlassIcon",
        color: "red",
      },
      {
        _id: "2",
        title: "Profile Management",
        description:
          "Players can create and maintain a flexible platform showcasing their skills, achievements, career history, and highlight reels.",
        icon: "UserCircleIcon",
        color: "blue",
      },
      {
        _id: "3",
        title: "Career Analytics",
        description:
          "Track player statistics, performance metrics, and career progression with our advanced analytics and reporting tools.",
        icon: "ChartBarIcon",
        color: "green",
      },
      {
        _id: "4",
        title: "Achievement Tracking",
        description:
          "Document and showcase individual awards, team accomplishments, and career milestones in one centralized format.",
        icon: "TrophyIcon",
        color: "yellow",
      },
      {
        _id: "5",
        title: "Verified Profiles",
        description:
          "All player profiles are verified to ensure the accuracy and authenticity of information for peace of mind in scouting.",
        icon: "ShieldCheckIcon",
        color: "purple",
      },
      {
        _id: "6",
        title: "Dedicated Support",
        description:
          "Our team provides excellent support to players, scouts, and clubs to ensure the best experience on the platform.",
        icon: "LifebuoyIcon",
        color: "pink",
      },
    ]);

    setHowItWorks([
      {
        _id: "1",
        stepNumber: 1,
        title: "Create Profile",
        description:
          "Players submit their information, career history, and highlight reel through our user-friendly profile creation form.",
        icon: "UserPlusIcon",
        color: "red",
      },
      {
        _id: "2",
        stepNumber: 2,
        title: "Verification",
        description:
          "Our team reviews and verifies all submitted information to ensure accuracy and authenticity.",
        icon: "CheckBadgeIcon",
        color: "blue",
      },
      {
        _id: "3",
        stepNumber: 3,
        title: "Get Discovered",
        description:
          "Profiles are live in our database, making it easier for clubs and scouts to discover opportunities worldwide.",
        icon: "MagnifyingGlassIcon",
        color: "green",
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 text-white">
      <FloatingShapes />

      {/* Hero Section */}
      <PageHeader
        badge="What We Offer"
        title={
          <>
            Our <span className="text-red-500">Services</span>
          </>
        }
        subtitle="Comprehensive solutions for connecting football talent with opportunities worldwide"
      />

      {/* Services Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const Icon =
                  iconMap[service.icon] ||
                  iconMap[service.customIcon] ||
                  MagnifyingGlassIcon;
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
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It <span className="text-red-500">Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-xl mx-auto">
              Join thousands of professional players showcasing their talent on
              our platform
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connecting lines for desktop */}
              <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-red-500/20 via-red-500/50 to-red-500/20 -z-10"></div>

              {howItWorks.map((step) => {
                const Icon =
                  iconMap[step.icon] ||
                  iconMap[step.customIcon] ||
                  UserPlusIcon;
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

export default Services;
