const AboutHero = () => {
  return (
    <section className="relative py-16 md:py-20 px-4 overflow-hidden">
      {/* Liquid glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
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
  );
};

export default AboutHero;
