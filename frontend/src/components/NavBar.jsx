import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/Logo@pro_talent_connect.png";

const NavBar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("adminToken"));

  // Handle scroll effect for enhanced glass morphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for auth state changes (cross-tab and same-tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "adminToken") {
        setIsLoggedIn(!!e.newValue);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Re-check auth on every route change (same-tab login/logout)
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("adminToken"));
  }, [location]);

  const navLinks = [
    { name: "Home", path: "/", page: "home" },
    { name: "About", path: "/about", page: "about" },
    { name: "Players", path: "/players", page: "players" },
    { name: "Blog", path: "/blog", page: "blog" },
    { name: "Services", path: "/services", page: "services" },
    { name: "Contact", path: "/contact", page: "contact" },
    ...(isLoggedIn
      ? [{ name: "Dashboard", path: "/admin", page: "admin" }]
      : [{ name: "Login", path: "/login", page: "login" }]),
  ];

  const getIsActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname === path;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-black/80 shadow-lg shadow-black/50 border-b border-white/20"
          : "bg-black/40 border-b border-white/10"
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Liquid Glass Effect Border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="flex items-center hover:opacity-80 transition-opacity duration-300"
              aria-label="Pro Talent Connect Home"
            >
              <img
                src={logo}
                alt="Pro Talent Connect"
                className="h-10 sm:h-12 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-2" role="menubar">
              {navLinks.map((link) => {
                const isActive = getIsActive(link.path);

                return (
                  <li key={link.name} role="none">
                    <Link
                      to={link.path}
                      role="menuitem"
                      tabIndex={0}
                      className={`
                        relative px-5 py-2 font-semibold text-base
                        transition-all duration-300 group overflow-hidden rounded-lg
                        ${
                          isActive
                            ? "text-red-500"
                            : "text-white hover:text-red-500"
                        }
                        ${
                          link.name === "Login" || link.name === "Dashboard"
                            ? "ml-4 bg-red-500 hover:bg-red-600 text-white hover:text-white border-none"
                            : ""
                        }
                      `}
                    >
                      {/* Liquid hover effect */}
                      <span className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>

                      {/* Bottom border animation - always show on active, show on hover otherwise */}
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-red-500 transition-transform duration-300 origin-left ${
                          isActive
                            ? "scale-x-100"
                            : "scale-x-0 group-hover:scale-x-100"
                        }`}
                      ></span>

                      <span className="relative z-10">{link.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:text-red-500 hover:bg-white/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              <svg
                className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close Icon */}
              <svg
                className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 border-t border-white/10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`
                block px-4 py-3 rounded-lg text-base font-medium text-white
                hover:text-red-500 hover:bg-white/5 transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500
                ${
                  link.name === "Login" || link.name === "Dashboard"
                    ? "mt-2 bg-red-500/20 border border-red-500/30"
                    : ""
                }
              `}
              onClick={() => setIsMobileMenuOpen(false)}
              role="menuitem"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Animated liquid effect on top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse ${
            isScrolled ? "opacity-100" : "opacity-50"
          }`}
        ></div>
      </div>
    </nav>
  );
};

export default NavBar;
