import { RocketLaunchIcon, EyeIcon } from "@heroicons/react/24/outline";

const MissionVision = () => {
  return (
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
      <div className="max-w-5xl mx-auto">
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
  );
};

export default MissionVision;
