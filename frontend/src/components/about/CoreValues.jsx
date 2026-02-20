import {
  SparklesIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";

const CoreValues = () => {
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
      <div className="max-w-5xl mx-auto">
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
  );
};

export default CoreValues;
