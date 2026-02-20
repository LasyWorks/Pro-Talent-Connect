import FloatingShapes from "../components/common/FloatingShapes";
import AboutHero from "../components/about/AboutHero";
import MissionVision from "../components/about/MissionVision";
import ImpactStats from "../components/about/ImpactStats";
import CoreValues from "../components/about/CoreValues";
import OurStory from "../components/about/OurStory";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 text-white relative overflow-hidden">
      {/* Animated Background Liquid Effect */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-black/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-64 h-64 bg-gray-900/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <main>
        <AboutHero />
        
        {/* Divider */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative h-px overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>
        </div>

        <MissionVision />
        
        {/* Divider */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative h-px overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 animate-pulse"></div>
          </div>
        </div>

        <ImpactStats />
        
        {/* Divider */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative h-px overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-pulse"
              style={{ animationDuration: "3s" }}
            ></div>
          </div>
        </div>

        <CoreValues />
        
        {/* Divider */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative h-px overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            <div
              className="absolute inset-0 bg-gradient-to-r from-black/15 via-white/20 to-black/15 animate-pulse"
              style={{ animationDuration: "4s" }}
            ></div>
          </div>
        </div>

        <OurStory />
      </main>
    </div>
  );
};

export default About;
