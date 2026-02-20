import { useState, useEffect } from "react";

const ImpactStats = () => {
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

  return (
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
      <div className="max-w-5xl mx-auto text-center">
        <h2
          className="text-4xl font-semibold mb-4"
          style={{ fontSize: "clamp(28px, 4vw, 32px)" }}
        >
          Our Impact in <span className="text-[#FF3B3B]">Numbers</span>
        </h2>
        <p
          className="text-lg mb-16 max-w-xl mx-auto"
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
  );
};

export default ImpactStats;
