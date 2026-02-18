import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section
      className="w-full relative overflow-hidden flex items-center"
      style={{
        backgroundColor: "#0B0B0B",
        minHeight: "100vh",
        backgroundImage:
          "url('data:image/jpeg;base64,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')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      aria-label="Hero section"
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-24 lg:py-32 relative z-10 flex flex-col items-center text-center w-full">
        <div className="max-w-[720px]">
          <h1
            className="m-0 text-white"
            style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            Discover. Analyze. Connect with Professional{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #C4161C 0%, #FF4655 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                position: "relative",
              }}
            >
              Football Talent
            </span>
          </h1>
          <br />
          <p
            className="mt-12 text-white/60"
            style={{
              fontSize: "clamp(16px, 2vw, 18px)",
              lineHeight: 1.6,
              maxWidth: "560px",
              margin: "0 auto",
            }}
          >
            Access a structured database of verified professional football
            players. Filter by position, location, and experience to find the
            right talent.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/contact"
              className="px-8 py-3 rounded-lg text-white font-semibold transition-all hover:opacity-90 hover:shadow-lg hover:shadow-red-500/50 transform hover:scale-105"
              style={{
                backgroundColor: "#C4161C",
                fontSize: "16px",
              }}
            >
              Contact Us
            </Link>
            <Link
              to="/blog"
              className="px-8 py-3 rounded-lg text-white font-semibold border-2 transition-all hover:bg-white/10"
              style={{
                borderColor: "#C4161C",
                fontSize: "16px",
              }}
            >
              View Blogs
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
