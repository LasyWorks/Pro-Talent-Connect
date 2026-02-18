import { useState, useEffect } from "react";
import {
  SparklesIcon,
  EyeIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  TrophyIcon,
  HeartIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const About = () => {
  const [counts, setCounts] = useState({
    players: 0,
    countries: 0,
    clubs: 0,
    connections: 0,
  });

  // Animated counter effect
  useEffect(() => {
    const duration = 2000;
    const targets = {
      players: 1000,
      countries: 50,
      clubs: 200,
      connections: 5000,
    };
    const steps = 60;
    const increment = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setCounts({
        players: Math.floor(targets.players * progress),
        countries: Math.floor(targets.countries * progress),
        clubs: Math.floor(targets.clubs * progress),
        connections: Math.floor(targets.connections * progress),
      });

      if (currentStep >= steps) {
        setCounts(targets);
        clearInterval(timer);
      }
    }, increment);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    {
      number: `${counts.players.toLocaleString()}+`,
      label: "Registered Players",
    },
    { number: `${counts.countries}+`, label: "Countries" },
    { number: `${counts.clubs}+`, label: "Club Partnerships" },
    {
      number: `${counts.connections.toLocaleString()}+`,
      label: "Connections Made",
    },
  ];

  const coreValues = [
    {
      icon: SparklesIcon,
      title: "Excellence",
      description:
        "We strive for excellence in connecting talented players with top-tier opportunities.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Transparency",
      description:
        "Clear, honest, and ethical operations in all of our dealings with players and clubs.",
    },
    {
      icon: UserGroupIcon,
      title: "Community",
      description:
        "Building a global community of football enthusiasts and professionals.",
    },
    {
      icon: TrophyIcon,
      title: "Quality",
      description:
        "Maintaining high standards and profiles that stand out in the market.",
    },
  ];

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

      {/* Hero Section - Reduced height by 20% with liquid glass */}
      <section className="relative py-16 md:py-20 px-4 overflow-hidden">
        {/* Liquid glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge with liquid glass */}
          <span className="inline-block px-4 py-1.5 text-sm font-medium text-white/80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-6 relative overflow-hidden group">
            {/* Glass shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
            <span className="relative z-10">Our Story</span>
          </span>

          {/* H1 - Increased size: 56px desktop, 36px mobile */}
          <h1
            className="font-bold mb-6 leading-tight"
            style={{ fontSize: "clamp(36px, 5vw, 56px)" }}
          >
            About{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#FF3B3B]">Us</span>
              {/* Subtle red gradient glow */}
              <span className="absolute inset-0 blur-2xl bg-[#FF3B3B]/30 -z-10"></span>
            </span>
          </h1>

          {/* Subtitle - Limited width to 720px, 18px font size */}
          <p
            className="text-lg leading-relaxed mx-auto"
            style={{
              maxWidth: "720px",
              color: "#B3B3B3",
              fontSize: "18px",
              lineHeight: "1.7",
            }}
          >
            We are dedicated to connecting professional football players with
            opportunities worldwide through our comprehensive database platform.
          </p>
        </div>
      </section>

      {/* Divider with animated liquid effect */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative h-px overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>

      {/* Mission & Vision - Equal height glass cards, 100px desktop / 64px mobile padding */}
      <section className="relative py-16 md:py-24 lg:py-28 px-4">
        {/* Floating liquid particles in section background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-32 h-32 bg-black/10 rounded-full blur-2xl animate-pulse"
            style={{ animationDuration: "4s" }}
          ></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-white/8 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "6s", animationDelay: "2s" }}
          ></div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="group relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-8 hover:bg-white/8 transition-all duration-300 hover:border-white/30 hover:shadow-2xl hover:shadow-black/20 hover:scale-[1.03] focus-within:outline-2 focus-within:outline-white/40 overflow-hidden">
              {/* Liquid glass shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-black/30 rounded-xl shadow-lg shadow-black/50">
                  <RocketLaunchIcon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-semibold">Our Mission</h2>
              </div>

              <div className="space-y-4" style={{ maxWidth: "720px" }}>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "#B3B3B3" }}
                >
                  Our mission is to create a transparent, accessible platform
                  where professional football players can showcase their talents
                  and connect with scouts, clubs, and opportunities worldwide.
                </p>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "#B3B3B3" }}
                >
                  We believe every talented player deserves visibility and the
                  chance to advance their career, regardless of their location
                  or access to traditional networks.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="group relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-8 hover:bg-white/8 transition-all duration-300 hover:border-white/30 hover:shadow-2xl hover:shadow-black/20 hover:scale-[1.03] focus-within:outline-2 focus-within:outline-white/40 overflow-hidden">
              {/* Liquid glass shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-black/30 rounded-xl shadow-lg shadow-black/50">
                  <EyeIcon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-3xl font-semibold">Our Vision</h2>
              </div>

              <div className="space-y-4" style={{ maxWidth: "720px" }}>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "#B3B3B3" }}
                >
                  To become the world's leading platform for football player
                  discovery, fostering connections between talented players,
                  scouts, and clubs worldwide.
                </p>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "#B3B3B3" }}
                >
                  We envision a future where talent is discovered solely based
                  on merit and ability, with our platform serving as the bridge
                  that makes this a reality for organizations globally.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider with animated liquid effect */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative h-px overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 animate-pulse"></div>
        </div>
      </div>

      {/* Impact Stats - Center aligned, larger typography (64px) */}
      <section className="relative py-16 md:py-24 lg:py-28 px-4">
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-20 left-20 w-48 h-48 bg-black/15 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "5s" }}
          ></div>
          <div
            className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "7s", animationDelay: "1s" }}
          ></div>
        </div>
        <div className="max-w-7xl mx-auto text-center">
          <h2
            className="text-4xl font-semibold mb-4"
            style={{ fontSize: "clamp(28px, 4vw, 32px)" }}
          >
            Our Impact in <span className="text-[#FF3B3B]">Numbers</span>
          </h2>
          <p
            className="text-lg mb-16 max-w-3xl mx-auto"
            style={{ color: "#B3B3B3" }}
          >
            Trusted by thousands of players and clubs worldwide
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-8 hover:bg-white/8 transition-all duration-300 hover:scale-[1.03] hover:border-white/30 hover:shadow-2xl hover:shadow-black/20 overflow-hidden"
              >
                {/* Liquid glass effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none"></div>

                {/* Large numeric typography - 64px desktop */}
                <div
                  className="font-bold mb-3 text-[#FF3B3B] transition-transform duration-300"
                  style={{
                    fontSize: "clamp(40px, 6vw, 64px)",
                    lineHeight: "1",
                  }}
                >
                  {stat.number}
                </div>
                <div
                  className="font-medium"
                  style={{ fontSize: "16px", color: "#B3B3B3" }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider with animated liquid effect */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative h-px overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-pulse"
            style={{ animationDuration: "3s" }}
          ></div>
        </div>
      </div>

      {/* Core Values - 4 column grid desktop, improved spacing */}
      <section className="relative py-16 md:py-24 lg:py-28 px-4">
        {/* Floating liquid orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/3 right-1/4 w-64 h-64 bg-white/8 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "8s" }}
          ></div>
          <div
            className="absolute bottom-1/3 left-1/4 w-56 h-56 bg-black/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "6s", animationDelay: "3s" }}
          ></div>
        </div>
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-4xl font-semibold text-center mb-16"
            style={{ fontSize: "clamp(28px, 4vw, 32px)" }}
          >
            Our Core <span className="text-[#FF3B3B]">Values</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6 text-center hover:bg-white/8 transition-all duration-300 hover:border-white/30 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-2 hover:scale-[1.03] focus-within:outline-2 focus-within:outline-white/40 overflow-hidden"
                >
                  {/* Liquid glass shine */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-black/20 border-2 border-white/20 rounded-xl mb-5 group-hover:bg-black/40 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-8 h-8 text-white/80 group-hover:text-white transition-colors duration-300" />
                  </div>

                  {/* Title - H3: 22px */}
                  <h3
                    className="text-xl font-medium mb-3 group-hover:text-white transition-colors duration-300"
                    style={{ fontSize: "22px" }}
                  >
                    {value.title}
                  </h3>

                  {/* Description - 14px muted */}
                  <p
                    className="leading-relaxed"
                    style={{ fontSize: "14px", color: "#B3B3B3" }}
                  >
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider with animated liquid effect */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative h-px overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/15 via-white/20 to-black/15 animate-pulse"
            style={{ animationDuration: "4s" }}
          ></div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>

      {/* Our Story - Split layout: text left, image right */}
      <section className="relative py-16 md:py-24 lg:py-28 px-4">
        {/* Background liquid effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black/10 via-transparent to-white/8 opacity-30"></div>
          <div
            className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "10s" }}
          ></div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content - Left */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-black/20 border border-white/30 rounded-lg">
                  <HeartIcon className="w-6 h-6 text-white/80" />
                </div>
                <h2
                  className="text-3xl font-semibold"
                  style={{ fontSize: "clamp(28px, 4vw, 32px)" }}
                >
                  Our Story
                </h2>
              </div>

              <div className="space-y-5" style={{ maxWidth: "720px" }}>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: "#B3B3B3" }}
                >
                  <span className="text-[#FF3B3B] font-semibold">
                    Started in 2023
                  </span>
                  , Pro Talent Connect was born from a simple observation: many
                  talented players lacked the visibility and connections needed
                  to advance their careers. Traditional scouting methods were
                  limited by geographic and network constraints, leaving
                  countless players undiscovered.
                </p>

                <p
                  className="text-base leading-relaxed"
                  style={{ color: "#B3B3B3" }}
                >
                  We set out to{" "}
                  <span className="text-white font-semibold">
                    revolutionize player discovery
                  </span>{" "}
                  by creating a comprehensive, accessible database where players
                  showcase their skills and connect with scouts, clubs, and
                  opportunities. Today, we serve over 1,000 professional players
                  across 50+ countries, connecting them to more than 200
                  partnering clubs.
                </p>

                <p
                  className="text-base leading-relaxed"
                  style={{ color: "#B3B3B3" }}
                >
                  Our platform combines{" "}
                  <span className="text-white font-semibold">
                    detailed player profiles
                  </span>
                  , verified credentials, career statistics, and highlights to
                  allow scouts and clubs to discover talent based on skill,
                  statistics, and potential—rather than just connections or
                  geography.
                </p>

                <p className="text-white font-semibold text-lg pt-2">
                  Together, we're building the future of football talent
                  discovery—one player at a time.
                </p>
              </div>
            </div>

            {/* Abstract Football Image - Right */}
            <div className="relative">
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-8 hover:border-white/30 transition-all duration-300 overflow-hidden group">
                {/* Animated liquid glass effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/8 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/5 to-transparent animate-pulse pointer-events-none"></div>

                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-black/20 rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-tr-full"></div>

                {/* Image placeholder - using subtle football pattern */}
                <div className="relative z-10 aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop"
                    alt="Football action"
                    className="w-full h-full object-cover opacity-40 hover:opacity-60 transition-opacity duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
