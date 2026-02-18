import {
  UserGroupIcon,
  GlobeAltIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/outline";
import HeroSection from "./home/HeroSection";
import FeaturedPlayers from "./home/FeaturedPlayers";

const StatsSection = () => {
  const stats = [
    {
      icon: UserGroupIcon,
      value: "1,000+",
      label: "Registered Players",
      color: "text-red-500",
    },
    {
      icon: GlobeAltIcon,
      value: "50+",
      label: "Countries Covered",
      color: "text-red-500",
    },
    {
      icon: BuildingOffice2Icon,
      value: "200+",
      label: "Clubs Worldwide",
      color: "text-red-500",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white/5 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
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

export { HeroSection, StatsSection, FeaturedPlayers };
