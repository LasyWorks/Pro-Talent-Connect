import { useState, useEffect } from "react";
import { api } from "../services/api";
import AboutHero from "../components/about/AboutHero";
import MissionVision from "../components/about/MissionVision";
import ImpactStats from "../components/about/ImpactStats";
import CoreValues from "../components/about/CoreValues";
import OurStory from "../components/about/OurStory";

const Divider = () => (
  <div className="max-w-5xl mx-auto px-4">
    <div className="relative h-px overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
    </div>
  </div>
);

const About = () => {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await api.getAbout();
        setAboutData(res.data.about || res.data);
      } catch (err) {
        console.error("Error fetching about data:", err);
      }
    };
    fetchAbout();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-black/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gray-900/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      <main>
        <AboutHero orgName={aboutData?.org_name} />
        <Divider />
        <MissionVision mission={aboutData?.mission} />
        <Divider />
        <ImpactStats />
        <Divider />
        <CoreValues credentials={aboutData?.credentials} />
        <Divider />
        <OurStory history={aboutData?.history} images={aboutData?.images} />
      </main>
    </div>
  );
};

export default About;
