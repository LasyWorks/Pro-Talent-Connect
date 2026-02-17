import { useState, useEffect } from 'react';
import logo from '../assets/Logo@pro_talent_connect.png';

const NavBar = ({ currentPage = 'home' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect for enhanced glass morphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', page: 'home' },
    { name: 'About', href: '#about', page: 'about' },
    { name: 'Players', href: '#players', page: 'players' },
    { name: 'Blog', href: '#blog', page: 'blog' },
    { name: 'Services', href: '#services', page: 'services' },
    { name: 'Contact', href: '#contact', page: 'contact' },
    { name: 'Login', href: '#login', page: 'login' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-2xl shadow-lg shadow-black/50 border-b border-white/20'
          : 'bg-black/40 backdrop-blur-xl border-b border-white/10'
      }`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* Liquid Glass Effect Border */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <a
              href="#home"
              className="flex items-center hover:opacity-80 transition-opacity duration-300"
              aria-label="Pro Talent Connect Home"
            >
              <img src={logo} alt="Pro Talent Connect" className="h-10 sm:h-12 w-auto" />
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-2" role="menubar">
              {navLinks.map((link) => {
                const isActive = currentPage === link.page;
                
                return (
                  <li key={link.name} role="none">
                    <a
                      href={link.href}
                      role="menuitem"
                      tabIndex={0}
                      className={`
                        relative px-5 py-2 font-semibold text-base
                        transition-all duration-300 group overflow-hidden rounded-lg
                        ${isActive 
                          ? 'text-red-500' 
                          : 'text-white hover:text-red-500'
                        }
                        ${
                          link.name === 'Login'
                            ? 'ml-4 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 hover:border-red-500/50'
                            : ''
                        }
                      `}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          window.location.href = link.href;
                        }
                      }}
                    >
                      {/* Liquid hover effect */}
                      <span className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                      
                      {/* Bottom border animation - always show on active, show on hover otherwise */}
                      <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-red-500 transition-transform duration-300 origin-left ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}></span>
                      
                      <span className="relative z-10">{link.name}</span>
                    </a>
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
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
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
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
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
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-black/60 backdrop-blur-xl border-t border-white/10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`
                block px-4 py-3 rounded-lg text-base font-medium text-white
                hover:text-red-500 hover:bg-white/5 transition-all duration-300
                focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500
                ${
                  link.name === 'Login'
                    ? 'mt-2 bg-red-500/20 border border-red-500/30'
                    : ''
                }
              `}
              onClick={() => setIsMobileMenuOpen(false)}
              role="menuitem"
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>

      {/* Animated liquid effect on top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse ${
            isScrolled ? 'opacity-100' : 'opacity-50'
          }`}
        ></div>
      </div>
    </nav>
  );
};

export default NavBar;
