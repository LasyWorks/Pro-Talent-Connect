import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section
      className="w-full relative overflow-hidden flex items-center"
      style={{
        backgroundColor: "#0B0B0B",
        minHeight: "100vh",
        backgroundImage:
          "url('https://res.cloudinary.com/doakquevf/image/upload/v1770738571/gr3_tghmze.avif')",
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
